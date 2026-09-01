"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import {
  ChatSession,
  HistoryFilterState,
  HistoryTimeBucket,
  HistoryTimelineGroup,
} from "../types/session";
import { ChatMessage } from "../types/chat";

export const SESSIONS_STORAGE_KEY = "raizen_chat_sessions";
export const ACTIVE_SESSION_ID_KEY = "raizen_active_session_id";

export interface UseRaizenHistoryReturn {
  sessions: ChatSession[];
  activeSessionId: string | null;
  activeSession: ChatSession | null;
  createSession: (initialTitle?: string, initialMessages?: ChatMessage[]) => ChatSession;
  switchSession: (sessionId: string) => ChatSession | null;
  updateActiveSessionMessages: (messages: ChatMessage[], totalTokens?: number) => void;
  deleteSession: (sessionId: string) => void;
  renameSession: (sessionId: string, newTitle: string) => void;
  togglePinSession: (sessionId: string) => void;
  clearAllSessions: () => void;
  getTimelineGroups: (filter?: Partial<HistoryFilterState>) => HistoryTimelineGroup[];
}

/**
 * Derives a clean human-readable title from the first user prompt
 */
function deriveSessionTitle(messages: ChatMessage[], fallbackTitle = "New Architectural Session"): string {
  const firstUserMsg = messages.find((m) => m.role === "user");
  if (!firstUserMsg || !firstUserMsg.content.trim()) return fallbackTitle;

  const raw = firstUserMsg.content.trim();
  const firstLine = raw.split("\n")[0];
  const truncated = firstLine.length > 38 ? `${firstLine.slice(0, 38)}...` : firstLine;
  return truncated || fallbackTitle;
}

export function useRaizenHistory(): UseRaizenHistoryReturn {
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);

  // 1. Initial Load from localStorage on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        const savedSessions = localStorage.getItem(SESSIONS_STORAGE_KEY);
        const savedActiveId = localStorage.getItem(ACTIVE_SESSION_ID_KEY);

        if (savedSessions) {
          const parsed: ChatSession[] = JSON.parse(savedSessions);
          if (Array.isArray(parsed)) {
            // Clean legacy initial-welcome messages
            const sanitized = parsed.map((sess) => ({
              ...sess,
              messages: sess.messages.filter(
                (m) => m.id !== "initial-welcome" && !m.content.includes("I am **RAIZEN**, an enterprise")
              ),
            }));
            setSessions(sanitized);
          }
        }

        if (savedActiveId) {
          setActiveSessionId(savedActiveId);
        }
      } catch (err) {
        console.error("Failed to load sessions from localStorage:", err);
      }
    }
  }, []);

  // 2. Persist sessions whenever they change
  const persistSessions = useCallback((updated: ChatSession[]) => {
    setSessions(updated);
    if (typeof window !== "undefined") {
      localStorage.setItem(SESSIONS_STORAGE_KEY, JSON.stringify(updated));
    }
  }, []);

  // 3. Persist active session ID
  const persistActiveId = useCallback((id: string | null) => {
    setActiveSessionId(id);
    if (typeof window !== "undefined") {
      if (id) {
        localStorage.setItem(ACTIVE_SESSION_ID_KEY, id);
      } else {
        localStorage.removeItem(ACTIVE_SESSION_ID_KEY);
      }
    }
  }, []);

  // 4. Create a fresh session
  const createSession = useCallback(
    (initialTitle = "New Architectural Session", initialMessages: ChatMessage[] = []): ChatSession => {
      const now = Date.now();
      const newId = `session-${now}-${Math.random().toString(36).slice(2, 7)}`;
      const title = initialMessages.length > 0 ? deriveSessionTitle(initialMessages, initialTitle) : initialTitle;

      const newSession: ChatSession = {
        id: newId,
        title,
        messageCount: initialMessages.length,
        lastMessagePreview: initialMessages[initialMessages.length - 1]?.content.slice(0, 80),
        createdAt: now,
        updatedAt: now,
        isPinned: false,
        messages: initialMessages,
      };

      const updated = [newSession, ...sessions];
      persistSessions(updated);
      persistActiveId(newId);
      return newSession;
    },
    [sessions, persistSessions, persistActiveId]
  );

  // 5. Switch to a specific session
  const switchSession = useCallback(
    (sessionId: string): ChatSession | null => {
      const target = sessions.find((s) => s.id === sessionId);
      if (target) {
        persistActiveId(sessionId);
        return target;
      }
      return null;
    },
    [sessions, persistActiveId]
  );

  // 6. Update messages of the current active session
  const updateActiveSessionMessages = useCallback(
    (messages: ChatMessage[], totalTokens?: number) => {
      if (!activeSessionId) {
        if (messages.length > 0) {
          // If no active session exists, create one on first message
          const created = createSession(deriveSessionTitle(messages), messages);
          persistActiveId(created.id);
        }
        return;
      }

      setSessions((prev) => {
        const now = Date.now();
        const updated = prev.map((s) => {
          if (s.id === activeSessionId) {
            const dynamicTitle =
              s.title === "New Architectural Session" || s.title === "New Session"
                ? deriveSessionTitle(messages, s.title)
                : s.title;

            return {
              ...s,
              title: dynamicTitle,
              messages,
              messageCount: messages.length,
              lastMessagePreview: messages[messages.length - 1]?.content.slice(0, 80),
              updatedAt: now,
              totalTokensUsed: totalTokens !== undefined ? totalTokens : s.totalTokensUsed,
            };
          }
          return s;
        });

        if (typeof window !== "undefined") {
          localStorage.setItem(SESSIONS_STORAGE_KEY, JSON.stringify(updated));
        }
        return updated;
      });
    },
    [activeSessionId, createSession, persistActiveId]
  );

  // 7. Delete a session
  const deleteSession = useCallback(
    (sessionId: string) => {
      const updated = sessions.filter((s) => s.id !== sessionId);
      persistSessions(updated);

      if (activeSessionId === sessionId) {
        const nextActive = updated.length > 0 ? updated[0].id : null;
        persistActiveId(nextActive);
      }
    },
    [sessions, activeSessionId, persistSessions, persistActiveId]
  );

  // 8. Rename a session
  const renameSession = useCallback(
    (sessionId: string, newTitle: string) => {
      const trimmed = newTitle.trim();
      if (!trimmed) return;

      const updated = sessions.map((s) => (s.id === sessionId ? { ...s, title: trimmed, updatedAt: Date.now() } : s));
      persistSessions(updated);
    },
    [sessions, persistSessions]
  );

  // 9. Toggle Pin on a session
  const togglePinSession = useCallback(
    (sessionId: string) => {
      const updated = sessions.map((s) =>
        s.id === sessionId ? { ...s, isPinned: !s.isPinned, updatedAt: Date.now() } : s
      );
      persistSessions(updated);
    },
    [sessions, persistSessions]
  );

  // 10. Clear all sessions
  const clearAllSessions = useCallback(() => {
    persistSessions([]);
    persistActiveId(null);
  }, [persistSessions, persistActiveId]);

  // 11. Active session object accessor
  const activeSession = useMemo(() => {
    return sessions.find((s) => s.id === activeSessionId) || null;
  }, [sessions, activeSessionId]);

  // 12. Group sessions chronologically with search filter
  const getTimelineGroups = useCallback(
    (filter: Partial<HistoryFilterState> = {}): HistoryTimelineGroup[] => {
      const query = (filter.searchQuery || "").toLowerCase().trim();
      const timeRange = filter.timeRange || "all";
      const pinnedOnly = !!filter.pinnedOnly;

      const now = Date.now();
      const ONE_DAY_MS = 24 * 60 * 60 * 1000;
      const SEVEN_DAYS_MS = 7 * ONE_DAY_MS;

      // Filter sessions
      const filtered = sessions.filter((s) => {
        if (pinnedOnly && !s.isPinned) return false;

        if (query) {
          const matchTitle = s.title.toLowerCase().includes(query);
          const matchMessage = s.messages.some((m) => m.content.toLowerCase().includes(query));
          if (!matchTitle && !matchMessage) return false;
        }

        return true;
      });

      // Group into time buckets
      const todaySessions: ChatSession[] = [];
      const yesterdaySessions: ChatSession[] = [];
      const weekSessions: ChatSession[] = [];
      const olderSessions: ChatSession[] = [];

      filtered.forEach((s) => {
        const diff = now - s.updatedAt;
        if (diff < ONE_DAY_MS) {
          todaySessions.push(s);
        } else if (diff < 2 * ONE_DAY_MS) {
          yesterdaySessions.push(s);
        } else if (diff < SEVEN_DAYS_MS) {
          weekSessions.push(s);
        } else {
          olderSessions.push(s);
        }
      });

      const groups: HistoryTimelineGroup[] = [];

      if ((timeRange === "all" || timeRange === "today") && todaySessions.length > 0) {
        groups.push({ bucket: "today", label: "Today", sessions: todaySessions });
      }
      if ((timeRange === "all" || timeRange === "yesterday") && yesterdaySessions.length > 0) {
        groups.push({ bucket: "yesterday", label: "Yesterday", sessions: yesterdaySessions });
      }
      if ((timeRange === "all" || timeRange === "week") && weekSessions.length > 0) {
        groups.push({ bucket: "week", label: "Previous 7 Days", sessions: weekSessions });
      }
      if ((timeRange === "all" || timeRange === "older") && olderSessions.length > 0) {
        groups.push({ bucket: "older", label: "Older Sessions", sessions: olderSessions });
      }

      return groups;
    },
    [sessions]
  );

  return {
    sessions,
    activeSessionId,
    activeSession,
    createSession,
    switchSession,
    updateActiveSessionMessages,
    deleteSession,
    renameSession,
    togglePinSession,
    clearAllSessions,
    getTimelineGroups,
  };
}
