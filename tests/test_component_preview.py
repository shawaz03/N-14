import unittest
import os

class TestComponentPreview(unittest.TestCase):
    """
    Automated Audit Suite for Sub-Step 5.5.3:
    Verifies ComponentPreview sandboxed iframe runner,
    React 18 & Babel standalone compilation, Tailwind CSS CDN, and error boundary overlay.
    """

    def setUp(self):
        self.preview_path = os.path.abspath("raizen-studio/src/components/ComponentPreview.tsx")

    def test_preview_file_exists(self):
        self.assertTrue(os.path.exists(self.preview_path), "ComponentPreview.tsx must exist")

    def test_sandbox_iframe_security(self):
        with open(self.preview_path, "r", encoding="utf-8") as f:
            content = f.read()

        self.assertIn("export function ComponentPreview", content)
        self.assertIn('sandbox="allow-scripts allow-modals allow-same-origin"', content)
        self.assertIn("srcdoc", content, "Must inject dynamic HTML document via srcdoc")

    def test_react_babel_and_tailwind_cdn(self):
        with open(self.preview_path, "r", encoding="utf-8") as f:
            content = f.read()

        self.assertIn("react@18", content, "Must inject React 18 CDN")
        self.assertIn("react-dom@18", content, "Must inject ReactDOM 18 CDN")
        self.assertIn("@babel/standalone", content, "Must inject Babel standalone compiler")
        self.assertIn("cdn.tailwindcss.com", content, "Must inject Tailwind CSS CDN")

    def test_error_handling_and_refresh(self):
        with open(self.preview_path, "r", encoding="utf-8") as f:
            content = f.read()

        self.assertIn("RAIZEN_SANDBOX_ERROR", content, "Must trap sandbox runtime errors")
        self.assertIn("REFRESH", content, "Must provide refresh trigger")

if __name__ == "__main__":
    unittest.main()
