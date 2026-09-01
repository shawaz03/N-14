import unittest
import os

class TestHistoryViewComponent(unittest.TestCase):
    """
    Automated Audit Suite for Sub-Step 1.2.1:
    Verifies HistoryView component in src/components/HistoryView.tsx:
    timeline grouping, search filter bar, time bucket chips, rename/pin/delete triggers,
    and Swiss Editorial / FROZEN styling.
    """

    def setUp(self):
        self.view_path = os.path.abspath("raizen-studio/src/components/HistoryView.tsx")

    def test_file_exists(self):
        self.assertTrue(os.path.exists(self.view_path), "HistoryView.tsx must exist in src/components/")

    def test_component_exports_and_props(self):
        with open(self.view_path, "r", encoding="utf-8") as f:
            content = f.read()

        self.assertIn("export function HistoryView", content)
        self.assertIn("onSelectSession", content)
        self.assertIn("onNewSession", content)
        self.assertIn("history", content)

    def test_search_and_filters_present(self):
        with open(self.view_path, "r", encoding="utf-8") as f:
            content = f.read()

        self.assertIn("searchQuery", content, "Must implement search input")
        self.assertIn("pinnedOnly", content, "Must implement pinned filter")
        self.assertIn("activeBucket", content, "Must implement time bucket filter")
        self.assertIn("Conversation History", content, "Must display header title")
        self.assertIn("font-frozen", content, "Must use Frozen font for headers")

    def test_session_card_actions(self):
        with open(self.view_path, "r", encoding="utf-8") as f:
            content = f.read()

        self.assertIn("handleTogglePin", content, "Must support pin/unpin action")
        self.assertIn("handleStartRename", content, "Must support rename action")
        self.assertIn("handleDelete", content, "Must support delete action")

if __name__ == "__main__":
    unittest.main()
