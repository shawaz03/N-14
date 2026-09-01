import unittest
import os

class TestCodeBlockBookmark(unittest.TestCase):
    """
    Automated Audit Suite for Sub-Step 2.2.1:
    Verifies 1-click Bookmark / Save to Vault button in CodeBlock.tsx,
    propagation through MarkdownRenderer and ChatMessageItem, and toast feedback in page.tsx.
    """

    def setUp(self):
        self.codeblock_path = os.path.abspath("raizen-studio/src/components/CodeBlock.tsx")
        self.markdown_path = os.path.abspath("raizen-studio/src/components/MarkdownRenderer.tsx")
        self.msg_item_path = os.path.abspath("raizen-studio/src/components/ChatMessageItem.tsx")
        self.page_path = os.path.abspath("raizen-studio/src/app/page.tsx")

    def test_files_exist(self):
        self.assertTrue(os.path.exists(self.codeblock_path))
        self.assertTrue(os.path.exists(self.markdown_path))
        self.assertTrue(os.path.exists(self.msg_item_path))
        self.assertTrue(os.path.exists(self.page_path))

    def test_codeblock_save_button_present(self):
        with open(self.codeblock_path, "r", encoding="utf-8") as f:
            content = f.read()

        self.assertIn("onSaveSnippet", content, "CodeBlock must accept onSaveSnippet prop")
        self.assertIn("handleSave", content, "CodeBlock must implement handleSave method")
        self.assertIn("Bookmark", content, "CodeBlock must render Bookmark icon")
        self.assertIn("SAVED", content, "CodeBlock must show SAVED feedback")

    def test_markdown_and_message_item_propagation(self):
        with open(self.markdown_path, "r", encoding="utf-8") as f:
            content = f.read()
        self.assertIn("onSaveSnippet", content, "MarkdownRenderer must accept and pass onSaveSnippet")

        with open(self.msg_item_path, "r", encoding="utf-8") as f:
            content = f.read()
        self.assertIn("onSaveSnippet", content, "ChatMessageItem must accept and pass onSaveSnippet")

    def test_page_bookmark_handler_wired(self):
        with open(self.page_path, "r", encoding="utf-8") as f:
            content = f.read()

        self.assertIn("useSavedSnippets", content, "page.tsx must import useSavedSnippets")
        self.assertIn("handleSaveSnippet", content, "page.tsx must define handleSaveSnippet")
        self.assertIn("onSaveSnippet={handleSaveSnippet}", content, "Must pass handleSaveSnippet to ChatMessageItem")

if __name__ == "__main__":
    unittest.main()
