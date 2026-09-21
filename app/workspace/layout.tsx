import React from "react";
import { WorkspaceSidebar } from "@/components/workspace/WorkspaceSidebar";
import { WorkspacePricingModalProvider } from "@/components/workspace/WorkspacePricingModalContext";
import { PricingModal } from "@/components/workspace/PricingModal";

export default function WorkspaceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <WorkspacePricingModalProvider>
      <div className="flex bg-accent-soft h-screen w-full overflow-hidden bg-[var(--paper)] text-[var(--ink)] selection:bg-[var(--accent-soft)] selection:text-[var(--accent)]">
        {/* Workspace Sidebar */}
        <WorkspaceSidebar />

        {/* Main Workspace View Area */}
        <main className="relative flex min-w-0 flex-1 my-[12px] shadow-[0_10px_30px_rgba(1,117,179,0.08)] mr-[12px] rounded-[20px] flex-col overflow-y-auto bg-white">
          {children}
        </main>

        {/* Global Pricing Modal for Workspace */}
        <PricingModal />
      </div>
    </WorkspacePricingModalProvider>
  );
}
