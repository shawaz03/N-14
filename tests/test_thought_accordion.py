import unittest
import os

class TestThoughtAccordion(unittest.TestCase):
    """
    Automated Audit Suite for Sub-Step 5.4.4:
    Verifies ThoughtAccordion reasoning dropdown component,
    AsciiDivider reusable lines, and MarkdownRenderer <think> tag extraction.
    """

    def setUp(self):
        self.accordion_path = os.path.abspath("raizen-studio/src/components/ThoughtAccordion.tsx")
        self.divider_path = os.path.abspath("raizen-studio/src/components/AsciiDivider.tsx")
        self.renderer_path = os.path.abspath("raizen-studio/src/components/MarkdownRenderer.tsx")

    def test_component_files_exist(self):
        self.assertTrue(os.path.exists(self.accordion_path), "ThoughtAccordion.tsx must exist")
        self.assertTrue(os.path.exists(self.divider_path), "AsciiDivider.tsx must exist")

    def test_accordion_and_divider_exports(self):
        with open(self.accordion_path, "r", encoding="utf-8") as f:
            content = f.read()
        self.assertIn("export function ThoughtAccordion", content)
        self.assertIn("Thought & Architectural Reasoning", content)

        with open(self.divider_path, "r", encoding="utf-8") as f:
            div_content = f.read()
        self.assertIn("export function AsciiDivider", div_content)

    def test_renderer_think_integration(self):
        with open(self.renderer_path, "r", encoding="utf-8") as f:
            content = f.read()

        self.assertIn("ThoughtAccordion", content, "MarkdownRenderer must import ThoughtAccordion")
        self.assertIn("AsciiDivider", content, "MarkdownRenderer must import AsciiDivider")
        self.assertIn("<think>", content, "MarkdownRenderer must parse <think> tags")

if __name__ == "__main__":
    unittest.main()
