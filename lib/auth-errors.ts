import { isClerkAPIResponseError } from "@clerk/nextjs/errors";

/**
 * Extracts a user-friendly error message from Clerk or generic exceptions.
 */
export function getAuthErrorMessage(err: unknown): string {
  if (isClerkAPIResponseError(err)) {
    const firstError = err.errors?.[0];
    if (!firstError) {
      return "Authentication failed. Please try again.";
    }

    // Custom overrides for clearer user UX if desired
    switch (firstError.code) {
      case "form_identifier_not_found":
        return "No account found with this email or username.";
      case "form_password_incorrect":
        return "Incorrect password. Please try again or reset your password.";
      case "form_identifier_exists":
        return "An account with this email already exists. Try signing in instead.";
      case "form_code_incorrect":
        return "Invalid verification code. Please check and try again.";
      case "form_password_pwned":
        return "This password is too common or has appeared in a data breach. Please choose a stronger password.";
      case "form_password_length_too_short":
        return "Password must be at least 8 characters long.";
      case "strategy_for_user_invalid":
        return "This sign-in method is not available for this account.";
      default:
        return firstError.longMessage || firstError.message || "An error occurred during authentication.";
    }
  }

  if (err instanceof Error) {
    return err.message;
  }

  if (typeof err === "string") {
    return err;
  }

  return "Something went wrong. Please try again.";
}
