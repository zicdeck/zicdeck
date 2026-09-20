"use client";

import React from "react";
import { motion, type HTMLMotionProps, type UseInViewOptions } from "motion/react";
import { cn } from "@/lib/utils";

interface FadeUpProps extends HTMLMotionProps<"div"> {
  children: React.ReactNode;
  delay?: number;
  duration?: number;
  yOffset?: number;
  className?: string;
  viewportMargin?: UseInViewOptions["margin"];
  amount?: UseInViewOptions["amount"];
}

export function FadeUp({
  children,
  delay = 0,
  duration = 0.75,
  yOffset = 36,
  className,
  viewportMargin = "0px",
  amount = 0.2,
  ...props
}: FadeUpProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: yOffset }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: viewportMargin, amount }}
      transition={{
        duration,
        delay,
        ease: [0.16, 1, 0.3, 1],
      }}
      className={cn(className)}
      {...props}
    >
      {children}
    </motion.div>
  );
}

export default FadeUp;
