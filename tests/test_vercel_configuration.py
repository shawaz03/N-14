import unittest
import os
import json

class TestVercelConfiguration(unittest.TestCase):
    """
    Automated Audit Suite for Sub-Step 6.2:
    Verifies Vercel deployment manifests, build scripts, security headers,
    and root workspace orchestration.
    """

    def setUp(self):
        self.studio_vercel = os.path.abspath("raizen-studio/vercel.json")
        self.root_vercel = os.path.abspath("vercel.json")
        self.root_package = os.path.abspath("package.json")
        self.studio_package = os.path.abspath("raizen-studio/package.json")

    def test_vercel_manifests_exist(self):
        self.assertTrue(os.path.exists(self.studio_vercel), "raizen-studio/vercel.json must exist")
        self.assertTrue(os.path.exists(self.root_vercel), "root vercel.json must exist")
        self.assertTrue(os.path.exists(self.root_package), "root package.json must exist")

    def test_studio_vercel_headers_and_framework(self):
        with open(self.studio_vercel, "r", encoding="utf-8") as f:
            data = json.load(f)

        self.assertEqual(data.get("framework"), "nextjs")
        headers = data.get("headers", [])
        self.assertTrue(len(headers) > 0, "Must configure security headers")

    def test_root_package_attribution_and_scripts(self):
        with open(self.root_package, "r", encoding="utf-8") as f:
            data = json.load(f)

        self.assertIn("SHAWAZ", data.get("author", ""))
        self.assertIn("https://shawaz.vercel.app/", data.get("author", ""))
        self.assertIn("build", data.get("scripts", {}))

if __name__ == "__main__":
    unittest.main()
