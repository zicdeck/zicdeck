import type { MutationCtx } from "../_generated/server";
import type { Id } from "../_generated/dataModel";

export const DEFAULT_FOLDER_NAME = "My Presentations";

/** Returns the owner's default folder, creating it on first use. */
export async function getOrCreateDefaultFolder(
  ctx: MutationCtx,
  ownerId: string,
): Promise<Id<"folders">> {
  const existing = await ctx.db
    .query("folders")
    .withIndex("by_ownerId_and_isDefault", (q) => q.eq("ownerId", ownerId).eq("isDefault", true))
    .first();
  if (existing) return existing._id;
  return await ctx.db.insert("folders", {
    ownerId,
    name: DEFAULT_FOLDER_NAME,
    isDefault: true,
  });
}
