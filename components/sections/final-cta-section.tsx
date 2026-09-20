import { ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

export function FinalCTASection() {
  return (
    <section id="get-started" className="mx-auto max-w-6xl px-5 pb-16 pt-24 sm:px-8 lg:pb-24 lg:pt-32">
      <div className="relative isolate overflow-hidden rounded-[2rem] border border-[var(--ink)] bg-[var(--ink)] px-6 py-14 text-center shadow-[0_24px_70px_rgba(20,21,26,0.18)] sm:px-12 sm:py-18 lg:px-16 lg:py-20">
        <div aria-hidden="true" className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_50%_0%,rgba(47,94,255,0.34),transparent_48%),linear-gradient(135deg,#14151A_10%,#1c2134_100%)]" />
        <div aria-hidden="true" className="absolute -left-20 bottom-[-7rem] -z-10 size-72 rounded-full bg-[var(--accent)]/25 blur-3xl" />
        <div aria-hidden="true" className="absolute -right-16 top-[-5rem] -z-10 size-64 rounded-full bg-white/5 blur-3xl" />
        <div aria-hidden="true" className="absolute inset-0 -z-10 opacity-[0.12] [background-image:linear-gradient(rgba(255,255,255,0.13)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.13)_1px,transparent_1px)] [background-size:28px_28px]" />

        <div className="mx-auto max-w-2xl">
          <p className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/8 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.12em] text-[#E8ECFF]">
            <Sparkles className="size-3.5 text-[#9EB4FF]" />
            Ready when your next meeting matters
          </p>
          <h2 className="mt-5 font-display text-3xl font-semibold leading-tight tracking-[-0.055em] text-[var(--paper)] sm:text-4xl lg:text-5xl">
            Make every slide feel ready before you present.
          </h2>
          <p className="mt-5 text-base leading-7 text-[#C9CCD4]">
            Join hundreds of corporate teams using Zicdeck to refine high-stakes presentations without breaking brand templates.
          </p>

          <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Button
              variant="primary"
              size="lg"
              href="/sign-up"
              className="h-13 rounded-full px-9 text-sm font-semibold shadow-[0_12px_28px_rgba(47,94,255,0.4)] transition duration-200 hover:scale-[1.03] hover:bg-[#496FFF] focus-visible:scale-[1.03]"
            >
              Start editing your deck <ArrowRight className="size-4" />
            </Button>
          </div>

          <p className="mt-5 text-xs text-[#B9BDC7]">
            No credit card required • Works natively with PowerPoint and Google Slides
          </p>
        </div>
      </div>
    </section>
  );
}

export default FinalCTASection;
