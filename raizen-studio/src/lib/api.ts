import { StreamChatOptions, StreamChunkPayload } from "../types/chat";
import { sanitizeBackendUrl } from "../hooks/useRaizenConnection";

/**
 * Streams tokens from the RAIZEN FastAPI backend via OpenAI-compatible SSE (/v1/chat/completions).
 */
export async function streamRaizenChat(options: StreamChatOptions): Promise<string> {
  const {
    backendUrl,
    messages,
    temperature = 0.2,
    max_tokens = 4096,
    signal,
    onToken,
    onError,
    onComplete,
  } = options;

  const sanitized = sanitizeBackendUrl(backendUrl);
  if (!sanitized) {
    const err = new Error("Invalid or empty backend URL provided");
    onError?.(err);
    throw err;
  }

  const endpoint = `${sanitized}/v1/chat/completions`;
  let fullAccumulated = "";
  let tokenCount = 0;

  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "text/event-stream",
      },
      body: JSON.stringify({
        messages,
        temperature,
        max_tokens,
        stream: true,
      }),
      signal,
    });

    if (!response.ok) {
      const errorText = await response.text().catch(() => response.statusText);
      throw new Error(`Backend Error (HTTP ${response.status}): ${errorText}`);
    }

    if (!response.body) {
      throw new Error("Backend returned empty response body without stream");
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder("utf-8");
    let buffer = "";

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split("\n");
      // Keep the last incomplete fragment in the buffer
      buffer = lines.pop() || "";

      for (const line of lines) {
        const trimmed = line.trim();
        if (!trimmed || trimmed.startsWith(":")) {
          // SSE heartbeat or comment
          continue;
        }

        if (trimmed.startsWith("data: ")) {
          const dataStr = trimmed.slice(6).trim();

          if (dataStr === "[DONE]") {
            // End of stream marker
            break;
          }

          try {
            const parsed: StreamChunkPayload = JSON.parse(dataStr);
            const tokenDelta = parsed.choices?.[0]?.delta?.content;

            if (tokenDelta) {
              fullAccumulated += tokenDelta;
              tokenCount++;
              onToken(tokenDelta);
            }
          } catch {
            // Ignore incomplete JSON chunks in stream
          }
        }
      }
    }

    // Process any remaining text in buffer
    if (buffer.trim().startsWith("data: ")) {
      const dataStr = buffer.trim().slice(6).trim();
      if (dataStr !== "[DONE]") {
        try {
          const parsed: StreamChunkPayload = JSON.parse(dataStr);
          const tokenDelta = parsed.choices?.[0]?.delta?.content;
          if (tokenDelta) {
            fullAccumulated += tokenDelta;
            tokenCount++;
            onToken(tokenDelta);
          }
        } catch {
          // Incomplete fragment
        }
      }
    }

    onComplete?.(fullAccumulated, tokenCount);
    return fullAccumulated;
  } catch (err: unknown) {
    if (signal?.aborted || (err instanceof Error && err.name === "AbortError")) {
      const abortErr = new Error("Stream aborted by user");
      abortErr.name = "AbortError";
      onError?.(abortErr);
      return fullAccumulated;
    }
    const finalErr = err instanceof Error ? err : new Error(String(err));
    onError?.(finalErr);
    throw finalErr;
  }
}
