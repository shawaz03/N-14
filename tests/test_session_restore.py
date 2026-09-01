import unittest
import os

class TestSessionRestore(unittest.TestCase):
    """
    Automated Audit Suite for Sub-Step 1.2.2:
    Verifies 1-click session restoration and dynamic view switching between
    HistoryView and Chat Studio in src/app/page.tsx and src/components/Sidebar.tsx.
    """

    def setUp(self):
        self.page_path = os.path.abspath("raizen-studio/src/app/page.tsx")
        self.sidebar_path = os.path.abspath("raizen-studio/src/components/Sidebar.tsx")

    def test_files_exist(self):
        self.assertTrue(os.path.exists(self.page_path), "page.tsx must exist")
        self.assertTrue(os.path.exists(self.sidebar_path), "Sidebar.tsx must exist")

    def test_sidebar_tab_routing_props(self):
        with open(self.sidebar_path, "r", encoding="utf-8") as f:
            content = f.read()

        self.assertIn("activeTab", content, "Sidebar must accept activeTab prop")
        self.assertIn("onSelectTab", content, "Sidebar must accept onSelectTab callback")

    def test_page_session_restore_handler(self):
        with open(self.page_path, "r", encoding="utf-8") as f:
            content = f.read()

        self.assertIn("handleSelectSession", content, "page.tsx must define handleSelectSession")
        self.assertIn("history.switchSession", content, "Must switch session in history hook")
        self.assertIn("setMessages(session.messages)", content, "Must restore messages into chat hook")
        self.assertIn('setActiveTab("chat")', content, "Must navigate back to chat view on restore")
        self.assertIn("<HistoryView", content, "page.tsx must render HistoryView when activeTab === history")

if __name__ == "__main__":
    unittest.main()
