"use client";

import { useEffect, useRef, useState } from "react";
import { FileUp, MessageSquare, CheckCircle2 } from "lucide-react";
import { PillBadge } from "@/components/ui/pill-badge";

const STEPS = [
  { number: "01", title: "Connect your deck", description: "Upload your existing PowerPoint file or sync from Google Slides. Zicdeck maps your typography, grid, and master templates automatically.", icon: FileUp, badge: "PPTX & Google Slides" },
  { number: "02", title: "Tell it what to change", description: "Type what needs updating in plain English. Ask to rebalance a 3-column layout, incorporate new Q3 figures, or tighten the executive summary.", icon: MessageSquare, badge: "Plain-language chat" },
  { number: "03", title: "Review in your exact template", description: "Inspect the revision rendered directly in your native slide styles. Accept changes individually or export immediately to presentation format.", icon: CheckCircle2, badge: "100% Brand fidelity" },
];

export function HowItWorksSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const node = sectionRef.current;
    if (!node) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setIsVisible(true);
        observer.disconnect();
      }
    }, { threshold: 0.2 });
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <section id="how-it-works" className="mx-auto max-w-6xl px-5 pt-24 sm:px-8 lg:pt-32">
      <div className="mx-auto max-w-3xl text-center">
        <PillBadge label="Simple 3-step workflow" />
        <h2 className="mt-6 font-display text-3xl font-semibold leading-tight tracking-[-0.055em] text-[var(--ink)] sm:text-4xl lg:text-5xl">From rough prompt to boardroom-ready in seconds.</h2>
        <p className="mt-5 text-base leading-7 text-[var(--muted)] sm:text-lg">No complex prompt engineering or broken exports. Work directly on your native deck templates with precision edits.</p>
      </div>

      <div ref={sectionRef} className="relative mt-16 lg:mt-20">
        <div aria-hidden="true" className="pointer-events-none absolute left-[12%] right-[12%] top-7 hidden h-px bg-[linear-gradient(90deg,transparent,var(--accent),transparent)] lg:block" />
        <div aria-hidden="true" className="pointer-events-none absolute left-[12%] right-[12%] top-6 hidden h-3 rounded-full bg-[var(--accent-soft)]/80 blur-md lg:block" />

        <div className="grid gap-6 md:grid-cols-3 lg:gap-8">
          {STEPS.map((step, index) => {
            const Icon = step.icon;
            return (
              <article
                key={step.number}
                className={`relative flex flex-col rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-[0_5px_16px_rgba(20,21,26,0.035)] transition-[transform,opacity,box-shadow] duration-700 ease-out hover:-translate-y-1 hover:shadow-[0_18px_32px_rgba(20,21,26,0.09)] ${isVisible ? "translate-y-0 opacity-100" : "translate-y-5 opacity-0"}`}
                style={{ transitionDelay: `${index * 120}ms` }}
              >
                <div className="flex items-center justify-between">
                  <span className="relative z-10 flex size-14 items-center justify-center rounded-full border border-[#D6DEFF] bg-white font-display text-lg font-semibold tracking-tight text-[var(--accent)] shadow-sm">{step.number}</span>
                  <div className="flex size-12 items-center justify-center rounded-2xl bg-[var(--accent-soft)] text-[var(--accent)] shadow-sm ring-1 ring-[#D9E1FF]"><Icon className="size-5" /></div>
                </div>
                <div className="mt-7 flex flex-1 flex-col justify-between">
                  <div><h3 className="font-display text-xl font-semibold tracking-[-0.04em] text-[var(--ink)]">{step.title}</h3><p className="mt-3 text-sm leading-6 text-[var(--muted)]">{step.description}</p></div>
                  <div className="mt-6 inline-flex w-fit items-center rounded-full border border-[var(--border)] bg-[var(--paper)] px-2.5 py-1 text-xs font-semibold text-[var(--muted)]">{step.badge}</div>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default HowItWorksSection;
