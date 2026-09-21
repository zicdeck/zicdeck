"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface AuthCardProps {
  title: string;
  subtitle?: string;
  error?: string | null;
  children: React.ReactNode;
  headerRight?: React.ReactNode;
  footer?: React.ReactNode;
  className?: string;
}

type AuthTheme = "light" | "dark";

export function AuthCard({
  title,
  subtitle,
  error,
  children,
  headerRight,
  footer,
  className,
}: AuthCardProps) {
  const [theme, setTheme] = useState<AuthTheme>("dark");

  useEffect(() => {
    const savedTheme = window.localStorage.getItem("zicdeck-auth-theme");
    if (savedTheme === "light" || savedTheme === "dark") {
      setTheme(savedTheme);
    }
  }, []);

  const toggleTheme = () => {
    const nextTheme = theme === "dark" ? "light" : "dark";
    setTheme(nextTheme);
    window.localStorage.setItem("zicdeck-auth-theme", nextTheme);
  };

  return (
    <main
      data-theme={theme}
      className="auth-shell relative min-h-screen overflow-hidden bg-[#3159ee] p-[8px] sm:p-[10px] text-[var(--ink)] selection:bg-white/20 selection:text-white flex items-center justify-center"
    >
      {/* Background Gradient */}
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,#213db4_0%,#315bf4_56%,#a9b8ff_100%)]" />

      {/* Top-Right Background SVG (compact top-right shape) */}
      <div className="pointer-events-none absolute right-0 top-0 z-0 h-[220px] w-[220px] sm:h-[260px] sm:w-[260px] lg:h-[290px] lg:w-[290px] overflow-hidden opacity-75">
        <Image
          src="/authpage-bg.svg"
          alt=""
          width={290}
          height={290}
          priority
          className="h-full w-full object-contain object-right-top"
        />
      </div>

      {/* Main Grid Container (compact height on desktop, full on mobile) */}
      <div className="relative z-10 mx-auto grid w-full max-w-[1280px] items-center lg:grid-cols-[minmax(0,540px)_1fr] lg:gap-12 xl:gap-16">
        {/* Auth Card (only stretched on mobile; compact & intrinsic on desktop) */}
        <section
          className={cn(
            "relative flex min-h-[calc(100vh-16px)] sm:min-h-[calc(100vh-20px)] lg:min-h-0 lg:h-auto flex-col justify-between overflow-hidden rounded-[24px] bg-[var(--surface)] px-6 py-7 sm:px-10 sm:py-8 lg:px-11 lg:py-8 shadow-[0_24px_60px_rgba(13,25,89,0.24)]",
            className
          )}
        >
          {/* Header */}
          <header className="flex items-center justify-between gap-4">
            {/* Logo without any borders or container classes */}
            <Link
              href="/"
              aria-label="Go to ZicDeck home"
              className="group inline-flex items-center gap-2.5 text-[var(--ink)] transition-opacity hover:opacity-85"
            >
              <Image
                src="/logo.svg"
                alt="ZicDeck logo"
                width={22}
                height={22}
                className="shrink-0"
              />
              <span className="font-display text-lg sm:text-xl font-semibold tracking-[-0.03em]">
                ZicDeck
              </span>
            </Link>

            {/* Top Right Header Action (Matching Image 1 style) */}
            {headerRight ? (
              <div className="text-right">{headerRight}</div>
            ) : footer ? (
              <div className="text-right">{footer}</div>
            ) : null}
          </header>

          {/* Form Content Area (compact padding on desktop) */}
          <div className="mx-auto flex w-full max-w-[396px] flex-col justify-center py-6 sm:py-8 lg:py-6">
            <div className="mb-6 text-center">
              <h1 className="font-display text-2xl sm:text-[1.75rem] font-semibold tracking-[-0.04em] text-[var(--ink)]">
                {title}
              </h1>
              {subtitle && (
                <p className="mt-1.5 text-xs sm:text-[13px] font-display leading-relaxed text-[var(--muted)]">
                  {subtitle}
                </p>
              )}
            </div>

            {error && (
              <div
                role="alert"
                className="mb-5 flex items-start gap-2.5 rounded-xl border border-red-400/30 bg-red-500/10 p-3 text-xs leading-relaxed text-red-400"
              >
                <AlertCircle className="mt-0.5 size-4 shrink-0" />
                <p className="font-medium">{error}</p>
              </div>
            )}

            {children}
          </div>

          {/* Footer with rotating theme switch icon */}
          <footer className="flex items-center justify-between gap-4 pt-4 border-t border-[var(--border)]/30 text-xs sm:text-[13px] font-display text-[var(--muted)]">
            <span>© 2026 ZicDeck</span>
            <button
              type="button"
              onClick={toggleTheme}
              className="inline-flex items-center gap-2 rounded-lg px-2.5 py-1.5 text-xs sm:text-[13px] font-display font-medium transition-colors hover:bg-[var(--paper)] hover:text-[var(--ink)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] cursor-pointer"
              aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
            >
              <span
                aria-hidden="true"
                className="grid size-5 place-items-center transition-transform duration-500 ease-out"
                style={{
                  transform: theme === "dark" ? "rotate(0deg)" : "rotate(180deg)",
                }}
              >
                <svg
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  fill="currentColor"
                  className="remixicon size-[18px]"
                >
                  <path d="M12 21.9967C6.47715 21.9967 2 17.5196 2 11.9967C2 6.47386 6.47715 1.9967 12 1.9967C17.5228 1.9967 22 6.47386 22 11.9967C22 17.5196 17.5228 21.9967 12 21.9967ZM12 19.9967C16.4183 19.9967 20 16.415 20 11.9967C20 7.57843 16.4183 3.9967 12 3.9967C7.58172 3.9967 4 7.57843 4 11.9967C4 16.415 7.58172 19.9967 12 19.9967ZM7.00035 15.316C9.07995 15.1646 11.117 14.2939 12.7071 12.7038C14.2972 11.1137 15.1679 9.07666 15.3193 6.99706C15.6454 7.21408 15.955 7.46642 16.2426 7.75406C18.5858 10.0972 18.5858 13.8962 16.2426 16.2393C13.8995 18.5825 10.1005 18.5825 7.75736 16.2393C7.46971 15.9517 7.21738 15.6421 7.00035 15.316Z"></path>
                </svg>
              </span>
              <span>{theme === "dark" ? "Light mode" : "Dark mode"}</span>
            </button>
          </footer>
        </section>

        {/* Right Side (Clean, lowered font size, no description/workspace tag) */}
        <aside className="relative hidden overflow-hidden px-8 py-10 text-white lg:flex lg:flex-col lg:justify-center">
          <div className="relative max-w-[380px]">
            <h2 className="font-display text-2xl lg:text-[28px] font-medium leading-[1.25] tracking-[-0.03em] text-white">
              From rough ideas to presentation-ready work.
            </h2>
            <ol className="mt-7 space-y-3 text-xs sm:text-[13px] font-display text-white/85">
              <li className="flex items-center gap-3">
                <span className="font-display text-[11px] text-white/45">01</span>
                <span>Shape a clear story with AI.</span>
              </li>
              <li className="flex items-center gap-3">
                <span className="font-display text-[11px] text-white/45">02</span>
                <span>Refine slides without breaking your brand.</span>
              </li>
              <li className="flex items-center gap-3">
                <span className="font-display text-[11px] text-white/45">03</span>
                <span>Deliver polished work with confidence.</span>
              </li>
            </ol>
          </div>
        </aside>
      </div>
    </main>
  );
}
