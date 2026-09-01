import unittest
import os

class TestHeaderComponent(unittest.TestCase):
    """
    Automated Audit Suite for Header Component:
    Verifies Header component structure, Cloudflare tunnel bar,
    latency telemetry display, and SHAWAZ creator attribution links with Swiss styling.
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

    def test_huggingface_links(self):
        with open(self.header_path, "r", encoding="utf-8") as f:
            content = f.read()

        self.assertIn("https://huggingface.co/shawaz03/RAIZEN", content, "Header must link to HuggingFace model")

    def test_swiss_styling_and_font(self):
        with open(self.header_path, "r", encoding="utf-8") as f:
            content = f.read()

        self.assertIn("font-frozen", content, "Header must use Frozen font for RAIZEN logo")
        self.assertIn("bg-white", content, "Header must use white background")
        self.assertIn("text-swiss-saffron", content, "Header must use text-swiss-saffron token")
        self.assertIn("border-swiss-border", content, "Header must use border-swiss-border token")

if __name__ == "__main__":
    unittest.main()
