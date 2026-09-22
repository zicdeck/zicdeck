"use client";

import React, { use } from "react";
import Link from "next/link";
import { ArrowLeft, Presentation as PresentationIcon } from "lucide-react";
import { INITIAL_OUTPUTS } from "@/lib/library-data";

export default function PresentationPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const presentation = INITIAL_OUTPUTS.find((item) => item.id === id);
  const title = presentation?.title || `Presentation ${id}`;

  return (
    <div className="relative z-0 flex h-full min-h-0 w-full flex-col overflow-hidden text-default">
      {/* Dark Theme Backdrop Blur Layer */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-0 rounded-[inherit] dark:bg-[rgba(24,24,24,0.78)] dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] dark:backdrop-blur-[24px]"
      />

      {/* Presentation Top Bar */}
      <header className="relative z-10 flex h-14 shrink-0 items-center justify-between border-b border-[var(--border)] px-4">
        <div className="flex items-center gap-3">
          <Link
            href="/workspace/library"
            className="inline-flex size-8 items-center justify-center rounded-lg text-mute hover:bg-light-gray hover:text-default transition-colors cursor-pointer"
            aria-label="Back to library"
          >
            <ArrowLeft className="size-4" />
          </Link>
          <div className="flex items-center gap-2">
            <PresentationIcon className="size-4 text-mute" />
            <h1 className="font-['Figtree'] text-sm font-semibold text-default">
              {title}
            </h1>
            {presentation?.slidesCount && (
              <span className="rounded-full bg-light-gray px-2 py-0.5 text-xs text-mute font-medium">
                {presentation.slidesCount} slides
              </span>
            )}
          </div>
        </div>
      </header>

      {/* Presentation Canvas / Preview Area */}
      <div className="relative z-0 flex min-h-0 flex-1 items-center justify-center overflow-auto p-6">
        {presentation?.image ? (
          <div className="relative flex max-h-full max-w-full items-center justify-center overflow-hidden rounded-xl border border-[var(--border)] shadow-lg transition-transform">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={presentation.image}
              alt={title}
              className="max-h-[calc(100vh-140px)] w-auto max-w-full rounded-xl object-contain"
            />
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center gap-3 text-center text-mute">
            <div className="flex size-14 items-center justify-center rounded-2xl border border-[var(--border)] bg-light-gray">
              <PresentationIcon className="size-6 stroke-[1.5]" />
            </div>
            <h2 className="font-['Figtree'] text-base font-medium text-default">
              {title}
            </h2>
            <p className="text-xs text-mute">Presentation ID: {id}</p>
          </div>
        )}
      </div>
    </div>
  );
}
