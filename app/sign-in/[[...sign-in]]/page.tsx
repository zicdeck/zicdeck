"use client";

import React, { useState, Suspense } from "react";
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
        headerText="Need to log in again?"
        headerActionLabel="Back"
        onHeaderActionClick={() => {
          setMode("sign-in");
          setError(null);
        }}
      >
        <div className="flex w-full flex-col gap-6">
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
            className="flex h-10 w-full items-center justify-center overflow-hidden rounded-[10px] border border-white/10 bg-[#335cff] text-sm font-medium leading-5 tracking-[-0.006em] shadow-[inset_0_1px_0_rgba(255,255,255,0.16),0_1px_2px_rgba(14,18,27,0.18),0_0_0_1px_#335cff] transition-colors hover:bg-[#2547d8] text-white active:bg-[#2547d8] disabled:cursor-not-allowed disabled:opacity-70 cursor-pointer"
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
        headerText="Remember your password?"
        headerActionLabel="Login"
        onHeaderActionClick={() => {
          setMode("sign-in");
          setError(null);
        }}
      >
        <form onSubmit={handleRequestPasswordReset} className="flex w-full flex-col gap-4">
          <div className="space-y-1.5">
            <label htmlFor="reset-email" className="block text-sm font-medium text-[var(--ink)]">
              Email Address
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
                className="w-full rounded-[10px] border border-[var(--border)] bg-[var(--paper)] py-2.5 pl-9 pr-3 text-sm text-[var(--ink)] placeholder:text-[var(--muted)] transition-colors focus:border-[var(--accent)] focus:bg-[var(--surface)] focus:outline-none focus:ring-1 focus:ring-[var(--accent)] shadow-[0_1px_2px_rgba(10,13,20,0.03)]"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="flex h-10 w-full items-center justify-center overflow-hidden rounded-[10px] border border-white/10 bg-[#335cff] text-sm font-medium leading-5 tracking-[-0.006em] shadow-[inset_0_1px_0_rgba(255,255,255,0.16),0_1px_2px_rgba(14,18,27,0.18),0_0_0_1px_#335cff] transition-colors hover:bg-[#2547d8] text-white active:bg-[#2547d8] disabled:cursor-not-allowed disabled:opacity-70 cursor-pointer"
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
        headerText="Remember your password?"
        headerActionLabel="Login"
        onHeaderActionClick={() => {
          setMode("sign-in");
          setError(null);
        }}
      >
        <form onSubmit={handleResetPasswordSubmit} className="flex w-full flex-col gap-4">
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
            className="flex h-10 w-full items-center justify-center overflow-hidden rounded-[10px] border border-white/10 bg-[#335cff] text-sm font-medium leading-5 tracking-[-0.006em] shadow-[inset_0_1px_0_rgba(255,255,255,0.16),0_1px_2px_rgba(14,18,27,0.18),0_0_0_1px_#335cff] transition-colors hover:bg-[#2547d8] text-white active:bg-[#2547d8] disabled:cursor-not-allowed disabled:opacity-70 cursor-pointer"
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
      subtitle="Enter your credentials to access your workspace."
      error={error}
      headerText="Don't have an account?"
      headerActionLabel="Sign up"
      headerHref={`/sign-up${searchParams.toString() ? `?${searchParams.toString()}` : ""}`}
    >
      <div className="flex w-full flex-col gap-6">
        <OAuthButtons
          onOAuthClick={handleOAuth}
          loadingStrategy={oauthLoading}
          disabled={loading || !isLoaded}
        />

        <AuthDivider label="OR" />

        <form onSubmit={handleSignIn} className="flex w-full flex-col gap-3.5">
          <label className="flex w-full flex-col items-start gap-1">
            <span className="flex items-center text-sm font-medium leading-5 tracking-[-0.006em] text-[var(--ink)]">
              Email Address<span className="ml-1 text-[#335cff]">*</span>
            </span>
            <span className="flex h-10 w-full items-center gap-2 overflow-hidden rounded-[10px] border border-[var(--border)] bg-[var(--paper)] pl-3 pr-[10px] shadow-[0_1px_2px_rgba(10,13,20,0.03)] focus-within:border-[#335cff]">
              <Mail className="size-4 text-[var(--muted)] shrink-0" />
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
                className="min-w-0 flex-1 border-0 bg-transparent p-0 text-sm font-normal leading-5 tracking-[-0.006em] text-[var(--ink)] outline-none placeholder:text-[var(--muted)]"
              />
            </span>
          </label>

          <div className="w-full space-y-1">
            <div className="flex items-center justify-between">
              <span className="flex items-center text-sm font-medium leading-5 tracking-[-0.006em] text-[var(--ink)]">
                Password<span className="ml-1 text-[#335cff]">*</span>
              </span>
              <button
                type="button"
                onClick={() => {
                  setResetEmail(identifier);
                  setMode("forgot-password-request");
                  setError(null);
                }}
                className="text-xs font-medium text-[#335cff] hover:underline cursor-pointer"
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

          {/* Clerk Smart CAPTCHA Widget Mounting Container */}
          <div id="clerk-captcha" className="empty:hidden" />

          <button
            type="submit"
            disabled={loading || !isLoaded}
            className="mt-2 flex h-10 w-full items-center justify-center overflow-hidden rounded-[10px] border border-white/10 bg-[#335cff] text-sm font-medium leading-5 tracking-[-0.006em] shadow-[inset_0_1px_0_rgba(255,255,255,0.16),0_1px_2px_rgba(14,18,27,0.18),0_0_0_1px_#335cff] transition-colors hover:bg-[#2547d8] text-white active:bg-[#2547d8] disabled:cursor-not-allowed disabled:opacity-70 cursor-pointer"
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
