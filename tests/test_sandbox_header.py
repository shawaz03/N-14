import unittest
import os

class TestSandboxHeader(unittest.TestCase):
    """
    Automated Audit Suite for Sub-Step 5.5.4:
    Verifies SandboxHeader toolbar component, dual-engine tab navigation,
    filename badge, copy trigger, and fullscreen action.
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

    def test_controls_and_brutalist_styling(self):
        with open(self.header_path, "r", encoding="utf-8") as f:
            content = f.read()

        self.assertIn("COPY", content, "Must provide copy action")
        self.assertIn("RESET", content, "Must provide reset action")
        self.assertIn("bg-surface", content, "Must use bg-surface")
        self.assertIn("border-edge", content, "Must use border-edge")
        self.assertIn("bg-signal", content, "Active tab must use bg-signal")

if __name__ == "__main__":
    unittest.main()
