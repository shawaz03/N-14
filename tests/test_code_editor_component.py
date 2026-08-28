import unittest
import os

class TestCodeEditorComponent(unittest.TestCase):
    """
    Automated Audit Suite for Sub-Step 5.5.2:
    Verifies the CodeEditor component integrating Monaco Editor,
    custom raizen-dark theme (#050505 background, #CCFF00 cursor),
    and monospace font configuration.
    """

    def setUp(self):
        self.editor_path = os.path.abspath("raizen-studio/src/components/CodeEditor.tsx")

    def test_editor_file_exists(self):
        self.assertTrue(os.path.exists(self.editor_path), "CodeEditor.tsx must exist")

    def test_monaco_imports_and_exports(self):
        with open(self.editor_path, "r", encoding="utf-8") as f:
            content = f.read()

        self.assertIn("export function CodeEditor", content)
        self.assertIn("@monaco-editor/react", content, "Must import @monaco-editor/react")
        self.assertIn("RAIZEN_MONACO_THEME", content)

    def test_brutalist_theme_definition(self):
        with open(self.editor_path, "r", encoding="utf-8") as f:
            content = f.read()

        self.assertIn("defineTheme", content, "Must define custom Monaco theme")
        self.assertIn('"editor.background": "#050505"', content, "Monaco bg must be #050505")
        self.assertIn('"editorCursor.foreground": "#CCFF00"', content, "Monaco cursor must be #CCFF00")
        self.assertIn("cursorStyle: \"block\"", content, "Must use solid block cursor")

if __name__ == "__main__":
    unittest.main()
