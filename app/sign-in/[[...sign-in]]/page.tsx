"use client";

import React, { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useSignIn, useAuth } from "@clerk/nextjs";
import { Mail, Loader2, ShieldCheck } from "lucide-react";
import { AuthCard } from "@/components/auth/AuthCard";
import { OAuthButtons } from "@/components/auth/OAuthButtons";
import { AuthDivider } from "@/components/auth/AuthDivider";
import { PasswordInput } from "@/components/auth/PasswordInput";
import { OtpInput } from "@/components/auth/OtpInput";
import { getAuthErrorMessage } from "@/lib/auth-errors";

type SignInMode = "sign-in" | "forgot-password-request" | "forgot-password-submit" | "second-factor";

function SignInContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { isSignedIn } = useAuth();
  const { isLoaded, signIn, setActive } = useSignIn();

  const redirectUrl =
    searchParams.get("redirect_url") ||
    searchParams.get("redirectUrl") ||
    searchParams.get("next") ||
    "/server";

  const [mode, setMode] = useState<SignInMode>("sign-in");
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [oauthLoading, setOauthLoading] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Forgot password states
  const [resetEmail, setResetEmail] = useState("");
  const [resetCode, setResetCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // 2FA state
  const [secondFactorCode, setSecondFactorCode] = useState("");

  // If already signed in, redirect
  React.useEffect(() => {
    if (isSignedIn) {
      router.replace(redirectUrl);
    }
  }, [isSignedIn, redirectUrl, router]);

  // Handle Standard Sign-in
  const handleSignIn = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!isLoaded || !signIn) return;

    if (!identifier.trim()) {
      setError("Please enter your email or username.");
      return;
    }

    if (!password) {
      setError("Please enter your password.");
      return;
    }

    setError(null);
    setLoading(true);

    try {
      const result = await signIn.create({
        identifier: identifier.trim(),
        password,
      });

      if (result.status === "complete") {
        await setActive({ session: result.createdSessionId });
        router.push(redirectUrl);
      } else if (result.status === "needs_second_factor") {
        setMode("second-factor");
      } else if (result.status === "needs_first_factor") {
        setError("Additional verification required. Please try another sign-in method.");
      } else {
        setError("Sign in could not be completed. Please try again.");
      }
    } catch (err) {
      setError(getAuthErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  // Handle OAuth Sign-in
  const handleOAuth = async (strategy: "oauth_google" | "oauth_linkedin_oidc") => {
    if (!isLoaded || !signIn) return;
    setError(null);
    setOauthLoading(strategy);

    try {
      await signIn.authenticateWithRedirect({
        strategy,
        redirectUrl: "/sso-callback",
        redirectUrlComplete: redirectUrl,
      });
    } catch (err) {
      setError(getAuthErrorMessage(err));
      setOauthLoading(null);
    }
  };

  // Step 1: Send Password Reset Code
  const handleRequestPasswordReset = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!isLoaded || !signIn) return;

    const emailToUse = resetEmail.trim() || identifier.trim();
    if (!emailToUse) {
      setError("Please enter your email address.");
      return;
    }

    setError(null);
    setLoading(true);

    try {
      await signIn.create({
        strategy: "reset_password_email_code",
        identifier: emailToUse,
      });
      setResetEmail(emailToUse);
      setMode("forgot-password-submit");
    } catch (err) {
      setError(getAuthErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Submit Reset Code & Set New Password
  const handleResetPasswordSubmit = async (e?: React.FormEvent<HTMLFormElement>) => {
    if (e) e.preventDefault();
    if (!isLoaded || !signIn) return;

    if (!resetCode.trim()) {
      setError("Please enter the 6-digit reset code.");
      return;
    }

    if (newPassword.length < 8) {
      setError("Password must be at least 8 characters long.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setError(null);
    setLoading(true);

    try {
      const result = await signIn.attemptFirstFactor({
        strategy: "reset_password_email_code",
        code: resetCode.trim(),
        password: newPassword,
      });

      if (result.status === "complete") {
        await setActive({ session: result.createdSessionId });
        router.push(redirectUrl);
      } else {
        setError("Password reset incomplete. Please try again.");
      }
    } catch (err) {
      setError(getAuthErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  // Handle 2FA verification
  const handleSecondFactorSubmit = async (codeToSubmit?: string) => {
    const code = codeToSubmit || secondFactorCode;
    if (!isLoaded || !signIn || !code) return;

    setError(null);
    setLoading(true);

    try {
      const result = await signIn.attemptSecondFactor({
        strategy: "totp",
        code: code.trim(),
      });

      if (result.status === "complete") {
        await setActive({ session: result.createdSessionId });
        router.push(redirectUrl);
      } else {
        setError("2FA verification could not be completed.");
      }
    } catch (err) {
      setError(getAuthErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  // Render 2FA View
  if (mode === "second-factor") {
    return (
      <AuthCard
        title="Two-step verification"
        subtitle="Enter the 6-digit code from your authenticator app"
        error={error}
        headerRight={
          <button
            type="button"
            onClick={() => {
              setMode("sign-in");
              setError(null);
            }}
            className="inline-flex items-center justify-center rounded-lg bg-[var(--accent-soft)] px-3.5 py-1.5 font-display text-xs sm:text-[13px] font-medium text-[var(--accent)] transition-all hover:opacity-90 active:scale-95 cursor-pointer"
          >
            Login
          </button>
        }
      >
        <div className="space-y-6">
          <div className="flex justify-center py-2">
            <div className="flex size-14 items-center justify-center rounded-2xl border border-[var(--border)] bg-[var(--paper)] text-[var(--accent)] shadow-2xs">
              <ShieldCheck className="size-7" />
            </div>
          </div>

          <OtpInput
            value={secondFactorCode}
            onChange={(val) => {
              setSecondFactorCode(val);
              setError(null);
            }}
            onComplete={(code) => handleSecondFactorSubmit(code)}
            disabled={loading}
            error={Boolean(error)}
          />

          <button
            type="button"
            disabled={loading || secondFactorCode.length < 6}
            onClick={() => handleSecondFactorSubmit()}
            className="flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-[#2F5EFF] px-4 text-sm font-medium text-white shadow-xs transition-all hover:bg-[#254ecc] active:scale-[0.99] disabled:pointer-events-none disabled:opacity-50 cursor-pointer"
          >
            {loading && <Loader2 className="size-4 animate-spin" />}
            {loading ? "Verifying..." : "Verify code"}
          </button>
        </div>
      </AuthCard>
    );
  }

  // Render Forgot Password Request View
  if (mode === "forgot-password-request") {
    return (
      <AuthCard
        title="Reset your password"
        subtitle="Enter the email associated with your account and we'll send a reset code."
        error={error}
        headerRight={
          <button
            type="button"
            onClick={() => {
              setMode("sign-in");
              setError(null);
            }}
            className="inline-flex items-center justify-center rounded-lg bg-[var(--accent-soft)] px-3.5 py-1.5 font-display text-xs sm:text-[13px] font-medium text-[var(--accent)] transition-all hover:opacity-90 active:scale-95 cursor-pointer"
          >
            Login
          </button>
        }
      >
        <form onSubmit={handleRequestPasswordReset} className="space-y-4">
          <div className="space-y-1.5">
            <label htmlFor="reset-email" className="block text-xs font-medium text-[var(--ink)]">
              Email address
            </label>
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-[var(--muted)]">
                <Mail className="size-4" />
              </div>
              <input
                id="reset-email"
                type="email"
                required
                autoComplete="email"
                placeholder="you@company.com"
                value={resetEmail || identifier}
                onChange={(e) => {
                  setResetEmail(e.target.value);
                  setError(null);
                }}
                className="w-full rounded-lg border border-[var(--border)] bg-[var(--paper)] py-2.5 pl-9 pr-3 text-xs sm:text-sm text-[var(--ink)] placeholder:text-[var(--muted)] transition-colors focus:border-[var(--accent)] focus:bg-[var(--surface)] focus:outline-none focus:ring-1 focus:ring-[var(--accent)]"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-[#2F5EFF] px-4 text-sm font-medium text-white shadow-xs transition-all hover:bg-[#254ecc] active:scale-[0.99] disabled:pointer-events-none disabled:opacity-50 cursor-pointer"
          >
            {loading && <Loader2 className="size-4 animate-spin" />}
            {loading ? "Sending reset code..." : "Send reset code"}
          </button>
        </form>
      </AuthCard>
    );
  }

  // Render Forgot Password Submit View
  if (mode === "forgot-password-submit") {
    return (
      <AuthCard
        title="Choose a new password"
        subtitle={`Enter the 6-digit code sent to ${resetEmail || "your email"}, then set a new workspace password.`}
        error={error}
        headerRight={
          <button
            type="button"
            onClick={() => {
              setMode("sign-in");
              setError(null);
            }}
            className="inline-flex items-center justify-center rounded-lg bg-[var(--accent-soft)] px-3.5 py-1.5 font-display text-xs sm:text-[13px] font-medium text-[var(--accent)] transition-all hover:opacity-90 active:scale-95 cursor-pointer"
          >
            Login
          </button>
        }
      >
        <form onSubmit={handleResetPasswordSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="block text-xs font-medium text-[var(--ink)] text-center mb-1">
              Verification code
            </label>
            <OtpInput
              value={resetCode}
              onChange={(val) => {
                setResetCode(val);
                setError(null);
              }}
              disabled={loading}
              error={Boolean(error)}
            />
          </div>

          <PasswordInput
            id="new-password"
            label="New password"
            placeholder="At least 8 characters"
            autoComplete="new-password"
            value={newPassword}
            onChange={(e) => {
              setNewPassword(e.target.value);
              setError(null);
            }}
            showStrength
          />

          <PasswordInput
            id="confirm-password"
            label="Confirm new password"
            placeholder="Re-enter new password"
            autoComplete="new-password"
            value={confirmPassword}
            onChange={(e) => {
              setConfirmPassword(e.target.value);
              setError(null);
            }}
          />

          <button
            type="submit"
            disabled={loading}
            className="flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-[#2F5EFF] px-4 text-sm font-medium text-white shadow-xs transition-all hover:bg-[#254ecc] active:scale-[0.99] disabled:pointer-events-none disabled:opacity-50 cursor-pointer"
          >
            {loading && <Loader2 className="size-4 animate-spin" />}
            {loading ? "Resetting password..." : "Reset password & sign in"}
          </button>
        </form>
      </AuthCard>
    );
  }

  // Standard Sign-in View
  return (
    <AuthCard
      title="Welcome back"
      subtitle="Pick up exactly where your presentation work left off."
      error={error}
      headerRight={
        <div className="flex items-center gap-2 font-display text-xs sm:text-[13px]">
          <span className="text-[var(--muted)]">Don&apos;t have an account?</span>
          <Link
            href={`/sign-up${searchParams.toString() ? `?${searchParams.toString()}` : ""}`}
            className="inline-flex items-center justify-center rounded-lg bg-[var(--accent-soft)] px-3.5 py-1.5 font-display font-medium text-[var(--accent)] transition-all hover:opacity-90 active:scale-95"
          >
            Sign up
          </Link>
        </div>
      }
    >
      <div className="space-y-5">
        <OAuthButtons
          onOAuthClick={handleOAuth}
          loadingStrategy={oauthLoading}
          disabled={loading || !isLoaded}
        />

        <AuthDivider label="or continue with email" />

        <form onSubmit={handleSignIn} className="space-y-4">
          <div className="space-y-1.5">
            <label
              htmlFor="identifier"
              className="block text-xs font-medium text-[var(--ink)]"
            >
              Email or Username
            </label>
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-[var(--muted)]">
                <Mail className="size-4" />
              </div>
              <input
                id="identifier"
                type="text"
                required
                autoComplete="username"
                placeholder="you@company.com"
                value={identifier}
                onChange={(e) => {
                  setIdentifier(e.target.value);
                  setError(null);
                }}
                disabled={loading}
                className="w-full rounded-lg border border-[var(--border)] bg-[var(--paper)] py-2.5 pl-9 pr-3 text-xs sm:text-sm text-[var(--ink)] placeholder:text-[var(--muted)] transition-colors focus:border-[var(--accent)] focus:bg-[var(--surface)] focus:outline-none focus:ring-1 focus:ring-[var(--accent)] disabled:opacity-60"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label
                htmlFor="password"
                className="block text-xs font-medium text-[var(--ink)]"
              >
                Password
              </label>
              <button
                type="button"
                onClick={() => {
                  setResetEmail(identifier);
                  setMode("forgot-password-request");
                  setError(null);
                }}
                className="text-[11px] font-medium text-[var(--accent)] hover:underline cursor-pointer"
              >
                Forgot password?
              </button>
            </div>
            <PasswordInput
              id="password"
              label=""
              placeholder="••••••••"
              autoComplete="current-password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError(null);
              }}
              disabled={loading}
            />
          </div>

          <button
            type="submit"
            disabled={loading || !isLoaded}
            className="flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-[#2F5EFF] px-4 text-sm font-medium text-white shadow-xs transition-all hover:bg-[#254ecc] active:scale-[0.99] disabled:pointer-events-none disabled:opacity-50 cursor-pointer"
          >
            {loading && <Loader2 className="size-4 animate-spin" />}
            {loading ? "Signing in..." : "Sign in"}
          </button>
        </form>
      </div>
    </AuthCard>
  );
}

export default function SignInPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-[var(--paper)]">
          <Loader2 className="size-6 animate-spin text-[var(--accent)]" />
        </div>
      }
    >
      <SignInContent />
    </Suspense>
  );
}
