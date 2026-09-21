"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useUser, useClerk } from "@clerk/nextjs";
import {
  PanelLeftClose,
  PanelRightClose,
  Plus,
  LibraryBig,
  ChevronDown,
  ChevronRight,
  Ellipsis,
  MonitorSmartphone,
  Rocket,
  Clock2,
  Settings,
  Sun,
  Moon,
  Globe,
  CircleHelp,
  LogOut,
  Sparkles,
  ClipboardCheck,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useWorkspacePricingModal } from "./WorkspacePricingModalContext";
import { useWorkspaceTheme } from "./WorkspaceThemeContext";

interface TaskItem {
  id: string;
  title: string;
  type: "doc" | "slides" | "chart";
}

const SAMPLE_TASKS: TaskItem[] = [
  { id: "1", title: "ZicDeck Product Guide", type: "doc" },
  { id: "2", title: "ZicDeck Product Introduction", type: "slides" },
  { id: "3", title: "ZicDeck Presentation Workflow", type: "chart" },
];

export function WorkspaceSidebar() {
  const pathname = usePathname();
  const { user } = useUser();
  const { signOut } = useClerk();
  const { openPricingModal } = useWorkspacePricingModal();
  const { theme, toggleTheme } = useWorkspaceTheme();

  const [isCollapsed, setIsCollapsed] = useState(false);
  const [tasksCollapsed, setTasksCollapsed] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsProfileOpen(false);
      }
    };
    if (isProfileOpen) {
      document.addEventListener("mousedown", handleOutsideClick);
    }
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [isProfileOpen]);

  const userDisplayName = user?.fullName || "ZicDeck";
  const userEmail =
    user?.primaryEmailAddress?.emailAddress || "zicdeck.com@gmail.com";

  return (
    <aside
      className={cn(
        "relative flex h-full min-h-0 shrink-0 flex-col overflow-visible bg-transparent transition-all duration-200 ease-out select-none",
        isCollapsed ? "w-[72px]" : "w-[348px]"
      )}
    >
      {/* ========================================================================= */}
      {/* 1. COLLAPSED VIEW (w-[72px])                                             */}
      {/* ========================================================================= */}
      {isCollapsed ? (
        <div className="flex h-full min-h-0 flex-col justify-between">
          {/* Top: Expand Button */}
          <div className="shrink-0">
            <div className="flex items-center justify-center px-4 pt-6">
              <button
                type="button"
                onClick={() => setIsCollapsed(false)}
                aria-label="Expand sidebar"
                className="inline-flex size-9 items-center justify-center rounded-full text-[var(--muted)] hover:bg-black/[0.04] dark:hover:bg-white/[0.06] hover:text-[var(--ink)] transition-colors cursor-pointer"
              >
                <PanelRightClose className="size-4.5" strokeWidth={1.8} />
              </button>
            </div>
          </div>

          {/* Middle: Actions & Tasks */}
          <div className="flex min-h-0 w-full flex-1 flex-col items-center overflow-hidden px-2 pt-4">
            <div className="h-px w-10 bg-[var(--border)] shrink-0" />

            {/* New Task + Button */}
            <Link
              href="/workspace/new-task"
              title="New Task"
              className={cn(
                "mt-4 flex size-9 items-center justify-center rounded-full border border-transparent shadow-xs transition-all cursor-pointer",
                pathname === "/workspace/new-task"
                  ? "bg-black/[0.08] dark:bg-white/[0.12] text-[var(--ink)]"
                  : "bg-black/[0.04] dark:bg-white/[0.06] text-[var(--ink)] hover:bg-black/[0.08] dark:hover:bg-white/[0.1]"
              )}
            >
              <Plus className="size-4" strokeWidth={1.8} />
            </Link>

            {/* Library Button */}
            <button
              type="button"
              title="Library"
              className="mt-2 flex size-9 items-center justify-center rounded-full border border-transparent text-[var(--muted)] hover:bg-black/[0.04] dark:hover:bg-white/[0.06] hover:text-[var(--ink)] transition-colors cursor-pointer"
            >
              <LibraryBig className="size-4" strokeWidth={1.8} />
            </button>

            {/* Collapsed Task Item */}
            <div className="relative min-h-0 w-full flex-1 pt-4 overflow-y-auto [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              <div className="flex flex-col items-center gap-2 pb-2 pt-1">
                <button
                  type="button"
                  title="Welcome to ZicDeck"
                  onClick={() => setIsCollapsed(false)}
                  className="group flex h-fit w-full cursor-pointer flex-col items-center gap-1 rounded-lg p-1 text-center transition-colors hover:bg-black/[0.04] dark:hover:bg-white/[0.06]"
                >
                  <span className="relative flex size-10 items-center justify-center rounded-lg border border-[var(--border)] bg-[var(--surface)] text-[var(--ink)] shadow-2xs transition-colors">
                    <ClipboardCheck className="size-4" strokeWidth={1.8} />
                  </span>
                  <span className="block w-full truncate text-[10px] font-normal font-sans leading-3 text-[var(--muted)]">
                    Welcome
                  </span>
                </button>
              </div>
            </div>
          </div>

          {/* Bottom: User Avatar */}
          <div className="relative shrink-0 flex flex-col items-center px-2 pb-4 pt-2">
            <div className="mb-3 h-px w-10 bg-[var(--border)]" />
            <button
              type="button"
              onClick={() => setIsProfileOpen((prev) => !prev)}
              aria-label="User Profile"
              className="size-8 rounded-full overflow-hidden shadow-[0_4px_12px_rgba(47,94,255,0.12)] cursor-pointer ring-2 ring-transparent hover:ring-[var(--accent)] transition-all"
            >
              {user?.imageUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={user.imageUrl}
                  alt={userDisplayName}
                  className="size-full object-cover"
                />
              ) : (
                <div className="flex size-full items-center justify-center bg-[#E55A1B] text-white font-semibold text-xs">
                  {userDisplayName[0] || "Z"}
                </div>
              )}
            </button>
          </div>
        </div>
      ) : (
        /* ========================================================================= */
        /* 2. EXPANDED VIEW (w-[348px])                                              */
        /* ========================================================================= */
        <div className="flex h-full min-h-0 flex-col justify-between">
          {/* Header with Clean Logo (no border/padding/bg) & Collapse Button */}
          <div className="shrink-0">
            <div className="flex items-center justify-between gap-3 px-4 pt-6">
              <Link
                href="/"
                aria-label="ZicDeck Home"
                className="group flex items-center gap-2 text-[var(--ink)] hover:opacity-85 transition-opacity"
              >
                <Image
                  src="/logo.svg"
                  alt="ZicDeck"
                  width={22}
                  height={22}
                  className={cn("shrink-0", theme === "dark" ? "invert brightness-200" : "")}
                />
                <span className="font-display text-base font-semibold tracking-tight text-[var(--ink)]">
                  ZicDeck
                </span>
              </Link>

              <button
                type="button"
                onClick={() => setIsCollapsed(true)}
                aria-label="Collapse sidebar"
                className="inline-flex size-9 items-center justify-center rounded-full text-[var(--muted)] hover:bg-black/[0.04] dark:hover:bg-white/[0.06] hover:text-[var(--ink)] transition-colors cursor-pointer"
              >
                <PanelLeftClose className="size-4.5" strokeWidth={1.8} />
              </button>
            </div>
          </div>

          {/* Navigation Actions & Task Tree */}
          <div className="min-h-0 flex-1 overflow-hidden px-4 pt-8">
            <div className="flex h-full flex-col">
              {/* New Task Action */}
              <Link
                href="/workspace/new-task"
                className={cn(
                  "flex h-9.5 w-full cursor-pointer items-center gap-2.5 rounded-xl px-3 py-1.5 text-start transition-colors",
                  pathname === "/workspace/new-task"
                    ? "bg-black/[0.06] dark:bg-white/[0.08] text-[var(--ink)] font-medium shadow-2xs"
                    : "bg-black/[0.04] dark:bg-white/[0.04] text-[var(--ink)] hover:bg-black/[0.06] dark:hover:bg-white/[0.08]"
                )}
              >
                <span className="flex size-4 shrink-0 items-center justify-center text-[var(--ink)]">
                  <Plus className="size-4" strokeWidth={1.8} />
                </span>
                <span className="min-w-0 truncate text-sm font-normal font-sans leading-5 text-[var(--ink)]">
                  New Task
                </span>
              </Link>

              {/* Library Action */}
              <button
                type="button"
                className="mt-1.5 flex h-9.5 w-full cursor-pointer items-center gap-2.5 rounded-xl px-3 py-1.5 text-start text-[var(--muted)] hover:bg-black/[0.04] dark:hover:bg-white/[0.06] hover:text-[var(--ink)] transition-colors"
              >
                <span className="flex size-4 shrink-0 items-center justify-center">
                  <LibraryBig className="size-4" strokeWidth={1.8} />
                </span>
                <span className="min-w-0 truncate text-sm font-normal font-sans leading-5">
                  Library
                </span>
              </button>

              {/* Divider */}
              <div className="mt-4 mb-2 border-b border-[var(--border)]" />

              {/* Scrollable Tree Area */}
              <div className="relative min-h-0 flex-1 overflow-y-auto [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                <div className="space-y-[2px]">
                  <div>
                    {/* Folder Row */}
                    <div className="group/task-item flex h-9 w-full cursor-pointer items-center gap-2 rounded-lg px-2 py-1 text-start text-[var(--ink)] hover:bg-black/[0.04] dark:hover:bg-white/[0.06]">
                      <button
                        type="button"
                        onClick={() => setTasksCollapsed((prev) => !prev)}
                        aria-label={tasksCollapsed ? "Expand task" : "Collapse task"}
                        className="flex size-4 shrink-0 cursor-pointer items-center justify-center text-[var(--muted)] hover:text-[var(--ink)]"
                      >
                        {tasksCollapsed ? (
                          <ChevronRight className="size-4" strokeWidth={1.8} />
                        ) : (
                          <ChevronDown className="size-4" strokeWidth={1.8} />
                        )}
                      </button>
                      <span className="min-w-0 flex-1 truncate text-sm font-normal font-sans leading-5 text-[var(--ink)] text-start">
                        Welcome to ZicDeck
                      </span>
                      <button
                        type="button"
                        aria-label="More"
                        className="inline-flex size-6 items-center justify-center rounded-lg text-[var(--muted)] opacity-0 group-hover/task-item:opacity-100 hover:bg-black/[0.06] dark:hover:bg-white/[0.08] hover:text-[var(--ink)] transition-opacity cursor-pointer"
                      >
                        <Ellipsis className="size-4" strokeWidth={1.8} />
                      </button>
                    </div>

                    {/* Sub-items */}
                    {!tasksCollapsed && (
                      <div className="mt-[2px] space-y-[2px] ps-4">
                        {SAMPLE_TASKS.map((task) => (
                          <div
                            key={task.id}
                            role="button"
                            tabIndex={0}
                            className="group/task-item flex h-9 w-full cursor-pointer items-center gap-2 rounded-lg px-2 py-1 text-start text-[var(--ink)] hover:bg-black/[0.04] dark:hover:bg-white/[0.06] transition-colors"
                          >
                            <span className="flex size-4 shrink-0 items-center justify-center text-[var(--muted)]">
                              {task.type === "doc" && (
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  width="16"
                                  height="16"
                                  fill="none"
                                  viewBox="0 0 16 16"
                                  className="size-4"
                                >
                                  <path
                                    stroke="currentColor"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M9.333 1.333V4a1.333 1.333 0 0 0 1.334 1.333h2.666M6.667 6H5.333m5.334 2.667H5.333m5.334 2.666H5.333m4.667-10H4a1.333 1.333 0 0 0-1.333 1.334v10.666A1.333 1.333 0 0 0 4 14.667h8a1.333 1.333 0 0 0 1.333-1.334V4.667z"
                                  />
                                </svg>
                              )}
                              {task.type === "slides" && (
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  width="16"
                                  height="16"
                                  fill="none"
                                  viewBox="0 0 16 16"
                                  className="size-4"
                                >
                                  <path
                                    stroke="currentColor"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M12.666 11.333v-8A1.333 1.333 0 0 0 11.333 2H2.666m0 0A1.333 1.333 0 0 1 4 3.333v9.334A1.333 1.333 0 0 0 5.333 14M2.666 2a1.333 1.333 0 0 0-1.333 1.333v1.334A.667.667 0 0 0 2 5.333h2M5.333 14h8a1.333 1.333 0 0 0 1.333-1.333V12a.667.667 0 0 0-.666-.667H7.333a.667.667 0 0 0-.667.667v.667A1.333 1.333 0 0 1 5.333 14"
                                  />
                                </svg>
                              )}
                              {task.type === "chart" && (
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  width="16"
                                  height="16"
                                  fill="none"
                                  viewBox="0 0 16 16"
                                  className="size-4"
                                >
                                  <rect
                                    width="12.667"
                                    height="9.333"
                                    x="2"
                                    y="2"
                                    stroke="currentColor"
                                    rx="2.667"
                                  />
                                  <path
                                    stroke="currentColor"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="m4.333 9 2.333-2.666 2.667 2 3-3.667M5 14.667l3.333-3 3.334 3"
                                  />
                                </svg>
                              )}
                            </span>
                            <span className="min-w-0 flex-1 truncate text-sm font-normal font-sans leading-5 text-[var(--ink)] text-start">
                              {task.title}
                            </span>
                            <button
                              type="button"
                              aria-label="More"
                              className="inline-flex size-6 items-center justify-center rounded-lg text-[var(--muted)] opacity-0 group-hover/task-item:opacity-100 hover:bg-black/[0.06] dark:hover:bg-white/[0.08] hover:text-[var(--ink)] transition-opacity cursor-pointer"
                            >
                              <Ellipsis className="size-4" strokeWidth={1.8} />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Section: Upgrade Banner & Profile Row */}
          <div className="shrink-0 px-4 pb-4">
            <div className="border-t border-[var(--border)] pt-4">
              {/* Offer Banner */}
              <div className="relative mb-4">
                <button
                  type="button"
                  onClick={openPricingModal}
                  className="flex h-14 w-full cursor-pointer items-center justify-between rounded-xl border border-[var(--border)] bg-[var(--surface)] px-4 text-start transition-colors hover:bg-black/[0.02] dark:hover:bg-white/[0.03] shadow-2xs"
                >
                  <span className="flex min-w-0 flex-1 items-center gap-2">
                    <span className="flex size-6 shrink-0 items-center justify-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        fill="none"
                        viewBox="0 0 20 20"
                        className="size-5"
                        aria-hidden="true"
                      >
                        <path
                          fill="#F76b15"
                          d="M13.277 1.844a2.704 2.704 0 0 1 2.692 2.702c0 .422-.101.832-.285 1.203H16c.845 0 1.531.686 1.531 1.531v1.563c0 .845-.685 1.53-1.531 1.531h-.031v1.331a1.7 1.7 0 0 0-.742.486l-.093.114-.665.87v-2.801H10.5v5.531h.264c.083.362.288.707.636.972h.001l.694.528H5.844a2.313 2.313 0 0 1-2.313-2.312v-4.719H3.5a1.53 1.53 0 0 1-1.531-1.531V7.28c0-.845.685-1.531 1.531-1.531h.316a2.7 2.7 0 0 1-.285-1.203 2.704 2.704 0 0 1 2.69-2.702v-.001h.013c1.017-.012 1.946.486 2.677 1.298.32.354.598.769.839 1.226a6 6 0 0 1 .839-1.226c.73-.812 1.66-1.31 2.677-1.297h.003l.01-.001zM5.031 15.093a.814.814 0 0 0 .813.812H9v-5.531H5.031zM3.5 7.249a.03.03 0 0 0-.031.031v1.563c0 .017.014.031.031.031H9V7.249zm7 1.625H16a.03.03 0 0 0 .031-.031V7.28A.03.03 0 0 0 16 7.25h-5.5zM6.234 3.343a1.204 1.204 0 0 0-.85 2.054c.225.226.532.352.85.352h2.497c-.25-.655-.571-1.2-.935-1.604-.52-.578-1.064-.81-1.549-.802zm7.019 0c-.485-.009-1.029.224-1.549.802-.364.404-.684.949-.935 1.604h2.497a1.204 1.204 0 1 0 0-2.406z"
                        />
                        <path
                          fill="#F76b15"
                          d="M16.327 13.214a.222.222 0 0 1 .398.12l.082 1.405c.037.647.355 1.246.871 1.64l1.118.851a.223.223 0 0 1-.122.4l-1.402.08a2.22 2.22 0 0 0-1.64.873l-.853 1.117a.222.222 0 0 1-.398-.122l-.082-1.403a2.22 2.22 0 0 0-.871-1.64l-1.118-.851a.223.223 0 0 1 .122-.4l1.402-.08a2.22 2.22 0 0 0 1.64-.873z"
                        />
                      </svg>
                    </span>
                    <span className="min-w-0 text-sm font-medium font-sans text-[var(--ink)] truncate leading-6">
                      Up to{" "}
                      <span className="text-sm font-medium font-sans leading-6 text-[#F76B15]">
                        50% Off
                      </span>
                    </span>
                  </span>
                  <span className="flex shrink-0 items-center gap-0.5">
                    <span className="inline-flex h-4.5 shrink-0 items-center justify-center gap-1 rounded-full bg-[#F76B15] px-1.5 py-0.5 text-white">
                      <Clock2 className="size-3 text-white" strokeWidth={2} />
                      <span className="whitespace-nowrap text-center text-[10px] font-bold italic font-sans leading-3 text-white">
                        22:46:13
                      </span>
                    </span>
                    <ChevronRight className="size-4 text-[var(--muted)]" strokeWidth={1.8} />
                  </span>
                </button>
              </div>

              {/* Profile Row */}
              <div className="flex items-center justify-between gap-4">
                <div className="relative flex min-w-0 flex-1 items-center gap-2">
                  <div
                    onClick={() => setIsProfileOpen((prev) => !prev)}
                    className="flex items-center gap-2 cursor-pointer group/avatar"
                  >
                    {/* User Avatar */}
                    <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-[#E55A1B] text-white font-semibold text-sm shadow-[0_4px_12px_rgba(229,90,27,0.25)] overflow-hidden">
                      {user?.imageUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={user.imageUrl}
                          alt={userDisplayName}
                          className="size-full object-cover"
                        />
                      ) : (
                        <span>{userDisplayName[0] || "Z"}</span>
                      )}
                    </div>

                    {/* Credits Pill */}
                    <div className="flex h-8 items-center gap-1 rounded-full border border-[var(--border)] bg-[var(--surface)] px-3 text-sm font-medium font-sans leading-5 text-[var(--ink)] shadow-2xs group-hover/avatar:border-neutral-400/80 transition-colors">
                      <Sparkles className="size-3.5 text-[#2388FF]" />
                      <span dir="ltr">30</span>
                    </div>
                  </div>
                </div>

                {/* Utility Quick Links */}
                <div className="flex items-center gap-3.5 px-1 text-[var(--muted)]">
                  <button
                    type="button"
                    title="Desktop App"
                    aria-label="Desktop App"
                    className="cursor-pointer text-[var(--muted)] transition-colors hover:text-[var(--ink)]"
                  >
                    <MonitorSmartphone className="size-4" strokeWidth={1.8} />
                  </button>
                  <button
                    type="button"
                    title="What's New"
                    aria-label="What's New"
                    className="cursor-pointer text-[var(--muted)] transition-colors hover:text-[var(--ink)]"
                  >
                    <Rocket className="size-4" strokeWidth={1.8} />
                  </button>
                  <a
                    href="https://discord.gg"
                    target="_blank"
                    rel="noopener noreferrer"
                    title="Community Discord"
                    aria-label="Community Discord"
                    className="cursor-pointer text-[var(--muted)] transition-colors hover:text-[var(--ink)]"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      fill="none"
                      viewBox="0 0 16 16"
                      className="size-4"
                    >
                      <path
                        stroke="currentColor"
                        d="M13.113 3.346a.04.04 0 0 0-.019-.018 12.1 12.1 0 0 0-2.992-.927.045.045 0 0 0-.048.023 9 9 0 0 0-.373.765 11.2 11.2 0 0 0-3.36 0 8 8 0 0 0-.379-.765.05.05 0 0 0-.048-.023c-1.033.178-2.039.49-2.992.927a.04.04 0 0 0-.02.017C.977 6.191.455 8.967.711 11.71a.05.05 0 0 0 .019.034c1.11.822 2.35 1.449 3.67 1.855a.05.05 0 0 0 .052-.017q.426-.58.751-1.221a.05.05 0 0 0-.009-.054l-.016-.01a8 8 0 0 1-1.147-.547.05.05 0 0 1-.02-.06.1.1 0 0 1 .015-.018q.115-.086.228-.179a.05.05 0 0 1 .047-.006c2.406 1.098 5.01 1.098 7.388 0a.05.05 0 0 1 .048.006q.112.092.228.179.01.007.015.018a.05.05 0 0 1-.003.044.1.1 0 0 1-.016.016q-.55.321-1.147.546l-.016.01a.05.05 0 0 0-.014.036q0 .01.005.019.33.639.75 1.22a.05.05 0 0 0 .052.018 12.2 12.2 0 0 0 3.677-1.855.05.05 0 0 0 .019-.034c.306-3.17-.514-5.922-2.174-8.363Zm-7.55 6.694c-.725 0-1.322-.665-1.322-1.481s.585-1.481 1.321-1.481c.742 0 1.333.67 1.321 1.48 0 .817-.585 1.482-1.32 1.482Zm4.884 0c-.725 0-1.321-.665-1.321-1.481s.585-1.481 1.32-1.481c.742 0 1.333.67 1.322 1.48 0 .817-.58 1.482-1.321 1.482Z"
                      />
                    </svg>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 3. CUSTOM PROFILE DROPDOWN MENU MODAL (ADAPTS TO WORKSPACE THEME)        */}
      {/* ========================================================================= */}
      {isProfileOpen && (
        <div
          ref={dropdownRef}
          className="absolute bottom-16 left-4 z-[70] w-[316px] max-w-[calc(100vw-1.5rem)] rounded-xl border border-[var(--border)] bg-white dark:bg-[var(--surface)] p-1 text-start shadow-md dark:shadow-[0_10px_40px_rgba(0,0,0,0.6)] animate-in fade-in-0 zoom-in-95 text-[var(--ink)] overflow-x-hidden overflow-y-auto"
          role="menu"
          aria-orientation="vertical"
        >
          {/* User Info Header Label */}
          <div className="px-2 py-1.5 text-sm font-normal">
            <div className="flex flex-1 text-start text-sm leading-tight items-start">
              <div className="flex-1 flex flex-col overflow-hidden">
                <span className="truncate font-semibold leading-5 text-[var(--ink)]" title={userDisplayName}>
                  {userDisplayName}
                </span>
                <span className="truncate text-xs text-[var(--muted)] leading-5" title={userEmail}>
                  {userEmail}
                </span>
              </div>
            </div>
          </div>

          {/* Credits Box */}
          <div className="p-1">
            <div className="bg-white dark:bg-[var(--paper)] border rounded-xl shadow-[0px_2px_4px_0px_rgba(0,0,0,0.05)] dark:shadow-none flex w-full min-w-[128px] flex-col gap-2 px-4 pt-4 pb-2 text-start border-orange-300 dark:border-orange-500/40">
              {/* Row 1: Credits & Usage */}
              <div className="flex items-center justify-between gap-3 pb-1">
                <div className="flex min-w-0 items-center gap-2">
                  <Sparkles className="size-4 text-[#2388FF]" />
                  <span className="truncate text-sm font-medium text-[var(--ink)] leading-5">
                    30&nbsp;Credits
                  </span>
                </div>
                <button
                  type="button"
                  className="inline-flex items-center justify-center whitespace-nowrap rounded-full h-4 gap-1 px-0 py-0 text-xs font-medium text-[var(--muted)] leading-4 hover:bg-transparent hover:text-[var(--ink)] cursor-pointer"
                >
                  <span>Usage</span>
                  <ChevronRight className="size-4 text-[var(--muted)]" />
                </button>
              </div>

              {/* Row 2: Expiration & Amount */}
              <div className="flex w-full items-start justify-between gap-3 text-[var(--muted)]">
                <div className="min-w-0 flex-1 text-xs leading-4">
                  <p className="mb-0">Welcome credits</p>
                  <p>Expire on Sep 21, 2027</p>
                </div>
                <span className="shrink-0 text-xs font-bold leading-4 text-[var(--ink)]">
                  30
                </span>
              </div>

              <div className="h-px bg-[var(--border)] w-full my-1" />

              {/* Row 3: Plan & Compact Upgrade Button */}
              <div className="flex flex-col w-full">
                <div className="flex w-full items-center justify-between gap-3">
                  <span className="text-xs text-[var(--muted)] leading-4 font-medium">Free Plan</span>
                  <button
                    type="button"
                    onClick={() => {
                      setIsProfileOpen(false);
                      openPricingModal();
                    }}
                    className="h-6.5 rounded-full bg-[#335cff] hover:bg-[#2547d8] px-2.5 text-xs font-medium text-white transition-colors cursor-pointer"
                  >
                    Upgrade
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Menu Item: Settings */}
          <div
            role="menuitem"
            className="flex cursor-pointer items-center gap-2 rounded-lg px-2 py-1.5 text-start text-[13px] text-[var(--ink)] outline-hidden select-none hover:bg-black/[0.04] dark:hover:bg-white/[0.06] transition-colors"
          >
            <Settings className="size-4 text-[var(--muted)]" strokeWidth={1.8} />
            <span>Settings</span>
          </div>

          {/* Menu Item: Theme Switcher */}
          <div
            role="menuitem"
            onClick={toggleTheme}
            className="flex cursor-pointer items-center justify-between rounded-sm px-2 py-1.5 text-[13px] text-[var(--ink)] outline-hidden select-none hover:bg-black/[0.04] dark:hover:bg-white/[0.06] transition-colors"
          >
            <div className="flex items-center gap-2">
              <div className="relative size-4 flex items-center justify-center text-[var(--ink)]">
                {theme === "dark" ? (
                  <Moon className="size-4 text-[var(--muted)]" strokeWidth={1.8} />
                ) : (
                  <Sun className="size-4 text-[var(--muted)]" strokeWidth={2.3} />
                )}
              </div>
              <span>Theme</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="text-[var(--muted)] text-xs capitalize tracking-widest ms-auto">
                {theme}
              </span>
              <ChevronRight className="size-4 text-[var(--muted)]" strokeWidth={2} />
            </div>
          </div>

          {/* Menu Item: Language */}
          <div
            role="menuitem"
            className="flex cursor-pointer items-center justify-between rounded-sm px-2 py-1.5 text-[13px] text-[var(--ink)] outline-hidden select-none hover:bg-black/[0.04] dark:hover:bg-white/[0.06] transition-colors"
          >
            <div className="flex items-center gap-2">
              <Globe className="size-4 text-[var(--muted)]" strokeWidth={1.8} />
              <span>Language</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="text-[var(--muted)] ms-auto text-xs tracking-normal">
                English
              </span>
              <ChevronRight className="size-4 text-[var(--muted)]" strokeWidth={2} />
            </div>
          </div>

          {/* Menu Item: Help & Support */}
          <div
            role="menuitem"
            className="flex flex-col items-start gap-1 rounded-lg px-2 py-1.5 text-start text-[13px] text-[var(--ink)] outline-hidden select-none hover:bg-transparent"
          >
            <div className="flex items-center gap-2 text-[var(--ink)]">
              <CircleHelp className="size-4 text-[var(--muted)]" strokeWidth={1.8} />
              <span>Help &amp; Support</span>
            </div>
            <p className="ps-6 text-start text-[11px] leading-relaxed text-[var(--muted)]">
              Need help? Contact us at{" "}
              <a href="mailto:support@zicdeck.com" className="text-[#335cff] hover:underline">
                support@zicdeck.com
              </a>
            </p>
          </div>

          <div className="bg-[var(--border)] -mx-1 my-1 h-px" />

          {/* Menu Item: Log out */}
          <button
            type="button"
            onClick={() => signOut()}
            role="menuitem"
            className="flex w-full cursor-pointer items-center gap-2 rounded-lg px-2 py-1.5 text-start text-[13px] text-[var(--ink)] hover:bg-black/[0.04] dark:hover:bg-white/[0.06] transition-colors"
          >
            <LogOut className="size-4 text-[var(--muted)]" strokeWidth={1.8} />
            <span>Log out</span>
          </button>
        </div>
      )}
    </aside>
  );
}

export default WorkspaceSidebar;
