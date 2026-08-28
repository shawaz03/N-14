import unittest
import os

class TestCodeBlockComponent(unittest.TestCase):
    """
    Automated Audit Suite for Sub-Step 5.4.2:
    Verifies the Hero CodeBlock component adhering strictly to Terminal Brutalism specs:
    #000000 deep black bg, 2px left accent border, line numbers, and live sandbox action button.
    """

    def setUp(self):
        self.component_path = os.path.abspath("raizen-studio/src/components/CodeBlock.tsx")

    def test_component_file_exists(self):
        self.assertTrue(os.path.exists(self.component_path), "CodeBlock.tsx must exist")

    def test_brutalist_code_block_styling(self):
        with open(self.component_path, "r", encoding="utf-8") as f:
            content = f.read()

        self.assertIn("export function CodeBlock", content)
        self.assertIn("bg-black", content, "CodeBlock must use deep black background #000000")
        self.assertIn("border-l-2 border-l-signal", content, "CodeBlock must have 2px solid left accent border")
        self.assertIn("border-edge-light", content, "CodeBlock must use 1px border-edge-light")

    def test_actions_and_sandbox_bridge(self):
        with open(self.component_path, "r", encoding="utf-8") as f:
            content = f.read()

        self.assertIn("RUN IN SANDBOX", content, "CodeBlock must provide RUN IN SANDBOX action button")
        self.assertIn("COPY", content, "CodeBlock must provide COPY action button")
        self.assertIn("onRunInSandbox", content, "CodeBlock must invoke onRunInSandbox callback")

    def test_line_numbers_and_zero_rounded(self):
        with open(self.component_path, "r", encoding="utf-8") as f:
            content = f.read()

        self.assertIn("idx + 1", content, "CodeBlock must compute line numbers")
        self.assertNotIn("rounded-2xl", content, "Must not use rounded-2xl")
        self.assertNotIn("rounded-3xl", content, "Must not use rounded-3xl")

if __name__ == "__main__":
    unittest.main()
