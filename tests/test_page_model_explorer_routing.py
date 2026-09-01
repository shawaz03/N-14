import unittest
import os

class TestPageModelExplorerRouting(unittest.TestCase):
    """
    Automated Audit Suite for Sub-Step 3.2.2:
    Verifies Model Explorer view integration and persona switching in src/app/page.tsx.
    """

    def setUp(self):
        self.page_path = os.path.abspath("raizen-studio/src/app/page.tsx")

    def test_page_file_exists(self):
        self.assertTrue(os.path.exists(self.page_path))

    def test_model_explorer_view_rendered(self):
        with open(self.page_path, "r", encoding="utf-8") as f:
            content = f.read()

        self.assertIn("import { ModelExplorerView }", content, "page.tsx must import ModelExplorerView")
        self.assertIn("handleSelectPersona", content, "page.tsx must define handleSelectPersona")
        self.assertIn('<ModelExplorerView', content, "page.tsx must render ModelExplorerView")
        self.assertIn('activeTab === "explore"', content, "Must render ModelExplorerView when activeTab is explore")
        self.assertIn('activePersona={activePersona}', content, "Must pass activePersona prop")
        self.assertIn('onSelectPersona={handleSelectPersona}', content, "Must pass onSelectPersona prop")

if __name__ == "__main__":
    unittest.main()
