import { LayoutTemplate, MessageSquareText, ShieldCheck } from "lucide-react";

const CAPABILITIES = [
  {
    title: "Edit by asking",
    description: "Describe the change in plain language and get a thoughtful revision in the slide you already know.",
    icon: MessageSquareText,
    detail: "Update this slide for the new forecast",
  },
  {
    title: "Keep the system intact",
    description: "Typography, spacing, layouts, and visual hierarchy stay recognizably yours through every edit.",
    icon: LayoutTemplate,
    detail: "Brand rules preserved",
  },
  {
    title: "Present with confidence",
    description: "Move quickly without choosing between speed and the polished, reliable work your audience expects.",
    icon: ShieldCheck,
    detail: "Ready when it matters",
  },
];

export function CapabilitiesSection() {
  return (
    <section id="capabilities" className="mx-auto max-w-6xl px-5 py-20 sm:px-8 sm:py-28">
      <div className="mx-auto max-w-3xl text-center">
        <p className="inline-flex rounded-full border border-[var(--border)] bg-[var(--surface)] px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.08em] text-[var(--muted)]">
          Built for the real work
        </p>
        <h2 className="mt-6 font-display text-3xl font-semibold leading-tight tracking-[-0.055em] text-[var(--ink)] sm:text-4xl lg:text-5xl">
          AI that respects the way your team works.
        </h2>
        <p className="mt-5 text-base leading-7 text-[var(--muted)] sm:text-lg">
          Zicdeck is designed for the ten minutes before a meeting: precise changes, familiar files, and no cleanup after the fact.
        </p>
      </div>

      <div className="mt-12 grid gap-5 md:grid-cols-3 lg:mt-16">
        {CAPABILITIES.map((item) => {
          const Icon = item.icon;
          return (
            <article key={item.title} className="group overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--surface)]">
              <div className="relative h-52 overflow-hidden border-b border-[var(--border)] bg-[#F6F7FC] p-6">
                <div className="absolute -right-10 -top-12 size-44 rounded-full bg-[#E2E9FF] blur-2xl transition-transform duration-500 group-hover:scale-110" />
                <div className="relative flex h-full flex-col justify-between">
                  <div className="flex size-10 items-center justify-center rounded-xl bg-white text-[var(--accent)] shadow-sm ring-1 ring-[var(--border)]"><Icon className="size-5" /></div>
                  <div className="rounded-lg border border-[var(--border)] bg-white/90 p-3 shadow-sm backdrop-blur">
                    <div className="flex items-center gap-2 text-[10px] font-semibold text-[var(--muted)]"><span className="size-1.5 rounded-full bg-[var(--accent)]" /> Zicdeck</div>
                    <p className="mt-2 text-xs font-medium text-[var(--ink)]">{item.detail}</p>
                    <div className="mt-3 h-1.5 w-2/3 rounded-full bg-[var(--accent-soft)]"><div className="h-full w-3/4 rounded-full bg-[var(--accent)]" /></div>
                  </div>
                </div>
              </div>
              <div className="p-6">
                <h3 className="font-display text-xl font-semibold tracking-[-0.04em] text-[var(--ink)]">{item.title}</h3>
                <p className="mt-3 text-sm leading-6 text-[var(--muted)]">{item.description}</p>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
