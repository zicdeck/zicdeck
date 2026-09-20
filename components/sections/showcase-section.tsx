import { PillBadge } from "@/components/ui/pill-badge";
import { ArrowRight } from "lucide-react";

/**
 * SHOWCASE EXAMPLES:
 * TODO: Founder / Design team: Replace these placeholder mockups with real before-and-after
 * customer deck screenshots as real anonymized enterprise case studies are gathered.
 */

interface SlideComparison {
  id: string;
  category: string;
  userPrompt: string;
  before: {
    title: string;
    description: string;
    points: string[];
    note: string;
  };
  after: {
    title: string;
    description: string;
    highlight: { label: string; value: string };
    items: { label: string; text: string }[];
  };
}

const COMPARISONS: SlideComparison[] = [
  {
    id: "financial-forecast",
    category: "Financial Update",
    userPrompt: "“Update this slide with Q4 actuals: $14.2M ARR (+24% YoY) and highlight CAC efficiency.”",
    before: {
      title: "Q4 Financial Overview & Budget Projections (Draft v3)",
      description: "Dense unformatted text pasted directly from raw financial spreadsheet export.",
      points: [
        "Revenue for Q4 reached $14,200,000 which is roughly 24% year over year growth compared to last year",
        "CAC was reduced by 18% due to organic channel growth and optimized enterprise SDR targeting",
        "Gross margin stayed consistent around 78% with slight cloud infrastructure overhead increase",
      ],
      note: "Unbalanced bullets, generic font hierarchy, no key metric callouts.",
    },
    after: {
      title: "Q4 Performance: $14.2M ARR with Accelerated Unit Economics",
      description: "Structured executive summary preserving corporate typography and master slide grid.",
      highlight: { label: "ARR Growth", value: "+24% YoY" },
      items: [
        { label: "Topline Revenue", text: "$14.2M ARR closing ahead of initial forecast" },
        { label: "Acquisition Cost", text: "18% CAC efficiency via outbound pipeline maturation" },
        { label: "Gross Margin", text: "78% margin maintained through infrastructure optimization" },
      ],
    },
  },
  {
    id: "executive-narrative",
    category: "Strategy & Operations",
    userPrompt: "“Turn this crowded bullet slide into a 3-pillar strategic roadmap for next week's board meeting.”",
    before: {
      title: "2026 Strategic Initiatives & Team Priorities Checklist",
      description: "Wall of text with no clear visual hierarchy or reading path for executive stakeholders.",
      points: [
        "Pillar 1: Accelerate international enterprise expansion across EMEA region with 12 new hires",
        "Pillar 2: Deploy AI automation workflows into core product experience to reduce customer churn",
        "Pillar 3: Optimize operational efficiency and achieve net cash flow positivity by Q3 2026",
      ],
      note: "Cramped 12pt bullets, no visual distinction between strategic pillars.",
    },
    after: {
      title: "2026 Strategic Direction: 3 Focused Pillars for Expansion",
      description: "Rebalanced 3-column architecture strictly aligned with brand color tokens and margins.",
      highlight: { label: "Target Horizon", value: "Q3 2026 Cash Positive" },
      items: [
        { label: "01. Global Expansion", text: "Scale EMEA enterprise footprint with localized go-to-market teams" },
        { label: "02. AI Workflow Engine", text: "Deliver native AI automation to strengthen retention across core accounts" },
        { label: "03. Operational Discipline", text: "Streamline unit economics to secure net cash flow milestone" },
      ],
    },
  },
];

export function ShowcaseSection() {
  return (
    <section id="showcase" className="mx-auto max-w-6xl px-5 pt-24 sm:px-8 lg:pt-32">
      <div className="mx-auto max-w-3xl text-center">
        <PillBadge label="Measured slide transformations" />
        <h2 className="mt-6 font-display text-3xl font-semibold leading-tight tracking-[-0.055em] text-[var(--ink)] sm:text-4xl lg:text-5xl">
          Real slides. Exact templates. No AI artifacts.
        </h2>
        <p className="mt-5 text-base leading-7 text-[var(--muted)] sm:text-lg">
          See how Zicdeck cleans up layout density and updates executive narratives while preserving typography, margins, and brand guidelines.
        </p>
      </div>

      <div className="mt-16 space-y-12 lg:mt-20">
        {COMPARISONS.map((comp) => (
          <div
            key={comp.id}
            className="overflow-hidden rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-xs sm:p-8 lg:p-10"
          >
            {/* Header / Prompt context */}
            <div className="flex flex-col justify-between gap-3 border-b border-[var(--border)] pb-6 sm:flex-row sm:items-center">
              <div>
                <span className="text-[11px] font-semibold uppercase tracking-wider text-[var(--accent)]">
                  {comp.category}
                </span>
                <p className="mt-1 text-xs italic text-[var(--muted)] sm:text-sm">
                  {comp.userPrompt}
                </p>
              </div>
            </div>

            {/* Before vs After Side-by-Side Grid */}
            <div className="mt-6 grid gap-6 md:grid-cols-2">
              {/* Before Mockup */}
              <div className="flex flex-col justify-between rounded-2xl border border-[var(--border)] bg-[var(--paper)] p-5 sm:p-6">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="inline-flex rounded-md border border-[var(--border)] bg-white px-2.5 py-0.5 text-[11px] font-semibold text-[var(--muted)]">
                      Before
                    </span>
                    <span className="text-[11px] text-[var(--muted)]">Original file</span>
                  </div>

                  <h4 className="mt-4 font-display text-sm font-semibold text-[var(--ink)]/80">
                    {comp.before.title}
                  </h4>
                  <p className="mt-1 text-xs text-[var(--muted)]">
                    {comp.before.description}
                  </p>

                  <ul className="mt-4 space-y-2 text-xs text-[var(--muted)]">
                    {comp.before.points.map((pt, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="mt-1 size-1 shrink-0 rounded-full bg-[var(--muted)]" />
                        <span>{pt}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-6 border-t border-[var(--border)]/70 pt-3 text-[11px] italic text-[var(--muted)]">
                  {comp.before.note}
                </div>
              </div>

              {/* After Mockup */}
              <div className="relative flex flex-col justify-between rounded-2xl border border-[var(--accent)]/30 bg-white p-5 shadow-xs sm:p-6">
                <div className="absolute right-4 top-4">
                  <span className="inline-flex items-center gap-1 rounded-md bg-[var(--accent)] px-2.5 py-0.5 text-[11px] font-semibold text-white">
                    After
                  </span>
                </div>

                <div>
                  <div className="flex items-center">
                    <span className="text-[11px] font-medium text-[var(--accent)]">
                      Zicdeck Output
                    </span>
                  </div>

                  <h4 className="mt-4 font-display text-sm font-semibold text-[var(--ink)]">
                    {comp.after.title}
                  </h4>
                  <p className="mt-1 text-xs text-[var(--muted)]">
                    {comp.after.description}
                  </p>

                  <div className="mt-4 rounded-xl border border-[var(--border)] bg-[var(--paper)] p-3">
                    <div className="flex items-center justify-between border-b border-[var(--border)] pb-2 text-xs font-semibold text-[var(--ink)]">
                      <span>{comp.after.highlight.label}</span>
                      <span className="text-[var(--accent)]">{comp.after.highlight.value}</span>
                    </div>

                    <div className="mt-2 space-y-2">
                      {comp.after.items.map((item, i) => (
                        <div key={i} className="text-xs">
                          <span className="font-semibold text-[var(--ink)]">{item.label}: </span>
                          <span className="text-[var(--muted)]">{item.text}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="mt-6 flex items-center justify-between border-t border-[var(--border)] pt-3 text-[11px] font-medium text-[var(--accent)]">
                  <span>Template &amp; typography 100% matched</span>
                  <ArrowRight className="size-3.5" />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default ShowcaseSection;
