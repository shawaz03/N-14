import unittest
import os

class TestTailwindTokens(unittest.TestCase):
    """
    Automated Audit Suite for Sub-Step 5.1.3:
    Verifies Terminal Brutalism design tokens in tailwind.config.ts
    including void (#050505), surface (#0A0A0A), edge (#1F1F1F),
    signal (#CCFF00), border-radius brutal (0px), and hard shadows.
    """

    def setUp(self):
        self.tailwind_path = os.path.abspath("raizen-studio/tailwind.config.ts")

    def test_color_tokens(self):
        with open(self.tailwind_path, "r", encoding="utf-8") as f:
            content = f.read()

        # Canvas & Surface
        self.assertIn('"#050505"', content, "void color #050505 must be defined")
        self.assertIn('"#0A0A0A"', content, "surface color #0A0A0A must be defined")
        self.assertIn('"#1F1F1F"', content, "edge color #1F1F1F must be defined")
        self.assertIn('"#333333"', content, "edge-light color #333333 must be defined")

        # Acid Lime Signal Accent
        self.assertIn('"#CCFF00"', content, "signal accent #CCFF00 must be defined")
        self.assertIn('"#B3E600"', content, "signal-hover accent #B3E600 must be defined")

        # Status colors
        self.assertIn('"#FF4444"', content, "terminal error color #FF4444 must be defined")
        self.assertIn('"#33FF99"', content, "terminal success color #33FF99 must be defined")

    def test_brutal_border_radius(self):
        with open(self.tailwind_path, "r", encoding="utf-8") as f:
            content = f.read()

        self.assertIn('brutal: "0px"', content, "borderRadius.brutal must be 0px")
        self.assertIn('soft: "2px"', content, "borderRadius.soft must be 2px")

    def test_hard_box_shadows(self):
        with open(self.tailwind_path, "r", encoding="utf-8") as f:
            content = f.read()

        self.assertIn('"4px 4px 0px #ffffff"', content, "boxShadow.hard must be 4px 4px 0px #ffffff")
        self.assertIn('"4px 4px 0px #CCFF00"', content, "boxShadow.hard-signal must be 4px 4px 0px #CCFF00")
        self.assertIn('"4px 4px 0px #333333"', content, "boxShadow.hard-dark must be 4px 4px 0px #333333")

if __name__ == "__main__":
    unittest.main()
