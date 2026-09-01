import unittest
import os

class TestPageSandboxBridgeRouting(unittest.TestCase):
    """
    Automated Audit Suite for Phase 5 (Sub-Step 5.1.1):
    Verifies Sandbox Bridge view integration and routing in src/app/page.tsx.
    """

    def setUp(self):
        self.page_path = os.path.abspath("raizen-studio/src/app/page.tsx")

    def test_page_file_exists(self):
        self.assertTrue(os.path.exists(self.page_path))

    def test_sandbox_bridge_view_rendered(self):
        with open(self.page_path, "r", encoding="utf-8") as f:
            content = f.read()

        self.assertIn("import { SandboxBridgeView }", content, "page.tsx must import SandboxBridgeView")
        self.assertIn('<SandboxBridgeView', content, "page.tsx must render SandboxBridgeView")
        self.assertIn('activeTab === "tools"', content, "Must render SandboxBridgeView when activeTab is tools")

if __name__ == "__main__":
    unittest.main()
