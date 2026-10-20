import { ConvexError, v } from "convex/values";
import { paginationOptsValidator } from "convex/server";
import { mutation, query, type MutationCtx } from "./_generated/server";
import type { Doc, Id } from "./_generated/dataModel";
import { internal } from "./_generated/api";
import { requireIdentity, requireOwnedPresentation } from "./lib/auth";
import { deriveTitle, getPromptContext } from "./lib/mockGeneration";
import { FIRST_STAGE_DELAY, getIntroParts } from "./generation";
import { DEFAULT_FOLDER_NAME, getOrCreateDefaultFolder } from "./lib/folders";

const MAX_PROMPT_LENGTH = 20_000;
const MAX_MESSAGES = 500;
const MAX_SLIDES = 200;
const MAX_FOLDERS = 50;
const MAX_SIDEBAR_PRESENTATIONS = 100;

/** Starts a new presentation from the user's first prompt and kicks off the first pass. */
export const create = mutation({
  args: {
    prompt: v.string(),
    model: v.string(),
    files: v.optional(v.array(v.string())),
  },
  handler: async (ctx, args) => {
    const identity = await requireIdentity(ctx);
    const prompt = args.prompt.trim();
    if (!prompt) throw new ConvexError("Prompt is empty");
    if (prompt.length > MAX_PROMPT_LENGTH) throw new ConvexError("Prompt is too long");

    const title = deriveTitle(prompt);
    const now = Date.now();
    const folderId = await getOrCreateDefaultFolder(ctx, identity.tokenIdentifier);
    const presentationId = await ctx.db.insert("presentations", {
      ownerId: identity.tokenIdentifier,
      folderId,
      title,
      prompt,
      model: args.model,
      status: "generating",
      generationStage: 0,
      updatedAt: now,
    });

    await ctx.db.insert("messages", {
      presentationId,
      role: "user",
      kind: "prompt",
      parts: [{ type: "text", text: prompt }],
      status: "complete",
      files: args.files && args.files.length > 0 ? args.files : undefined,
      model: args.model,
    });
    await ctx.db.insert("messages", {
      presentationId,
      role: "assistant",
      kind: "generation",
      parts: getIntroParts(getPromptContext(prompt, title)),
      status: "pending",
    });

    await ctx.scheduler.runAfter(FIRST_STAGE_DELAY, internal.generation.advance, {
      presentationId,
      stage: 1,
    });
    return presentationId;
  },
});

/**
 * Everything the workspace page renders for one presentation. Returns null when
 * the id is not a presentation the caller owns, so the page can show not-found.
 */
export const get = query({
  args: { id: v.string() },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return null;
    const presentationId = ctx.db.normalizeId("presentations", args.id);
    if (!presentationId) return null;
    const presentation = await ctx.db.get("presentations", presentationId);
    if (!presentation || presentation.ownerId !== identity.tokenIdentifier) return null;

    const messages = await ctx.db
      .query("messages")
      .withIndex("by_presentationId", (q) => q.eq("presentationId", presentationId))
      .take(MAX_MESSAGES);
    const outline = await ctx.db
      .query("outlineSlides")
      .withIndex("by_presentationId_and_position", (q) => q.eq("presentationId", presentationId))
      .take(MAX_SLIDES);
    const slides = await ctx.db
      .query("presentationSlides")
      .withIndex("by_presentationId_and_position", (q) => q.eq("presentationId", presentationId))
      .take(MAX_SLIDES);

    return { presentation, messages, outline, slides };
  },
});

/**
 * Confirms the outline and generates the slides from it. The slides are a copy,
 * so later slide edits never change the outline.
 */
export const markPresentationReady = mutation({
  args: { presentationId: v.id("presentations") },
  handler: async (ctx, args) => {
    const presentation = await requireOwnedPresentation(ctx, args.presentationId);
    if (presentation.status === "generating") {
      throw new ConvexError("The outline is still being drafted");
    }

    // Regenerating replaces any slides from a previous run.
    const existing = await ctx.db
      .query("presentationSlides")
      .withIndex("by_presentationId_and_position", (q) => q.eq("presentationId", presentation._id))
      .take(MAX_SLIDES);
    for (const slide of existing) {
      await ctx.db.delete("presentationSlides", slide._id);
    }
    const outline = await ctx.db
      .query("outlineSlides")
      .withIndex("by_presentationId_and_position", (q) => q.eq("presentationId", presentation._id))
      .take(MAX_SLIDES);
    for (const [position, item] of outline.entries()) {
      await ctx.db.insert("presentationSlides", {
        presentationId: presentation._id,
        position,
        title: item.title,
        templateSlide: position + 1,
      });
    }

    await ctx.db.patch("presentations", presentation._id, {
      status: "presentation_ready",
      updatedAt: Date.now(),
    });
    return null;
  },
});

/** The library grid: the caller's presentations, most recently updated first. */
export const list = query({
  args: { paginationOpts: paginationOptsValidator },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return { page: [], isDone: true, continueCursor: "" };
    const result = await ctx.db
      .query("presentations")
      .withIndex("by_ownerId_and_updatedAt", (q) => q.eq("ownerId", identity.tokenIdentifier))
      .order("desc")
      .paginate(args.paginationOpts);
    return {
      ...result,
      page: result.page.map((p) => ({
        _id: p._id,
        title: p.title,
        status: p.status,
        updatedAt: p.updatedAt,
      })),
    };
  },
});

type FolderGroup = {
  id: Id<"folders"> | null;
  name: string;
  presentations: Array<Pick<Doc<"presentations">, "_id" | "title" | "status">>;
};

/** The sidebar tree: the caller's folders, each with its most recent presentations. */
export const listByFolder = query({
  args: {},
  handler: async (ctx): Promise<FolderGroup[]> => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return [];
    const ownerId = identity.tokenIdentifier;

    const folders = await ctx.db
      .query("folders")
      .withIndex("by_ownerId_and_isDefault", (q) => q.eq("ownerId", ownerId))
      .take(MAX_FOLDERS);
    const presentations = await ctx.db
      .query("presentations")
      .withIndex("by_ownerId_and_updatedAt", (q) => q.eq("ownerId", ownerId))
      .order("desc")
      .take(MAX_SIDEBAR_PRESENTATIONS);

    const defaultFolder = folders.find((f) => f.isDefault);
    const groups = new Map<string, FolderGroup>();
    // Default folder first, then the others in creation order.
    for (const folder of [...folders].sort((a, b) => Number(b.isDefault) - Number(a.isDefault))) {
      groups.set(folder._id, { id: folder._id, name: folder.name, presentations: [] });
    }
    for (const p of presentations) {
      // Presentations from before folders existed belong to the default folder.
      const key = p.folderId ?? defaultFolder?._id ?? "default";
      let group = groups.get(key);
      if (!group) {
        group = { id: null, name: DEFAULT_FOLDER_NAME, presentations: [] };
        groups.set(key, group);
      }
      group.presentations.push({ _id: p._id, title: p.title, status: p.status });
    }
    return [...groups.values()];
  },
});

async function loadChildren(ctx: MutationCtx, presentationId: Id<"presentations">) {
  const messages = await ctx.db
    .query("messages")
    .withIndex("by_presentationId", (q) => q.eq("presentationId", presentationId))
    .take(MAX_MESSAGES);
  const outline = await ctx.db
    .query("outlineSlides")
    .withIndex("by_presentationId_and_position", (q) => q.eq("presentationId", presentationId))
    .take(MAX_SLIDES);
  const slides = await ctx.db
    .query("presentationSlides")
    .withIndex("by_presentationId_and_position", (q) => q.eq("presentationId", presentationId))
    .take(MAX_SLIDES);
  return { messages, outline, slides };
}

/** Deletes a presentation together with its chat, outline and slides. */
export const remove = mutation({
  args: { presentationId: v.id("presentations") },
  handler: async (ctx, args) => {
    const presentation = await requireOwnedPresentation(ctx, args.presentationId);
    const { messages, outline, slides } = await loadChildren(ctx, presentation._id);
    for (const m of messages) await ctx.db.delete("messages", m._id);
    for (const o of outline) await ctx.db.delete("outlineSlides", o._id);
    for (const s of slides) await ctx.db.delete("presentationSlides", s._id);
    // A pending first-pass step finds the presentation gone and stops.
    await ctx.db.delete("presentations", presentation._id);
    return null;
  },
});

/** Copies a presentation together with its chat, outline and slides. */
export const duplicate = mutation({
  args: { presentationId: v.id("presentations") },
  handler: async (ctx, args) => {
    const source = await requireOwnedPresentation(ctx, args.presentationId);
    if (source.status === "generating") {
      throw new ConvexError("Wait for the outline to finish before copying");
    }
    const copyId = await ctx.db.insert("presentations", {
      ownerId: source.ownerId,
      folderId: source.folderId,
      title: `${source.title} (Copy)`,
      prompt: source.prompt,
      model: source.model,
      status: source.status,
      generationStage: source.generationStage,
      templateName: source.templateName,
      updatedAt: Date.now(),
    });

    const { messages, outline, slides } = await loadChildren(ctx, source._id);
    for (const m of messages) {
      await ctx.db.insert("messages", {
        presentationId: copyId,
        role: m.role,
        kind: m.kind,
        parts: m.parts,
        status: m.status,
        files: m.files,
        slides: m.slides,
        model: m.model,
      });
    }
    for (const o of outline) {
      await ctx.db.insert("outlineSlides", {
        presentationId: copyId,
        position: o.position,
        title: o.title,
        bullets: o.bullets,
        attachment: o.attachment,
      });
    }
    for (const s of slides) {
      await ctx.db.insert("presentationSlides", {
        presentationId: copyId,
        position: s.position,
        title: s.title,
        templateSlide: s.templateSlide,
      });
    }
    return copyId;
  },
});
