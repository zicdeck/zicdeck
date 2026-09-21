import { AuthenticateWithRedirectCallback } from "@clerk/nextjs";
import Image from "next/image";
import { AuthBackgroundCubes } from "@/components/auth/AuthBackgroundCubes";

export default function SSOCallbackPage() {
  return (
    <div className="relative min-h-screen flex flex-col justify-center items-center px-4 bg-[#FAFAF8] overflow-hidden selection:bg-[var(--accent-soft)] selection:text-[var(--accent)]">
      {/* 1. Floating Isometric Gray Cubes */}
      <AuthBackgroundCubes />

      {/* 2. Subtle Modern Grid Background */}
      <div
        className="pointer-events-none absolute inset-0 -z-10 [background-image:linear-gradient(to_right,#E7E6E0_1px,transparent_1px),linear-gradient(to_bottom,#E7E6E0_1px,transparent_1px)] [background-size:36px_36px] opacity-40 [mask-image:radial-gradient(ellipse_75%_65%_at_50%_45%,#000_35%,transparent_90%)]"
        aria-hidden="true"
      />

      {/* 3. Ambient Light Flares */}
      <div
        className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[580px] h-[340px] bg-[radial-gradient(ellipse_at_center,rgba(47,94,255,0.11),transparent_65%)] blur-3xl -z-10"
        aria-hidden="true"
      />

      <div className="relative z-10 flex w-full max-w-[400px] flex-col items-center gap-4 rounded-2xl border border-[#E5E4DF] bg-white p-8 text-center shadow-[0_8px_30px_rgb(0,0,0,0.04),0_1px_2px_rgb(0,0,0,0.02)] animate-scale-in">
        <div className="flex size-12 items-center justify-center rounded-2xl border border-[var(--border)] bg-[#FAFAF8] shadow-2xs">
          <Image
            src="/logo.svg"
            alt="ZicDeck"
            width={24}
            height={24}
            className="opacity-90 animate-pulse"
          />
        </div>
        <div className="space-y-1.5">
          <h2 className="font-display text-lg font-semibold tracking-tight text-[var(--ink)]">
            Authenticating with provider...
          </h2>
          <p className="text-xs text-[var(--muted)] leading-relaxed">
            Please wait while we complete your secure login.
          </p>
        </div>
        <div className="pt-2">
          <AuthenticateWithRedirectCallback />
        </div>
      </div>
    </div>
  );
}
