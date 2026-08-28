import unittest
import os

class TestFinalDocumentation(unittest.TestCase):
    """
    Automated Audit Suite for Sub-Step 6.3:
    Verifies master README.md and studio README.md documentation,
    creator attribution to SHAWAZ, Hugging Face model links, and system architecture.
    """

    def setUp(self):
        self.root_readme = os.path.abspath("README.md")
        self.studio_readme = os.path.abspath("raizen-studio/README.md")

    def test_readme_files_exist(self):
        self.assertTrue(os.path.exists(self.root_readme), "Root README.md must exist")
        self.assertTrue(os.path.exists(self.studio_readme), "Studio README.md must exist")

    def test_creator_attribution_and_portfolio_link(self):
        with open(self.root_readme, "r", encoding="utf-8") as f:
            content = f.read()

        self.assertIn("SHAWAZ", content, "README must prominently feature creator SHAWAZ")
        self.assertIn("https://shawaz.vercel.app/", content, "README must link to SHAWAZ portfolio")
        self.assertIn("shawaz03/RAIZEN", content, "README must link to shawaz03/RAIZEN model")
        self.assertIn("RAIZEN_Colab_Engine.ipynb", content, "README must link to Colab notebook")

    def test_all_six_phases_documented(self):
        with open(self.root_readme, "r", encoding="utf-8") as f:
            content = f.read()

        self.assertIn("Phase 1", content)
        self.assertIn("Phase 2", content)
        self.assertIn("Phase 3", content)
        self.assertIn("Phase 4", content)
        self.assertIn("Phase 5", content)
        self.assertIn("Phase 6", content)

if __name__ == "__main__":
    unittest.main()
