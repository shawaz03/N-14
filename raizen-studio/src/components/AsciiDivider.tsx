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
          "w-full flex items-center justify-center gap-2 my-4 text-[10px] font-frozen text-swiss-muted select-none uppercase tracking-widest",
          className
        )}
      >
        <span className="flex-1 border-t border-swiss-border" />
        <span className="px-2.5 py-0.5 text-swiss-muted font-bold text-[9px] bg-swiss-canvas border border-swiss-border rounded-pill">
          {label}
        </span>
        <span className="flex-1 border-t border-swiss-border" />
      </div>
    );
  }

  return (
    <div
      className={cn(
        "my-4 border-t border-swiss-border",
        className
      )}
    />
  );
}
