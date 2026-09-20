"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { FadeUp } from "@/components/ui/fade-up";

const CAPABILITY_CARDS = [
  {
    id: "edit-by-asking",
    title: "Edit by asking",
    description:
      "Describe the change in plain language and get a thoughtful revision in the slide you already know.",
    image:
      "https://ppt-cdn.dokie.ai/home/img-home-power-by-ai-1.png?imageMogr2/format/webp",
    alt: "Edit by asking",
  },
  {
    id: "keep-system-intact",
    title: "Keep the system intact",
    description:
      "Typography, spacing, layouts, and visual hierarchy stay recognizably yours through every edit.",
    image:
      "https://ppt-cdn.dokie.ai/home/img-home-power-by-ai-2.png?imageMogr2/format/webp",
    alt: "Keep the system intact",
  },
  {
    id: "present-with-confidence",
    title: "Present with confidence",
    description:
      "Move quickly without choosing between speed and the polished, reliable work your audience expects.",
    image:
      "https://ppt-cdn.dokie.ai/home/img-home-power-by-ai-3.png?imageMogr2/format/webp",
    alt: "Present with confidence",
  },
];

export function CapabilitiesSection() {
  return (
    <section
      id="capabilities"
      className="relative mx-auto w-full max-w-[1440px] px-5 pt-24 sm:px-8 lg:pt-32"
    >
      {/* Section Header with Fade Up */}
      <FadeUp amount={0.3} yOffset={40} className="mx-auto flex flex-col items-center gap-4 text-center">
        <div className="!font-display inline-flex mb-[4px] items-center rounded-lg border border-[var(--border)] bg-white px-3 py-1 text-xs font-semibold uppercase tracking-wider text-[var(--ink)] shadow-2xs">
          Built for the real work
        </div>

        <h2 className="!font-display max-w-[850px] mx-auto text-3xl font-semibold tracking-[-0.04em] text-[var(--ink)] sm:text-4xl md:text-5xl lg:text-[57px] lg:leading-[1.12]">
          AI that respects the way your team works.
        </h2>

        <p className="max-w-[550px] font-display text-base leading-relaxed text-[var(--muted)] sm:text-lg lg:text-xl">
          ZicDeck is designed for the ten minutes before a meeting: precise changes, familiar files, and no cleanup after the fact.
        </p>

        <div className="mt-2">
          <Link
            href="/sign-up"
            className="inline-flex items-center justify-center gap-2 rounded-full bg-[var(--accent)] px-6 py-2.5 text-sm font-medium text-white shadow-sm transition-all hover:bg-[#254ecc] hover:scale-[1.02] active:scale-[0.98]"
          >
            <span>Start for free</span>
            <ArrowRight className="size-4" />
          </Link>
        </div>
      </FadeUp>

      {/* 3-Card Grid with Staggered Fade Up */}
      <div className="mx-auto mt-14 max-w-[1220px] sm:mt-16 lg:mt-18">
        <div className="grid grid-cols-1 gap-3 sm:gap-4 md:grid-cols-3">
          {CAPABILITY_CARDS.map((card, index) => (
            <FadeUp
              key={card.id}
              delay={index * 0.12}
              amount={0.25}
              yOffset={44}
              className="group flex flex-col justify-between overflow-hidden rounded-[26px] sm:rounded-[28px] border border-[var(--border)] bg-white transition-all duration-300 hover:-translate-y-0.5"
            >
              {/* Card Image with Seamless Bottom White Gradient Blend */}
              <div className="relative w-full overflow-hidden bg-white">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={card.image}
                  alt={card.alt}
                  className="w-full aspect-[408/305] object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                  loading="lazy"
                />

                {/* Seamless white fade overlay blending image bottom to pure white */}
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-white via-white/85 to-transparent"
                />
              </div>

              {/* Card Content Area */}
              <div className="flex flex-1 flex-col justify-start p-6 sm:p-7 sm:pb-8 bg-white">
                <div>
                  <h3 className="font-display text-lg sm:text-[20px] font-semibold tracking-[-0.02em] text-[var(--ink)]">
                    {card.title}
                  </h3>
                  <p className="mt-2.5 text-sm leading-relaxed text-[var(--muted)]">
                    {card.description}
                  </p>
                </div>
              </div>
            </FadeUp>
          ))}
        </div>
      </div>
    </section>
  );
}

export default CapabilitiesSection;
