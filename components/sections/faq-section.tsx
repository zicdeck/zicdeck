"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { PillBadge } from "@/components/ui/pill-badge";
import { cn } from "@/lib/utils";
import { FadeUp } from "@/components/ui/fade-up";

interface FAQItem {
  question: string;
  answer: string;
}

const FAQS: FAQItem[] = [
  {
    question: "Does ZicDeck touch or retain our confidential deck data?",
    answer:
      "No. Uploaded presentation files and prompt instructions are processed solely in temporary memory to generate your edits. We have zero-retention agreements with LLM providers and your proprietary data is never used to train foundation models.",
  },
  {
    question: "Do we need to change file formats or learn a new presentation app?",
    answer:
      "Not at all. ZicDeck is designed to work directly on standard PowerPoint (.pptx) and Google Slides decks. You import your native slides, make prompt-assisted edits, and export clean presentation files without formatting loss.",
  },
  {
    question: "What happens to custom formatting, fonts, and brand layouts we've already built?",
    answer:
      "ZicDeck reads your deck's existing master templates, font hierarchies, color variables, and margin constraints before executing edits. Your brand rules and visual standards remain 100% intact throughout revisions.",
  },
  {
    question: "Can multiple colleagues collaborate within a shared team workspace?",
    answer:
      "Yes. Professional and Enterprise workspaces allow shared deck repositories, consistent corporate template libraries, and version histories so multiple team members can iterate on the same high-stakes deliverables.",
  },
  {
    question: "Which AI models power the slide editing engine?",
    answer:
      "ZicDeck uses a hybrid architecture combining state-of-the-art reasoning models (including Claude 3.7 Sonnet, DeepSeek V3, and GPT-4o) with our proprietary deterministic presentation layout parser to prevent visual drift.",
  },
  {
    question: "Is there a free trial available before committing our team?",
    answer:
      "Yes. You can start immediately on the Starter plan with zero credit card required to test slide editing on up to 3 decks. Enterprise pilots with custom template training are also available upon request.",
  },
];

export function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleItem = (index: number) => {
    setOpenIndex((prev) => (prev === index ? null : index));
  };

  return (
    <section id="faq" className="mx-auto max-w-4xl px-5 pt-24 sm:px-8 lg:pt-32">
      {/* Header with Fade Up */}
      <FadeUp amount={0.3} yOffset={40} className="mx-auto max-w-3xl text-center">
        <PillBadge label="Frequently asked questions" />
        <h2 className="mt-6 font-display text-3xl font-semibold leading-tight tracking-[-0.055em] text-[var(--ink)] sm:text-4xl lg:text-5xl">
          Everything you need to know about ZicDeck.
        </h2>
        <p className="mt-5 text-base leading-7 text-[var(--muted)] sm:text-lg">
          Answers to common questions regarding template fidelity, data privacy, and team onboarding.
        </p>
      </FadeUp>

      {/* Accordion with Fade Up */}
      <FadeUp
        delay={0.12}
        amount={0.2}
        yOffset={44}
        className="mt-16 divide-y divide-[var(--border)] rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-xs sm:p-8 lg:mt-20"
      >
        {FAQS.map((faq, index) => {
          const isOpen = openIndex === index;
          return (
            <div key={faq.question} className="py-5 first:pt-0 last:pb-0">
              <button
                type="button"
                onClick={() => toggleItem(index)}
                className="flex w-full items-center justify-between text-left text-base font-semibold text-[var(--ink)] transition-colors hover:text-[var(--accent)] cursor-pointer"
                aria-expanded={isOpen}
              >
                <span className="pr-4">{faq.question}</span>
                <ChevronDown
                  className={cn(
                    "size-4 shrink-0 text-[var(--muted)] transition-transform duration-200",
                    isOpen && "rotate-180 text-[var(--accent)]"
                  )}
                />
              </button>

              <div
                className={cn(
                  "grid transition-all duration-200 ease-in-out",
                  isOpen ? "grid-rows-[1fr] opacity-100 pt-3" : "grid-rows-[0fr] opacity-0"
                )}
              >
                <div className="overflow-hidden">
                  <p className="text-sm leading-6 text-[var(--muted)]">
                    {faq.answer}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </FadeUp>
    </section>
  );
}

export default FAQSection;
