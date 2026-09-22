"use client";

import React, { createContext, useContext, useSyncExternalStore, ReactNode } from "react";

export type WorkspaceTheme = "light" | "dark";

interface WorkspaceThemeContextType {
  theme: WorkspaceTheme;
  setTheme: (theme: WorkspaceTheme) => void;
  toggleTheme: () => void;
}

const WorkspaceThemeContext = createContext<WorkspaceThemeContextType | undefined>(
  undefined
);

const THEME_STORAGE_KEY = "zicdeck-workspace-theme";

function subscribeTheme(callback: () => void) {
  window.addEventListener("storage", callback);
  window.addEventListener("zicdeck-theme-change", callback);
  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener("zicdeck-theme-change", callback);
  };
}

function getThemeSnapshot(): WorkspaceTheme {
  try {
    const saved = localStorage.getItem(THEME_STORAGE_KEY);
    if (saved === "light" || saved === "dark") {
      return saved;
    }
  } catch {
    // fallback
  }
  return "light";
}

function getThemeServerSnapshot(): WorkspaceTheme {
  return "light";
}

export function WorkspaceThemeProvider({ children }: { children: ReactNode }) {
  const theme = useSyncExternalStore(subscribeTheme, getThemeSnapshot, getThemeServerSnapshot);

  const setTheme = (newTheme: WorkspaceTheme) => {
    try {
      localStorage.setItem(THEME_STORAGE_KEY, newTheme);
      window.dispatchEvent(new Event("zicdeck-theme-change"));
    } catch {
      // ignore storage errors
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
        suppressHydrationWarning
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
