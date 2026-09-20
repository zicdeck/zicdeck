export const clerkAppearance = {
  variables: {
    colorPrimary: "#2F5EFF",
    colorText: "#14151A",
    colorTextSecondary: "#6B6B68",
    colorBackground: "#FFFFFF",
    colorInputBackground: "#FAFAF8",
    colorInputBorder: "#E5E4DF",
    colorNeutral: "#14151A",
    fontFamily: "var(--font-inter), -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    borderRadius: "0.375rem",
  },
  elements: {
    rootBox: "w-full mx-auto",
    card: "border border-[#E5E4DF] shadow-none rounded-lg bg-[#FFFFFF] p-6 sm:p-8",
    headerTitle: "font-display text-xl font-semibold text-[#14151A] tracking-tight",
    headerSubtitle: "text-sm text-[#6B6B68] mt-1",
    socialButtonsBlockButton:
      "border border-[#E5E4DF] hover:bg-[#FAFAF8] text-[#14151A] rounded-md transition-colors text-sm font-medium",
    dividerLine: "bg-[#E5E4DF]",
    dividerText: "text-xs text-[#6B6B68] uppercase tracking-wider",
    formButtonPrimary:
      "bg-[#2F5EFF] hover:bg-[#254ecc] text-white shadow-none rounded-md font-medium text-sm transition-colors py-2.5",
    formFieldInput:
      "bg-[#FAFAF8] border border-[#E5E4DF] rounded-md text-[#14151A] placeholder:text-[#6B6B68] focus:border-[#2F5EFF] focus:outline-none focus:ring-1 focus:ring-[#2F5EFF] transition-colors text-sm",
    formFieldLabel: "text-xs font-medium text-[#14151A] mb-1.5",
    footerActionLink: "text-[#2F5EFF] hover:underline font-medium",
    footerActionText: "text-xs text-[#6B6B68]",
    identityPreviewText: "text-[#14151A] text-sm",
    identityPreviewEditButton: "text-[#2F5EFF] hover:underline text-xs",
    formResendCodeLink: "text-[#2F5EFF] hover:underline text-xs",
    otpCodeFieldInput: "border-[#E5E4DF] focus:border-[#2F5EFF] text-[#14151A] bg-[#FAFAF8]",
  },
};
