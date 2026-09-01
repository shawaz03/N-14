"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { ChatMessage, MessageRole } from "../types/chat";
import { streamRaizenChat } from "../lib/api";
import { RaizenPersona } from "../types/model";
import {
  RAIZEN_PERSONAS,
  getActivePersona,
  PERSONA_STORAGE_KEY,
} from "../lib/personaManager";

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
  activePersona: RaizenPersona;
  setActivePersona: (persona: RaizenPersona) => void;
  switchPersona: (personaId: string) => void;
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
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isStreaming, setIsStreaming] = useState<boolean>(false);
  const [streamingMessageId, setStreamingMessageId] = useState<string | null>(
    null
  );
  const [totalTokens, setTotalTokens] = useState<number>(0);
  const [tokensPerSec, setTokensPerSec] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [activePersona, setActivePersonaState] = useState<RaizenPersona>(RAIZEN_PERSONAS[0]);

  const abortControllerRef = useRef<AbortController | null>(null);

  // Load chat history & active persona from localStorage on initial mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem(CHAT_STORAGE_KEY);
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length > 0) {
            const cleanMessages = parsed.filter(
              (m: ChatMessage) =>
                m.id !== "initial-welcome" &&
                !m.content.includes("I am **RAIZEN**, an enterprise")
            );
            setMessages(cleanMessages);
            localStorage.setItem(CHAT_STORAGE_KEY, JSON.stringify(cleanMessages));
          }
        } catch {
          // Ignore
        }
      }

      // Load persona
      const savedPersonaId = localStorage.getItem(PERSONA_STORAGE_KEY);
      if (savedPersonaId) {
        setActivePersonaState(getActivePersona(savedPersonaId));
      }
    }
  }, []);

  const setActivePersona = useCallback((persona: RaizenPersona) => {
    setActivePersonaState(persona);
    if (typeof window !== "undefined") {
      localStorage.setItem(PERSONA_STORAGE_KEY, persona.id);
    }
  }, []);

  const switchPersona = useCallback(
    (personaId: string) => {
      const target = getActivePersona(personaId);
      setActivePersona(target);
    },
    [setActivePersona]
  );

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
      temperature?: number
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

      // Prepare multi-turn payload for RAIZEN with active persona system prompt
      const rawUserAssistantTurns = updatedMessages
        .filter((m) => m.id !== assistantMessageId && m.content)
        .map((m) => ({
          role: m.role as MessageRole,
          content: m.content,
        }));

      const payloadMessages = [
        {
          role: "system" as MessageRole,
          content: activePersona.systemPrompt,
        },
        ...rawUserAssistantTurns,
      ];

      const effectiveTemperature =
        temperature !== undefined ? temperature : activePersona.defaultTemperature;

      let accumulatedContent = "";
      let tokenCounter = 0;
      const streamStartTime = performance.now();

      try {
        await streamRaizenChat({
          backendUrl,
          messages: payloadMessages,
          temperature: effectiveTemperature,
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
                  ? {
                      ...msg,
                      content: accumulatedContent,
                      tokensCount: tokenCounter,
                    }
                  : msg
              )
            );
          },
          onError: (err: Error) => {
            if (err.name === "AbortError") {
              // Gracefully handle user abort
              return;
            }
            console.error("Stream error in useRaizenChat:", err);
            setError(err.message || "Failed to generate stream response");
          },
          onComplete: (fullContent: string, count: number) => {
            const finalMessages = updatedMessages.map((msg) =>
              msg.id === assistantMessageId
                ? {
                    ...msg,
                    content: fullContent,
                    isStreaming: false,
                    tokensCount: count,
                  }
                : msg
            );
            setMessages(finalMessages);
            saveMessagesToStorage(finalMessages);
            setTotalTokens((prev) => prev + count);
          },
        });
      } catch (err: unknown) {
        if (err instanceof Error && err.name === "AbortError") {
          // Normal abort
        } else {
          console.error("Unexpected error in sendMessage:", err);
          setError(
            err instanceof Error ? err.message : "Unexpected connection error"
          );
        }
      } finally {
        setIsStreaming(false);
        setStreamingMessageId(null);
        setTokensPerSec(null);
        abortControllerRef.current = null;
      }
    },
    [isStreaming, messages, activePersona, saveMessagesToStorage]
  );

  // Stop current in-flight stream
  const stopStreaming = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
    setIsStreaming(false);
    setStreamingMessageId(null);
    setTokensPerSec(null);

    // Finalize assistant message
    setMessages((prev) =>
      prev.map((msg) =>
        msg.isStreaming ? { ...msg, isStreaming: false } : msg
      )
    );
  }, []);

  // Clear messages completely
  const clearMessages = useCallback(() => {
    setMessages([]);
    setError(null);
    if (typeof window !== "undefined") {
      localStorage.removeItem(CHAT_STORAGE_KEY);
    }
  }, []);

  return {
    messages,
    isStreaming,
    streamingMessageId,
    totalTokens,
    tokensPerSec,
    error,
    activePersona,
    setActivePersona,
    switchPersona,
    sendMessage,
    stopStreaming,
    clearMessages,
    setMessages,
  };
}
