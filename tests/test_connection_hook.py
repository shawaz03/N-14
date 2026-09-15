import unittest
import os
import re

class TestConnectionHook(unittest.TestCase):
    """
    Automated Audit Suite for Sub-Step 5.2.1:
    Verifies useRaizenConnection hook and connection types for Cloudflare tunnel
    management, health monitoring, URL sanitization, and 180s keep-alive interval.
    """

    def setUp(self):
        self.studio_dir = os.path.abspath("raizen-studio")
        self.types_file = os.path.join(self.studio_dir, "src", "types", "connection.ts")
        self.hook_file = os.path.join(self.studio_dir, "src", "hooks", "useRaizenConnection.ts")

    def test_types_file_declarations(self):
        self.assertTrue(os.path.exists(self.types_file), "connection.ts must exist")
        with open(self.types_file, "r", encoding="utf-8") as f:
            content = f.read()

        self.assertIn("type ConnectionStatus", content, "Must define ConnectionStatus")
        self.assertIn('"disconnected" | "connecting" | "connected" | "error"', content)
        self.assertIn("interface HealthResponse", content, "Must define HealthResponse")
        self.assertIn("interface UseRaizenConnectionReturn", content, "Must define UseRaizenConnectionReturn")
        self.assertIn("justConnected", content, "Must declare justConnected in types")

    def test_hook_exports_and_sanitizer(self):
        self.assertTrue(os.path.exists(self.hook_file), "useRaizenConnection.ts must exist")
        with open(self.hook_file, "r", encoding="utf-8") as f:
            content = f.read()

        self.assertIn("export function useRaizenConnection", content)
        self.assertIn("export function sanitizeBackendUrl", content)
        self.assertIn("raizen_backend_url", content, "Must use raizen_backend_url as localStorage key")

    def test_heartbeat_interval_and_health_endpoint(self):
        with open(self.hook_file, "r", encoding="utf-8") as f:
            content = f.read()

        self.assertIn("180000", content, "Must specify 180,000ms (180s) keep-alive heartbeat interval")
        self.assertIn("`${sanitized}/health`", content, "Must ping /health endpoint")

    def test_telemetry_activation_and_error_handling(self):
        with open(self.hook_file, "r", encoding="utf-8") as f:
            content = f.read()

        self.assertIn("justConnected", content, "Must export justConnected state for Neural Conduit activation")
        self.assertIn("resetJustConnected", content, "Must export resetJustConnected callback")
        self.assertIn("AbortController", content, "Must configure timeout with AbortController")

if __name__ == "__main__":
    unittest.main()
