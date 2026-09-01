import unittest
import os

class TestCodeEditorComponent(unittest.TestCase):
    """
    Automated Audit Suite for CodeEditor Component:
    Verifies the CodeEditor component integrating Monaco Editor,
    custom raizen-obsidian theme (#111215 background, #EA580C cursor),
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

    def test_obsidian_theme_definition(self):
        with open(self.editor_path, "r", encoding="utf-8") as f:
            content = f.read()

        self.assertIn("defineTheme", content, "Must define custom Monaco theme")
        self.assertIn('"editor.background": "#111215"', content, "Monaco bg must be #111215")
        self.assertIn('"editorCursor.foreground": "#EA580C"', content, "Monaco cursor must be #EA580C")

if __name__ == "__main__":
    unittest.main()
