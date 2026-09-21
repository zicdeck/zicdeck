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
  headerText?: string;
  headerActionLabel?: string;
  headerHref?: string;
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
  headerText = "Already have an account?",
  headerActionLabel = "Login",
  headerHref = "/sign-in",
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
      className="auth-shell relative min-h-dvh w-full overflow-auto bg-[linear-gradient(180deg,#18369f_0%,#2547d8_25%,#335cff_50%,#7892ff_75%,#dce4ff_100%)] p-2 min-[1181px]:h-dvh min-[1181px]:min-h-[640px] min-[1181px]:overflow-hidden min-[1181px]:p-0 selection:bg-white/20 selection:text-white"
    >
      <div className="relative mx-auto min-h-[calc(100dvh_-_16px)] w-full max-w-[1440px] min-[1181px]:h-dvh min-[1181px]:min-h-[640px]">
        {/* Auth Section Card */}
        <section
          className={cn(
            "relative z-10 flex min-h-[calc(100dvh_-_16px)] w-full flex-col overflow-hidden rounded-[20px] bg-[var(--surface)] text-[var(--ink)] shadow-[0_0_0_1px_rgba(37,71,216,0.04),0_1px_1px_0.5px_rgba(37,71,216,0.04),0_3px_3px_-1.5px_rgba(37,71,216,0.02),0_6px_6px_-3px_rgba(37,71,216,0.04),0_12px_12px_-6px_rgba(37,71,216,0.04),0_24px_24px_-12px_rgba(37,71,216,0.04),0_48px_48px_-24px_rgba(37,71,216,0.04)] min-[1181px]:absolute min-[1181px]:left-[0.555556%] min-[1181px]:top-1/2 min-[1181px]:h-[calc(100%_-_16px)] min-[1181px]:min-h-0 min-[1181px]:max-h-[884px] min-[1181px]:w-[58.055556%] min-[1181px]:-translate-y-1/2 min-[1181px]:rounded-2xl",
            className
          )}
        >
          {/* Header */}
          <header className="relative flex shrink-0 items-center gap-3 border-b border-[var(--border)] px-6 py-5 max-[359px]:gap-2 max-[359px]:px-3 min-[1181px]:absolute min-[1181px]:left-8 min-[1181px]:right-8 min-[1181px]:top-8 min-[1181px]:border-b-0 min-[1181px]:p-0">
            <Link
              href="/"
              aria-label="Go to ZicDeck home"
              className="group flex shrink-0 items-center gap-2 text-[var(--ink)] transition-opacity hover:opacity-85"
            >
              <Image
                src="/logo.svg"
                alt="ZicDeck"
                width={22}
                height={22}
                className="shrink-0"
              />
              <span className="font-display text-base font-semibold tracking-[-0.02em]">
                ZicDeck
              </span>
            </Link>

            {headerRight ? (
              <div className="flex flex-1 items-center justify-end gap-2 text-right">
                {headerRight}
              </div>
            ) : (
              <>
                {headerText && (
                  <p className="min-w-0 flex-1 text-right text-sm font-normal leading-5 tracking-[-0.006em] text-[var(--muted)] max-[359px]:text-xs max-[359px]:leading-4">
                    {headerText}
                  </p>
                )}
                {headerActionLabel && headerHref && (
                  <Link
                    href={headerHref}
                    className="flex shrink-0 items-center justify-center rounded-lg bg-[var(--accent-soft)] p-1.5 text-sm font-medium leading-5 tracking-[-0.006em] text-[var(--accent)] transition-colors hover:bg-[rgba(51,92,255,0.18)] max-[359px]:text-xs max-[359px]:leading-4 active:scale-95"
                  >
                    <span className="px-1">{headerActionLabel}</span>
                  </Link>
                )}
              </>
            )}
          </header>

          {/* Form Content */}
          <div className="relative flex w-full max-w-[440px] flex-1 self-center px-6 py-8 max-[359px]:px-3 min-[1181px]:absolute min-[1181px]:left-1/2 min-[1181px]:top-[calc(50%_-_16px)] min-[1181px]:w-[392px] min-[1181px]:max-w-none min-[1181px]:flex-none min-[1181px]:self-auto min-[1181px]:-translate-x-1/2 min-[1181px]:-translate-y-1/2 min-[1181px]:p-0">
            <div className="flex w-full flex-col items-end gap-6">
              <div className="flex w-full flex-col items-center">
                <div className="flex w-full flex-col items-center gap-1 text-center">
                  <h1 className="w-full text-xl font-medium leading-7 tracking-normal text-[var(--ink)] min-[1181px]:text-2xl min-[1181px]:leading-8">
                    {title}
                  </h1>
                  {subtitle && (
                    <p className="w-full text-sm font-normal leading-5 tracking-[-0.006em] text-[var(--muted)] min-[1181px]:text-base min-[1181px]:leading-6 min-[1181px]:tracking-[-0.011em]">
                      {subtitle}
                    </p>
                  )}
                </div>
              </div>

              {error && (
                <div
                  role="alert"
                  className="flex w-full items-start gap-2.5 rounded-xl border border-red-400/30 bg-red-500/10 p-3 text-xs leading-relaxed text-red-400"
                >
                  <AlertCircle className="mt-0.5 size-4 shrink-0" />
                  <p className="font-medium">{error}</p>
                </div>
              )}

              {children}
            </div>
          </div>

          {/* Footer */}
          <footer className="relative flex shrink-0 items-center gap-3 border-t border-[var(--border)] px-6 py-5 max-[359px]:px-3 min-[1181px]:absolute min-[1181px]:bottom-8 min-[1181px]:left-8 min-[1181px]:right-8 min-[1181px]:border-t-0 min-[1181px]:p-0">
            <p className="min-w-0 flex-1 text-sm font-normal leading-5 tracking-[-0.006em] text-[var(--muted)]">
              © 2026 ZicDeck
            </p>
            <button
              className="flex shrink-0 items-center gap-1.5 rounded-md text-sm font-normal leading-5 tracking-[-0.006em] text-[var(--muted)] transition-colors hover:text-[var(--ink)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#335cff] cursor-pointer"
              type="button"
              onClick={toggleTheme}
              aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} theme`}
              title={`Switch to ${theme === "dark" ? "light" : "dark"} theme`}
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
              <span>{theme === "dark" ? "Light" : "Dark"}</span>
            </button>
          </footer>
        </section>

        {/* Right Aside Region */}
        <aside
          className="absolute left-[65.277778%] top-1/2 z-[2] hidden w-[28.055556%] -translate-y-1/2 flex-col items-start gap-8 min-[1181px]:flex"
          role="region"
          aria-label="How ZicDeck works"
        >
          <p className="text-2xl font-medium leading-8 text-white">
            From rough ideas to presentation-ready work.
          </p>
          <ol className="flex w-full flex-col gap-5 text-white">
            <li className="flex items-baseline gap-3">
              <span className="text-sm font-medium text-white/60">01</span>
              <span className="text-base leading-6">Shape a clear story with AI.</span>
            </li>
            <li className="flex items-baseline gap-3">
              <span className="text-sm font-medium text-white/60">02</span>
              <span className="text-base leading-6">Refine slides without breaking your brand.</span>
            </li>
            <li className="flex items-baseline gap-3">
              <span className="text-sm font-medium text-white/60">03</span>
              <span className="text-base leading-6">Deliver polished work with confidence.</span>
            </li>
          </ol>
        </aside>

        {/* Top-Right SVG Background Shape */}
        <div
          className="pointer-events-none absolute right-0 top-0 hidden aspect-square w-[41.388889%] min-[1181px]:block"
          aria-hidden="true"
        >
          <Image
            src="/authpage-bg.svg"
            alt=""
            width={500}
            height={500}
            priority
            className="size-full object-contain object-right-top opacity-80"
          />
        </div>
      </div>
    </main>
  );
}
