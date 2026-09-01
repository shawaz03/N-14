"use client";

import React, { useState, useRef, useEffect } from "react";
import { Send, Square, Trash2, Sliders, Paperclip, Mic } from "lucide-react";
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
    <div className={cn("w-full flex flex-col gap-2 select-none", className)}>
      {/* Main Command Input Capsule */}
      <div className="relative w-full bg-white rounded-2xl border border-swiss-border hover:border-swiss-border-card focus-within:border-swiss-saffron transition-all shadow-swiss">
        {/* Settings Bar if toggled */}
        {showSettings && (
          <div className="flex items-center justify-between px-4 py-2 bg-swiss-canvas border-b border-swiss-border rounded-t-2xl text-[11px] font-frozen">
            <div className="flex items-center gap-2">
              <span className="text-swiss-muted font-bold">SAMPLING TEMPERATURE:</span>
              <input
                type="range"
                min="0.0"
                max="1.0"
                step="0.05"
                value={temperature}
                onChange={(e) => setTemperature(parseFloat(e.target.value))}
                className="w-24 accent-swiss-saffron h-1.5 bg-swiss-border rounded-pill cursor-pointer"
              />
              <span className="text-swiss-saffron font-bold">{temperature.toFixed(2)}</span>
            </div>

            <span className="text-[10px] text-swiss-muted">
              (0.2 = Deterministic React, 0.7 = Creative)
            </span>
          </div>
        )}

        <div className="flex items-end p-2.5 sm:p-3 gap-2">
          {/* Accessory Buttons: Attach & Voice */}
          <div className="flex items-center gap-1 pb-1">
            <button
              type="button"
              className="p-1.5 rounded-full hover:bg-swiss-canvas text-swiss-muted hover:text-swiss-ink transition-colors"
              title="Attach File or Context"
            >
              <Paperclip className="w-4 h-4" />
            </button>
            <button
              type="button"
              className="p-1.5 rounded-full hover:bg-swiss-canvas text-swiss-muted hover:text-swiss-ink transition-colors"
              title="Voice Input"
            >
              <Mic className="w-4 h-4" />
            </button>
          </div>

          {/* Auto-grow Textarea in Plus Jakarta Sans */}
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
                : "Ask RAIZEN to design a component, write logic, or refactor... (Enter to send)"
            }
            className="w-full bg-transparent resize-none outline-none font-sans text-sm sm:text-[15px] text-swiss-ink placeholder:text-swiss-muted/60 leading-relaxed py-1 min-h-[28px] max-h-[200px]"
          />

          {/* Right Action Controls */}
          <div className="flex items-center gap-1.5 shrink-0 select-none pb-0.5">
            {/* Clear Screen */}
            <button
              type="button"
              onClick={onClearChat}
              className="p-2 rounded-full hover:bg-red-50 text-swiss-muted hover:text-red-600 transition-colors"
              title="Clear Conversation"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>

            {/* Temperature Settings Toggle */}
            <button
              type="button"
              onClick={() => setShowSettings(!showSettings)}
              className={cn(
                "p-2 rounded-full transition-colors text-[11px] flex items-center gap-1 font-mono",
                showSettings
                  ? "bg-swiss-saffron text-white font-bold"
                  : "hover:bg-swiss-canvas text-swiss-muted hover:text-swiss-ink"
              )}
              title="Model Sampling Temperature"
            >
              <Sliders className="w-3.5 h-3.5" />
            </button>

            {/* Send or Stop Button */}
            {isStreaming ? (
              <button
                type="button"
                onClick={onStopStreaming}
                className="flex items-center gap-1 px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-pill uppercase transition-all shadow-sm active:scale-95 font-frozen"
                title="Stop generation (ESC)"
              >
                <Square className="w-3 h-3 fill-current" />
                <span>STOP</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSend}
                disabled={disabled || !input.trim()}
                className={cn(
                  "flex items-center gap-1.5 px-4 py-2 rounded-pill font-bold text-xs uppercase tracking-wider transition-all shadow-swiss-saffron active:scale-95 font-frozen",
                  input.trim() && !disabled
                    ? "bg-swiss-saffron hover:bg-swiss-saffron-hover text-white shadow-md cursor-pointer"
                    : "bg-swiss-border text-swiss-muted cursor-not-allowed opacity-60"
                )}
                title="Send Message (Enter)"
              >
                <span>SEND</span>
                <Send className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Micro-Attribution & Keyboard Hint */}
      <div className="flex items-center justify-between px-3 text-[10.5px] text-swiss-muted font-mono select-none">
        <span className="font-frozen tracking-wider">
          MODEL: <strong className="text-swiss-ink font-frozen">RAIZEN 7B</strong> · DEVELOPED BY{" "}
          <a
            href="https://shawaz.vercel.app/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-swiss-saffron hover:underline font-bold font-frozen"
          >
            SHAWAZ
          </a>
        </span>
        <span className="hidden sm:inline text-swiss-muted">
          Press <kbd className="px-1.5 py-0.5 bg-swiss-canvas border border-swiss-border rounded text-[9.5px]">Enter</kbd> to send ·{" "}
          <kbd className="px-1.5 py-0.5 bg-swiss-canvas border border-swiss-border rounded text-[9.5px]">Shift+Enter</kbd> for newline
        </span>
      </div>
    </div>
  );
}
