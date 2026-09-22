"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";

export type WorkspaceTheme = "light" | "dark";

interface WorkspaceThemeContextType {
  theme: WorkspaceTheme;
  setTheme: (theme: WorkspaceTheme) => void;
  toggleTheme: () => void;
}

const WorkspaceThemeContext = createContext<WorkspaceThemeContextType | undefined>(
  undefined
);

export function WorkspaceThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<WorkspaceTheme>(() => {
    if (typeof window !== "undefined") {
      const saved = window.localStorage.getItem("zicdeck-workspace-theme") as WorkspaceTheme | null;
      if (saved === "light" || saved === "dark") {
        return saved;
      }
    }
    return "light";
  });

  const setTheme = (newTheme: WorkspaceTheme) => {
    setThemeState(newTheme);
    if (typeof window !== "undefined") {
      window.localStorage.setItem("zicdeck-workspace-theme", newTheme);
    }
  };

  const toggleTheme = () => {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
  };

  return (
    <WorkspaceThemeContext.Provider value={{ theme, setTheme, toggleTheme }}>
      <div
        data-theme={theme}
        className={`workspace-shell ${theme === "dark" ? "dark bg-[#181817]" : "bg-accent/5"} flex h-screen w-full overflow-hidden text-[var(--ink)] selection:bg-[var(--accent-soft)] selection:text-[var(--accent)] transition-colors duration-200`}
      >
        {children}
      </div>
    </WorkspaceThemeContext.Provider>
  );
}

export function useWorkspaceTheme() {
  const context = useContext(WorkspaceThemeContext);
  if (!context) {
    throw new Error("useWorkspaceTheme must be used within a WorkspaceThemeProvider");
  }
  return context;
}
