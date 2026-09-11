import unittest
import os

class TestCodeExport(unittest.TestCase):
    """
    Automated Audit Suite for Sub-Step 5.6.3:
    Verifies code export hook, standalone portable HTML packaging,
    and SHAWAZ creator attribution in exported artifacts.
    """

    def setUp(self):
        self.export_path = os.path.abspath("raizen-studio/src/hooks/useCodeExport.ts")
        self.snippets_path = os.path.abspath("raizen-studio/src/components/SavedSnippetsView.tsx")
        self.page_path = os.path.abspath("raizen-studio/src/app/page.tsx")

    def test_export_file_exists(self):
        self.assertTrue(os.path.exists(self.export_path), "useCodeExport.ts must exist")

    def test_export_functions_and_creator_attribution(self):
        with open(self.export_path, "r", encoding="utf-8") as f:
            content = f.read()

        self.assertIn("export function exportFile", content)
        self.assertIn("export function exportStandaloneHtml", content)
        self.assertIn("export function useCodeExport", content)
        self.assertIn("SHAWAZ", content, "Exported HTML header must attribute creator SHAWAZ")
        self.assertIn("https://shawaz.vercel.app/", content, "Exported HTML must link to creator portfolio")
        self.assertIn("react@18", content, "Exported HTML must bundle React 18")

    def test_export_integration_in_snippets_and_page(self):
        with open(self.snippets_path, "r", encoding="utf-8") as f:
            snippets_content = f.read()
        self.assertIn("onExportCode", snippets_content, "SavedSnippetsView must accept onExportCode")
        self.assertIn("Export", snippets_content, "SavedSnippetsView must render Export button")

        with open(self.page_path, "r", encoding="utf-8") as f:
            page_content = f.read()
        self.assertIn("useCodeExport", page_content, "page.tsx must import useCodeExport")
        self.assertIn("handleExportCode", page_content, "page.tsx must define handleExportCode")

if __name__ == "__main__":
    unittest.main()
