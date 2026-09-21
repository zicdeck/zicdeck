"use client";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useSignUp, useAuth } from "@clerk/nextjs";
import { Mail, User, ArrowLeft, Loader2, MailCheck, CheckCircle2 } from "lucide-react";
import { AuthCard } from "@/components/auth/AuthCard";
import { OAuthButtons } from "@/components/auth/OAuthButtons";
import { AuthDivider } from "@/components/auth/AuthDivider";
import { PasswordInput } from "@/components/auth/PasswordInput";
import { OtpInput } from "@/components/auth/OtpInput";
import { getAuthErrorMessage } from "@/lib/auth-errors";

function SignUpContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { isSignedIn } = useAuth();
  const { isLoaded, signUp, setActive } = useSignUp();

  const redirectUrl =
    searchParams.get("redirect_url") ||
    searchParams.get("redirectUrl") ||
    searchParams.get("next") ||
    "/server";

  // Form states
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [oauthLoading, setOauthLoading] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Verification states
  const [isVerifying, setIsVerifying] = useState(false);
  const [code, setCode] = useState("");
  const [resendCooldown, setResendCooldown] = useState(0);
  const [resendSuccess, setResendSuccess] = useState(false);
  const [isResending, setIsResending] = useState(false);

  // If already signed in, redirect
  useEffect(() => {
    if (isSignedIn) {
      router.replace(redirectUrl);
    }
  }, [isSignedIn, redirectUrl, router]);

  // Resend cooldown timer
  useEffect(() => {
    if (resendCooldown <= 0) return;
    const timer = setInterval(() => {
      setResendCooldown((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [resendCooldown]);

  // Handle Sign Up Form Submit
  const handleSignUp = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!isLoaded || !signUp) return;

    if (!email.trim()) {
      setError("Please enter your email address.");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters long.");
      return;
    }

    setError(null);
    setLoading(true);

    try {
      const result = await signUp.create({
        emailAddress: email.trim(),
        password,
        firstName: firstName.trim() || undefined,
        lastName: lastName.trim() || undefined,
      });

      if (result.status === "complete") {
        await setActive({ session: result.createdSessionId });
        router.push(redirectUrl);
        return;
      }

      // Send email verification code
      await signUp.prepareEmailAddressVerification({ strategy: "email_code" });
      setIsVerifying(true);
      setResendCooldown(60);
    } catch (err) {
      setError(getAuthErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  // Handle Verification Code Submit
  const handleVerify = async (codeToSubmit?: string) => {
    const verificationCode = codeToSubmit || code;
    if (!isLoaded || !signUp || !verificationCode) return;

    if (verificationCode.trim().length < 6) {
      setError("Please enter the complete 6-digit verification code.");
      return;
    }

    setError(null);
    setLoading(true);

    try {
      const completeSignUp = await signUp.attemptEmailAddressVerification({
        code: verificationCode.trim(),
      });

      if (completeSignUp.status === "complete") {
        await setActive({ session: completeSignUp.createdSessionId });
        router.push(redirectUrl);
      } else {
        setError("Verification incomplete. Please check the code and try again.");
      }
    } catch (err) {
      setError(getAuthErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  // Resend Verification Code
  const handleResendCode = async () => {
    if (!isLoaded || !signUp || resendCooldown > 0 || isResending) return;

    setError(null);
    setIsResending(true);
    setResendSuccess(false);

    try {
      await signUp.prepareEmailAddressVerification({ strategy: "email_code" });
      setResendCooldown(60);
      setResendSuccess(true);
      setTimeout(() => setResendSuccess(false), 5000);
    } catch (err) {
      setError(getAuthErrorMessage(err));
    } finally {
      setIsResending(false);
    }
  };

  // Handle OAuth Sign-up
  const handleOAuth = async (strategy: "oauth_google" | "oauth_linkedin_oidc") => {
    if (!isLoaded || !signUp) return;
    setError(null);
    setOauthLoading(strategy);

    try {
      await signUp.authenticateWithRedirect({
        strategy,
        redirectUrl: "/sso-callback",
        redirectUrlComplete: redirectUrl,
      });
    } catch (err) {
      setError(getAuthErrorMessage(err));
      setOauthLoading(null);
    }
  };

  // Verification Screen
  if (isVerifying) {
    return (
      <AuthCard
        title="Check your inbox"
        subtitle={`Enter the 6-digit code we sent to ${email} to activate your ZicDeck workspace.`}
        error={error}
        headerRight={
          <div className="flex items-center gap-2 font-display text-xs sm:text-[13px]">
            <span className="text-[var(--muted)]">Already have an account?</span>
            <Link
              href={`/sign-in${searchParams.toString() ? `?${searchParams.toString()}` : ""}`}
              className="inline-flex items-center justify-center rounded-lg bg-[var(--accent-soft)] px-3.5 py-1.5 font-display font-medium text-[var(--accent)] transition-all hover:opacity-90 active:scale-95"
            >
              Login
            </Link>
          </div>
        }
      >
        <div className="space-y-6">
          <div className="flex justify-center py-1">
            <div className="flex size-14 items-center justify-center rounded-2xl border border-[var(--border)] bg-[var(--paper)] text-[var(--accent)] shadow-2xs">
              <MailCheck className="size-7" />
            </div>
          </div>

          {resendSuccess && (
            <div className="flex items-center justify-center gap-1.5 text-xs font-medium text-emerald-600 bg-emerald-50 border border-emerald-200/80 rounded-lg p-2.5">
              <CheckCircle2 className="size-4 shrink-0" />
              <span>A new verification code has been sent.</span>
            </div>
          )}

          <div className="space-y-2">
            <label className="block text-xs font-medium text-[var(--ink)] text-center">
              Enter verification code
            </label>
            <OtpInput
              value={code}
              onChange={(val) => {
                setCode(val);
                setError(null);
              }}
              onComplete={(completedCode) => handleVerify(completedCode)}
              disabled={loading}
              error={Boolean(error)}
            />
          </div>

          <button
            type="button"
            disabled={loading || code.length < 6}
            onClick={() => handleVerify()}
            className="flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-[#2F5EFF] px-4 text-sm font-medium text-white shadow-xs transition-all hover:bg-[#254ecc] active:scale-[0.99] disabled:pointer-events-none disabled:opacity-50 cursor-pointer"
          >
            {loading && <Loader2 className="size-4 animate-spin" />}
            {loading ? "Verifying..." : "Verify & continue"}
          </button>

          <div className="text-center pt-1 space-y-3">
            <p className="text-xs text-[var(--muted)]">
              Didn&apos;t receive the code?{" "}
              {resendCooldown > 0 ? (
                <span className="text-[var(--muted)] font-medium">
                  Resend in {resendCooldown}s
                </span>
              ) : (
                <button
                  type="button"
                  onClick={handleResendCode}
                  disabled={isResending}
                  className="font-semibold text-[var(--accent)] hover:underline cursor-pointer disabled:opacity-50"
                >
                  {isResending ? "Resending..." : "Resend code"}
                </button>
              )}
            </p>

            <div>
              <button
                type="button"
                onClick={() => {
                  setIsVerifying(false);
                  setError(null);
                  setCode("");
                }}
                className="inline-flex items-center gap-1.5 text-xs text-[var(--muted)] hover:text-[var(--ink)] transition-colors cursor-pointer"
              >
                <ArrowLeft className="size-3.5" /> Back to edit email
              </button>
            </div>
          </div>
        </div>
      </AuthCard>
    );
  }

  // Standard Sign-up Form Screen
  return (
    <AuthCard
      title="Build your next great deck"
      subtitle="Create a workspace for sharper stories and polished presentations."
      error={error}
      headerRight={
        <div className="flex items-center gap-2 font-display text-xs sm:text-[13px]">
          <span className="text-[var(--muted)]">Already have an account?</span>
          <Link
            href={`/sign-in${searchParams.toString() ? `?${searchParams.toString()}` : ""}`}
            className="inline-flex items-center justify-center rounded-lg bg-[var(--accent-soft)] px-3.5 py-1.5 font-display font-medium text-[var(--accent)] transition-all hover:opacity-90 active:scale-95"
          >
            Login
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

        <form onSubmit={handleSignUp} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label
                htmlFor="firstName"
                className="block text-xs font-medium text-[var(--ink)]"
              >
                First name
              </label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-[var(--muted)]">
                  <User className="size-4" />
                </div>
                <input
                  id="firstName"
                  type="text"
                  autoComplete="given-name"
                  placeholder="Sarah"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  disabled={loading}
                  className="w-full rounded-lg border border-[var(--border)] bg-[var(--paper)] py-2.5 pl-9 pr-3 text-xs sm:text-sm text-[var(--ink)] placeholder:text-[var(--muted)] transition-colors focus:border-[var(--accent)] focus:bg-[var(--surface)] focus:outline-none focus:ring-1 focus:ring-[var(--accent)] disabled:opacity-60"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label
                htmlFor="lastName"
                className="block text-xs font-medium text-[var(--ink)]"
              >
                Last name
              </label>
              <input
                id="lastName"
                type="text"
                autoComplete="family-name"
                placeholder="Connor"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                disabled={loading}
                className="w-full rounded-lg border border-[var(--border)] bg-[var(--paper)] py-2.5 px-3 text-xs sm:text-sm text-[var(--ink)] placeholder:text-[var(--muted)] transition-colors focus:border-[var(--accent)] focus:bg-[var(--surface)] focus:outline-none focus:ring-1 focus:ring-[var(--accent)] disabled:opacity-60"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label
              htmlFor="email"
              className="block text-xs font-medium text-[var(--ink)]"
            >
              Work Email
            </label>
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-[var(--muted)]">
                <Mail className="size-4" />
              </div>
              <input
                id="email"
                type="email"
                required
                autoComplete="email"
                placeholder="name@company.com"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setError(null);
                }}
                disabled={loading}
                className="w-full rounded-lg border border-[var(--border)] bg-[var(--paper)] py-2.5 pl-9 pr-3 text-xs sm:text-sm text-[var(--ink)] placeholder:text-[var(--muted)] transition-colors focus:border-[var(--accent)] focus:bg-[var(--surface)] focus:outline-none focus:ring-1 focus:ring-[var(--accent)] disabled:opacity-60"
              />
            </div>
          </div>

          <PasswordInput
            id="password"
            label="Password"
            placeholder="Create a strong password"
            autoComplete="new-password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              setError(null);
            }}
            disabled={loading}
            showStrength
          />

          <button
            type="submit"
            disabled={loading || !isLoaded}
            className="flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-[#2F5EFF] px-4 text-sm font-medium text-white shadow-xs transition-all hover:bg-[#254ecc] active:scale-[0.99] disabled:pointer-events-none disabled:opacity-50 cursor-pointer"
          >
            {loading && <Loader2 className="size-4 animate-spin" />}
            {loading ? "Creating account..." : "Create account"}
          </button>
        </form>

        <p className="text-center text-[11px] text-[var(--muted)] leading-relaxed">
          By signing up, you agree to our{" "}
          <span className="underline cursor-pointer hover:text-[var(--ink)]">Terms of Service</span> and{" "}
          <span className="underline cursor-pointer hover:text-[var(--ink)]">Privacy Policy</span>.
        </p>
      </div>
    </AuthCard>
  );
}

export default function SignUpPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-[var(--paper)]">
          <Loader2 className="size-6 animate-spin text-[var(--accent)]" />
        </div>
      }
    >
      <SignUpContent />
    </Suspense>
  );
}
