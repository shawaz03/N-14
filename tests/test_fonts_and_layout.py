import unittest
import os
import re

class TestFontsAndLayout(unittest.TestCase):
    """
    Automated Audit Suite for Sub-Step 5.1.2:
    Verifies custom font integration (GC-Fodax, Peachtea), Google fonts (JetBrains Mono, Space Grotesk),
    layout metadata with SHAWAZ creator attribution, and Tailwind font family tokens.
    """

    def setUp(self):
        self.studio_dir = os.path.abspath("raizen-studio")
        self.fonts_dir = os.path.join(self.studio_dir, "src", "app", "fonts")
        self.layout_file = os.path.join(self.studio_dir, "src", "app", "layout.tsx")
        self.tailwind_file = os.path.join(self.studio_dir, "tailwind.config.ts")

    def test_app_fonts_exist(self):
        fodax = os.path.join(self.fonts_dir, "GC-Fodax-Demo-BF68b80f61230dc.ttf")
        peachtea = os.path.join(self.fonts_dir, "Peachtea-BF68fcd726682b8.otf")
        self.assertTrue(os.path.exists(fodax), "GC-Fodax TTF must exist in raizen-studio/src/app/fonts/")
        self.assertTrue(os.path.exists(peachtea), "Peachtea OTF must exist in raizen-studio/src/app/fonts/")

    def test_layout_font_variables_and_imports(self):
        with open(self.layout_file, "r", encoding="utf-8") as f:
            content = f.read()

        self.assertIn("next/font/local", content, "layout.tsx must import localFont from next/font/local")
        self.assertIn("JetBrains_Mono", content, "layout.tsx must import JetBrains_Mono from next/font/google")
        self.assertIn("Space_Grotesk", content, "layout.tsx must import Space_Grotesk from next/font/google")
        
        self.assertIn("--font-fodax", content, "layout.tsx must configure --font-fodax variable")
        self.assertIn("--font-peachtea", content, "layout.tsx must configure --font-peachtea variable")
        self.assertIn("--font-mono", content, "layout.tsx must configure --font-mono variable")
        self.assertIn("--font-display", content, "layout.tsx must configure --font-display variable")

    def test_creator_attribution_metadata(self):
        with open(self.layout_file, "r", encoding="utf-8") as f:
            content = f.read()

        self.assertIn("SHAWAZ", content, "layout.tsx metadata must attribute creator SHAWAZ")
        self.assertIn("https://shawaz.vercel.app/", content, "layout.tsx must link to SHAWAZ portfolio")
        self.assertIn("RAIZEN", content, "layout.tsx must specify RAIZEN in title / description")

    def test_tailwind_font_family_mappings(self):
        with open(self.tailwind_file, "r", encoding="utf-8") as f:
            content = f.read()

        self.assertIn("var(--font-mono)", content, "tailwind.config.ts must map mono to var(--font-mono)")
        self.assertIn("var(--font-display)", content, "tailwind.config.ts must map display to var(--font-display)")
        self.assertIn("var(--font-fodax)", content, "tailwind.config.ts must map fodax to var(--font-fodax)")
        self.assertIn("var(--font-peachtea)", content, "tailwind.config.ts must map peachtea to var(--font-peachtea)")

if __name__ == "__main__":
    unittest.main()
