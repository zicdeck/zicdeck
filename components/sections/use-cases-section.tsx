import { Briefcase, LineChart, Megaphone, Presentation } from "lucide-react";
import { PillBadge } from "@/components/ui/pill-badge";

const USE_CASES = [
  {
    role: "Enterprise Sales",
    icon: Briefcase,
    painPoint:
      "Tailor prospect pitch decks, pricing tiers, and relevant case studies 10 minutes before a call without breaking the master template.",
    tag: "Pitch Decks",
  },
  {
    role: "Management Consulting",
    icon: LineChart,
    painPoint:
      "Synthesize complex client findings into clean 3-column deliverables with strict visual balance and zero manual alignment cleanup.",
    tag: "Client Deliverables",
  },
  {
    role: "Executive Comms",
    icon: Presentation,
    painPoint:
      "Iterate board meeting slides and all-hands narratives under tight deadlines while keeping executive visual standards intact.",
    tag: "Board Materials",
  },
  {
    role: "Product & Marketing",
    icon: Megaphone,
    painPoint:
      "Update product roadmap decks, launch milestones, and GTM positioning without losing official typography and brand tokens.",
    tag: "GTM Roadmaps",
  },
];

export function UseCasesSection() {
  return (
    <section id="use-cases" className="mx-auto max-w-6xl px-5 pt-24 sm:px-8 lg:pt-32">
      <div className="mx-auto max-w-3xl text-center">
        <PillBadge label="Built for specialized corporate roles" />
        <h2 className="mt-6 font-display text-3xl font-semibold leading-tight tracking-[-0.055em] text-[var(--ink)] sm:text-4xl lg:text-5xl">
          Engineered for high-visibility teams.
        </h2>
        <p className="mt-5 text-base leading-7 text-[var(--muted)] sm:text-lg">
          Whether you are closing enterprise deals or presenting to the board, Zicdeck adapts to your function’s presentation demands.
        </p>
      </div>

      <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:mt-20 lg:grid-cols-4">
        {USE_CASES.map((uc) => {
          const Icon = uc.icon;
          return (
            <div
              key={uc.role}
              className="group flex flex-col justify-between rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 transition-all hover:border-neutral-400/60 hover:shadow-xs"
            >
              <div>
                <div className="flex items-center justify-between">
                  <div className="flex size-9 items-center justify-center rounded-lg bg-[var(--paper)] text-[var(--accent)] ring-1 ring-[var(--border)]">
                    <Icon className="size-4" />
                  </div>
                  <span className="text-[11px] font-medium text-[var(--muted)]">
                    {uc.tag}
                  </span>
                </div>

                <h3 className="mt-5 font-display text-lg font-semibold tracking-[-0.03em] text-[var(--ink)]">
                  {uc.role}
                </h3>
                <p className="mt-2.5 text-xs leading-5 text-[var(--muted)]">
                  {uc.painPoint}
                </p>
              </div>

              <div className="mt-6 h-0.5 w-8 rounded-full bg-[var(--border)] transition-all duration-300 group-hover:w-16 group-hover:bg-[var(--accent)]" />
            </div>
          );
        })}
      </div>
    </section>
  );
}

export default UseCasesSection;
