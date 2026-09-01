"use client";

import React from "react";
import { Sparkles, Bug, Layout, Cpu, ShoppingBag } from "lucide-react";
import { cn } from "../lib/utils";

interface QuickActionsProps {
  onSelectPrompt: (prompt: string) => void;
  className?: string;
}

export const PRESET_PROMPTS = [
  {
    id: "dashboard",
    label: "⚡ React Telemetry HUD",
    icon: Layout,
    prompt:
      "Create a responsive telemetry dashboard in React with Lucide icons, live metric cards, CPU/GPU utilization bars, and a clean theme ready to preview in sandbox.",
  },
  {
    id: "saas-pricing",
    label: "🎨 SaaS Pricing Matrix",
    icon: ShoppingBag,
    prompt:
      "Write a modern 3-tier SaaS pricing matrix component in React with monthly/yearly billing toggle, feature checklists, and glowing cards.",
  },
  {
    id: "debug",
    label: "🐞 Algorithm Optimizer",
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
        "w-full flex items-center gap-2 overflow-x-auto no-scrollbar py-1 select-none font-sans text-xs",
        className
      )}
    >
      <div className="flex items-center gap-1 text-swiss-muted shrink-0 pr-1">
        <Sparkles className="w-3.5 h-3.5 text-swiss-saffron" />
        <span className="font-bold uppercase tracking-wider text-[10px] font-frozen">QUICK:</span>
      </div>

      {PRESET_PROMPTS.map((preset) => {
        const Icon = preset.icon;
        return (
          <button
            key={preset.id}
            type="button"
            onClick={() => onSelectPrompt(preset.prompt)}
            className="flex items-center gap-1.5 px-3 py-1 bg-white hover:bg-swiss-saffron-tint/60 border border-swiss-border hover:border-swiss-saffron/40 text-swiss-body hover:text-swiss-saffron rounded-pill text-[11px] font-medium transition-all shrink-0 shadow-swiss active:scale-95"
          >
            <Icon className="w-3 h-3 text-swiss-saffron" />
            <span>{preset.label}</span>
          </button>
        );
      })}
    </div>
  );
}
