"use client";

import React, { use, useState, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowLeft,
  Presentation as PresentationIcon,
  ChevronLeft,
  ChevronRight,
  Sun,
  Moon,
  History,
  Paperclip,
  ArrowUp,
  ChevronDown,
  Copy,
  FileText,
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
  const messageSeqRef = useRef(0);

  // Auto-scroll chat to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = (text: string, files?: File[]) => {
    if (!text.trim() && (!files || files.length === 0)) return;

    messageSeqRef.current += 1;
    const userMsgId = `user-msg-${messageSeqRef.current}`;

    const userMsg: ChatMessage = {
      id: userMsgId,
      role: "user",
      content: text,
      timestamp: "Just now",
      files: files?.map((f) => f.name),
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
                              <p className="whitespace-pre-wrap">{msg.content}</p>
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
                        if (inputMessage.trim() || attachedFiles.length > 0) {
                          handleSendMessage(inputMessage, attachedFiles);
                          setInputMessage("");
                          setAttachedFiles([]);
                        }
                      }
                    }}
                    className="flex min-h-16 w-full p-0 rounded-none resize-none border-0 bg-transparent dark:bg-transparent text-sm placeholder:text-[var(--muted)]/70 shadow-none tracking-[0] focus:outline-none text-[var(--ink)]"
                    placeholder="Describe your topic or idea, or upload your files (doc, pdf, pptx, txt)…"
                  />
                </div>

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
                  <div className="relative">
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
                    disabled={!inputMessage.trim() && attachedFiles.length === 0}
                    onClick={() => {
                      if (inputMessage.trim() || attachedFiles.length > 0) {
                        handleSendMessage(inputMessage, attachedFiles);
                        setInputMessage("");
                        setAttachedFiles([]);
                      }
                    }}
                    className="inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium transition-all size-8 rounded-full border border-transparent bg-[#14151a] dark:bg-white dark:text-[#14151a] text-white shadow-xs hover:opacity-90 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer flex-none active:scale-95"
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
          {/* Right Top Header Bar: Browser Style Tabs matching reference */}
          <header className="flex h-10 shrink-0 items-end justify-between bg-[#ecece8] dark:bg-[#141416] transition-colors select-none px-2 sm:px-3">
            {/* Outline & Presentation Tabs Switcher matching provided HTML */}
            <div className="flex h-10 shrink-0 items-end overflow-x-auto">
              {/* Left scoop if Outline is active */}
              {activeTab === "outline" && (
                <div className="relative h-10 w-3 shrink-0">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="12"
                    height="12"
                    fill="none"
                    viewBox="0 0 12 12"
                    className="pointer-events-none absolute end-0 bottom-0 size-3 text-white dark:text-workspace-content"
                  >
                    <path fill="currentColor" d="M12 12H0c6.627 0 12-5.373 12-12z" />
                  </svg>
                </div>
              )}

              {/* Tab 1: Outline */}
              <button
                data-slot="button"
                type="button"
                onClick={() => setActiveTab("outline")}
                className={cn(
                  "justify-center whitespace-nowrap text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 [&_svg]:shrink-0 outline-none disabled:cursor-not-allowed hover:text-dark dark:hover:text-default relative flex h-[36px] shrink-0 cursor-pointer items-center gap-1 rounded-tl-lg rounded-tr-lg rounded-b-none px-4 py-[6px] shadow-none",
                  activeTab === "outline"
                    ? "bg-white dark:bg-workspace-content text-default hover:!bg-white dark:hover:!bg-workspace-content"
                    : "bg-transparent text-mute hover:bg-white/40 dark:hover:bg-white/10"
                )}
              >
                {/* Left scoop for Presentation tab when presentation is active */}
                {activeTab === "presentation" && (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="12"
                    height="12"
                    fill="none"
                    viewBox="0 0 12 12"
                    className="pointer-events-none absolute end-0 bottom-0 size-3 text-white dark:text-workspace-content"
                  >
                    <path fill="currentColor" d="M12 12H0c6.627 0 12-5.373 12-12z" />
                  </svg>
                )}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  fill="none"
                  viewBox="0 0 16 16"
                  className="size-4 shrink-0"
                >
                  <g clipPath="url(#clip0_spiral_tab)">
                    <path
                      stroke="currentColor"
                      strokeLinecap="round"
                      d="M1.409 6.864c1.136-1.773 4.227-.955 4 .727-.324 2.394-2.91.636-3.636 1.41-.728.772 1.909 5.272 6.454 5.272 4.137 0 6.5-3.227 6.5-6.273 0-2.227-.864-4.273-2.273-5.682"
                    />
                    <path
                      stroke="currentColor"
                      strokeLinecap="round"
                      d="M3.136 2.864c1.091-.273 2.591-.137 3.728.954M7.182 1.392c.954 0 2.136.29 3.045 1.608"
                    />
                  </g>
                  <defs>
                    <clipPath id="clip0_spiral_tab">
                      <path fill="#fff" d="M0 0h16v16H0z" />
                    </clipPath>
                  </defs>
                </svg>
                <span
                  className={cn(
                    "max-w-[140px] truncate text-sm font-medium font-['Figtree'] leading-6",
                    activeTab === "outline" ? "text-default" : "text-mute"
                  )}
                >
                  Outline
                </span>
              </button>

              {/* Tab 2: Presentation */}
              <button
                data-slot="button"
                type="button"
                onClick={() => setActiveTab("presentation")}
                className={cn(
                  "justify-center whitespace-nowrap text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 [&_svg]:shrink-0 outline-none disabled:cursor-not-allowed hover:text-dark dark:hover:text-default relative flex h-[36px] shrink-0 cursor-pointer items-center gap-1 rounded-tl-lg rounded-tr-lg rounded-b-none px-4 py-[6px] shadow-none",
                  activeTab === "presentation"
                    ? "bg-white dark:bg-workspace-content text-default hover:!bg-white dark:hover:!bg-workspace-content"
                    : "bg-transparent text-mute hover:bg-white/40 dark:hover:bg-white/10"
                )}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  fill="none"
                  viewBox="0 0 16 16"
                  className="size-4 shrink-0"
                >
                  <rect width="12.667" height="9.333" x="2" y="2" stroke="currentColor" rx="2.667" />
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="m4.333 9 2.333-2.666 2.667 2 3-3.667M5 14.667l3.333-3 3.334 3"
                  />
                </svg>
                <span
                  className={cn(
                    "max-w-[140px] truncate text-sm font-medium font-['Figtree'] leading-6",
                    activeTab === "presentation" ? "text-default" : "text-mute"
                  )}
                >
                  Presentation
                </span>
              </button>

              {/* Right scoop for active tab */}
              <div className="relative h-10 min-w-3 flex-1 shrink-0">
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
              </div>
            </div>

            {/* Right Controls: transparent slide navigator and theme switcher */}
            <div className="flex items-center gap-2 sm:gap-2.5 pb-1 self-center">
              <div className="flex items-center gap-1.5 px-2.5 py-1 text-xs text-[var(--ink)]">
                <button
                  type="button"
                  onClick={() => setCurrentSlide((prev) => Math.max(1, prev - 1))}
                  className="bg-transparent text-[var(--muted)] hover:bg-transparent hover:text-[var(--ink)] transition-colors cursor-pointer disabled:opacity-30"
                  disabled={currentSlide <= 1}
                  aria-label="Previous slide"
                >
                  <ChevronLeft className="size-3.5" />
                </button>
                <span className="font-mono text-[11px] px-1 text-[var(--ink)]">
                  {currentSlide} / {totalSlides}
                </span>
                <button
                  type="button"
                  onClick={() => setCurrentSlide((prev) => Math.min(totalSlides, prev + 1))}
                  className="bg-transparent text-[var(--muted)] hover:bg-transparent hover:text-[var(--ink)] transition-colors cursor-pointer disabled:opacity-30"
                  disabled={currentSlide >= totalSlides}
                  aria-label="Next slide"
                >
                  <ChevronRight className="size-3.5" />
                </button>
              </div>

              <button
                type="button"
                onClick={toggleTheme}
                aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
                title={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
                className="inline-flex size-8 items-center justify-center rounded-full bg-transparent text-[var(--ink)] transition-colors cursor-pointer hover:bg-transparent"
              >
                {theme === "dark" ? (
                  <Sun className="size-4 text-[var(--muted)]" strokeWidth={2} />
                ) : (
                  <Moon className="size-4 text-[var(--muted)]" strokeWidth={1.8} />
                )}
              </button>
            </div>
          </header>

          {/* Main Content Viewport */}
          <div className="relative flex flex-1 min-h-0 items-center justify-center overflow-auto p-4 sm:p-8 lg:p-12">
            {activeTab === "presentation" ? (
              /* ======================================================================= */
              /* 1. PRESENTATION VIEW: Rounded bordered container matching Image 1       */
              /* ======================================================================= */
              <div className="relative aspect-[16/9] w-full max-w-[960px] max-h-[calc(100vh-140px)] overflow-hidden rounded-2xl border border-[var(--border)] bg-white shadow-[0_20px_60px_rgba(20,21,26,0.12),0_4px_16px_rgba(20,21,26,0.06)] dark:shadow-[0_16px_48px_rgba(0,0,0,0.5)] transition-all duration-300">
                {presentation?.image ? (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img
                    src={presentation.image}
                    alt={title}
                    className="size-full object-cover object-left-top select-none"
                  />
                ) : (
                  /* Fallback stylized slide matching Image 1 layout */
                  <div className="relative flex size-full bg-[#fbfbfa] text-[#14151a] p-10 sm:p-14 justify-between items-center overflow-hidden">
                    <div className="relative z-10 max-w-[55%]">
                      {/* Orange accent line */}
                      <div className="h-1 w-12 rounded-full bg-[#c95d36] mb-6" />
                      <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-[#14151a]">
                        {title}
                      </h2>
                      <p className="mt-4 font-sans text-sm sm:text-base text-neutral-600 font-medium">
                        History • Best Projects • Worst Projects
                      </p>
                      <p className="mt-8 font-mono text-xs text-neutral-400">
                        {presentation?.date || "2026-03-24"}
                      </p>
                    </div>

                    <div className="relative z-0 flex items-center justify-center opacity-85">
                      <div className="size-48 rounded-2xl bg-gradient-to-tr from-[#3b66ff]/20 to-[#c95d36]/20 border border-black/5 flex items-center justify-center">
                        <PresentationIcon className="size-16 text-neutral-400" />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              /* ======================================================================= */
              /* 2. OUTLINE VIEW: Structured presentation roadmap & topics               */
              /* ======================================================================= */
              <div className="h-full w-full max-w-[800px] overflow-y-auto space-y-3.5 pr-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                <div className="mb-4">
                  <h2 className="font-['Figtree'] text-lg font-semibold text-[var(--ink)]">
                    Presentation Outline
                  </h2>
                  <p className="text-xs text-[var(--muted)]">
                    Slide structure, section headers, and content hierarchy for {title}.
                  </p>
                </div>

                {SAMPLE_OUTLINE.map((item) => (
                  <div
                    key={item.slideNumber}
                    onClick={() => {
                      setCurrentSlide(item.slideNumber);
                      setActiveTab("presentation");
                    }}
                    className={cn(
                      "group flex items-start gap-4 rounded-xl border p-4 transition-all cursor-pointer",
                      currentSlide === item.slideNumber
                        ? "border-[var(--accent)] bg-[var(--surface)] shadow-sm"
                        : "border-[var(--border)] bg-[var(--surface)] hover:bg-light-gray"
                    )}
                  >
                    <div className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-light-gray font-mono text-xs font-semibold text-[var(--ink)]">
                      {item.slideNumber}
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="rounded-md bg-light-gray px-2 py-0.5 text-[10px] font-medium text-[var(--muted)]">
                          {item.type}
                        </span>
                      </div>
                      <h3 className="mt-1.5 font-['Figtree'] text-sm font-semibold text-[var(--ink)] group-hover:text-[var(--accent)] transition-colors">
                        {item.title}
                      </h3>
                      <p className="mt-1 text-xs text-[var(--muted)] leading-relaxed">
                        {item.summary}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Bottom Left Corner Watermark Logo (Matching Image 1) */}
            <div className="pointer-events-none absolute bottom-4 left-4 z-10 flex size-7 items-center justify-center rounded-full bg-black/60 dark:bg-white/10 text-[10px] font-bold text-white dark:text-[var(--ink)] border border-white/10 dark:border-[var(--border)] backdrop-blur-sm select-none">
              N
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
