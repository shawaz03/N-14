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
    <header className="w-full bg-surface border-b border-edge select-none z-30 sticky top-0">
      <div className="max-w-[1920px] mx-auto px-4 h-14 flex items-center justify-between gap-4">
        {/* Left: RAIZEN Wordmark & Model Metadata */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-void border border-edge flex items-center justify-center text-signal font-bold text-lg shadow-hard-dark">
              <span className="font-fodax tracking-tighter">R</span>
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className="font-fodax text-xl tracking-wider text-text-primary uppercase font-bold">
                  RAIZEN
                </span>
                <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 bg-void border border-edge text-signal">
                  STUDIO
                </span>
              </div>
              <span className="text-[9px] font-mono text-text-muted tracking-wide">
                7.61B QLORA · CODE ENGINE
              </span>
            </div>
          </div>
        </div>

        {/* Center: Cloudflare Quick Tunnel Mission Bar */}
        <div className="flex-1 max-w-2xl hidden md:flex items-center gap-2">
          <form
            onSubmit={handleConnectSubmit}
            className="w-full flex items-center bg-void border border-edge hover:border-edge-light focus-within:border-signal transition-colors p-1"
          >
            <div className="px-2 text-text-muted flex items-center gap-1 font-mono text-xs shrink-0">
              <Terminal className="w-3.5 h-3.5 text-signal" />
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
              className="w-full bg-transparent font-mono text-xs text-text-primary placeholder:text-text-muted focus:outline-none px-2"
            />
            {connection.status === "connected" && !isEditing ? (
              <button
                type="button"
                onClick={() => connection.checkHealth()}
                title="Refresh connection status"
                className="px-2 py-1 bg-surface-elevated hover:bg-surface-active text-text-muted hover:text-text-primary font-mono text-[10px] border border-edge flex items-center gap-1 shrink-0"
              >
                <RotateCw className="w-3 h-3" />
                <span>PING</span>
              </button>
            ) : (
              <button
                type="submit"
                disabled={connection.status === "connecting" || !inputUrl.trim()}
                className="px-3 py-1 bg-signal hover:bg-signal-hover text-void font-mono font-bold text-xs shrink-0 transition-transform active:translate-y-0.5 disabled:opacity-50"
              >
                {connection.status === "connecting" ? "LINKING..." : "CONNECT"}
              </button>
            )}
          </form>

          {/* Telemetry Status Pill */}
          <div className="shrink-0 flex items-center gap-1.5 px-2.5 py-1.5 bg-void border border-edge font-mono text-[11px]">
            {connection.status === "connected" ? (
              <>
                <span className="w-2 h-2 rounded-full bg-terminal-success animate-pulse" />
                <span className="text-terminal-success font-bold uppercase">
                  ONLINE
                </span>
                {connection.latencyMs !== null && (
                  <span className="text-text-muted text-[10px] border-l border-edge pl-1.5 ml-0.5">
                    {connection.latencyMs}ms
                  </span>
                )}
              </>
            ) : connection.status === "connecting" ? (
              <>
                <Radio className="w-3 h-3 text-signal animate-spin" />
                <span className="text-signal uppercase">LINKING...</span>
              </>
            ) : (
              <>
                <span className="w-2 h-2 rounded-full bg-terminal-error" />
                <span className="text-text-muted uppercase">OFFLINE</span>
              </>
            )}
          </div>
        </div>

        {/* Right: Quick Launch GPU, GitHub, and Creator Attribution */}
        <div className="flex items-center gap-2 shrink-0">
          {onOpenColabModal && (
            <button
              onClick={onOpenColabModal}
              className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 bg-void hover:bg-surface-elevated border border-edge hover:border-signal text-text-primary text-xs font-mono transition-colors"
            >
              <Zap className="w-3.5 h-3.5 text-signal" />
              <span className="font-bold">COLAB GPU</span>
            </button>
          )}

          <a
            href="https://huggingface.co/shawaz03/RAIZEN"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden lg:flex items-center gap-1 px-2.5 py-1.5 bg-void hover:bg-surface-elevated border border-edge text-text-muted hover:text-text-primary text-xs font-mono transition-colors"
            title="RAIZEN Model on Hugging Face"
          >
            <span>🤗 HF</span>
          </a>

          <a
            href="https://github.com/shawaz03/N-14"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden lg:flex items-center gap-1 px-2.5 py-1.5 bg-void hover:bg-surface-elevated border border-edge text-text-muted hover:text-text-primary text-xs font-mono transition-colors"
            title="GitHub Repository"
          >
            <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
              <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
            </svg>
            <span>CODE</span>
          </a>

          {/* Creator Attribution Badge: SHAWAZ */}
          <a
            href="https://shawaz.vercel.app/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-3 py-1.5 bg-void border border-edge hover:border-signal text-text-primary text-xs font-mono group transition-colors shadow-hard-dark"
          >
            <span className="text-[10px] text-text-muted uppercase">BY</span>
            <span className="text-signal font-bold group-hover:underline">
              SHAWAZ
            </span>
            <ExternalLink className="w-3 h-3 text-text-muted group-hover:text-signal" />
          </a>
        </div>
      </div>
    </header>
  );
}
