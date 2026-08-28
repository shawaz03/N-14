import unittest
import os

class TestToastSystem(unittest.TestCase):
    """
    Automated Audit Suite for Sub-Step 5.6.2:
    Verifies the Toast notification system, useToast hook,
    and integration into page.tsx with Terminal Brutalism styles.
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

    def test_toast_brutalist_styling(self):
        with open(self.toast_path, "r", encoding="utf-8") as f:
            content = f.read()

        self.assertIn("export function ToastContainer", content)
        self.assertIn("border-l-4 border-l-signal", content, "Must use 4px solid left accent border")
        self.assertIn("bg-surface", content, "Must use bg-surface")
        self.assertIn("shadow-hard-dark", content, "Must use shadow-hard-dark")

    def test_page_toast_integration(self):
        with open(self.page_path, "r", encoding="utf-8") as f:
            content = f.read()

        self.assertIn("ToastContainer", content, "page.tsx must render ToastContainer")
        self.assertIn("useToast", content, "page.tsx must call useToast")

if __name__ == "__main__":
    unittest.main()
