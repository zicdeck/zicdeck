import { ConvexError, v } from "convex/values";
import { mutation, type MutationCtx } from "./_generated/server";
import type { Id } from "./_generated/dataModel";
import { requireOwnedPresentation, requireOwnedSlide } from "./lib/auth";
import { attachment } from "./lib/validators";

const MAX_SLIDES = 200;
const MAX_BULLETS = 50;
const MAX_TEXT_LENGTH = 5_000;

function checkText(text: string) {
  if (text.length > MAX_TEXT_LENGTH) throw new ConvexError("Text is too long");
}

async function listSlides(ctx: MutationCtx, presentationId: Id<"presentations">) {
  return await ctx.db
    .query("outlineSlides")
    .withIndex("by_presentationId_and_position", (q) => q.eq("presentationId", presentationId))
    .take(MAX_SLIDES);
}

/** Rewrites positions to 0..n-1 in the given order. */
async function writePositions(ctx: MutationCtx, slideIds: Id<"outlineSlides">[]) {
  for (const [position, slideId] of slideIds.entries()) {
    await ctx.db.patch("outlineSlides", slideId, { position });
  }
}

async function touch(ctx: MutationCtx, presentationId: Id<"presentations">) {
  await ctx.db.patch("presentations", presentationId, { updatedAt: Date.now() });
}

export const updateTitle = mutation({
  args: { slideId: v.id("outlineSlides"), title: v.string() },
  handler: async (ctx, args) => {
    checkText(args.title);
    const slide = await requireOwnedSlide(ctx, args.slideId);
    await ctx.db.patch("outlineSlides", slide._id, { title: args.title });
    await touch(ctx, slide.presentationId);
    return null;
  },
});

export const updateBullet = mutation({
  args: { slideId: v.id("outlineSlides"), index: v.number(), text: v.string() },
  handler: async (ctx, args) => {
    checkText(args.text);
    const slide = await requireOwnedSlide(ctx, args.slideId);
    if (args.index < 0 || args.index >= slide.bullets.length) return null;
    const bullets = [...slide.bullets];
    bullets[args.index] = args.text;
    await ctx.db.patch("outlineSlides", slide._id, { bullets });
    await touch(ctx, slide.presentationId);
    return null;
  },
});

/** Inserts an empty bullet at `index` (clamped to the end of the list). */
export const insertBullet = mutation({
  args: { slideId: v.id("outlineSlides"), index: v.number() },
  handler: async (ctx, args) => {
    const slide = await requireOwnedSlide(ctx, args.slideId);
    if (slide.bullets.length >= MAX_BULLETS) throw new ConvexError("Too many points on this slide");
    const bullets = [...slide.bullets];
    bullets.splice(Math.max(0, Math.min(args.index, bullets.length)), 0, "");
    await ctx.db.patch("outlineSlides", slide._id, { bullets });
    await touch(ctx, slide.presentationId);
    return null;
  },
});

export const removeBullet = mutation({
  args: { slideId: v.id("outlineSlides"), index: v.number() },
  handler: async (ctx, args) => {
    const slide = await requireOwnedSlide(ctx, args.slideId);
    if (args.index < 0 || args.index >= slide.bullets.length) return null;
    const bullets = slide.bullets.filter((_, i) => i !== args.index);
    await ctx.db.patch("outlineSlides", slide._id, { bullets });
    await touch(ctx, slide.presentationId);
    return null;
  },
});

export const updateAttachment = mutation({
  args: {
    slideId: v.id("outlineSlides"),
    field: v.union(v.literal("type"), v.literal("title")),
    value: v.string(),
  },
  handler: async (ctx, args) => {
    checkText(args.value);
    const slide = await requireOwnedSlide(ctx, args.slideId);
    if (!slide.attachment) return null;
    await ctx.db.patch("outlineSlides", slide._id, {
      attachment: { ...slide.attachment, [args.field]: args.value },
    });
    await touch(ctx, slide.presentationId);
    return null;
  },
});

/** Inserts a slide at `index` (clamped). Also used to undo a deletion. */
export const addSlide = mutation({
  args: {
    presentationId: v.id("presentations"),
    index: v.number(),
    title: v.string(),
    bullets: v.array(v.string()),
    attachment: v.optional(attachment),
  },
  handler: async (ctx, args) => {
    const presentation = await requireOwnedPresentation(ctx, args.presentationId);
    checkText(args.title);
    args.bullets.forEach(checkText);
    if (args.bullets.length > MAX_BULLETS) throw new ConvexError("Too many points on this slide");

    const slides = await listSlides(ctx, presentation._id);
    if (slides.length >= MAX_SLIDES) throw new ConvexError("Too many slides");
    const index = Math.max(0, Math.min(args.index, slides.length));

    const slideId = await ctx.db.insert("outlineSlides", {
      presentationId: presentation._id,
      position: index,
      title: args.title,
      bullets: args.bullets,
      attachment: args.attachment,
    });
    const order = slides.map((s) => s._id);
    order.splice(index, 0, slideId);
    await writePositions(ctx, order);
    await touch(ctx, presentation._id);
    return slideId;
  },
});

export const deleteSlide = mutation({
  args: { slideId: v.id("outlineSlides") },
  handler: async (ctx, args) => {
    const slide = await requireOwnedSlide(ctx, args.slideId);
    const slides = await listSlides(ctx, slide.presentationId);
    if (slides.length <= 1) throw new ConvexError("A presentation needs at least one slide");
    await ctx.db.delete("outlineSlides", slide._id);
    await writePositions(
      ctx,
      slides.filter((s) => s._id !== slide._id).map((s) => s._id),
    );
    await touch(ctx, slide.presentationId);
    return null;
  },
});

/** Saves a new slide order. `slideIds` must list every slide of the presentation. */
export const reorder = mutation({
  args: {
    presentationId: v.id("presentations"),
    slideIds: v.array(v.id("outlineSlides")),
  },
  handler: async (ctx, args) => {
    const presentation = await requireOwnedPresentation(ctx, args.presentationId);
    const slides = await listSlides(ctx, presentation._id);
    const known = new Set(slides.map((s) => s._id));
    const requested = new Set(args.slideIds);
    if (
      requested.size !== args.slideIds.length ||
      requested.size !== known.size ||
      args.slideIds.some((id) => !known.has(id))
    ) {
      throw new ConvexError("Slide order is out of date");
    }
    await writePositions(ctx, args.slideIds);
    await touch(ctx, presentation._id);
    return null;
  },
});
