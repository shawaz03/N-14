"use client";

import React from "react";
import { cn } from "../lib/utils";

interface AsciiDividerProps {
  label?: string;
  className?: string;
}

export function AsciiDivider({ label, className }: AsciiDividerProps) {
  if (label) {
    return (
      <div
        className={cn(
          "w-full flex items-center justify-center gap-2 my-3 text-[10px] font-mono text-[#444444] select-none uppercase tracking-widest",
          className
        )}
      >
        <span className="flex-1 overflow-hidden whitespace-nowrap text-right">
          ────────────────────────────────
        </span>
        <span className="px-2 text-text-muted font-bold text-[9px] bg-void border border-edge">
          {label}
        </span>
        <span className="flex-1 overflow-hidden whitespace-nowrap text-left">
          ────────────────────────────────
        </span>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "my-3 text-[#333333] font-mono text-[10px] tracking-widest select-none overflow-hidden text-center",
        className
      )}
    >
      ────────────────────────────────────────────────────────────────
    </div>
  );
}
