import unittest
import os

class TestGlobalsCss(unittest.TestCase):
    """
    Automated Audit Suite for Sub-Step 5.1.4:
    Verifies global CSS rules for Terminal Brutalism in globals.css,
    including machine-snap scrolling, custom scrollbar, selection color,
    engineering grid pattern, and terminal block cursor animation.
    """

    def setUp(self):
        self.css_path = os.path.abspath("raizen-studio/src/app/globals.css")

    def test_machine_scroll_behavior(self):
        with open(self.css_path, "r", encoding="utf-8") as f:
            content = f.read()

        self.assertIn("scroll-behavior: auto", content, "globals.css must specify scroll-behavior: auto")
        self.assertIn("background-color: #050505", content, "globals.css must set canvas to OLED black")

    def test_selection_rules(self):
        with open(self.css_path, "r", encoding="utf-8") as f:
            content = f.read()

        self.assertIn("::selection", content, "globals.css must define ::selection")
        self.assertIn("#ccff00", content.lower(), "selection highlight must be Acid Lime (#ccff00)")
        self.assertIn("#050505", content.lower(), "selection text must be OLED black (#050505)")

    def test_scrollbar_styling(self):
        with open(self.css_path, "r", encoding="utf-8") as f:
            content = f.read()

        self.assertIn("::-webkit-scrollbar", content, "globals.css must define custom scrollbar")
        self.assertIn("::-webkit-scrollbar-thumb", content, "globals.css must define scrollbar thumb")
        self.assertIn("#1f1f1f", content.lower(), "scrollbar thumb base color must be #1f1f1f")

    def test_grid_pattern_and_cursor(self):
        with open(self.css_path, "r", encoding="utf-8") as f:
            content = f.read()

        self.assertIn(".bg-grid-pattern", content, "globals.css must define .bg-grid-pattern")
        self.assertIn("@keyframes terminal-blink", content, "globals.css must define terminal-blink keyframes")
        self.assertIn(".animate-terminal-cursor", content, "globals.css must define .animate-terminal-cursor")

if __name__ == "__main__":
    unittest.main()
