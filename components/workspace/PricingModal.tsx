"use client";

import React, { useState, useEffect } from "react";
import { X, ArrowUpRight, Check } from "lucide-react";
import { useWorkspacePricingModal } from "./WorkspacePricingModalContext";
import { cn } from "@/lib/utils";

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

export function PricingModal() {
  const { isOpen, closePricingModal } = useWorkspacePricingModal();
  const [billing, setBilling] = useState<"monthly" | "yearly">("yearly");

  // Prevent background scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // Handle ESC key to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        closePricingModal();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, closePricingModal]);

  const targetMainPrice = billing === "monthly" ? 99 : 79;
  const targetPowerPrice = billing === "monthly" ? 199 : 159;

  const currentMainPrice = useSteppedCounter(targetMainPrice, 12);
  const currentPowerPrice = useSteppedCounter(targetPowerPrice, 8);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/25 backdrop-blur-xs p-0 sm:p-4 overflow-y-auto animate-fade-in"
      onClick={closePricingModal}
      role="dialog"
      aria-modal="true"
      aria-labelledby="pricing-modal-title"
    >
      {/* Modal Container: 24px padding (p-6), rounded-2xl, barely-looking border, compact */}
      <div
        onClick={(e) => e.stopPropagation()}
        className={cn(
          "relative flex flex-col w-full max-w-[880px] bg-white text-[var(--ink)] shadow-2xl transition-all",
          "h-full min-h-dvh sm:min-h-0 sm:h-auto sm:max-h-[92vh] sm:rounded-2xl border border-black/[0.06]",
          "p-6 overflow-y-auto [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        )}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between gap-4 pb-4">
          <h2
            id="pricing-modal-title"
            className="font-display text-xl sm:text-2xl font-bold tracking-tight text-[var(--ink)]"
          >
            Upgrade your plan
          </h2>

          <div className="flex items-center gap-3">
            {/* Billing Switcher: no border, compact pill */}
            <div className="inline-flex items-center rounded-full bg-neutral-100 p-0.5 shadow-2xs">
              <button
                type="button"
                onClick={() => setBilling("monthly")}
                className={cn(
                  "rounded-full px-3 py-1 text-xs font-medium transition-all cursor-pointer",
                  billing === "monthly"
                    ? "bg-white text-[var(--ink)] shadow-xs font-semibold"
                    : "text-[var(--muted)] hover:text-[var(--ink)]"
                )}
              >
                Monthly
              </button>

              <button
                type="button"
                onClick={() => setBilling("yearly")}
                className={cn(
                  "inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-medium transition-all cursor-pointer",
                  billing === "yearly"
                    ? "bg-white text-[var(--ink)] shadow-xs font-semibold"
                    : "text-[var(--muted)] hover:text-[var(--ink)]"
                )}
              >
                <span>Yearly</span>
                <span className="text-[#335cff] font-semibold text-[11px]">Save 20%</span>
              </button>
            </div>

            {/* Close Button */}
            <button
              type="button"
              onClick={closePricingModal}
              aria-label="Close pricing modal"
              className="inline-flex size-8 shrink-0 items-center justify-center rounded-full text-[var(--muted)] hover:text-[var(--ink)] hover:bg-neutral-100 transition-colors cursor-pointer"
            >
              <X className="size-4.5" />
            </button>
          </div>
        </div>

        {/* Existing Pricing Cards (Main & Power from pricing-section.tsx) */}
        <div className="flex gap-4 overflow-x-auto pb-2 pt-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:grid sm:grid-cols-2 sm:overflow-visible">
          {/* Card 1: Main */}
          <div className="flex flex-col justify-between rounded-[20px] bg-border/30 shadow-xs min-w-[290px] sm:min-w-0">
            <div>
              {/* Plan Header */}
              <div className="p-5 sm:p-6">
                <div className="flex items-center gap-2">
                  <h3 className="font-sans text-xl font-bold tracking-tight text-[var(--ink)]">
                    Main
                  </h3>
                  <span className="rounded-full bg-black/5 px-2 py-0.5 font-sans text-[11px] font-medium text-[var(--muted)]">
                    Most popular
                  </span>
                </div>
                <p className="mt-1.5 font-sans text-xs text-[var(--muted)]">
                  For teams managing recurring visibility workflows.
                </p>

                {/* Price Row */}
                <div className="mt-4 flex items-baseline gap-1">
                  <span className="font-sans text-4xl font-bold tracking-tight text-[var(--ink)]">
                    ${currentMainPrice}
                  </span>
                  <span className="font-sans text-xs text-[var(--muted)]">/month</span>
                </div>
                <span className="mt-0.5 block font-sans text-[11px] text-[var(--muted)]">
                  {billing === "monthly" ? "billed monthly" : "billed annually"}
                </span>

                {/* CTA Button */}
                <button
                  type="button"
                  onClick={closePricingModal}
                  className="mt-4 flex h-9.5 w-full items-center justify-center gap-1.5 rounded-xl border border-white/10 bg-[#335cff] px-4 py-2 font-sans text-sm font-semibold text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.16),0_1px_2px_rgba(14,18,27,0.18),0_0_0_1px_#335cff] transition-all hover:bg-[#2547d8] active:scale-[0.99] cursor-pointer"
                >
                  <span>Start trial</span>
                  <ArrowUpRight className="size-4 stroke-[2.5]" />
                </button>
              </div>

              {/* Feature List in White Card */}
              <div className="px-1.5 pb-1.5">
                <div className="rounded-2xl border border-black/[0.04] bg-white p-4 shadow-2xs">
                  <ul className="space-y-2.5">
                    {MAIN_FEATURES.map((feature) => (
                      <li key={feature} className="flex items-center gap-2.5">
                        <div className="flex size-4.5 shrink-0 items-center justify-center rounded-full bg-[#1fc16b] text-white">
                          <Check className="size-2.5 stroke-[3]" />
                        </div>
                        <span className="font-sans text-xs font-medium text-[var(--ink)]">
                          {feature}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Card 2: Power */}
          <div className="flex flex-col justify-between rounded-[20px] bg-border/30 shadow-xs min-w-[290px] sm:min-w-0">
            <div>
              {/* Plan Header */}
              <div className="p-5 sm:p-6">
                <div className="flex items-center gap-2">
                  <h3 className="font-sans text-xl font-bold tracking-tight text-[var(--ink)]">
                    Power
                  </h3>
                </div>
                <p className="mt-1.5 font-sans text-xs text-[var(--muted)]">
                  For high-volume teams and demanding operations.
                </p>

                {/* Price Row */}
                <div className="mt-4 flex items-baseline gap-1">
                  <span className="font-sans text-4xl font-bold tracking-tight text-[var(--ink)]">
                    ${currentPowerPrice}
                  </span>
                  <span className="font-sans text-xs text-[var(--muted)]">/month</span>
                </div>
                <span className="mt-0.5 block font-sans text-[11px] text-[var(--muted)]">
                  {billing === "monthly" ? "billed monthly" : "billed annually"}
                </span>

                {/* CTA Button */}
                <button
                  type="button"
                  onClick={closePricingModal}
                  className="mt-4 flex h-9.5 w-full items-center justify-center gap-1.5 rounded-xl border border-white/10 bg-[#335cff] px-4 py-2 font-sans text-sm font-semibold text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.16),0_1px_2px_rgba(14,18,27,0.18),0_0_0_1px_#335cff] transition-all hover:bg-[#2547d8] active:scale-[0.99] cursor-pointer"
                >
                  <span>Start trial</span>
                  <ArrowUpRight className="size-4 stroke-[2.5]" />
                </button>
              </div>

              {/* Feature List in White Card */}
              <div className="px-1.5 pb-1.5">
                <div className="rounded-2xl border border-black/[0.04] bg-white p-4 shadow-2xs">
                  <ul className="space-y-2.5">
                    {POWER_FEATURES.map((feature) => (
                      <li key={feature} className="flex items-center gap-2.5">
                        <div className="flex size-4.5 shrink-0 items-center justify-center rounded-full bg-[#1fc16b] text-white">
                          <Check className="size-2.5 stroke-[3]" />
                        </div>
                        <span className="font-sans text-xs font-medium text-[var(--ink)]">
                          {feature}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Guarantee Note */}
        <div className="mt-3 text-center">
          <span className="font-sans text-[11px] font-medium text-[var(--muted)]">
            3-day trial, switch or cancel anytime • 100% money-back guarantee
          </span>
        </div>
      </div>
    </div>
  );
}

export default PricingModal;
