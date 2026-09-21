"use client";

import React, { useState } from "react";
import { Lock, Eye, EyeOff } from "lucide-react";
import { cn } from "@/lib/utils";

export interface PasswordInputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type"> {
  label?: string;
  error?: string;
  showStrength?: boolean;
}

export function PasswordInput({
  label = "Password",
  error,
  showStrength = false,
  className,
  value,
  id = "password",
  ...props
}: PasswordInputProps) {
  const [showPassword, setShowPassword] = useState(false);
  const passwordStr = typeof value === "string" ? value : "";

  // Password requirements calculation
  const hasMinLength = passwordStr.length >= 8;
  const hasNumberOrSpecial = /[0-9!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(passwordStr);

  return (
    <div className="w-full space-y-1.5">
      <div className="flex items-center justify-between">
        {label && (
          <label
            htmlFor={id}
            className="block text-xs font-medium text-[var(--ink)]"
          >
            {label}
          </label>
        )}
      </div>

      <div className="relative">
        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-[var(--muted)]">
          <Lock className="size-4" />
        </div>
        <input
          id={id}
          type={showPassword ? "text" : "password"}
          value={value}
          className={cn(
            "w-full rounded-lg border border-[var(--border)] bg-[var(--paper)] py-2.5 pl-9 pr-10 text-xs sm:text-sm text-[var(--ink)] placeholder:text-[var(--muted)] transition-colors focus:border-[var(--accent)] focus:bg-[var(--surface)] focus:outline-none focus:ring-1 focus:ring-[var(--accent)]",
            error && "border-red-500 focus:border-red-500 focus:ring-red-500",
            className
          )}
          {...props}
        />
        <button
          type="button"
          tabIndex={-1}
          onClick={() => setShowPassword((prev) => !prev)}
          className="absolute inset-y-0 right-0 flex items-center pr-3 text-[var(--muted)] hover:text-[var(--ink)] transition-colors cursor-pointer"
          aria-label={showPassword ? "Hide password" : "Show password"}
        >
          {showPassword ? (
            <EyeOff className="size-4" />
          ) : (
            <Eye className="size-4" />
          )}
        </button>
      </div>

      {showStrength && passwordStr.length > 0 && (
        <div className="pt-1 text-[11px] space-y-1">
          <div className="flex items-center gap-1.5">
            <span
              className={cn(
                "inline-block size-1.5 rounded-full transition-colors",
                hasMinLength ? "bg-emerald-500" : "bg-zinc-300"
              )}
            />
            <span
              className={cn(
                "transition-colors",
                hasMinLength ? "text-emerald-700" : "text-[var(--muted)]"
              )}
            >
              At least 8 characters
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <span
              className={cn(
                "inline-block size-1.5 rounded-full transition-colors",
                hasNumberOrSpecial ? "bg-emerald-500" : "bg-zinc-300"
              )}
            />
            <span
              className={cn(
                "transition-colors",
                hasNumberOrSpecial ? "text-emerald-700" : "text-[var(--muted)]"
              )}
            >
              Contains a number or symbol
            </span>
          </div>
        </div>
      )}

      {error && <p className="text-[11px] text-red-600">{error}</p>}
    </div>
  );
}
