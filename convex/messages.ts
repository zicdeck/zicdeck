import { ConvexError, v } from "convex/values";
import { internalMutation, mutation } from "./_generated/server";
import { internal } from "./_generated/api";
import { requireOwnedPresentation } from "./lib/auth";
import { getChatReply } from "./lib/mockGeneration";
import type { MessagePart } from "./lib/validators";

const MAX_MESSAGE_LENGTH = 20_000;
const REPLY_DELAY_MS = 600;

/** Saves a chat message from the user and schedules the assistant's reply. */
export const send = mutation({
  args: {
    presentationId: v.id("presentations"),
    text: v.string(),
    files: v.optional(v.array(v.string())),
    slides: v.optional(v.array(v.number())),
    model: v.optional(v.string()),
    currentSlideNumber: v.number(),
  },
  handler: async (ctx, args) => {
    const presentation = await requireOwnedPresentation(ctx, args.presentationId);
    const files = args.files ?? [];
    const slides = args.slides ?? [];
    if (!args.text.trim() && files.length === 0 && slides.length === 0) {
      throw new ConvexError("Message is empty");
    }
    if (args.text.length > MAX_MESSAGE_LENGTH) throw new ConvexError("Message is too long");

    const messageId = await ctx.db.insert("messages", {
      presentationId: presentation._id,
      role: "user",
      kind: "chat",
      parts: [{ type: "text", text: args.text }],
      status: "complete",
      files: files.length > 0 ? files : undefined,
      slides: slides.length > 0 ? slides : undefined,
      model: args.model,
    });
    await ctx.db.patch("presentations", presentation._id, { updatedAt: Date.now() });

    await ctx.scheduler.runAfter(REPLY_DELAY_MS, internal.messages.respond, {
      presentationId: presentation._id,
      text: args.text,
      currentSlideNumber: args.currentSlideNumber,
    });
    return messageId;
  },
});

export const respond = internalMutation({
  args: {
    presentationId: v.id("presentations"),
    text: v.string(),
    currentSlideNumber: v.number(),
  },
  handler: async (ctx, args) => {
    const presentation = await ctx.db.get("presentations", args.presentationId);
    if (!presentation) return null;

    const reply = getChatReply(args.text, presentation.title, args.currentSlideNumber);
    const parts: MessagePart[] = [
      ...reply.steps.map(
        (step, index): MessagePart => ({
          type: "step",
          key: `step-${index}`,
          icon: step.icon,
          label: step.label,
          status: "done",
        }),
      ),
      { type: "text", text: reply.content },
    ];

    await ctx.db.insert("messages", {
      presentationId: presentation._id,
      role: "assistant",
      kind: "chat",
      parts,
      status: "complete",
    });
    await ctx.db.patch("presentations", presentation._id, { updatedAt: Date.now() });
    return null;
  },
});
