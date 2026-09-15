"use client";

import React from "react";
import { Stop } from "@phosphor-icons/react";
import { MotionIcon } from "./MotionIcon";
import { cn } from "../../lib/utils";

export type TriadLoadingStage = "searching" | "reasoning" | "synthesizing" | "completed";

export interface QuantumOrbitalTriadProps {
  isStreaming: boolean;
  stage?: TriadLoadingStage;
  stageText?: string;
  currentThought?: string;
  tokensPerSec?: number | null;
  onStop?: () => void;
  className?: string;
}

/**
 * QuantumOrbitalTriad
 * Inspired by Google Gemini's ambient, unboxed fluid intelligence.
 * Renders 3 harmonic orbiting dots traversing an infinity wave trajectory
 * with synchronized iridescent typography and low-profile telemetry.
 */
export function QuantumOrbitalTriad({
  isStreaming,
  stage = "synthesizing",
  stageText = "Synthesizing response via RAIZEN 7B...",
  currentThought,
  tokensPerSec = null,
  onStop,
  className,
}: QuantumOrbitalTriadProps) {
  if (!isStreaming) return null;

  return (
    <div
      data-stage={stage}
      className={cn(
        "flex items-center justify-between gap-3 py-2.5 px-1 w-full max-w-2xl select-none animate-in fade-in duration-200",
        className
      )}
    >
      {/* Left: Gemini-Inspired Harmonic Orbital Triad + Typography */}
      <div className="flex items-center gap-3.5 min-w-0">
        {/* Orbital 3-Dot Cluster */}
        <div
          className="relative w-6 h-6 flex items-center justify-center shrink-0"
          aria-label="Quantum Orbital Trajectory"
        >
          {/* Dot 1: Swiss Saffron Gold */}
          <span className="animate-orbit-triad-1 absolute w-2 h-2 rounded-full bg-swiss-saffron shadow-[0_0_8px_rgba(217,119,6,0.4)]" />
          {/* Dot 2: Deep Amber Accent */}
          <span className="animate-orbit-triad-2 absolute w-1.5 h-1.5 rounded-full bg-amber-600" />
          {/* Dot 3: Slate Ink / Obsidian Core */}
          <span className="animate-orbit-triad-3 absolute w-2 h-2 rounded-full bg-slate-700 dark:bg-cyan-400" />
        </div>

        {/* Shimmering Dynamic Stage Typography */}
        <div className="flex flex-col min-w-0">
          <div className="flex items-center gap-2">
            <span className="animate-claude-shimmer font-frozen tracking-wide font-bold text-[13px] truncate">
              {stageText}
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-swiss-saffron/60 animate-ping shrink-0" />
          </div>

          {currentThought && (
            <span className="text-[10px] text-swiss-muted truncate italic font-mono mt-0.5">
              {currentThought.slice(0, 75)}...
            </span>
          )}
        </div>
      </div>

      {/* Right: Telemetry Token Velocity & Micro Stop Trigger */}
      <div className="flex items-center gap-2 shrink-0">
        {tokensPerSec !== null && tokensPerSec > 0 && (
          <div className="hidden sm:flex items-center gap-1.5 px-2 py-0.5 rounded-pill bg-swiss-canvas border border-swiss-border text-[10.5px] font-mono text-swiss-muted font-bold">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-radar-dot" />
            <span className="text-swiss-ink font-bold">{tokensPerSec.toFixed(1)}</span>
            <span>tok/s</span>
          </div>
        )}

        {onStop && (
          <button
            type="button"
            onClick={onStop}
            className="flex items-center gap-1 px-2.5 py-1 rounded-pill bg-red-50/80 hover:bg-red-600 text-red-700 hover:text-white border border-red-200 text-[10px] font-bold uppercase transition-all shadow-sm font-frozen active:scale-95 tracking-wide"
            title="Stop generation (ESC)"
          >
            <MotionIcon icon={Stop} size={10} weight="fill" animation="pulse" />
            <span>Stop</span>
          </button>
        )}
      </div>
    </div>
  );
}
