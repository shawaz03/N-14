import unittest
import os

class TestPageAssembly(unittest.TestCase):
    """
    Automated Audit Suite for Single-Screen Swiss Architectural Studio in src/app/page.tsx:
    Verifies single-stream chat feed, Sidebar navigation, StatusBar telemetry,
    ChatMessageItem, ChatInput, ColabModal, and Open-Source Sandbox redirection trigger.
    """

    def setUp(self):
        self.page_path = os.path.abspath("raizen-studio/src/app/page.tsx")

    def test_page_file_exists(self):
        self.assertTrue(os.path.exists(self.page_path), "page.tsx must exist in src/app/")

    def test_single_screen_components_assembly(self):
        with open(self.page_path, "r", encoding="utf-8") as f:
            content = f.read()

        self.assertIn("export default function RaizenStudioPage", content)
        self.assertIn("useRaizenConnection", content, "Must use useRaizenConnection")
        self.assertIn("useRaizenChat", content, "Must use useRaizenChat")
        self.assertIn("useKeyboardShortcuts", content, "Must use useKeyboardShortcuts")

        # Single Screen Architecture
        self.assertIn("<Sidebar", content, "Must render Sidebar drawer")
        self.assertIn("<StatusBar", content, "Must render StatusBar telemetry")
        self.assertIn("<ColabModal", content, "Must render ColabModal")
        self.assertIn("<ChatMessageItem", content, "Must render ChatMessageItem in stream")
        self.assertIn("<ClaudeLoadingEffect", content, "Must render ClaudeLoadingEffect")
        self.assertIn("<ChatInput", content, "Must render floating ChatInput")

    def test_sandbox_redirection_handler(self):
        with open(self.page_path, "r", encoding="utf-8") as f:
            content = f.read()

        self.assertIn("handleRunInSandbox", content, "Must define handleRunInSandbox redirection handler")

if __name__ == "__main__":
    unittest.main()
