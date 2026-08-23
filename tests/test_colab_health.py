# -*- coding: utf-8 -*-
"""
RAIZEN Phase 4.5.1: Health Endpoint & Diagnostic Contract Audit
Validates the AST and structure of /health and / endpoints in notebooks/RAIZEN_Colab_Engine.ipynb
to ensure 100% compliance with Next.js frontend requirements.
"""

import os
import sys
import json
import ast
import unittest

ROOT_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
NOTEBOOK_PATH = os.path.join(ROOT_DIR, "notebooks", "RAIZEN_Colab_Engine.ipynb")


class TestNotebookHealthContract(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        with open(NOTEBOOK_PATH, "r", encoding="utf-8") as f:
            cls.nb = json.load(f)
        
        # Combine all code cells
        code_cells = [
            "".join(c["source"])
            for c in cls.nb.get("cells", [])
            if c.get("cell_type") == "code"
        ]
        cls.full_code = "\n\n".join(code_cells)
        # Filter out IPython magics (!pip, !wget, etc.) for Python AST parsing
        clean_lines = [
            line for line in cls.full_code.splitlines()
            if not line.strip().startswith("!") and not line.strip().startswith("%")
        ]
        cls.clean_code = "\n".join(clean_lines)
        cls.tree = ast.parse(cls.clean_code)

    def test_health_routes_defined(self):
        """Verify @app.get('/') and @app.get('/health') decorators exist."""
        decorators = []
        for node in ast.walk(self.tree):
            if isinstance(node, ast.AsyncFunctionDef) or isinstance(node, ast.FunctionDef):
                for dec in node.decorator_list:
                    if isinstance(dec, ast.Call) and isinstance(dec.func, ast.Attribute):
                        if dec.func.attr == "get" and dec.args:
                            if isinstance(dec.args[0], ast.Constant):
                                decorators.append(dec.args[0].value)
        
        self.assertIn("/", decorators, "Missing root '/' route")
        self.assertIn("/health", decorators, "Missing '/health' route")

    def test_health_response_keys(self):
        """Verify the health response dictionary contains all required fields."""
        required_keys = {
            "status", "model", "version", "creator", 
            "portfolio", "huggingface", "gpu", 
            "vram_allocated_gb", "precision", "timestamp"
        }
        
        found_keys = set()
        for node in ast.walk(self.tree):
            if isinstance(node, ast.Dict):
                for k in node.keys:
                    if isinstance(k, ast.Constant) and isinstance(k.value, str):
                        found_keys.add(k.value)
        
        missing = required_keys - found_keys
        self.assertEqual(missing, set(), f"Missing required health response keys: {missing}")

    def test_creator_identity_in_code(self):
        """Verify creator SHAWAZ and portfolio link are embedded in Python code."""
        self.assertIn("SHAWAZ", self.clean_code)
        self.assertIn("https://shawaz.vercel.app/", self.clean_code)
        self.assertIn("https://huggingface.co/shawaz03/RAIZEN", self.clean_code)

    def test_cors_middleware_configured(self):
        """Verify open CORS middleware is attached to FastAPI."""
        self.assertIn("CORSMiddleware", self.clean_code)
        self.assertIn("allow_origins", self.clean_code)
        self.assertIn("allow_methods", self.clean_code)
        self.assertIn("allow_headers", self.clean_code)


if __name__ == "__main__":
    unittest.main()
