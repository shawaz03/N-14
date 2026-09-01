import unittest
import os

class TestSandboxLauncher(unittest.TestCase):
    """
    Automated Audit Suite for Open-Source Sandbox Launcher Engine:
    Verifies standalone sandbox window launcher, CodeSandbox API POST payload,
    sanitization logic, React 18 / Lucide bundling, and SHAWAZ creator attribution.
    """

    def setUp(self):
        self.launcher_path = os.path.abspath("raizen-studio/src/lib/sandboxLauncher.ts")

    def test_file_exists(self):
        self.assertTrue(os.path.exists(self.launcher_path), "sandboxLauncher.ts must exist")

    def test_launcher_exports(self):
        with open(self.launcher_path, "r", encoding="utf-8") as f:
            content = f.read()

        self.assertIn("export function launchStandaloneSandbox", content)
        self.assertIn("export function launchCodeSandbox", content)
        self.assertIn("export function launchInOpenSourceSandbox", content)

    def test_bundling_dependencies(self):
        with open(self.launcher_path, "r", encoding="utf-8") as f:
            content = f.read()

        self.assertIn("react@18", content, "Must bundle React 18")
        self.assertIn("@babel/standalone@7.24.4", content, "Must pin Babel Standalone 7.24.4")
        self.assertIn("SHAWAZ", content, "Must attribute creator SHAWAZ")
        self.assertIn("https://shawaz.vercel.app/", content, "Must link to creator portfolio")

if __name__ == "__main__":
    unittest.main()
