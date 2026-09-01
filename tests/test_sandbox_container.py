import unittest
import os

class TestSandboxContainer(unittest.TestCase):
    """
    Automated Audit Suite for SandboxContainer Component:
    Verifies SandboxContainer workspace split-pane layout,
    view mode toggles (chat, split, sandbox), and Swiss styling.
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

    def test_swiss_styling_and_slots(self):
        with open(self.container_path, "r", encoding="utf-8") as f:
            content = f.read()

        self.assertIn("chatSlot", content, "Must render chat slot")
        self.assertIn("sandboxSlot", content, "Must render sandbox slot")
        self.assertIn("border-swiss-border", content, "Must use border-swiss-border divider")
        self.assertIn("bg-swiss-canvas", content, "Must use bg-swiss-canvas base")

if __name__ == "__main__":
    unittest.main()
