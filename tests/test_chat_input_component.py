import unittest
import os

class TestChatInputComponent(unittest.TestCase):
    """
    Automated Audit Suite for Sub-Step 5.4.5:
    Verifies the ChatInput command bar, QuickActions preset chips,
    auto-growing textarea, temperature parameter slider, and Send/Stop handlers.
    """

    def setUp(self):
        self.input_path = os.path.abspath("raizen-studio/src/components/ChatInput.tsx")
        self.quick_path = os.path.abspath("raizen-studio/src/components/QuickActions.tsx")

    def test_component_files_exist(self):
        self.assertTrue(os.path.exists(self.input_path), "ChatInput.tsx must exist")
        self.assertTrue(os.path.exists(self.quick_path), "QuickActions.tsx must exist")

    def test_quick_actions_presets(self):
        with open(self.quick_path, "r", encoding="utf-8") as f:
            content = f.read()

        self.assertIn("export function QuickActions", content)
        self.assertIn("PRESET_PROMPTS", content)
        self.assertIn("React Dashboard", content)
        self.assertIn("Terminal Brutalist UI", content)

    def test_chat_input_features_and_triggers(self):
        with open(self.input_path, "r", encoding="utf-8") as f:
            content = f.read()

        self.assertIn("export function ChatInput", content)
        self.assertIn("&gt;", content, "Must have > command prompt prefix")
        self.assertIn("handleKeyDown", content, "Must support Enter to send")
        self.assertIn("SEND", content, "Must have SEND action button")
        self.assertIn("STOP", content, "Must have STOP action button")
        self.assertIn("TEMPERATURE", content, "Must have temperature slider")
        self.assertIn("onClearChat", content, "Must support clearing chat")

if __name__ == "__main__":
    unittest.main()
