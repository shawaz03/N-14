"use client";

import React from "react";
import { UseRaizenConnectionReturn } from "../types/connection";
import { List, Plus, Lightning } from "@phosphor-icons/react";
import { MotionIcon } from "./ui/MotionIcon";

interface StatusBarProps {
  connection: UseRaizenConnectionReturn;
  tokenCount?: number;
  tokensPerSec?: number | null;
  isStreaming?: boolean;
  onOpenMobileMenu?: () => void;
  onOpenColabModal?: () => void;
  onNewChat?: () => void;
}

export function StatusBar({
  connection,
  tokenCount = 0,
  tokensPerSec = null,
  isStreaming = false,
  onOpenMobileMenu,
  onOpenColabModal,
  onNewChat,
}: StatusBarProps) {
  const isOnline = connection.status === "connected" || isStreaming;

  return (
    <>
      {/* ── MOBILE ADAPTIVE HEADER (< md) ─────────────────────────── */}
      <header className="flex md:hidden w-full bg-[#111215] border-b border-[#23252A] h-12 px-3 items-center justify-between font-frozen text-xs select-none z-30 shrink-0">
        {/* Left: Mobile Navigation Drawer Trigger & Brand */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onOpenMobileMenu}
            className="p-1.5 -ml-1 rounded-md text-[#9CA3AF] hover:text-white active:bg-white/10 transition-colors flex items-center justify-center"
            title="Open Navigation Menu"
            aria-label="Open Navigation Menu"
          >
            <MotionIcon icon={List} size={22} weight="bold" animation="bounce" />
          </button>

          <div className="flex items-center gap-2">
            <span className="font-frozen text-base font-black tracking-wider text-white uppercase">
              RAIZEN
            </span>
            <span
              className={`w-2 h-2 rounded-full ${
                isStreaming
                  ? "bg-swiss-saffron animate-radar-dot"
                  : isOnline
                  ? "bg-emerald-500"
                  : "bg-swiss-saffron"
              }`}
            />
          </div>
        </div>

        {/* Right: Quick Colab GPU & New Session Actions */}
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={onOpenColabModal}
            className="px-2.5 py-1 rounded-pill bg-[#1A1C20] border border-[#2A2D35] active:border-emerald-500 text-[11px] font-bold text-gray-300 hover:text-white flex items-center gap-1 transition-all"
            title="Google Colab GPU"
          >
            <MotionIcon icon={Lightning} size={12} weight="fill" className="text-emerald-400" />
            <span>GPU</span>
          </button>

          <button
            type="button"
            onClick={onNewChat}
            className="p-1.5 rounded-pill bg-white text-[#111215] hover:bg-gray-200 active:scale-95 transition-all flex items-center justify-center font-bold"
            title="New Chat Session"
            aria-label="New Chat Session"
          >
            <MotionIcon icon={Plus} size={14} weight="bold" />
          </button>
        </div>
      </header>

      {/* ── DESKTOP PRECISION TELEMETRY BAR (≥ md) ────────────────── */}
      <header className="hidden md:flex w-full bg-[#111215] border-b border-[#23252A] h-8 px-4 sm:px-6 items-center justify-between font-frozen text-[11px] text-[#9CA3AF] select-none z-30 shrink-0">
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

        {/* Token Count */}
        {tokenCount > 0 && (
          <div className="hidden lg:flex items-center gap-1.5 shrink-0 text-[#9CA3AF] font-frozen">
            <span>TOKENS:</span>
            <span className="text-white font-bold">{tokenCount}</span>
          </div>
        )}
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
  </>
  );
}
