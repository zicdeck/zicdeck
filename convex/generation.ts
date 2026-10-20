import { v } from "convex/values";
import { internalMutation, type MutationCtx } from "./_generated/server";
import { internal } from "./_generated/api";
import type { Doc } from "./_generated/dataModel";
import { DEFAULT_OUTLINE, getPromptContext, type PromptContext } from "./lib/mockGeneration";
import type { MessagePart, StepPart } from "./lib/validators";

// The first pass is a sequence of stages, each persisted as soon as it happens so
// the chat can be re-rendered from the database at any point. `at` is the time in
// ms since the presentation was created.
interface Stage {
  at: number;
  apply: (parts: MessagePart[], context: PromptContext) => MessagePart[];
  // Runs after the message is patched, for stages that touch other tables.
  after?: (ctx: MutationCtx, presentation: Doc<"presentations">, context: PromptContext) => Promise<void>;
}

function upsertStep(parts: MessagePart[], step: StepPart): MessagePart[] {
  const index = parts.findIndex((p) => p.type === "step" && p.key === step.key);
  if (index === -1) return [...parts, step];
  const next = [...parts];
  next[index] = step;
  return next;
}

function sourcesStep(context: PromptContext, count: number): StepPart {
  const done = count >= context.sources.length;
  return {
    type: "step",
    key: "sources",
    icon: "globe",
    status: done ? "done" : "running",
    label: done
      ? `Reviewed ${context.sources.length} web sources for "${context.searchTopic}"`
      : `Searching web sources for "${context.searchTopic}"...`,
    sources: context.sources.slice(0, count),
  };
}

const STAGES: Stage[] = [
  // Stage 0 is the intro text written by `presentations.create`.
  { at: 0, apply: (parts) => parts },
  {
    at: 1100,
    apply: (parts) =>
      upsertStep(parts, {
        type: "step",
        key: "setup",
        icon: "folder",
        status: "done",
        label: "Opened setup form",
      }),
  },
  { at: 2200, apply: (parts, c) => upsertStep(parts, sourcesStep(c, 1)) },
  { at: 3500, apply: (parts, c) => upsertStep(parts, sourcesStep(c, 2)) },
  { at: 4800, apply: (parts, c) => upsertStep(parts, sourcesStep(c, 3)) },
  { at: 6200, apply: (parts, c) => upsertStep(parts, sourcesStep(c, c.sources.length)) },
  {
    at: 7400,
    apply: (parts, c) => [
      ...upsertStep(parts, {
        type: "step",
        key: "grounding",
        icon: "book",
        status: "done",
        label: "Researched & grounded context in reference benchmarks",
      }),
      { type: "text", text: c.groundingMsg },
    ],
  },
  {
    at: 8800,
    apply: (parts) =>
      upsertStep(parts, {
        type: "step",
        key: "template",
        icon: "template",
        status: "running",
        label: "Searching for relevant templates...",
      }),
  },
  {
    at: 11000,
    apply: (parts, c) =>
      upsertStep(parts, {
        type: "step",
        key: "template",
        icon: "template",
        status: "done",
        label: `Changed template to "${c.templateName}"`,
        template: c.templateName,
      }),
    after: async (ctx, presentation, c) => {
      await ctx.db.patch("presentations", presentation._id, { templateName: c.templateName });
    },
  },
  {
    at: 12200,
    apply: (parts, c) => [
      ...upsertStep(parts, {
        type: "step",
        key: "direction",
        icon: "compass",
        status: "done",
        label: "Picked a direction",
      }),
      { type: "text", text: c.directionMsg },
    ],
  },
  {
    at: 14000,
    apply: (parts) =>
      upsertStep(parts, {
        type: "step",
        key: "plan",
        icon: "check",
        status: "done",
        tone: "success",
        label: "Plan view ready",
      }),
    after: async (ctx, presentation) => {
      for (const [position, slide] of DEFAULT_OUTLINE.entries()) {
        await ctx.db.insert("outlineSlides", {
          presentationId: presentation._id,
          position,
          title: slide.title,
          bullets: slide.bullets,
          attachment: slide.attachment,
        });
      }
      await ctx.db.patch("presentations", presentation._id, { status: "outline_ready" });
    },
  },
];

export const FIRST_STAGE_DELAY = STAGES[1].at;

export function getIntroParts(context: PromptContext): MessagePart[] {
  return [{ type: "text", text: context.aiIntro }];
}

export const advance = internalMutation({
  args: {
    presentationId: v.id("presentations"),
    stage: v.number(),
  },
  handler: async (ctx, args) => {
    const presentation = await ctx.db.get("presentations", args.presentationId);
    // Idempotent: skip if the presentation is gone or this stage already ran.
    if (!presentation || presentation.status !== "generating") return null;
    if (presentation.generationStage !== args.stage - 1) return null;

    const stage = STAGES[args.stage];
    if (!stage) return null;

    const message = await ctx.db
      .query("messages")
      .withIndex("by_presentationId_and_kind", (q) =>
        q.eq("presentationId", presentation._id).eq("kind", "generation"),
      )
      .first();
    if (!message) return null;

    const context = getPromptContext(presentation.prompt, presentation.title);
    const isLast = args.stage === STAGES.length - 1;

    await ctx.db.patch("messages", message._id, {
      parts: stage.apply(message.parts, context),
      status: isLast ? "complete" : "pending",
    });
    await ctx.db.patch("presentations", presentation._id, {
      generationStage: args.stage,
      updatedAt: Date.now(),
    });
    await stage.after?.(ctx, presentation, context);

    if (!isLast) {
      const next = STAGES[args.stage + 1];
      await ctx.scheduler.runAfter(next.at - stage.at, internal.generation.advance, {
        presentationId: presentation._id,
        stage: args.stage + 1,
      });
    }
    return null;
  },
});
