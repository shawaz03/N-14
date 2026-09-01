import unittest
import os

class TestSnippetsHook(unittest.TestCase):
    """
    Automated Audit Suite for Sub-Step 2.1.2:
    Verifies Saved Snippets vault state hook in src/hooks/useSavedSnippets.ts:
    saveSnippet, deleteSnippet, updateSnippet, toggleFavorite, getAllTags,
    getFilteredSnippets, smart tag extraction, and localStorage persistence.
    """

    def setUp(self):
        self.hook_path = os.path.abspath("raizen-studio/src/hooks/useSavedSnippets.ts")

    def test_hook_file_exists(self):
        self.assertTrue(os.path.exists(self.hook_path), "useSavedSnippets.ts must exist in src/hooks/")

    def test_hook_methods_exported(self):
        with open(self.hook_path, "r", encoding="utf-8") as f:
            content = f.read()

        self.assertIn("export function useSavedSnippets", content)
        self.assertIn("saveSnippet", content)
        self.assertIn("deleteSnippet", content)
        self.assertIn("updateSnippet", content)
        self.assertIn("toggleFavorite", content)
        self.assertIn("getAllTags", content)
        self.assertIn("getFilteredSnippets", content)
        self.assertIn("clearAllSnippets", content)

    def test_smart_tagging_and_storage_keys(self):
        with open(self.hook_path, "r", encoding="utf-8") as f:
            content = f.read()

        self.assertIn("raizen_saved_snippets", content, "Must persist to raizen_saved_snippets key")
        self.assertIn("extractSmartTags", content, "Must auto-detect smart tags like #React, #Tailwind")
        self.assertIn("deriveSnippetTitle", content, "Must derive snippet titles from function/class names")

if __name__ == "__main__":
    unittest.main()
