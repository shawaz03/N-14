import unittest
import os

class TestFontsAndLayout(unittest.TestCase):
    """
    Automated Audit Suite for Fonts & Layout Configuration:
    Verifies Frozen (Headings/Brand), Plus Jakarta Sans (UI/Chat),
    JetBrains Mono (Code Blocks), and layout metadata with SHAWAZ creator attribution.
    """

    def setUp(self):
        self.studio_dir = os.path.abspath("raizen-studio")
        self.fonts_dir = os.path.join(self.studio_dir, "src", "app", "fonts")
        self.layout_file = os.path.join(self.studio_dir, "src", "app", "layout.tsx")
        self.tailwind_file = os.path.join(self.studio_dir, "tailwind.config.ts")

    def test_app_fonts_exist(self):
        frozen = os.path.join(self.fonts_dir, "Frozen.otf")
        self.assertTrue(os.path.exists(frozen), "Frozen.otf must exist in raizen-studio/src/app/fonts/")

    def test_layout_font_variables_and_imports(self):
        with open(self.layout_file, "r", encoding="utf-8") as f:
            content = f.read()

        self.assertIn("next/font/local", content, "layout.tsx must import localFont from next/font/local")
        self.assertIn("--font-frozen", content, "layout.tsx must configure --font-frozen variable")
        self.assertIn("--font-sans", content, "layout.tsx must configure --font-sans variable")
        self.assertIn("--font-mono", content, "layout.tsx must configure --font-mono variable")

    def test_creator_attribution_metadata(self):
        with open(self.layout_file, "r", encoding="utf-8") as f:
            content = f.read()

        self.assertIn("SHAWAZ", content, "layout.tsx metadata must attribute creator SHAWAZ")
        self.assertIn("https://shawaz.vercel.app/", content, "layout.tsx must link to SHAWAZ portfolio")
        self.assertIn("RAIZEN", content, "layout.tsx must specify RAIZEN in title / description")

    def test_tailwind_font_family_mappings(self):
        with open(self.tailwind_file, "r", encoding="utf-8") as f:
            content = f.read()

        self.assertIn("var(--font-frozen)", content, "tailwind.config.ts must map frozen")
        self.assertIn("var(--font-sans)", content, "tailwind.config.ts must map sans")
        self.assertIn("var(--font-mono)", content, "tailwind.config.ts must map mono")

if __name__ == "__main__":
    unittest.main()
