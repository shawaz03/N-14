"use client";

import React from "react";
import { cn } from "../lib/utils";

interface TerminalCursorProps {
  size?: "sm" | "md" | "lg";
  blinking?: boolean;
  className?: string;
}

export function TerminalCursor({
  size = "md",
  blinking = true,
  className,
}: TerminalCursorProps) {
  const sizeClasses = {
    sm: "w-1.5 h-3.5",
    md: "w-2 h-4",
    lg: "w-2.5 h-5",
  };

  return (
    <span
      aria-hidden="true"
      className={cn(
        "inline-block bg-signal align-middle ml-0.5 select-none",
        sizeClasses[size],
        blinking && "animate-terminal-cursor",
        className
      )}
    />
  );
}
