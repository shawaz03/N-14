"use client";

import React from "react";
import { Square, Zap, Cpu } from "lucide-react";
import { TerminalCursor } from "./TerminalCursor";
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
        "flex items-center justify-between gap-3 px-3 py-1.5 bg-void border border-edge font-mono text-xs select-none",
        className
      )}
    >
      {/* Telemetry status & speed */}
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-1.5 text-signal">
          <Cpu className="w-3.5 h-3.5 animate-pulse" />
          <span className="font-bold tracking-wider uppercase text-[11px]">
            RAIZEN STREAMING
          </span>
          <TerminalCursor size="sm" />
        </div>

        {tokensPerSec !== null && tokensPerSec > 0 && (
          <div className="flex items-center gap-1 text-text-muted text-[10px] border-l border-edge pl-2">
            <Zap className="w-3 h-3 text-signal" />
            <span className="text-text-primary font-bold">
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
          className="flex items-center gap-1 px-2 py-0.5 bg-terminal-error/20 hover:bg-terminal-error text-terminal-error hover:text-void border border-terminal-error/40 font-mono text-[10px] font-bold uppercase transition-colors shrink-0 active:translate-y-0.5"
          title="Halt Generation"
        >
          <Square className="w-2.5 h-2.5 fill-current" />
          <span>STOP (ESC)</span>
        </button>
      )}
    </div>
  );
}
