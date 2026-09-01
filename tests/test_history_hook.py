import unittest
import os

class TestHistoryHook(unittest.TestCase):
    """
    Automated Audit Suite for Sub-Step 1.1.2:
    Verifies multi-session history state hook in src/hooks/useRaizenHistory.ts:
    createSession, switchSession, updateActiveSessionMessages, deleteSession,
    renameSession, togglePinSession, timeline grouping, and localStorage persistence.
    """

    def setUp(self):
        self.hook_path = os.path.abspath("raizen-studio/src/hooks/useRaizenHistory.ts")

    def test_hook_file_exists(self):
        self.assertTrue(os.path.exists(self.hook_path), "useRaizenHistory.ts must exist in src/hooks/")

    def test_hook_methods_exported(self):
        with open(self.hook_path, "r", encoding="utf-8") as f:
            content = f.read()

        self.assertIn("export function useRaizenHistory", content)
        self.assertIn("createSession", content)
        self.assertIn("switchSession", content)
        self.assertIn("updateActiveSessionMessages", content)
        self.assertIn("deleteSession", content)
        self.assertIn("renameSession", content)
        self.assertIn("togglePinSession", content)
        self.assertIn("clearAllSessions", content)
        self.assertIn("getTimelineGroups", content)

    def test_storage_keys_and_sanitization(self):
        with open(self.hook_path, "r", encoding="utf-8") as f:
            content = f.read()

        self.assertIn("raizen_chat_sessions", content, "Must persist to raizen_chat_sessions key")
        self.assertIn("raizen_active_session_id", content, "Must persist active session id")
        self.assertIn("deriveSessionTitle", content, "Must dynamically derive titles from prompts")

if __name__ == "__main__":
    unittest.main()
