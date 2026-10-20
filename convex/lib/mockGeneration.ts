// Scripted stand-in for the AI pipeline. Everything here is deterministic for a
// given prompt so the server can rebuild any stage of the first pass. Swap these
// helpers for real model calls once the AI integration lands.

import type { Attachment, Source, StepIcon } from "./validators";

export const FALLBACK_TITLE = "Q3 2026 Business Performance & Strategic Priorities";

export function deriveTitle(prompt: string): string {
  const lines = prompt
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);
  const firstLine = lines[0] || "";
  const cleanFirstLine = firstLine.replace(/^[#\s*"\-“]+|[#\s*"\-”]+$/g, "");
  if (cleanFirstLine.length > 3 && cleanFirstLine.length < 65) {
    return cleanFirstLine;
  }
  const words = cleanFirstLine.split(" ").slice(0, 6).join(" ");
  return words || FALLBACK_TITLE;
}

export interface PromptContext {
  aiIntro: string;
  searchTopic: string;
  sources: Source[];
  groundingMsg: string;
  directionMsg: string;
  templateName: string;
}

export function getPromptContext(prompt: string, title: string): PromptContext {
  const p = prompt.toLowerCase();
  const isEgypt = p.includes("egypt") || p.includes("god") || p.includes("myth");
  const isQBR =
    p.includes("q3") ||
    p.includes("q4") ||
    p.includes("review") ||
    p.includes("quarter") ||
    p.includes("business") ||
    p.includes("nexora") ||
    p.includes("kpi");

  if (isEgypt) {
    return {
      aiIntro:
        "I’ll turn this into a clear, visual introduction to the gods of ancient Egypt — who they were, what they represented, and how they fit together. I’ll start with a strong story arc and keep the mythology approachable rather than encyclopedic.",
      searchTopic: "ancient Egyptian go...",
      sources: [
        { title: "Ancient Egyptian gods and goddesses", domain: "britishmuseum.org" },
        { title: "Explore Deities in Ancient Egypt", domain: "metmuseum.org" },
        { title: "11 Egyptian Gods and Goddesses", domain: "britannica.com" },
        { title: "Thoth", domain: "ancient.eu" },
      ],
      groundingMsg:
        "I’m grounding the story in museum and reference material so the roles and relationships stay accurate. The core thread is already clear: Egyptian gods weren't a fixed superhero roster — they formed a living system of sun, order, death, protection, and kingship.",
      directionMsg:
        "The educational, illustrated direction is set — warm parchment, teal-and-mustard accents, and a friendly editorial feel.",
      templateName: "Ancient World Illustrated",
    };
  }

  if (isQBR) {
    return {
      aiIntro: `This is a clear, detailed brief — I'll build a clean, executive-style deck for ${title} with KPI cards, charts, and clear section rhythm. Let me pick a fitting professional template first.`,
      searchTopic: "Q3 2026 performance benchmarks...",
      sources: [
        { title: "Q3 2026 Executive Performance Benchmark", domain: "gartner.com" },
        { title: "SaaS Retention & Expansion Cohort Analysis", domain: "bvp.com" },
        { title: "Corporate Operational Review Best Practices", domain: "mckinsey.com" },
        { title: "Strategic Key Results & Metric Frameworks", domain: "hbr.org" },
      ],
      groundingMsg:
        "I'm grounding the deck in verified quarterly actuals and operational benchmarks so the metrics and growth trajectory stay audit-ready. The core thread is clear: demonstrated strong top-line momentum while establishing disciplined infrastructure spend heading into Q4.",
      directionMsg:
        "The executive, structured direction is set — clean geometry, subtle visual accents, and strong typography hierarchy.",
      templateName: "Account Health QBR",
    };
  }

  return {
    aiIntro: `I'll build a structured, high-impact deck for ${title} — framing key principles, measurable takeaways, and a clear story arc for your audience.`,
    searchTopic: `${title.slice(0, 24)}...`,
    sources: [
      { title: `Comprehensive Overview: ${title}`, domain: "researchgate.net" },
      { title: "Global Industry Standards & Trends", domain: "statista.com" },
      { title: "Key Performance Indicators & Benchmark Data", domain: "bloomberg.com" },
      { title: "Strategic Execution & Leadership Frameworks", domain: "hbr.org" },
    ],
    groundingMsg:
      "I'm grounding the narrative in verified reference material and industry benchmarks so the structure remains rigorous, clear, and executive-friendly. The core thread is already established around strategic impact and actionable next steps.",
    directionMsg:
      "The executive, polished direction is set — clean geometry, purposeful whitespace, and strong typography hierarchy.",
    templateName: "Account Health QBR",
  };
}

export const DEFAULT_OUTLINE: Array<{
  title: string;
  bullets: string[];
  attachment?: Attachment;
}> = [
  {
    title: FALLBACK_TITLE,
    bullets: [],
  },
  {
    title: "Growth accelerated, with investment and adoption now the Q4 test.",
    bullets: [
      "Revenue rose 18% versus Q2; 127 new business customers and 23% MAU growth show demand.",
      "Retention reached 94%; onboarding and support improved.",
      "Costs rose 8% as hiring and infrastructure expanded; Q4 focus is adoption, enterprise conversion, and unit economics.",
    ],
  },
  {
    title: "Revenue and usage grew faster than operating costs.",
    bullets: [
      "Revenue +18% quarter over quarter; monthly active users +23%.",
      "Operating costs +8%, driven by expanded hiring and infrastructure investments.",
      "Show an indexed Q2=100 comparison, not invented dollar actuals: revenue 118, MAU 123, costs 108.",
    ],
    attachment: {
      type: "Chart",
      title: "Q3 growth versus Q...",
    },
  },
  {
    title: "Customer momentum is strong, but retention has room to improve.",
    bullets: [
      "127 new business customers acquired in Q3.",
      "94% customer retention.",
      "Present as two prominent KPI cards with a small note that the Q4 retention goal is 95%.",
    ],
  },
  {
    title: "Product and execution wins widened the growth platform.",
    bullets: [
      "Launched the AI-powered workflow assistant and entered three new European markets.",
      "Average customer onboarding fell from 14 to 9 days, a five-day improvement.",
      "Signed several strategic enterprise customers; customer support response times improved 31%.",
    ],
  },
  {
    title: "Five risks require focused Q4 responses, not a change of direction.",
    bullets: [
      "Competitive intensity in AI automation: differentiate with workflow outcomes and adoption.",
      "AI usage raises infrastructure costs: optimize cost per customer.",
      "Enterprise sales cycles lengthen: improve qualification and deal progression.",
      "Experienced AI engineering talent is scarce: prioritize critical hiring and capacity.",
      "Existing-customer adoption needs work: strengthen enablement and in-product activation.",
    ],
  },
];

export function getChatReply(
  text: string,
  title: string,
  slideNumber: number,
): { content: string; steps: Array<{ icon: StepIcon; label: string }> } {
  const lower = text.toLowerCase();
  let content = `I've analyzed slide ${slideNumber} and applied the revisions to **${title}**. All typography hierarchy, margins, and brand guidelines remain strictly compliant.`;
  let stepLabel = `Analyzed slide ${slideNumber} structure`;

  if (lower.includes("q4") || lower.includes("actual")) {
    content = `Updated slide ${slideNumber} with Q4 actuals. Data callouts and chart alignment have been rebalanced to match your executive template.`;
    stepLabel = `Grounded slide ${slideNumber} with Q4 actuals`;
  } else if (lower.includes("one line") || lower.includes("title")) {
    content = `Adjusted headline tracking and font weight on slide ${slideNumber}. The title now sits cleanly on a single line without breaking visual hierarchy.`;
    stepLabel = `Adjusted typography hierarchy on slide ${slideNumber}`;
  } else if (lower.includes("column") || lower.includes("3")) {
    content = `Rebuilt the slide architecture into a 3-column layout with equal gutters and aligned metrics.`;
    stepLabel = `Reconfigured layout to 3-column architecture`;
  }

  return {
    content,
    steps: [
      { icon: "book", label: stepLabel },
      { icon: "check", label: "Applied revisions to presentation" },
    ],
  };
}
