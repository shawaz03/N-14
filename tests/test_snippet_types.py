import unittest
import os

class TestSnippetTypes(unittest.TestCase):
    """
    Automated Audit Suite for Sub-Step 2.1.1:
    Verifies Saved Snippet TypeScript interfaces in src/types/snippet.ts:
    SavedSnippet, SnippetFilterState, SnippetLanguageFilter, and creator attribution.
    """

    def setUp(self):
        self.snippet_types_path = os.path.abspath("raizen-studio/src/types/snippet.ts")

    def test_file_exists(self):
        self.assertTrue(os.path.exists(self.snippet_types_path), "snippet.ts must exist in src/types/")

    def test_type_interfaces_exported(self):
        with open(self.snippet_types_path, "r", encoding="utf-8") as f:
            content = f.read()

        self.assertIn("export interface SavedSnippet", content)
        self.assertIn("export interface SnippetFilterState", content)
        self.assertIn("SnippetLanguageFilter", content)
        self.assertIn("tags: string[];", content)
        self.assertIn("isFavorite?: boolean;", content)
        self.assertIn("filename?: string;", content)
        self.assertIn("SHAWAZ", content)
        self.assertIn("https://shawaz.vercel.app/", content)

if __name__ == "__main__":
    unittest.main()
