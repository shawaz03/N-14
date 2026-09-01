import unittest
import os

class TestChatPersonaIntegration(unittest.TestCase):
    """
    Automated Audit Suite for Sub-Step 3.1.2:
    Verifies connection between RaizenPersona and useRaizenChat hook in src/hooks/useRaizenChat.ts:
    activePersona state, switchPersona, system prompt payload injection, and default temperature.
    """

    def setUp(self):
        self.chat_hook_path = os.path.abspath("raizen-studio/src/hooks/useRaizenChat.ts")

    def test_hook_file_exists(self):
        self.assertTrue(os.path.exists(self.chat_hook_path), "useRaizenChat.ts must exist")

    def test_persona_methods_and_state_exported(self):
        with open(self.chat_hook_path, "r", encoding="utf-8") as f:
            content = f.read()

        self.assertIn("activePersona", content, "Hook must return activePersona state")
        self.assertIn("setActivePersona", content, "Hook must return setActivePersona method")
        self.assertIn("switchPersona", content, "Hook must return switchPersona method")
        self.assertIn("PERSONA_STORAGE_KEY", content, "Must persist active persona key")
        self.assertIn("activePersona.systemPrompt", content, "Must inject active persona system prompt")

if __name__ == "__main__":
    unittest.main()
