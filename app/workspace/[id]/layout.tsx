import React from "react";

export default function PresentationLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative flex h-full w-full min-w-0 flex-1 p-[12px]">
      <main className="relative flex h-full min-w-0 flex-1 rounded-[20px] dark:border border-[var(--border)] flex-col overflow-hidden bg-[var(--surface)] shadow-[0_10px_30px_rgba(1,117,179,0.08)] dark:shadow-[0_10px_40px_rgba(0,0,0,0.5)] transition-colors duration-200">
        {children}
      </main>
    </div>
  );
}
