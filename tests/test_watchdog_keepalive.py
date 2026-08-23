# -*- coding: utf-8 -*-
"""
RAIZEN Phase 4.5.4: Idle Keep-Alive & Watchdog Behavior Audit
Validates that the automated keep-alive watchdog thread in notebooks/RAIZEN_Colab_Engine.ipynb
is properly constructed with daemon execution, target endpoint binding, and exception resilience.
"""

import os
import sys
import json
import ast
import unittest

ROOT_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
NOTEBOOK_PATH = os.path.join(ROOT_DIR, "notebooks", "RAIZEN_Colab_Engine.ipynb")


class TestWatchdogKeepAlive(unittest.TestCase):
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

    def test_watchdog_target_url(self):
        """Verify watchdog targets the internal health check endpoint."""
        self.assertIn("http://localhost:8000/health", self.full_code)

    def test_watchdog_interval(self):
        """Verify watchdog sleeps for 180 seconds (3 minutes)."""
        self.assertIn("time.sleep(180)", self.full_code)

    def test_watchdog_daemon_thread(self):
        """Verify watchdog is spawned as a daemon background thread."""
        self.assertIn("threading.Thread(target=keep_alive_watchdog, daemon=True)", self.full_code)
        self.assertIn("watchdog_thread.start()", self.full_code)

    def test_watchdog_exception_handling(self):
        """Verify watchdog wraps network requests in try-except block to prevent crash."""
        self.assertIn("except Exception:", self.full_code)


if __name__ == "__main__":
    unittest.main()
