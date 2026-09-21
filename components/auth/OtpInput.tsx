"use client";

import React, { useRef, useEffect } from "react";
import { cn } from "@/lib/utils";

interface OtpInputProps {
  value: string;
  onChange: (value: string) => void;
  length?: number;
  disabled?: boolean;
  autoFocus?: boolean;
  error?: boolean;
  onComplete?: (code: string) => void;
}

export function OtpInput({
  value,
  onChange,
  length = 6,
  disabled = false,
  autoFocus = true,
  error = false,
  onComplete,
}: OtpInputProps) {
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Split value into array of characters padded to length
  const digits = value.split("").slice(0, length);
  while (digits.length < length) {
    digits.push("");
  }

  useEffect(() => {
    if (autoFocus && inputRefs.current[0] && !disabled) {
      inputRefs.current[0].focus();
    }
  }, [autoFocus, disabled]);

  const handleInputChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const rawVal = e.target.value;
    // Extract only digits
    const cleaned = rawVal.replace(/\D/g, "");

    if (!cleaned) {
      // User erased
      const newDigits = [...digits];
      newDigits[index] = "";
      const updated = newDigits.join("");
      onChange(updated);
      return;
    }

    if (cleaned.length === 1) {
      const newDigits = [...digits];
      newDigits[index] = cleaned;
      const updated = newDigits.join("");
      onChange(updated);

      if (index < length - 1 && inputRefs.current[index + 1]) {
        inputRefs.current[index + 1]?.focus();
      }

      if (updated.length === length && onComplete) {
        onComplete(updated);
      }
    } else if (cleaned.length > 1) {
      // Pasted inside single input
      handlePaste(cleaned);
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace") {
      if (!digits[index] && index > 0 && inputRefs.current[index - 1]) {
        e.preventDefault();
        inputRefs.current[index - 1]?.focus();
        const newDigits = [...digits];
        newDigits[index - 1] = "";
        onChange(newDigits.join(""));
      }
    } else if (e.key === "ArrowLeft" && index > 0) {
      e.preventDefault();
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === "ArrowRight" && index < length - 1) {
      e.preventDefault();
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handlePaste = (pastedText: string) => {
    const cleaned = pastedText.replace(/\D/g, "").slice(0, length);
    if (!cleaned) return;

    onChange(cleaned);
    const targetFocusIndex = Math.min(cleaned.length, length - 1);
    inputRefs.current[targetFocusIndex]?.focus();

    if (cleaned.length === length && onComplete) {
      onComplete(cleaned);
    }
  };

  const onPasteEvent = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text");
    handlePaste(pasted);
  };

  return (
    <div className="flex items-center justify-center gap-2 sm:gap-3">
      {digits.map((digit, idx) => (
        <input
          key={idx}
          ref={(el) => {
            inputRefs.current[idx] = el;
          }}
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          maxLength={1}
          autoComplete={idx === 0 ? "one-time-code" : "off"}
          value={digit}
          disabled={disabled}
          onChange={(e) => handleInputChange(idx, e)}
          onKeyDown={(e) => handleKeyDown(idx, e)}
          onPaste={onPasteEvent}
          className={cn(
            "h-12 w-10 sm:h-13 sm:w-12 text-center text-lg font-semibold font-sans rounded-lg border bg-[var(--paper)] text-[var(--ink)] shadow-2xs transition-all",
            "focus:border-[var(--accent)] focus:bg-[var(--surface)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/20",
            error
              ? "border-red-500 text-red-700 focus:border-red-500 focus:ring-red-500/20"
              : "border-[var(--border)]",
            disabled && "opacity-50 cursor-not-allowed",
            digit ? "border-[var(--ink)]/40 bg-[var(--surface)]" : ""
          )}
          aria-label={`Digit ${idx + 1} of ${length}`}
        />
      ))}
    </div>
  );
}
