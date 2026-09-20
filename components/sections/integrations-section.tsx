import { FileSpreadsheet, Presentation, Sparkles, Layers } from "lucide-react";
import { PillBadge } from "@/components/ui/pill-badge";

const INTEGRATIONS = [
  { name: "Microsoft PowerPoint", icon: Presentation, format: ".pptx", status: "Native Support", highlight: true },
  { name: "Google Slides", icon: Layers, format: "Cloud Sync", status: "Native Support", highlight: true },
  { name: "PDF & Document Context", icon: FileSpreadsheet, format: ".pdf, .txt", status: "Supported", highlight: false },
  { name: "Slack & Microsoft Teams", icon: Sparkles, format: "Bot Actions", status: "Coming Soon", highlight: false },
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

      <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:mt-16 lg:grid-cols-4">
        {INTEGRATIONS.map((tool) => {
          const Icon = tool.icon;
          const comingSoon = tool.status === "Coming Soon";
          return (
            <article
              key={tool.name}
              className={`flex min-h-40 flex-col justify-between rounded-2xl border p-5 transition duration-300 ${
                comingSoon
                  ? "border-dashed border-[#C8C8C2] bg-[var(--paper)]/70 opacity-80"
                  : "border-[var(--border)] bg-[linear-gradient(145deg,#FFFFFF_0%,#F7F8FF_100%)] shadow-[0_5px_16px_rgba(20,21,26,0.035)] hover:-translate-y-1 hover:border-[#B8C5FF] hover:shadow-[0_14px_28px_rgba(20,21,26,0.08)]"
              }`}
            >
              <div className={`flex size-12 items-center justify-center rounded-2xl ${comingSoon ? "bg-[#EEEDEA] text-[var(--muted)]" : "bg-[var(--accent-soft)] text-[var(--accent)] shadow-sm ring-1 ring-[#DCE3FF]"}`}>
                <Icon className="size-5" />
              </div>
              <div className="mt-7">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="text-sm font-semibold text-[var(--ink)]">{tool.name}</h3>
                  <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${tool.status === "Native Support" ? "bg-[var(--accent-soft)] text-[var(--accent)]" : comingSoon ? "border border-dashed border-[#BABAB3] text-[var(--muted)]" : "bg-[var(--paper)] text-[var(--muted)]"}`}>
                    {tool.status}
                  </span>
                </div>
                <p className="mt-1.5 text-xs text-[var(--muted)]">{tool.format}</p>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}

export default IntegrationsSection;
