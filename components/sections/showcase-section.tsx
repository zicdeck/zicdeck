import Image from "next/image";
import { ArrowDown, ArrowRight, Sparkles } from "lucide-react";
import { PillBadge } from "@/components/ui/pill-badge";

/**
 * SHOWCASE EXAMPLES:
 * TODO: Founder / Design team: Replace these placeholder mockups with real before-and-after
 * customer deck screenshots as real anonymized enterprise case studies are gathered.
 */

interface SlideComparison {
  id: string;
  category: string;
  userPrompt: string;
  before: { title: string; description: string; points: string[]; note: string };
  after: { title: string; description: string; highlight: { label: string; value: string }; items: { label: string; text: string }[] };
}

const COMPARISONS: SlideComparison[] = [
  {
    id: "financial-forecast",
    category: "Financial Update",
    userPrompt: "“Update this slide with Q4 actuals: $14.2M ARR (+24% YoY) and highlight CAC efficiency.”",
    before: {
      title: "Q4 Financial Overview & Budget Projections (Draft v3)",
      description: "Dense unformatted text pasted directly from raw financial spreadsheet export.",
      points: ["Revenue for Q4 reached $14,200,000 which is roughly 24% year over year growth compared to last year", "CAC was reduced by 18% due to organic channel growth and optimized enterprise SDR targeting", "Gross margin stayed consistent around 78% with slight cloud infrastructure overhead increase"],
      note: "Unbalanced bullets, generic font hierarchy, no key metric callouts.",
    },
    after: {
      title: "Q4 Performance: $14.2M ARR with Accelerated Unit Economics",
      description: "Structured executive summary preserving corporate typography and master slide grid.",
      highlight: { label: "ARR Growth", value: "+24% YoY" },
      items: [{ label: "Topline Revenue", text: "$14.2M ARR closing ahead of initial forecast" }, { label: "Acquisition Cost", text: "18% CAC efficiency via outbound pipeline maturation" }, { label: "Gross Margin", text: "78% margin maintained through infrastructure optimization" }],
    },
  },
  {
    id: "executive-narrative",
    category: "Strategy & Operations",
    userPrompt: "“Turn this crowded bullet slide into a 3-pillar strategic roadmap for next week's board meeting.”",
    before: {
      title: "2026 Strategic Initiatives & Team Priorities Checklist",
      description: "Wall of text with no clear visual hierarchy or reading path for executive stakeholders.",
      points: ["Pillar 1: Accelerate international enterprise expansion across EMEA region with 12 new hires", "Pillar 2: Deploy AI automation workflows into core product experience to reduce customer churn", "Pillar 3: Optimize operational efficiency and achieve net cash flow positivity by Q3 2026"],
      note: "Cramped 12pt bullets, no visual distinction between strategic pillars.",
    },
    after: {
      title: "2026 Strategic Direction: 3 Focused Pillars for Expansion",
      description: "Rebalanced 3-column architecture strictly aligned with brand color tokens and margins.",
      highlight: { label: "Target Horizon", value: "Q3 2026 Cash Positive" },
      items: [{ label: "01. Global Expansion", text: "Scale EMEA enterprise footprint with localized go-to-market teams" }, { label: "02. AI Workflow Engine", text: "Deliver native AI automation to strengthen retention across core accounts" }, { label: "03. Operational Discipline", text: "Streamline unit economics to secure net cash flow milestone" }],
    },
  },
];

export function ShowcaseSection() {
  return (
    <section id="showcase" className="mx-auto max-w-6xl px-5 pt-24 sm:px-8 lg:pt-32">
      <div className="mx-auto max-w-3xl text-center">
        <PillBadge label="Measured slide transformations" />
        <h2 className="mt-6 font-display text-3xl font-semibold leading-tight tracking-[-0.055em] text-[var(--ink)] sm:text-4xl lg:text-5xl">Real slides. Exact templates. No AI artifacts.</h2>
        <p className="mt-5 text-base leading-7 text-[var(--muted)] sm:text-lg">See how Zicdeck cleans up layout density and updates executive narratives while preserving typography, margins, and brand guidelines.</p>
      </div>

      <div className="mt-16 space-y-12 lg:mt-20">
        {COMPARISONS.map((comp) => (
          <article key={comp.id} className="overflow-hidden rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-5 shadow-[0_8px_26px_rgba(20,21,26,0.04)] sm:p-8 lg:p-10">
            <header className="flex flex-col justify-between gap-3 border-b border-[var(--border)] pb-6 sm:flex-row sm:items-center">
              <div>
                <span className="text-[11px] font-semibold uppercase tracking-wider text-[var(--accent)]">{comp.category}</span>
                <p className="mt-1 text-xs italic text-[var(--muted)] sm:text-sm">{comp.userPrompt}</p>
              </div>
            </header>

            <div className="relative mt-6 grid gap-5 md:grid-cols-2 md:gap-8">
              <div className="pointer-events-none absolute left-1/2 top-1/2 z-10 hidden size-10 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-[#C9D4FF] bg-white text-[var(--accent)] shadow-md md:flex"><ArrowRight className="size-4" /></div>
              <div className="flex justify-center md:hidden"><span className="flex size-9 items-center justify-center rounded-full bg-[var(--accent-soft)] text-[var(--accent)]"><ArrowDown className="size-4" /></span></div>

              <section aria-label="Before Zicdeck edit" className="relative flex flex-col justify-between overflow-hidden rounded-2xl border border-[#DEDCD5] bg-[#F1F0ED] p-4 grayscale sm:p-5">
                <div aria-hidden="true" className="absolute inset-0 opacity-25 [background-image:linear-gradient(rgba(20,21,26,0.08)_1px,transparent_1px)] [background-size:100%_8px]" />
                <div className="relative">
                  <div className="flex items-center justify-between">
                    <span className="inline-flex rounded-md border border-[#D5D3CD] bg-[#E7E5E0] px-2.5 py-0.5 text-[11px] font-semibold text-[#6B6B68]">Before</span>
                    <span className="text-[10px] text-[#7D7C77]">Original file</span>
                  </div>
                  <h3 className="mt-4 font-sans text-[13px] font-semibold leading-tight text-[#4F4E49]">{comp.before.title}</h3>
                  <p className="mt-1 text-[11px] leading-4 text-[#777670]">{comp.before.description}</p>
                  <ul className="mt-3 space-y-1.5 text-[11px] leading-4 text-[#66645F]">
                    {comp.before.points.map((pt) => <li key={pt} className="flex items-start gap-1.5"><span className="mt-1.5 size-1 shrink-0 rounded-full bg-[#85837C]" /><span>{pt}</span></li>)}
                  </ul>
                </div>
                <p className="relative mt-5 border-t border-[#D5D3CD] pt-3 text-[10px] italic text-[#777670]">{comp.before.note}</p>
              </section>

              <section aria-label="After Zicdeck edit" className="relative flex flex-col justify-between overflow-hidden rounded-2xl border border-[#C9D4FF] bg-[linear-gradient(145deg,#FFFFFF_0%,#F4F6FF_100%)] p-4 shadow-[0_12px_28px_rgba(47,94,255,0.10)] sm:p-5">
                <div className="absolute right-4 top-4"><span className="inline-flex items-center gap-1 rounded-md bg-[var(--accent)] px-2.5 py-1 text-[11px] font-semibold text-white"><Sparkles className="size-3" /> After</span></div>
                <div>
                  <span className="text-[11px] font-semibold text-[var(--accent)]">Zicdeck Output</span>
                  <h3 className="mt-4 max-w-[85%] font-display text-sm font-semibold leading-tight text-[var(--ink)]">{comp.after.title}</h3>
                  <p className="mt-1 text-xs text-[var(--muted)]">{comp.after.description}</p>
                  <div className="mt-4 grid gap-3 sm:grid-cols-[0.9fr_1.1fr]">
                    <div className="rounded-xl border border-[#D6DEFF] bg-white p-3">
                      <div className="flex items-center justify-between border-b border-[var(--border)] pb-2 text-xs font-semibold text-[var(--ink)]"><span>{comp.after.highlight.label}</span><span className="text-[var(--accent)]">{comp.after.highlight.value}</span></div>
                      <div className="mt-2 space-y-2.5">{comp.after.items.map((item) => <div key={item.label} className="text-[11px] leading-4"><span className="font-semibold text-[var(--ink)]">{item.label}: </span><span className="text-[var(--muted)]">{item.text}</span></div>)}</div>
                    </div>
                    <div className="relative min-h-32 overflow-hidden rounded-xl border border-[#D6DEFF] bg-[#EAF0FF]">
                      <Image src="https://picsum.photos/600/300" width={600} height={300} alt="Abstract placeholder chart used to illustrate a polished presentation outcome" className="absolute inset-0 h-full w-full object-cover opacity-25 mix-blend-multiply" />
                      <div className="absolute inset-x-3 bottom-3 flex h-16 items-end gap-2"><span className="flex-1 rounded-t bg-[#91A8FF]" style={{ height: "42%" }} /><span className="flex-1 rounded-t bg-[#6685FF]" style={{ height: "66%" }} /><span className="flex-1 rounded-t bg-[var(--accent)]" style={{ height: "92%" }} /></div>
                      <span className="absolute left-3 top-3 rounded bg-white/80 px-2 py-1 text-[9px] font-semibold text-[var(--accent)]">Performance trend</span>
                    </div>
                  </div>
                </div>
                <div className="mt-5 flex items-center justify-between border-t border-[#D6DEFF] pt-3 text-[11px] font-semibold text-[var(--accent)]"><span>Template &amp; typography 100% matched</span><ArrowRight className="size-3.5" /></div>
              </section>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

export default ShowcaseSection;
