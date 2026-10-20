import { v, type Infer } from "convex/values";

export const presentationStatus = v.union(
  // The AI is still working through its first pass; the chat is full screen.
  v.literal("generating"),
  // The outline is ready for review and editing.
  v.literal("outline_ready"),
  // The user confirmed the outline and the slides were generated.
  v.literal("presentation_ready"),
);

export const stepIcon = v.union(
  v.literal("folder"),
  v.literal("globe"),
  v.literal("book"),
  v.literal("template"),
  v.literal("compass"),
  v.literal("check"),
  v.literal("sparkles"),
);

export const source = v.object({
  title: v.string(),
  domain: v.string(),
});

export const textPart = v.object({
  type: v.literal("text"),
  text: v.string(),
});

export const stepPart = v.object({
  type: v.literal("step"),
  // Stable key so a running step can be updated in place when it finishes.
  key: v.string(),
  icon: stepIcon,
  label: v.string(),
  status: v.union(v.literal("running"), v.literal("done")),
  tone: v.optional(v.literal("success")),
  sources: v.optional(v.array(source)),
  template: v.optional(v.string()),
});

export const messagePart = v.union(textPart, stepPart);

export const messageRole = v.union(v.literal("user"), v.literal("assistant"));

export const messageKind = v.union(
  // The user's first prompt that started the presentation.
  v.literal("prompt"),
  // The AI's first pass: research, template, direction and outline steps.
  v.literal("generation"),
  // Any later back-and-forth in the chat.
  v.literal("chat"),
);

export const attachment = v.object({
  type: v.string(),
  title: v.string(),
});

export type MessagePart = Infer<typeof messagePart>;
export type StepPart = Infer<typeof stepPart>;
export type StepIcon = Infer<typeof stepIcon>;
export type Source = Infer<typeof source>;
export type Attachment = Infer<typeof attachment>;
