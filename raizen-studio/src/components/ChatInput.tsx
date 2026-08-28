"use client";

import React, { useState, useRef, useEffect } from "react";
import { Send, Square, Trash2, Sliders, CornerDownLeft } from "lucide-react";
import { QuickActions } from "./QuickActions";
import { cn } from "../lib/utils";

interface ChatInputProps {
  onSendMessage: (prompt: string, temperature: number) => void;
  isStreaming: boolean;
  onStopStreaming: () => void;
  onClearChat: () => void;
  disabled?: boolean;
  className?: string;
}

export function ChatInput({
  onSendMessage,
  isStreaming,
  onStopStreaming,
  onClearChat,
  disabled = false,
  className,
}: ChatInputProps) {
  const [input, setInput] = useState("");
  const [temperature, setTemperature] = useState(0.2);
  const [showSettings, setShowSettings] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  // Auto-resize textarea based on input content
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.min(
        textareaRef.current.scrollHeight,
        200
      )}px`;
    }
  }, [input]);

  const handleSend = () => {
    const trimmed = input.trim();
    if (!trimmed || isStreaming || disabled) return;

    onSendMessage(trimmed, temperature);
    setInput("");
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleSelectQuickPrompt = (promptText: string) => {
    setInput(promptText);
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  };

  return (
    <div className={cn("w-full flex flex-col gap-1.5 font-mono", className)}>
      {/* Quick Action Preset Prompt Chips */}
      <QuickActions onSelectPrompt={handleSelectQuickPrompt} />

      {/* Main Command Input Box */}
      <div className="relative w-full bg-surface border border-edge hover:border-edge-light focus-within:border-signal transition-colors shadow-hard-dark">
        {/* Settings Bar if toggled */}
        {showSettings && (
          <div className="flex items-center justify-between px-3 py-1.5 bg-void border-b border-edge text-[11px] select-none">
            <div className="flex items-center gap-2">
              <span className="text-text-muted">TEMPERATURE:</span>
              <input
                type="range"
                min="0.0"
                max="1.0"
                step="0.05"
                value={temperature}
                onChange={(e) => setTemperature(parseFloat(e.target.value))}
                className="w-24 accent-signal h-1 bg-edge cursor-pointer"
              />
              <span className="text-signal font-bold">{temperature.toFixed(2)}</span>
            </div>

            <span className="text-[10px] text-text-muted">
              (0.2 = Deterministic Code, 0.7 = Creative)
            </span>
          </div>
        )}

        <div className="flex items-start p-2.5 gap-2">
          {/* Command Prompt Prefix */}
          <div className="flex items-center text-signal font-bold select-none pt-1">
            <span className="text-sm">&gt;</span>
          </div>

          {/* Monospace Auto-grow Textarea */}
          <textarea
            ref={textareaRef}
            rows={1}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={disabled}
            placeholder={
              disabled
                ? "Connect Colab GPU in header to start prompting..."
                : "Enter code command or prompt... (Enter to send, Shift+Enter for new line)"
            }
            className="w-full bg-transparent resize-none outline-none font-mono text-xs text-text-primary placeholder:text-text-muted/60 leading-relaxed py-1 min-h-[24px] max-h-[200px]"
          />

          {/* Right Action Controls */}
          <div className="flex items-center gap-1.5 shrink-0 select-none pt-0.5">
            {/* Clear Screen */}
            <button
              type="button"
              onClick={onClearChat}
              className="p-1.5 bg-void hover:bg-surface-elevated border border-edge text-text-muted hover:text-terminal-error transition-colors"
              title="Clear Terminal Screen (Ctrl+L)"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>

            {/* Temperature Settings Toggle */}
            <button
              type="button"
              onClick={() => setShowSettings(!showSettings)}
              className={cn(
                "p-1.5 border transition-colors text-[11px] flex items-center gap-1 font-mono",
                showSettings
                  ? "bg-signal text-void border-signal font-bold"
                  : "bg-void hover:bg-surface-elevated border-edge text-text-muted hover:text-text-primary"
              )}
              title="Model Sampling Temperature"
            >
              <Sliders className="w-3.5 h-3.5" />
              <span className="hidden sm:inline text-[10px]">
                {temperature.toFixed(1)}
              </span>
            </button>

            {/* Send or Stop Button */}
            {isStreaming ? (
              <button
                type="button"
                onClick={onStopStreaming}
                className="flex items-center gap-1 px-3 py-1.5 bg-terminal-error hover:bg-terminal-error/90 text-void font-bold text-xs uppercase transition-transform active:translate-y-0.5 shadow-hard-sm"
                title="Halt Generation (Esc)"
              >
                <Square className="w-3 h-3 fill-current" />
                <span className="hidden sm:inline">STOP</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSend}
                disabled={!input.trim() || disabled}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-signal hover:bg-signal-hover disabled:bg-edge disabled:text-text-muted disabled:cursor-not-allowed text-void font-bold text-xs uppercase transition-transform active:translate-y-0.5 shadow-hard-sm"
                title="Send Command (Enter)"
              >
                <span className="hidden sm:inline">SEND</span>
                <Send className="w-3 h-3 hidden sm:inline" />
                <CornerDownLeft className="w-3 h-3 sm:hidden" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
