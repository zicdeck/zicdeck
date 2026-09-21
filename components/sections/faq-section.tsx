"use client";

import { useMemo, useState } from "react";
import {
  BadgeCheck,
  CircleHelp,
  Layers,
  Minus,
  Plus,
  ReceiptText,
  ShieldCheck,
  Sparkles,
  Users,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { FadeUp } from "@/components/ui/fade-up";
import { cn } from "@/lib/utils";

type FAQCategory = "AI Editing" | "Templates & Formats" | "Security & Privacy" | "Team Workspaces" | "Plans & Billing";

interface FAQItem {
  question: string;
  answer: string;
}

interface FAQTab {
  label: FAQCategory;
  icon: typeof Sparkles;
  questions: FAQItem[];
}

const FAQ_TABS: FAQTab[] = [
  {
    label: "AI Editing",
    icon: Sparkles,
    questions: [
      {
        question: "How does ZicDeck edit existing slides using AI?",
        answer:
          "Upload your existing PowerPoint file or connect Google Slides, then describe what you want to change in plain English. ZicDeck directly updates the content, layout structure, data points, or narrative hierarchy right inside your original slides without generating generic images or disconnected templates.",
      },
      {
        question: "Will AI edits break my presentation layout or brand typography?",
        answer:
          "No. ZicDeck's layout engine maps your master slide grid, custom font tokens, margins, color palettes, and shape hierarchies before applying revisions. Your company's corporate identity and formatting rules stay 100% intact.",
      },
      {
        question: "Can I turn raw documents or PDFs into polished slides?",
        answer:
          "Yes. You can attach PDFs, financial briefs, meeting notes, or text files directly into the prompt composer. ZicDeck synthesizes key takeaways, structures data into clear visual blocks, and outputs presentation-ready slides.",
      },
      {
        question: "Can I edit multiple slides across an entire deck simultaneously?",
        answer:
          "Yes. You can instruct ZicDeck to apply sequence-wide changes, such as updating quarterly metrics across all financial slides, rebalancing every case study into a 3-column format, or adapting tone for executive leadership.",
      },
      {
        question: "Can I review and compare changes before applying them?",
        answer:
          "Yes. ZicDeck provides a visual side-by-side inspection view showing exact content diffs, allowing you to accept revisions individually, refine further with follow-up prompts, or export immediately.",
      },
    ],
  },
  {
    label: "Templates & Formats",
    icon: Layers,
    questions: [
      {
        question: "Which presentation software and file formats are supported?",
        answer:
          "ZicDeck provides full native support for Microsoft PowerPoint (.pptx) and Google Slides via real-time cloud sync. You can also upload PDF briefs and raw data files as context.",
      },
      {
        question: "Does ZicDeck support our company's custom brand fonts and color tokens?",
        answer:
          "Yes. ZicDeck automatically extracts and respects your organization's custom typography, master layouts, color palettes, and visual tokens so edits match your design system seamlessly.",
      },
      {
        question: "Do exported files require any proprietary viewer or plugin?",
        answer:
          "Not at all. Exported decks are standard .pptx files and Google Slides decks that open and behave natively in PowerPoint, Keynote, and Google Slides with zero software lock-in.",
      },
      {
        question: "How does ZicDeck handle complex charts, tables, and multi-column grids?",
        answer:
          "ZicDeck parses chart data and table containers as editable vector shapes and native table structures, preserving alignment, column balance, and typography without converting them into flat images.",
      },
    ],
  },
  {
    label: "Security & Privacy",
    icon: ShieldCheck,
    questions: [
      {
        question: "Are our confidential company decks used to train public AI models?",
        answer:
          "Never. ZicDeck operates on a strict zero-data-retention training policy. Your presentation content and corporate data are processed solely to deliver your editing requests and are never used to train public or foundational models.",
      },
      {
        question: "How is presentation data encrypted and protected?",
        answer:
          "All data is encrypted in transit using TLS 1.3 and at rest using AES-256 enterprise encryption. Access controls and isolated database partitions ensure only authorized team members can access your workspace decks.",
      },
      {
        question: "Can our enterprise security and procurement team review compliance controls?",
        answer:
          "Yes. We offer SOC-2 compliance documentation, custom Data Processing Agreements (DPAs), and architecture reviews for enterprise workspaces.",
      },
      {
        question: "Is Single Sign-On (SSO) and SAML integration supported?",
        answer:
          "Yes. Enterprise workspaces support Single Sign-On (SSO) through Google Workspace, Microsoft Entra ID (Azure AD), Okta, and custom SAML 2.0 identity providers.",
      },
    ],
  },
  {
    label: "Team Workspaces",
    icon: Users,
    questions: [
      {
        question: "How do shared team workspaces and collaborator permissions work?",
        answer:
          "Workspace administrators can invite colleagues with granular roles (Viewer, Editor, Admin). Teams can collaborate on shared presentation libraries, review slide revisions, and maintain consistent standards across departments.",
      },
      {
        question: "Can different teams or departments maintain separate template libraries?",
        answer:
          "Yes. Multi-workspace support allows consulting, sales, marketing, and leadership teams to maintain their own dedicated slide decks and template guidelines without crossing confidentiality boundaries.",
      },
      {
        question: "How does deck version history and rollback work?",
        answer:
          "Every AI prompt and manual revision creates a non-destructive version checkpoint. You can browse previous iterations, compare changes over time, and revert to earlier versions with a single click.",
      },
    ],
  },
  {
    label: "Plans & Billing",
    icon: ReceiptText,
    questions: [
      {
        question: "Is there a free trial available?",
        answer:
          "Yes! You can sign up for free to experience AI-powered slide editing, connect your existing presentations, and explore the full suite of workspace capabilities.",
      },
      {
        question: "What is the difference between monthly and annual billing?",
        answer:
          "Annual subscriptions include a discount of up to 20% compared to monthly billing. You can switch between billing periods or adjust your plan anytime directly from workspace billing settings.",
      },
      {
        question: "Which payment methods and invoicing options do you accept?",
        answer:
          "Self-serve plans accept all major credit cards. Enterprise plans can be configured with procurement-friendly annual invoicing, POs, and wire/ACH payments.",
      },
      {
        question: "Can we add or remove seats as our team grows?",
        answer:
          "Yes. Workspace administrators can add or remove team members at any time with automatic prorated adjustments on subsequent invoices.",
      },
    ],
  },
];

export function FAQSection() {
  const [activeTab, setActiveTab] = useState<FAQCategory>("AI Editing");
  const [openIndex, setOpenIndex] = useState(0);

  const activeQuestions = useMemo(
    () => FAQ_TABS.find((tab) => tab.label === activeTab)?.questions ?? [],
    [activeTab]
  );

  const selectTab = (tab: FAQCategory) => {
    setActiveTab(tab);
    setOpenIndex(0);
  };

  return (
    <section id="faq" className="mx-auto max-w-6xl px-5 pt-24 sm:px-8 lg:pt-32 lg:mb-32 mb-24">
      {/* Header with FadeUp */}
      <FadeUp amount={0.3} yOffset={36} className="mx-auto max-w-4xl text-center">
        <div className="inline-flex items-center gap-2 rounded-lg bg-black/[0.035] px-3 py-1.5 text-sm font-medium text-[var(--muted)]">
          <CircleHelp className="size-3.5 fill-[var(--muted)] text-[var(--surface)]" aria-hidden="true" />
          <span className="font-display">Need help?</span>
        </div>
        <h2 className="mt-6 font-display text-4xl font-semibold leading-[1.05] tracking-[-0.065em] text-[var(--ink)] sm:text-5xl lg:text-7xl">
          Frequently asked questions
        </h2>
        <p className="mx-auto mt-5 max-w-2xl font-sans text-base leading-7 text-[var(--muted)] sm:text-lg">
          Everything you need to know about ZicDeck&apos;s AI presentation editing, template compliance, formats, and enterprise security.
        </p>
      </FadeUp>

      {/* Tab Switcher with FadeUp */}
      <FadeUp delay={0.08} amount={0.3} yOffset={24} className="mt-11 overflow-x-auto pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:mt-12">
        <div role="tablist" aria-label="Frequently asked question categories" className="mx-auto flex w-max min-w-full items-center justify-start gap-1 rounded-2xl border border-[var(--border)]/80 bg-black/[0.025] p-1.5 shadow-[0_3px_10px_rgba(20,21,26,0.035)] sm:w-fit sm:min-w-0">
          {FAQ_TABS.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.label;
            return (
              <button
                key={tab.label}
                id={`faq-tab-${tab.label.toLowerCase().replace(/\s+/g, "-")}`}
                type="button"
                role="tab"
                aria-selected={isActive}
                aria-controls={`faq-panel-${tab.label.toLowerCase().replace(/\s+/g, "-")}`}
                onClick={() => selectTab(tab.label)}
                className={cn(
                  "inline-flex shrink-0 items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold transition-all duration-200 sm:px-4 cursor-pointer",
                  isActive
                    ? "bg-[var(--surface)] text-[var(--ink)] shadow-[0_2px_7px_rgba(20,21,26,0.10)] scale-[1.02]"
                    : "text-[var(--muted)] hover:bg-white/60 hover:text-[var(--ink)] active:scale-95"
                )}
              >
                <Icon className={cn("size-4", isActive ? "text-[var(--accent)]" : "text-[var(--muted)]/55")} aria-hidden="true" />
                <span className="font-display">{tab.label}</span>
              </button>
            );
          })}
        </div>
      </FadeUp>

      {/* FAQ Accordions with Popping Staggered Animation */}
      <div id={`faq-panel-${activeTab.toLowerCase().replace(/\s+/g, "-")}`} role="tabpanel" aria-labelledby={`faq-tab-${activeTab.toLowerCase().replace(/\s+/g, "-")}`} className="mx-auto mt-8 max-w-2xl sm:mt-10">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="space-y-3"
          >
            {activeQuestions.map((faq, index) => {
              const isOpen = openIndex === index;
              return (
                <motion.article
                  key={faq.question}
                  initial={{ opacity: 0, y: 20, scale: 0.98 }}
                  whileInView={{ opacity: 1, y: 0, scale: 1 }}
                  viewport={{ once: true, amount: 0.15 }}
                  transition={{
                    duration: 0.5,
                    delay: index * 0.05,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                  whileHover={{ y: -2 }}
                  className={cn(
                    "overflow-hidden rounded-[1.35rem] border transition-all duration-300",
                    isOpen
                      ? "border-[var(--border)]/65 bg-black/[0.035] shadow-[0_7px_18px_rgba(20,21,26,0.025)]"
                      : "border-[var(--border)]/75 bg-[var(--surface)] hover:border-[var(--border)] hover:shadow-sm"
                  )}
                >
                  <button
                    type="button"
                    id={`faq-question-${activeTab.toLowerCase().replace(/\s+/g, "-")}-${index}`}
                    onClick={() => setOpenIndex((current) => (current === index ? -1 : index))}
                    aria-expanded={isOpen}
                    aria-controls={`faq-answer-${activeTab.toLowerCase().replace(/\s+/g, "-")}-${index}`}
                    className="flex w-full items-center justify-between gap-5 px-5 py-5 text-left sm:px-6 cursor-pointer"
                  >
                    <span className="font-display text-base font-medium tracking-[-0.025em] text-[var(--ink)] sm:text-lg">
                      {faq.question}
                    </span>
                    <span
                      className={cn(
                        "flex size-7 shrink-0 items-center justify-center rounded-full transition-all duration-200",
                        isOpen ? "bg-[var(--accent-soft)] text-[var(--accent)] rotate-180" : "text-[var(--muted)]/70 hover:scale-110"
                      )}
                    >
                      {isOpen ? <Minus className="size-4" aria-hidden="true" /> : <Plus className="size-4" aria-hidden="true" />}
                    </span>
                  </button>
                  <div
                    id={`faq-answer-${activeTab.toLowerCase().replace(/\s+/g, "-")}-${index}`}
                    role="region"
                    aria-labelledby={`faq-question-${activeTab.toLowerCase().replace(/\s+/g, "-")}-${index}`}
                    className={cn(
                      "grid transition-[grid-template-rows,opacity] duration-300 ease-out",
                      isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                    )}
                  >
                    <div className="overflow-hidden">
                      <p className="px-5 pb-5 font-sans text-sm leading-6 text-[var(--muted)] sm:px-6 sm:pb-6 sm:text-base">
                        {faq.answer}
                      </p>
                    </div>
                  </div>
                </motion.article>
              );
            })}
          </motion.div>
        </AnimatePresence>

        {/* Footer Support with FadeUp */}
        <FadeUp delay={0.15} amount={0.3} yOffset={18} className="mt-10 text-center">
          <p className="font-sans text-sm text-[var(--muted)]">Looking for something else?</p>
          <a
            href="mailto:support@zicdeck.com"
            className="mt-1 inline-flex items-center gap-1.5 font-display text-sm font-medium text-[var(--ink)] transition-colors hover:text-[var(--accent)] group"
          >
            <span>Sign in to contact support</span>
            <BadgeCheck className="size-3.5 text-[var(--accent)] transition-transform group-hover:scale-110" />
          </a>
        </FadeUp>
      </div>
    </section>
  );
}

export default FAQSection;
