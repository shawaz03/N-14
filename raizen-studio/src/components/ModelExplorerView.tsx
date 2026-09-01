"use client";

import React, { useState } from "react";
import {
  ExternalLink,
  Sparkles,
  Sliders,
  Share2,
  Check,
} from "lucide-react";
import { RAIZEN_MODEL_SPEC, RAIZEN_PERSONAS } from "../lib/personaManager";
import { RaizenPersona } from "../types/model";
import { cn } from "../lib/utils";

interface ModelExplorerViewProps {
  activePersona: RaizenPersona;
  onSelectPersona: (persona: RaizenPersona) => void;
  className?: string;
}

export function ModelExplorerView({
  activePersona,
  onSelectPersona,
  className,
}: ModelExplorerViewProps) {
  const [copiedLink, setCopiedLink] = useState(false);
  const [activeTab, setActiveTab] = useState<"architecture" | "personas" | "tokenizer">("personas");

  const spec = RAIZEN_MODEL_SPEC;
  const huggingFaceUrl = `https://huggingface.co/${spec.huggingFaceRepo}`;

  const handleCopyHfLink = () => {
    navigator.clipboard.writeText(huggingFaceUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <div className={cn("w-full h-full flex flex-col bg-swiss-canvas overflow-hidden select-none", className)}>
      {/* 1. Header Bar */}
      <div className="px-6 py-5 bg-white border-b border-swiss-border flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-swiss-saffron-tint text-swiss-saffron flex items-center justify-center font-frozen text-xs">
            ✦
          </div>
          <div>
            <h1 className="text-base sm:text-lg font-bold text-swiss-ink font-frozen uppercase tracking-wider">
              Model Explorer & Architecture
            </h1>
            <p className="text-xs text-swiss-muted font-mono">
              {spec.name} {spec.version} · {spec.parameters} Parameters · Fine-Tuned by {spec.creator}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <a
            href={huggingFaceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-3.5 py-1.5 bg-white hover:bg-swiss-canvas border border-swiss-border rounded-pill text-xs font-bold text-swiss-ink transition-colors font-frozen shadow-sm"
          >
            <span>Hugging Face Hub</span>
            <ExternalLink className="w-3 h-3 text-swiss-saffron" />
          </a>
        </div>
      </div>

      {/* 2. Navigation Sub-Tabs */}
      <div className="px-6 py-2.5 bg-white/70 border-b border-swiss-border flex items-center gap-2 shrink-0">
        <button
          type="button"
          onClick={() => setActiveTab("personas")}
          className={cn(
            "px-4 py-1.5 rounded-pill text-xs font-bold font-frozen tracking-wide transition-all",
            activeTab === "personas"
              ? "bg-swiss-saffron text-white shadow-swiss-saffron"
              : "bg-white border border-swiss-border text-swiss-muted hover:text-swiss-ink"
          )}
        >
          AI Personas & Specialists
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("architecture")}
          className={cn(
            "px-4 py-1.5 rounded-pill text-xs font-bold font-frozen tracking-wide transition-all",
            activeTab === "architecture"
              ? "bg-swiss-saffron text-white shadow-swiss-saffron"
              : "bg-white border border-swiss-border text-swiss-muted hover:text-swiss-ink"
          )}
        >
          Model Architecture Matrix
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("tokenizer")}
          className={cn(
            "px-4 py-1.5 rounded-pill text-xs font-bold font-frozen tracking-wide transition-all",
            activeTab === "tokenizer"
              ? "bg-swiss-saffron text-white shadow-swiss-saffron"
              : "bg-white border border-swiss-border text-swiss-muted hover:text-swiss-ink"
          )}
        >
          Tokenizer & Context Window
        </button>
      </div>

      {/* 3. Main Body Content */}
      <div className="flex-1 w-full overflow-y-auto p-4 sm:p-6 select-text">
        <div className="max-w-5xl mx-auto space-y-6">
          {/* TAB 1: AI Specialist Personas */}
        {activeTab === "personas" && (
          <div className="space-y-5 animate-in fade-in duration-150">
            <div className="p-4 bg-white border border-swiss-border rounded-2xl shadow-swiss space-y-1">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-swiss-saffron" />
                <h2 className="text-xs sm:text-sm font-bold text-swiss-ink font-frozen uppercase tracking-wider">
                  Select Active AI Specialist Persona
                </h2>
              </div>
              <p className="text-xs text-swiss-muted leading-relaxed">
                Choose a specialized engineering persona to tailor RAIZEN&apos;s code generation, architectural decisions, and sampling temperature.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {RAIZEN_PERSONAS.map((persona) => {
                const isSelected = persona.id === activePersona.id;

                return (
                  <div
                    key={persona.id}
                    onClick={() => onSelectPersona(persona)}
                    className={cn(
                      "p-5 rounded-2xl border transition-all cursor-pointer shadow-swiss flex flex-col justify-between gap-4 text-left group",
                      isSelected
                        ? "bg-white border-swiss-saffron shadow-swiss-saffron ring-1 ring-swiss-saffron"
                        : "bg-white hover:bg-white/95 border-swiss-border hover:border-swiss-border-card"
                    )}
                  >
                    <div className="space-y-3">
                      {/* Persona Header */}
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2.5">
                          <div
                            className="w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs"
                            style={{
                              backgroundColor: `${persona.accentColor}18`,
                              color: persona.accentColor,
                            }}
                          >
                            ✦
                          </div>
                          <div>
                            <h3 className="font-bold text-sm text-swiss-ink font-frozen tracking-wide">
                              {persona.name}
                            </h3>
                            <span className="text-[10px] font-mono text-swiss-muted">
                              Temp: {persona.defaultTemperature}
                            </span>
                          </div>
                        </div>

                        <span
                          className={cn(
                            "text-[10px] font-bold px-2 py-0.5 rounded-pill font-frozen",
                            isSelected
                              ? "bg-swiss-saffron text-white shadow-sm"
                              : "bg-swiss-canvas border border-swiss-border text-swiss-muted"
                          )}
                        >
                          {isSelected ? "Active Persona" : persona.badge}
                        </span>
                      </div>

                      {/* Tagline */}
                      <p className="text-xs text-swiss-body leading-relaxed">
                        {persona.tagline}
                      </p>

                      {/* Tags */}
                      <div className="flex items-center gap-1.5 flex-wrap">
                        {persona.tags.map((t) => (
                          <span
                            key={t}
                            className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-swiss-canvas border border-swiss-border text-swiss-ink"
                          >
                            {t}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* System Prompt Snippet Preview */}
                    <div className="bg-[#111215] border border-[#26282E] rounded-lg p-2.5 font-mono text-[10.5px] leading-relaxed text-[#A0A2A8]">
                      <div className="text-[9.5px] uppercase text-swiss-saffron font-bold pb-1 font-frozen">
                        System Prompt Directive
                      </div>
                      <p className="line-clamp-2 italic">
                        &quot;{persona.systemPrompt}&quot;
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 2: Model Architecture Matrix */}
        {activeTab === "architecture" && (
          <div className="space-y-5 animate-in fade-in duration-150">
            {/* Hugging Face Hub Hero Banner */}
            <div className="p-5 bg-white border border-swiss-border rounded-2xl shadow-swiss flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-xl bg-swiss-saffron-tint text-swiss-saffron flex items-center justify-center font-frozen text-lg font-bold shrink-0">
                  ✦
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h2 className="text-sm sm:text-base font-bold text-swiss-ink font-frozen uppercase tracking-wider">
                      Hugging Face Model Repository
                    </h2>
                    <span className="text-[10px] px-2 py-0.5 rounded-pill bg-emerald-50 text-emerald-700 border border-emerald-200 font-mono font-bold">
                      Open Weights
                    </span>
                  </div>
                  <p className="text-xs text-swiss-muted font-mono">
                    Repository ID: <span className="text-swiss-saffron font-bold">{spec.huggingFaceRepo}</span>
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={handleCopyHfLink}
                  className="flex-1 sm:flex-none px-3 py-1.5 bg-swiss-canvas hover:bg-white border border-swiss-border rounded-pill text-xs font-bold text-swiss-ink transition-colors font-mono flex items-center justify-center gap-1.5"
                >
                  {copiedLink ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <Share2 className="w-3.5 h-3.5 text-swiss-muted" />
                      <span>Copy Repo URL</span>
                    </>
                  )}
                </button>
                <a
                  href={huggingFaceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 sm:flex-none px-4 py-1.5 bg-swiss-saffron hover:bg-swiss-saffron-hover text-white rounded-pill text-xs font-bold transition-all font-frozen tracking-wide flex items-center justify-center gap-1 shadow-swiss-saffron"
                >
                  <span>Explore Model</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>

            {/* Architecture Grid Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3.5">
              <div className="p-4 bg-white border border-swiss-border rounded-xl shadow-swiss space-y-1">
                <span className="text-[10.5px] uppercase font-bold text-swiss-muted font-frozen">
                  Parameters
                </span>
                <p className="text-sm font-bold text-swiss-ink font-mono">
                  {spec.parameters}
                </p>
              </div>

              <div className="p-4 bg-white border border-swiss-border rounded-xl shadow-swiss space-y-1">
                <span className="text-[10.5px] uppercase font-bold text-swiss-muted font-frozen">
                  Base Foundation Model
                </span>
                <p className="text-xs font-bold text-swiss-ink font-mono truncate">
                  {spec.baseModel}
                </p>
              </div>

              <div className="p-4 bg-white border border-swiss-border rounded-xl shadow-swiss space-y-1">
                <span className="text-[10.5px] uppercase font-bold text-swiss-muted font-frozen">
                  Quantization Format
                </span>
                <p className="text-sm font-bold text-swiss-ink font-mono">
                  {spec.quantization}
                </p>
              </div>

              <div className="p-4 bg-white border border-swiss-border rounded-xl shadow-swiss space-y-1">
                <span className="text-[10.5px] uppercase font-bold text-swiss-muted font-frozen">
                  Fine-Tuning Method
                </span>
                <p className="text-sm font-bold text-swiss-ink font-frozen">
                  {spec.fineTuningMethod}
                </p>
              </div>

              <div className="p-4 bg-white border border-swiss-border rounded-xl shadow-swiss space-y-1">
                <span className="text-[10.5px] uppercase font-bold text-swiss-muted font-frozen">
                  Context Window
                </span>
                <p className="text-sm font-bold text-swiss-ink font-frozen">
                  {spec.contextWindow.toLocaleString()} Tokens
                </p>
              </div>

              <div className="p-4 bg-white border border-swiss-border rounded-xl shadow-swiss space-y-1">
                <span className="text-[10.5px] uppercase font-bold text-swiss-muted font-frozen">
                  Architect & Creator
                </span>
                <a
                  href={spec.portfolioUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm font-bold text-swiss-saffron hover:underline font-frozen flex items-center gap-1"
                >
                  <span>{spec.creator}</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: Tokenizer & Context Window */}
        {activeTab === "tokenizer" && (
          <div className="space-y-5 animate-in fade-in duration-150">
            <div className="p-5 bg-white border border-swiss-border rounded-2xl shadow-swiss space-y-3">
              <div className="flex items-center gap-2">
                <Sliders className="w-4 h-4 text-swiss-saffron" />
                <h2 className="text-sm font-bold text-swiss-ink font-frozen uppercase tracking-wider">
                  32K Context Window Allocation
                </h2>
              </div>
              <p className="text-xs text-swiss-muted leading-relaxed">
                RAIZEN 7.61B leverages Flash Attention 2 to support up to 32,768 context tokens, easily holding entire multi-file Next.js components, database schemas, and conversational history.
              </p>

              {/* Progress Bar Matrix */}
              <div className="space-y-1.5 pt-2">
                <div className="flex items-center justify-between text-xs font-frozen text-swiss-ink font-bold">
                  <span>Context Capacity: 32,768 Tokens</span>
                  <span className="text-swiss-saffron">Max Output: 4,096 Tokens</span>
                </div>
                <div className="w-full h-3 bg-swiss-canvas rounded-full border border-swiss-border overflow-hidden flex">
                  <div className="h-full bg-swiss-saffron w-[87.5%]" title="Context Window (28,672 tokens)" />
                  <div className="h-full bg-emerald-500 w-[12.5%]" title="Generation Buffer (4,096 tokens)" />
                </div>
                <div className="flex items-center justify-between text-[10px] text-swiss-muted font-frozen pt-1">
                  <span>Input Context Buffer (87.5%)</span>
                  <span>Output Generation Window (12.5%)</span>
                </div>
              </div>
            </div>
          </div>
        )}
        </div>
      </div>
    </div>
  );
}
