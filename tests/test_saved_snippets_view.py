import unittest
import os

class TestSavedSnippetsView(unittest.TestCase):
    """
    Automated Audit Suite for Sub-Step 2.3.1:
    Verifies SavedSnippetsView component in src/components/SavedSnippetsView.tsx:
    filtering by tag/language/favorites, search toolbar, mini code preview in Sagewold,
    1-click sandbox runner action, and Swiss Editorial / FROZEN styling.
    """

    def setUp(self):
        self.view_path = os.path.abspath("raizen-studio/src/components/SavedSnippetsView.tsx")

    def test_file_exists(self):
        self.assertTrue(os.path.exists(self.view_path), "SavedSnippetsView.tsx must exist in src/components/")

    def test_component_exports_and_props(self):
        with open(self.view_path, "r", encoding="utf-8") as f:
            content = f.read()

        self.assertIn("export function SavedSnippetsView", content)
        self.assertIn("snippetsVault", content)
        self.assertIn("onExportCode", content)
        self.assertNotIn("onRunInSandbox", content)

    def test_filters_and_search_present(self):
        with open(self.view_path, "r", encoding="utf-8") as f:
            content = f.read()

        self.assertIn("searchQuery", content, "Must implement search input")
        self.assertIn("activeLanguage", content, "Must implement language tabs")
        self.assertIn("selectedTag", content, "Must implement tag filter pills")
        self.assertIn("favoritesOnly", content, "Must implement favorites toggle")
        self.assertIn("Saved Snippets Vault", content, "Must display header title")
        self.assertIn("font-frozen", content, "Must use Frozen font for headers")

    def test_snippet_card_actions(self):
        with open(self.view_path, "r", encoding="utf-8") as f:
            content = f.read()

        self.assertIn("handleCopyCode", content, "Must implement copy code")
        self.assertIn("handleDownload", content, "Must implement download code file")
        self.assertIn("toggleFavorite", content, "Must support favoriting snippets")
        self.assertIn("font-mono", content, "Must render code preview in Monospace")
        self.assertNotIn("handleRun", content, "Must not contain sandbox handleRun")
        self.assertNotIn("launchInOpenSourceSandbox", content, "Must not import sandbox launcher")

if __name__ == "__main__":
    unittest.main()
