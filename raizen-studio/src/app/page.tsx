"use client";

import React, { useRef, useEffect, useState } from "react";
import { Sidebar } from "../components/Sidebar";
import { StatusBar } from "../components/StatusBar";
import { ChatMessageItem } from "../components/ChatMessageItem";
import { ChatInput } from "../components/ChatInput";
import { ClaudeLoadingEffect } from "../components/ClaudeLoadingEffect";
import { ColabModal } from "../components/ColabModal";
import { HistoryView } from "../components/HistoryView";
import { SavedSnippetsView } from "../components/SavedSnippetsView";
import { ModelExplorerView } from "../components/ModelExplorerView";
import { SandboxBridgeView } from "../components/SandboxBridgeView";
import { ToastContainer } from "../components/Toast";
import { useToast } from "../hooks/useToast";
import { useRaizenConnection } from "../hooks/useRaizenConnection";
import { useRaizenChat } from "../hooks/useRaizenChat";
import { useRaizenHistory } from "../hooks/useRaizenHistory";
import { useSavedSnippets } from "../hooks/useSavedSnippets";
import { useCodeExport } from "../hooks/useCodeExport";
import { useKeyboardShortcuts } from "../hooks/useKeyboardShortcuts";
import { ArrowUpRight } from "lucide-react";
import { ChatSession } from "../types/session";
import { RaizenPersona } from "../types/model";

export type WorkspaceTab = "chat" | "explore" | "history" | "saved" | "tools";

export default function RaizenStudioPage() {
  const [activeTab, setActiveTab] = useState<WorkspaceTab>("chat");
  const [isColabModalOpen, setIsColabModalOpen] = useState(false);
  const { toasts, showToast, dismissToast } = useToast();

  const connection = useRaizenConnection();
  const history = useRaizenHistory();
  const snippetsVault = useSavedSnippets();
  const {
    messages,
    isStreaming,
    totalTokens,
    tokensPerSec,
    error: chatError,
    activePersona,
    setActivePersona,
    sendMessage,
    stopStreaming,
    clearMessages,
    setMessages,
  } = useRaizenChat();

  const { downloadCode } = useCodeExport();
  const chatScrollRef = useRef<HTMLDivElement | null>(null);

  // Sync active session messages to history whenever conversation updates
  useEffect(() => {
    if (messages.length > 0 && !isStreaming) {
      history.updateActiveSessionMessages(messages, totalTokens);
    }
  }, [messages, isStreaming, totalTokens, history.updateActiveSessionMessages]);

  // Auto-scroll to bottom of chat feed when new messages or tokens arrive
  useEffect(() => {
    if (chatScrollRef.current && activeTab === "chat") {
      chatScrollRef.current.scrollTo({
        top: chatScrollRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [messages, isStreaming, activeTab]);

  const handleStartNewSession = () => {
    history.createSession("New Architectural Session", []);
    clearMessages();
    setActiveTab("chat");
    showToast("Started fresh chat session", "info", "NEW SESSION");
  };

  const handleSelectSession = (session: ChatSession) => {
    history.switchSession(session.id);
    setMessages(session.messages);
    setActiveTab("chat");
    showToast(`Resumed: ${session.title}`, "info", "SESSION RESTORED");
  };

  const handleSendMessage = (promptText: string, temperature: number = 0.2) => {
    sendMessage(promptText, connection.tunnelUrl, temperature);
  };

  const handleRunInSandbox = (code: string, language: string) => {
    // Sandbox is already launched directly by CodeBlock in the click gesture stack.
    // This callback is only for UI toast notification feedback.
    showToast("Launching component in Open-Source Sandbox...", "success", "SANDBOX RUNNER");
  };

  const handleSaveSnippet = (code: string, language: string, filename?: string) => {
    const saved = snippetsVault.saveSnippet({
      code,
      language,
      filename,
    });
    showToast(`Saved to Vault: ${saved.title}`, "success", "VAULT BOOKMARK");
  };

  const handleSelectPersona = (persona: RaizenPersona) => {
    setActivePersona(persona);
    showToast(`Active Specialist: ${persona.name}`, "info", "PERSONA SWITCHED");
  };

  const handleExportCode = (code: string, filename: string) => {
    downloadCode(code, filename);
  };

  useKeyboardShortcuts({
    isStreaming,
    onStopStreaming: stopStreaming,
    onClearChat: () => {
      clearMessages();
      showToast("Cleared conversation", "info", "CLEARED");
    },
  });

  return (
    <div className="flex flex-col h-screen w-screen bg-swiss-canvas text-swiss-ink overflow-hidden font-sans select-none">
      {/* 1. Top Obsidian Precision Telemetry Bar */}
      <StatusBar
        connection={connection}
        tokenCount={totalTokens}
        tokensPerSec={tokensPerSec}
        isStreaming={isStreaming}
      />

      {/* 2. Main Studio Canvas (Sidebar + Dynamic Workspace Canvas) */}
      <div className="flex flex-1 min-h-0 relative overflow-hidden">
        {/* Left Collapsible Architectural Navigation Drawer */}
        <Sidebar
          activeTab={activeTab}
          onSelectTab={(tabId) => setActiveTab(tabId as WorkspaceTab)}
          onNewChat={handleStartNewSession}
          onOpenColabModal={() => setIsColabModalOpen(true)}
        />

        {/* Dynamic Center Canvas View */}
        <main className="flex-1 flex flex-col h-full bg-swiss-canvas relative min-w-0 overflow-hidden">
          
          {/* Connection Error Banner if disconnected */}
          {connection.errorMessage && (
            <div className="px-4 py-2 bg-red-50 border-b border-red-200 text-red-700 text-xs flex items-center justify-between font-frozen tracking-wide shrink-0">
              <span className="flex items-center gap-1.5 font-frozen">
                <span className="w-2 h-2 rounded-full bg-red-500 animate-ping"></span>
                <span>Tunnel Offline: {connection.errorMessage}</span>
              </span>
              <button
                type="button"
                onClick={() => setIsColabModalOpen(true)}
                className="underline font-bold text-[11px] hover:text-red-900 flex items-center gap-1 font-frozen tracking-wide"
              >
                <span>Launch Google Colab GPU</span>
                <ArrowUpRight className="w-3 h-3" />
              </button>
            </div>
          )}

          {/* Chat Error Banner */}
          {chatError && (
            <div className="px-4 py-2 bg-red-50 border-b border-red-200 text-red-700 text-xs font-frozen tracking-wide shrink-0">
              ⚠ {chatError}
            </div>
          )}

          {/* VIEW A: Model Explorer View */}
          {activeTab === "explore" && (
            <div className="flex-1 overflow-hidden animate-in fade-in duration-150">
              <ModelExplorerView
                activePersona={activePersona}
                onSelectPersona={handleSelectPersona}
              />
            </div>
          )}

          {/* VIEW B: History Timeline View */}
          {activeTab === "history" && (
            <div className="flex-1 overflow-hidden animate-in fade-in duration-150">
              <HistoryView
                history={history}
                onSelectSession={handleSelectSession}
                onNewSession={handleStartNewSession}
              />
            </div>
          )}

          {/* VIEW C: Saved Snippets Vault View */}
          {activeTab === "saved" && (
            <div className="flex-1 overflow-hidden animate-in fade-in duration-150">
              <SavedSnippetsView
                snippetsVault={snippetsVault}
                onRunInSandbox={handleRunInSandbox}
                onExportCode={handleExportCode}
              />
            </div>
          )}

          {/* VIEW D: Sandbox Bridge View */}
          {activeTab === "tools" && (
            <div className="flex-1 overflow-hidden animate-in fade-in duration-150">
              <SandboxBridgeView onRunInSandbox={handleRunInSandbox} />
            </div>
          )}

          {/* VIEW E: Chat Studio Conversation View */}
          {activeTab === "chat" && (
            <>
              {/* Single-Column Chat Stream: Full-width scroll container for edge-to-edge scrolling */}
              <div
                ref={chatScrollRef}
                className="flex-1 w-full overflow-y-auto px-4 md:px-8 py-6 select-text"
              >
                <div className="max-w-4xl mx-auto space-y-6">
                  {/* Render Chat Messages */}
                  {messages
                    .filter(
                      (msg) =>
                        msg.id !== "initial-welcome" &&
                        !msg.content.includes("I am **RAIZEN**, an enterprise")
                    )
                    .map((msg) => (
                      <ChatMessageItem
                        key={msg.id}
                        message={msg}
                        onRunInSandbox={handleRunInSandbox}
                        onSaveSnippet={handleSaveSnippet}
                      />
                    ))}

                  {/* Claude-Style Searching & Progressive Shimmer Loading Effect */}
                  {isStreaming && (
                    <ClaudeLoadingEffect
                      isStreaming={isStreaming}
                      onStop={stopStreaming}
                      tokensPerSec={tokensPerSec}
                    />
                  )}
                </div>
              </div>

              {/* Floating Command Bar Input Dock */}
              <div className="w-full bg-gradient-to-t from-swiss-canvas via-swiss-canvas to-transparent pt-4 pb-5 px-4 md:px-8 shrink-0">
                <div className="max-w-4xl mx-auto">
                  <ChatInput
                    onSendMessage={handleSendMessage}
                    isStreaming={isStreaming}
                    onStopStreaming={stopStreaming}
                    onClearChat={clearMessages}
                    disabled={false}
                  />
                </div>
              </div>
            </>
          )}
        </main>
      </div>

      {/* Google Colab Connection Modal */}
      <ColabModal
        isOpen={isColabModalOpen}
        onClose={() => setIsColabModalOpen(false)}
        connection={connection}
      />

      {/* Toast Notifications */}
      <ToastContainer toasts={toasts} onDismiss={dismissToast} />
    </div>
  );
}
