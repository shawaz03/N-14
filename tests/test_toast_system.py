import unittest
import os

class TestToastSystem(unittest.TestCase):
    """
    Automated Audit Suite for Toast Notification System:
    Verifies Toast notification system, useToast hook,
    and integration into page.tsx with Swiss Editorial styles.
    """

    def setUp(self):
        self.toast_path = os.path.abspath("raizen-studio/src/components/Toast.tsx")
        self.hook_path = os.path.abspath("raizen-studio/src/hooks/useToast.ts")
        self.types_path = os.path.abspath("raizen-studio/src/types/toast.ts")
        self.page_path = os.path.abspath("raizen-studio/src/app/page.tsx")

    def test_toast_files_exist(self):
        self.assertTrue(os.path.exists(self.toast_path), "Toast.tsx must exist")
        self.assertTrue(os.path.exists(self.hook_path), "useToast.ts must exist")
        self.assertTrue(os.path.exists(self.types_path), "toast.ts must exist")

    def test_toast_swiss_styling(self):
        with open(self.toast_path, "r", encoding="utf-8") as f:
            content = f.read()

        self.assertIn("export function ToastContainer", content)
        self.assertIn("border-l-4 border-l-swiss-saffron", content, "Must use Swiss Saffron left accent border")
        self.assertIn("bg-white", content, "Must use pure white card background")
        self.assertIn("shadow-swiss-lg", content, "Must use shadow-swiss-lg")
        self.assertIn("font-frozen", content, "Must use Frozen font for toast title")

    def test_page_toast_integration(self):
        with open(self.page_path, "r", encoding="utf-8") as f:
            content = f.read()

        self.assertIn("ToastContainer", content, "page.tsx must render ToastContainer")
        self.assertIn("useToast", content, "page.tsx must call useToast")

if __name__ == "__main__":
    unittest.main()
