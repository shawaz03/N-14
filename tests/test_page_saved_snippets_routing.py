import unittest
import os

class TestPageSavedSnippetsRouting(unittest.TestCase):
    """
    Automated Audit Suite for Sub-Step 2.3.2:
    Verifies Saved Snippets Vault view integration and routing in src/app/page.tsx.
    """

    def setUp(self):
        self.page_path = os.path.abspath("raizen-studio/src/app/page.tsx")

    def test_page_file_exists(self):
        self.assertTrue(os.path.exists(self.page_path))

    def test_saved_snippets_view_rendered(self):
        with open(self.page_path, "r", encoding="utf-8") as f:
            content = f.read()

        self.assertIn("import { SavedSnippetsView }", content, "page.tsx must import SavedSnippetsView")
        self.assertIn("useSavedSnippets", content, "page.tsx must use useSavedSnippets hook")
        self.assertIn('<SavedSnippetsView', content, "page.tsx must render SavedSnippetsView")
        self.assertIn('activeTab === "saved"', content, "Must render SavedSnippetsView when activeTab is saved")
        self.assertIn('snippetsVault={snippetsVault}', content, "Must pass snippetsVault prop")

if __name__ == "__main__":
    unittest.main()
