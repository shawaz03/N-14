"use client";

import React from "react";
import { MessageSquare, Columns, Code2 } from "lucide-react";
import { cn } from "../lib/utils";

export type WorkspaceViewMode = "chat" | "split" | "sandbox";

interface SandboxContainerProps {
  viewMode: WorkspaceViewMode;
  onViewModeChange: (mode: WorkspaceViewMode) => void;
  chatSlot: React.ReactNode;
  sandboxSlot: React.ReactNode;
  hasActiveSandbox?: boolean;
  className?: string;
}

export function SandboxContainer({
  viewMode,
  onViewModeChange,
  chatSlot,
  sandboxSlot,
  hasActiveSandbox = false,
  className,
}: SandboxContainerProps) {
  return (
    <div
      className={cn(
        "flex-1 w-full h-[calc(100vh-45px-28px)] flex flex-col bg-void overflow-hidden select-none font-mono",
        className
      )}
    >
      {/* Workspace Control Bar (Visible when sandbox is loaded or on larger screens) */}
      <div className="w-full h-8 bg-surface border-b border-edge flex items-center justify-between px-3 text-xs shrink-0 select-none">
        {/* Left: Workspace Title */}
        <div className="flex items-center gap-2">
          <span className="text-[10px] text-text-muted font-bold uppercase tracking-wider">
            WORKSPACE:
          </span>
          <span className="text-[10px] text-signal font-bold">
            {viewMode === "split"
              ? "DUAL SPLIT ENGINE"
              : viewMode === "sandbox"
              ? "LIVE CODE ENGINE"
              : "TERMINAL MISSION CONTROL"}
          </span>
        </div>

        {/* Right: Layout Mode Toggles */}
        <div className="flex items-center bg-void border border-edge p-0.5">
          {/* Chat Mode */}
          <button
            type="button"
            onClick={() => onViewModeChange("chat")}
            className={cn(
              "flex items-center gap-1 px-2 py-0.5 text-[10px] uppercase font-bold transition-colors",
              viewMode === "chat"
                ? "bg-signal text-void shadow-hard-sm"
                : "text-text-muted hover:text-text-primary hover:bg-surface-elevated"
            )}
            title="Chat Terminal Fullscreen"
          >
            <MessageSquare className="w-2.5 h-2.5" />
            <span className="hidden sm:inline">CHAT</span>
          </button>

          {/* Split Mode */}
          <button
            type="button"
            onClick={() => onViewModeChange("split")}
            className={cn(
              "flex items-center gap-1 px-2 py-0.5 text-[10px] uppercase font-bold transition-colors",
              viewMode === "split"
                ? "bg-signal text-void shadow-hard-sm"
                : "text-text-muted hover:text-text-primary hover:bg-surface-elevated"
            )}
            title="Split-Pane Dual View (Ctrl+\)"
          >
            <Columns className="w-2.5 h-2.5" />
            <span className="hidden sm:inline">SPLIT</span>
          </button>

          {/* Sandbox Mode */}
          <button
            type="button"
            onClick={() => onViewModeChange("sandbox")}
            className={cn(
              "flex items-center gap-1 px-2 py-0.5 text-[10px] uppercase font-bold transition-colors relative",
              viewMode === "sandbox"
                ? "bg-signal text-void shadow-hard-sm"
                : "text-text-muted hover:text-text-primary hover:bg-surface-elevated"
            )}
            title="Live Sandbox Fullscreen"
          >
            <Code2 className="w-2.5 h-2.5" />
            <span className="hidden sm:inline">SANDBOX</span>
            {hasActiveSandbox && viewMode !== "sandbox" && (
              <span className="w-1.5 h-1.5 bg-signal rounded-full animate-pulse inline-block ml-0.5" />
            )}
          </button>
        </div>
      </div>

      {/* Main Workspace Split Grid */}
      <div className="flex-1 w-full h-[calc(100%-32px)] flex overflow-hidden">
        {/* Left Pane: Chat Terminal */}
        <div
          className={cn(
            "h-full flex flex-col transition-all duration-150 overflow-hidden",
            viewMode === "chat" && "w-full",
            viewMode === "split" && "w-full lg:w-1/2 border-r border-edge",
            viewMode === "sandbox" && "hidden"
          )}
        >
          {chatSlot}
        </div>

        {/* Right Pane: Live Code Sandbox */}
        <div
          className={cn(
            "h-full flex flex-col transition-all duration-150 overflow-hidden bg-void",
            viewMode === "sandbox" && "w-full",
            viewMode === "split" && "hidden lg:flex lg:w-1/2",
            viewMode === "chat" && "hidden"
          )}
        >
          {sandboxSlot}
        </div>
      </div>
    </div>
  );
}
