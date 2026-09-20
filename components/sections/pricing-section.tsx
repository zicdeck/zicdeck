"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowUpRight, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { FadeUp } from "@/components/ui/fade-up";
import Image from "next/image";

const MAIN_FEATURES = [
  "20,000 AI credits",
  "500 AI refreshes",
  "100 articles monthly",
  "900 tracked keywords",
  "25 tracked competitors",
  "Fable and GPT access",
  "MCP and API access",
  "Backlink exchange",
  "Priority support",
];

const POWER_FEATURES = [
  "45,000 AI credits",
  "1,000 AI refreshes",
  "200 articles monthly",
  "2,000 tracked keywords",
  "50 tracked competitors",
  "20x API capacity",
  "20x crawl capacity",
  "Backlink exchange",
  "Priority support",
];

const AVATAR_IMAGES = [
  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=64&h=64&fit=crop&crop=faces",
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=64&h=64&fit=crop&crop=faces",
  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=64&h=64&fit=crop&crop=faces",
  "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=64&h=64&fit=crop&crop=faces",
  "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=64&h=64&fit=crop&crop=faces",
  "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=64&h=64&fit=crop&crop=faces",
];

function useSteppedCounter(targetValue: number, stepIntervalMs: number = 10) {
  const [displayValue, setDisplayValue] = useState(targetValue);

  useEffect(() => {
    if (displayValue === targetValue) return;

    const timer = setInterval(() => {
      setDisplayValue((prev) => {
        if (prev === targetValue) {
          return prev;
        }
        if (prev < targetValue) {
          return prev + 1;
        }
        return prev - 1;
      });
    }, stepIntervalMs);

    return () => clearInterval(timer);
  }, [targetValue, displayValue, stepIntervalMs]);

  return displayValue;
}

export function PricingSection() {
  const [billing, setBilling] = useState<"monthly" | "yearly">("monthly");

  const targetMainPrice = billing === "monthly" ? 99 : 79;
  const targetPowerPrice = billing === "monthly" ? 199 : 159;

  const currentMainPrice = useSteppedCounter(targetMainPrice, 12);
  const currentPowerPrice = useSteppedCounter(targetPowerPrice, 8);

  return (
    <section id="pricing" className="relative mx-auto w-full max-w-[1280px] px-5 pt-24 sm:px-8 lg:pt-32">
      {/* Header Section with Fade Up */}
      <FadeUp amount={0.3} yOffset={40} className="mx-auto flex flex-col items-center gap-4 text-center">
        <div className="inline-flex items-center gap-2 rounded-[6px] bg-muted/5 pl-2 pr-2.5 py-1.5 text-xs font-medium text-[var(--muted)]">
          <div className="w-[15px]">
            <Image src={'/tag.svg'} alt="tag icon" width={16} height={16} className="w-full h-auto object-cover" />
          </div>
          <span className="text-ink text-[14px]">Designed for growing search teams</span>
        </div>

        <h2 className="font-display text-3xl font-semibold tracking-tight text-[var(--ink)] sm:text-[31px] md:text-[37px] lg:text-[51px] lg:leading-[1.1]">
          Scale with clarity, not complexity
        </h2>

        <p className="max-w-2xl font-sans text-sm leading-relaxed text-[var(--muted)] sm:text-base lg:text-[17px]">
          Choose a plan that grows with your team, simple, transparent, and optimized for search impact.
        </p>
      </FadeUp>

      {/* Billing Switch & Saving Hint */}
      <FadeUp delay={0.08} amount={0.3} yOffset={24} className="mt-8 flex items-center justify-center gap-3 sm:mt-10">
        <div className="relative inline-flex items-center rounded-[9px] bg-border/30 min-w-[200px] grid grid-cols-2 p-[2px] shadow-2xs ">
          <button
            type="button"
            onClick={() => setBilling("monthly")}
            className={cn(
              "w-full cursor-pointer rounded-[7px] px-4 py-1.5 font-display text-xs font-semibold transition-all sm:text-sm",
              billing === "monthly"
                ? "bg-white text-[var(--ink)] shadow-xs"
                : "text-[var(--muted)] hover:text-[var(--ink)]"
            )}
          >
            Monthly
          </button>
          <button
            type="button"
            onClick={() => setBilling("yearly")}
            className={cn(
              "w-full cursor-pointer rounded-[7px] px-4 py-1.5 font-sans text-xs font-semibold transition-all sm:text-sm",
              billing === "yearly"
                ? "bg-white text-[var(--ink)] shadow-xs"
                : "text-[var(--muted)] hover:text-[var(--ink)]"
            )}
          >
            Yearly
          </button>
        </div>

        {/* Save Hint with Curved Arrow */}
        <div className="flex items-center gap-1.5 font-sans text-xs font-semibold text-[var(--accent)] sm:text-sm mt-[-10px]">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="21"
            height="14.183"
            fill="none"
            overflow="visible"
            style={{ display: "block" }}
          >
            <path
              fill="currentColor"
              d="M.066 13.435a.5.5 0 1 0 .869.495L.5 13.683zm20.788-9.4a.5.5 0 0 0 0-.707L17.672.146a.5.5 0 1 0-.707.708l2.828 2.828-2.828 2.828a.5.5 0 1 0 .707.708zM.5 13.684l.435.247c2.25-3.953 9.247-9.748 19.565-9.748v-1C9.818 3.182 2.493 9.174.066 13.435z"
            />
          </svg>
          <span className="mt-[-6px] ml-[2px]">Save up to 20%</span>
        </div>
      </FadeUp>

      {/* 2-Card Grid with Staggered Fade Up */}
      <div className="mx-auto mt-12 grid max-w-[880px] grid-cols-1 gap-4 md:grid-cols-2 lg:gap-6">
        {/* Card 1: Main */}
        <FadeUp
          delay={0.1}
          amount={0.25}
          yOffset={44}
          className="flex flex-col justify-between rounded-[22px] sm:rounded-[26px] bg-border/30 shadow-xs"
        >
          <div>
            {/* Plan Header */}
            <div className="p-6 sm:p-7">
              <div className="flex items-center gap-2.5">
                <h3 className="font-sans text-2xl font-bold tracking-tight text-[var(--ink)]">Main</h3>
                <span className="font-sans text-xs font-medium text-[var(--muted)]">Most popular</span>
              </div>
              <p className="mt-2 font-sans text-xs text-[var(--muted)] sm:text-sm">
                For teams managing recurring visibility workflows.
              </p>
              {/* Price Row */}
              <div className="mt-6 flex items-baseline gap-1">
                <span className="font-sans text-5xl font-bold tracking-tight text-[var(--ink)]">
                  ${currentMainPrice}
                </span>
                <span className="font-sans text-sm text-[var(--muted)] sm:text-base">/month</span>
              </div>
              <span className="mt-1 block font-sans text-xs text-[var(--muted)]">
                {billing === "monthly" ? "billed monthly" : "billed annually"}
              </span>

              {/* CTA Button */}
              <Link
                href="/sign-up?plan=main"
                className="mt-5 flex h-10.5 w-full items-center justify-center gap-1.5 rounded-xl bg-[var(--accent)] px-4 py-2 font-sans text-[15px] font-semibold text-white shadow-xs transition-all hover:bg-[#254ecc] active:scale-[0.99] sm:text-base"
              >
                <span>Start trial</span>
                <ArrowUpRight className="size-4.5 stroke-[2.5]" />
              </Link>
            </div>

            {/* Feature List in White Card */}
            <div className="px-[5px] pb-[5px]">
              <div className="rounded-[17px] sm:rounded-[21px] border border-black/[0.04] bg-white p-5 sm:p-6 shadow-2xs">
                <ul className="space-y-3.5">
                  {MAIN_FEATURES.map((feature) => (
                    <li key={feature} className="flex items-center gap-3">
                      <div className="flex size-5 shrink-0 items-center justify-center rounded-full bg-[#1fc16b] text-white">
                        <Check className="size-3 stroke-[3]" />
                      </div>
                      <span className="font-sans text-sm font-medium text-[var(--ink)] sm:text-[14.5px]">
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </FadeUp>

        {/* Card 2: Power */}
        <FadeUp
          delay={0.2}
          amount={0.25}
          yOffset={44}
          className="flex flex-col justify-between rounded-[22px] sm:rounded-[26px] bg-border/30 shadow-xs"
        >
          <div>
            <div className="p-6 sm:p-7">
              {/* Plan Header */}
              <div className="flex items-center gap-2.5">
                <h3 className="font-sans text-2xl font-bold tracking-tight text-[var(--ink)]">Power</h3>
              </div>
              <p className="mt-2 font-sans text-xs text-[var(--muted)] sm:text-sm">
                For high-volume teams and demanding operations.
              </p>

              {/* Price Row */}
              <div className="mt-6 flex items-baseline gap-1">
                <span className="font-sans text-5xl font-bold tracking-tight text-[var(--ink)]">
                  ${currentPowerPrice}
                </span>
                <span className="font-sans text-sm text-[var(--muted)] sm:text-base">/month</span>
              </div>
              <span className="mt-1 block font-sans text-xs text-[var(--muted)]">
                {billing === "monthly" ? "billed monthly" : "billed annually"}
              </span>

              {/* CTA Button */}
              <Link
                href="/sign-up?plan=power"
                className="mt-5 flex h-10.5 w-full items-center justify-center gap-1.5 rounded-xl bg-[var(--accent)] px-4 py-2 font-sans text-[15px] font-semibold text-white shadow-xs transition-all hover:bg-[#254ecc] active:scale-[0.99] sm:text-base"
              >
                <span>Start trial</span>
                <ArrowUpRight className="size-4.5 stroke-[2.5]" />
              </Link>
            </div>

            {/* Feature List in White Card */}
            <div className="px-[5px] pb-[5px]">
              <div className="rounded-[17px] sm:rounded-[21px] border border-black/[0.04] bg-white p-5 sm:p-6 shadow-2xs">
                <ul className="space-y-3.5">
                  {POWER_FEATURES.map((feature) => (
                    <li key={feature} className="flex items-center gap-3">
                      <div className="flex size-5 shrink-0 items-center justify-center rounded-full bg-[#1fc16b] text-white">
                        <Check className="size-3 stroke-[3]" />
                      </div>
                      <span className="font-sans text-sm font-medium text-[var(--ink)] sm:text-[14.5px]">
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </FadeUp>
      </div>

      {/* Bottom Assurance Bar */}
      <FadeUp delay={0.3} className="mt-10 flex items-center justify-center gap-2.5 text-center sm:mt-12">
        <div className="flex -space-x-1.5 overflow-hidden">
          {AVATAR_IMAGES.map((src, i) => (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img
              key={i}
              src={src}
              alt=""
              className="inline-block size-5 rounded-full ring-2 ring-white object-cover"
              loading="lazy"
            />
          ))}
        </div>
        <span className="font-sans text-xs font-medium text-[var(--muted)]">
          3-day trial, switch or cancel anytime
        </span>
      </FadeUp>
    </section>
  );
}

export default PricingSection;
