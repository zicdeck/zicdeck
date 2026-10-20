import { ConvexError } from "convex/values";
import type { QueryCtx } from "../_generated/server";
import type { Doc, Id } from "../_generated/dataModel";

export async function requireIdentity(ctx: QueryCtx) {
  const identity = await ctx.auth.getUserIdentity();
  if (!identity) throw new ConvexError("Not authenticated");
  return identity;
}

/** Loads a presentation and throws unless the caller owns it. */
export async function requireOwnedPresentation(
  ctx: QueryCtx,
  presentationId: Id<"presentations">,
): Promise<Doc<"presentations">> {
  const identity = await requireIdentity(ctx);
  const presentation = await ctx.db.get("presentations", presentationId);
  if (!presentation || presentation.ownerId !== identity.tokenIdentifier) {
    throw new ConvexError("Presentation not found");
  }
  return presentation;
}

/** Loads an outline slide and throws unless the caller owns its presentation. */
export async function requireOwnedSlide(
  ctx: QueryCtx,
  slideId: Id<"outlineSlides">,
): Promise<Doc<"outlineSlides">> {
  const slide = await ctx.db.get("outlineSlides", slideId);
  if (!slide) throw new ConvexError("Slide not found");
  await requireOwnedPresentation(ctx, slide.presentationId);
  return slide;
}
