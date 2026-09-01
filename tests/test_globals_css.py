import unittest
import os

class TestGlobalsCss(unittest.TestCase):
    """
    Automated Audit Suite for Swiss Editorial & Architectural Design System in globals.css:
    Verifies warm alabaster canvas, peach/saffron selection rules, custom minimalist scrollbars,
    Frozen font-face binding, and Claude-style searching & reasoning shimmer animations.
    """

    def setUp(self):
        self.css_path = os.path.abspath("raizen-studio/src/app/globals.css")

    def test_swiss_canvas_and_scroll_behavior(self):
        with open(self.css_path, "r", encoding="utf-8") as f:
            content = f.read()

        self.assertIn("scroll-behavior: smooth", content, "globals.css must specify smooth scroll behavior")
        self.assertIn("--swiss-canvas: #FAF8F5", content, "globals.css must set canvas to Warm Alabaster (#FAF8F5)")
        self.assertIn("--swiss-saffron: #EA580C", content, "globals.css must define Swiss Saffron (#EA580C)")

    def test_selection_rules(self):
        with open(self.css_path, "r", encoding="utf-8") as f:
            content = f.read()

        self.assertIn("::selection", content, "globals.css must define ::selection")
        self.assertIn("#fff2eb", content.lower(), "selection highlight must be Peach Tint (#FFF2EB)")
        self.assertIn("#ea580c", content.lower(), "selection text must be Burnt Saffron (#EA580C)")

    def test_scrollbar_styling(self):
        with open(self.css_path, "r", encoding="utf-8") as f:
            content = f.read()

        self.assertIn("::-webkit-scrollbar", content, "globals.css must define custom scrollbar")
        self.assertIn("::-webkit-scrollbar-thumb", content, "globals.css must define scrollbar thumb")
        self.assertIn("#e6e1d8", content.lower(), "scrollbar thumb base color must be #E6E1D8")

    def test_claude_shimmer_and_radar_animations(self):
        with open(self.css_path, "r", encoding="utf-8") as f:
            content = f.read()

        self.assertIn("@keyframes claude-shimmer", content, "globals.css must define claude-shimmer keyframes")
        self.assertIn(".animate-claude-shimmer", content, "globals.css must define .animate-claude-shimmer class")
        self.assertIn("@keyframes thought-pulse", content, "globals.css must define thought-pulse keyframes")
        self.assertIn("@keyframes live-dot-radar", content, "globals.css must define live-dot-radar keyframes")

    def test_custom_font_face_bindings(self):
        with open(self.css_path, "r", encoding="utf-8") as f:
            content = f.read()

        self.assertIn("font-family: 'Frozen'", content, "globals.css must define @font-face for Frozen")
        self.assertIn("--font-mono", content, "globals.css must define --font-mono")
        self.assertIn("--font-sans", content, "globals.css must define --font-sans")

if __name__ == "__main__":
    unittest.main()
