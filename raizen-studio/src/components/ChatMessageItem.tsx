"use client";

import React, { useState } from "react";
import { Copy, Check } from "lucide-react";
import { ChatMessage } from "../types/chat";
import { TerminalCursor } from "./TerminalCursor";
import { MarkdownRenderer } from "./MarkdownRenderer";

interface ChatMessageItemProps {
  message: ChatMessage;
  onRunInSandbox?: (code: string, language: string) => void;
}

export function ChatMessageItem({
  message,
  onRunInSandbox,
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
      <div className="w-full flex flex-col items-end my-3 select-text font-mono">
        {/* User Message Header */}
        <div className="flex items-center gap-2 mb-1 text-[11px]">
          <span className="text-signal font-bold tracking-wider">&gt; YOU</span>
          <span className="text-text-muted">{message.timestamp}</span>
        </div>

        {/* User Message Body: Flat minimal container with 1px border */}
        <div className="max-w-[85%] sm:max-w-[75%] p-3.5 bg-void border border-edge hover:border-edge-light text-text-primary text-xs leading-relaxed transition-colors shadow-hard-dark">
          <p className="whitespace-pre-wrap break-words font-mono">
            {message.content}
          </p>
        </div>
      </div>
    );
  }

  // AI Assistant Message: Brutalist flat block with 2px solid left accent border
  return (
    <div className="w-full flex flex-col items-start my-4 select-text font-mono">
      {/* AI Assistant Message Container */}
      <div className="w-full bg-surface border border-edge border-l-2 border-l-signal p-4 space-y-3 transition-colors shadow-hard-dark">
        {/* Message Top Header */}
        <div className="flex items-center justify-between border-b border-edge/60 pb-2 text-[11px]">
          <div className="flex items-center gap-2">
            <span className="text-signal font-bold tracking-wider flex items-center gap-1">
              <span className="text-signal">█</span> RAIZEN
            </span>
            <span className="text-[10px] px-1.5 py-0.2 bg-void border border-edge text-text-muted">
              7.61B
            </span>
            <span className="text-text-muted text-[10px]">
              {message.timestamp}
            </span>
          </div>

          {/* Actions: Copy & Token Badge */}
          <div className="flex items-center gap-2">
            {message.tokensCount !== undefined && message.tokensCount > 0 && (
              <span className="hidden sm:inline text-[10px] text-text-muted">
                {message.tokensCount} tokens
              </span>
            )}
            <button
              type="button"
              onClick={handleCopy}
              className="p-1 hover:bg-surface-elevated border border-transparent hover:border-edge text-text-muted hover:text-text-primary text-[10px] flex items-center gap-1 transition-colors"
              title={copied ? "Copied to Clipboard" : "Copy Message"}
            >
              {copied ? (
                <>
                  <Check className="w-3 h-3 text-terminal-success" />
                  <span className="text-terminal-success">COPIED</span>
                </>
              ) : (
                <>
                  <Copy className="w-3 h-3" />
                  <span>COPY</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Message Content Body with Rich Markdown & Code Blocks */}
        <div className="text-xs text-text-primary leading-relaxed font-mono">
          <MarkdownRenderer
            content={message.content}
            onRunInSandbox={onRunInSandbox}
          />
          {message.isStreaming && <TerminalCursor size="sm" />}
        </div>
      </div>
    </div>
  );
}
