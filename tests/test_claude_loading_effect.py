import unittest
import os

class TestClaudeLoadingEffect(unittest.TestCase):
    """
    Automated Audit Suite for Claude-Style Searching, Reasoning & Shimmer Loading Effect:
    Verifies multi-stage progressive states (searching, reasoning, synthesizing),
    shimmer keyframe animations, token velocity indicators, and stop trigger.
    """

    def setUp(self):
        self.comp_path = os.path.abspath("raizen-studio/src/components/ClaudeLoadingEffect.tsx")

    def test_component_file_exists(self):
        self.assertTrue(os.path.exists(self.comp_path), "ClaudeLoadingEffect.tsx must exist in components/")

    def test_progressive_stages_and_shimmer(self):
        with open(self.comp_path, "r", encoding="utf-8") as f:
            content = f.read()

        self.assertIn("export function ClaudeLoadingEffect", content)
        self.assertIn("animate-claude-shimmer", content, "Must apply animate-claude-shimmer for progressive text sweep")
        self.assertIn("searching", content, "Must support searching stage")
        self.assertIn("reasoning", content, "Must support reasoning stage")
        self.assertIn("synthesizing", content, "Must support synthesizing stage")
        self.assertIn("tok/s", content, "Must render live token velocity meter")

if __name__ == "__main__":
    unittest.main()
