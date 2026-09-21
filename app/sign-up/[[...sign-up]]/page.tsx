"use client";

import React, { useState, useEffect, Suspense } from "react";
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
    "/workspace/new-task";

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
        headerText="Already have an account?"
        headerActionLabel="Login"
        headerHref={`/sign-in${searchParams.toString() ? `?${searchParams.toString()}` : ""}`}
      >
        <div className="flex w-full flex-col gap-6">
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
            className="flex h-10 w-full items-center justify-center overflow-hidden rounded-[10px] border border-white/10 bg-[#335cff] text-sm font-medium leading-5 tracking-[-0.006em] shadow-[inset_0_1px_0_rgba(255,255,255,0.16),0_1px_2px_rgba(14,18,27,0.18),0_0_0_1px_#335cff] transition-colors hover:bg-[#2547d8] text-white active:bg-[#2547d8] disabled:cursor-not-allowed disabled:opacity-70 cursor-pointer"
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
      title="Create a new account"
      subtitle="Enter your details to get started with ZicDeck."
      error={error}
      headerText="Already have an account?"
      headerActionLabel="Login"
      headerHref={`/sign-in${searchParams.toString() ? `?${searchParams.toString()}` : ""}`}
    >
      <div className="flex w-full flex-col gap-6">
        <OAuthButtons
          onOAuthClick={handleOAuth}
          loadingStrategy={oauthLoading}
          disabled={loading || !isLoaded}
        />

        <AuthDivider label="OR" />

        <form onSubmit={handleSignUp} className="flex w-full flex-col gap-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <label className="flex w-full flex-col items-start gap-1">
              <span className="flex items-center text-sm font-medium leading-5 tracking-[-0.006em] text-[var(--ink)]">
                First Name<span className="ml-1 text-[#335cff]">*</span>
              </span>
              <span className="flex h-10 w-full items-center gap-2 overflow-hidden rounded-[10px] border border-[var(--border)] bg-[var(--paper)] pl-3 pr-[10px] shadow-[0_1px_2px_rgba(10,13,20,0.03)] focus-within:border-[#335cff]">
                <User className="size-4 text-[var(--muted)] shrink-0" />
                <input
                  id="firstName"
                  type="text"
                  autoComplete="given-name"
                  placeholder="Sarah"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  disabled={loading}
                  className="min-w-0 flex-1 border-0 bg-transparent p-0 text-sm font-normal leading-5 tracking-[-0.006em] text-[var(--ink)] outline-none placeholder:text-[var(--muted)]"
                />
              </span>
            </label>

            <label className="flex w-full flex-col items-start gap-1">
              <span className="flex items-center text-sm font-medium leading-5 tracking-[-0.006em] text-[var(--ink)]">
                Last Name
              </span>
              <span className="flex h-10 w-full items-center gap-2 overflow-hidden rounded-[10px] border border-[var(--border)] bg-[var(--paper)] px-3 shadow-[0_1px_2px_rgba(10,13,20,0.03)] focus-within:border-[#335cff]">
                <input
                  id="lastName"
                  type="text"
                  autoComplete="family-name"
                  placeholder="Connor"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  disabled={loading}
                  className="min-w-0 flex-1 border-0 bg-transparent p-0 text-sm font-normal leading-5 tracking-[-0.006em] text-[var(--ink)] outline-none placeholder:text-[var(--muted)]"
                />
              </span>
            </label>
          </div>

          <label className="flex w-full flex-col items-start gap-1">
            <span className="flex items-center text-sm font-medium leading-5 tracking-[-0.006em] text-[var(--ink)]">
              Email Address<span className="ml-1 text-[#335cff]">*</span>
            </span>
            <span className="flex h-10 w-full items-center gap-2 overflow-hidden rounded-[10px] border border-[var(--border)] bg-[var(--paper)] pl-3 pr-[10px] shadow-[0_1px_2px_rgba(10,13,20,0.03)] focus-within:border-[#335cff]">
              <Mail className="size-4 text-[var(--muted)] shrink-0" />
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
                className="min-w-0 flex-1 border-0 bg-transparent p-0 text-sm font-normal leading-5 tracking-[-0.006em] text-[var(--ink)] outline-none placeholder:text-[var(--muted)]"
              />
            </span>
          </label>

          <div className="w-full space-y-1">
            <span className="flex items-center text-sm font-medium leading-5 tracking-[-0.006em] text-[var(--ink)]">
              Password<span className="ml-1 text-[#335cff]">*</span>
            </span>
            <PasswordInput
              id="password"
              label=""
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
          </div>

          {/* Clerk Smart CAPTCHA Widget Mounting Container */}
          <div id="clerk-captcha" className="empty:hidden" />

          <button
            type="submit"
            disabled={loading || !isLoaded}
            className="mt-2 flex h-10 w-full items-center justify-center overflow-hidden rounded-[10px] border border-white/10 bg-[#335cff] text-sm font-medium leading-5 tracking-[-0.006em] shadow-[inset_0_1px_0_rgba(255,255,255,0.16),0_1px_2px_rgba(14,18,27,0.18),0_0_0_1px_#335cff] transition-colors hover:bg-[#2547d8] text-white active:bg-[#2547d8] disabled:cursor-not-allowed disabled:opacity-70 cursor-pointer"
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
