import { Button } from "@/components/ui/button";

export function FinalCTASection() {
  return (
    <section id="get-started" className="mx-auto max-w-5xl px-5 pt-24 pb-16 sm:px-8 lg:pt-32 lg:pb-24">
      <div className="rounded-3xl border border-[var(--border)] bg-[var(--surface)] px-6 py-14 text-center shadow-xs sm:px-12 sm:py-18 lg:px-16 lg:py-20">
        <div className="mx-auto max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--accent)]">
            Ready when your next meeting matters
          </p>
          <h2 className="mt-4 font-display text-3xl font-semibold leading-tight tracking-[-0.055em] text-[var(--ink)] sm:text-4xl lg:text-5xl">
            Make every slide feel ready before you present.
          </h2>
          <p className="mt-4 text-base leading-7 text-[var(--muted)]">
            Join hundreds of corporate teams using Zicdeck to refine high-stakes presentations without breaking brand templates.
          </p>

          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Button
              variant="primary"
              size="lg"
              href="/sign-up"
              className="rounded-full px-8 text-sm font-medium shadow-xs"
            >
              Start editing your deck
            </Button>
          </div>

          <p className="mt-4 text-xs text-[var(--muted)]">
            No credit card required • Works natively with PowerPoint and Google Slides
          </p>
        </div>
      </div>
    </section>
  );
}

export default FinalCTASection;
