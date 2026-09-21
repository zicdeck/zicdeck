import * as React from "react";
import Link from "next/link";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium transition-colors disabled:pointer-events-none disabled:opacity-50 cursor-pointer overflow-hidden",
  {
    variants: {
      variant: {
        primary:
          "border border-white/10 bg-[#335cff] text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.16),0_1px_2px_rgba(14,18,27,0.18),0_0_0_1px_#335cff] transition-colors hover:bg-[#2547d8] active:bg-[#2547d8]",
        secondary:
          "border border-[var(--border)] bg-[var(--surface)] text-[var(--ink)] hover:bg-[var(--paper)] shadow-2xs",
        ghost: "text-[var(--muted)] hover:text-[var(--ink)] hover:bg-[var(--paper)]",
      },
      size: {
        sm: "h-8 px-3 text-xs rounded-md",
        md: "h-10 px-5 rounded-[10px]",
        lg: "h-12 px-6 text-base rounded-[10px]",
      },
    },
    defaultVariants: { variant: "primary", size: "md" },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  href?: string;
}

export function Button({
  className,
  variant,
  size,
  href,
  children,
  ...props
}: ButtonProps) {
  const classes = cn(buttonVariants({ variant, size }), className);
  if (href) {
    return (
      <Link href={href} className={classes}>
        {children}
      </Link>
    );
  }
  return (
    <button className={classes} {...props}>
      {children}
    </button>
  );
}
