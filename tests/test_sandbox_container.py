import unittest
import os

class TestSandboxContainer(unittest.TestCase):
    """
    Automated Audit Suite for Sub-Step 5.5.1:
    Verifies SandboxContainer workspace split-pane layout,
    view mode toggles (chat, split, sandbox), and Terminal Brutalism styling.
    """

    def setUp(self):
        self.container_path = os.path.abspath("raizen-studio/src/components/SandboxContainer.tsx")

    def test_container_file_exists(self):
        self.assertTrue(os.path.exists(self.container_path), "SandboxContainer.tsx must exist")

    def test_layout_modes_and_exports(self):
        with open(self.container_path, "r", encoding="utf-8") as f:
            content = f.read()

        self.assertIn("export function SandboxContainer", content)
        self.assertIn("WorkspaceViewMode", content)
        self.assertIn('"chat"', content)
        self.assertIn('"split"', content)
        self.assertIn('"sandbox"', content)

    def test_terminal_brutalism_styling_and_slots(self):
        with open(self.container_path, "r", encoding="utf-8") as f:
            content = f.read()

        self.assertIn("chatSlot", content, "Must render chat slot")
        self.assertIn("sandboxSlot", content, "Must render sandbox slot")
        self.assertIn("border-edge", content, "Must use border-edge divider")
        self.assertIn("bg-void", content, "Must use bg-void base")

if __name__ == "__main__":
    unittest.main()
