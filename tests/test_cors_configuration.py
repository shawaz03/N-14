# -*- coding: utf-8 -*-
"""
RAIZEN Phase 4.5.3: Universal CORS Configuration & Security Audit
Validates that the FastAPI application in notebooks/RAIZEN_Colab_Engine.ipynb has configured
unrestricted CORS headers for cross-origin browser fetch calls from any frontend deployment domain.
"""

import os
import sys
import json
import ast
import unittest

ROOT_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
NOTEBOOK_PATH = os.path.join(ROOT_DIR, "notebooks", "RAIZEN_Colab_Engine.ipynb")


class TestCorsConfiguration(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        with open(NOTEBOOK_PATH, "r", encoding="utf-8") as f:
            cls.nb = json.load(f)
        
        code_cells = [
            "".join(c["source"])
            for c in cls.nb.get("cells", [])
            if c.get("cell_type") == "code"
        ]
        cls.full_code = "\n\n".join(code_cells)

    def test_cors_middleware_imported(self):
        """Verify CORSMiddleware is imported from fastapi.middleware.cors."""
        self.assertIn("from fastapi.middleware.cors import CORSMiddleware", self.full_code)

    def test_allow_origins_wildcard(self):
        """Verify allow_origins contains wildcard '*'."""
        self.assertTrue(
            'allow_origins=["*"]' in self.full_code or "allow_origins=['*']" in self.full_code,
            "allow_origins must be set to ['*']"
        )

    def test_allow_methods_wildcard(self):
        """Verify allow_methods contains wildcard '*'."""
        self.assertTrue(
            'allow_methods=["*"]' in self.full_code or "allow_methods=['*']" in self.full_code,
            "allow_methods must be set to ['*']"
        )

    def test_allow_headers_wildcard(self):
        """Verify allow_headers contains wildcard '*'."""
        self.assertTrue(
            'allow_headers=["*"]' in self.full_code or "allow_headers=['*']" in self.full_code,
            "allow_headers must be set to ['*']"
        )

    def test_allow_credentials_enabled(self):
        """Verify allow_credentials=True is enabled."""
        self.assertIn("allow_credentials=True", self.full_code)


if __name__ == "__main__":
    unittest.main()
