"use client";

import React from "react";
import { UseRaizenConnectionReturn } from "../types/connection";

interface StatusBarProps {
  connection: UseRaizenConnectionReturn;
  tokenCount?: number;
  tokensPerSec?: number | null;
  isStreaming?: boolean;
}

export function StatusBar({
  connection,
  tokenCount = 0,
  tokensPerSec = null,
  isStreaming = false,
}: StatusBarProps) {
  return (
    <footer className="w-full bg-surface border-t border-edge h-7 px-3 flex items-center justify-between font-mono text-[11px] text-text-muted select-none z-30 shrink-0">
      {/* Left Telemetry Cluster */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-0.5">
        {/* System State Indicator */}
        <div className="flex items-center gap-1.5 px-2 py-0.5 bg-void border border-edge shrink-0">
          <span
            className={`w-1.5 h-1.5 rounded-full ${
              isStreaming
                ? "bg-signal animate-pulse"
                : connection.status === "connected"
                ? "bg-terminal-success"
                : "bg-text-muted"
            }`}
          />
          <span
            className={`font-bold uppercase text-[10px] ${
              isStreaming
                ? "text-signal"
                : connection.status === "connected"
                ? "text-text-primary"
                : "text-text-muted"
            }`}
          >
            {isStreaming
              ? "STREAMING"
              : connection.status === "connected"
              ? "READY"
              : "STANDBY"}
          </span>
        </div>

        {/* Token Count & Velocity */}
        <div className="hidden sm:flex items-center gap-1.5 px-2 py-0.5 bg-void border border-edge text-[10px] shrink-0">
          <span className="text-text-muted">TOKENS:</span>
          <span className="text-text-primary font-bold">{tokenCount.toLocaleString()}</span>
          {tokensPerSec !== null && tokensPerSec > 0 && (
            <span className="text-signal border-l border-edge pl-1.5 ml-0.5">
              {tokensPerSec.toFixed(1)} t/s
            </span>
          )}
        </div>

        {/* Model ID */}
        <div className="flex items-center gap-1.5 px-2 py-0.5 bg-void border border-edge text-[10px] shrink-0">
          <span className="text-text-muted">MODEL:</span>
          <span className="text-text-primary font-bold">
            {connection.modelInfo?.model || "RAIZEN-7.61B"}
          </span>
        </div>

        {/* GPU Device & VRAM */}
        <div className="hidden md:flex items-center gap-1.5 px-2 py-0.5 bg-void border border-edge text-[10px] shrink-0">
          <span className="text-text-muted">GPU:</span>
          <span className="text-text-primary font-bold">
            {connection.modelInfo?.gpu || "TESLA T4 (4-BIT)"}
          </span>
          <span className="text-text-muted text-[9px] border-l border-edge pl-1.5 ml-0.5">
            ~5.2GB / 15GB
          </span>
        </div>
      </div>

      {/* Right Telemetry Cluster */}
      <div className="flex items-center gap-2 shrink-0">
        {/* Latency & Protocol */}
        {connection.status === "connected" && connection.latencyMs !== null && (
          <div className="hidden lg:flex items-center gap-1.5 px-2 py-0.5 bg-void border border-edge text-[10px]">
            <span className="text-text-muted">PING:</span>
            <span className="text-terminal-success font-bold">
              {connection.latencyMs}ms
            </span>
            <span className="text-text-muted text-[9px] border-l border-edge pl-1.5 ml-0.5">
              SSE/HTTPS
            </span>
          </div>
        )}

        {/* Creator Identity: SHAWAZ */}
        <a
          href="https://shawaz.vercel.app/"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1 px-2 py-0.5 bg-void hover:bg-surface-elevated border border-edge hover:border-signal text-[10px] text-text-muted hover:text-signal transition-colors group"
          title="Creator Portfolio"
        >
          <span>CREATOR:</span>
          <span className="text-text-primary group-hover:text-signal font-bold">
            SHAWAZ
          </span>
        </a>

        {/* Version Badge */}
        <div className="hidden xl:flex items-center px-2 py-0.5 bg-void border border-edge text-[10px] text-text-muted">
          <span>v1.0.0 · BRUTAL</span>
        </div>
      </div>
    </footer>
  );
}
