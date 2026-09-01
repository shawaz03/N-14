import unittest
import os

class TestSessionTypes(unittest.TestCase):
    """
    Automated Audit Suite for Sub-Step 1.1.1:
    Verifies multi-session TypeScript interfaces in src/types/session.ts:
    ChatSession, SessionMetadata, HistoryTimelineGroup, HistoryFilterState,
    and SHAWAZ creator attribution.
    """

    def setUp(self):
        self.session_types_path = os.path.abspath("raizen-studio/src/types/session.ts")

    def test_file_exists(self):
        self.assertTrue(os.path.exists(self.session_types_path), "session.ts must exist in src/types/")

    def test_type_interfaces_exported(self):
        with open(self.session_types_path, "r", encoding="utf-8") as f:
            content = f.read()

        self.assertIn("export interface SessionMetadata", content)
        self.assertIn("export interface ChatSession", content)
        self.assertIn("export interface HistoryTimelineGroup", content)
        self.assertIn("export interface HistoryFilterState", content)
        self.assertIn("HistoryTimeBucket", content)

    def test_chat_message_integration_and_metadata(self):
        with open(self.session_types_path, "r", encoding="utf-8") as f:
            content = f.read()

        self.assertIn('import { ChatMessage } from "./chat";', content)
        self.assertIn("messages: ChatMessage[];", content)
        self.assertIn("isPinned?: boolean;", content)
        self.assertIn("createdAt: number;", content)
        self.assertIn("updatedAt: number;", content)
        self.assertIn("SHAWAZ", content)
        self.assertIn("https://shawaz.vercel.app/", content)

if __name__ == "__main__":
    unittest.main()
