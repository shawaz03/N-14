import unittest
import os

class TestChatHook(unittest.TestCase):
    """
    Automated Audit Suite for Sub-Step 5.3.2:
    Verifies the useRaizenChat state hook, multi-turn history reducer,
    token velocity tracker, and SHAWAZ creator attribution in the welcome message.
    """

    def setUp(self):
        self.hook_path = os.path.abspath("raizen-studio/src/hooks/useRaizenChat.ts")

    def test_hook_file_exists(self):
        self.assertTrue(os.path.exists(self.hook_path), "useRaizenChat.ts must exist in src/hooks/")

    def test_initial_welcome_and_creator_attribution(self):
        with open(self.hook_path, "r", encoding="utf-8") as f:
            content = f.read()

        self.assertIn("INITIAL_ASSISTANT_MESSAGE", content, "Must export INITIAL_ASSISTANT_MESSAGE")
        self.assertIn("SHAWAZ", content, "Welcome message must attribute creator SHAWAZ")
        self.assertIn("https://shawaz.vercel.app/", content, "Welcome message must link to https://shawaz.vercel.app/")
        self.assertIn("RAIZEN", content, "Welcome message must mention RAIZEN")

    def test_state_management_and_methods(self):
        with open(self.hook_path, "r", encoding="utf-8") as f:
            content = f.read()

        self.assertIn("export function useRaizenChat", content)
        self.assertIn("sendMessage", content, "Must export sendMessage function")
        self.assertIn("stopStreaming", content, "Must export stopStreaming function")
        self.assertIn("clearMessages", content, "Must export clearMessages function")
        self.assertIn("raizen_chat_history", content, "Must persist to raizen_chat_history localStorage key")
        self.assertIn("setTokensPerSec", content, "Must calculate real-time token speed")

if __name__ == "__main__":
    unittest.main()
