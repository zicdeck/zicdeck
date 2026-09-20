import { ShieldCheck, Check } from "lucide-react";

/**
 * SECURITY & COMPLIANCE NOTICE:
 * This section makes factual claims regarding security and data privacy.
 * All claims with [TODO] notes must be reviewed and confirmed by the founder/compliance team
 * before production launch.
 */

const TRUST_POINTS = [
  {
    title: "Zero model training on customer data",
    description:
      "Your presentations, text inputs, and proprietary slide structures are strictly processed for editing and are never used to train or fine-tune public AI models.",
  },
  {
    title: "End-to-end data encryption",
    // TODO: Founder to confirm exact encryption infrastructure and storage provider (e.g. AWS KMS, AES-256)
    description:
      "All deck transfers and document operations are encrypted in transit via TLS 1.3 and at rest with AES-256 encryption standards.",
  },
  {
    title: "Isolated corporate workspaces",
    description:
      "Strict multi-tenant boundary isolation ensures only authenticated colleagues within your designated organization can view or edit shared decks.",
  },
  {
    title: "Enterprise authentication & access controls",
    // TODO: Founder to confirm SSO/SAML roadmap readiness prior to enterprise customer onboarding
    description:
      "Role-based permission levels with domain-level restrictions and SAML SSO integration readiness for enterprise teams.",
  },
];

export function SecuritySection() {
  return (
    <section id="security" className="mx-auto max-w-6xl px-5 pt-24 sm:px-8 lg:pt-32">
      <div className="rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-8 sm:p-12 lg:p-16">
        <div className="grid gap-12 lg:grid-cols-[1fr_1.2fr] lg:gap-16">
          {/* Left Column: Heading & Reassurance */}
          <div className="flex flex-col justify-between">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--paper)] px-3 py-1 text-[11px] font-medium text-[var(--muted)]">
                <ShieldCheck className="size-3.5 text-[var(--accent)]" />
                <span>Enterprise Trust & Security</span>
              </div>
              <h2 className="mt-6 font-display text-3xl font-semibold leading-tight tracking-[-0.055em] text-[var(--ink)] sm:text-4xl">
                Confidential decks stay strictly confidential.
              </h2>
              <p className="mt-4 text-base leading-7 text-[var(--muted)]">
                Board meetings, M&A decks, and internal financials require uncompromising data privacy. Zicdeck is built around strict enterprise isolation from day one.
              </p>
            </div>

            <div className="mt-8 border-t border-[var(--border)] pt-6 text-xs text-[var(--muted)]">
              Questions regarding our security architecture?{" "}
              <a
                href="mailto:security@zicdeck.com"
                className="font-medium text-[var(--ink)] underline underline-offset-2 transition-colors hover:text-[var(--accent)]"
              >
                Contact our security team
              </a>
            </div>
          </div>

          {/* Right Column: Clean Trust Statement List */}
          <div className="divide-y divide-[var(--border)]">
            {TRUST_POINTS.map((point) => (
              <div key={point.title} className="py-5 first:pt-0 last:pb-0">
                <div className="flex items-start gap-3.5">
                  <div className="mt-1 flex size-5 shrink-0 items-center justify-center rounded-full bg-[var(--accent-soft)] text-[var(--accent)]">
                    <Check className="size-3 stroke-[2.5]" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-[var(--ink)]">
                      {point.title}
                    </h3>
                    <p className="mt-1.5 text-xs leading-5 text-[var(--muted)]">
                      {point.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default SecuritySection;
