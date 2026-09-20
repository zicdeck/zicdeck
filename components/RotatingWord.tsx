"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface RotatingWordProps {
  words?: string[];
  interval?: number;
  className?: string;
}

const DEFAULT_WORDS = [
  "ready.",
  "polished.",
  "flawless.",
  "confident.",
  "compelling.",
  "effortless.",
];

export function RotatingWord({
  words = DEFAULT_WORDS,
  interval = 2000,
  className,
}: RotatingWordProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [fadeState, setFadeState] = useState<"visible" | "exiting" | "entering">("visible");

  useEffect(() => {
    if (words.length <= 1) return;

    const timer = setInterval(() => {
      setFadeState("exiting");
      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % words.length);
        setFadeState("entering");
        setTimeout(() => {
          setFadeState("visible");
        }, 40);
      }, 250);
    }, interval);

    return () => clearInterval(timer);
  }, [words, interval]);

  return (
    <span
      className={cn(
        "inline-block transition-all duration-300 ease-out will-change-transform",
        fadeState === "exiting" && "-translate-y-3 opacity-0 scale-95",
        fadeState === "entering" && "translate-y-3 opacity-0 scale-95 duration-0",
        fadeState === "visible" && "translate-y-0 opacity-100 scale-100",
        className
      )}
    >
      {words[currentIndex]}
    </span>
  );
}

export default RotatingWord;
