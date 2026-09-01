import unittest
import os

class TestSandboxBridgeView(unittest.TestCase):
    """
    Automated Audit Suite for Sub-Steps 4.1.1 & 4.1.2:
    Verifies SandboxBridgeView component in src/components/SandboxBridgeView.tsx:
    Standalone Zero-Latency Sandbox launcher, CodeSandbox cloud bridge, StackBlitz WebContainers,
    starter templates library (SaaS Pricing, Telemetry HUD, E-Commerce), and Swiss / FROZEN styling.
    """

    def setUp(self):
        self.view_path = os.path.abspath("raizen-studio/src/components/SandboxBridgeView.tsx")

    def test_file_exists(self):
        self.assertTrue(os.path.exists(self.view_path), "SandboxBridgeView.tsx must exist in src/components/")

    def test_component_exports_and_props(self):
        with open(self.view_path, "r", encoding="utf-8") as f:
            content = f.read()

        self.assertIn("export function SandboxBridgeView", content)
        self.assertIn("onRunInSandbox", content)
        self.assertIn("Sandbox Bridge & Launchpad", content)
        self.assertIn("font-frozen", content)

    def test_providers_present(self):
        with open(self.view_path, "r", encoding="utf-8") as f:
            content = f.read()

        self.assertIn("Standalone Sandbox", content)
        self.assertIn("CodeSandbox Cloud", content)
        self.assertIn("StackBlitz WebContainers", content)
        self.assertIn("handleLaunchBlank", content)

    def test_starter_templates_present(self):
        with open(self.view_path, "r", encoding="utf-8") as f:
            content = f.read()

        self.assertIn("STARTER_TEMPLATES", content)
        self.assertIn("SaaS Pricing Matrix", content)
        self.assertIn("Precision Telemetry Analytics HUD", content)
        self.assertIn("E-Commerce Storefront", content)
        self.assertIn("handleRunTemplate", content)

if __name__ == "__main__":
    unittest.main()
