import unittest
import os

class TestPageAssembly(unittest.TestCase):
    """
    Automated Audit Suite for Sub-Step 5.5.6:
    Verifies full page assembly in src/app/page.tsx, connecting Header, StatusBar,
    ColabModal, SandboxContainer, ChatMessageItem, ChatInput, CodeEditor, and ComponentPreview.
    """

    def setUp(self):
        self.page_path = os.path.abspath("raizen-studio/src/app/page.tsx")

    def test_page_file_exists(self):
        self.assertTrue(os.path.exists(self.page_path), "page.tsx must exist in src/app/")

    def test_hooks_and_components_assembly(self):
        with open(self.page_path, "r", encoding="utf-8") as f:
            content = f.read()

        self.assertIn("export default function RaizenStudioPage", content)
        self.assertIn("useRaizenConnection", content, "Must use useRaizenConnection")
        self.assertIn("useRaizenChat", content, "Must use useRaizenChat")
        self.assertIn("useSandboxBridge", content, "Must use useSandboxBridge")
        self.assertIn("useKeyboardShortcuts", content, "Must use useKeyboardShortcuts")

        self.assertIn("<Header", content, "Must render Header")
        self.assertIn("<StatusBar", content, "Must render StatusBar")
        self.assertIn("<ColabModal", content, "Must render ColabModal")
        self.assertIn("<SandboxContainer", content, "Must render SandboxContainer")
        self.assertIn("<ChatMessageItem", content, "Must render ChatMessageItem")
        self.assertIn("<ChatInput", content, "Must render ChatInput")
        self.assertIn("<CodeEditor", content, "Must render CodeEditor")
        self.assertIn("<ComponentPreview", content, "Must render ComponentPreview")

    def test_sandbox_bridge_connection(self):
        with open(self.page_path, "r", encoding="utf-8") as f:
            content = f.read()

        self.assertIn("handleRunInSandbox", content, "Must define handleRunInSandbox handler")
        self.assertIn("loadCode", content, "Must delegate to loadCode")

if __name__ == "__main__":
    unittest.main()
