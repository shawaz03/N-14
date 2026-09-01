"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import confetti from "canvas-confetti";
import {
  ConnectionStatus,
  HealthResponse,
  UseRaizenConnectionReturn,
} from "../types/connection";

const STORAGE_KEY = "raizen_backend_url";
const HEARTBEAT_INTERVAL_MS = 180000; // 180 seconds (3 minutes)

/**
 * Sanitizes input URL string: strips whitespace, removes trailing slashes,
 * and ensures https:// prefix for Cloudflare tunnels.
 */
export function sanitizeBackendUrl(rawUrl: string): string {
  let cleaned = rawUrl.trim();
  if (!cleaned) return "";

  // Remove trailing slashes
  cleaned = cleaned.replace(/\/+$/, "");

  // If user pasted bare tunnel hostname without protocol, prepend https://
  if (
    !cleaned.startsWith("http://") &&
    !cleaned.startsWith("https://")
  ) {
    cleaned = `https://${cleaned}`;
  }

  return cleaned;
}

export function useRaizenConnection(): UseRaizenConnectionReturn {
  const [tunnelUrl, setTunnelUrlState] = useState<string>("");
  const [status, setStatus] = useState<ConnectionStatus>("disconnected");
  const [latencyMs, setLatencyMs] = useState<number | null>(null);
  const [modelInfo, setModelInfo] = useState<HealthResponse | null>(null);
  const [lastChecked, setLastChecked] = useState<Date | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const heartbeatRef = useRef<NodeJS.Timeout | null>(null);

  // Set URL and update localStorage
  const setTunnelUrl = useCallback((url: string) => {
    const sanitized = sanitizeBackendUrl(url);
    setTunnelUrlState(sanitized);
    if (typeof window !== "undefined") {
      if (sanitized) {
        localStorage.setItem(STORAGE_KEY, sanitized);
      } else {
        localStorage.removeItem(STORAGE_KEY);
      }
    }
  }, []);

  // Check health of backend endpoint
  const checkHealthWithUrl = useCallback(
    async (targetUrl: string, triggerCelebration = false): Promise<boolean> => {
      const sanitized = sanitizeBackendUrl(targetUrl);
      if (!sanitized) {
        setStatus("disconnected");
        setErrorMessage("Please enter a valid Cloudflare Tunnel URL");
        return false;
      }

      setStatus("connecting");
      setErrorMessage(null);
      const startTime = performance.now();

      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000); // 10s timeout

        const res = await fetch(`${sanitized}/health`, {
          method: "GET",
          headers: {
            Accept: "application/json",
          },
          signal: controller.signal,
        });

        clearTimeout(timeoutId);
        const elapsed = Math.round(performance.now() - startTime);

        if (!res.ok) {
          throw new Error(`HTTP ${res.status}: ${res.statusText}`);
        }

        const data: HealthResponse = await res.json();

        setLatencyMs(elapsed);
        setModelInfo(data);
        setStatus("connected");
        setLastChecked(new Date());
        setErrorMessage(null);

        // Trigger celebratory confetti on initial successful connection
        if (triggerCelebration) {
          try {
            confetti({
              particleCount: 50,
              spread: 60,
              origin: { y: 0.1 },
              colors: ["#EA580C", "#FAF8F5", "#121316", "#CCFF00"],
            });
          } catch {
            // Ignore confetti errors in non-browser envs
          }
        }

        return true;
      } catch (err: unknown) {
        setStatus("error");
        setLatencyMs(null);
        const message =
          err instanceof Error
            ? err.message === "The user aborted a request."
              ? "Connection timed out (10s limit exceeded)"
              : err.message
            : "Unknown connection error occurred";
        setErrorMessage(`Backend Unreachable: ${message}`);
        return false;
      }
    },
    []
  );

  // Connect helper
  const connect = useCallback(
    async (urlOverride?: string): Promise<boolean> => {
      const target = urlOverride !== undefined ? urlOverride : tunnelUrl;
      const sanitized = sanitizeBackendUrl(target);
      if (sanitized) {
        setTunnelUrl(sanitized);
        return await checkHealthWithUrl(sanitized, true);
      }
      return false;
    },
    [tunnelUrl, setTunnelUrl, checkHealthWithUrl]
  );

  // Disconnect helper
  const disconnect = useCallback(() => {
    setStatus("disconnected");
    setLatencyMs(null);
    setModelInfo(null);
    setErrorMessage(null);
    if (heartbeatRef.current) {
      clearInterval(heartbeatRef.current);
      heartbeatRef.current = null;
    }
  }, []);

  // Health check on current URL
  const checkHealth = useCallback(async (): Promise<boolean> => {
    if (!tunnelUrl) return false;
    return await checkHealthWithUrl(tunnelUrl, false);
  }, [tunnelUrl, checkHealthWithUrl]);

  // Load URL from localStorage on mount and auto-connect
  useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const sanitized = sanitizeBackendUrl(saved);
        setTunnelUrlState(sanitized);
        checkHealthWithUrl(sanitized, false);
      }
    }
  }, [checkHealthWithUrl]);

  // Manage heartbeat ping while connected (every 180s)
  useEffect(() => {
    if (status === "connected" && tunnelUrl) {
      if (heartbeatRef.current) clearInterval(heartbeatRef.current);

      heartbeatRef.current = setInterval(() => {
        checkHealthWithUrl(tunnelUrl, false);
      }, HEARTBEAT_INTERVAL_MS);

      return () => {
        if (heartbeatRef.current) {
          clearInterval(heartbeatRef.current);
          heartbeatRef.current = null;
        }
      };
    }
  }, [status, tunnelUrl, checkHealthWithUrl]);

  return {
    tunnelUrl,
    status,
    latencyMs,
    modelInfo,
    lastChecked,
    errorMessage,
    setTunnelUrl,
    connect,
    disconnect,
    checkHealth,
  };
}
