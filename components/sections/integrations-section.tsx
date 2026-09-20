import { FileSpreadsheet, Presentation, Sparkles, Layers } from "lucide-react";
import { PillBadge } from "@/components/ui/pill-badge";

const INTEGRATIONS = [
  {
    name: "Microsoft PowerPoint",
    icon: Presentation,
    format: ".pptx",
    status: "Native Support",
    highlight: true,
  },
  {
    name: "Google Slides",
    icon: Layers,
    format: "Cloud Sync",
    status: "Native Support",
    highlight: true,
  },
  {
    name: "PDF & Document Context",
    icon: FileSpreadsheet,
    format: ".pdf, .txt",
    status: "Supported",
    highlight: false,
  },
  {
    name: "Slack & Microsoft Teams",
    icon: Sparkles,
    format: "Bot Actions",
    status: "Coming Soon",
    highlight: false,
  },
];

export function IntegrationsSection() {
  return (
    <section id="integrations" className="mx-auto max-w-6xl px-5 pt-24 sm:px-8 lg:pt-32">
      <div className="mx-auto max-w-3xl text-center">
        <PillBadge label="Zero workflow disruption" />
        <h2 className="mt-6 font-display text-3xl font-semibold leading-tight tracking-[-0.055em] text-[var(--ink)] sm:text-4xl lg:text-5xl">
          Works directly inside the tools your team already uses.
        </h2>
        <p className="mt-5 text-base leading-7 text-[var(--muted)] sm:text-lg">
          No proprietary viewer or lock-in format. Import PowerPoint and Google Slides natively, and export standard presentations ready to present.
        </p>
      </div>

      {/* Integration Badges Row */}
      <div className="mt-14 flex flex-wrap items-center justify-center gap-4 lg:mt-16">
        {INTEGRATIONS.map((tool) => {
          const Icon = tool.icon;
          return (
            <div
              key={tool.name}
              className="flex items-center gap-3.5 rounded-2xl border border-[var(--border)] bg-[var(--surface)] px-5 py-3.5 shadow-xs transition-colors hover:border-neutral-400/50"
            >
              <div className="flex size-9 items-center justify-center rounded-xl bg-[var(--paper)] text-[var(--accent)] ring-1 ring-[var(--border)]">
                <Icon className="size-4" />
              </div>
              <div className="text-left">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-[var(--ink)]">
                    {tool.name}
                  </span>
                  <span
                    className={`rounded-md px-1.5 py-0.5 text-[10px] font-medium ${
                      tool.status === "Native Support"
                        ? "bg-[var(--accent-soft)] text-[var(--accent)]"
                        : "bg-[var(--paper)] text-[var(--muted)] border border-[var(--border)]"
                    }`}
                  >
                    {tool.status}
                  </span>
                </div>
                <span className="text-xs text-[var(--muted)]">{tool.format}</span>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

export default IntegrationsSection;
