import unittest
import os

class TestColabModal(unittest.TestCase):
    """
    Automated Audit Suite for Sub-Step 5.2.3:
    Verifies the Colab Quick-Launch Modal component, 1-click Google Colab launch URL,
    3-step connection guide, tunnel input form, and SHAWAZ creator attribution.
    """

    def setUp(self):
        self.modal_path = os.path.abspath("raizen-studio/src/components/ColabModal.tsx")

    def test_modal_file_exists(self):
        self.assertTrue(os.path.exists(self.modal_path), "ColabModal.tsx must exist in src/components/")

    def test_colab_notebook_url(self):
        with open(self.modal_path, "r", encoding="utf-8") as f:
            content = f.read()

        self.assertIn("colab.research.google.com", content, "Modal must link to Google Colab")
        self.assertIn("RAIZEN_Colab_Engine.ipynb", content, "Modal must target RAIZEN_Colab_Engine.ipynb")

    def test_three_step_protocol_present(self):
        with open(self.modal_path, "r", encoding="utf-8") as f:
            content = f.read()

        self.assertIn("EXECUTION PROTOCOL", content, "Modal must have 3-step protocol header")
        self.assertIn("Open Google Colab Notebook", content, "Step 1 text must be present")
        self.assertIn("Run All Cells in Colab", content, "Step 2 text must be present")
        self.assertIn("Paste Public Cloudflare Tunnel URL", content, "Step 3 text must be present")

    def test_creator_attribution_and_portfolio_link(self):
        with open(self.modal_path, "r", encoding="utf-8") as f:
            content = f.read()

        self.assertIn("SHAWAZ", content, "Modal must attribute creator SHAWAZ")
        self.assertIn("https://shawaz.vercel.app/", content, "Modal must link to SHAWAZ portfolio")

if __name__ == "__main__":
    unittest.main()
