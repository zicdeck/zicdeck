import { ShieldCheck, Check, LockKeyhole } from "lucide-react";

/**
 * SECURITY & COMPLIANCE NOTICE:
 * This section makes factual claims regarding security and data privacy.
 * All claims with [TODO] notes must be reviewed and confirmed by the founder/compliance team
 * before production launch.
 */

const TRUST_POINTS = [
  { title: "Zero model training on customer data", description: "Your presentations, text inputs, and proprietary slide structures are strictly processed for editing and are never used to train or fine-tune public AI models." },
  { title: "End-to-end data encryption", description: "All deck transfers and document operations are encrypted in transit via TLS 1.3 and at rest with AES-256 encryption standards." },
  { title: "Isolated corporate workspaces", description: "Strict multi-tenant boundary isolation ensures only authenticated colleagues within your designated organization can view or edit shared decks." },
  { title: "Enterprise authentication & access controls", description: "Role-based permission levels with domain-level restrictions and SAML SSO integration readiness for enterprise teams." },
];

export function SecuritySection() {
  return (
    <section id="security" className="mx-auto max-w-6xl px-5 pt-24 sm:px-8 lg:pt-32">
      <div className="overflow-hidden rounded-3xl border border-[var(--border)] bg-[var(--surface)] shadow-[0_10px_30px_rgba(20,21,26,0.04)]">
        <div className="grid lg:grid-cols-[0.9fr_1.25fr]">
          <div className="relative overflow-hidden border-b border-[var(--border)] bg-[linear-gradient(145deg,#F8F9FF_0%,var(--accent-soft)_100%)] p-8 sm:p-12 lg:border-b-0 lg:border-r lg:p-14">
            <div aria-hidden="true" className="absolute -bottom-20 -left-16 size-64 rounded-full bg-[var(--accent)]/15 blur-3xl" />
            <div aria-hidden="true" className="absolute inset-0 opacity-[0.28] [background-image:linear-gradient(rgba(47,94,255,0.12)_1px,transparent_1px),linear-gradient(90deg,rgba(47,94,255,0.12)_1px,transparent_1px)] [background-size:26px_26px]" />
            <div className="relative flex h-full flex-col justify-between">
              <div>
                <div className="flex size-16 items-center justify-center rounded-2xl bg-white text-[var(--accent)] shadow-[0_10px_24px_rgba(47,94,255,0.14)] ring-1 ring-[#D9E1FF]"><ShieldCheck className="size-8" /></div>
                <div className="mt-7 inline-flex items-center gap-2 rounded-full border border-[#D6DEFF] bg-white/80 px-3 py-1 text-[11px] font-semibold text-[var(--accent)]"><LockKeyhole className="size-3.5" /> Enterprise Trust &amp; Security</div>
                <h2 className="mt-5 font-display text-3xl font-semibold leading-tight tracking-[-0.055em] text-[var(--ink)] sm:text-4xl">Confidential decks stay strictly confidential.</h2>
                <p className="mt-4 text-base leading-7 text-[var(--muted)]">Board meetings, M&amp;A decks, and internal financials require uncompromising data privacy. Zicdeck is built around strict enterprise isolation from day one.</p>
              </div>
              <div className="mt-10 rounded-xl border border-[#D6DEFF] bg-white/75 p-4 text-xs leading-5 text-[var(--muted)]">Questions regarding our security architecture? <a href="mailto:security@zicdeck.com" className="font-semibold text-[var(--ink)] underline decoration-[var(--accent)] underline-offset-3 transition-colors hover:text-[var(--accent)]">Contact our security team</a></div>
            </div>
          </div>

          <div className="p-4 sm:p-7 lg:p-9">
            <div className="space-y-2">
              {TRUST_POINTS.map((point, index) => (
                <article key={point.title} className={`rounded-2xl border p-5 transition-colors ${index % 2 === 0 ? "border-[#DCE3FF] bg-[var(--accent-soft)]/45" : "border-[var(--border)] bg-[var(--surface)]"}`}>
                  <div className="flex items-start gap-4">
                    <div className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-full bg-[var(--accent-soft)] text-[var(--accent)] ring-1 ring-[#D9E1FF]"><Check className="size-4 stroke-[2.7]" /></div>
                    <div><h3 className="text-sm font-semibold text-[var(--ink)]">{point.title}</h3><p className="mt-1.5 text-xs leading-5 text-[var(--muted)]">{point.description}</p></div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default SecuritySection;
