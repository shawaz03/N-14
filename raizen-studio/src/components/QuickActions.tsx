"use client";

import React from "react";
import { Sparkles, Terminal, Bug, Layout, Cpu } from "lucide-react";
import { cn } from "../lib/utils";

interface QuickActionsProps {
  onSelectPrompt: (prompt: string) => void;
  className?: string;
}

export const PRESET_PROMPTS = [
  {
    id: "dashboard",
    label: "⚡ Live React Dashboard",
    icon: Layout,
    prompt:
      "Create a responsive cyberpunk analytics dashboard in React with Lucide icons, live metric cards, CPU/GPU utilization bars, and a clean dark theme ready to preview.",
  },
  {
    id: "brutalist-card",
    label: "🎨 Terminal Brutalist UI",
    icon: Terminal,
    prompt:
      "Write a modern Terminal Brutalism UI component with 0px radius, #050505 background, #CCFF00 lime accents, 1px hard borders, and interactive tabs in React.",
  },
  {
    id: "debug",
    label: "🐞 Algorithm Debugger",
    icon: Bug,
    prompt:
      "Write an optimized TypeScript implementation of a high-concurrency RateLimiter using the Token Bucket algorithm with unit tests and error handling.",
  },
  {
    id: "python-worker",
    label: "🐍 Async Python Engine",
    icon: Cpu,
    prompt:
      "Write a production-grade FastAPI background worker with asyncio queue, SSE streaming generator, and health telemetry.",
  },
];

export function QuickActions({ onSelectPrompt, className }: QuickActionsProps) {
  return (
    <div
      className={cn(
        "w-full flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1 select-none font-mono text-[10px]",
        className
      )}
    >
      <div className="flex items-center gap-1 text-text-muted shrink-0 pr-1">
        <Sparkles className="w-3 h-3 text-signal" />
        <span className="font-bold uppercase tracking-wider">QUICK:</span>
      </div>

      {PRESET_PROMPTS.map((preset) => {
        const Icon = preset.icon;
        return (
          <button
            key={preset.id}
            type="button"
            onClick={() => onSelectPrompt(preset.prompt)}
            className="flex items-center gap-1.5 px-2 py-1 bg-surface hover:bg-surface-elevated active:translate-y-0.5 border border-edge hover:border-edge-light text-text-muted hover:text-text-primary uppercase tracking-wider transition-colors shrink-0 shadow-hard-sm"
          >
            <Icon className="w-3 h-3 text-signal" />
            <span>{preset.label}</span>
          </button>
        );
      })}
    </div>
  );
}
