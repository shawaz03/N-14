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
  const isOnline = connection.status === "connected" || isStreaming;

  return (
    <header className="w-full bg-[#111215] border-b border-[#23252A] h-8 px-4 sm:px-6 flex items-center justify-between font-frozen text-[11px] text-[#9CA3AF] select-none z-30 shrink-0">
      {/* Left Telemetry Cluster */}
      <div className="flex items-center gap-4 sm:gap-6 overflow-x-auto no-scrollbar py-0.5">
        {/* System State Indicator */}
        <div className="flex items-center gap-2 shrink-0">
          <span
            className={`w-2 h-2 rounded-full ${
              isStreaming
                ? "bg-swiss-saffron animate-radar-dot"
                : isOnline
                ? "bg-emerald-500"
                : "bg-swiss-saffron"
            }`}
          />
          <span className="font-bold text-white tracking-wide font-frozen">
            {isStreaming
              ? tokensPerSec && tokensPerSec > 0
                ? `STREAMING ${tokensPerSec.toFixed(1)} TOK/S`
                : "STREAMING"
              : isOnline
              ? `ONLINE ${connection.latencyMs || 845}MS`
              : "ONLINE 845MS"}
          </span>
        </div>

        {/* GPU Node */}
        <div className="hidden sm:flex items-center gap-1.5 shrink-0 text-[#9CA3AF] font-frozen">
          <span>COLAB GPU:</span>
          <span className="text-white font-bold">
            {connection.modelInfo?.gpu || "TESLA T4"}
          </span>
        </div>

        {/* Model ID */}
        <div className="flex items-center gap-1.5 shrink-0 text-[#9CA3AF] font-frozen">
          <span>MODEL:</span>
          <span className="text-white font-bold font-frozen tracking-wide">
            {connection.modelInfo?.model || "RAIZEN-7B"}
          </span>
        </div>

        {/* Memory */}
        <div className="hidden md:flex items-center gap-1.5 shrink-0 text-[#9CA3AF] font-frozen">
          <span>MEMORY:</span>
          <span className="text-white font-bold">5.2GB / 15GB</span>
        </div>
      </div>

      {/* Right Telemetry Cluster */}
      <div className="flex items-center gap-4 shrink-0 font-frozen">
        {/* Architecture Specs */}
        <div className="hidden lg:flex items-center gap-1 text-[#9CA3AF] font-frozen">
          <span>CONFIG:</span>
          <span className="text-white font-bold">7.61B QLORA</span>
        </div>

        {/* Creator Identity: SHAWAZ */}
        <a
          href="https://shawaz.vercel.app/"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1 text-[#9CA3AF] hover:text-swiss-saffron transition-colors group font-frozen"
          title="Creator Portfolio"
        >
          <span>CREATOR:</span>
          <span className="text-white group-hover:text-swiss-saffron font-bold font-frozen tracking-wider underline decoration-dotted decoration-swiss-saffron">
            SHAWAZ
          </span>
        </a>
      </div>
    </header>
  );
}
