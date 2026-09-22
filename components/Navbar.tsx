"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { label: "Product", href: "#product" },
  { label: "Capabilities", href: "#capabilities" },
  { label: "Pricing", href: "#pricing" },
  { label: "FAQ", href: "#faq" },
];

export function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  const closeMenu = () => setMenuOpen(false);

  return (
    <>
      <header
        className={cn(
          "sticky top-0 z-50 border-b transition-all duration-300 animate-fade-in-down",
          isScrolled || menuOpen
            ? "border-[var(--border)] bg-white/85 backdrop-blur-md"
            : "border-transparent bg-transparent"
        )}
      >
        <div className="relative z-10 mx-auto flex h-16 max-w-6xl items-center justify-between px-5 sm:px-8">
          <Link href="/" className="font-display text-xl font-semibold tracking-[-0.04em]" onClick={closeMenu}>
            ZicDeck
          </Link>

          <nav className="hidden items-center gap-7 text-sm font-medium text-[var(--muted)] md:flex" aria-label="Primary navigation">
            {navItems.map((item) => (
              <a key={item.href} href={item.href} className="transition-colors hover:text-[var(--ink)]">
                {item.label}
              </a>
            ))}
          </nav>

          <div className="hidden items-center gap-3 md:flex">
            <SignedOut>
              <Link href="/sign-in" className="px-3 py-1.5 text-sm font-medium text-[var(--muted)] transition-colors hover:text-[var(--ink)]">
                Log in
              </Link>
              <Link href="/sign-up" className="inline-flex h-7.5 items-center rounded-full bg-[var(--accent)] px-3 text-xs font-medium text-white shadow-sm transition-colors hover:bg-[#254ecc]">
                Get started
              </Link>
            </SignedOut>
            <SignedIn>
              <Link href="/workspace/new-task" className="px-3 py-1.5 text-sm font-medium text-[var(--muted)] transition-colors hover:text-[var(--ink)]">
                Dashboard
              </Link>
              <UserButton appearance={{ elements: { userButtonAvatarBox: "h-8 w-8" } }} />
            </SignedIn>
          </div>

          <button
            type="button"
            className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-[var(--border)] bg-white/50 text-[var(--ink)] backdrop-blur-sm md:hidden"
            aria-label={menuOpen ? "Close navigation" : "Open navigation"}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((isOpen) => !isOpen)}
          >
            {menuOpen ? <X className="size-4" /> : <Menu className="size-4" />}
          </button>
        </div>
      </header>

      {/* Fullscreen Mobile Modal with smooth open and close animations */}
      <div
        className={cn(
          "fixed inset-0 z-40 flex min-h-dvh w-full items-center justify-center bg-paper/80 px-6 backdrop-blur-lg transition-all duration-[500ms] ease-[cubic-bezier(0.32,0.72,0,1)] md:hidden",
          menuOpen
            ? "pointer-events-auto opacity-100 visible"
            : "pointer-events-none opacity-0 invisible"
        )}
        onClick={closeMenu}
        aria-hidden={!menuOpen}
      >
        <nav
          className={cn(
            "flex w-full max-w-xs flex-col items-center justify-center text-center transition-all duration-[500ms] ease-[cubic-bezier(0.32,0.72,0,1)]",
            menuOpen
              ? "translate-y-0 opacity-100 scale-100"
              : "translate-y-8 opacity-0 scale-95"
          )}
          aria-label="Mobile navigation"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex flex-col items-center gap-6">
            {navItems.map((item, index) => (
              <a
                key={item.href}
                href={item.href}
                onClick={closeMenu}
                className={cn(
                  "font-display text-2xl font-medium tracking-tight text-[var(--ink)] transition-all duration-[500ms] ease-[cubic-bezier(0.32,0.72,0,1)] hover:text-[var(--accent)]",
                  menuOpen
                    ? "translate-y-0 opacity-100"
                    : "translate-y-4 opacity-0"
                )}
                style={{
                  transitionDelay: menuOpen ? `${(index + 1) * 60}ms` : "0ms",
                }}
              >
                {item.label}
              </a>
            ))}
          </div>

          <div
            className={cn(
              "mt-8 flex w-full flex-col items-center gap-3 pt-6 transition-all duration-[500ms] ease-[cubic-bezier(0.32,0.72,0,1)]",
              menuOpen
                ? "translate-y-0 opacity-100"
                : "translate-y-4 opacity-0"
            )}
            style={{
              transitionDelay: menuOpen ? `${(navItems.length + 1) * 60}ms` : "0ms",
            }}
          >
            <SignedOut>
              <Link
                href="/sign-in"
                onClick={closeMenu}
                className="inline-flex h-11 w-[85%] items-center justify-center rounded-full border border-[var(--border)] bg-white/80 text-sm font-medium text-[var(--ink)] shadow-sm transition-colors hover:bg-white"
              >
                Log in
              </Link>

              <Link
                href="/sign-up"
                onClick={closeMenu}
                className="inline-flex h-11 w-[85%] items-center justify-center rounded-full bg-[var(--accent)] text-sm font-medium text-white shadow-sm transition-colors hover:bg-[#254ecc]"
              >
                Get started
              </Link>
            </SignedOut>

            <SignedIn>
              <Link
                href="/workspace/new-task"
                onClick={closeMenu}
                className="inline-flex h-10 w-full items-center justify-center rounded-full bg-[var(--accent)] text-sm font-medium text-white shadow-sm transition-colors hover:bg-[#254ecc]"
              >
                Go to dashboard
              </Link>
            </SignedIn>
          </div>
        </nav>
      </div>
    </>
  );
}

export default Navbar;