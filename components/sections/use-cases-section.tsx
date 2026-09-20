import { Briefcase, LineChart, Megaphone, Presentation } from "lucide-react";
import { PillBadge } from "@/components/ui/pill-badge";

const USE_CASES = [
  { role: "Enterprise Sales", icon: Briefcase, painPoint: "Tailor prospect pitch decks, pricing tiers, and relevant case studies 10 minutes before a call without breaking the master template.", tag: "Pitch Decks" },
  { role: "Management Consulting", icon: LineChart, painPoint: "Synthesize complex client findings into clean 3-column deliverables with strict visual balance and zero manual alignment cleanup.", tag: "Client Deliverables" },
  { role: "Executive Comms", icon: Presentation, painPoint: "Iterate board meeting slides and all-hands narratives under tight deadlines while keeping executive visual standards intact.", tag: "Board Materials" },
  { role: "Product & Marketing", icon: Megaphone, painPoint: "Update product roadmap decks, launch milestones, and GTM positioning without losing official typography and brand tokens.", tag: "GTM Roadmaps" },
];

export function UseCasesSection() {
  return (
    <section id="use-cases" className="mx-auto max-w-6xl px-5 pt-24 sm:px-8 lg:pt-32">
      <div className="mx-auto max-w-3xl text-center">
        <PillBadge label="Built for specialized corporate roles" />
        <h2 className="mt-6 font-display text-3xl font-semibold leading-tight tracking-[-0.055em] text-[var(--ink)] sm:text-4xl lg:text-5xl">Engineered for high-visibility teams.</h2>
        <p className="mt-5 text-base leading-7 text-[var(--muted)] sm:text-lg">Whether you are closing enterprise deals or presenting to the board, Zicdeck adapts to your function’s presentation demands.</p>
      </div>

      <div className="mt-16 grid gap-5 sm:grid-cols-2 lg:mt-20 lg:grid-cols-4">
        {USE_CASES.map((uc) => {
          const Icon = uc.icon;
          return (
            <article key={uc.role} className="group relative isolate flex min-h-72 flex-col justify-between overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-[0_4px_14px_rgba(20,21,26,0.025)] transition duration-300 hover:-translate-y-1 hover:border-[#B9C7FF] hover:shadow-[0_18px_32px_rgba(20,21,26,0.09)]">
              <div aria-hidden="true" className="absolute inset-x-0 bottom-0 -z-10 h-28 bg-[linear-gradient(to_top,var(--accent-soft),transparent)] opacity-70 transition-opacity duration-300 group-hover:opacity-100" />
              <div className="absolute inset-x-0 bottom-0 h-1 bg-[var(--accent)]" />
              <div>
                <div className="flex items-start justify-between gap-3">
                  <div className="flex size-13 items-center justify-center rounded-2xl bg-[var(--accent-soft)] text-[var(--accent)] shadow-sm ring-1 ring-[#D9E1FF]"><Icon className="size-6" /></div>
                  <span className="rounded-full border border-[var(--border)] bg-white/75 px-2 py-1 text-[10px] font-semibold text-[var(--muted)]">{uc.tag}</span>
                </div>
                <h3 className="mt-7 font-display text-xl font-semibold tracking-[-0.04em] text-[var(--ink)]">{uc.role}</h3>
                <p className="mt-3 text-sm leading-6 text-[var(--muted)]">{uc.painPoint}</p>
              </div>
              <div className="mt-6 flex items-center gap-2 text-[11px] font-semibold text-[var(--accent)]"><span className="size-1.5 rounded-full bg-[var(--accent)]" /> Built for this workflow</div>
            </article>
          );
        })}
      </div>
    </section>
  );
}

export default UseCasesSection;
