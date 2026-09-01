"use client";

import React, { useState } from "react";
import {
  Code,
  Eye,
  Copy,
  Check,
  RotateCcw,
  Maximize2,
  Minimize2,
  FileCode,
  Download,
} from "lucide-react";
import { cn } from "../lib/utils";

export type SandboxTab = "editor" | "preview";

interface SandboxHeaderProps {
  activeTab: SandboxTab;
  onTabChange: (tab: SandboxTab) => void;
  filename?: string;
  language?: string;
  code: string;
  onReset?: () => void;
  onExport?: () => void;
  onToggleFullscreen?: () => void;
  isFullscreen?: boolean;
  className?: string;
}

export function SandboxHeader({
  activeTab,
  onTabChange,
  filename = "Component.tsx",
  language = "typescript",
  code,
  onReset,
  onExport,
  onToggleFullscreen,
  isFullscreen = false,
  className,
}: SandboxHeaderProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      className={cn(
        "w-full h-10 bg-white border-b border-swiss-border flex items-center justify-between px-3 text-xs select-none font-mono shrink-0 shadow-swiss",
        className
      )}
    >
      {/* Left: Dual Engine Tab Switcher */}
      <div className="flex items-center gap-1 bg-swiss-canvas border border-swiss-border p-0.5 rounded-pill">
        <button
          type="button"
          onClick={() => onTabChange("editor")}
          className={cn(
            "flex items-center gap-1.5 px-3 py-1 text-[10px] font-bold uppercase transition-all rounded-pill font-frozen",
            activeTab === "editor"
              ? "bg-swiss-saffron text-white shadow-swiss-saffron"
              : "text-swiss-muted hover:text-swiss-ink"
          )}
          title="Switch to Code Editor"
        >
          <Code className="w-3 h-3" />
          <span>CODE EDITOR</span>
        </button>

        <button
          type="button"
          onClick={() => onTabChange("preview")}
          className={cn(
            "flex items-center gap-1.5 px-3 py-1 text-[10px] font-bold uppercase transition-all rounded-pill font-frozen",
            activeTab === "preview"
              ? "bg-swiss-saffron text-white shadow-swiss-saffron"
              : "text-swiss-muted hover:text-swiss-ink"
          )}
          title="Switch to Live Component Preview"
        >
          <Eye className="w-3 h-3" />
          <span>LIVE PREVIEW</span>
        </button>
      </div>

      {/* Middle: Active File & Language Pill */}
      <div className="hidden sm:flex items-center gap-2 text-[10px] text-swiss-muted">
        <div className="flex items-center gap-1 text-swiss-ink font-bold font-mono">
          <FileCode className="w-3.5 h-3.5 text-swiss-saffron" />
          <span>{filename}</span>
        </div>
        <span className="px-2 py-0.5 bg-swiss-canvas border border-swiss-border uppercase text-[9px] font-mono font-bold rounded-pill text-swiss-ink">
          {language}
        </span>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-1">
        {/* Export / Download Code */}
        {onExport && (
          <button
            type="button"
            onClick={onExport}
            className="px-2.5 py-1 bg-swiss-canvas hover:bg-white border border-swiss-border rounded-pill text-swiss-body hover:text-swiss-ink transition-colors text-[10px] font-mono flex items-center gap-1"
            title="Download Component"
          >
            <Download className="w-3 h-3 text-swiss-saffron" />
            <span className="hidden md:inline font-bold">EXPORT</span>
          </button>
        )}

        {/* Reset Code */}
        {onReset && (
          <button
            type="button"
            onClick={onReset}
            className="px-2.5 py-1 bg-swiss-canvas hover:bg-white border border-swiss-border rounded-pill text-swiss-body hover:text-swiss-ink transition-colors text-[10px] font-mono flex items-center gap-1"
            title="Reset to Initial Code"
          >
            <RotateCcw className="w-3 h-3" />
            <span className="hidden md:inline font-bold">RESET</span>
          </button>
        )}

        {/* Copy Code */}
        <button
          type="button"
          onClick={handleCopy}
          className="px-2.5 py-1 bg-swiss-canvas hover:bg-white border border-swiss-border rounded-pill text-swiss-body hover:text-swiss-ink transition-colors text-[10px] font-mono flex items-center gap-1"
          title={copied ? "Copied to Clipboard" : "Copy Code"}
        >
          {copied ? (
            <>
              <Check className="w-3 h-3 text-emerald-600" />
              <span className="text-emerald-600 font-bold hidden md:inline">COPIED</span>
            </>
          ) : (
            <>
              <Copy className="w-3 h-3" />
              <span className="hidden md:inline font-bold">COPY</span>
            </>
          )}
        </button>

        {/* Fullscreen Toggle */}
        {onToggleFullscreen && (
          <button
            type="button"
            onClick={onToggleFullscreen}
            className="p-1.5 bg-swiss-canvas hover:bg-white border border-swiss-border rounded-pill text-swiss-body hover:text-swiss-ink transition-colors"
            title={isFullscreen ? "Exit Fullscreen" : "Fullscreen Sandbox"}
          >
            {isFullscreen ? (
              <Minimize2 className="w-3 h-3 text-swiss-saffron" />
            ) : (
              <Maximize2 className="w-3 h-3" />
            )}
          </button>
        )}
      </div>
    </div>
  );
}
