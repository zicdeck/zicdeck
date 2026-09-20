import { Check } from "lucide-react";
import { PillBadge } from "@/components/ui/pill-badge";
import { Button } from "@/components/ui/button";

/**
 * PRICING TIERS:
 * TODO: Founder / GTM team to review and confirm final tier pricing and feature allocations
 * prior to Stripe billing component enablement.
 */

const TIERS = [
  {
    name: "Starter",
    // TODO: Confirm free trial / self-serve tier pricing
    price: "$0",
    period: "Free trial",
    description: "For individual professionals trying AI slide editing on their first deck.",
    features: [
      "Up to 3 presentation imports per month",
      "Standard template mapping engine",
      "Native PPTX and PDF file support",
      "Single-user workspace",
      "Email support",
    ],
    cta: "Start for free",
    href: "/sign-up",
    popular: false,
    buttonVariant: "secondary" as const,
  },
  {
    name: "Professional",
    // TODO: Confirm monthly/annual pricing numbers ($29/user/month placeholder)
    price: "$29",
    period: "per user / month",
    description: "For consultants, sales leads, and executives editing presentations weekly.",
    features: [
      "Unlimited presentation imports & edits",
      "Advanced narrative restructure & layout engine",
      "Multi-slide context & batch revisions",
      "Custom brand typography & color tokens",
      "Priority generation queue",
      "Version history & instant rollback",
    ],
    cta: "Get started with Pro",
    href: "/sign-up",
    popular: true,
    buttonVariant: "primary" as const,
  },
  {
    name: "Enterprise",
    price: "Custom",
    period: "tailored for teams",
    description: "For organizations demanding bespoke template models, governance, and SSO.",
    features: [
      "Everything in Professional",
      "Bespoke corporate master template training",
      "Dedicated multi-tenant workspace isolation",
      "SAML / Okta SSO integration",
      "Custom Data Processing Agreement (DPA)",
      "Dedicated account manager & SLA",
    ],
    cta: "Talk to enterprise team",
    href: "mailto:sales@zicdeck.com",
    popular: false,
    buttonVariant: "secondary" as const,
  },
];

export function PricingSection() {
  return (
    <section id="pricing" className="mx-auto max-w-6xl px-5 pt-24 sm:px-8 lg:pt-32">
      <div className="mx-auto max-w-3xl text-center">
        <PillBadge label="Transparent enterprise plans" />
        <h2 className="mt-6 font-display text-3xl font-semibold leading-tight tracking-[-0.055em] text-[var(--ink)] sm:text-4xl lg:text-5xl">
          Predictable pricing for individuals and teams.
        </h2>
        <p className="mt-5 text-base leading-7 text-[var(--muted)] sm:text-lg">
          Start editing decks immediately with full template precision. Upgrade when you need team collaboration or dedicated enterprise governance.
        </p>
      </div>

      <div className="mt-16 grid gap-8 md:grid-cols-3 lg:mt-20">
        {TIERS.map((tier) => (
          <div
            key={tier.name}
            className={`relative flex flex-col justify-between rounded-3xl border bg-[var(--surface)] p-8 shadow-xs transition-shadow hover:shadow-sm ${
              tier.popular
                ? "border-[var(--accent)] ring-1 ring-[var(--accent)]"
                : "border-[var(--border)]"
            }`}
          >
            {tier.popular && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-[var(--accent)] px-3 py-0.5 text-[11px] font-semibold text-white">
                Most Popular
              </div>
            )}

            <div>
              <div className="flex items-center justify-between">
                <h3 className="font-display text-xl font-semibold tracking-[-0.03em] text-[var(--ink)]">
                  {tier.name}
                </h3>
              </div>

              <div className="mt-4 flex items-baseline gap-1.5">
                <span className="font-display text-4xl font-bold tracking-tight text-[var(--ink)]">
                  {tier.price}
                </span>
                <span className="text-xs text-[var(--muted)]">{tier.period}</span>
              </div>

              <p className="mt-3 text-xs leading-5 text-[var(--muted)]">
                {tier.description}
              </p>

              <div className="mt-6 border-t border-[var(--border)] pt-6">
                <p className="text-[11px] font-semibold uppercase tracking-wider text-[var(--muted)]">
                  Included capabilities
                </p>
                <ul className="mt-4 space-y-3 text-xs text-[var(--ink)]">
                  {tier.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2.5">
                      <Check className="mt-0.5 size-3.5 shrink-0 text-[var(--accent)]" />
                      <span className="leading-5">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="mt-8 pt-4">
              <Button
                variant={tier.buttonVariant}
                href={tier.href}
                className="w-full rounded-full text-xs font-medium"
              >
                {tier.cta}
              </Button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default PricingSection;
