/**
 * RAIZEN Studio — Multi-Session History & Workspace Types
 * 
 * Defines state schema for multi-turn sessions, chronological timelines,
 * search filtering, and conversation persistence.
 * 
 * Crafted by SHAWAZ (https://shawaz.vercel.app/)
 */

import { ChatMessage } from "./chat";

export interface SessionMetadata {
  id: string;
  title: string;
  messageCount: number;
  lastMessagePreview?: string;
  createdAt: number; // Unix Epoch timestamp in ms
  updatedAt: number; // Unix Epoch timestamp in ms
  isPinned?: boolean;
  tags?: string[];
  personaId?: string;
}

export interface ChatSession extends SessionMetadata {
  messages: ChatMessage[];
  totalTokensUsed?: number;
}

export type HistoryTimeBucket = "today" | "yesterday" | "week" | "older";

export interface HistoryTimelineGroup {
  bucket: HistoryTimeBucket;
  label: string; // e.g. "Today", "Yesterday", "Previous 7 Days", "Older Sessions"
  sessions: ChatSession[];
}

export interface HistoryFilterState {
  searchQuery: string;
  timeRange: "all" | HistoryTimeBucket;
  pinnedOnly: boolean;
  selectedTag?: string;
}
