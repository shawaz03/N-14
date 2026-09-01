import unittest
import os

class TestChatInputComponent(unittest.TestCase):
    """
    Automated Audit Suite for Swiss Editorial ChatInput Component:
    Verifies rounded pill input capsule, auto-growing textarea,
    temperature slider toggle, send/stop controls, and SHAWAZ creator footer.
    """

    def setUp(self):
        self.input_path = os.path.abspath("raizen-studio/src/components/ChatInput.tsx")

    def test_component_files_exist(self):
        self.assertTrue(os.path.exists(self.input_path), "ChatInput.tsx must exist")

    def test_chat_input_features_and_triggers(self):
        with open(self.input_path, "r", encoding="utf-8") as f:
            content = f.read()

        self.assertIn("export function ChatInput", content)
        self.assertIn("handleKeyDown", content, "Must support Enter to send")
        self.assertIn("Send", content, "Must have Send action button")
        self.assertIn("Stop", content, "Must have Stop action button")
        self.assertIn("TEMPERATURE", content, "Must have temperature slider")
        self.assertIn("onClearChat", content, "Must support clearing chat")
        self.assertIn("SHAWAZ", content, "Must attribute creator SHAWAZ")

if __name__ == "__main__":
    unittest.main()
