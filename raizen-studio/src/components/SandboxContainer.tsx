"use client";

import React from "react";
import { MessageSquare, Columns, Code2, Sparkles } from "lucide-react";
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
  hasActiveSandbox = true,
  className,
}: SandboxContainerProps) {
  return (
    <div
      className={cn(
        "flex-1 w-full h-[calc(100dvh-56px-28px)] sm:h-[calc(100vh-56px-28px)] flex flex-col bg-swiss-canvas overflow-hidden select-none font-sans relative",
        className
      )}
    >
      {/* Workspace Control Bar */}
      <div className="w-full h-9 bg-white border-b border-swiss-border flex items-center justify-between px-3 text-xs shrink-0 select-none z-10 shadow-swiss">
        {/* Left: Workspace Title */}
        <div className="flex items-center gap-2">
          <span className="text-[10px] text-swiss-muted font-bold uppercase tracking-wider hidden sm:inline font-frozen">
            WORKSPACE:
          </span>
          <span className="text-[10px] text-swiss-saffron font-bold font-frozen">
            {viewMode === "split"
              ? "DUAL SPLIT ENGINE"
              : viewMode === "sandbox"
              ? "LIVE CODE ENGINE"
              : "CHAT STUDIO"}
          </span>
        </div>

        {/* Right: Layout Mode Toggles */}
        <div className="flex items-center bg-swiss-canvas border border-swiss-border p-0.5 rounded-pill">
          {/* Chat Mode */}
          <button
            type="button"
            onClick={() => onViewModeChange("chat")}
            className={cn(
              "flex items-center gap-1 px-3 py-1 text-[10px] uppercase font-bold transition-all rounded-pill font-frozen",
              viewMode === "chat"
                ? "bg-swiss-saffron text-white shadow-swiss-saffron"
                : "text-swiss-muted hover:text-swiss-ink"
            )}
            title="Chat Terminal View"
          >
            <MessageSquare className="w-2.5 h-2.5" />
            <span>CHAT</span>
          </button>

          {/* Split Mode */}
          <button
            type="button"
            onClick={() => onViewModeChange("split")}
            className={cn(
              "hidden lg:flex items-center gap-1 px-3 py-1 text-[10px] uppercase font-bold transition-all rounded-pill font-frozen",
              viewMode === "split"
                ? "bg-swiss-saffron text-white shadow-swiss-saffron"
                : "text-swiss-muted hover:text-swiss-ink"
            )}
            title="Split-Pane Dual View"
          >
            <Columns className="w-2.5 h-2.5" />
            <span>SPLIT</span>
          </button>

          {/* Sandbox Mode */}
          <button
            type="button"
            onClick={() => onViewModeChange("sandbox")}
            className={cn(
              "flex items-center gap-1 px-3 py-1 text-[10px] uppercase font-bold transition-all rounded-pill font-frozen relative",
              viewMode === "sandbox"
                ? "bg-swiss-saffron text-white shadow-swiss-saffron"
                : "text-swiss-muted hover:text-swiss-ink"
            )}
            title="Live Sandbox View"
          >
            <Code2 className="w-2.5 h-2.5" />
            <span>SANDBOX</span>
            {hasActiveSandbox && viewMode !== "sandbox" && (
              <span className="w-1.5 h-1.5 bg-swiss-saffron rounded-full animate-ping inline-block ml-0.5" />
            )}
          </button>
        </div>
      </div>

      {/* Main Workspace View Grid */}
      <div className="flex-1 w-full h-[calc(100%-36px)] flex overflow-hidden relative">
        {/* Left Pane: Chat Terminal */}
        <div
          className={cn(
            "h-full flex flex-col transition-all duration-150 overflow-hidden",
            viewMode === "chat" && "w-full",
            viewMode === "split" && "w-full lg:w-1/2 border-r border-swiss-border",
            viewMode === "sandbox" && "hidden"
          )}
        >
          {chatSlot}
        </div>

        {/* Right Pane: Live Code Sandbox */}
        <div
          className={cn(
            "h-full flex flex-col transition-all duration-150 overflow-hidden bg-white",
            viewMode === "sandbox" && "w-full",
            viewMode === "split" && "hidden lg:flex lg:w-1/2",
            viewMode === "chat" && "hidden"
          )}
        >
          {sandboxSlot}
        </div>

        {/* Mobile Floating Quick Switch Pill */}
        {hasActiveSandbox && viewMode === "chat" && (
          <button
            type="button"
            onClick={() => onViewModeChange("sandbox")}
            className="lg:hidden absolute bottom-20 right-4 z-20 flex items-center gap-1.5 px-3 py-2 bg-swiss-saffron text-white rounded-pill font-frozen font-bold text-xs shadow-swiss-saffron animate-bounce"
            title="Jump to Live Sandbox Preview"
          >
            <Sparkles className="w-3.5 h-3.5 fill-current" />
            <span>VIEW SANDBOX</span>
          </button>
        )}
      </div>
    </div>
  );
}
