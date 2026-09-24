"use client";

import React, { use, useState, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  AlignLeft,
  ArrowLeft,
  ArrowUp,
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Columns2,
  Copy,
  Download,
  FileImage,
  FileText,
  Globe2,
  Grid2X2,
  History,
  Image as ImageIcon,
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
  WandSparkles,
  X,
} from "lucide-react";
import { INITIAL_OUTPUTS } from "@/lib/library-data";
import { useWorkspaceTheme } from "@/components/workspace/WorkspaceThemeContext";
import { cn } from "@/lib/utils";

interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
  files?: string[];
  slides?: number[];
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

const SAMPLE_OUTLINE = [
  {
    slideNumber: 1,
    title: "X-Men in Marvel: Evolution & Critical Legacy",
    type: "Title Slide",
    summary: "Historical overview, best & worst franchise projects, cultural footprint.",
  },
  {
    slideNumber: 2,
    title: "Origin & Cultural Metaphor (1963–1975)",
    type: "Context & Background",
    summary: "Stan Lee & Jack Kirby's creation, allegory for civil rights and societal acceptance.",
  },
  {
    slideNumber: 3,
    title: "The Claremont Golden Age: Dark Phoenix & Days of Future Past",
    type: "Milestone Analysis",
    summary: "16-year creative run that transformed the X-Men into Marvel's primary revenue engine.",
  },
  {
    slideNumber: 4,
    title: "Key Project Comparison: Peak Successes vs Notable Stumbles",
    type: "Comparative Matrix",
    summary: "Box office, critical sentiment, and storytelling consistency across eras.",
  },
  {
    slideNumber: 5,
    title: "Modern MCU Integration & Strategic Outlook",
    type: "Executive Summary",
    summary: "Projected franchise trajectory, upcoming slate alignment, and audience retention.",
  },
];

const SUGGESTED_PROMPTS = [
  "“Update slide with Q4 actuals”",
  "“Make title fit on one line”",
  "“Rebalance into 3 equal columns”",
  "“Tighten executive summary”",
];

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

function SlidePreview({
  number,
  image,
  title,
  compact = false,
}: {
  number: number;
  image?: string;
  title: string;
  compact?: boolean;
}) {
  const styleIndex = (number - 1) % 4;

  return (
    <div className="relative size-full overflow-hidden bg-[#f8f6f1] text-[#1b1b1a]">
      {styleIndex === 0 && image ? (
        <>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={image} alt="" className="absolute inset-0 size-full object-cover object-left-top" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/5 to-transparent" />
        </>
      ) : styleIndex === 1 ? (
        <div className="flex size-full flex-col p-[7%]">
          <div className="h-[8%] w-1/2 rounded-full bg-[#c75f3c]" />
          <div className="mt-[6%] text-[clamp(6px,1.1vw,18px)] font-semibold leading-tight">{title}</div>
          <div className="mt-auto grid grid-cols-3 gap-[4%]">
            {[0, 1, 2].map((item) => (
              <div key={item} className="aspect-[1.35] rounded-[4px] bg-[#e7e1d8]" />
            ))}
          </div>
        </div>
      ) : styleIndex === 2 ? (
        <div className="grid size-full grid-cols-[42%_1fr]">
          <div className="bg-gradient-to-br from-[#355d9c] via-[#513b78] to-[#c75f3c]" />
          <div className="flex flex-col justify-center p-[9%]">
            <div className="text-[clamp(6px,1.15vw,18px)] font-semibold leading-tight">{title}</div>
            <div className="mt-[8%] h-[5%] w-4/5 rounded-full bg-black/10" />
            <div className="mt-[3%] h-[5%] w-3/5 rounded-full bg-black/10" />
          </div>
        </div>
      ) : (
        <div className="flex size-full items-center gap-[8%] p-[7%]">
          <div className="flex-1">
            <div className="text-[clamp(6px,1.1vw,18px)] font-semibold leading-tight">{title}</div>
            <div className="mt-[9%] space-y-[5%]">
              {[0, 1, 2].map((item) => (
                <div key={item} className="h-[5%] min-h-px rounded-full bg-black/10" />
              ))}
            </div>
          </div>
          <div className="aspect-square w-[34%] rounded-full bg-[conic-gradient(#315cff_0_34%,#c75f3c_34%_61%,#dfbd70_61%_82%,#dedbd4_82%)]" />
        </div>
      )}
      {!compact && (
        <div className="absolute bottom-[5%] right-[5%] text-[clamp(6px,.65vw,11px)] font-medium text-black/35">
          {number.toString().padStart(2, "0")}
        </div>
      )}
    </div>
  );
}

export default function PresentationPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { theme, toggleTheme } = useWorkspaceTheme();
  const presentation = INITIAL_OUTPUTS.find((item) => item.id === id);
  const title = presentation?.title || `Presentation ${id}`;
  const totalSlides = presentation?.slidesCount || 24;

  const [activeTab, setActiveTab] = useState<"presentation" | "outline">("presentation");
  const [currentSlide, setCurrentSlide] = useState(1);
  const [inputMessage, setInputMessage] = useState("");
  const [attachedFiles, setAttachedFiles] = useState<File[]>([]);
  const [selectedModel, setSelectedModel] = useState<ChatModel>(MODELS[0]);
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

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "initial-ai",
      role: "assistant",
      content: `I've connected to **${title}** and mapped your corporate master template, typography, and visual rules. Describe what you'd like to update on your slides.`,
      timestamp: "Just now",
    },
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const modelDropdownRef = useRef<HTMLDivElement>(null);
  const headerActionsRef = useRef<HTMLDivElement>(null);
  const playCloseTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const copyFeedbackTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const messageSeqRef = useRef(0);

  // Auto-scroll chat to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

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

        setCurrentSlide((prev) =>
          direction > 0
            ? Math.min(totalSlides, prev + steps)
            : Math.max(1, prev - steps)
        );
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
          setCurrentSlide((prev) => Math.min(totalSlides, prev + steps));
          wheelAccumulatorRef.current -= steps * TRACKPAD_STEP;
        } else if (wheelAccumulatorRef.current <= -TRACKPAD_STEP) {
          const steps = Math.floor(Math.abs(wheelAccumulatorRef.current) / TRACKPAD_STEP);
          setCurrentSlide((prev) => Math.max(1, prev - steps));
          wheelAccumulatorRef.current += steps * TRACKPAD_STEP;
        }
      }
    };

    container.addEventListener("wheel", handleWheel, { passive: false });
    return () => {
      container.removeEventListener("wheel", handleWheel);
      if (wheelTimeoutRef.current) clearTimeout(wheelTimeoutRef.current);
    };
  }, [activeTab, totalSlides]);

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
  }, [currentSlide, activeTab]);

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
        setCurrentSlide((prev) => Math.min(totalSlides, prev + 1));
      } else if (e.key === "ArrowUp" || e.key === "ArrowLeft" || e.key === "PageUp") {
        e.preventDefault();
        setCurrentSlide((prev) => Math.max(1, prev - 1));
      }
    };

    window.addEventListener("keydown", handleKeyScroll);
    return () => window.removeEventListener("keydown", handleKeyScroll);
  }, [activeTab, totalSlides]);

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
    const shareUrl = `https://zicdeck.app/presentation/share/${id}`;
    try {
      await navigator.clipboard.writeText(shareUrl);
      if (copyFeedbackTimerRef.current) clearTimeout(copyFeedbackTimerRef.current);
      setLinkCopied(true);
      copyFeedbackTimerRef.current = setTimeout(() => setLinkCopied(false), 1400);
    } catch {
      setLinkCopied(false);
    }
  };

  const handleSendMessage = (text: string, files?: File[], slides: number[] = []) => {
    if (!text.trim() && (!files || files.length === 0) && slides.length === 0) return;

    messageSeqRef.current += 1;
    const userMsgId = `user-msg-${messageSeqRef.current}`;

    const userMsg: ChatMessage = {
      id: userMsgId,
      role: "user",
      content: text,
      timestamp: "Just now",
      files: files?.map((f) => f.name),
      slides,
    };

    setMessages((prev) => [...prev, userMsg]);

    // Simulate intelligent platform AI response
    setTimeout(() => {
      let aiResponseText = `I've analyzed slide ${currentSlide} and applied the revisions to **${title}**. All typography hierarchy, margins, and brand guidelines remain strictly compliant.`;

      if (text.toLowerCase().includes("q4") || text.toLowerCase().includes("actual")) {
        aiResponseText = `Updated slide ${currentSlide} with Q4 actuals. Data callouts and chart alignment have been rebalanced to match your executive template.`;
      } else if (text.toLowerCase().includes("one line") || text.toLowerCase().includes("title")) {
        aiResponseText = `Adjusted headline tracking and font weight on slide ${currentSlide}. The title now sits cleanly on a single line without breaking visual hierarchy.`;
      } else if (text.toLowerCase().includes("column") || text.toLowerCase().includes("3")) {
        aiResponseText = `Rebuilt the slide architecture into a 3-column layout with equal gutters and aligned metrics.`;
      }

      messageSeqRef.current += 1;
      const aiMsgId = `ai-msg-${messageSeqRef.current}`;

      const aiMsg: ChatMessage = {
        id: aiMsgId,
        role: "assistant",
        content: aiResponseText,
        timestamp: "Just now",
      };

      setMessages((prev) => [...prev, aiMsg]);
    }, 600);
  };

  return (
    <div className="relative flex h-screen w-full min-w-0 flex-1 overflow-hidden bg-[var(--surface)] text-[var(--ink)]">
      {/* ========================================================================= */}
      {/* LEFT SECTION: AI Chat (380px compact, borderless)                        */}
      {/* ========================================================================= */}
      <div className="overflow-hidden relative z-10 flex-none h-screen w-full sm:w-[380px]">
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

            {/* Chat Messages Body with Top & Bottom Gradient Fades */}
            <div className="flex min-h-0 flex-1 flex-col overflow-hidden items-center relative">
              {/* Top Gradient Fade to smoothly hide messages scrolling under header */}
              <div
                aria-hidden="true"
                className="pointer-events-none absolute top-0 start-0 w-full h-8 bg-gradient-to-b from-[var(--surface)] via-[var(--surface)]/80 to-transparent z-20"
              />

              <div className="relative min-h-0 flex-1 overflow-hidden w-full">
                <div className="relative w-full h-full overflow-hidden overflow-y-auto [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                  <div className="mx-auto flex flex-col pt-4 pb-8 text-start gap-4 max-w-none">
                    {messages.map((msg) => (
                      <div
                        key={msg.id}
                        className="relative w-full px-5 text-start group/card hover:z-10 self-start"
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
                            <div className="py-1 flex flex-col gap-2 text-start">
                              <div className="prose prose-sm max-w-full text-start text-xs sm:text-[13px] text-[var(--ink)] leading-relaxed whitespace-pre-wrap">
                                <p>{msg.content}</p>
                              </div>
                              {msg.id === "initial-ai" && (
                                <div className="mt-2 flex flex-wrap gap-1.5 pt-2">
                                  {SUGGESTED_PROMPTS.map((prompt) => (
                                    <button
                                      key={prompt}
                                      type="button"
                                      onClick={() => handleSendMessage(prompt.replace(/“|”/g, ""))}
                                      className="rounded-full bg-light-gray px-2.5 py-1 text-[11px] text-[var(--muted)] hover:text-[var(--ink)] hover:bg-light-gray-hover transition-colors cursor-pointer"
                                    >
                                      {prompt}
                                    </button>
                                  ))}
                                </div>
                              )}
                            </div>
                            <div className="flex h-6 items-center gap-2 pt-0.5">
                              <button
                                type="button"
                                onClick={() => navigator.clipboard?.writeText(msg.content)}
                                className="cursor-pointer hover:text-[var(--ink)] transition-colors p-0.5"
                                title="Copy"
                              >
                                <Copy className="size-3 text-[var(--muted)]" />
                              </button>
                              <span className="text-[10px] text-[var(--muted)] font-medium">
                                {msg.timestamp}
                              </span>
                            </div>
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
                              {msg.content.trim() && <p className="whitespace-pre-wrap">{msg.content}</p>}
                            </div>
                            <span className="text-[10px] text-[var(--muted)] font-medium mt-1 pr-1">
                              {msg.timestamp}
                            </span>
                          </div>
                        )}
                      </div>
                    ))}
                    <div ref={messagesEndRef} />
                  </div>
                </div>
              </div>

              {/* Bottom Gradient Fade */}
              <div
                aria-hidden="true"
                className="pointer-events-none absolute bottom-0 start-0 w-full h-12 bg-gradient-to-t from-[var(--surface)] via-[var(--surface)]/90 to-transparent z-20"
              />
            </div>

            {/* Input Box: Borderless Compact Rounded-2xl Container with soft shadow */}
            <div className="relative z-10 w-full shrink-0 p-4 pt-0 max-w-none">
              <div className="relative z-10 w-full overflow-hidden bg-white dark:bg-[rgba(255,255,255,0.04)] shadow-[0_4px_20px_rgba(0,0,0,0.05),0_1px_3px_rgba(0,0,0,0.03)] dark:shadow-none flex flex-col items-stretch gap-2 rounded-2xl min-h-36 max-h-96 py-3.5">
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
                    className="flex min-h-16 w-full p-0 rounded-none resize-none border-0 bg-transparent dark:bg-transparent text-sm placeholder:text-[var(--muted)]/70 shadow-none tracking-[0] focus:outline-none text-[var(--ink)]"
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
                          image={presentation?.image}
                          title={SLIDE_TITLES[(slideNumber - 1) % SLIDE_TITLES.length]}
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
                      <div className="absolute bottom-full left-0 z-50 mb-1.5 min-w-[160px] overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--surface)] p-1 shadow-lg text-[var(--ink)]">
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
      <div className="relative flex min-w-0 flex-1 flex-col overflow-hidden p-[12px]">
        <main className="relative flex min-w-0 flex-1 flex-col overflow-hidden rounded-[20px] bg-white dark:bg-workspace-content text-default transition-colors border border-[var(--border)] shadow-[0_10px_30px_rgba(20,21,26,0.06),0_1px_3px_rgba(20,21,26,0.03)] dark:shadow-[0_10px_40px_rgba(0,0,0,0.5)]">
          {/* Top Browser Style Tab Strip */}
          <div className="relative z-40 flex h-9 shrink-0 items-end justify-between bg-[#ecece8] dark:bg-[#141416] select-none transition-colors">
            <div className="flex h-9 min-w-0 items-end overflow-visible">
              {/* Tab 1: Outline (Flush to left corner with no gap, matching reference) */}
              <button
                type="button"
                onClick={() => setActiveTab("outline")}
                className={cn(
                  "relative flex h-9 w-[110px] shrink-0 cursor-pointer items-center justify-center gap-2 text-xs font-medium outline-none transition-colors select-none",
                  activeTab === "outline"
                    ? "z-10 rounded-tl-[20px] rounded-tr-[10px] bg-[var(--surface)] text-[var(--ink)]"
                    : "rounded-tl-[20px] rounded-tr-[10px] text-[var(--muted)] hover:bg-black/5 hover:text-[var(--ink)] dark:hover:bg-white/5"
                )}
                aria-pressed={activeTab === "outline"}
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="none" className="size-3.5 shrink-0">
                  <g clipPath="url(#clip0_spiral_tab)">
                    <path stroke="currentColor" strokeLinecap="round" strokeWidth="1.35" d="M1.409 6.864c1.136-1.773 4.227-.955 4 .727-.324 2.394-2.91.636-3.636 1.41-.728.772 1.909 5.272 6.454 5.272 4.137 0 6.5-3.227 6.5-6.273 0-2.227-.864-4.273-2.273-5.682" />
                    <path stroke="currentColor" strokeLinecap="round" strokeWidth="1.35" d="M3.136 2.864c1.091-.273 2.591-.137 3.728.954M7.182 1.392c.954 0 2.136.29 3.045 1.608" />
                  </g>
                  <defs><clipPath id="clip0_spiral_tab"><path fill="#fff" d="M0 0h16v16H0z" /></clipPath></defs>
                </svg>
                <span className="font-['Figtree']">Outline</span>

                {/* Right Scoop for Outline active tab */}
                {activeTab === "outline" && (
                  <svg viewBox="0 0 10 10" className="pointer-events-none absolute -right-[10px] bottom-0 size-[10px] text-[var(--surface)]" fill="currentColor">
                    <path d="M 0,0 A 10,10 0 0,1 10,10 H 0 Z" />
                  </svg>
                )}
              </button>

              {/* Tab 2: Presentation */}
              <button
                type="button"
                onClick={() => setActiveTab("presentation")}
                className={cn(
                  "relative flex h-9 w-[136px] shrink-0 cursor-pointer items-center justify-center gap-2 text-xs font-medium outline-none transition-colors select-none",
                  activeTab === "presentation"
                    ? "z-10 rounded-t-[10px] bg-[var(--surface)] text-[var(--ink)]"
                    : "rounded-t-[10px] text-[var(--muted)] hover:bg-black/5 hover:text-[var(--ink)] dark:hover:bg-white/5"
                )}
                aria-pressed={activeTab === "presentation"}
              >
                {/* Left Scoop for Presentation active tab */}
                {activeTab === "presentation" && (
                  <svg viewBox="0 0 10 10" className="pointer-events-none absolute -left-[10px] bottom-0 size-[10px] text-[var(--surface)]" fill="currentColor">
                    <path d="M 10,0 A 10,10 0 0,0 0,10 H 10 Z" />
                  </svg>
                )}

                <PresentationIcon className="size-3.5 shrink-0" strokeWidth={1.7} />
                <span className="font-['Figtree']">Presentation</span>

                {/* Right Scoop for Presentation active tab */}
                {activeTab === "presentation" && (
                  <svg viewBox="0 0 10 10" className="pointer-events-none absolute -right-[10px] bottom-0 size-[10px] text-[var(--surface)]" fill="currentColor">
                    <path d="M 0,0 A 10,10 0 0,1 10,10 H 0 Z" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          {/* Sub-toolbar under the tabs split with border-bottom */}
          <div className="relative z-30 flex p-[1px] shrink-0 items-center justify-between text-[var(--ink)] transition-colors">
            {/* Left: Change color buttons under the tab */}
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

            {/* Right: Actions section */}
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

              <div className="flex items-center gap-0.5 rounded-full border border-[var(--border)] bg-[var(--paper)] px-1 py-0.5">
                <button
                  type="button"
                  onClick={() => setCurrentSlide((slide) => Math.max(1, slide - 1))}
                  disabled={currentSlide <= 1}
                  className="inline-flex size-5 items-center justify-center rounded-full text-[var(--muted)] transition hover:bg-[var(--light-gray)] hover:text-[var(--ink)] disabled:opacity-30 cursor-pointer"
                  aria-label="Previous slide"
                >
                  <ChevronLeft className="size-3" />
                </button>
                <span className="min-w-9 text-center font-mono text-[10px] text-[var(--ink)]">{currentSlide} / {totalSlides}</span>
                <button
                  type="button"
                  onClick={() => setCurrentSlide((slide) => Math.min(totalSlides, slide + 1))}
                  disabled={currentSlide >= totalSlides}
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
                  className="inline-flex h-7 items-center justify-center rounded-full border border-white/10 bg-[#335cff] px-3 text-xs font-medium text-white shadow-xs transition-colors hover:bg-[#2547d8] active:bg-[#2547d8] cursor-pointer"
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
                      <span className="min-w-0 flex-1 truncate text-xs text-[var(--muted)]">https://zicdeck.app/presentation/share/{id}</span>
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
                        <span className={cn("absolute top-0.5 size-4 rounded-full bg-white shadow-sm transition-transform", allowDuplication ? "translate-x-[21px]" : "translate-x-0.5")} />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Main Content Viewport */}
          <div className="relative flex min-h-0 flex-1 bg-[var(--surface)] overflow-hidden">
            {activeTab === "presentation" ? (
              <>
                {/* Floating Slide Thumbnail Sidebar */}
                {isSidebarOpen ? (
                  <aside className="hidden md:flex flex-col w-[172px] shrink-0 self-center my-auto ml-4 rounded-2xl border border-[var(--border)] bg-[var(--paper)] dark:bg-[#19191d] shadow-[0_10px_30px_rgba(0,0,0,0.08)] dark:shadow-[0_10px_30px_rgba(0,0,0,0.45)] max-h-[70%] overflow-hidden z-20 transition-all">
                    <div className="flex h-11 shrink-0 items-center gap-2 px-3 border-b border-[var(--border)]/60">
                      <div className="inline-flex h-7 items-center rounded-full bg-[var(--light-gray)] p-0.5">
                        <button type="button" className="inline-flex size-6 items-center justify-center rounded-full bg-[var(--surface)] text-[var(--accent)] shadow-sm cursor-pointer" aria-label="Thumbnail view"><Grid2X2 className="size-3.5" /></button>
                        <button type="button" className="inline-flex size-6 items-center justify-center rounded-full text-[var(--muted)] cursor-pointer" aria-label="List view"><AlignLeft className="size-3.5" /></button>
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
                    <div className="px-3 pt-2.5 pb-2 shrink-0">
                      <button type="button" className="w-full inline-flex h-8 items-center justify-center gap-1.5 rounded-full border border-[var(--accent)]/20 bg-[var(--surface)] text-xs font-semibold text-[var(--accent)] shadow-sm transition hover:bg-[var(--accent-soft)] cursor-pointer">
                        <Plus className="size-3.5" /> New <ChevronDown className="ml-auto mr-2 size-3.5" />
                      </button>
                    </div>
                    <div className="min-h-0 flex-1 space-y-2 overflow-y-auto px-3 pb-3 pt-0.5 scrollbar-thin [scrollbar-width:thin] [scrollbar-color:var(--border)_transparent] [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-[var(--border)] [&::-webkit-scrollbar-track]:bg-transparent">
                      {Array.from({ length: totalSlides }, (_, index) => index + 1).map((slideNumber) => (
                        <button
                          key={slideNumber}
                          ref={(el) => {
                            thumbnailRefs.current[slideNumber] = el;
                          }}
                          type="button"
                          onClick={() => setCurrentSlide(slideNumber)}
                          className={cn(
                            "group relative block aspect-video w-full overflow-visible rounded-lg border bg-[var(--surface)] text-left shadow-sm transition cursor-pointer",
                            currentSlide === slideNumber
                              ? "border-[var(--accent)] ring-2 ring-[var(--accent)]/35 shadow-sm"
                              : "border-[var(--border)] hover:border-[var(--muted)]/55"
                          )}
                          aria-label={`Go to slide ${slideNumber}`}
                          aria-current={currentSlide === slideNumber ? "true" : undefined}
                        >
                          <div className="size-full overflow-hidden rounded-[7px]">
                            <SlidePreview number={slideNumber} image={presentation?.image} title={SLIDE_TITLES[(slideNumber - 1) % SLIDE_TITLES.length]} compact />
                          </div>
                          <span className={cn("absolute -bottom-1.5 -left-1.5 inline-flex size-6 items-center justify-center rounded-lg border bg-[var(--surface)] font-mono text-[10px] font-semibold shadow-sm", currentSlide === slideNumber ? "border-[var(--accent)] text-[var(--accent)]" : "border-[var(--border)] text-[var(--muted)]")}>{slideNumber}</span>
                        </button>
                      ))}
                    </div>
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
                  className="relative flex min-h-0 min-w-0 flex-1 items-center justify-center overflow-hidden bg-[var(--surface)] p-4 sm:p-6 lg:p-8 select-none"
                >
                  <div className="relative flex flex-col items-center w-full max-w-[960px] my-auto gap-4">
                    {/* Slide Toolbar - Outside Top */}
                    <div className="z-20 flex items-center gap-1 rounded-full border border-white/10 bg-[#171719]/94 p-1.5 text-white shadow-[0_18px_50px_rgba(0,0,0,.35)] backdrop-blur-xl">
                      {TOOLBAR_ITEMS.map(({ id: itemId, label, icon: Icon }, index) => {
                        const isQuoteAction = index === 1;
                        const isSelected = selectedSlides.includes(currentSlide);
                        return (
                          <React.Fragment key={itemId}>
                            {index === 2 && <div className="mx-0.5 h-6 w-px bg-white/12" />}
                            <button
                              type="button"
                              onClick={() => isQuoteAction && toggleSlideInChat(currentSlide)}
                              className={cn(
                                "group/toolbar relative inline-flex size-8 items-center justify-center rounded-full text-white/88 transition-colors hover:bg-white/12 hover:text-white cursor-pointer",
                                isQuoteAction && isSelected && "text-emerald-300"
                              )}
                              aria-label={isQuoteAction && isSelected ? `Remove slide ${currentSlide} from chat` : label}
                              title={isQuoteAction && isSelected ? "Remove from chat" : label}
                            >
                              {isQuoteAction && isSelected ? (
                                <>
                                  <Check className="size-[17px] transition group-hover/toolbar:scale-75 group-hover/toolbar:opacity-0" strokeWidth={2} />
                                  <X className="absolute size-[17px] scale-75 opacity-0 transition group-hover/toolbar:scale-100 group-hover/toolbar:opacity-100" strokeWidth={2} />
                                </>
                              ) : (
                                <Icon className="size-[17px]" strokeWidth={1.8} />
                              )}
                            </button>
                          </React.Fragment>
                        );
                      })}
                    </div>

                    {/* Active Slide Canvas */}
                    <div className="relative aspect-video w-full overflow-visible">
                      <div className="size-full overflow-hidden rounded-2xl border border-[var(--border)] bg-white shadow-[0_20px_60px_rgba(20,21,26,0.12),0_4px_16px_rgba(20,21,26,0.06)] dark:shadow-[0_16px_48px_rgba(0,0,0,0.5)]">
                        <SlidePreview number={currentSlide} image={presentation?.image} title={SLIDE_TITLES[(currentSlide - 1) % SLIDE_TITLES.length]} />
                      </div>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <div className="min-h-0 w-full overflow-y-auto p-5 sm:p-8 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                <div className="mx-auto w-full max-w-[800px] space-y-3.5">
                  <div className="mb-5">
                    <h2 className="font-['Figtree'] text-lg font-semibold text-[var(--ink)]">Presentation Outline</h2>
                    <p className="text-xs text-[var(--muted)]">Slide structure, section headers, and content hierarchy for {title}.</p>
                  </div>
                  {SAMPLE_OUTLINE.map((item) => (
                    <button
                      type="button"
                      key={item.slideNumber}
                      onClick={() => {
                        setCurrentSlide(item.slideNumber);
                        setActiveTab("presentation");
                      }}
                      className={cn(
                        "group flex w-full cursor-pointer items-start gap-4 rounded-xl border p-4 text-left transition-all",
                        currentSlide === item.slideNumber
                          ? "border-[var(--accent)] bg-[var(--surface)] shadow-sm"
                          : "border-[var(--border)] bg-[var(--surface)] hover:bg-[var(--light-gray)]"
                      )}
                    >
                      <div className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-[var(--light-gray)] font-mono text-xs font-semibold text-[var(--ink)]">{item.slideNumber}</div>
                      <div className="min-w-0 flex-1">
                        <span className="rounded-md bg-[var(--light-gray)] px-2 py-0.5 text-[10px] font-medium text-[var(--muted)]">{item.type}</span>
                        <h3 className="mt-1.5 font-['Figtree'] text-sm font-semibold text-[var(--ink)] transition-colors group-hover:text-[var(--accent)]">{item.title}</h3>
                        <p className="mt-1 text-xs leading-relaxed text-[var(--muted)]">{item.summary}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
