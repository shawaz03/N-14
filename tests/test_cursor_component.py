import unittest
import os

class TestCursorComponent(unittest.TestCase):
    """
    Automated Audit Suite for Sub-Step 5.3.3:
    Verifies TerminalCursor block cursor styling, animation classes,
    and StreamingIndicator speed & stop controls.
    """

    def setUp(self):
        self.cursor_path = os.path.abspath("raizen-studio/src/components/TerminalCursor.tsx")
        self.indicator_path = os.path.abspath("raizen-studio/src/components/StreamingIndicator.tsx")

    def test_cursor_file_and_tokens(self):
        self.assertTrue(os.path.exists(self.cursor_path), "TerminalCursor.tsx must exist")
        with open(self.cursor_path, "r", encoding="utf-8") as f:
            content = f.read()

        self.assertIn("export function TerminalCursor", content)
        self.assertIn("bg-signal", content, "Cursor must use bg-signal token (#CCFF00)")
        self.assertIn("animate-terminal-cursor", content, "Cursor must use animate-terminal-cursor")

    def test_indicator_file_and_controls(self):
        self.assertTrue(os.path.exists(self.indicator_path), "StreamingIndicator.tsx must exist")
        with open(self.indicator_path, "r", encoding="utf-8") as f:
            content = f.read()

        self.assertIn("export function StreamingIndicator", content)
        self.assertIn("RAIZEN STREAMING", content, "Indicator must announce streaming state")
        self.assertIn("STOP", content, "Indicator must provide stop button")
        self.assertIn("tok/s", content, "Indicator must display tokens per second")

if __name__ == "__main__":
    unittest.main()
