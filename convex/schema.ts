import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
import {
  attachment,
  messageKind,
  messagePart,
  messageRole,
  presentationStatus,
} from "./lib/validators";

export default defineSchema({
  numbers: defineTable({
    value: v.number(),
  }),

  // Groups of presentations shown in the sidebar. Every user gets a default folder.
  folders: defineTable({
    ownerId: v.string(),
    name: v.string(),
    isDefault: v.boolean(),
  }).index("by_ownerId_and_isDefault", ["ownerId", "isDefault"]),

  presentations: defineTable({
    // Clerk identity (`tokenIdentifier`) of the owner.
    ownerId: v.string(),
    // Unset for presentations created before folders existed; they belong to the default folder.
    folderId: v.optional(v.id("folders")),
    title: v.string(),
    prompt: v.string(),
    model: v.string(),
    status: presentationStatus,
    // How far the scripted first pass has progressed (see convex/generation.ts).
    generationStage: v.number(),
    templateName: v.optional(v.string()),
    updatedAt: v.number(),
  }).index("by_ownerId_and_updatedAt", ["ownerId", "updatedAt"]),

  messages: defineTable({
    presentationId: v.id("presentations"),
    role: messageRole,
    kind: messageKind,
    parts: v.array(messagePart),
    status: v.union(v.literal("pending"), v.literal("complete")),
    files: v.optional(v.array(v.string())),
    slides: v.optional(v.array(v.number())),
    model: v.optional(v.string()),
  })
    // Kept separately because the chat is listed in creation order.
    // eslint-disable-next-line @convex-dev/no-duplicate-indexes
    .index("by_presentationId", ["presentationId"])
    .index("by_presentationId_and_kind", ["presentationId", "kind"]),

  outlineSlides: defineTable({
    presentationId: v.id("presentations"),
    position: v.number(),
    title: v.string(),
    bullets: v.array(v.string()),
    attachment: v.optional(attachment),
  }).index("by_presentationId_and_position", ["presentationId", "position"]),

  // Generated slides. Copied from the outline when the presentation is generated
  // and edited independently afterwards, so deleting a slide leaves the outline alone.
  presentationSlides: defineTable({
    presentationId: v.id("presentations"),
    position: v.number(),
    title: v.string(),
    // 1-based page of the template this slide is rendered from.
    templateSlide: v.number(),
  }).index("by_presentationId_and_position", ["presentationId", "position"]),
});
