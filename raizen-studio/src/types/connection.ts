export type ConnectionStatus = "disconnected" | "connecting" | "connected" | "error";

export interface HealthResponse {
  status: string;
  model: string;
  creator: string;
  portfolio: string;
  gpu?: string;
  vram_used_gb?: number;
  vram_total_gb?: number;
  tokens_per_sec?: number;
}

export interface ConnectionState {
  tunnelUrl: string;
  status: ConnectionStatus;
  latencyMs: number | null;
  modelInfo: HealthResponse | null;
  lastChecked: Date | null;
  errorMessage: string | null;
}

export interface UseRaizenConnectionReturn extends ConnectionState {
  setTunnelUrl: (url: string) => void;
  connect: (urlOverride?: string) => Promise<boolean>;
  disconnect: () => void;
  checkHealth: () => Promise<boolean>;
}
