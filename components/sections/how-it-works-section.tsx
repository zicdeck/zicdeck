import { FileUp, MessageSquare, CheckCircle2 } from "lucide-react";
import { PillBadge } from "@/components/ui/pill-badge";

const STEPS = [
  {
    number: "01",
    title: "Connect your deck",
    description:
      "Upload your existing PowerPoint file or sync from Google Slides. Zicdeck maps your typography, grid, and master templates automatically.",
    icon: FileUp,
    badge: "PPTX & Google Slides",
  },
  {
    number: "02",
    title: "Tell it what to change",
    description:
      "Type what needs updating in plain English. Ask to rebalance a 3-column layout, incorporate new Q3 figures, or tighten the executive summary.",
    icon: MessageSquare,
    badge: "Plain-language chat",
  },
  {
    number: "03",
    title: "Review in your exact template",
    description:
      "Inspect the revision rendered directly in your native slide styles. Accept changes individually or export immediately to presentation format.",
    icon: CheckCircle2,
    badge: "100% Brand fidelity",
  },
];

export function HowItWorksSection() {
  return (
    <section id="how-it-works" className="mx-auto max-w-6xl px-5 pt-24 sm:px-8 lg:pt-32">
      <div className="mx-auto max-w-3xl text-center">
        <PillBadge label="Simple 3-step workflow" />
        <h2 className="mt-6 font-display text-3xl font-semibold leading-tight tracking-[-0.055em] text-[var(--ink)] sm:text-4xl lg:text-5xl">
          From rough prompt to boardroom-ready in seconds.
        </h2>
        <p className="mt-5 text-base leading-7 text-[var(--muted)] sm:text-lg">
          No complex prompt engineering or broken exports. Work directly on your native deck templates with precision edits.
        </p>
      </div>

      <div className="relative mt-16 lg:mt-20">
        {/* Desktop Sequence Connector Line */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute left-12 right-12 top-10 hidden border-t border-[var(--border)] lg:block"
        />

        <div className="grid gap-8 md:grid-cols-3 lg:gap-8">
          {STEPS.map((step) => {
            const Icon = step.icon;
            return (
              <div
                key={step.number}
                className="relative flex flex-col rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-xs transition-shadow hover:shadow-sm"
              >
                {/* Step header: Number & Icon */}
                <div className="flex items-center justify-between">
                  <span className="font-display text-2xl font-semibold tracking-tight text-[var(--muted)]/60">
                    {step.number}
                  </span>
                  <div className="flex size-10 items-center justify-center rounded-xl bg-[var(--paper)] text-[var(--accent)] ring-1 ring-[var(--border)]">
                    <Icon className="size-5" />
                  </div>
                </div>

                {/* Step Content */}
                <div className="mt-6 flex flex-1 flex-col justify-between">
                  <div>
                    <h3 className="font-display text-lg font-semibold tracking-[-0.03em] text-[var(--ink)]">
                      {step.title}
                    </h3>
                    <p className="mt-3 text-sm leading-6 text-[var(--muted)]">
                      {step.description}
                    </p>
                  </div>

                  <div className="mt-6 inline-flex w-fit items-center rounded-md border border-[var(--border)] bg-[var(--paper)] px-2.5 py-1 text-xs font-medium text-[var(--muted)]">
                    {step.badge}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default HowItWorksSection;
