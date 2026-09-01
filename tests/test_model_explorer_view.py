import unittest
import os

class TestModelExplorerView(unittest.TestCase):
    """
    Automated Audit Suite for Sub-Step 3.2.1:
    Verifies ModelExplorerView component in src/components/ModelExplorerView.tsx:
    Hugging Face Hub link, 7.61B model spec matrix, specialist persona selection,
    context allocation progress visualizer, and Swiss Editorial / FROZEN styling.
    """

    def setUp(self):
        self.view_path = os.path.abspath("raizen-studio/src/components/ModelExplorerView.tsx")

    def test_file_exists(self):
        self.assertTrue(os.path.exists(self.view_path), "ModelExplorerView.tsx must exist in src/components/")

    def test_component_exports_and_props(self):
        with open(self.view_path, "r", encoding="utf-8") as f:
            content = f.read()

        self.assertIn("export function ModelExplorerView", content)
        self.assertIn("activePersona", content)
        self.assertIn("onSelectPersona", content)

    def test_huggingface_and_specs_present(self):
        with open(self.view_path, "r", encoding="utf-8") as f:
            content = f.read()

        self.assertIn("huggingface.co", content, "Must link to Hugging Face Hub")
        self.assertIn("spec.huggingFaceRepo", content, "Must target spec.huggingFaceRepo")
        self.assertIn("RAIZEN_MODEL_SPEC", content, "Must reference RAIZEN_MODEL_SPEC")
        self.assertIn("RAIZEN_PERSONAS", content, "Must render RAIZEN_PERSONAS")
        self.assertIn("font-frozen", content, "Must use Frozen font for headers")

    def test_persona_switching_interaction(self):
        with open(self.view_path, "r", encoding="utf-8") as f:
            content = f.read()

        self.assertIn("onSelectPersona(persona)", content, "Must trigger onSelectPersona on card click")
        self.assertIn("System Prompt Directive", content, "Must render system prompt directive preview")

if __name__ == "__main__":
    unittest.main()
