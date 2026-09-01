import unittest
import os

class TestChatMessageItem(unittest.TestCase):
    """
    Automated Audit Suite for ChatMessageItem Component:
    Verifies Swiss matte white AI cards, solid Burnt Saffron user pill bubbles,
    Frozen font for Engine titles, Beauty and the Beast for chat message prose,
    copy feedback, and MarkdownRenderer integration.
    """

    def setUp(self):
        self.component_path = os.path.abspath("raizen-studio/src/components/ChatMessageItem.tsx")

    def test_component_file_exists(self):
        self.assertTrue(os.path.exists(self.component_path), "ChatMessageItem.tsx must exist")

    def test_editorial_message_structures_and_fonts(self):
        with open(self.component_path, "r", encoding="utf-8") as f:
            content = f.read()

        self.assertIn("export function ChatMessageItem", content)
        self.assertIn("bg-swiss-saffron", content, "User message must use Swiss Saffron pill")
        self.assertIn("SHAWAZ", content, "User header must attribute SHAWAZ")
        self.assertIn("RAIZEN Engine", content, "AI indicator must display RAIZEN Engine")
        self.assertIn("font-frozen", content, "Must use Frozen font for engine title")
        self.assertIn("font-sans", content, "Must use clean Sans font for chat messages")
        self.assertIn("font-mono", content, "Must use Monospace font for metadata")

    def test_copy_action_and_markdown(self):
        with open(self.component_path, "r", encoding="utf-8") as f:
            content = f.read()

        self.assertIn("COPY", content, "Must provide COPY action button")
        self.assertIn("MarkdownRenderer", content, "Must integrate MarkdownRenderer")

if __name__ == "__main__":
    unittest.main()
