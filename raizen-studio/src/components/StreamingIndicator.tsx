"use client";

import React from "react";
import { Square, Zap, Cpu } from "lucide-react";
import { cn } from "../lib/utils";

interface StreamingIndicatorProps {
  isStreaming: boolean;
  tokensPerSec?: number | null;
  onStop?: () => void;
  className?: string;
}

export function StreamingIndicator({
  isStreaming,
  tokensPerSec = null,
  onStop,
  className,
}: StreamingIndicatorProps) {
  if (!isStreaming) return null;

  return (
    <div
      className={cn(
        "flex items-center justify-between gap-3 px-3.5 py-2 bg-white border border-swiss-border rounded-xl font-frozen text-xs select-none shadow-swiss",
        className
      )}
    >
      {/* Telemetry status & speed */}
      <div className="flex items-center gap-2.5">
        <div className="flex items-center gap-1.5 text-swiss-saffron">
          <Cpu className="w-3.5 h-3.5 animate-pulse" />
          <span className="font-bold tracking-wider uppercase text-[11px] font-frozen">
            RAIZEN STREAMING
          </span>
        </div>

        {tokensPerSec !== null && tokensPerSec > 0 && (
          <div className="flex items-center gap-1 text-swiss-muted text-[10.5px] border-l border-swiss-border pl-2.5">
            <Zap className="w-3 h-3 text-swiss-saffron" />
            <span className="text-swiss-ink font-bold">
              {tokensPerSec.toFixed(1)}
            </span>
            <span>tok/s</span>
          </div>
        )}
      </div>

      {/* Stop / Abort CTA */}
      {onStop && (
        <button
          type="button"
          onClick={onStop}
          className="flex items-center gap-1 px-2.5 py-1 bg-red-50 hover:bg-red-600 text-red-700 hover:text-white border border-red-200 rounded-pill font-frozen text-[10px] font-bold uppercase transition-all shrink-0 active:scale-95"
          title="Halt Generation"
        >
          <Square className="w-2.5 h-2.5 fill-current" />
          <span>STOP (ESC)</span>
        </button>
      )}
    </div>
  );
}
