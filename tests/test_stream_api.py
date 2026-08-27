import unittest
import os

class TestStreamApi(unittest.TestCase):
    """
    Automated Audit Suite for Sub-Step 5.3.1:
    Verifies the streamRaizenChat SSE client, ChatMessage interfaces,
    OpenAI-compatible request body formatting, and AbortSignal support.
    """

    def setUp(self):
        self.types_path = os.path.abspath("raizen-studio/src/types/chat.ts")
        self.api_path = os.path.abspath("raizen-studio/src/lib/api.ts")

    def test_types_chat_declarations(self):
        self.assertTrue(os.path.exists(self.types_path), "chat.ts must exist in src/types/")
        with open(self.types_path, "r", encoding="utf-8") as f:
            content = f.read()

        self.assertIn("interface ChatMessage", content, "Must define ChatMessage")
        self.assertIn("interface StreamChatOptions", content, "Must define StreamChatOptions")
        self.assertIn("interface StreamChunkPayload", content, "Must define StreamChunkPayload")

    def test_stream_api_exports_and_route(self):
        self.assertTrue(os.path.exists(self.api_path), "api.ts must exist in src/lib/")
        with open(self.api_path, "r", encoding="utf-8") as f:
            content = f.read()

        self.assertIn("export async function streamRaizenChat", content)
        self.assertIn("`${sanitized}/v1/chat/completions`", content, "Must call /v1/chat/completions")
        self.assertIn('"text/event-stream"', content, "Must request text/event-stream")

    def test_sse_chunk_and_done_handling(self):
        with open(self.api_path, "r", encoding="utf-8") as f:
            content = f.read()

        self.assertIn('"data: "', content, "Must parse data: SSE lines")
        self.assertIn('"[DONE]"', content, "Must detect [DONE] termination marker")
        self.assertIn("delta?.content", content, "Must extract delta.content tokens")
        self.assertIn("signal", content, "Must pass AbortSignal for user cancellation")

if __name__ == "__main__":
    unittest.main()
