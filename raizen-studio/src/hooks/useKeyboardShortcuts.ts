"use client";

import { useEffect } from "react";

interface KeyboardShortcutsOptions {
  isStreaming?: boolean;
  onStopStreaming?: () => void;
  onClearChat?: () => void;
  onFocusInput?: () => void;
  onToggleSandbox?: () => void;
}

export function useKeyboardShortcuts({
  isStreaming = false,
  onStopStreaming,
  onClearChat,
  onFocusInput,
  onToggleSandbox,
}: KeyboardShortcutsOptions) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const isCtrlOrCmd = e.ctrlKey || e.metaKey;

      // 1. Escape: Stop streaming if active
      if (e.key === "Escape" && isStreaming) {
        e.preventDefault();
        onStopStreaming?.();
        return;
      }

      // 2. Ctrl+L / Cmd+L: Clear terminal chat screen
      if (isCtrlOrCmd && e.key.toLowerCase() === "l") {
        e.preventDefault();
        onClearChat?.();
        return;
      }

      // 3. Ctrl+K / Cmd+K: Focus chat input bar
      if (isCtrlOrCmd && e.key.toLowerCase() === "k") {
        e.preventDefault();
        onFocusInput?.();
        return;
      }

      // 4. Ctrl+\ / Cmd+\: Toggle live sandbox panel
      if (isCtrlOrCmd && e.key === "\\") {
        e.preventDefault();
        onToggleSandbox?.();
        return;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [
    isStreaming,
    onStopStreaming,
    onClearChat,
    onFocusInput,
    onToggleSandbox,
  ]);
}
