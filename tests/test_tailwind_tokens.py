import unittest
import os

class TestTailwindTokens(unittest.TestCase):
    """
    Automated Audit Suite for Design Tokens in tailwind.config.ts:
    Verifies Swiss Editorial palette, Burnt Saffron accents,
    Plus Jakarta Sans and JetBrains Mono font families.
    """

    def setUp(self):
        self.tailwind_path = os.path.abspath("raizen-studio/tailwind.config.ts")

    def test_swiss_editorial_tokens(self):
        with open(self.tailwind_path, "r", encoding="utf-8") as f:
            content = f.read()

        # Swiss Editorial Warm Alabaster, Sandstone, Saffron
        self.assertIn('"#FAF8F5"', content, "swiss.canvas #FAF8F5 must be defined")
        self.assertIn('"#F3EFEB"', content, "swiss.sidebar #F3EFEB must be defined")
        self.assertIn('"#EA580C"', content, "swiss.saffron #EA580C must be defined")
        self.assertIn('"#121316"', content, "swiss.ink #121316 must be defined")
        self.assertIn('"#E6E1D8"', content, "swiss.border #E6E1D8 must be defined")
        self.assertIn('"#111215"', content, "swiss.telemetry #111215 must be defined")

    def test_font_families(self):
        with open(self.tailwind_path, "r", encoding="utf-8") as f:
            content = f.read()

        self.assertIn("var(--font-frozen)", content, "frozen font must be defined")
        self.assertIn("var(--font-sans)", content, "sans font must be defined")
        self.assertIn("var(--font-mono)", content, "mono font must be defined")

if __name__ == "__main__":
    unittest.main()
