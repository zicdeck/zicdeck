"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";

interface WorkspacePricingModalContextType {
  isOpen: boolean;
  openPricingModal: () => void;
  closePricingModal: () => void;
}

const WorkspacePricingModalContext = createContext<
  WorkspacePricingModalContextType | undefined
>(undefined);

export function WorkspacePricingModalProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [isOpen, setIsOpen] = useState(false);

  const openPricingModal = () => setIsOpen(true);
  const closePricingModal = () => setIsOpen(false);

  return (
    <WorkspacePricingModalContext.Provider
      value={{ isOpen, openPricingModal, closePricingModal }}
    >
      {children}
    </WorkspacePricingModalContext.Provider>
  );
}

export function useWorkspacePricingModal() {
  const context = useContext(WorkspacePricingModalContext);
  if (!context) {
    throw new Error(
      "useWorkspacePricingModal must be used within a WorkspacePricingModalProvider"
    );
  }
  return context;
}
