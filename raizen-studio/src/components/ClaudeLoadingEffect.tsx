"use client";

import React, { useState, useEffect } from "react";
import { Stop } from "@phosphor-icons/react";
import { MotionIcon } from "./ui/MotionIcon";
import { cn } from "../lib/utils";

export type LoadingStage = "searching" | "reasoning" | "synthesizing" | "completed";

interface ClaudeLoadingEffectProps {
  isStreaming: boolean;
  tokensPerSec?: number | null;
  currentThought?: string;
  onStop?: () => void;
  className?: string;
}

export function ClaudeLoadingEffect({
  isStreaming,
  tokensPerSec = null,
  currentThought,
  onStop,
  className,
}: ClaudeLoadingEffectProps) {
  const [stage, setStage] = useState<LoadingStage>("searching");
  const [stageText, setStageText] = useState<string>("Analyzing prompt & searching AST index...");

  // Progressively step through Claude-style search and reasoning phases during stream start
  useEffect(() => {
    if (!isStreaming) {
      setStage("completed");
      return;
    }

    // Phase 1: Search & Index (0 - 800ms)
    setStage("searching");
    setStageText("Searching React component templates & Phosphor iconography...");

    // Phase 2: Reasoning (800ms - 1800ms)
    const t1 = setTimeout(() => {
      setStage("reasoning");
      setStageText("Synthesizing component structure & state bindings...");
    }, 800);

    // Phase 3: Token Streaming (1800ms+)
    const t2 = setTimeout(() => {
      setStage("synthesizing");
      setStageText("Streaming zero-defect TypeScript via RAIZEN-7B QLoRA...");
    }, 1800);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [isStreaming]);

  if (!isStreaming) return null;

  return (
    <div
      data-stage={stage}
      className={cn(
        "my-2 w-full flex items-center justify-between gap-3 text-xs select-none animate-in fade-in duration-200",
        className
      )}
    >
      {/* Unboxed Gemini-Inspired Quantum Orbital Triad Flow */}
      <div className="flex items-center gap-3.5 min-w-0">
        {/* Orbital 3-Dot Cluster */}
        <div
          className="relative w-6 h-6 flex items-center justify-center shrink-0"
          aria-label="Quantum Orbital Trajectory"
        >
          <span className="animate-orbit-triad-1 absolute w-2 h-2 rounded-full bg-swiss-saffron shadow-[0_0_8px_rgba(217,119,6,0.4)]" />
          <span className="animate-orbit-triad-2 absolute w-1.5 h-1.5 rounded-full bg-amber-600" />
          <span className="animate-orbit-triad-3 absolute w-2 h-2 rounded-full bg-slate-700 dark:bg-cyan-400" />
        </div>

        {/* Shimmering Dynamic Stage Text in Frozen Brand Typography */}
        <div className="flex flex-col min-w-0">
          <div className="flex items-center gap-2">
            <span className="font-frozen tracking-wide font-bold animate-claude-shimmer truncate text-[13px]">
              {stageText}
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-swiss-saffron/70 animate-ping shrink-0" />
          </div>

          {currentThought && (
            <span className="text-[10px] text-swiss-muted truncate italic font-mono mt-0.5">
              {currentThought.slice(0, 75)}...
            </span>
          )}
        </div>
      </div>

      {/* Right: Telemetry Token Velocity & Micro Stop Trigger */}
      <div className="flex items-center gap-2 shrink-0 font-mono">
        {tokensPerSec !== null && tokensPerSec > 0 && (
          <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-0.5 rounded-pill bg-swiss-canvas border border-swiss-border text-[10.5px] text-swiss-muted font-bold">
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
