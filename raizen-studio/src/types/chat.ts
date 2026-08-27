export type MessageRole = "system" | "user" | "assistant";

export interface ChatMessage {
  id: string;
  role: MessageRole;
  content: string;
  timestamp: string;
  isStreaming?: boolean;
  tokensCount?: number;
}

export interface StreamChatOptions {
  backendUrl: string;
  messages: Array<{ role: MessageRole; content: string }>;
  temperature?: number;
  max_tokens?: number;
  signal?: AbortSignal;
  onToken: (token: string) => void;
  onError?: (error: Error) => void;
  onComplete?: (fullContent: string, tokenCount: number) => void;
}

export interface StreamDeltaChoice {
  delta?: {
    content?: string;
    role?: string;
  };
  finish_reason?: string | null;
  index?: number;
}

export interface StreamChunkPayload {
  id?: string;
  object?: string;
  created?: number;
  model?: string;
  choices?: StreamDeltaChoice[];
}
