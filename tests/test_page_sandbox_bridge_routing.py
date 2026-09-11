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

    def test_sandbox_bridge_view_removed(self):
        with open(self.page_path, "r", encoding="utf-8") as f:
            content = f.read()

        self.assertNotIn("import { SandboxBridgeView }", content, "page.tsx must not import SandboxBridgeView")
        self.assertNotIn('<SandboxBridgeView', content, "page.tsx must not render SandboxBridgeView")
        self.assertNotIn('activeTab === "tools"', content, "Must not have activeTab tools")

if __name__ == "__main__":
    unittest.main()
