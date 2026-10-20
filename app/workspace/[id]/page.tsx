"use client";

import React, { use, useState, useRef, useEffect, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  AlignLeft,
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  ArrowUp,
  BarChart2,
  BookOpen,
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Columns2,
  Compass,
  Copy,
  Download,
  FileImage,
  FileText,
  Folder,
  Globe2,
  Grid2X2,
  GripVertical,
  History,
  Image as ImageIcon,
  LayoutTemplate,
  List,
  MonitorPlay,
  Moon,
  NotebookPen,
  Palette,
  Paperclip,
  PieChart,
  Play,
  Plus,
  Presentation as PresentationIcon,
  Quote,
  RotateCcw,
  Sparkles,
  Sun,
  Trash2,
  WandSparkles,
  X,
} from "lucide-react";
import { Reorder, useDragControls } from "motion/react";
import { useConvexAuth, useMutation, useQuery } from "convex/react";
import type { FunctionArgs, FunctionReturnType } from "convex/server";
import type { OptimisticLocalStore } from "convex/browser";
import { api } from "@/convex/_generated/api";
import type { Doc, Id } from "@/convex/_generated/dataModel";
import type { MessagePart, StepPart } from "@/convex/lib/validators";
import { useWorkspaceTheme } from "@/components/workspace/WorkspaceThemeContext";
import { cn } from "@/lib/utils";

type WorkspaceData = NonNullable<FunctionReturnType<typeof api.presentations.get>>;
type OutlineSlide = Doc<"outlineSlides">;
type ChatMessage = Doc<"messages">;
type PresentationSlide = Doc<"presentationSlides">;

const STEP_ICONS: Record<StepPart["icon"], typeof Sparkles> = {
  folder: Folder,
  globe: Globe2,
  book: BookOpen,
  template: LayoutTemplate,
  compass: Compass,
  check: Check,
  sparkles: Sparkles,
};

function renderFormattedText(text: string) {
  if (!text) return null;
  const parts = text.split(/(\*\*.*?\*\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return (
        <strong key={i} className="font-semibold text-[var(--ink)]">
          {part.slice(2, -2)}
        </strong>
      );
    }
    return part;
  });
}

interface ChatModel {
  id: string;
  name: string;
}

const MODELS: ChatModel[] = [
  { id: "free", name: "Free model" },
  { id: "claude-3-7", name: "Claude 3.7 Sonnet" },
  { id: "gpt-4o", name: "GPT-4o" },
  { id: "deepseek-v3", name: "DeepSeek V3" },
];

const SAVE_DEBOUNCE_MS = 400;

/**
 * Text field that keeps a local draft while focused and saves it through
 * `onCommit` after a short pause, on blur, and before Enter/Backspace actions,
 * so structural edits (new or removed points) always see the latest text.
 */
function EditableText({
  value,
  onCommit,
  placeholder = "Type text...",
  className,
  multiline = false,
  onKeyDown,
}: {
  value: string;
  onCommit: (val: string) => void;
  placeholder?: string;
  className?: string;
  multiline?: boolean;
  onKeyDown?: (
    e: React.KeyboardEvent<HTMLTextAreaElement | HTMLInputElement>,
    currentValue: string
  ) => void;
}) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [draft, setDraft] = useState(value);
  const [syncedValue, setSyncedValue] = useState(value);
  const [isFocused, setIsFocused] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pendingRef = useRef<string | null>(null);
  const onCommitRef = useRef(onCommit);

  useEffect(() => {
    onCommitRef.current = onCommit;
  });

  // Follow saved changes from the database unless the user is typing here.
  if (!isFocused && value !== syncedValue) {
    setSyncedValue(value);
    setDraft(value);
  }

  const flush = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    if (pendingRef.current !== null) {
      const next = pendingRef.current;
      pendingRef.current = null;
      onCommitRef.current(next);
    }
  }, []);

  useEffect(() => flush, [flush]);

  const handleChange = (next: string) => {
    setDraft(next);
    pendingRef.current = next;
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(flush, SAVE_DEBOUNCE_MS);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement | HTMLInputElement>) => {
    if (e.key === "Enter" || (e.key === "Backspace" && draft === "")) flush();
    onKeyDown?.(e, draft);
  };

  const focusHandlers = {
    onFocus: () => setIsFocused(true),
    onBlur: () => {
      flush();
      setIsFocused(false);
    },
  };

  const adjustHeight = useCallback(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, []);

  useEffect(() => {
    if (multiline) {
      adjustHeight();
    }
  }, [draft, multiline, adjustHeight]);

  // The height depends on the width the text wraps at. Outline cards mount while
  // the canvas is still hidden or animating open from zero width, so re-measure
  // whenever the width changes instead of only when the text does.
  useEffect(() => {
    const el = textareaRef.current;
    if (!multiline || !el || typeof ResizeObserver === "undefined") return;
    let lastWidth = el.clientWidth;
    const observer = new ResizeObserver(() => {
      if (el.clientWidth === lastWidth) return;
      lastWidth = el.clientWidth;
      adjustHeight();
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, [multiline, adjustHeight]);

  if (!multiline) {
    return (
      <input
        type="text"
        value={draft}
        onChange={(e) => handleChange(e.target.value)}
        onKeyDown={handleKeyDown}
        {...focusHandlers}
        placeholder={placeholder}
        className={cn(
          "w-full bg-transparent border-0 outline-none p-0 text-inherit font-inherit placeholder:text-[var(--muted)]/40 focus:outline-none focus:ring-0",
          className
        )}
      />
    );
  }

  return (
    <textarea
      ref={textareaRef}
      rows={1}
      value={draft}
      onChange={(e) => {
        handleChange(e.target.value);
        adjustHeight();
      }}
      onKeyDown={handleKeyDown}
      {...focusHandlers}
      placeholder={placeholder}
      className={cn(
        "w-full bg-transparent border-0 outline-none p-0 text-inherit font-inherit placeholder:text-[var(--muted)]/40 focus:outline-none focus:ring-0 resize-none overflow-hidden block transition-colors leading-normal",
        className
      )}
    />
  );
}

function OutlineCardItem({
  item,
  index,
  total,
  hasPresentation,
  isDraftingOutline,
  currentSlideNumber,
  onSelectSlide,
  onUpdateTitle,
  onUpdateBullet,
  onAddBullet,
  onRemoveBullet,
  onUpdateAttachmentType,
  onUpdateAttachmentTitle,
  onDeleteSlide,
  onDragEnd,
}: {
  item: OutlineSlide;
  index: number;
  total: number;
  hasPresentation: boolean;
  isDraftingOutline: boolean;
  currentSlideNumber: number;
  onSelectSlide: () => void;
  onUpdateTitle: (val: string) => void;
  onUpdateBullet: (bIndex: number, val: string) => void;
  onAddBullet: (afterIndex?: number) => void;
  onRemoveBullet: (bIndex: number) => void;
  onUpdateAttachmentType: (val: string) => void;
  onUpdateAttachmentTitle: (val: string) => void;
  onDeleteSlide: () => void;
  onDragEnd: () => void;
}) {
  const dragControls = useDragControls();

  return (
    <Reorder.Item
      as="div"
      value={item._id}
      id={item._id}
      dragListener={false}
      dragControls={dragControls}
      onDragEnd={onDragEnd}
      className={cn(
        "group relative flex items-stretch rounded-2xl bg-white dark:bg-[#1c1c20] shadow-[0_2px_12px_rgba(0,0,0,0.03),0_1px_3px_rgba(0,0,0,0.02)] dark:shadow-[0_4px_20px_rgba(0,0,0,0.35)] hover:shadow-[0_4px_20px_rgba(0,0,0,0.06),0_1px_4px_rgba(0,0,0,0.03)] dark:hover:shadow-[0_6px_24px_rgba(0,0,0,0.45)] transition-all duration-200 overflow-hidden",
        hasPresentation && currentSlideNumber === index + 1 && "ring-2 ring-[var(--ink)]/20 dark:ring-white/20 shadow-md",
        isDraftingOutline && index > 1 ? "animate-pulse opacity-60" : "opacity-100"
      )}
    >
      {/* Left Column: Number Box + Drag Handle */}
      <div
        onPointerDown={(e) => dragControls.start(e)}
        onClick={onSelectSlide}
        className={cn(
          "w-14 sm:w-16 shrink-0 flex flex-col items-center justify-center transition-colors select-none cursor-grab active:cursor-grabbing relative group/handle touch-none",
          hasPresentation && currentSlideNumber === index + 1
            ? "bg-[#e8e4dc] dark:bg-[#30302d]"
            : "bg-[#f2efe9] dark:bg-[#282826] hover:bg-[#eae6de] dark:hover:bg-[#2f2f2c]"
        )}
        title="Drag up or down to reorder, or click to view slide"
      >
        <span className="font-['Figtree'] font-semibold text-sm sm:text-base text-[var(--ink)] group-hover/handle:opacity-0 transition-opacity">
          {index + 1}
        </span>
        <GripVertical className="size-4 text-[var(--muted)] group-hover/handle:text-[var(--ink)] absolute opacity-0 group-hover/handle:opacity-100 transition-opacity pointer-events-none" />
      </div>

      {/* Right Column: Title + Bullets + Optional Attachment */}
      <div className="flex-1 min-w-0 p-5 sm:py-5 sm:px-6 flex flex-col justify-center">
        {/* Title Row */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <EditableText
              value={item.title}
              onCommit={onUpdateTitle}
              multiline
              placeholder="Slide title..."
              className="font-['Figtree'] text-[15px] sm:text-base font-bold text-[var(--ink)] leading-snug tracking-tight"
            />
          </div>

          {/* Card Actions on hover (Delete slide, Navigate) */}
          <div className="flex items-center gap-1 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
            {hasPresentation && (
              <button
                type="button"
                onClick={onSelectSlide}
                className="inline-flex size-6 items-center justify-center rounded-full text-[var(--muted)] hover:text-[var(--ink)] hover:bg-[var(--light-gray)] transition-colors cursor-pointer"
                title="View in presentation"
              >
                <ArrowRight className="size-3.5" />
              </button>
            )}
            {total > 1 && (
              <button
                type="button"
                onClick={onDeleteSlide}
                className="inline-flex size-6 items-center justify-center rounded-full text-[var(--muted)] hover:text-red-600 hover:bg-red-500/10 transition-colors cursor-pointer"
                title="Delete slide"
              >
                <Trash2 className="size-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Bullets (Cards 2, 3, 4, 5, 6) */}
        {item.bullets && item.bullets.length > 0 && (
          <div className="mt-3 space-y-2">
            {item.bullets.map((bullet, bIndex) => (
              <div
                key={bIndex}
                className="group/bullet flex items-start gap-2.5 text-[13px] sm:text-[13.5px] leading-relaxed text-[#374151] dark:text-[#d1d5db]"
              >
                <span className="select-none text-[var(--muted)]/70 font-bold text-base leading-none mt-0.5">•</span>
                <div className="flex-1 min-w-0">
                  <EditableText
                    value={bullet}
                    onCommit={(val) => onUpdateBullet(bIndex, val)}
                    multiline
                    placeholder="Bullet point..."
                    className="text-[13px] sm:text-[13.5px] text-[#374151] dark:text-[#d1d5db] leading-relaxed"
                    onKeyDown={(e, currentValue) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        onAddBullet(bIndex);
                      } else if (e.key === "Backspace" && currentValue === "" && item.bullets.length > 1) {
                        e.preventDefault();
                        onRemoveBullet(bIndex);
                      }
                    }}
                  />
                </div>
                <button
                  type="button"
                  onClick={() => onRemoveBullet(bIndex)}
                  className="opacity-0 group-hover/bullet:opacity-100 transition-opacity p-0.5 text-[var(--muted)] hover:text-red-500 cursor-pointer rounded"
                  title="Delete point"
                  aria-label="Delete point"
                >
                  <X className="size-3" />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Attachment (Card 3 Chart Badge) */}
        {item.attachment && (
          <div className="mt-3.5 inline-flex items-center gap-3 rounded-xl bg-amber-500/10 dark:bg-amber-500/15 p-2 sm:px-3 sm:py-2 text-xs transition-colors self-start">
            <div className="size-8.5 rounded-lg bg-amber-500/20 dark:bg-amber-500/30 flex items-center justify-center shrink-0">
              <BarChart2 className="size-4 text-amber-800 dark:text-amber-300" strokeWidth={2} />
            </div>
            <div className="flex flex-col min-w-0 pr-1">
              <EditableText
                value={item.attachment.type}
                onCommit={onUpdateAttachmentType}
                placeholder="Type"
                className="text-[11px] font-semibold text-amber-800 dark:text-amber-300 leading-tight"
              />
              <EditableText
                value={item.attachment.title}
                onCommit={onUpdateAttachmentTitle}
                placeholder="Attachment description"
                className="text-xs font-medium text-amber-950/85 dark:text-amber-100/90 leading-tight mt-0.5"
              />
            </div>
          </div>
        )}

        {/* Quick Add Point action on hover */}
        <div className="mt-2.5 flex items-center gap-3">
          <button
            type="button"
            onClick={() => onAddBullet()}
            className="inline-flex items-center gap-1 text-[11px] font-medium text-[var(--muted)] hover:text-[var(--ink)] transition-colors cursor-pointer opacity-0 group-hover:opacity-100 focus:opacity-100"
          >
            <Plus className="size-3" />
            <span>Add point</span>
          </button>
        </div>
      </div>
    </Reorder.Item>
  );
}

const SLIDE_TITLES = [
  "Executive overview",
  "The story so far",
  "Market context",
  "Strategic priorities",
  "Customer signals",
  "Performance snapshot",
  "Growth opportunities",
  "Product roadmap",
  "Operating model",
  "Next steps",
  "Appendix",
  "Sources",
];

const TOOLBAR_ITEMS = [
  { id: "add", label: "Add slide", icon: Plus },
  { id: "quote", label: "Add slide to chat", icon: Quote },
  { id: "image", label: "Replace image", icon: ImageIcon },
  { id: "chart", label: "Add chart", icon: PieChart },
  { id: "align", label: "Align content", icon: AlignLeft },
  { id: "magic", label: "Enhance slide", icon: Sparkles },
  { id: "columns", label: "Change layout", icon: Columns2 },
  { id: "notes", label: "Edit speaker notes", icon: NotebookPen },
];

const EXAMPLE_SLIDE_IMAGES = [
  "/example%20presentation/1.png",
  "/example%20presentation/2.png",
  "/example%20presentation/3.png",
  "/example%20presentation/4.png",
  "/example%20presentation/5.png",
  "/example%20presentation/6.png",
  "/example%20presentation/7.png",
  "/example%20presentation/8.png",
  "/example%20presentation/9.png",
  "/example%20presentation/10.png",
];

function getSlideImage(number: number): string {
  const index = Math.max(0, number - 1) % EXAMPLE_SLIDE_IMAGES.length;
  return EXAMPLE_SLIDE_IMAGES[index];
}

function SlidePreview({
  number,
  image,
  title,
  compact = false,
  delay = 0,
}: {
  number: number;
  image?: string;
  title?: string;
  compact?: boolean;
  delay?: number;
}) {
  const [loadedSrc, setLoadedSrc] = useState<string | null>(null);
  const [isReadyToLoad, setIsReadyToLoad] = useState(delay === 0);

  const imgSrc = image || getSlideImage(number);
  const isLoaded = loadedSrc === imgSrc && isReadyToLoad;

  useEffect(() => {
    if (delay > 0) {
      const timer = setTimeout(() => {
        setIsReadyToLoad(true);
      }, delay);
      return () => clearTimeout(timer);
    }
  }, [delay]);

  return (
    <div className="relative size-full overflow-hidden bg-[#f4f2ee] dark:bg-[#1a1a1d] select-none">
      {/* Loading Skeleton Shimmer with a little bit of loading */}
      {!isLoaded && (
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-[#f0ede8] dark:bg-[#202024] animate-pulse">
          <div className="size-4.5 rounded-full border-2 border-[var(--muted)]/25 border-t-[var(--ink)] animate-spin mb-1" />
          {!compact && (
            <span className="font-mono text-[10px] text-[var(--muted)] tracking-wider">
              Rendering slide {number}...
            </span>
          )}
        </div>
      )}

      {/* Real Slide Image from public/example presentation */}
      {isReadyToLoad && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={imgSrc}
          alt={title || `Slide ${number}`}
          onLoad={() => setLoadedSrc(imgSrc)}
          className={cn(
            "size-full object-cover object-center transition-all duration-400 ease-out",
            isLoaded ? "opacity-100 scale-100" : "opacity-0 scale-[1.02]"
          )}
          loading="eager"
        />
      )}

      {/* Slide number watermark in bottom right if not compact */}
      {!compact && isLoaded && (
        <div className="absolute bottom-[4%] right-[4%] rounded bg-black/45 px-1.5 py-0.5 font-mono text-[10px] font-medium text-white/90 backdrop-blur-xs select-none">
          {number.toString().padStart(2, "0")}
        </div>
      )}
    </div>
  );
}

function formatTimestamp(creationTime: number) {
  return new Date(creationTime).toLocaleString([], {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

function getMessageText(message: ChatMessage) {
  return message.parts
    .filter((part): part is Extract<MessagePart, { type: "text" }> => part.type === "text")
    .map((part) => part.text)
    .join("\n\n");
}

function StepConnector() {
  return <div className="w-px h-3.5 bg-[var(--border)] ml-[6.5px] my-1 shrink-0" />;
}

function MessageStep({
  step,
  animate,
  isExpanded,
  onToggle,
}: {
  step: StepPart;
  animate: boolean;
  isExpanded: boolean;
  onToggle: () => void;
}) {
  const isRunning = step.status === "running";
  const hasSources = !!step.sources && step.sources.length > 0;
  const hasTemplate = !isRunning && !!step.template;
  const isExpandable = hasSources || hasTemplate;

  const header = (
    <>
      <div className="flex size-3.5 items-center justify-center shrink-0">
        {isRunning ? (
          <div className="size-3.5 rounded-full border-2 border-[var(--accent)] border-t-transparent animate-spin" />
        ) : (
          React.createElement(STEP_ICONS[step.icon] ?? Sparkles, {
            className: cn("size-3.5", step.tone === "success" ? "text-emerald-500" : "text-[var(--muted)]"),
          })
        )}
      </div>
      <span className={isRunning ? "text-[var(--accent)] font-medium" : "text-[var(--muted)] font-medium"}>
        {step.label}
      </span>
    </>
  );

  if (!isExpandable) {
    return <div className="flex items-center gap-2 text-xs font-medium text-[var(--muted)]">{header}</div>;
  }

  return (
    <div className="flex flex-col text-start">
      <button
        type="button"
        onClick={onToggle}
        className="flex items-center gap-2 text-xs font-medium text-[var(--muted)] hover:text-[var(--ink)] transition-colors cursor-pointer text-left"
      >
        {header}
        <ChevronDown
          className={cn("size-3 text-[var(--muted)] transition-transform ml-0.5", isExpanded ? "rotate-180" : "")}
        />
      </button>

      {isExpanded && hasSources && (
        <div className="space-y-1.5 pt-2 pl-5.5">
          {step.sources!.map((source) => (
            <div
              key={`${source.domain}-${source.title}`}
              className={cn(
                "flex items-center justify-between rounded-xl bg-[var(--paper)] px-3 py-2 shadow-2xs",
                animate && "animate-in fade-in duration-200"
              )}
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <span className="truncate text-xs font-medium text-[var(--ink)]">{source.title}</span>
              </div>
              <span className="text-[10px] text-[var(--muted)] shrink-0 pl-2">{source.domain}</span>
            </div>
          ))}
        </div>
      )}

      {isExpanded && hasTemplate && (
        <div className="pt-2 pl-5.5">
          <div className="flex items-center justify-between rounded-xl bg-[var(--paper)] px-3 py-2 border border-[var(--border)]/50 text-xs">
            <span className="font-medium text-[var(--ink)]">{step.template}</span>
            <span className="text-[10px] text-[var(--muted)]">Active Template</span>
          </div>
        </div>
      )}
    </div>
  );
}

/** Renders a message's text and step parts as one connected timeline. */
function MessageParts({
  messageId,
  parts,
  animate,
  collapsedSteps,
  onToggleStep,
}: {
  messageId: string;
  parts: MessagePart[];
  animate: boolean;
  collapsedSteps: Set<string>;
  onToggleStep: (stepKey: string) => void;
}) {
  return (
    <>
      {parts.map((part, index) => {
        const stepKey = part.type === "step" ? `${messageId}:${part.key}` : "";
        return (
          <React.Fragment key={part.type === "step" ? part.key : `text-${index}`}>
            {index > 0 && <StepConnector />}
            {part.type === "text" ? (
              <div className="py-1 text-start">
                <div className="prose prose-sm max-w-full text-start text-xs sm:text-[13px] text-[var(--ink)] leading-relaxed whitespace-pre-wrap">
                  <p>{renderFormattedText(part.text)}</p>
                </div>
              </div>
            ) : (
              <MessageStep
                step={part}
                animate={animate}
                isExpanded={!collapsedSteps.has(stepKey)}
                onToggle={() => onToggleStep(stepKey)}
              />
            )}
          </React.Fragment>
        );
      })}
    </>
  );
}

function PromptBubble({ message }: { message: ChatMessage }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const prompt = getMessageText(message);
  const isLongPrompt = prompt.length > 180 || prompt.split("\n").length > 3;

  return (
    <div className="relative w-full px-5 text-start self-start">
      <div className="w-full rounded-2xl bg-[#eef4ff] dark:bg-[#1c1c1f] p-4 sm:p-5 text-start shadow-xs border-0">
        {message.files && message.files.length > 0 && (
          <div className="mb-2 flex flex-wrap gap-1">
            {message.files.map((file, idx) => (
              <span
                key={idx}
                className="inline-flex items-center gap-1 rounded-md bg-black/10 dark:bg-white/10 px-2 py-0.5 text-[10px] text-inherit"
              >
                <FileText className="size-2.5" />
                <span className="truncate max-w-[160px]">{file}</span>
              </span>
            ))}
          </div>
        )}
        <div
          className={cn(
            "prose prose-sm max-w-none text-xs sm:text-[13px] text-[var(--ink)] leading-relaxed font-sans whitespace-pre-wrap",
            !isExpanded && isLongPrompt && "line-clamp-4"
          )}
        >
          {prompt}
        </div>
        {isLongPrompt && (
          <button
            type="button"
            onClick={() => setIsExpanded(!isExpanded)}
            className="mt-2.5 text-xs font-semibold text-[var(--muted)] hover:text-[var(--ink)] transition-colors cursor-pointer block"
          >
            {isExpanded ? "Show less" : "Show more"}
          </button>
        )}
      </div>
    </div>
  );
}

function CopyFooter({ text, timestamp }: { text: string; timestamp: number }) {
  return (
    <div className="flex h-6 items-center gap-2 pt-0.5">
      <button
        type="button"
        onClick={() => navigator.clipboard?.writeText(text)}
        className="cursor-pointer hover:text-[var(--ink)] transition-colors p-0.5"
        title="Copy"
      >
        <Copy className="size-3 text-[var(--muted)]" />
      </button>
      <span className="text-[10px] text-[var(--muted)] font-medium">{formatTimestamp(timestamp)}</span>
    </div>
  );
}

function WorkspaceLoading() {
  return (
    <div className="flex h-screen w-full flex-1 items-center justify-center bg-[var(--surface)]">
      <div className="size-5 rounded-full border-2 border-[var(--muted)]/25 border-t-[var(--ink)] animate-spin" />
    </div>
  );
}

function PresentationNotFound() {
  return (
    <div className="flex h-screen w-full flex-1 flex-col items-center justify-center gap-3 bg-[var(--surface)] px-6 text-center text-[var(--ink)]">
      <p className="text-sm font-medium">This presentation doesn&apos;t exist or you don&apos;t have access to it.</p>
      <Link
        href="/workspace/new-task"
        className="inline-flex items-center gap-1.5 rounded-full bg-[var(--light-gray)] px-3.5 py-1.5 text-xs font-medium hover:bg-[var(--light-gray-hover)] transition-colors"
      >
        <ArrowLeft className="size-3.5" />
        <span>Start a new presentation</span>
      </Link>
    </div>
  );
}

/** Full-screen preview of a template's pages as a carousel. */
function TemplatePreviewModal({
  templateName,
  images,
  initialIndex,
  onClose,
}: {
  templateName: string;
  images: string[];
  initialIndex: number;
  onClose: () => void;
}) {
  const [index, setIndex] = useState(initialIndex);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const thumbnailRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const touchStartXRef = useRef<number | null>(null);
  const lastIndex = images.length - 1;

  const goTo = useCallback(
    (next: number) => setIndex(Math.max(0, Math.min(lastIndex, next))),
    [lastIndex]
  );

  useEffect(() => {
    closeButtonRef.current?.focus();
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      else if (e.key === "ArrowRight") goTo(index + 1);
      else if (e.key === "ArrowLeft") goTo(index - 1);
      else return;
      e.preventDefault();
      e.stopPropagation();
    };
    window.addEventListener("keydown", handleKeyDown, true);
    return () => window.removeEventListener("keydown", handleKeyDown, true);
  }, [index, goTo, onClose]);

  useEffect(() => {
    thumbnailRefs.current[index]?.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
  }, [index]);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`${templateName} template preview`}
      className="fixed inset-0 z-[120] flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm animate-in fade-in duration-200"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="relative flex w-full max-w-5xl flex-col gap-4 rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-4 sm:p-6 text-[var(--ink)] shadow-[0_24px_80px_rgba(0,0,0,0.35)]">
        {/* Header */}
        <div className="flex items-center justify-between gap-3">
          <div className="min-w-0">
            <div className="text-[11px] font-semibold uppercase tracking-wider text-[var(--muted)]">Template</div>
            <div className="truncate font-['Figtree'] text-base font-semibold">{templateName}</div>
          </div>
          <div className="flex items-center gap-3">
            <span className="font-mono text-xs text-[var(--muted)]" aria-live="polite">
              {index + 1} / {images.length}
            </span>
            <button
              ref={closeButtonRef}
              type="button"
              onClick={onClose}
              className="inline-flex size-8 items-center justify-center rounded-full text-[var(--muted)] hover:bg-[var(--light-gray)] hover:text-[var(--ink)] transition-colors cursor-pointer"
              aria-label="Close template preview"
            >
              <X className="size-4" />
            </button>
          </div>
        </div>

        {/* Carousel */}
        <div className="relative">
          <div
            className="overflow-hidden rounded-2xl border border-[var(--border)] bg-[#f4f2ee] dark:bg-[#1a1a1d]"
            onTouchStart={(e) => {
              touchStartXRef.current = e.touches[0]?.clientX ?? null;
            }}
            onTouchEnd={(e) => {
              const startX = touchStartXRef.current;
              const endX = e.changedTouches[0]?.clientX;
              touchStartXRef.current = null;
              if (startX === null || endX === undefined || Math.abs(endX - startX) < 40) return;
              goTo(endX < startX ? index + 1 : index - 1);
            }}
          >
            <div
              className="flex transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]"
              style={{ transform: `translateX(-${index * 100}%)` }}
            >
              {images.map((src, idx) => (
                <div
                  key={src}
                  className="aspect-video w-full shrink-0"
                  aria-hidden={idx !== index}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={src}
                    alt={`${templateName} page ${idx + 1}`}
                    className="size-full object-contain select-none"
                    draggable={false}
                  />
                </div>
              ))}
            </div>
          </div>

          <button
            type="button"
            onClick={() => goTo(index - 1)}
            disabled={index === 0}
            className="absolute left-3 top-1/2 -translate-y-1/2 inline-flex size-9 items-center justify-center rounded-full bg-black/55 text-white backdrop-blur-md transition-opacity hover:bg-black/75 disabled:opacity-0 disabled:pointer-events-none cursor-pointer"
            aria-label="Previous page"
          >
            <ChevronLeft className="size-4.5" />
          </button>
          <button
            type="button"
            onClick={() => goTo(index + 1)}
            disabled={index === lastIndex}
            className="absolute right-3 top-1/2 -translate-y-1/2 inline-flex size-9 items-center justify-center rounded-full bg-black/55 text-white backdrop-blur-md transition-opacity hover:bg-black/75 disabled:opacity-0 disabled:pointer-events-none cursor-pointer"
            aria-label="Next page"
          >
            <ChevronRight className="size-4.5" />
          </button>
        </div>

        {/* Thumbnail strip */}
        <div className="flex gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {images.map((src, idx) => (
            <button
              key={src}
              ref={(el) => {
                thumbnailRefs.current[idx] = el;
              }}
              type="button"
              onClick={() => goTo(idx)}
              className={cn(
                "relative aspect-video w-24 shrink-0 overflow-hidden rounded-lg border transition-colors cursor-pointer",
                idx === index
                  ? "border-[var(--accent)] ring-2 ring-[var(--accent)]/25"
                  : "border-[var(--border)] opacity-70 hover:opacity-100"
              )}
              aria-label={`Show page ${idx + 1}`}
              aria-current={idx === index ? "true" : undefined}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={src} alt="" className="size-full object-cover" draggable={false} />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function PresentationPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { isLoading: isAuthLoading, isAuthenticated } = useConvexAuth();
  const data = useQuery(api.presentations.get, isAuthenticated ? { id } : "skip");

  if (isAuthLoading || (isAuthenticated && data === undefined)) return <WorkspaceLoading />;
  if (!data) return <PresentationNotFound />;
  return <PresentationWorkspace key={data.presentation._id} routeId={id} data={data} />;
}

/** Applies `update` to the cached outline so edits show instantly before the server confirms. */
function updateCachedOutline(
  localStore: OptimisticLocalStore,
  routeId: string,
  update: (outline: OutlineSlide[]) => OutlineSlide[]
) {
  const current = localStore.getQuery(api.presentations.get, { id: routeId });
  if (!current) return;
  const outline = update(current.outline).map((slide, position) => ({ ...slide, position }));
  localStore.setQuery(api.presentations.get, { id: routeId }, { ...current, outline });
}

function updateCachedSlide(
  localStore: OptimisticLocalStore,
  routeId: string,
  slideId: Id<"outlineSlides">,
  update: (slide: OutlineSlide) => OutlineSlide
) {
  updateCachedOutline(localStore, routeId, (outline) =>
    outline.map((slide) => (slide._id === slideId ? update(slide) : slide))
  );
}

function optimisticAddSlide(routeId: string) {
  return (store: OptimisticLocalStore, args: FunctionArgs<typeof api.outline.addSlide>) =>
    updateCachedOutline(store, routeId, (current) => {
      const next = [...current];
      next.splice(Math.max(0, Math.min(args.index, next.length)), 0, {
        _id: `optimistic-${crypto.randomUUID()}` as Id<"outlineSlides">,
        _creationTime: Date.now(),
        presentationId: args.presentationId,
        position: args.index,
        title: args.title,
        bullets: args.bullets,
        attachment: args.attachment,
      });
      return next;
    });
}

function updateCachedSlides(
  localStore: OptimisticLocalStore,
  routeId: string,
  update: (slides: PresentationSlide[]) => PresentationSlide[]
) {
  const current = localStore.getQuery(api.presentations.get, { id: routeId });
  if (!current) return;
  const slides = update(current.slides).map((slide, position) => ({ ...slide, position }));
  localStore.setQuery(api.presentations.get, { id: routeId }, { ...current, slides });
}

function optimisticAddPresentationSlide(routeId: string) {
  return (store: OptimisticLocalStore, args: FunctionArgs<typeof api.slides.addSlide>) =>
    updateCachedSlides(store, routeId, (current) => {
      const next = [...current];
      next.splice(Math.max(0, Math.min(args.index, next.length)), 0, {
        _id: `optimistic-${crypto.randomUUID()}` as Id<"presentationSlides">,
        _creationTime: Date.now(),
        presentationId: args.presentationId,
        position: args.index,
        title: args.title,
        templateSlide: args.templateSlide,
      });
      return next;
    });
}

function optimisticSendMessage(routeId: string) {
  return (store: OptimisticLocalStore, args: FunctionArgs<typeof api.messages.send>) => {
    const current = store.getQuery(api.presentations.get, { id: routeId });
    if (!current) return;
    const optimisticMessage: ChatMessage = {
      _id: `optimistic-${crypto.randomUUID()}` as Id<"messages">,
      _creationTime: Date.now(),
      presentationId: args.presentationId,
      role: "user",
      kind: "chat",
      parts: [{ type: "text", text: args.text }],
      status: "complete",
      files: args.files && args.files.length > 0 ? args.files : undefined,
      slides: args.slides && args.slides.length > 0 ? args.slides : undefined,
      model: args.model,
    };
    store.setQuery(api.presentations.get, { id: routeId }, {
      ...current,
      messages: [...current.messages, optimisticMessage],
    });
  };
}

type SlideContent = Pick<OutlineSlide, "title" | "bullets" | "attachment">;

function PresentationWorkspace({ routeId, data }: { routeId: string; data: WorkspaceData }) {
  const { presentation, messages, outline, slides: savedSlides } = data;
  const presentationId = presentation._id;
  const { theme, toggleTheme } = useWorkspaceTheme();
  const title = presentation.title;
  const isGenerating = presentation.status === "generating";
  const hasPresentation = presentation.status === "presentation_ready";
  // The chat takes the full screen only while the first pass is drafting the outline.
  const isFullscreenChat = isGenerating;

  // Entrance animations belong to the first pass. A page opened after it finished
  // renders straight from the database with nothing replayed.
  const [isLiveSession] = useState(isGenerating);
  const [initialMessageIds] = useState(() => new Set(messages.map((m) => m._id)));
  const [loadedWithPresentation] = useState(hasPresentation);

  // Pulse the outline briefly when it lands, only when it lands while we watch.
  const [observedStatus, setObservedStatus] = useState(presentation.status);
  const [isDraftingOutline, setIsDraftingOutline] = useState(false);
  if (observedStatus !== presentation.status) {
    setObservedStatus(presentation.status);
    if (observedStatus === "generating") setIsDraftingOutline(true);
  }
  useEffect(() => {
    if (!isDraftingOutline) return;
    const timer = setTimeout(() => setIsDraftingOutline(false), 1600);
    return () => clearTimeout(timer);
  }, [isDraftingOutline]);

  const [collapsedSteps, setCollapsedSteps] = useState<Set<string>>(() => new Set());
  const toggleStep = (stepKey: string) => {
    setCollapsedSteps((prev) => {
      const next = new Set(prev);
      if (next.has(stepKey)) next.delete(stepKey);
      else next.add(stepKey);
      return next;
    });
  };

  const [isGeneratingPresentation, setIsGeneratingPresentation] = useState(false);
  const [templatePreviewIndex, setTemplatePreviewIndex] = useState<number | null>(null);
  const templateName = presentation.templateName ?? "Account Health QBR";

  // While dragging, the outline order lives here; it is saved when the drag ends.
  const [dragOrder, setDragOrder] = useState<Id<"outlineSlides">[] | null>(null);
  const dragOrderRef = useRef<Id<"outlineSlides">[] | null>(null);
  const outlineItems = React.useMemo(() => {
    if (!dragOrder) return outline;
    const byId = new Map(outline.map((slide) => [slide._id, slide]));
    const ordered = dragOrder
      .map((slideId) => byId.get(slideId))
      .filter((slide): slide is OutlineSlide => !!slide);
    return ordered.length === outline.length ? ordered : outline;
  }, [outline, dragOrder]);

  // Generated slides are their own records; `id` is the 1-based position used for navigation.
  const slides = React.useMemo(
    () =>
      savedSlides.map((slide, index) => ({
        id: index + 1,
        slideId: slide._id,
        title: slide.title,
        templateSlide: slide.templateSlide,
      })),
    [savedSlides]
  );

  const [activeTab, setActiveTab] = useState<"presentation" | "outline">(
    hasPresentation ? "presentation" : "outline"
  );
  const [currentSlide, setCurrentSlide] = useState(1);
  const [sidebarViewMode, setSidebarViewMode] = useState<"grid" | "list">("grid");
  const [deletedHistory, setDeletedHistory] = useState<
    Array<{ slide: { title: string; templateSlide: number }; index: number }>
  >([]);
  const [deleteAlert, setDeleteAlert] = useState<{ slideNumber: number; slideTitle: string } | null>(null);
  const [inputMessage, setInputMessage] = useState("");
  const [attachedFiles, setAttachedFiles] = useState<File[]>([]);
  const [selectedModel, setSelectedModel] = useState<ChatModel>(
    () => MODELS.find((m) => m.id === presentation.model) ?? MODELS[0]
  );
  const [isModelDropdownOpen, setIsModelDropdownOpen] = useState(false);
  const [selectedSlides, setSelectedSlides] = useState<number[]>([]);
  const [openHeaderMenu, setOpenHeaderMenu] = useState<"play" | "download" | "share" | null>(null);
  const [allowDuplication, setAllowDuplication] = useState(true);
  const [linkCopied, setLinkCopied] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const canvasContainerRef = useRef<HTMLDivElement>(null);
  const thumbnailRefs = useRef<Record<number, HTMLButtonElement | null>>({});
  const wheelAccumulatorRef = useRef(0);
  const wheelTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const alertTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const updateTitleMutation = useMutation(api.outline.updateTitle).withOptimisticUpdate(
    (store, args) => updateCachedSlide(store, routeId, args.slideId, (s) => ({ ...s, title: args.title }))
  );
  const updateBulletMutation = useMutation(api.outline.updateBullet).withOptimisticUpdate(
    (store, args) =>
      updateCachedSlide(store, routeId, args.slideId, (s) => ({
        ...s,
        bullets: s.bullets.map((b, i) => (i === args.index ? args.text : b)),
      }))
  );
  const insertBulletMutation = useMutation(api.outline.insertBullet).withOptimisticUpdate(
    (store, args) =>
      updateCachedSlide(store, routeId, args.slideId, (s) => {
        const bullets = [...s.bullets];
        bullets.splice(Math.max(0, Math.min(args.index, bullets.length)), 0, "");
        return { ...s, bullets };
      })
  );
  const removeBulletMutation = useMutation(api.outline.removeBullet).withOptimisticUpdate(
    (store, args) =>
      updateCachedSlide(store, routeId, args.slideId, (s) => ({
        ...s,
        bullets: s.bullets.filter((_, i) => i !== args.index),
      }))
  );
  const updateAttachmentMutation = useMutation(api.outline.updateAttachment).withOptimisticUpdate(
    (store, args) =>
      updateCachedSlide(store, routeId, args.slideId, (s) =>
        s.attachment ? { ...s, attachment: { ...s.attachment, [args.field]: args.value } } : s
      )
  );
  const addSlideMutation = useMutation(api.outline.addSlide).withOptimisticUpdate(optimisticAddSlide(routeId));
  const deleteSlideMutation = useMutation(api.outline.deleteSlide).withOptimisticUpdate((store, args) =>
    updateCachedOutline(store, routeId, (current) => current.filter((s) => s._id !== args.slideId))
  );
  const reorderMutation = useMutation(api.outline.reorder).withOptimisticUpdate((store, args) =>
    updateCachedOutline(store, routeId, (current) => {
      const byId = new Map(current.map((s) => [s._id, s]));
      const ordered = args.slideIds.map((slideId) => byId.get(slideId)).filter((s): s is OutlineSlide => !!s);
      return ordered.length === current.length ? ordered : current;
    })
  );
  const markPresentationReady = useMutation(api.presentations.markPresentationReady);
  const addPresentationSlideMutation = useMutation(api.slides.addSlide).withOptimisticUpdate(
    optimisticAddPresentationSlide(routeId)
  );
  const deletePresentationSlideMutation = useMutation(api.slides.deleteSlide).withOptimisticUpdate(
    (store, args) =>
      updateCachedSlides(store, routeId, (current) => current.filter((s) => s._id !== args.slideId))
  );
  const sendMessageMutation = useMutation(api.messages.send).withOptimisticUpdate(optimisticSendMessage(routeId));
  const isSavedSlide = (slide: OutlineSlide | undefined): slide is OutlineSlide =>
    !!slide && !slide._id.startsWith("optimistic-");

  const updateTitle = (index: number, newTitle: string) => {
    const slide = outlineItems[index];
    if (isSavedSlide(slide)) void updateTitleMutation({ slideId: slide._id, title: newTitle });
  };

  const updateBullet = (slideIndex: number, bulletIndex: number, newText: string) => {
    const slide = outlineItems[slideIndex];
    if (isSavedSlide(slide)) void updateBulletMutation({ slideId: slide._id, index: bulletIndex, text: newText });
  };

  const addBullet = (slideIndex: number, afterIndex?: number) => {
    const slide = outlineItems[slideIndex];
    if (!isSavedSlide(slide)) return;
    const index = afterIndex !== undefined ? afterIndex + 1 : slide.bullets.length;
    void insertBulletMutation({ slideId: slide._id, index });
  };

  const removeBullet = (slideIndex: number, bulletIndex: number) => {
    const slide = outlineItems[slideIndex];
    if (isSavedSlide(slide)) void removeBulletMutation({ slideId: slide._id, index: bulletIndex });
  };

  const updateAttachmentType = (slideIndex: number, newType: string) => {
    const slide = outlineItems[slideIndex];
    if (isSavedSlide(slide)) void updateAttachmentMutation({ slideId: slide._id, field: "type", value: newType });
  };

  const updateAttachmentTitle = (slideIndex: number, newTitle: string) => {
    const slide = outlineItems[slideIndex];
    if (isSavedSlide(slide)) void updateAttachmentMutation({ slideId: slide._id, field: "title", value: newTitle });
  };

  const insertSlide = (index: number, content: SlideContent) =>
    addSlideMutation({
      presentationId,
      index,
      title: content.title,
      bullets: content.bullets,
      attachment: content.attachment,
    });

  const handleAddNewSlide = () => {
    const nextNum = outlineItems.length + 1;
    void insertSlide(outlineItems.length, {
      title: `Slide ${nextNum} Overview & Key Priorities`,
      bullets: [
        "Primary objective and strategic vector for this milestone.",
        "Operational readiness and cross-functional coordination.",
      ],
    });
  };

  const handleDeleteOutlineItem = (index: number) => {
    const slide = outlineItems[index];
    if (outlineItems.length <= 1 || !isSavedSlide(slide)) return;
    void deleteSlideMutation({ slideId: slide._id });
  };

  const handleReorder = (newOrder: Id<"outlineSlides">[]) => {
    dragOrderRef.current = newOrder;
    setDragOrder(newOrder);
  };

  const handleReorderEnd = () => {
    const order = dragOrderRef.current;
    dragOrderRef.current = null;
    if (order && order.every((slideId) => !slideId.startsWith("optimistic-"))) {
      void reorderMutation({ presentationId, slideIds: order });
    }
    setDragOrder(null);
  };

  const handleGeneratePresentation = () => {
    setIsGeneratingPresentation(true);
    setTimeout(async () => {
      try {
        await markPresentationReady({ presentationId });
        setCurrentSlide(1);
        setActiveTab("presentation");
      } catch (error) {
        console.error("Failed to generate presentation", error);
      } finally {
        setIsGeneratingPresentation(false);
      }
    }, 1000);
  };

  const currentSlideIndex = Math.max(0, slides.findIndex((s) => s.id === currentSlide));
  const currentSlideItem = slides[currentSlideIndex] || slides[0];
  const currentSlideNumber = currentSlideIndex + 1;

  const handleAddSlide = () => {
    const insertIndex = currentSlideIndex + 1;
    void addPresentationSlideMutation({
      presentationId,
      index: insertIndex,
      title: SLIDE_TITLES[insertIndex % SLIDE_TITLES.length] || `Slide ${insertIndex + 1}`,
      templateSlide: insertIndex + 1,
    });
    setCurrentSlide(insertIndex + 1);
  };

  const handleDeleteSlide = (slideIdToDelete?: number) => {
    const targetId = slideIdToDelete ?? currentSlide;
    const slideIndex = slides.findIndex((s) => s.id === targetId);
    const deletedSlide = slides[slideIndex];
    if (!deletedSlide || slides.length <= 1 || deletedSlide.slideId.startsWith("optimistic-")) return;

    const slideNumber = slideIndex + 1;

    setDeletedHistory((prev) => [
      ...prev,
      {
        slide: { title: deletedSlide.title, templateSlide: deletedSlide.templateSlide },
        index: slideIndex,
      },
    ]);

    void deletePresentationSlideMutation({ slideId: deletedSlide.slideId });
    setCurrentSlide(Math.min(slideIndex, slides.length - 2) + 1);

    setSelectedSlides((prev) => prev.filter((num) => num !== slideNumber));

    if (alertTimerRef.current) clearTimeout(alertTimerRef.current);
    setDeleteAlert({
      slideNumber,
      slideTitle: deletedSlide.title,
    });

    alertTimerRef.current = setTimeout(() => {
      setDeleteAlert(null);
    }, 8000);
  };

  const handleUndo = React.useCallback(() => {
    if (deletedHistory.length === 0) return;

    const lastEntry = deletedHistory[deletedHistory.length - 1];
    const updatedHistory = deletedHistory.slice(0, -1);
    setDeletedHistory(updatedHistory);

    const insertIndex = Math.min(lastEntry.index, slides.length);
    void addPresentationSlideMutation({
      presentationId,
      index: insertIndex,
      title: lastEntry.slide.title,
      templateSlide: lastEntry.slide.templateSlide,
    });
    setCurrentSlide(insertIndex + 1);

    if (alertTimerRef.current) clearTimeout(alertTimerRef.current);
    if (updatedHistory.length > 0) {
      const prevEntry = updatedHistory[updatedHistory.length - 1];
      setDeleteAlert({
        slideNumber: prevEntry.index + 1,
        slideTitle: prevEntry.slide.title,
      });
      alertTimerRef.current = setTimeout(() => {
        setDeleteAlert(null);
      }, 8000);
    } else {
      setDeleteAlert(null);
    }
  }, [deletedHistory, slides.length, addPresentationSlideMutation, presentationId]);

  // Keyboard shortcut Ctrl + Z / Cmd + Z for undoing slide deletion
  useEffect(() => {
    const handleUndoKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      const isInput =
        target &&
        (target.tagName === "INPUT" ||
          target.tagName === "TEXTAREA" ||
          target.isContentEditable);

      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "z" && !e.shiftKey) {
        if (!isInput && deletedHistory.length > 0) {
          e.preventDefault();
          handleUndo();
        }
      }
    };

    window.addEventListener("keydown", handleUndoKeyDown);
    return () => window.removeEventListener("keydown", handleUndoKeyDown);
  }, [deletedHistory, handleUndo]);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatScrollContainerRef = useRef<HTMLDivElement>(null);
  const [showScrollBottom, setShowScrollBottom] = useState(false);
  const isUserScrolledUpRef = useRef(false);
  const hasScrolledInitiallyRef = useRef(false);

  const checkScrollPosition = useCallback(() => {
    const el = chatScrollContainerRef.current;
    if (!el) return;
    const distanceFromBottom = el.scrollHeight - el.scrollTop - el.clientHeight;
    const shouldShow = distanceFromBottom > 60;
    setShowScrollBottom(shouldShow);
    isUserScrolledUpRef.current = shouldShow;
  }, []);

  const handleScrollToBottom = useCallback(() => {
    isUserScrolledUpRef.current = false;
    const el = chatScrollContainerRef.current;
    if (el) {
      el.scrollTo({
        top: el.scrollHeight,
        behavior: "smooth",
      });
    } else {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, []);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const modelDropdownRef = useRef<HTMLDivElement>(null);
  const headerActionsRef = useRef<HTMLDivElement>(null);
  const playCloseTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const copyFeedbackTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Auto-scroll chat to bottom when messages change (respecting user scroll position).
  // The first scroll after opening is instant so a saved chat doesn't animate in.
  useEffect(() => {
    if (!hasScrolledInitiallyRef.current) {
      hasScrolledInitiallyRef.current = true;
      messagesEndRef.current?.scrollIntoView({ behavior: "auto" });
      return;
    }
    if (!isUserScrolledUpRef.current) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    } else {
      checkScrollPosition();
    }
  }, [messages, checkScrollPosition]);

  // Wheel navigation on slide canvas: immediate slide transitions without waiting
  useEffect(() => {
    if (activeTab !== "presentation") return;

    const container = canvasContainerRef.current;
    if (!container) return;

    const handleWheel = (e: WheelEvent) => {
      // Prevent parent scroll / browser bounce
      e.preventDefault();

      if (e.deltaY === 0) return;

      const direction = e.deltaY > 0 ? 1 : -1;
      const isMouseWheel = e.deltaMode !== 0 || Math.abs(e.deltaY) >= 30;

      if (isMouseWheel) {
        // Discrete mouse wheel notch: immediately change active slide without waiting
        const steps =
          e.deltaMode !== 0
            ? Math.max(1, Math.round(Math.abs(e.deltaY)))
            : Math.max(1, Math.round(Math.abs(e.deltaY) / 100));

        setCurrentSlide((prev) => {
          const idx = slides.findIndex((s) => s.id === prev);
          if (idx === -1) return prev;
          const targetIdx =
            direction > 0
              ? Math.min(slides.length - 1, idx + steps)
              : Math.max(0, idx - steps);
          return slides[targetIdx]?.id ?? prev;
        });
        wheelAccumulatorRef.current = 0;
      } else {
        // Trackpad continuous scrolling: responsive accumulation without artificial delays
        wheelAccumulatorRef.current += e.deltaY;

        if (wheelTimeoutRef.current) clearTimeout(wheelTimeoutRef.current);
        wheelTimeoutRef.current = setTimeout(() => {
          wheelAccumulatorRef.current = 0;
        }, 150);

        const TRACKPAD_STEP = 35;
        if (wheelAccumulatorRef.current >= TRACKPAD_STEP) {
          const steps = Math.floor(wheelAccumulatorRef.current / TRACKPAD_STEP);
          setCurrentSlide((prev) => {
            const idx = slides.findIndex((s) => s.id === prev);
            if (idx === -1) return prev;
            const targetIdx = Math.min(slides.length - 1, idx + steps);
            return slides[targetIdx]?.id ?? prev;
          });
          wheelAccumulatorRef.current -= steps * TRACKPAD_STEP;
        } else if (wheelAccumulatorRef.current <= -TRACKPAD_STEP) {
          const steps = Math.floor(Math.abs(wheelAccumulatorRef.current) / TRACKPAD_STEP);
          setCurrentSlide((prev) => {
            const idx = slides.findIndex((s) => s.id === prev);
            if (idx === -1) return prev;
            const targetIdx = Math.max(0, idx - steps);
            return slides[targetIdx]?.id ?? prev;
          });
          wheelAccumulatorRef.current += steps * TRACKPAD_STEP;
        }
      }
    };

    container.addEventListener("wheel", handleWheel, { passive: false });
    return () => {
      container.removeEventListener("wheel", handleWheel);
      if (wheelTimeoutRef.current) clearTimeout(wheelTimeoutRef.current);
    };
  }, [activeTab, slides]);

  // Keep active thumbnail visible in the sidebar instantly without animation delay
  useEffect(() => {
    if (activeTab === "presentation") {
      const activeEl = thumbnailRefs.current[currentSlide];
      if (activeEl) {
        activeEl.scrollIntoView({
          behavior: "auto",
          block: "nearest",
        });
      }
    }
  }, [currentSlide, activeTab, sidebarViewMode]);

  // Keyboard navigation for presentation slides
  useEffect(() => {
    const handleKeyScroll = (e: KeyboardEvent) => {
      if (activeTab !== "presentation") return;
      const target = e.target as HTMLElement;
      if (
        target.tagName === "INPUT" ||
        target.tagName === "TEXTAREA" ||
        target.isContentEditable
      ) {
        return;
      }

      if (e.key === "ArrowDown" || e.key === "ArrowRight" || e.key === "PageDown") {
        e.preventDefault();
        setCurrentSlide((prev) => {
          const idx = slides.findIndex((s) => s.id === prev);
          if (idx === -1) return prev;
          const nextIdx = Math.min(slides.length - 1, idx + 1);
          return slides[nextIdx]?.id ?? prev;
        });
      } else if (e.key === "ArrowUp" || e.key === "ArrowLeft" || e.key === "PageUp") {
        e.preventDefault();
        setCurrentSlide((prev) => {
          const idx = slides.findIndex((s) => s.id === prev);
          if (idx === -1) return prev;
          const prevIdx = Math.max(0, idx - 1);
          return slides[prevIdx]?.id ?? prev;
        });
      }
    };

    window.addEventListener("keydown", handleKeyScroll);
    return () => window.removeEventListener("keydown", handleKeyScroll);
  }, [activeTab, slides]);

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      const target = event.target as Node;
      if (modelDropdownRef.current && !modelDropdownRef.current.contains(target)) {
        setIsModelDropdownOpen(false);
      }
      if (headerActionsRef.current && !headerActionsRef.current.contains(target)) {
        setOpenHeaderMenu(null);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpenHeaderMenu(null);
        setIsModelDropdownOpen(false);
      }
    };
    const handleViewportChange = () => setOpenHeaderMenu(null);
    document.addEventListener("mousedown", handleOutsideClick);
    document.addEventListener("keydown", handleKeyDown);
    window.addEventListener("resize", handleViewportChange);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
      document.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("resize", handleViewportChange);
      if (playCloseTimerRef.current) clearTimeout(playCloseTimerRef.current);
      if (copyFeedbackTimerRef.current) clearTimeout(copyFeedbackTimerRef.current);
      if (alertTimerRef.current) clearTimeout(alertTimerRef.current);
    };
  }, []);

  const toggleSlideInChat = (slideNumber: number) => {
    setSelectedSlides((previous) =>
      previous.includes(slideNumber)
        ? previous.filter((number) => number !== slideNumber)
        : [...previous, slideNumber].sort((a, b) => a - b)
    );
  };

  const openPlayMenu = () => {
    if (playCloseTimerRef.current) clearTimeout(playCloseTimerRef.current);
    setOpenHeaderMenu((current) => (current === null || current === "play" ? "play" : current));
  };

  const schedulePlayMenuClose = () => {
    if (playCloseTimerRef.current) clearTimeout(playCloseTimerRef.current);
    playCloseTimerRef.current = setTimeout(() => {
      setOpenHeaderMenu((current) => (current === "play" ? null : current));
    }, 120);
  };

  const copyShareLink = async () => {
    const shareUrl = `https://zicdeck.app/presentation/share/${presentationId}`;
    try {
      await navigator.clipboard.writeText(shareUrl);
      if (copyFeedbackTimerRef.current) clearTimeout(copyFeedbackTimerRef.current);
      setLinkCopied(true);
      copyFeedbackTimerRef.current = setTimeout(() => setLinkCopied(false), 1400);
    } catch {
      setLinkCopied(false);
    }
  };

  const handleSendMessage = (text: string, files?: File[], slideNumbers: number[] = []) => {
    if (!text.trim() && (!files || files.length === 0) && slideNumbers.length === 0) return;

    isUserScrolledUpRef.current = false;
    void sendMessageMutation({
      presentationId,
      text,
      files: files?.map((f) => f.name),
      slides: slideNumbers,
      model: selectedModel.id,
      currentSlideNumber,
    });
  };

  return (
    <div className="relative flex h-screen w-full min-w-0 flex-1 overflow-hidden bg-[var(--surface)] text-[var(--ink)]">
      {templatePreviewIndex !== null && (
        <TemplatePreviewModal
          templateName={templateName}
          images={EXAMPLE_SLIDE_IMAGES}
          initialIndex={templatePreviewIndex}
          onClose={() => setTemplatePreviewIndex(null)}
        />
      )}

      {/* Alert at top middle for Undo */}
      {deleteAlert && (
        <div
          role="status"
          aria-live="polite"
          className="fixed top-5 left-1/2 -translate-x-1/2 z-[100] flex items-center gap-3 rounded-full border border-[var(--border)] bg-[var(--surface)] px-4 py-2 text-xs font-medium text-[var(--ink)] shadow-[0_12px_36px_rgba(0,0,0,0.12)] dark:shadow-[0_18px_50px_rgba(0,0,0,0.5)] backdrop-blur-md transition-all animate-in fade-in slide-in-from-top-3 duration-200"
        >
          <span className="text-[var(--muted)]">
            Slide {deleteAlert.slideNumber} has been deleted.
          </span>
          <button
            type="button"
            onClick={handleUndo}
            className="font-semibold underline underline-offset-4 text-[var(--ink)] hover:opacity-75 transition-opacity cursor-pointer flex items-center gap-1.5"
          >
            <RotateCcw className="size-3" />
            <span>Undo action</span>
          </button>
          <button
            type="button"
            onClick={() => setDeleteAlert(null)}
            className="ml-0.5 inline-flex size-5 items-center justify-center rounded-full text-[var(--muted)] hover:bg-[var(--light-gray)] hover:text-[var(--ink)] transition-colors cursor-pointer"
            aria-label="Dismiss alert"
          >
            <X className="size-3" />
          </button>
        </div>
      )}

      {/* ========================================================================= */}
      {/* LEFT SECTION: AI Chat (380px compact, borderless or fullscreen)          */}
      {/* ========================================================================= */}
      <div
        className={cn(
          "overflow-hidden relative z-10 flex flex-col h-screen transition-all duration-700 ease-in-out",
          isFullscreenChat
            ? "w-full max-w-full flex-1"
            : "w-full sm:w-[380px] flex-none"
        )}
      >
        <div className="h-full w-full overflow-hidden">
          <div className="flex size-full min-h-0 flex-col overflow-hidden bg-[var(--surface)] text-[var(--ink)]">
            {/* Top Header: h-12 borderless with back button, title, and history icon */}
            <div className="flex h-12 shrink-0 w-full items-center justify-between bg-[var(--surface)] px-4">
              <div className="flex items-center gap-2 min-w-0">
                <Link
                  href="/workspace/library"
                  className="inline-flex size-7 shrink-0 items-center justify-center rounded-full text-[var(--muted)] hover:bg-light-gray hover:text-[var(--ink)] transition-colors cursor-pointer"
                  aria-label="Back to library"
                >
                  <ArrowLeft className="size-4" />
                </Link>
                <div
                  className="text-[var(--ink)] text-sm font-medium font-['Figtree'] leading-5 truncate"
                  title={title}
                >
                  {title}
                </div>
              </div>
              <button
                type="button"
                className="inline-flex items-center justify-center size-7 cursor-pointer rounded-full p-[6px] text-[var(--ink)] hover:bg-light-gray transition-colors"
                title="History"
              >
                <History className="size-4 text-[var(--muted)]" />
              </button>
            </div>

            {/* Chat Messages Body */}
            <div className="flex min-h-0 flex-1 flex-col overflow-hidden items-center relative">
              {/* Top Gradient Fade to smoothly hide messages scrolling under header */}
              <div
                aria-hidden="true"
                className="pointer-events-none absolute top-0 start-0 w-full h-3 bg-gradient-to-b from-[var(--surface)] via-[var(--surface)]/80 to-transparent z-20"
              />

              <div className="relative min-h-0 flex-1 overflow-hidden w-full">
                <div
                  ref={chatScrollContainerRef}
                  onScroll={checkScrollPosition}
                  className="relative w-full h-full overflow-hidden overflow-y-auto [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
                >
                  <div
                    className={cn(
                      "mx-auto flex flex-col pt-4 pb-8 text-start gap-4 transition-all duration-500",
                      isFullscreenChat
                        ? "max-w-[760px] w-full px-4 sm:px-6"
                        : "max-w-none w-full"
                    )}
                  >
                    {messages.map((msg) => {
                      // Only messages that arrive while this page is open animate in.
                      const animate = isLiveSession || !initialMessageIds.has(msg._id);

                      if (msg.kind === "prompt") {
                        return <PromptBubble key={msg._id} message={msg} />;
                      }

                      if (msg.kind === "generation") {
                        return (
                          <div
                            key={msg._id}
                            className={cn(
                              "relative w-full px-5 text-start group/card self-start",
                              animate && "animate-in fade-in duration-300"
                            )}
                          >
                            <MessageParts
                              messageId={msg._id}
                              parts={msg.parts}
                              animate={animate}
                              collapsedSteps={collapsedSteps}
                              onToggleStep={toggleStep}
                            />
                            {msg.status === "complete" && (
                              <div className="pt-1.5">
                                <CopyFooter text={getMessageText(msg)} timestamp={msg._creationTime} />
                              </div>
                            )}
                          </div>
                        );
                      }

                      return (
                        <div
                          key={msg._id}
                          className={cn(
                            "relative w-full px-5 text-start group/card hover:z-10 self-start",
                            animate && "animate-in fade-in duration-300"
                          )}
                        >
                          {msg.role === "assistant" ? (
                            <>
                              <div className="flex gap-2 items-center pt-1 pb-1">
                                <div className="size-5 rounded-md flex items-center justify-center shrink-0">
                                  <Image
                                    src="/logo.svg"
                                    alt="ZicDeck"
                                    width={16}
                                    height={16}
                                    className={cn(
                                      "size-4 object-contain",
                                      theme === "dark" ? "invert brightness-200" : ""
                                    )}
                                  />
                                </div>
                                <span className="text-xs text-[var(--muted)] font-medium font-['Figtree'] leading-5 whitespace-nowrap">
                                  ZicDeck Assistant
                                </span>
                              </div>
                              <div className="py-1 flex flex-col text-start">
                                <MessageParts
                                  messageId={msg._id}
                                  parts={msg.parts}
                                  animate={animate}
                                  collapsedSteps={collapsedSteps}
                                  onToggleStep={toggleStep}
                                />
                              </div>
                              <CopyFooter text={getMessageText(msg)} timestamp={msg._creationTime} />
                            </>
                          ) : (
                            <div className="flex flex-col items-end pt-1">
                              <div className="rounded-2xl rounded-tr-xs bg-[#ecece8] text-[var(--ink)] dark:bg-[#2a2a2d] dark:text-[#f3f3ee] px-3.5 py-2.5 text-[13px] leading-relaxed max-w-[90%] shadow-2xs">
                                {msg.slides && msg.slides.length > 0 && (
                                  <div className="mb-1.5 flex flex-wrap gap-1">
                                    {msg.slides.map((slideNumber) => (
                                      <span
                                        key={slideNumber}
                                        className="inline-flex items-center gap-1 rounded-md bg-black/10 px-2 py-0.5 text-[10px] dark:bg-white/10"
                                      >
                                        <PresentationIcon className="size-2.5" />
                                        Slide {slideNumber}
                                      </span>
                                    ))}
                                  </div>
                                )}
                                {msg.files && msg.files.length > 0 && (
                                  <div className="mb-1.5 flex flex-wrap gap-1">
                                    {msg.files.map((file, idx) => (
                                      <span
                                        key={idx}
                                        className="inline-flex items-center gap-1 rounded-md bg-black/10 dark:bg-white/10 px-2 py-0.5 text-[10px] text-inherit"
                                      >
                                        <FileText className="size-2.5" />
                                        <span className="truncate max-w-[120px]">{file}</span>
                                      </span>
                                    ))}
                                  </div>
                                )}
                                {getMessageText(msg).trim() && (
                                  <p className="whitespace-pre-wrap">{getMessageText(msg)}</p>
                                )}
                              </div>
                              <span className="text-[10px] text-[var(--muted)] font-medium mt-1 pr-1">
                                {formatTimestamp(msg._creationTime)}
                              </span>
                            </div>
                          )}
                        </div>
                      );
                    })}
                    <div ref={messagesEndRef} />
                  </div>
                </div>
              </div>

              {/* Scroll To Bottom / Jump to Latest Message Button */}
              <button
                type="button"
                onClick={handleScrollToBottom}
                aria-label="Scroll to latest message"
                aria-hidden={!showScrollBottom}
                tabIndex={showScrollBottom ? 0 : -1}
                className={cn(
                  "absolute bottom-3 left-1/2 -translate-x-1/2 z-30 flex size-8.5 items-center justify-center rounded-full border border-white/15 dark:border-white/10 bg-[#1c1c1f] dark:bg-[#222225] text-white shadow-[0_4px_16px_rgba(0,0,0,0.35)] transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] hover:bg-[#2a2a2e] hover:scale-105 active:scale-95 cursor-pointer",
                  showScrollBottom
                    ? "translate-y-0 opacity-100 pointer-events-auto scale-100"
                    : "translate-y-4 opacity-0 pointer-events-none scale-95"
                )}
              >
                <ArrowDown className="size-4 text-white" strokeWidth={2.2} />
              </button>

              {/* Bottom Gradient Fade */}
              <div
                aria-hidden="true"
                className="pointer-events-none absolute bottom-0 start-0 w-full h-5 bg-gradient-to-t from-[var(--surface)] via-[var(--surface)]/90 to-transparent z-20"
              />
            </div>

            {/* Input Box: Borderless Compact Rounded-2xl Container with soft shadow */}
            <div
              className={cn(
                "relative z-20 w-full shrink-0 p-4 pt-0 transition-all duration-500",
                isFullscreenChat
                  ? "max-w-[760px] mx-auto"
                  : "max-w-none"
              )}
            >
              <div className="relative z-20 w-full overflow-visible bg-white dark:bg-[rgba(255,255,255,0.04)] shadow-[0_4px_20px_rgba(0,0,0,0.05),0_1px_3px_rgba(0,0,0,0.03)] dark:shadow-none flex flex-col items-stretch gap-2 rounded-2xl min-h-36 max-h-96 py-3.5">
                {/* Textarea */}
                <div className="flex-1 flex flex-col items-start gap-1 overflow-hidden px-4">
                  <textarea
                    rows={2}
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        if (inputMessage.trim() || attachedFiles.length > 0 || selectedSlides.length > 0) {
                          handleSendMessage(inputMessage, attachedFiles, selectedSlides);
                          setInputMessage("");
                          setAttachedFiles([]);
                          setSelectedSlides([]);
                        }
                      }
                    }}
                    className="compact-scrollbar flex min-h-16 w-full p-0 rounded-none resize-none border-0 bg-transparent dark:bg-transparent text-sm placeholder:text-[var(--muted)]/70 shadow-none tracking-[0] focus:outline-none text-[var(--ink)] scrollbar-thin [scrollbar-width:thin] [scrollbar-color:var(--border)_transparent] [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-[var(--border)] hover:[&::-webkit-scrollbar-thumb]:bg-[var(--muted)]/50 [&::-webkit-scrollbar-button]:hidden"
                    placeholder="Describe your topic or idea, or upload your files (doc, pdf, pptx, txt)…"
                  />
                </div>

                {/* Slides referenced from the presentation */}
                {selectedSlides.length > 0 && (
                  <div className="flex max-h-24 gap-2 overflow-x-auto overflow-y-hidden px-4 pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                    {selectedSlides.map((slideNumber) => (
                      <div
                        key={slideNumber}
                        className="group relative h-[58px] w-[92px] shrink-0 overflow-hidden rounded-lg border border-[var(--border)] bg-[var(--paper)] shadow-sm"
                      >
                        <SlidePreview
                          number={slideNumber}
                          image={slides[slideNumber - 1] ? getSlideImage(slides[slideNumber - 1].templateSlide) : undefined}
                          title={slides[slideNumber - 1]?.title ?? SLIDE_TITLES[(slideNumber - 1) % SLIDE_TITLES.length]}
                          compact
                        />
                        <div className="absolute inset-x-0 bottom-0 flex items-center justify-between bg-gradient-to-t from-black/75 via-black/45 to-transparent px-1.5 pb-1 pt-3 text-[9px] font-semibold text-white">
                          <span>Slide {slideNumber}</span>
                          <button
                            type="button"
                            onClick={() => toggleSlideInChat(slideNumber)}
                            className="inline-flex size-4 items-center justify-center rounded-full bg-black/45 text-white opacity-80 transition hover:bg-black/70 hover:opacity-100"
                            aria-label={`Remove slide ${slideNumber} from chat`}
                          >
                            <X className="size-2.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Attached Files Badges */}
                {attachedFiles.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 px-4 pb-1">
                    {attachedFiles.map((file, idx) => (
                      <div
                        key={`${file.name}-${idx}`}
                        className="inline-flex items-center gap-1.5 rounded-lg bg-light-gray px-2 py-0.5 text-xs text-[var(--ink)]"
                      >
                        <FileText className="size-3 text-[var(--accent)]" />
                        <span className="max-w-[140px] truncate text-[11px] font-medium">
                          {file.name}
                        </span>
                        <button
                          type="button"
                          onClick={() => setAttachedFiles((prev) => prev.filter((_, i) => i !== idx))}
                          className="rounded p-0.5 text-[var(--muted)] hover:text-[var(--ink)] cursor-pointer"
                          aria-label={`Remove ${file.name}`}
                        >
                          <X className="size-2.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {/* Bottom Controls Bar */}
                <div className="flex items-center justify-between relative self-stretch w-full gap-2 px-3">
                  <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    accept=".png,.jpg,.jpeg,.gif,.webp,.bmp,.tiff,.ico,.svg,.pdf,.txt,.doc,.docx,.ppt,.pptx,.csv,.xls,.xlsx,.html,.md"
                    className="hidden"
                    onChange={(e) => {
                      if (e.target.files) {
                        setAttachedFiles((prev) => [...prev, ...Array.from(e.target.files!)]);
                        e.target.value = "";
                      }
                    }}
                  />
                  {/* Upload button icon in black / ink */}
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="inline-flex items-center justify-center whitespace-nowrap rounded-full font-medium transition-all size-7 hover:bg-light-gray cursor-pointer text-black dark:text-white"
                    title="Attach file"
                  >
                    <Paperclip className="size-4" />
                  </button>

                  {/* Free model text in black / ink */}
                  <div ref={modelDropdownRef} className="relative">
                    <button
                      type="button"
                      onClick={() => setIsModelDropdownOpen((prev) => !prev)}
                      className="inline-flex items-center justify-center whitespace-nowrap rounded-full font-medium transition-all hover:bg-light-gray px-2.5 h-7 py-0.5 gap-1 text-xs cursor-pointer text-black dark:text-white"
                    >
                      <span className="px-1 text-black dark:text-white text-xs font-medium font-['Figtree'] leading-5">
                        {selectedModel.name}
                      </span>
                      <ChevronDown className="size-3.5 text-black dark:text-white opacity-70 shrink-0" />
                    </button>

                    {isModelDropdownOpen && (
                      <div className="absolute bottom-full left-0 z-50 mb-2 min-w-[170px] overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--surface)] p-1 shadow-2xl text-[var(--ink)]">
                        {MODELS.map((m) => (
                          <button
                            key={m.id}
                            type="button"
                            onClick={() => {
                              setSelectedModel(m);
                              setIsModelDropdownOpen(false);
                            }}
                            className={cn(
                              "flex w-full items-center justify-between rounded-lg px-2.5 py-1.5 text-left text-xs transition-colors cursor-pointer",
                              m.id === selectedModel.id
                                ? "bg-light-gray font-medium text-[var(--ink)]"
                                : "text-[var(--muted)] hover:bg-light-gray hover:text-[var(--ink)]"
                            )}
                          >
                            <span>{m.name}</span>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="flex-1" />

                  <button
                    type="button"
                    disabled={!inputMessage.trim() && attachedFiles.length === 0 && selectedSlides.length === 0}
                    onClick={() => {
                      if (inputMessage.trim() || attachedFiles.length > 0 || selectedSlides.length > 0) {
                        handleSendMessage(inputMessage, attachedFiles, selectedSlides);
                        setInputMessage("");
                        setAttachedFiles([]);
                        setSelectedSlides([]);
                      }
                    }}
                    className="inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium transition-all size-8 rounded-full border border-transparent bg-[#14151a] dark:bg-white dark:text-[#14151a] text-white shadow-xs hover:opacity-90 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer flex-none active:scale-95"
                    aria-label="Send message"
                  >
                    <ArrowUp className="size-4 stroke-[2.2]" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* RIGHT SECTION: Canvas Area with 12px Padding & rounded-[20px] Container   */}
      {/* ========================================================================= */}
      <div
        className={cn(
          "relative flex min-w-0 flex-col overflow-hidden transition-all duration-700 ease-in-out",
          isFullscreenChat
            ? "w-0 flex-none opacity-0 p-0 pointer-events-none hidden"
            : "flex-1 opacity-100 p-[12px]"
        )}
      >
        <main className="relative flex min-w-0 flex-1 flex-col overflow-hidden rounded-[20px] bg-white dark:bg-workspace-content text-default transition-colors border border-[var(--border)] shadow-[0_10px_30px_rgba(20,21,26,0.06),0_1px_3px_rgba(20,21,26,0.03)] dark:shadow-[0_10px_40px_rgba(0,0,0,0.5)]">
          {/* Top Browser Style Tab Strip */}
          <div className="flex h-10 shrink-0 items-end overflow-x-auto bg-tab-bar">
            {/* Logo Element (Connected to main section, Google tabs style) */}
            <div className="relative flex h-[30px] mb-1 shrink-0 items-center justify-center  rounded-tl-lg rounded-tr-lg rounded-b-none text-default shadow-[0_-1px_10px_rgba(0,0,0,0.04)] ml-[12px]">
              {/* Logo Button matching Image 1 */}
              <Link
                href="/workspace/library"
                title="Back to library"
                className="flex size-7 items-center justify-center rounded-md bg-black/[0.04] dark:bg-white/[0.08] hover:bg-black/[0.08] dark:hover:bg-white/[0.14] transition-colors cursor-pointer"
              >
                <Image
                  src="/logo.svg"
                  alt="ZicDeck"
                  width={15}
                  height={15}
                  className={cn(
                    "size-3.5 object-contain",
                    theme === "dark" ? "invert brightness-200" : ""
                  )}
                />
              </Link>
            </div>

            {/* Outline Tab */}
            <button
              data-slot="button"
              type="button"
              onClick={() => setActiveTab("outline")}
              className={cn(
                "justify-center whitespace-nowrap rounded-full text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 [&_svg]:shrink-0 outline-none aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive disabled:cursor-not-allowed hover:text-dark dark:hover:text-default relative flex h-[36px] shrink-0 cursor-pointer items-center gap-1.5 rounded-tl-lg rounded-tr-lg rounded-b-none bg-transparent px-4 py-[4px] ml-3",
                activeTab === "outline"
                  ? "!bg-workspace-content text-default shadow-[0_-1px_10px_rgba(0,0,0,0.04)] hover:!bg-workspace-content dark:hover:!bg-workspace-content"
                  : "text-mute shadow-none hover:bg-white/40 dark:hover:bg-white/10"
              )}
            >
              {activeTab === "outline" && (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="12"
                  height="12"
                  fill="none"
                  viewBox="0 0 12 12"
                  className="pointer-events-none absolute -left-3 bottom-0 size-3 -scale-x-100 text-white dark:text-workspace-content"
                >
                  <path fill="currentColor" d="M0 12h12C5.373 12 0 6.627 0 0z" />
                </svg>
              )}
              <List className="size-3.5 shrink-0" />
              <span
                className={cn(
                  "max-w-[140px] truncate text-sm font-medium font-['Figtree'] leading-6",
                  activeTab === "outline" ? "text-default" : "text-mute"
                )}
              >
                Outline
              </span>
              {hasPresentation && activeTab === "presentation" && (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="12"
                  height="12"
                  fill="none"
                  viewBox="0 0 12 12"
                  className="pointer-events-none absolute end-0 bottom-0 size-3 -scale-x-100 text-white dark:text-workspace-content"
                >
                  <path fill="currentColor" d="M0 12h12C5.373 12 0 6.627 0 0z" />
                </svg>
              )}
            </button>

            {/* Presentation Tab */}
            {hasPresentation && (
              <button
                data-slot="button"
                type="button"
                onClick={() => setActiveTab("presentation")}
                className={cn(
                  "justify-center whitespace-nowrap rounded-full text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 [&_svg]:shrink-0 outline-none aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive disabled:cursor-not-allowed hover:text-dark dark:hover:text-default relative flex h-[36px] shrink-0 cursor-pointer items-center gap-1.5 rounded-tl-lg rounded-tr-lg rounded-b-none bg-transparent px-4 py-[4px]",
                  !loadedWithPresentation && "animate-in fade-in duration-300",
                  activeTab === "presentation"
                    ? "!bg-workspace-content text-default shadow-[0_-1px_10px_rgba(0,0,0,0.04)] hover:!bg-workspace-content dark:hover:!bg-workspace-content"
                    : "text-mute shadow-none hover:bg-white/40 dark:hover:bg-white/10"
                )}
              >
                <PresentationIcon className="size-3.5 shrink-0" />
                <span
                  className={cn(
                    "max-w-[140px] truncate text-sm font-medium font-['Figtree'] leading-6",
                    activeTab === "presentation" ? "text-default" : "text-mute"
                  )}
                >
                  Presentation
                </span>
                {activeTab === "outline" && (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="12"
                    height="12"
                    fill="none"
                    viewBox="0 0 12 12"
                    className="pointer-events-none absolute start-0 bottom-0 size-3 text-white dark:text-workspace-content"
                  >
                    <path fill="currentColor" d="M0 12h12C5.373 12 0 6.627 0 0z" />
                  </svg>
                )}
              </button>
            )}

            {hasPresentation && activeTab === "presentation" && (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="12"
                height="12"
                fill="none"
                viewBox="0 0 12 12"
                className="pointer-events-none size-3 shrink-0 self-end text-white dark:text-workspace-content"
              >
                <path fill="currentColor" d="M0 12h12C5.373 12 0 6.627 0 0z" />
              </svg>
            )}

            {!hasPresentation && (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="12"
                height="12"
                fill="none"
                viewBox="0 0 12 12"
                className="pointer-events-none size-3 shrink-0 self-end text-white dark:text-workspace-content"
              >
                <path fill="currentColor" d="M0 12h12C5.373 12 0 6.627 0 0z" />
              </svg>
            )}
          </div>

          {/* Main Workspace Body with Dotted Grid Background */}
          <div className="relative flex min-h-0 flex-1 flex-col overflow-hidden bg-dotted-grid">
            {/* Sub-toolbar under the tabs split with border-bottom */}
            <div className="relative z-30 flex p-[16px] shrink-0 items-center justify-between text-[var(--ink)] transition-colors">
            {!hasPresentation ? (
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-[var(--muted)]">Plan &amp; Outline</span>
              </div>
            ) : (
              /* Left: Change color buttons under the tab */
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  className="inline-flex h-7 items-center gap-1.5 rounded-full px-2.5 text-xs font-medium text-[var(--ink)] transition-colors hover:bg-[var(--light-gray)] cursor-pointer"
                >
                  <WandSparkles className="size-3.5 text-[var(--muted)]" strokeWidth={1.8} />
                  <span>Change color</span>
                </button>
                <button
                  type="button"
                  aria-label="Color palette"
                  title="Color palette"
                  className="inline-flex size-7 items-center justify-center rounded-full text-[var(--ink)] transition-colors hover:bg-[var(--light-gray)] cursor-pointer"
                >
                  <Palette className="size-3.5 text-[var(--muted)]" strokeWidth={1.7} />
                </button>
              </div>
            )}

            {!hasPresentation ? (
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={toggleTheme}
                  aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
                  title={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
                  className="inline-flex size-7 items-center justify-center rounded-full text-[var(--ink)] transition-colors hover:bg-[var(--light-gray)] cursor-pointer"
                >
                  {theme === "dark" ? <Sun className="size-3.5 text-[var(--muted)]" strokeWidth={1.8} /> : <Moon className="size-3.5 text-[var(--muted)]" strokeWidth={1.8} />}
                </button>
              </div>
            ) : (
              /* Right: Actions section */
              <div ref={headerActionsRef} className="flex min-w-0 items-center gap-1 sm:gap-1.5 text-[var(--ink)]">
              <div className="relative" onMouseEnter={openPlayMenu} onMouseLeave={schedulePlayMenuClose}>
                <button
                  type="button"
                  onClick={() => setOpenHeaderMenu((menu) => (menu === "play" ? null : "play"))}
                  className={cn(
                    "inline-flex size-7 items-center justify-center rounded-full transition-colors hover:bg-[var(--light-gray)] cursor-pointer",
                    openHeaderMenu === "play" && "bg-[var(--light-gray)]"
                  )}
                  aria-label="Present"
                  aria-haspopup="menu"
                  aria-expanded={openHeaderMenu === "play"}
                >
                  <Play className="size-3.5 text-[var(--muted)]" strokeWidth={1.7} />
                </button>
                {openHeaderMenu === "play" && (
                  <div
                    role="menu"
                    onMouseEnter={openPlayMenu}
                    onMouseLeave={schedulePlayMenuClose}
                    className="absolute right-0 top-[calc(100%+6px)] z-[80] w-[200px] max-w-[calc(100vw-24px)] overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-1.5 text-[var(--ink)] shadow-[0_18px_55px_rgba(20,21,26,.18)] dark:shadow-[0_18px_55px_rgba(0,0,0,.45)]"
                  >
                    {[
                      { label: "From the Start", icon: RotateCcw },
                      { label: "From Current Slide", icon: Play },
                      { label: "Speaker View", icon: MonitorPlay },
                    ].map(({ label, icon: Icon }) => (
                      <button
                        key={label}
                        type="button"
                        role="menuitem"
                        onClick={() => setOpenHeaderMenu(null)}
                        className="flex w-full items-center gap-2.5 rounded-xl px-2.5 py-1.5 text-left text-xs transition-colors hover:bg-[var(--light-gray)] cursor-pointer"
                      >
                        <Icon className="size-3.5 text-[var(--muted)]" strokeWidth={1.7} />
                        <span>{label}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div className="relative">
                <button
                  type="button"
                  onClick={() => setOpenHeaderMenu((menu) => (menu === "download" ? null : "download"))}
                  className={cn(
                    "inline-flex size-7 items-center justify-center rounded-full transition-colors hover:bg-[var(--light-gray)] cursor-pointer",
                    openHeaderMenu === "download" && "bg-[var(--light-gray)]"
                  )}
                  aria-label="Download"
                  aria-haspopup="menu"
                  aria-expanded={openHeaderMenu === "download"}
                >
                  <Download className="size-3.5 text-[var(--muted)]" strokeWidth={1.7} />
                </button>
                {openHeaderMenu === "download" && (
                  <div
                    role="menu"
                    className="absolute right-0 top-[calc(100%+6px)] z-[80] w-44 max-w-[calc(100vw-24px)] overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-1.5 text-[var(--ink)] shadow-[0_18px_55px_rgba(20,21,26,.18)] dark:shadow-[0_18px_55px_rgba(0,0,0,.45)]"
                  >
                    <div className="px-2 pb-1 pt-1 text-[9px] font-semibold uppercase tracking-[.12em] text-[var(--muted)]">Static file</div>
                    {[
                      { label: "PDF", icon: FileText },
                      { label: "PPTX", icon: PresentationIcon },
                      { label: "PNG", icon: FileImage },
                    ].map(({ label, icon: Icon }) => (
                      <button
                        key={label}
                        type="button"
                        role="menuitem"
                        onClick={() => setOpenHeaderMenu(null)}
                        className="flex w-full items-center gap-2 rounded-xl px-2 py-1.5 text-xs transition-colors hover:bg-[var(--light-gray)] cursor-pointer"
                      >
                        <Icon className="size-3.5 text-[var(--muted)]" strokeWidth={1.7} />
                        <span className="flex-1 text-left">{label}</span>
                      </button>
                    ))}
                    <div className="my-1 h-px bg-[var(--border)]" />
                    <div className="px-2 pb-1 pt-1 text-[9px] font-semibold uppercase tracking-[.12em] text-[var(--muted)]">Dynamic file</div>
                    <button
                      type="button"
                      role="menuitem"
                      onClick={() => setOpenHeaderMenu(null)}
                      className="flex w-full items-center gap-2 rounded-xl px-2 py-1.5 text-xs transition-colors hover:bg-[var(--light-gray)] cursor-pointer"
                    >
                      <Grid2X2 className="size-3.5 text-[var(--muted)]" strokeWidth={1.7} />
                      <span className="flex-1 text-left">HTML</span>
                      <span className="rounded-full border border-[var(--border)] bg-[var(--light-gray)] px-1.5 py-0.2 text-[8px] font-semibold text-[var(--muted)]">Beta</span>
                    </button>
                  </div>
                )}
              </div>

              <div className="flex items-center gap-0.5 rounded-full bg-[var(--paper)] px-1 py-0.5">
                <button
                  type="button"
                  onClick={() => {
                    if (currentSlideIndex > 0) {
                      setCurrentSlide(slides[currentSlideIndex - 1].id);
                    }
                  }}
                  disabled={currentSlideIndex <= 0}
                  className="inline-flex size-5 items-center justify-center rounded-full text-[var(--muted)] transition hover:bg-[var(--light-gray)] hover:text-[var(--ink)] disabled:opacity-30 cursor-pointer"
                  aria-label="Previous slide"
                >
                  <ChevronLeft className="size-3" />
                </button>
                <span className="min-w-9 text-center font-mono text-[10px] text-[var(--ink)]">{currentSlideNumber} / {slides.length}</span>
                <button
                  type="button"
                  onClick={() => {
                    if (currentSlideIndex < slides.length - 1) {
                      setCurrentSlide(slides[currentSlideIndex + 1].id);
                    }
                  }}
                  disabled={currentSlideIndex >= slides.length - 1}
                  className="inline-flex size-5 items-center justify-center rounded-full text-[var(--muted)] transition hover:bg-[var(--light-gray)] hover:text-[var(--ink)] disabled:opacity-30 cursor-pointer"
                  aria-label="Next slide"
                >
                  <ChevronRight className="size-3" />
                </button>
              </div>

              <button
                type="button"
                onClick={toggleTheme}
                aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
                title={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
                className="inline-flex size-7 items-center justify-center rounded-full text-[var(--ink)] transition-colors hover:bg-[var(--light-gray)] cursor-pointer"
              >
                {theme === "dark" ? <Sun className="size-3.5 text-[var(--muted)]" strokeWidth={1.8} /> : <Moon className="size-3.5 text-[var(--muted)]" strokeWidth={1.8} />}
              </button>

              <div className="relative ml-0.5">
                <button
                  type="button" 
                  onClick={() => setOpenHeaderMenu((menu) => (menu === "share" ? null : "share"))}
                  className="font-display inline-flex h-7 items-center justify-center rounded-full border border-white/10 bg-[#335cff] px-3 text-xs font-medium text-white shadow-[inset_0_0.5px_0_rgba(255,255,255,0.16),0_0px_0px_rgba(14,18,27,0.18),0_0_0_0.5px_#335cff] transition-colors hover:bg-[#2547d8] active:bg-[#2547d8] cursor-pointer"
                  aria-haspopup="dialog"
                  aria-expanded={openHeaderMenu === "share"}
                >
                  Share
                </button>
                {openHeaderMenu === "share" && (
                  <div
                    role="dialog"
                    aria-label="Share this file"
                    className="absolute right-0 top-[calc(100%+6px)] z-[80] w-[min(400px,calc(100vw-24px))] max-h-[calc(100vh-84px)] overflow-y-auto rounded-[24px] border border-[var(--border)] bg-[var(--surface)] p-5 text-[var(--ink)] shadow-[0_22px_70px_rgba(20,21,26,.2)] [-ms-overflow-style:none] [scrollbar-width:none] dark:shadow-[0_22px_70px_rgba(0,0,0,.5)] [&::-webkit-scrollbar]:hidden"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h2 className="font-display text-base font-semibold">Share this file</h2>
                        <p className="mt-0.5 text-xs text-[var(--muted)]">Manage access and share a presentation link.</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => setOpenHeaderMenu(null)}
                        className="inline-flex size-6 items-center justify-center rounded-full text-[var(--muted)] hover:bg-[var(--light-gray)] hover:text-[var(--ink)] cursor-pointer"
                        aria-label="Close share menu"
                      >
                        <X className="size-3.5" />
                      </button>
                    </div>
                    <div className="mt-4 flex items-center gap-3">
                      <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#2f8cff] to-[#b5e8ff] text-white shadow-sm">
                        <Globe2 className="size-4" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="text-xs font-semibold">Anyone with the link</div>
                        <div className="text-[11px] text-[var(--muted)]">Can view</div>
                      </div>
                      <button type="button" className="inline-flex h-8 items-center gap-1 rounded-full border border-[var(--border)] px-2.5 text-xs font-medium hover:bg-[var(--light-gray)] cursor-pointer">
                        Public <ChevronDown className="size-3" />
                      </button>
                    </div>
                    <div className="mt-3.5 flex h-10 items-center rounded-full border border-[var(--border)] bg-[var(--paper)] pl-3.5 pr-1 focus-within:border-[var(--accent)]">
                      <span className="min-w-0 flex-1 truncate text-xs text-[var(--muted)]">https://zicdeck.app/presentation/share/{presentationId}</span>
                      <div className="mx-2 h-5 w-px bg-[var(--border)]" />
                      <button
                        type="button"
                        onClick={copyShareLink}
                        className="inline-flex size-7 items-center justify-center rounded-full text-[var(--ink)] transition hover:bg-[var(--light-gray)] cursor-pointer"
                        aria-label="Copy share link"
                      >
                        {linkCopied ? <Check className="size-3.5 text-emerald-500" /> : <Copy className="size-3.5" />}
                      </button>
                    </div>
                    <div className="mt-4 flex items-center justify-between gap-4">
                      <div>
                        <div className="text-xs font-semibold">Allow duplication</div>
                        <div className="mt-0.5 text-[11px] leading-relaxed text-[var(--muted)]">Others can duplicate it without chats or history.</div>
                      </div>
                      <button
                        type="button"
                        role="switch"
                        aria-checked={allowDuplication}
                        onClick={() => setAllowDuplication((allowed) => !allowed)}
                        className={cn("relative h-5 w-10 shrink-0 rounded-full transition-colors cursor-pointer", allowDuplication ? "bg-[#335cff]" : "bg-[var(--border)]")}
                      >
                        <span className={cn("absolute top-0.5 size-4 rounded-full bg-white shadow-sm transition-transform", allowDuplication ? "-translate-x-[18px]" : "translate-x-0.5")} />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
            )}
          </div>

          {/* Main Content Viewport */}
          <div className="relative flex min-h-0 flex-1 bg-transparent overflow-hidden">
            {activeTab === "presentation" ? (
              <>
                {/* Floating Slide Thumbnail Sidebar */}
                {isSidebarOpen ? (
                  <aside className="hidden md:flex flex-col w-[172px] shrink-0 self-center my-auto ml-4 rounded-2xl border border-[var(--border)] bg-[var(--paper)] dark:bg-[#19191d] shadow-[0_10px_30px_rgba(0,0,0,0.08)] dark:shadow-[0_10px_30px_rgba(0,0,0,0.45)] max-h-[70%] overflow-hidden z-20 transition-all">
                    <div className="flex shrink-0 items-center gap-2 pb-0 p-3">
                      <div className="inline-flex h-7 items-center rounded-full bg-[var(--light-gray)] p-0.5">
                        <button
                          type="button"
                          onClick={() => setSidebarViewMode("grid")}
                          className={cn(
                            "inline-flex size-6 items-center justify-center rounded-full transition-colors cursor-pointer",
                            sidebarViewMode === "grid"
                              ? "bg-[var(--surface)] text-[var(--ink)] shadow-xs"
                              : "text-[var(--muted)] hover:text-[var(--ink)]"
                          )}
                          aria-label="Thumbnail view"
                          title="Thumbnail view"
                        >
                          <Grid2X2 className="size-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setSidebarViewMode("list")}
                          className={cn(
                            "inline-flex size-6 items-center justify-center rounded-full transition-colors cursor-pointer",
                            sidebarViewMode === "list"
                              ? "bg-[var(--surface)] text-[var(--ink)] shadow-xs"
                              : "text-[var(--muted)] hover:text-[var(--ink)]"
                          )}
                          aria-label="List view"
                          title="List view"
                        >
                          <AlignLeft className="size-3.5" />
                        </button>
                      </div>
                      <button
                        type="button"
                        onClick={() => setIsSidebarOpen(false)}
                        className="ml-auto inline-flex size-7 items-center justify-center rounded-full text-[var(--muted)] transition hover:bg-[var(--light-gray)] hover:text-[var(--ink)] cursor-pointer"
                        aria-label="Collapse thumbnails"
                        title="Collapse thumbnails"
                      >
                        <X className="size-3.5" />
                      </button>
                    </div>
                    <div className="p-3 shrink-0">
                      <button
                        type="button"
                        onClick={handleAddSlide}
                        className="w-full inline-flex h-7 items-center gap-1.5 rounded-full border border-[var(--border)] bg-[var(--surface)] pl-3 pr-2.5 text-xs font-medium text-[var(--ink)] shadow-xs transition hover:bg-[var(--light-gray)] cursor-pointer"
                      >
                        <Plus className="size-3.5 shrink-0" />
                        <span>New</span>
                        <ChevronDown className="ml-auto size-3 text-[var(--muted)]" />
                      </button>
                    </div>
                    {sidebarViewMode === "grid" ? (
                      <div className="min-h-0 flex-1 space-y-2 overflow-y-auto px-3 pb-3 pt-0 scrollbar-thin [scrollbar-width:thin] [scrollbar-color:var(--border)_transparent] [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-[var(--border)] [&::-webkit-scrollbar-track]:bg-transparent">
                        {slides.map((slide, index) => {
                          const isCurrent = currentSlide === slide.id;
                          return (
                            <button
                              key={slide.slideId}
                              ref={(el) => {
                                thumbnailRefs.current[slide.id] = el;
                              }}
                              type="button"
                              onClick={() => setCurrentSlide(slide.id)}
                              className={cn(
                                "group relative block aspect-video w-full overflow-visible rounded-lg border bg-[var(--surface)] text-left shadow-xs transition-all duration-200 ease-out cursor-pointer",
                                isCurrent
                                  ? "border-[var(--accent)] ring-2 ring-[var(--accent)]/20 shadow-xs scale-[0.95]"
                                  : "border-[var(--border)] hover:border-[var(--muted)]/55 scale-100"
                              )}
                              aria-label={`Go to slide ${index + 1}`}
                              aria-current={isCurrent ? "true" : undefined}
                            >
                              <div className="size-full overflow-hidden rounded-[7px]">
                                <SlidePreview
                                  number={index + 1}
                                  image={getSlideImage(slide.templateSlide)}
                                  title={slide.title}
                                  compact
                                  delay={index * 80}
                                />
                              </div>
                              <span
                                className="absolute -bottom-1 -left-1 inline-flex size-5 items-center justify-center rounded-md border border-[var(--border)] bg-[var(--surface)] font-mono text-[9px] font-semibold shadow-xs text-[var(--muted)]"
                              >
                                {index + 1}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    ) : (
                      <div className="min-h-0 flex-1 space-y-1 overflow-y-auto px-3 pb-3 pt-0 scrollbar-thin [scrollbar-width:thin] [scrollbar-color:var(--border)_transparent] [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-[var(--border)] [&::-webkit-scrollbar-track]:bg-transparent">
                        {slides.map((slide, index) => {
                          const isCurrent = currentSlide === slide.id;
                          return (
                            <button
                              key={slide.slideId}
                              ref={(el) => {
                                thumbnailRefs.current[slide.id] = el;
                              }}
                              type="button"
                              onClick={() => setCurrentSlide(slide.id)}
                              className={cn(
                                "group flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-left text-xs transition-all duration-200 ease-out cursor-pointer border",
                                isCurrent
                                  ? "border-[var(--ink)] bg-[var(--surface)] text-[var(--ink)] font-medium shadow-xs scale-[0.97]"
                                  : "border-transparent text-[var(--muted)] hover:bg-[var(--light-gray)] hover:text-[var(--ink)] scale-100"
                              )}
                              aria-label={`Go to slide ${index + 1}: ${slide.title}`}
                              aria-current={isCurrent ? "true" : undefined}
                            >
                              <span
                                className={cn(
                                  "inline-flex size-4.5 shrink-0 items-center justify-center rounded font-mono text-[9px] transition-colors",
                                  isCurrent
                                    ? "bg-[var(--ink)] text-[var(--surface)] font-bold"
                                    : "bg-[var(--light-gray)] text-[var(--muted)] group-hover:text-[var(--ink)]"
                                )}
                              >
                                {index + 1}
                              </span>
                              <span className="truncate text-xs font-['Figtree'] flex-1">
                                {slide.title}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </aside>
                ) : (
                  <button
                    type="button"
                    onClick={() => setIsSidebarOpen(true)}
                    className="hidden md:inline-flex absolute left-4 top-1/2 -translate-y-1/2 z-20 size-9 items-center justify-center rounded-xl border border-[var(--border)] bg-[var(--paper)] dark:bg-[#19191d] text-[var(--muted)] hover:text-[var(--ink)] shadow-md transition hover:scale-105 cursor-pointer"
                    title="Show thumbnails"
                    aria-label="Show thumbnails"
                  >
                    <Grid2X2 className="size-4" />
                  </button>
                )}

                {/* Main Slide Canvas with Outside-Top Toolbar */}
                <div
                  ref={canvasContainerRef}
                  className="relative flex min-h-0 min-w-0 flex-1 items-center justify-center overflow-hidden bg-transparent p-4 sm:p-6 lg:p-8 select-none"
                >
                  <div className="relative flex flex-col items-center w-full max-w-[90%] my-auto gap-4">
                    {/* Slide Toolbar - Outside Top */}
                    <div className="z-20 flex items-center gap-0.5 rounded-full border border-[var(--border)] dark:border-white/10 bg-white/95 dark:bg-[#171719]/94 p-1 text-[var(--ink)] dark:text-white shadow-[0_8px_24px_rgba(0,0,0,0.06)] dark:shadow-[0_14px_40px_rgba(0,0,0,.35)] backdrop-blur-xl transition-colors">
                      {TOOLBAR_ITEMS.map(({ id: itemId, label, icon: Icon }, index) => {
                        const isQuoteAction = index === 1;
                        const isSelected = selectedSlides.includes(currentSlideNumber);
                        return (
                          <React.Fragment key={itemId}>
                            {index === 2 && <div className="mx-0.5 h-4.5 w-px bg-[var(--border)] dark:bg-white/12" />}
                            <button
                              type="button"
                              onClick={() => {
                                if (itemId === "add") {
                                  handleAddSlide();
                                } else if (isQuoteAction) {
                                  toggleSlideInChat(currentSlideNumber);
                                }
                              }}
                              className={cn(
                                "group/toolbar relative inline-flex size-7 items-center justify-center rounded-full text-[var(--muted)] hover:text-[var(--ink)] hover:bg-[var(--light-gray)] dark:text-white/80 dark:hover:text-white dark:hover:bg-white/12 transition-colors cursor-pointer",
                                isQuoteAction && isSelected && "text-emerald-600 dark:text-emerald-300"
                              )}
                              aria-label={isQuoteAction && isSelected ? `Remove slide ${currentSlideNumber} from chat` : label}
                              title={isQuoteAction && isSelected ? "Remove from chat" : label}
                            >
                              {isQuoteAction && isSelected ? (
                                <>
                                  <Check className="size-3.5 transition group-hover/toolbar:scale-75 group-hover/toolbar:opacity-0" strokeWidth={2} />
                                  <X className="absolute size-3.5 scale-75 opacity-0 transition group-hover/toolbar:scale-100 group-hover/toolbar:opacity-100" strokeWidth={2} />
                                </>
                              ) : (
                                <Icon className="size-3.5" strokeWidth={1.8} />
                              )}
                            </button>
                          </React.Fragment>
                        );
                      })}
                      <div className="mx-0.5 h-4.5 w-px bg-[var(--border)] dark:bg-white/12" />
                      <button
                        type="button"
                        onClick={() => handleDeleteSlide(currentSlide)}
                        disabled={slides.length <= 1}
                        className="group/toolbar relative inline-flex size-7 items-center justify-center rounded-full text-[var(--muted)] hover:text-red-600 hover:bg-red-500/10 dark:text-white/80 dark:hover:text-red-400 dark:hover:bg-red-500/20 transition-colors cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
                        aria-label="Delete slide"
                        title="Delete slide"
                      >
                        <Trash2 className="size-3.5" strokeWidth={1.8} />
                      </button>
                    </div>

                    {/* Active Slide Canvas */}
                    <div className="relative aspect-video w-full overflow-visible">
                      <div className="size-full overflow-hidden rounded-2xl border border-[var(--border)] bg-white shadow-[0_20px_60px_rgba(20,21,26,0.08),0_4px_16px_rgba(20,21,26,0.04)] dark:shadow-[0_16px_48px_rgba(0,0,0,0.5)]">
                        <SlidePreview
                          key={currentSlideItem?.slideId ?? currentSlideNumber}
                          number={currentSlideNumber}
                          image={currentSlideItem ? getSlideImage(currentSlideItem.templateSlide) : undefined}
                          title={currentSlideItem?.title || SLIDE_TITLES[currentSlideIndex % SLIDE_TITLES.length]}
                          delay={40}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <div className="relative min-h-0 w-full flex-1 overflow-y-auto p-5 sm:p-8 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                <div className="mx-auto w-full max-w-[840px] pb-24">
                  {/* Status & Review Heading */}
                  <div className="mb-6 flex flex-col gap-2.5">
                    <h1 className="font-['Figtree'] text-xl sm:text-2xl font-bold tracking-tight text-[var(--ink)]">
                      Review the plan
                    </h1>
                  </div>

                  {/* Template Section (No borders, kept padding) */}
                  <div className="mb-8">
                    <div className="text-xs font-semibold uppercase tracking-wider text-[var(--muted)] mb-2.5">
                      Template
                    </div>
                    <div className="rounded-2xl bg-[var(--border)]/70 backdrop-blur-sm p-5 shadow-xs">
                      <div className="flex items-center justify-between pb-3.5">
                        <div className="font-['Figtree'] text-sm font-semibold text-[var(--ink)]">
                          {templateName}
                        </div>
                        <button
                          type="button"
                          className="text-xs font-medium text-[var(--muted)] hover:text-[var(--ink)] transition-colors cursor-pointer"
                        >
                          Customize
                        </button>
                      </div>
                      {/* 10 Slide Thumbnail Previews from public/example presentation loaded one by one */}
                      <div className="grid grid-cols-5 sm:grid-cols-10 gap-2 overflow-hidden pt-1">
                        {EXAMPLE_SLIDE_IMAGES.map((imgSrc, idx) => (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => setTemplatePreviewIndex(idx)}
                            className="group/thumb relative aspect-[1.38] rounded-lg border border-[var(--border)] bg-[var(--paper)] overflow-hidden shadow-2xs transition-all hover:scale-105 hover:border-[var(--muted)]/50 hover:shadow-xs cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
                            title={`Preview template page ${idx + 1}`}
                            aria-label={`Preview template page ${idx + 1}`}
                          >
                            <SlidePreview
                              number={idx + 1}
                              image={imgSrc}
                              compact
                              delay={idx * 90}
                            />
                            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent p-0.5 px-1 opacity-0 group-hover/thumb:opacity-100 transition-opacity">
                              <span className="font-mono text-[7px] font-medium text-white">
                                #{idx + 1}
                              </span>
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Outline Section with Draggable Cards */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="text-xs font-semibold uppercase tracking-wider text-[var(--muted)]">
                        Outline
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-medium text-[var(--muted)] bg-[var(--light-gray)] px-2.5 py-0.5 rounded-full select-none">
                          {outlineItems.length} slides
                        </span>
                        <button
                          type="button"
                          onClick={handleAddNewSlide}
                          className="inline-flex items-center gap-1.5 rounded-full bg-[var(--light-gray)] hover:bg-[var(--light-gray-hover)] px-2.5 py-0.5 text-xs font-medium text-[var(--ink)] transition-colors cursor-pointer"
                        >
                          <Plus className="size-3" />
                          <span>Add slide</span>
                        </button>
                      </div>
                    </div>

                    <Reorder.Group
                      as="div"
                      axis="y"
                      values={outlineItems.map((item) => item._id)}
                      onReorder={handleReorder}
                      className="space-y-3.5"
                    >
                      {outlineItems.map((item, index) => (
                        <OutlineCardItem
                          key={item._id}
                          item={item}
                          index={index}
                          total={outlineItems.length}
                          hasPresentation={hasPresentation}
                          isDraftingOutline={isDraftingOutline}
                          currentSlideNumber={currentSlideNumber}
                          onSelectSlide={() => {
                            if (hasPresentation) {
                              const targetSlide = slides[index] || slides[0];
                              if (targetSlide) setCurrentSlide(targetSlide.id);
                              setActiveTab("presentation");
                            }
                          }}
                          onUpdateTitle={(val) => updateTitle(index, val)}
                          onUpdateBullet={(bIndex, val) => updateBullet(index, bIndex, val)}
                          onAddBullet={(afterIndex) => addBullet(index, afterIndex)}
                          onRemoveBullet={(bIndex) => removeBullet(index, bIndex)}
                          onUpdateAttachmentType={(val) => updateAttachmentType(index, val)}
                          onUpdateAttachmentTitle={(val) => updateAttachmentTitle(index, val)}
                          onDeleteSlide={() => handleDeleteOutlineItem(index)}
                          onDragEnd={handleReorderEnd}
                        />
                      ))}
                    </Reorder.Group>

                    {/* Add Slide Bottom Action */}
                    <div className="mt-4">
                      <button
                        type="button"
                        onClick={handleAddNewSlide}
                        className="w-full py-3 rounded-2xl flex items-center justify-center gap-2 text-xs font-medium text-[var(--muted)] hover:text-[var(--ink)] hover:bg-[var(--light-gray)]/50 transition-colors cursor-pointer"
                      >
                        <Plus className="size-3.5" />
                        <span>Add new slide</span>
                      </button>
                    </div>
                  </div>

                  {/* Generate Button: Floating Sticky Bottom Middle with Landing Page Get Started Design */}
                  {!hasPresentation && (
                    <div className="sticky bottom-6 z-30 mt-8 mb-2 flex justify-center pointer-events-none">
                      <button
                        type="button"
                        onClick={handleGeneratePresentation}
                        disabled={isGeneratingPresentation}
                        className="pointer-events-auto inline-flex h-9 items-center justify-center gap-1.5 rounded-full border border-white/10 bg-[#335cff] px-5 text-xs sm:text-sm font-medium text-white shadow-[0_10px_28px_rgba(51,92,255,0.32),inset_0_1px_0_rgba(255,255,255,0.16),0_1px_2px_rgba(14,18,27,0.18),0_0_0_1px_#335cff] transition-all hover:bg-[#2547d8] active:bg-[#2547d8] hover:scale-[1.02] active:scale-[0.98] cursor-pointer disabled:opacity-50"
                      >
                        {isGeneratingPresentation ? (
                          <>
                            <div className="size-3.5 rounded-full border-2 border-white border-t-transparent animate-spin" />
                            <span>Generating presentation...</span>
                          </>
                        ) : (
                          <>
                            <span>Generate presentation</span>
                            <ArrowRight className="size-3.5" />
                          </>
                        )}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
      </div>
    </div>
  );
}
