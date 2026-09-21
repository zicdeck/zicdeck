"use client";

import { useMemo, useState } from "react";
import {
  BadgeCheck,
  CircleHelp,
  CircleUserRound,
  Headphones,
  Heart,
  Minus,
  Plus,
  ReceiptText,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";

type FAQCategory = "Account" | "Billing" | "Support" | "Security" | "Features" | "Compliance";

interface FAQItem {
  question: string;
  answer: string;
}

interface FAQTab {
  label: FAQCategory;
  icon: typeof CircleUserRound;
  questions: FAQItem[];
}

const FAQ_TABS: FAQTab[] = [
  {
    label: "Account",
    icon: CircleUserRound,
    questions: [
      { question: "How do I create a Zicdeck workspace?", answer: "Create an account with your work email, then name your workspace and invite teammates when you are ready. You can begin with a single deck and expand your workspace over time." },
      { question: "Can I update my account email address?", answer: "Yes. Open your profile settings and choose a new email address. We will ask you to verify the change before applying it to your account." },
      { question: "How can I invite colleagues to my workspace?", answer: "Workspace administrators can invite colleagues from the team settings page. Invitations can be sent individually or shared through a secure organization link." },
      { question: "Can I use Zicdeck with more than one workspace?", answer: "Yes. If you work with multiple teams, you can switch between workspaces without mixing decks, collaborators, or brand standards." },
      { question: "How do I close my Zicdeck account?", answer: "You can request account closure from your profile settings. We will confirm the request and guide you through exporting any decks or workspace information you want to retain." },
    ],
  },
  {
    label: "Billing",
    icon: ReceiptText,
    questions: [
      { question: "Which payment methods does Zicdeck accept?", answer: "Self-serve plans accept major credit cards. Enterprise customers can arrange invoicing and procurement-friendly payment terms with our sales team." },
      { question: "Can I change plans at any time?", answer: "Yes. Workspace administrators can upgrade, downgrade, or move to an annual plan from billing settings. Changes are reflected at the next applicable billing period." },
      { question: "Where can I download invoices and receipts?", answer: "Your billing history includes downloadable invoices and payment receipts for every completed transaction. Administrators can access it from the workspace billing area." },
      { question: "Do you offer annual pricing?", answer: "Yes. Annual subscriptions are available for teams that want predictable planning and consolidated billing. Contact us if you need a custom enterprise agreement." },
      { question: "What happens if a payment fails?", answer: "We will notify workspace administrators and retry the payment securely. Your workspace remains available during the grace period while you update payment details." },
    ],
  },
  {
    label: "Support",
    icon: Headphones,
    questions: [
      { question: "How quickly can I expect a support response?", answer: "Support response times depend on your plan, with priority assistance for Professional and Enterprise workspaces. We aim to resolve presentation-blocking issues as quickly as possible." },
      { question: "Can you help with a specific slide problem?", answer: "Yes. Share the slide context and the outcome you need. Our team can help you understand the best workflow for updating a layout, narrative, or visual hierarchy." },
      { question: "Is onboarding available for teams?", answer: "Enterprise workspaces can receive guided onboarding for administrators and presentation teams, including template setup and adoption planning." },
      { question: "Where can I report a bug?", answer: "Use the in-app feedback option or contact support with a clear description, steps to reproduce, and any relevant deck context. We will keep you updated as we investigate." },
      { question: "Do you offer live training sessions?", answer: "Live training is available for eligible team and enterprise plans. Sessions focus on the fastest way to bring existing decks and brand standards into Zicdeck." },
    ],
  },
  {
    label: "Security",
    icon: ShieldCheck,
    questions: [
      { question: "How is our presentation data protected?", answer: "Zicdeck uses safeguards designed for confidential work, including secure transfer, protected storage, and access controls at the workspace level." },
      { question: "Can we restrict access to specific teammates?", answer: "Yes. Workspace roles help administrators control who can access, edit, and manage shared presentation work within their organization." },
      { question: "Does Zicdeck train models on our decks?", answer: "Your presentation content is processed to deliver the requested editing experience and is not used to train public models." },
      { question: "Can our security team review your controls?", answer: "Absolutely. Enterprise prospects can contact us to discuss security requirements, review relevant documentation, and align on their procurement process." },
      { question: "Is single sign-on available?", answer: "Single sign-on and enterprise identity requirements can be supported as part of an Enterprise workspace conversation with our team." },
    ],
  },
  {
    label: "Features",
    icon: Sparkles,
    questions: [
      { question: "What kinds of presentation edits can Zicdeck make?", answer: "You can request narrative rewrites, updated metrics, layout improvements, visual hierarchy changes, and polished slide refinements through a conversational workflow." },
      { question: "Does Zicdeck preserve existing brand formatting?", answer: "Yes. Zicdeck is designed to work within your existing presentation system, preserving the typography, layout logic, and visual standards your team already uses." },
      { question: "Can I edit multiple slides at once?", answer: "Yes. You can provide direction that applies across a sequence of slides, then review the resulting edits in the context of your original deck." },
      { question: "Can I review changes before they are applied?", answer: "Yes. Zicdeck keeps the review process clear so you can inspect revisions and decide which updates belong in your final presentation." },
      { question: "Which presentation formats work with Zicdeck?", answer: "Zicdeck is built around the presentation tools teams already use, including PowerPoint and Google Slides workflows." },
    ],
  },
  {
    label: "Compliance",
    icon: Heart,
    questions: [
      { question: "Can I request access to or deletion of my data?", answer: "Depending on where you live, you may request access, correction, deletion, export, or restriction of your personal data. Contact our team and we will guide you through the request." },
      { question: "Does Zicdeck use cookies?", answer: "We use limited cookies and similar technologies to keep the service secure, remember preferences, and understand how the product is performing." },
      { question: "Where may data be processed?", answer: "Data may be processed by Zicdeck and carefully selected service providers where needed to operate, secure, and support the product." },
      { question: "Which service providers receive data?", answer: "We use trusted providers for essential services such as infrastructure, authentication, and support. Additional details are available through our privacy documentation." },
      { question: "Where can I read the legal policies?", answer: "Our privacy policy, terms of service, and related legal information are available from the links in the footer. Contact us if your team needs additional documentation." },
    ],
  },
];

export function FAQSection() {
  const [activeTab, setActiveTab] = useState<FAQCategory>("Compliance");
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
      <div className="mx-auto max-w-4xl text-center">
        <div className="inline-flex items-center gap-2 rounded-lg bg-black/[0.035] px-3 py-1.5 text-sm font-medium text-[var(--muted)]">
          <CircleHelp className="size-3.5 fill-[var(--muted)] text-[var(--surface)]" aria-hidden="true" />
          <span className="font-display">Need help?</span>
        </div>
        <h2 className="mt-6 font-display text-4xl font-semibold leading-[1.05] tracking-[-0.065em] text-[var(--ink)] sm:text-5xl lg:text-7xl">Frequently asked questions</h2>
        <p className="mx-auto mt-5 max-w-2xl font-sans text-base leading-7 text-[var(--muted)] sm:text-lg">Find quick answers about Zicdeck&apos;s pricing, onboarding, presentation editing, and security practices.</p>
      </div>

      <div className="mt-11 overflow-x-auto pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:mt-12">
        <div role="tablist" aria-label="Frequently asked question categories" className="mx-auto flex w-max min-w-full items-center justify-start gap-1 rounded-2xl border border-[var(--border)]/80 bg-black/[0.025] p-1.5 shadow-[0_3px_10px_rgba(20,21,26,0.035)] sm:w-fit sm:min-w-0">
          {FAQ_TABS.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.label;
            return (
              <button
                key={tab.label}
                id={`faq-tab-${tab.label.toLowerCase()}`}
                type="button"
                role="tab"
                aria-selected={isActive}
                aria-controls={`faq-panel-${tab.label.toLowerCase()}`}
                onClick={() => selectTab(tab.label)}
                className={cn(
                  "inline-flex shrink-0 items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold transition-all duration-200 sm:px-4",
                  isActive
                    ? "bg-[var(--surface)] text-[var(--ink)] shadow-[0_2px_7px_rgba(20,21,26,0.10)]"
                    : "text-[var(--muted)] hover:bg-white/60 hover:text-[var(--ink)]"
                )}
              >
                <Icon className={cn("size-4", isActive ? "text-[var(--accent)]" : "text-[var(--muted)]/55")} aria-hidden="true" />
                <span className="font-display">{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div id={`faq-panel-${activeTab.toLowerCase()}`} role="tabpanel" aria-labelledby={`faq-tab-${activeTab.toLowerCase()}`} className="mx-auto mt-8 max-w-2xl sm:mt-10">
        <div className="space-y-3">
          {activeQuestions.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <article key={faq.question} className={cn("overflow-hidden rounded-[1.35rem] border transition-all duration-300", isOpen ? "border-[var(--border)]/65 bg-black/[0.035] shadow-[0_7px_18px_rgba(20,21,26,0.025)]" : "border-[var(--border)]/75 bg-[var(--surface)] hover:border-[var(--border)] hover:shadow-sm")}>
                <button
                  type="button"
                  id={`faq-question-${activeTab.toLowerCase()}-${index}`}
                  onClick={() => setOpenIndex((current) => (current === index ? -1 : index))}
                  aria-expanded={isOpen}
                  aria-controls={`faq-answer-${activeTab.toLowerCase()}-${index}`}
                  className="flex w-full items-center justify-between gap-5 px-5 py-5 text-left sm:px-6"
                >
                  <span className="font-display text-base font-medium tracking-[-0.025em] text-[var(--ink)] sm:text-lg">{faq.question}</span>
                  <span className={cn("flex size-7 shrink-0 items-center justify-center rounded-full transition-colors duration-200", isOpen ? "bg-[var(--accent-soft)] text-[var(--accent)]" : "text-[var(--muted)]/70")}>
                    {isOpen ? <Minus className="size-4" aria-hidden="true" /> : <Plus className="size-4" aria-hidden="true" />}
                  </span>
                </button>
                <div id={`faq-answer-${activeTab.toLowerCase()}-${index}`} role="region" aria-labelledby={`faq-question-${activeTab.toLowerCase()}-${index}`} className={cn("grid transition-[grid-template-rows,opacity] duration-300 ease-out", isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0")}>
                  <div className="overflow-hidden">
                    <p className="px-5 pb-5 font-sans text-sm leading-6 text-[var(--muted)] sm:px-6 sm:pb-6 sm:text-base">{faq.answer}</p>
                  </div>
                </div>
              </article>
            );
          })}
        </div>

        <div className="mt-10 text-center">
          <p className="font-sans text-sm text-[var(--muted)]">Looking for something else?</p>
          <a href="mailto:support@zicdeck.com" className="mt-1 inline-flex items-center gap-1.5 font-display text-sm font-medium text-[var(--ink)] transition-colors hover:text-[var(--accent)]">Sign in to contact support <BadgeCheck className="size-3.5 text-[var(--accent)]" /></a>
        </div>
      </div>
    </section>
  );
}

export default FAQSection;
