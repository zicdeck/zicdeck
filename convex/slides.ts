import { ConvexError, v } from "convex/values";
import { mutation, type MutationCtx } from "./_generated/server";
import type { Id } from "./_generated/dataModel";
import { requireOwnedPresentation } from "./lib/auth";

// Mutations for the generated slides. These never touch `outlineSlides`.

const MAX_SLIDES = 200;
const MAX_TITLE_LENGTH = 5_000;

async function listSlides(ctx: MutationCtx, presentationId: Id<"presentations">) {
  return await ctx.db
    .query("presentationSlides")
    .withIndex("by_presentationId_and_position", (q) => q.eq("presentationId", presentationId))
    .take(MAX_SLIDES);
}

async function writePositions(ctx: MutationCtx, slideIds: Id<"presentationSlides">[]) {
  for (const [position, slideId] of slideIds.entries()) {
    await ctx.db.patch("presentationSlides", slideId, { position });
  }
}

/** Inserts a slide at `index` (clamped). Also used to undo a deletion. */
export const addSlide = mutation({
  args: {
    presentationId: v.id("presentations"),
    index: v.number(),
    title: v.string(),
    templateSlide: v.number(),
  },
  handler: async (ctx, args) => {
    const presentation = await requireOwnedPresentation(ctx, args.presentationId);
    if (args.title.length > MAX_TITLE_LENGTH) throw new ConvexError("Title is too long");
    const slides = await listSlides(ctx, presentation._id);
    if (slides.length >= MAX_SLIDES) throw new ConvexError("Too many slides");
    const index = Math.max(0, Math.min(args.index, slides.length));

    const slideId = await ctx.db.insert("presentationSlides", {
      presentationId: presentation._id,
      position: index,
      title: args.title,
      templateSlide: Math.max(1, Math.round(args.templateSlide)),
    });
    const order = slides.map((s) => s._id);
    order.splice(index, 0, slideId);
    await writePositions(ctx, order);
    await ctx.db.patch("presentations", presentation._id, { updatedAt: Date.now() });
    return slideId;
  },
});

export const deleteSlide = mutation({
  args: { slideId: v.id("presentationSlides") },
  handler: async (ctx, args) => {
    const slide = await ctx.db.get("presentationSlides", args.slideId);
    if (!slide) throw new ConvexError("Slide not found");
    await requireOwnedPresentation(ctx, slide.presentationId);
    const slides = await listSlides(ctx, slide.presentationId);
    if (slides.length <= 1) throw new ConvexError("A presentation needs at least one slide");
    await ctx.db.delete("presentationSlides", slide._id);
    await writePositions(
      ctx,
      slides.filter((s) => s._id !== slide._id).map((s) => s._id),
    );
    await ctx.db.patch("presentations", slide.presentationId, { updatedAt: Date.now() });
    return null;
  },
});
