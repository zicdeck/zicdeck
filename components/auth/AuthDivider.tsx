import React from "react";

interface AuthDividerProps {
  label?: string;
}

export function AuthDivider({ label = "or continue with email" }: AuthDividerProps) {
  return (
    <div className="relative my-5 flex items-center justify-center">
      <div className="absolute inset-0 flex items-center">
        <div className="w-full border-t border-[var(--border)]" />
      </div>
      <div className="relative flex justify-center text-xs uppercase">
        <span className="bg-[var(--surface)] px-3 text-[11px] font-display font-medium tracking-wider text-[var(--muted)]">
          {label}
        </span>
      </div>
    </div>
  );
}
