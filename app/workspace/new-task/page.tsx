"use client";

import React, { useState } from "react";
import Image from "next/image";
import {
  Clock2,
  ArrowRight,
  ChevronDown,
  ChevronRight,
  Shapes,
  Sparkles,
  Image as ImageIcon,
  Presentation,
} from "lucide-react";
import { ChatComposer } from "@/components/ChatComposer";
import { cn } from "@/lib/utils";

interface ShowcaseItem {
  id: string;
  title: string;
  category: string;
  type: "Slide" | "Image";
  aspect: "landscape" | "portrait";
  image: string;
}

const CATEGORIES = [
  "All Showcases",
  "Education",
  "Marketing",
  "Academic Research",
  "Pitch Deck",
  "Clinical Training",
  "Government Consulting",
  "Professional Reports",
  "Sales",
  "Others",
];

const SHOWCASE_ITEMS: ShowcaseItem[] = [
  {
    id: "1",
    title: "Jev: Machine-Native Decision Intelligence",
    category: "Academic Research",
    type: "Slide",
    aspect: "landscape",
    image: "https://ppt-cdn.dokie.ai/user_43/project_0/c2/2b6ff482c8.webp?imageMogr2/format/webp",
  },
  {
    id: "2",
    title: "GPT-6: From Chatbot to Autonomous Agent",
    category: "Academic Research",
    type: "Image",
    aspect: "landscape",
    image: "https://ppt-cdn.dokie.ai/user_43/project_0/5d/03d551b904.webp?imageMogr2/format/webp",
  },
  {
    id: "3",
    title: "Photographer Portfolio",
    category: "Marketing",
    type: "Image",
    aspect: "landscape",
    image: "https://ppt-cdn.dokie.ai/user_122821/project_2637677/82/bbfc48d480.png?imageMogr2/format/webp",
  },
  {
    id: "5",
    title: "Quarterly Performance Report",
    category: "Professional Reports",
    type: "Slide",
    aspect: "landscape",
    image: "https://ppt-cdn.dokie.ai/user_1/project_0/e6/e230d9cf2a.png?imageMogr2/format/webp",
  },
  {
    id: "6",
    title: "Trump 2026 Policy Research",
    category: "Government Consulting",
    type: "Slide",
    aspect: "landscape",
    image: "https://ppt-cdn.dokie.ai/user_1/project_0/9d/0c1fbc0f9e.png?imageMogr2/format/webp",
  },
  {
    id: "7",
    title: "Meditation Space Thesis Defense",
    category: "Education",
    type: "Image",
    aspect: "landscape",
    image: "https://ppt-cdn.dokie.ai/user_362996/project_3201923/a5/ef758084b4.png?imageMogr2/format/webp",
  },
  {
    id: "8",
    title: "Brand Identity Design Research",
    category: "Marketing",
    type: "Image",
    aspect: "landscape",
    image: "https://ppt-cdn.dokie.ai/user_362996/project_3213537/e7/d8bbda926c.png?imageMogr2/format/webp",
  },
  {
    id: "9",
    title: "Content Performance Editorial Plan",
    category: "Marketing",
    type: "Image",
    aspect: "landscape",
    image: "https://ppt-cdn.dokie.ai/user_362996/project_3201912/22/1d6b91247a.png?imageMogr2/format/webp",
  },
  {
    id: "10",
    title: "The Donkey And The Treadmill",
    category: "Education",
    type: "Slide",
    aspect: "landscape",
    image: "https://ppt-cdn.dokie.ai/user_1/project_0/b5/6f386c3637.png?imageMogr2/format/webp",
  },
  {
    id: "11",
    title: "Dessert-Inspired Business Plan",
    category: "Pitch Deck",
    type: "Image",
    aspect: "landscape",
    image: "https://ppt-cdn.dokie.ai/user_362996/project_3201949/ee/1b39a83640.png?imageMogr2/format/webp",
  },
  {
    id: "12",
    title: "Car Introduction",
    category: "Sales",
    type: "Image",
    aspect: "portrait",
    image: "https://ppt-cdn.dokie.ai/user_206933/project_2772015/21/bd2663a339.png?imageMogr2/format/webp",
  },
  {
    id: "13",
    title: "Plant Specimen Science",
    category: "Education",
    type: "Image",
    aspect: "portrait",
    image: "https://ppt-cdn.dokie.ai/user_122821/project_2787078/a3/f3eef33498.png?imageMogr2/format/webp",
  },
  {
    id: "14",
    title: "Eye-Tracking Report",
    category: "Academic Research",
    type: "Image",
    aspect: "landscape",
    image: "https://ppt-cdn.dokie.ai/user_122821/project_2908953/2a/d6ad31eea4.png?imageMogr2/format/webp",
  },
  {
    id: "15",
    title: "AI Fundamentals for Teachers",
    category: "Education",
    type: "Image",
    aspect: "landscape",
    image: "https://ppt-cdn.dokie.ai/user_1/project_0/ff/b309440c61.png?imageMogr2/format/webp",
  },
  {
    id: "16",
    title: "Breast Carcinoma Treatment Case",
    category: "Clinical Training",
    type: "Image",
    aspect: "landscape",
    image: "https://ppt-cdn.dokie.ai/user_362996/project_3201949/39/f3d42c9428.png?imageMogr2/format/webp",
  },
  {
    id: "17",
    title: "Visual Design Studio Social",
    category: "Marketing",
    type: "Image",
    aspect: "portrait",
    image: "https://ppt-cdn.dokie.ai/user_206933/project_3130040/10/5b12ee52c3.png?imageMogr2/format/webp",
  },
  {
    id: "18",
    title: "Cyberpunk Growth Strategy",
    category: "Pitch Deck",
    type: "Image",
    aspect: "landscape",
    image: "https://ppt-cdn.dokie.ai/user_362996/project_3201949/bc/7013521659.png?imageMogr2/format/webp",
  },
  {
    id: "19",
    title: "PeopleFlow Platform Overview",
    category: "Pitch Deck",
    type: "Image",
    aspect: "landscape",
    image: "https://ppt-cdn.dokie.ai/user_362996/project_3201923/84/0f2d6bf124.png?imageMogr2/format/webp",
  },
  {
    id: "20",
    title: "A Third-Quarter Sales Strategy and Business Development Plan",
    category: "Sales",
    type: "Slide",
    aspect: "landscape",
    image: "https://ppt-cdn.dokie.ai/user_1/project_0/e0/bbfdd23b77.png?imageMogr2/format/webp",
  },
];

const ACTION_PILLS = [
  {
    id: "write-draft",
    label: "Write draft",
    icon: "https://fe-cdn.dokie.ai/dokie/prod/public/images/home-hero/ic-write-draft.png",
  },
  {
    id: "create-slides",
    label: "Create slides",
    icon: "https://fe-cdn.dokie.ai/dokie/prod/public/images/home-hero/ic-create-slides.png",
  },
  {
    id: "create-long-scroll",
    label: "Create long scroll",
    icon: "https://fe-cdn.dokie.ai/dokie/prod/public/images/home-hero/ic-create-long-scroll.png",
  },
  {
    id: "design-visuals",
    label: "Design Visuals",
    badge: "GPT Image2",
    icon: "https://fe-cdn.dokie.ai/dokie/prod/public/images/home-hero/ic-create-image-2.png",
  },
];

export default function NewTaskPage() {
  const [selectedCategory, setSelectedCategory] = useState("All Showcases");

  const filteredShowcases = SHOWCASE_ITEMS.filter((item) =>
    selectedCategory === "All Showcases" ? true : item.category === selectedCategory
  );

  return (
    <div className="relative z-0 h-full min-h-0 w-full">
      <div className="relative flex h-full flex-col overflow-y-auto bg-white/60 dark:bg-transparent [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {/* Top Center Promo Banner */}
        <div className="pointer-events-none absolute inset-x-0 top-4 z-10 flex justify-center px-4">
          <div className="pointer-events-auto flex w-full justify-center">
            <button
              type="button"
              className="inline-flex h-8.5 max-w-[calc(100%-32px)] min-w-20 cursor-pointer items-center justify-between gap-2 rounded-full bg-[#fff7f1] px-3.5 py-1 text-xs sm:text-[13px] font-medium text-[var(--ink)] transition-all hover:bg-[#ffeee2]"
            >
              <span className="flex min-w-0 items-center gap-1.5">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  fill="none"
                  viewBox="0 0 20 20"
                  className="size-4 shrink-0"
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
                <span className="truncate whitespace-nowrap text-xs sm:text-[13px] font-medium font-sans leading-5 text-[var(--ink)]">
                  Upgrade now and save up to 50%
                </span>
              </span>
              <span className="flex shrink-0 items-center gap-1 ps-0 sm:ps-6">
                <span className="inline-flex h-4 shrink-0 items-center justify-center gap-0.5 rounded-full bg-[#F76B15] px-1.5 py-0.5 text-white">
                  <Clock2 className="size-2.5 text-white" strokeWidth={2} />
                  <span className="whitespace-nowrap text-center text-[9.5px] font-bold italic font-sans leading-3 text-white">
                    22:29:58
                  </span>
                </span>
                <ArrowRight className="size-3.5 text-[var(--ink)]" strokeWidth={1.8} />
              </span>
            </button>
          </div>
        </div>

        {/* Top Right Actions */}
        <div className="absolute end-4 top-4 z-10 flex items-center gap-2">
          <button
            type="button"
            className="inline-flex h-8.5 items-center justify-center gap-1 rounded-full px-3 text-xs sm:text-sm font-medium text-[var(--muted)] hover:bg-black/[0.04] transition-colors cursor-pointer"
          >
            <span>Free model</span>
            <ChevronDown className="size-3.5 opacity-60" />
          </button>
          <button
            type="button"
            className="inline-flex h-9.5 items-center justify-center gap-2 rounded-full border border-[var(--border)] bg-white px-4 text-xs sm:text-sm font-medium text-[var(--ink)] shadow-2xs transition-colors hover:bg-black/[0.02] cursor-pointer"
          >
            <Shapes className="size-4" />
            <span>Personalization</span>
          </button>
        </div>

        {/* Central Hero & Composer */}
        <div className="flex shrink-0 flex-col items-center px-6 pt-[104px] sm:pt-[112px]">
          <div className="w-full max-w-[860px]">
            {/* Logo & Title */}
            <div className="mb-6 flex flex-col items-center gap-3.5 text-center">
              <div className="flex size-14 items-center justify-center gap-4">
                <Image
                  src="/logo.svg"
                  alt="ZicDeck"
                  width={32}
                  height={32}
                  priority
                  className="w-full object-contain"
                />
                <span className="font-medium text-5xl font-display text-[var(--ink)]">ZicDeck</span>
              </div>
              <h1 className="font-display text-2xl font-normal tracking-tight text-[var(--ink)] sm:text-3xl lg:text-[32px]">
                Tell me your idea—let&apos;s bring it to life together.
              </h1>
            </div>

            {/* ChatComposer Box */}
            <ChatComposer
              placeholder="Describe your topic or idea, or upload your files (doc, pdf, pptx, txt)…"
              className="w-full rounded-[24px] border-[0.5px] border-[var(--border)] bg-white p-4 text-start shadow-[0_-6px_12px_rgba(0,0,0,0.03),0_14px_28px_rgba(0,0,0,0.03)] backdrop-blur-[20px] md:rounded-[32px] md:p-5"
            />

            {/* Action Quick Pills */}
            <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
              {ACTION_PILLS.map((pill) => (
                <div key={pill.id} className="group relative pt-1 -mt-1">
                  <button
                    type="button"
                    className="relative flex h-10 min-w-16 cursor-pointer items-center gap-1.5 rounded-full border border-[var(--border)] bg-white px-3.5 py-1.5 text-xs font-normal font-sans text-[var(--ink)] shadow-none transition-transform duration-200 hover:bg-white group-hover:-translate-y-0.5"
                  >
                    {pill.badge && (
                      <span className="absolute end-0 top-[-10px] flex items-center gap-1 rounded-full bg-gradient-to-r from-[#9ecbff] to-[#2F5EFF] px-2 py-0.5 text-[10px] font-normal text-white">
                        <Sparkles className="size-2.5" />
                        <span>{pill.badge}</span>
                      </span>
                    )}
                    <Image
                      src={pill.icon}
                      alt={pill.label}
                      width={22}
                      height={22}
                      className="size-5 shrink-0 object-contain"
                    />
                    <span className="whitespace-nowrap leading-4 text-xs font-normal">{pill.label}</span>
                    <ChevronRight className="size-3.5 shrink-0 text-[var(--muted)]" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Showcase Gallery Section */}
        <div className="mt-12 w-full shrink-0 px-6">
          <div className="mx-auto w-full max-w-[1304px]">
            <section aria-labelledby="showcase-section-title" className="flex w-full flex-col gap-3 pb-12">
              {/* Category Filter Pills (Sticky on scroll) */}
              <div className="w-full">
                <div className="sticky top-0 z-20 -mx-2 bg-white/95 px-2 py-2.5 backdrop-blur-[12px]">
                  <div className="flex w-full items-center gap-2.5 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                    {CATEGORIES.map((cat) => {
                      const isSelected = selectedCategory === cat;
                      return (
                        <button
                          key={cat}
                          type="button"
                          onClick={() => setSelectedCategory(cat)}
                          className={cn(
                            "inline-flex h-[34px] min-w-0 w-auto shrink-0 cursor-pointer items-center justify-center rounded-full px-3.5 text-[13px] font-medium font-sans transition-all",
                            isSelected
                              ? "bg-black/[0.08] text-[var(--ink)] shadow-2xs"
                              : "text-[var(--muted)] hover:bg-black/[0.04] hover:text-[var(--ink)]"
                          )}
                        >
                          <span>{cat}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Responsive Masonry Grid (No vertical gaps between mixed aspect ratio cards) */}
                <div className="mt-4 columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-4 sm:gap-5 [column-fill:_balance]">
                  {filteredShowcases.map((item) => (
                    <article
                      key={item.id}
                      className="group relative mb-4 sm:mb-5 break-inside-avoid flex w-full flex-col gap-2 rounded-2xl p-1.5 transition-all hover:-translate-y-0.5"
                    >
                      {/* Image Thumbnail with Aspect Ratio */}
                      <div
                        tabIndex={0}
                        role="button"
                        aria-label={item.title}
                        className={cn(
                          "relative w-full cursor-pointer overflow-hidden rounded-xl bg-neutral-100 outline-none shadow-2xs focus-visible:ring-2 focus-visible:ring-[var(--accent)]",
                          item.aspect === "portrait" ? "aspect-[3/4]" : "aspect-[16/9]"
                        )}
                      >
                        <Image
                          src={item.image}
                          alt={item.title}
                          fill
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 33vw, 25vw"
                          className="size-full object-cover transition-transform duration-300 group-hover:scale-105"
                        />

                        {/* Hover Overlay Button */}
                        <button
                          type="button"
                          className="absolute bottom-3 left-1/2 z-20 hidden -translate-x-1/2 cursor-pointer items-center gap-1.5 rounded-full border border-white/30 bg-black/75 px-3 py-1 text-xs font-medium text-white opacity-0 backdrop-blur-md transition-all hover:bg-black/90 group-hover:opacity-100 sm:inline-flex"
                        >
                          <Sparkles className="size-3 text-white" />
                          <span>Use this template</span>
                        </button>
                      </div>

                      {/* Card Caption with Higher Font Sizes */}
                      <div className="flex w-full items-start justify-between gap-2 px-1 pt-1 pb-0.5">
                        <div className="flex min-w-0 flex-1 flex-col gap-1">
                          <h3
                            title={item.title}
                            className="w-full truncate font-sans text-sm font-medium leading-snug text-[var(--ink)]"
                          >
                            {item.title}
                          </h3>
                          <div className="flex items-center gap-1 text-xs text-[var(--muted)]">
                            {item.type === "Slide" ? (
                              <Presentation className="size-3.5 text-[var(--muted)]" />
                            ) : (
                              <ImageIcon className="size-3.5 text-[var(--muted)]" />
                            )}
                            <span>{item.type}</span>
                          </div>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
