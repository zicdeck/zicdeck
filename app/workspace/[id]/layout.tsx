import React from "react";

export default function PresentationLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative flex h-screen w-full min-w-0 flex-1 overflow-hidden bg-[var(--surface)] text-[var(--ink)]">
      {children}
    </div>
  );
}
