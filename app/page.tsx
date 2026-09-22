import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { CapabilitiesSection } from "@/components/sections/capabilities-section";
import { PricingSection } from "@/components/sections/pricing-section";
import { FAQSection } from "@/components/sections/faq-section";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { ChatComposer } from "@/components/ChatComposer";
import { RotatingWord } from "@/components/RotatingWord";
import { FadeUp } from "@/components/ui/fade-up";
import Image from "next/image";

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col overflow-x-clip bg-[var(--paper)] text-[var(--ink)] selection:bg-[var(--accent-soft)] selection:text-[var(--accent)]">
      <Navbar />

      <main className="grow-[1]">
        <section className="mx-auto max-w-6xl px-5 pb-20 pt-16 text-center sm:px-8 sm:pt-24 lg:pb-28 lg:pt-28">
          <div className="mx-auto flex max-w-4xl flex-col items-center relative">
            <div className="absolute w-[120%] h-[110px] rounded-[120%] top-[-10px] bg-accent/40 blur-[100px] animate-fade-in"></div>

            <div className="relative z-[] mx-auto flex flex-col items-center w-full">
              <div
                role="button"
                className="relative z-10 flex shrink-0 cursor-pointer items-center w-fit mx-auto gap-6 rounded-full border border-black/10 p-1 transition-colors hover:bg-black/4 animate-fade-in-up delay-75"
              >
                <div className="flex shrink-0 items-center gap-3">
                  <span className="flex shrink-0 items-center justify-center rounded-full bg-white px-2 py-1.5 text-xs font-medium font-['Inter'] leading-4">
                    <span className="bg-linear-to-r from-accent to-muted bg-clip-text text-transparent">
                      New Feature
                    </span>
                  </span>

                  <span className="shrink-0 whitespace-nowrap text-xs font-medium font-['Inter'] leading-normal text-default">
                    Team Workspaces for PowerPoint &amp; Google Slides
                  </span>
                </div>

                <div className="flex shrink-0 items-center justify-center rounded-full bg-bg-black-6 p-1.5">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="lucide lucide-arrow-right size-4 text-mute"
                    aria-hidden="true"
                  >
                    <path d="M5 12h14" />
                    <path d="m12 5 7 7-7 7" />
                  </svg>
                </div>
              </div>
              <h1 className="mt-7 max-w-4xl font-display text-5xl font-semibold leading-[1.01] tracking-[-0.065em] text-[var(--ink)] sm:text-6xl md:text-7xl lg:text-[80px] animate-fade-in-up delay-150">
                Make every slide feel{" "}
                <RotatingWord
                  className="text-[var(--accent)]"
                  words={["ready.", "polished.", "flawless.", "confident.", "compelling.", "effortless."]}
                  interval={2000}
                />
              </h1>
              <ChatComposer className="mt-8 w-full max-w-2xl text-left animate-fade-in-up delay-250" />
              <div className="mt-6 flex flex-col items-center gap-2.5 sm:flex-row animate-fade-in-up delay-300">
                <Link href="/sign-up" className="inline-flex h-8.5 items-center justify-center gap-1.5 rounded-full border border-white/10 bg-[#335cff] px-4 text-xs font-medium text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.16),0_1px_2px_rgba(14,18,27,0.18),0_0_0_1px_#335cff] transition-colors hover:bg-[#2547d8] active:bg-[#2547d8] cursor-pointer">
                  Get started <ArrowRight className="size-3.5" />
                </Link>
                <a href="#product" className="inline-flex h-8.5 items-center justify-center rounded-full border border-[var(--border)] bg-[var(--surface)] px-4 text-xs font-medium text-[var(--ink)] transition-colors hover:bg-white">
                  See it in action
                </a>
              </div>
              <p className="mt-3 text-xs text-[var(--muted)] animate-fade-in delay-400">Built for PowerPoint and Google Slides teams.</p>
            </div>
          </div>

          <FadeUp delay={0.2} className="relative mx-auto mt-16 max-w-5xl text-left sm:mt-20" id="product">
            <div className="absolute inset-x-4 -inset-y-6 -z-10 rounded-[2rem] bg-[radial-gradient(ellipse_at_center,rgba(47,94,255,0.13),transparent_67%)] blur-2xl" />
            <div className="w-full overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--surface)] shadow-sm">
              <video
                src="/hero-video.mp4"
                autoPlay
                loop
                muted
                playsInline
                className="h-full w-full object-cover"
              />
            </div>
          </FadeUp>
        </section>

        {/* Divider */}
        <FadeUp delay={0.1} className="w-full flex items-center gap-[30px] py-[25px]">
          <div className="grow-[1] h-[1px] bg-border"></div>
          <div className="w-[20px]">
            <Image className="opacity-20" src='/logo.svg' width={20} height={20} alt="ZicDeck" />
          </div>
          <div className="grow-[1] h-[1px] bg-border"></div>
        </FadeUp>

        <CapabilitiesSection />

        <PricingSection />

        <FAQSection />
      </main>

      <Footer />
    </div>
  );
}
