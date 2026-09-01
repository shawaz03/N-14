"use client";

import React, { useState } from "react";
import {
  Terminal,
  ExternalLink,
  Zap,
  Radio,
  RotateCw,
} from "lucide-react";
import { UseRaizenConnectionReturn } from "../types/connection";

interface HeaderProps {
  connection: UseRaizenConnectionReturn;
  onOpenColabModal?: () => void;
}

export function Header({ connection, onOpenColabModal }: HeaderProps) {
  const [inputUrl, setInputUrl] = useState(connection.tunnelUrl);
  const [isEditing, setIsEditing] = useState(false);

  // Sync state if connection.tunnelUrl changes from localStorage
  React.useEffect(() => {
    setInputUrl(connection.tunnelUrl);
  }, [connection.tunnelUrl]);

  const handleConnectSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputUrl.trim()) {
      connection.connect(inputUrl.trim());
      setIsEditing(false);
    }
  };

  return (
    <header className="w-full bg-white border-b border-swiss-border select-none z-30 sticky top-0 shadow-swiss">
      <div className="max-w-[1920px] mx-auto px-4 h-14 flex items-center justify-between gap-4">
        {/* Left: RAIZEN Wordmark & Model Metadata */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-swiss-saffron-tint rounded-lg flex items-center justify-center text-swiss-saffron font-bold text-lg font-frozen">
              ✦
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className="font-frozen text-lg tracking-wider text-swiss-ink uppercase font-bold">
                  RAIZEN
                </span>
                <span className="text-[10px] uppercase font-frozen px-1.5 py-0.5 bg-swiss-saffron-tint border border-swiss-saffron/20 text-swiss-saffron-text rounded-pill">
                  STUDIO
                </span>
              </div>
              <span className="text-[9.5px] font-mono text-swiss-muted tracking-wide">
                7.61B QLORA · CODE ENGINE
              </span>
            </div>
          </div>
        </div>

        {/* Center: Cloudflare Quick Tunnel Mission Bar */}
        <div className="flex-1 max-w-2xl hidden md:flex items-center gap-2">
          <form
            onSubmit={handleConnectSubmit}
            className="w-full flex items-center bg-swiss-canvas border border-swiss-border hover:border-swiss-border-card focus-within:border-swiss-saffron transition-colors rounded-pill p-1 shadow-sm"
          >
            <div className="px-2 text-swiss-muted flex items-center gap-1 font-mono text-xs shrink-0">
              <Terminal className="w-3.5 h-3.5 text-swiss-saffron" />
              <span>TUNNEL:</span>
            </div>
            <input
              type="text"
              value={inputUrl}
              onChange={(e) => {
                setInputUrl(e.target.value);
                setIsEditing(true);
              }}
              placeholder="Paste Cloudflare URL (e.g. https://*.trycloudflare.com)"
              className="w-full bg-transparent font-mono text-xs text-swiss-ink placeholder:text-swiss-muted/60 focus:outline-none px-2"
            />
            {connection.status === "connected" && !isEditing ? (
              <button
                type="button"
                onClick={() => connection.checkHealth()}
                title="Refresh connection status"
                className="px-2.5 py-1 bg-white hover:bg-swiss-canvas text-swiss-body hover:text-swiss-ink font-mono text-[10px] border border-swiss-border rounded-pill flex items-center gap-1 shrink-0 transition-colors"
              >
                <RotateCw className="w-3 h-3" />
                <span>PING</span>
              </button>
            ) : (
              <button
                type="submit"
                disabled={connection.status === "connecting" || !inputUrl.trim()}
                className="px-4 py-1 bg-swiss-saffron hover:bg-swiss-saffron-hover text-white font-frozen font-bold text-xs rounded-pill shrink-0 transition-transform active:scale-95 disabled:opacity-50 shadow-swiss-saffron"
              >
                {connection.status === "connecting" ? "LINKING..." : "CONNECT"}
              </button>
            )}
          </form>

          {/* Telemetry Status Pill */}
          <div className="shrink-0 flex items-center gap-1.5 px-3 py-1 bg-white border border-swiss-border rounded-pill font-mono text-[11px]">
            {connection.status === "connected" ? (
              <>
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-emerald-700 font-bold uppercase font-frozen text-[10px]">
                  ONLINE
                </span>
                {connection.latencyMs !== null && (
                  <span className="text-swiss-muted text-[10px] border-l border-swiss-border pl-1.5 ml-0.5">
                    {connection.latencyMs}ms
                  </span>
                )}
              </>
            ) : connection.status === "connecting" ? (
              <>
                <Radio className="w-3 h-3 text-swiss-saffron animate-spin" />
                <span className="text-swiss-saffron uppercase font-frozen text-[10px]">LINKING...</span>
              </>
            ) : (
              <>
                <span className="w-2 h-2 rounded-full bg-red-500" />
                <span className="text-swiss-muted uppercase font-frozen text-[10px]">OFFLINE</span>
              </>
            )}
          </div>
        </div>

        {/* Right: Quick Launch GPU, GitHub, and Creator Attribution */}
        <div className="flex items-center gap-2 shrink-0">
          {onOpenColabModal && (
            <button
              onClick={onOpenColabModal}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-swiss-canvas hover:bg-white border border-swiss-border hover:border-swiss-border-card text-swiss-ink text-xs font-frozen font-bold rounded-pill transition-all"
            >
              <Zap className="w-3.5 h-3.5 text-swiss-saffron" />
              <span>COLAB GPU</span>
            </button>
          )}

          <a
            href="https://huggingface.co/shawaz03/RAIZEN"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden lg:flex items-center gap-1 px-3 py-1.5 bg-swiss-canvas hover:bg-white border border-swiss-border text-swiss-muted hover:text-swiss-ink text-xs font-mono rounded-pill transition-colors"
            title="RAIZEN Model on Hugging Face"
          >
            <span>🤗 HF</span>
          </a>

          {/* Creator Attribution Badge: SHAWAZ */}
          <a
            href="https://shawaz.vercel.app/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-swiss-border hover:border-swiss-saffron text-swiss-ink text-xs font-frozen rounded-pill group transition-colors shadow-swiss"
          >
            <span className="text-[10px] text-swiss-muted uppercase">BY</span>
            <span className="text-swiss-saffron font-bold group-hover:underline">
              SHAWAZ
            </span>
            <ExternalLink className="w-3 h-3 text-swiss-muted group-hover:text-swiss-saffron" />
          </a>
        </div>
      </div>
    </header>
  );
}
