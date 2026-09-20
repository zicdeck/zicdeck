import * as React from "react";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface PillBadgeProps {
  label: string;
  href?: string;
  className?: string;
}

export function PillBadge({ label, href, className }: PillBadgeProps) {
  const content = (
    <div
      className={cn(
        "inline-flex items-center gap-3 rounded-full border border-[var(--border)] bg-[var(--surface)] p-1 pl-3 transition-colors hover:bg-[var(--paper)]",
        className
      )}
    >
      <span className="whitespace-nowrap text-xs font-medium text-[var(--ink)]">
        {label}
      </span>
      <span className="flex items-center justify-center rounded-full bg-[var(--accent-soft)] p-1.5">
        <ArrowRight className="size-3.5 text-[var(--accent)]" />
      </span>
    </div>
  );

  if (href) {
    return (
      <a href={href} className="inline-block">
        {content}
      </a>
    );
  }
  return content;
}
