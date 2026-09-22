import React from "react";
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
        {children}

        {/* Global Pricing Modal for Workspace */}
        <PricingModal />
      </WorkspacePricingModalProvider>
    </WorkspaceThemeProvider>
  );
}
