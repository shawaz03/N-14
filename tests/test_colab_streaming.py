# -*- coding: utf-8 -*-
"""
RAIZEN Phase 4.5.2: Streaming Chat Completions & SSE Protocol Audit
Validates the AST and schema compliance of /v1/chat/completions in notebooks/RAIZEN_Colab_Engine.ipynb
to ensure 100% compatibility with OpenAI-compatible SSE streaming standards.
"""

import os
import sys
import json
import ast
import unittest

ROOT_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
NOTEBOOK_PATH = os.path.join(ROOT_DIR, "notebooks", "RAIZEN_Colab_Engine.ipynb")


class TestNotebookStreamingContract(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        with open(NOTEBOOK_PATH, "r", encoding="utf-8") as f:
            cls.nb = json.load(f)
        
        code_cells = [
            "".join(c["source"])
            for c in cls.nb.get("cells", [])
            if c.get("cell_type") == "code"
        ]
        cls.full_code = "\n\n".join(code_cells)
        clean_lines = [
            line for line in cls.full_code.splitlines()
            if not line.strip().startswith("!") and not line.strip().startswith("%")
        ]
        cls.clean_code = "\n".join(clean_lines)
        cls.tree = ast.parse(cls.clean_code)

    def test_post_chat_completions_route(self):
        """Verify @app.post('/v1/chat/completions') decorator exists."""
        routes = []
        for node in ast.walk(self.tree):
            if isinstance(node, ast.AsyncFunctionDef) or isinstance(node, ast.FunctionDef):
                for dec in node.decorator_list:
                    if isinstance(dec, ast.Call) and isinstance(dec.func, ast.Attribute):
                        if dec.func.attr == "post" and dec.args:
                            if isinstance(dec.args[0], ast.Constant):
                                routes.append(dec.args[0].value)
        
        self.assertIn("/v1/chat/completions", routes, "Missing POST '/v1/chat/completions' route")

    def test_request_schema_fields(self):
        """Verify ChatCompletionRequest has all required parameters."""
        expected_fields = {"messages", "temperature", "top_p", "max_tokens", "stream", "repetition_penalty"}
        self.assertIn("class ChatCompletionRequest(BaseModel):", self.clean_code)
        for field in expected_fields:
            self.assertIn(field, self.clean_code, f"Missing request field: {field}")

    def test_sse_streaming_response_protocol(self):
        """Verify Server-Sent Events protocol components."""
        self.assertIn("StreamingResponse(", self.clean_code)
        self.assertIn('media_type="text/event-stream"', self.clean_code)
        self.assertIn("chat.completion.chunk", self.clean_code)
        self.assertIn("data: [DONE]", self.clean_code)
        self.assertIn("TextIteratorStreamer", self.clean_code)
        self.assertIn("threading.Thread", self.clean_code)

    def test_non_streaming_fallback_support(self):
        """Verify non-streaming response object structure exists."""
        self.assertIn('"object": "chat.completion"', self.clean_code)
        self.assertIn('"finish_reason": "stop"', self.clean_code)


if __name__ == "__main__":
    unittest.main()
