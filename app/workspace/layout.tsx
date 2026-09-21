import React from "react";
import { WorkspaceSidebar } from "@/components/workspace/WorkspaceSidebar";
import { WorkspacePricingModalProvider } from "@/components/workspace/WorkspacePricingModalContext";
import { WorkspaceThemeProvider } from "@/components/workspace/WorkspaceThemeContext";
import { PricingModal } from "@/components/workspace/PricingModal";

export default function WorkspaceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <WorkspaceThemeProvider>
      <WorkspacePricingModalProvider>
        {/* Workspace Sidebar */}
        <WorkspaceSidebar />

        {/* Main Workspace View Area */}
        <main className="relative flex min-w-0 flex-1 my-[12px] mr-[12px] rounded-[20px] dark:border border-[var(--border)] flex-col overflow-y-auto bg-[var(--surface)] shadow-[0_10px_30px_rgba(1,117,179,0.08)] dark:shadow-[0_10px_40px_rgba(0,0,0,0.5)] transition-colors duration-200">
          {children}
        </main>

        {/* Global Pricing Modal for Workspace */}
        <PricingModal />
      </WorkspacePricingModalProvider>
    </WorkspaceThemeProvider>
  );
}
