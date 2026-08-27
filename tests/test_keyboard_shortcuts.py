import unittest
import os

class TestKeyboardShortcuts(unittest.TestCase):
    """
    Automated Audit Suite for Sub-Step 5.3.4:
    Verifies the useKeyboardShortcuts hook for handling Escape (stream abort),
    Ctrl+L (clear screen), Ctrl+K (focus input), and Ctrl+\\ (toggle sandbox).
    """

    def setUp(self):
        self.shortcuts_path = os.path.abspath("raizen-studio/src/hooks/useKeyboardShortcuts.ts")

    def test_shortcuts_file_exists(self):
        self.assertTrue(os.path.exists(self.shortcuts_path), "useKeyboardShortcuts.ts must exist")

    def test_shortcut_listeners_configured(self):
        with open(self.shortcuts_path, "r", encoding="utf-8") as f:
            content = f.read()

        self.assertIn("export function useKeyboardShortcuts", content)
        self.assertIn('"Escape"', content, "Must listen for Escape key to stop stream")
        self.assertIn('"l"', content.lower(), "Must listen for Ctrl+L to clear screen")
        self.assertIn('"k"', content.lower(), "Must listen for Ctrl+K to focus input")
        self.assertIn('"\\\\"', content, "Must listen for Ctrl+\\ to toggle sandbox")

if __name__ == "__main__":
    unittest.main()
