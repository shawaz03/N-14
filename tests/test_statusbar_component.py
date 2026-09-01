import unittest
import os

class TestStatusBarComponent(unittest.TestCase):
    """
    Automated Audit Suite for Top Obsidian Telemetry Status Bar:
    Verifies top telemetry status bar, GPU status, Model stats,
    Frozen font tokens, and SHAWAZ creator attribution link.
    """

    def setUp(self):
        self.status_bar_path = os.path.abspath("raizen-studio/src/components/StatusBar.tsx")

    def test_status_bar_file_exists(self):
        self.assertTrue(os.path.exists(self.status_bar_path), "StatusBar.tsx must exist in src/components/")

    def test_creator_attribution_and_portfolio_link(self):
        with open(self.status_bar_path, "r", encoding="utf-8") as f:
            content = f.read()

        self.assertIn("SHAWAZ", content, "StatusBar must display creator name SHAWAZ")
        self.assertIn("https://shawaz.vercel.app/", content, "StatusBar must link to https://shawaz.vercel.app/")

    def test_model_and_telemetry_labels(self):
        with open(self.status_bar_path, "r", encoding="utf-8") as f:
            content = f.read()

        self.assertIn("RAIZEN", content, "StatusBar must display RAIZEN model name")
        self.assertIn("GPU:", content, "StatusBar must display GPU telemetry")
        self.assertIn("ONLINE", content, "StatusBar must display ONLINE status")
        self.assertIn("font-frozen", content, "StatusBar must use font-frozen")

if __name__ == "__main__":
    unittest.main()
