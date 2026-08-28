import unittest
import os

class TestChatMessageItem(unittest.TestCase):
    """
    Automated Audit Suite for Sub-Step 5.4.1:
    Verifies ChatMessageItem component conforms strictly to Terminal Brutalism specs:
    flat message blocks, zero rounded bubbles, 2px left accent border on AI messages,
    > YOU user label, and █ RAIZEN indicator.
    """

    def setUp(self):
        self.component_path = os.path.abspath("raizen-studio/src/components/ChatMessageItem.tsx")

    def test_component_file_exists(self):
        self.assertTrue(os.path.exists(self.component_path), "ChatMessageItem.tsx must exist")

    def test_terminal_brutalism_message_structures(self):
        with open(self.component_path, "r", encoding="utf-8") as f:
            content = f.read()

        self.assertIn("export function ChatMessageItem", content)
        self.assertIn("border-l-2 border-l-signal", content, "AI message must have 2px solid left accent border")
        self.assertIn("&gt; YOU", content, "User message must have > YOU label")
        self.assertIn("█", content, "AI indicator must use solid terminal block symbol █")
        self.assertIn("RAIZEN", content, "AI indicator must display RAIZEN")

    def test_no_rounded_bubbles(self):
        with open(self.component_path, "r", encoding="utf-8") as f:
            content = f.read()

        self.assertNotIn("rounded-2xl", content, "Must not use rounded-2xl bubbles")
        self.assertNotIn("rounded-3xl", content, "Must not use rounded-3xl bubbles")
        self.assertNotIn("rounded-xl", content, "Must not use rounded-xl bubbles")

    def test_copy_action_and_streaming_cursor(self):
        with open(self.component_path, "r", encoding="utf-8") as f:
            content = f.read()

        self.assertIn("COPY", content, "Must provide COPY action button")
        self.assertIn("TerminalCursor", content, "Must mount TerminalCursor while streaming")

if __name__ == "__main__":
    unittest.main()
