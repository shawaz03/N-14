import unittest
import os

class TestPageSessionSync(unittest.TestCase):
    """
    Automated Audit Suite for Sub-Step 1.1.3:
    Verifies connection between useRaizenHistory, useRaizenChat,
    and Sidebar onNewChat / [+ New Session] trigger in src/app/page.tsx.
    """

    def setUp(self):
        self.page_path = os.path.abspath("raizen-studio/src/app/page.tsx")

    def test_page_file_exists(self):
        self.assertTrue(os.path.exists(self.page_path), "page.tsx must exist in src/app/")

    def test_history_hook_integration(self):
        with open(self.page_path, "r", encoding="utf-8") as f:
            content = f.read()

        self.assertIn("useRaizenHistory", content, "page.tsx must import and call useRaizenHistory")
        self.assertIn("handleStartNewSession", content, "page.tsx must define handleStartNewSession")
        self.assertIn("history.createSession", content, "Must create fresh session on New Session")
        self.assertIn("history.updateActiveSessionMessages", content, "Must sync active conversation messages")
        self.assertIn("onNewChat={handleStartNewSession}", content, "Must wire Sidebar onNewChat")

if __name__ == "__main__":
    unittest.main()
