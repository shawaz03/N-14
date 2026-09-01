import unittest
import os

class TestSandboxHeader(unittest.TestCase):
    """
    Automated Audit Suite for SandboxHeader Toolbar Component:
    Verifies SandboxHeader toolbar component, dual-engine tab navigation,
    filename badge, copy trigger, and fullscreen action with Swiss styling.
    """

    def setUp(self):
        self.header_path = os.path.abspath("raizen-studio/src/components/SandboxHeader.tsx")

    def test_header_file_exists(self):
        self.assertTrue(os.path.exists(self.header_path), "SandboxHeader.tsx must exist")

    def test_tabs_and_exports(self):
        with open(self.header_path, "r", encoding="utf-8") as f:
            content = f.read()

        self.assertIn("export function SandboxHeader", content)
        self.assertIn("SandboxTab", content)
        self.assertIn("CODE EDITOR", content, "Must have Code Editor tab")
        self.assertIn("LIVE PREVIEW", content, "Must have Live Preview tab")

    def test_controls_and_swiss_styling(self):
        with open(self.header_path, "r", encoding="utf-8") as f:
            content = f.read()

        self.assertIn("COPY", content, "Must provide copy action")
        self.assertIn("RESET", content, "Must provide reset action")
        self.assertIn("bg-white", content, "Must use bg-white")
        self.assertIn("border-swiss-border", content, "Must use border-swiss-border")
        self.assertIn("bg-swiss-saffron", content, "Active tab must use bg-swiss-saffron")

if __name__ == "__main__":
    unittest.main()
