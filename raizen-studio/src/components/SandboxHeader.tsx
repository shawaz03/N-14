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
        "w-full h-9 bg-surface border-b border-edge flex items-center justify-between px-3 text-xs select-none font-mono shrink-0",
        className
      )}
    >
      {/* Left: Dual Engine Tab Switcher */}
      <div className="flex items-center gap-1 bg-void border border-edge p-0.5">
        <button
          type="button"
          onClick={() => onTabChange("editor")}
          className={cn(
            "flex items-center gap-1.5 px-2.5 py-1 text-[10px] font-bold uppercase transition-colors",
            activeTab === "editor"
              ? "bg-signal text-void shadow-hard-sm"
              : "text-text-muted hover:text-text-primary hover:bg-surface-elevated"
          )}
          title="Switch to Monaco Code Editor"
        >
          <Code className="w-3 h-3" />
          <span>CODE EDITOR</span>
        </button>

        <button
          type="button"
          onClick={() => onTabChange("preview")}
          className={cn(
            "flex items-center gap-1.5 px-2.5 py-1 text-[10px] font-bold uppercase transition-colors",
            activeTab === "preview"
              ? "bg-signal text-void shadow-hard-sm"
              : "text-text-muted hover:text-text-primary hover:bg-surface-elevated"
          )}
          title="Switch to Live Component Preview"
        >
          <Eye className="w-3 h-3" />
          <span>LIVE PREVIEW</span>
        </button>
      </div>

      {/* Middle: Active File & Language Pill (Hidden on extra small screens) */}
      <div className="hidden sm:flex items-center gap-2 text-[10px] text-text-muted">
        <div className="flex items-center gap-1 text-text-primary font-bold">
          <FileCode className="w-3 h-3 text-signal" />
          <span>{filename}</span>
        </div>
        <span className="px-1.5 py-0.2 bg-void border border-edge uppercase text-[9px]">
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
            className="p-1.5 bg-void hover:bg-surface-elevated border border-edge text-text-muted hover:text-text-primary transition-colors text-[10px] flex items-center gap-1"
            title="Download Standalone Component HTML/TSX"
          >
            <Download className="w-3 h-3 text-signal" />
            <span className="hidden md:inline">EXPORT</span>
          </button>
        )}

        {/* Reset Code */}
        {onReset && (
          <button
            type="button"
            onClick={onReset}
            className="p-1.5 bg-void hover:bg-surface-elevated border border-edge text-text-muted hover:text-text-primary transition-colors text-[10px] flex items-center gap-1"
            title="Reset to Initial Code"
          >
            <RotateCcw className="w-3 h-3" />
            <span className="hidden md:inline">RESET</span>
          </button>
        )}

        {/* Copy Code */}
        <button
          type="button"
          onClick={handleCopy}
          className="p-1.5 bg-void hover:bg-surface-elevated border border-edge text-text-muted hover:text-text-primary transition-colors text-[10px] flex items-center gap-1"
          title={copied ? "Copied to Clipboard" : "Copy Code"}
        >
          {copied ? (
            <>
              <Check className="w-3 h-3 text-terminal-success" />
              <span className="text-terminal-success hidden md:inline">COPIED</span>
            </>
          ) : (
            <>
              <Copy className="w-3 h-3" />
              <span className="hidden md:inline">COPY</span>
            </>
          )}
        </button>

        {/* Fullscreen Toggle */}
        {onToggleFullscreen && (
          <button
            type="button"
            onClick={onToggleFullscreen}
            className="p-1.5 bg-void hover:bg-surface-elevated border border-edge text-text-muted hover:text-text-primary transition-colors"
            title={isFullscreen ? "Exit Fullscreen" : "Fullscreen Sandbox"}
          >
            {isFullscreen ? (
              <Minimize2 className="w-3 h-3 text-signal" />
            ) : (
              <Maximize2 className="w-3 h-3" />
            )}
          </button>
        )}
      </div>
    </div>
  );
}
