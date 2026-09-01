import unittest
import os

class TestCodeBlockComponent(unittest.TestCase):
    """
    Automated Audit Suite for Swiss Architectural CodeBlock Component:
    Verifies dark obsidian code pod, Sagewold font bindings, line numbers,
    copy button, and 1-click open-source sandbox launching trigger.
    """

    def setUp(self):
        self.component_path = os.path.abspath("raizen-studio/src/components/CodeBlock.tsx")

    def test_component_file_exists(self):
        self.assertTrue(os.path.exists(self.component_path), "CodeBlock.tsx must exist")

    def test_swiss_code_block_styling_and_font(self):
        with open(self.component_path, "r", encoding="utf-8") as f:
            content = f.read()

        self.assertIn("export function CodeBlock", content)
        self.assertIn("font-mono", content, "CodeBlock must use monospace font")
        self.assertIn("bg-swiss-saffron", content, "CodeBlock must feature Swiss Saffron accent")

    def test_actions_and_sandbox_bridge(self):
        with open(self.component_path, "r", encoding="utf-8") as f:
            content = f.read()

        self.assertIn("RUN IN SANDBOX", content, "CodeBlock must provide RUN IN SANDBOX action button")
        self.assertIn("COPY", content, "CodeBlock must provide COPY action button")
        self.assertIn("launchInOpenSourceSandbox", content, "CodeBlock must trigger launchInOpenSourceSandbox")

    def test_line_numbers(self):
        with open(self.component_path, "r", encoding="utf-8") as f:
            content = f.read()

        self.assertIn("idx + 1", content, "CodeBlock must compute line numbers")

if __name__ == "__main__":
    unittest.main()
