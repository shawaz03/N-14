import unittest
import os

class TestMarkdownRenderer(unittest.TestCase):
    """
    Automated Audit Suite for Sub-Step 5.4.3:
    Verifies the MarkdownRenderer component, react-markdown + remark-gfm integration,
    CodeBlock component delegation, and ChatMessageItem integration.
    """

    def setUp(self):
        self.renderer_path = os.path.abspath("raizen-studio/src/components/MarkdownRenderer.tsx")
        self.message_item_path = os.path.abspath("raizen-studio/src/components/ChatMessageItem.tsx")

    def test_renderer_file_exists(self):
        self.assertTrue(os.path.exists(self.renderer_path), "MarkdownRenderer.tsx must exist")

    def test_markdown_and_gfm_plugins(self):
        with open(self.renderer_path, "r", encoding="utf-8") as f:
            content = f.read()

        self.assertIn("export function MarkdownRenderer", content)
        self.assertIn("react-markdown", content, "Must import react-markdown")
        self.assertIn("remark-gfm", content, "Must use remark-gfm for tables and task lists")
        self.assertIn("CodeBlock", content, "Must delegate fenced code blocks to CodeBlock component")

    def test_ascii_dividers_and_links(self):
        with open(self.renderer_path, "r", encoding="utf-8") as f:
            content = f.read()

        self.assertIn("hr()", content, "Must customize hr element to render ASCII divider")
        self.assertIn("text-swiss-saffron", content, "Links and highlights must use text-swiss-saffron")

    def test_chat_message_item_integration(self):
        with open(self.message_item_path, "r", encoding="utf-8") as f:
            content = f.read()

        self.assertIn("MarkdownRenderer", content, "ChatMessageItem must import and render MarkdownRenderer")
        self.assertIn("onRunInSandbox", content, "ChatMessageItem must pass onRunInSandbox to MarkdownRenderer")

if __name__ == "__main__":
    unittest.main()
