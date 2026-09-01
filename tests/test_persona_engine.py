import unittest
import os

class TestPersonaEngine(unittest.TestCase):
    """
    Automated Audit Suite for Sub-Step 3.1.1:
    Verifies ModelSpecification and RaizenPersona in src/types/model.ts
    and built-in specialist personas in src/lib/personaManager.ts.
    """

    def setUp(self):
        self.model_types_path = os.path.abspath("raizen-studio/src/types/model.ts")
        self.persona_mgr_path = os.path.abspath("raizen-studio/src/lib/personaManager.ts")

    def test_files_exist(self):
        self.assertTrue(os.path.exists(self.model_types_path), "model.ts must exist")
        self.assertTrue(os.path.exists(self.persona_mgr_path), "personaManager.ts must exist")

    def test_model_specs_and_personas_exported(self):
        with open(self.persona_mgr_path, "r", encoding="utf-8") as f:
            content = f.read()

        self.assertIn("RAIZEN_MODEL_SPEC", content, "Must export RAIZEN_MODEL_SPEC")
        self.assertIn("RAIZEN_PERSONAS", content, "Must export RAIZEN_PERSONAS")
        self.assertIn("getActivePersona", content, "Must export getActivePersona helper")
        self.assertIn("7.61 Billion", content, "Must specify 7.61B parameters")
        self.assertIn("shawaz03/RAIZEN", content, "Must link to Hugging Face repo")
        self.assertIn("React & UI Architect", content, "Must include UI Architect persona")
        self.assertIn("Fullstack Next.js Specialist", content, "Must include Fullstack persona")
        self.assertIn("SHAWAZ", content)

if __name__ == "__main__":
    unittest.main()
