"use client";

import React, { useState } from "react";
import { Copy, Check, Sparkle } from "@phosphor-icons/react";
import { MotionIcon } from "./ui/MotionIcon";
import { ChatMessage } from "../types/chat";
import { MarkdownRenderer } from "./MarkdownRenderer";

interface ChatMessageItemProps {
  message: ChatMessage;
  onSaveSnippet?: (code: string, language: string, filename?: string) => void;
}

export function ChatMessageItem({
  message,
  onSaveSnippet,
}: ChatMessageItemProps) {
  const [copied, setCopied] = useState(false);
  const isUser = message.role === "user";

  const handleCopy = () => {
    navigator.clipboard.writeText(message.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (isUser) {
    return (
      <div className="w-full flex flex-col items-end my-3 select-text animate-in fade-in duration-200">
        {/* User Message Header */}
        <div className="flex items-center gap-2 mb-1 text-[11px] font-mono">
          <span className="text-swiss-saffron font-bold font-frozen">SHAWAZ (You)</span>
          <span className="text-swiss-muted">{message.timestamp}</span>
        </div>

        {/* User Message Body: Solid Obsidian Monolith Pill Card */}
        <div className="max-w-[85%] sm:max-w-[75%] p-3.5 px-4 bg-swiss-saffron text-white text-sm sm:text-[15px] leading-relaxed rounded-2xl rounded-tr-sm shadow-swiss border border-black/10">
          <p className="whitespace-pre-wrap break-words font-sans font-medium text-white">
            {message.content}
          </p>
        </div>
      </div>
    );
  }

  // If an assistant message is actively streaming but has not yet accumulated any tokens,
  // suppress rendering the empty "ghost card" so the unboxed Quantum Orbital Triad can breathe.
  if (message.isStreaming && (!message.content || !message.content.trim())) {
    return null;
  }

  // AI Assistant Message: Swiss Matte White Card with Hairline Borders
  return (
    <div className="w-full flex flex-col items-start my-4 select-text animate-in fade-in duration-200">
      {/* AI Assistant Message Container */}
      <div className="w-full bg-white border border-swiss-border-card rounded-card p-4 sm:p-5 space-y-3 shadow-swiss transition-all">
        {/* Message Top Header */}
        <div className="flex items-center justify-between border-b border-swiss-border/60 pb-2.5 text-[11px]">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-md bg-swiss-saffron-tint text-swiss-saffron flex items-center justify-center font-frozen text-[10px] font-bold">
              <MotionIcon icon={Sparkle} size={11} weight="duotone" animation="pulse" />
            </div>
            <span className="text-swiss-ink font-bold tracking-wider font-frozen text-sm sm:text-base uppercase">
              RAIZEN Engine
            </span>
            <span className="text-[10px] px-1.5 py-0.5 rounded-pill bg-swiss-saffron-tint text-swiss-saffron-text font-bold font-mono border border-swiss-saffron/20">
              7.61B
            </span>
            <span className="text-swiss-muted text-[10.5px] font-mono">
              {message.timestamp}
            </span>
          </div>

          {/* Actions: Copy & Token Count */}
          <div className="flex items-center gap-2 font-mono">
            {message.tokensCount !== undefined && message.tokensCount > 0 && (
              <span className="hidden sm:inline text-[10px] text-swiss-muted font-mono">
                {message.tokensCount} tokens
              </span>
            )}
            <button
              type="button"
              onClick={handleCopy}
              className="p-1 px-2.5 rounded-pill btn-glass-light btn-glass-shine text-swiss-muted hover:text-swiss-ink text-[10.5px] flex items-center gap-1.5 transition-all font-mono"
              title={copied ? "Copied to Clipboard" : "Copy Message"}
            >
              {copied ? (
                <>
                  <MotionIcon icon={Check} size={12} weight="bold" className="text-emerald-600" />
                  <span className="text-emerald-600 font-bold">COPIED</span>
                </>
              ) : (
                <>
                  <MotionIcon icon={Copy} size={12} weight="duotone" animation="bounce" />
                  <span>COPY</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Message Content Body with Markdown, Code Blocks & Reasoning */}
        <div className="text-sm sm:text-[15px] text-swiss-ink leading-relaxed font-sans">
          <MarkdownRenderer
            content={message.content}
            onSaveSnippet={onSaveSnippet}
          />
        </div>
      </div>
    </div>
  );
}
