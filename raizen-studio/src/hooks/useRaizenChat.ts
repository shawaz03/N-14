"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { ChatMessage, MessageRole } from "../types/chat";
import { streamRaizenChat } from "../lib/api";

const CHAT_STORAGE_KEY = "raizen_chat_history";

export const INITIAL_ASSISTANT_MESSAGE: ChatMessage = {
  id: "initial-welcome",
  role: "assistant",
  content:
    "I am **RAIZEN**, an enterprise full-stack coding intelligence developed and fine-tuned by **[SHAWAZ](https://shawaz.vercel.app/)**.\n\nConnect your free Google Colab GPU backend via the top header bar, then ask me to:\n- ⚡ Write production-ready React, Next.js, TypeScript & Python components\n- 🐞 Debug complex algorithms, memory leaks, and concurrency issues\n- 🚀 Generate full UI dashboards and run them directly in the live sandbox on your right.",
  timestamp: "00:00:00",
  isStreaming: false,
};

export interface UseRaizenChatReturn {
  messages: ChatMessage[];
  isStreaming: boolean;
  streamingMessageId: string | null;
  totalTokens: number;
  tokensPerSec: number | null;
  error: string | null;
  sendMessage: (
    prompt: string,
    backendUrl: string,
    temperature?: number
  ) => Promise<void>;
  stopStreaming: () => void;
  clearMessages: () => void;
  setMessages: React.Dispatch<React.SetStateAction<ChatMessage[]>>;
}

export function useRaizenChat(): UseRaizenChatReturn {
  const [messages, setMessages] = useState<ChatMessage[]>([
    INITIAL_ASSISTANT_MESSAGE,
  ]);
  const [isStreaming, setIsStreaming] = useState<boolean>(false);
  const [streamingMessageId, setStreamingMessageId] = useState<string | null>(
    null
  );
  const [totalTokens, setTotalTokens] = useState<number>(0);
  const [tokensPerSec, setTokensPerSec] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const abortControllerRef = useRef<AbortController | null>(null);

  // Load chat history from localStorage on initial mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem(CHAT_STORAGE_KEY);
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setMessages(parsed);
          }
        } catch {
          // Fallback to initial welcome message if JSON corrupted
        }
      }
    }
  }, []);

  // Save chat history to localStorage whenever messages change (if not actively streaming)
  const saveMessagesToStorage = useCallback((msgs: ChatMessage[]) => {
    if (typeof window !== "undefined") {
      localStorage.setItem(CHAT_STORAGE_KEY, JSON.stringify(msgs));
    }
  }, []);

  // Send message and stream response from backend
  const sendMessage = useCallback(
    async (
      prompt: string,
      backendUrl: string,
      temperature = 0.2
    ): Promise<void> => {
      const trimmed = prompt.trim();
      if (!trimmed || isStreaming) return;

      if (!backendUrl.trim()) {
        setError(
          "No backend connection. Click [COLAB GPU] in the header to connect your free GPU instance."
        );
        return;
      }

      setError(null);
      const userMessageId = `user-${Date.now()}`;
      const assistantMessageId = `asst-${Date.now()}`;
      const now = new Date().toLocaleTimeString();

      const newUserMessage: ChatMessage = {
        id: userMessageId,
        role: "user",
        content: trimmed,
        timestamp: now,
      };

      const newAssistantMessage: ChatMessage = {
        id: assistantMessageId,
        role: "assistant",
        content: "",
        timestamp: now,
        isStreaming: true,
      };

      const updatedMessages = [...messages, newUserMessage, newAssistantMessage];
      setMessages(updatedMessages);
      setIsStreaming(true);
      setStreamingMessageId(assistantMessageId);

      // Setup AbortController
      const abortController = new AbortController();
      abortControllerRef.current = abortController;

      // Prepare multi-turn payload for RAIZEN
      const payloadMessages = updatedMessages
        .filter((m) => m.id !== assistantMessageId && m.content)
        .map((m) => ({
          role: m.role as MessageRole,
          content: m.content,
        }));

      let accumulatedContent = "";
      let tokenCounter = 0;
      const streamStartTime = performance.now();

      try {
        await streamRaizenChat({
          backendUrl,
          messages: payloadMessages,
          temperature,
          signal: abortController.signal,
          onToken: (token: string) => {
            accumulatedContent += token;
            tokenCounter++;

            const elapsedSec = (performance.now() - streamStartTime) / 1000;
            if (elapsedSec > 0.3) {
              setTokensPerSec(tokenCounter / elapsedSec);
            }

            setMessages((prev) =>
              prev.map((msg) =>
                msg.id === assistantMessageId
                  ? { ...msg, content: accumulatedContent, isStreaming: true }
                  : msg
              )
            );
          },
          onError: (err: Error) => {
            if (!abortController.signal.aborted) {
              setError(`Generation Error: ${err.message}`);
            }
          },
          onComplete: (fullContent: string, count: number) => {
            setTotalTokens((prev) => prev + count);
            const finalizedMessages = updatedMessages.map((msg) =>
              msg.id === assistantMessageId
                ? {
                    ...msg,
                    content: fullContent,
                    isStreaming: false,
                    tokensCount: count,
                  }
                : msg
            );
            setMessages(finalizedMessages);
            saveMessagesToStorage(finalizedMessages);
          },
        });
      } catch (err: unknown) {
        if (!abortController.signal.aborted) {
          const msg = err instanceof Error ? err.message : String(err);
          setError(`Stream Failed: ${msg}`);
        }
      } finally {
        setIsStreaming(false);
        setStreamingMessageId(null);
        abortControllerRef.current = null;
      }
    },
    [messages, isStreaming, saveMessagesToStorage]
  );

  // Stop active generation
  const stopStreaming = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
    setIsStreaming(false);
    setStreamingMessageId(null);

    setMessages((prev) => {
      const finalized = prev.map((msg) =>
        msg.isStreaming ? { ...msg, isStreaming: false } : msg
      );
      saveMessagesToStorage(finalized);
      return finalized;
    });
  }, [saveMessagesToStorage]);

  // Clear chat conversation
  const clearMessages = useCallback(() => {
    const freshMessages = [INITIAL_ASSISTANT_MESSAGE];
    setMessages(freshMessages);
    setError(null);
    setTokensPerSec(null);
    if (typeof window !== "undefined") {
      localStorage.setItem(
        CHAT_STORAGE_KEY,
        JSON.stringify(freshMessages)
      );
    }
  }, []);

  return {
    messages,
    isStreaming,
    streamingMessageId,
    totalTokens,
    tokensPerSec,
    error,
    sendMessage,
    stopStreaming,
    clearMessages,
    setMessages,
  };
}
