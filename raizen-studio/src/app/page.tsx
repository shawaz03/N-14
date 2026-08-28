"use client";

import React, { useState, useRef, useEffect } from "react";
import { Header } from "../components/Header";
import { StatusBar } from "../components/StatusBar";
import { ColabModal } from "../components/ColabModal";
import { SandboxContainer, WorkspaceViewMode } from "../components/SandboxContainer";
import { ChatMessageItem } from "../components/ChatMessageItem";
import { StreamingIndicator } from "../components/StreamingIndicator";
import { ChatInput } from "../components/ChatInput";
import { SandboxHeader } from "../components/SandboxHeader";
import { CodeEditor } from "../components/CodeEditor";
import { ComponentPreview } from "../components/ComponentPreview";
import { ToastContainer } from "../components/Toast";
import { useRaizenConnection } from "../hooks/useRaizenConnection";
import { useRaizenChat } from "../hooks/useRaizenChat";
import { useSandboxBridge } from "../hooks/useSandboxBridge";
import { useKeyboardShortcuts } from "../hooks/useKeyboardShortcuts";
import { useToast } from "../hooks/useToast";
import { useCodeExport } from "../hooks/useCodeExport";

export default function RaizenStudioPage() {
  // 1. Connection Hook
  const connection = useRaizenConnection();

  // 2. Chat Conversation Hook
  const {
    messages,
    isStreaming,
    totalTokens,
    tokensPerSec,
    error: chatError,
    sendMessage,
    stopStreaming,
    clearMessages,
  } = useRaizenChat();

  // 3. Sandbox Live Bridge Hook
  const {
    code,
    language,
    filename,
    activeTab,
    loadCode,
    updateCode,
    resetCode,
    setActiveTab,
  } = useSandboxBridge();

  // 4. Code Export Hook
  const { downloadHtml } = useCodeExport();

  // 5. Toast Notification Hook
  const { toasts, showToast, dismissToast } = useToast();

  // 6. UI View States
  const [viewMode, setViewMode] = useState<WorkspaceViewMode>("split");
  const [isColabModalOpen, setIsColabModalOpen] = useState<boolean>(false);
  const chatScrollRef = useRef<HTMLDivElement | null>(null);

  // Auto-scroll chat to bottom on new messages / tokens
  useEffect(() => {
    if (chatScrollRef.current) {
      chatScrollRef.current.scrollTop = chatScrollRef.current.scrollHeight;
    }
  }, [messages, isStreaming]);

  // 7. Global Keyboard Shortcuts
  useKeyboardShortcuts({
    isStreaming,
    onStopStreaming: () => {
      stopStreaming();
      showToast("Stream execution halted by user", "warning", "PROCESS STOPPED");
    },
    onClearChat: () => {
      clearMessages();
      showToast("Terminal screen and history cleared", "info", "TERMINAL CLEARED");
    },
    onToggleSandbox: () => {
      setViewMode((prev) => (prev === "split" ? "chat" : "split"));
    },
  });

  const handleSendMessage = (prompt: string, temperature: number) => {
    sendMessage(prompt, connection.tunnelUrl, temperature);
  };

  const handleRunInSandbox = (codeToRun: string, codeLang: string) => {
    loadCode(codeToRun, codeLang);
    showToast("Code extracted and loaded into Live Sandbox", "success", "SANDBOX RUNNING");
    // If in chat-only mode, automatically switch to split view so user sees the preview
    if (viewMode === "chat") {
      setViewMode("split");
    }
  };

  const handleExportCode = () => {
    downloadHtml(code, language, "RaizenWidget.html");
    showToast("Exported standalone portable HTML component", "success", "FILE DOWNLOADED");
  };

  return (
    <div className="w-screen h-screen flex flex-col bg-void text-text-primary overflow-hidden select-none font-mono">
      {/* 1. Mission Control Header Bar */}
      <Header
        connection={connection}
        onOpenColabModal={() => setIsColabModalOpen(true)}
      />

      {/* 2. Workspace Split Grid */}
      <SandboxContainer
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        chatSlot={
          <div className="w-full h-full flex flex-col bg-void overflow-hidden">
            {/* Connection Error Banner if disconnected */}
            {connection.errorMessage && (
              <div className="px-4 py-2 bg-terminal-error/20 border-b border-terminal-error/40 text-terminal-error text-xs flex items-center justify-between font-mono shrink-0">
                <span>⚠ {connection.errorMessage}</span>
                <button
                  type="button"
                  onClick={() => setIsColabModalOpen(true)}
                  className="underline font-bold text-[11px] hover:text-white"
                >
                  Launch Colab GPU →
                </button>
              </div>
            )}

            {/* Chat Error Banner */}
            {chatError && (
              <div className="px-4 py-2 bg-terminal-error/20 border-b border-terminal-error/40 text-terminal-error text-xs font-mono shrink-0">
                ⚠ {chatError}
              </div>
            )}

            {/* Chat Messages Feed */}
            <div
              ref={chatScrollRef}
              className="flex-1 w-full overflow-y-auto px-4 py-3 space-y-2 select-text"
            >
              {messages.map((msg) => (
                <ChatMessageItem
                  key={msg.id}
                  message={msg}
                  onRunInSandbox={handleRunInSandbox}
                />
              ))}
            </div>

            {/* Active Streaming Telemetry Indicator */}
            <StreamingIndicator
              isStreaming={isStreaming}
              tokensPerSec={tokensPerSec}
              onStop={() => {
                stopStreaming();
                showToast("Stream halted", "warning", "ABORTED");
              }}
            />

            {/* Chat Command Input Bar */}
            <div className="p-3 bg-void border-t border-edge shrink-0">
              <ChatInput
                onSendMessage={handleSendMessage}
                isStreaming={isStreaming}
                onStopStreaming={stopStreaming}
                onClearChat={() => {
                  clearMessages();
                  showToast("Chat history reset", "info", "TERMINAL CLEARED");
                }}
              />
            </div>
          </div>
        }
        sandboxSlot={
          <div className="w-full h-full flex flex-col bg-void overflow-hidden">
            {/* Sandbox Tab Header */}
            <SandboxHeader
              activeTab={activeTab}
              onTabChange={setActiveTab}
              filename={filename}
              language={language}
              code={code}
              onReset={() => {
                resetCode();
                showToast("Sandbox restored to starter template", "info", "CODE RESET");
              }}
              onExport={handleExportCode}
              isFullscreen={viewMode === "sandbox"}
              onToggleFullscreen={() =>
                setViewMode((prev) => (prev === "sandbox" ? "split" : "sandbox"))
              }
            />

            {/* Editor or Preview Pane */}
            <div className="flex-1 w-full h-[calc(100%-36px)] overflow-hidden">
              {activeTab === "editor" ? (
                <CodeEditor
                  code={code}
                  language={language}
                  onChange={updateCode}
                />
              ) : (
                <ComponentPreview
                  code={code}
                  language={language}
                />
              )}
            </div>
          </div>
        }
      />

      {/* 3. Industrial Telemetry Status Bar */}
      <StatusBar
        connection={connection}
        tokenCount={totalTokens}
        tokensPerSec={tokensPerSec}
        isStreaming={isStreaming}
      />

      {/* 4. Colab Quick-Launch Guide Modal */}
      <ColabModal
        isOpen={isColabModalOpen}
        onClose={() => setIsColabModalOpen(false)}
        connection={connection}
      />

      {/* 5. Terminal Toast Notification System */}
      <ToastContainer toasts={toasts} onDismiss={dismissToast} />
    </div>
  );
}
