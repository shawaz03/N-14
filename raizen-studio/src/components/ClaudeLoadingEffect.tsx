"use client";

import React, { useState, useEffect } from "react";
import { Sparkles, Brain, Search, Square } from "lucide-react";
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
    setStageText("Searching React component templates & Lucide iconography...");

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
      className={cn(
        "my-3 w-full p-3 rounded-xl bg-white border border-swiss-border shadow-swiss flex items-center justify-between gap-3 text-xs select-none animate-in fade-in duration-200",
        className
      )}
    >
      {/* Left: Stage Icon & Shimmering Status Text */}
      <div className="flex items-center gap-2.5 overflow-hidden">
        {stage === "searching" && (
          <div className="w-5 h-5 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 animate-thought-pulse">
            <Search className="w-3 h-3 stroke-[2.5]" />
          </div>
        )}

        {stage === "reasoning" && (
          <div className="w-5 h-5 rounded-full bg-swiss-saffron-tint text-swiss-saffron-text flex items-center justify-center shrink-0 animate-thought-pulse">
            <Brain className="w-3 h-3 stroke-[2.5]" />
          </div>
        )}

        {stage === "synthesizing" && (
          <div className="w-5 h-5 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
            <Sparkles className="w-3 h-3 text-emerald-600 animate-spin" style={{ animationDuration: "3s" }} />
          </div>
        )}

        {/* Shimmer Text */}
        <div className="flex flex-col min-w-0">
          <span className="font-sans font-semibold animate-claude-shimmer truncate text-[12px]">
            {stageText}
          </span>
          {currentThought && (
            <span className="text-[10px] text-swiss-muted truncate italic font-mono">
              {currentThought.slice(0, 70)}...
            </span>
          )}
        </div>
      </div>

      {/* Right: Telemetry Token Velocity & Stop CTA */}
      <div className="flex items-center gap-2 shrink-0">
        {tokensPerSec !== null && tokensPerSec > 0 && (
          <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-0.5 rounded-pill bg-swiss-canvas border border-swiss-border text-[10.5px] font-mono text-swiss-muted font-bold">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-radar-dot"></span>
            <span className="text-swiss-ink font-bold">{tokensPerSec.toFixed(1)}</span>
            <span>tok/s</span>
          </div>
        )}

        {onStop && (
          <button
            type="button"
            onClick={onStop}
            className="flex items-center gap-1 px-3 py-1 rounded-pill bg-red-50 hover:bg-red-600 text-red-700 hover:text-white border border-red-200 text-[10px] font-bold uppercase transition-all shadow-sm font-frozen active:scale-95 tracking-wide"
            title="Stop generation (ESC)"
          >
            <Square className="w-2.5 h-2.5 fill-current" />
            <span>Stop</span>
          </button>
        )}
      </div>
    </div>
  );
}
