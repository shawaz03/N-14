import unittest
import os

class TestSandboxBridge(unittest.TestCase):
    """
    Automated Audit Suite for Sub-Step 5.5.5:
    Verifies useSandboxBridge hook, code loading/reset handlers,
    and SHAWAZ creator attribution in the starter preview component.
    """

    def setUp(self):
        self.bridge_path = os.path.abspath("raizen-studio/src/hooks/useSandboxBridge.ts")

    def test_bridge_file_exists(self):
        self.assertTrue(os.path.exists(self.bridge_path), "useSandboxBridge.ts must exist")

    def test_starter_code_and_creator_attribution(self):
        with open(self.bridge_path, "r", encoding="utf-8") as f:
            content = f.read()

        self.assertIn("DEFAULT_STARTER_CODE", content)
        self.assertIn("SHAWAZ", content, "Starter component must attribute creator SHAWAZ")
        self.assertIn("https://shawaz.vercel.app/", content, "Starter component must link to https://shawaz.vercel.app/")
        self.assertIn("RAIZEN", content, "Starter component must mention RAIZEN")

    def test_bridge_hook_methods(self):
        with open(self.bridge_path, "r", encoding="utf-8") as f:
            content = f.read()

        self.assertIn("export function useSandboxBridge", content)
        self.assertIn("loadCode", content, "Must export loadCode")
        self.assertIn("updateCode", content, "Must export updateCode")
        self.assertIn("resetCode", content, "Must export resetCode")
        self.assertIn("setActiveTab", content, "Must export setActiveTab")

if __name__ == "__main__":
    unittest.main()
