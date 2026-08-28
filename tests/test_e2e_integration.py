import unittest
import json
import threading
import time
import socket
import urllib.request
import urllib.error
from http.server import HTTPServer, BaseHTTPRequestHandler

class MockRaizenBackendHandler(BaseHTTPRequestHandler):
    """
    Mock FastAPI SSE Backend conforming to RAIZEN Colab Engine contract.
    """
    def do_OPTIONS(self):
        self.send_response(200)
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "*")
        self.end_headers()

    def do_GET(self):
        if self.path == "/health" or self.path == "/":
            self.send_response(200)
            self.send_header("Content-Type", "application/json")
            self.send_header("Access-Control-Allow-Origin", "*")
            self.end_headers()
            payload = {
                "status": "online",
                "model": "shawaz03/RAIZEN",
                "creator": "SHAWAZ",
                "portfolio": "https://shawaz.vercel.app/",
                "gpu": "NVIDIA A10G (Mock)",
                "vram_used_gb": 5.4,
                "vram_total_gb": 24.0,
                "tokens_per_sec": 48.5
            }
            self.wfile.write(json.dumps(payload).encode("utf-8"))
        else:
            self.send_response(404)
            self.end_headers()

    def do_POST(self):
        if self.path == "/v1/chat/completions":
            content_length = int(self.headers.get("Content-Length", 0))
            body = self.rfile.read(content_length).decode("utf-8")
            try:
                data = json.loads(body)
            except Exception:
                self.send_response(422)
                self.end_headers()
                return

            if "messages" not in data or not data["messages"]:
                self.send_response(422)
                self.end_headers()
                return

            self.send_response(200)
            self.send_header("Content-Type", "text/event-stream")
            self.send_header("Cache-Control", "no-cache")
            self.send_header("Connection", "close")
            self.send_header("Access-Control-Allow-Origin", "*")
            self.end_headers()

            # Mock stream tokens
            tokens = ["Hello", " from", " RAIZEN", " created", " by", " SHAWAZ", "!"]
            for token in tokens:
                chunk = {
                    "id": "chatcmpl-mock-123",
                    "object": "chat.completion.chunk",
                    "created": int(time.time()),
                    "model": "shawaz03/RAIZEN",
                    "choices": [
                        {
                            "index": 0,
                            "delta": {"content": token},
                            "finish_reason": None
                        }
                    ]
                }
                msg = f"data: {json.dumps(chunk)}\n\n"
                self.wfile.write(msg.encode("utf-8"))
                self.wfile.flush()

            self.wfile.write(b"data: [DONE]\n\n")
            self.wfile.flush()
            self.close_connection = True
        else:
            self.send_response(404)
            self.end_headers()

    def log_message(self, format, *args):
        # Suppress standard HTTP server logging during unit tests
        pass

def get_free_port():
    s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    s.bind(("127.0.0.1", 0))
    port = s.getsockname()[1]
    s.close()
    return port

class TestE2EIntegration(unittest.TestCase):
    """
    End-to-End Integration Suite:
    Spins up a mock Colab engine backend and tests all endpoints,
    headers, SSE protocol, and creator attribution.
    """
    @classmethod
    def setUpClass(cls):
        cls.port = get_free_port()
        cls.server = HTTPServer(("127.0.0.1", cls.port), MockRaizenBackendHandler)
        cls.server_thread = threading.Thread(target=cls.server.serve_forever, daemon=True)
        cls.server_thread.start()
        time.sleep(0.1)
        cls.base_url = f"http://127.0.0.1:{cls.port}"

    @classmethod
    def tearDownClass(cls):
        cls.server.shutdown()
        cls.server.server_close()

    def test_health_endpoint_contract(self):
        req = urllib.request.Request(f"{self.base_url}/health")
        with urllib.request.urlopen(req) as response:
            self.assertEqual(response.status, 200)
            self.assertEqual(response.headers.get("Access-Control-Allow-Origin"), "*")
            data = json.loads(response.read().decode("utf-8"))

            self.assertEqual(data.get("status"), "online")
            self.assertEqual(data.get("model"), "shawaz03/RAIZEN")
            self.assertEqual(data.get("creator"), "SHAWAZ")
            self.assertEqual(data.get("portfolio"), "https://shawaz.vercel.app/")

    def test_cors_options_preflight(self):
        req = urllib.request.Request(f"{self.base_url}/v1/chat/completions", method="OPTIONS")
        with urllib.request.urlopen(req) as response:
            self.assertEqual(response.status, 200)
            self.assertEqual(response.headers.get("Access-Control-Allow-Origin"), "*")
            self.assertIn("POST", response.headers.get("Access-Control-Allow-Methods", ""))

    def test_chat_sse_streaming_protocol(self):
        payload = {
            "model": "shawaz03/RAIZEN",
            "messages": [{"role": "user", "content": "Who built you?"}],
            "stream": True,
            "temperature": 0.2
        }
        req = urllib.request.Request(
            f"{self.base_url}/v1/chat/completions",
            data=json.dumps(payload).encode("utf-8"),
            headers={"Content-Type": "application/json"},
            method="POST"
        )

        with urllib.request.urlopen(req) as response:
            self.assertEqual(response.status, 200)
            self.assertEqual(response.headers.get("Content-Type"), "text/event-stream")
            self.assertEqual(response.headers.get("Access-Control-Allow-Origin"), "*")

            lines = []
            while True:
                line = response.readline().decode("utf-8")
                if not line:
                    break
                line_str = line.strip()
                if line_str:
                    lines.append(line_str)
                if line_str == "data: [DONE]":
                    break

            self.assertTrue(len(lines) >= 2)
            self.assertEqual(lines[-1], "data: [DONE]")

            # Assemble streamed tokens
            reconstructed_text = ""
            for line in lines[:-1]:
                if line.startswith("data: "):
                    chunk_json = json.loads(line[6:])
                    delta = chunk_json["choices"][0]["delta"].get("content", "")
                    reconstructed_text += delta

            self.assertIn("RAIZEN", reconstructed_text)
            self.assertIn("SHAWAZ", reconstructed_text)

    def test_invalid_payload_error_handling(self):
        # Empty payload
        req = urllib.request.Request(
            f"{self.base_url}/v1/chat/completions",
            data=json.dumps({"messages": []}).encode("utf-8"),
            headers={"Content-Type": "application/json"},
            method="POST"
        )
        with self.assertRaises(urllib.error.HTTPError) as ctx:
            urllib.request.urlopen(req)
        self.assertEqual(ctx.exception.code, 422)

if __name__ == "__main__":
    unittest.main()
