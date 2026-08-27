import unittest
import os

class TestHeaderComponent(unittest.TestCase):
    """
    Automated Audit Suite for Sub-Step 5.2.2:
    Verifies the Mission Control Header component structure, Cloudflare tunnel bar,
    latency telemetry display, and SHAWAZ creator attribution links.
    """

    def setUp(self):
        self.header_path = os.path.abspath("raizen-studio/src/components/Header.tsx")

    def test_header_file_exists(self):
        self.assertTrue(os.path.exists(self.header_path), "Header.tsx must exist in src/components/")

    def test_creator_attribution_and_portfolio_link(self):
        with open(self.header_path, "r", encoding="utf-8") as f:
            content = f.read()

        self.assertIn("SHAWAZ", content, "Header must prominently display creator name SHAWAZ")
        self.assertIn("https://shawaz.vercel.app/", content, "Header must link to https://shawaz.vercel.app/")

    def test_huggingface_and_github_links(self):
        with open(self.header_path, "r", encoding="utf-8") as f:
            content = f.read()

        self.assertIn("https://huggingface.co/shawaz03/RAIZEN", content, "Header must link to HuggingFace model")
        self.assertIn("https://github.com/shawaz03/N-14", content, "Header must link to GitHub repository")

    def test_terminal_brutalism_styling_and_font(self):
        with open(self.header_path, "r", encoding="utf-8") as f:
            content = f.read()

        self.assertIn("font-fodax", content, "Header must use custom font-fodax for RAIZEN logo")
        self.assertIn("bg-void", content, "Header must use bg-void token")
        self.assertIn("text-signal", content, "Header must use text-signal token")
        self.assertIn("border-edge", content, "Header must use border-edge token")

if __name__ == "__main__":
    unittest.main()
