import unittest
import os
import json

class TestDependenciesAndUtils(unittest.TestCase):
    """
    Automated Audit Suite for Sub-Step 5.1.5:
    Verifies that all core packages (lucide-react, framer-motion, react-markdown,
    remark-gfm, @monaco-editor/react, canvas-confetti, clsx, tailwind-merge)
    are installed and that the cn() helper is available in src/lib/utils.ts.
    """

    def setUp(self):
        self.studio_dir = os.path.abspath("raizen-studio")
        self.pkg_path = os.path.join(self.studio_dir, "package.json")
        self.utils_path = os.path.join(self.studio_dir, "src", "lib", "utils.ts")

    def test_core_dependencies_present(self):
        with open(self.pkg_path, "r", encoding="utf-8") as f:
            pkg = json.load(f)

        deps = pkg.get("dependencies", {})
        dev_deps = pkg.get("devDependencies", {})

        required_deps = [
            "lucide-react",
            "framer-motion",
            "react-markdown",
            "remark-gfm",
            "@monaco-editor/react",
            "canvas-confetti",
            "clsx",
            "tailwind-merge",
        ]

        for dep in required_deps:
            self.assertIn(dep, deps, f"{dep} must be listed in package.json dependencies")

        self.assertIn("@types/canvas-confetti", dev_deps, "@types/canvas-confetti must be in devDependencies")

    def test_utils_cn_helper(self):
        self.assertTrue(os.path.exists(self.utils_path), "src/lib/utils.ts must exist")
        with open(self.utils_path, "r", encoding="utf-8") as f:
            content = f.read()

        self.assertIn("export function cn", content, "utils.ts must export cn function")
        self.assertIn("twMerge", content, "utils.ts must utilize twMerge")
        self.assertIn("clsx", content, "utils.ts must utilize clsx")

if __name__ == "__main__":
    unittest.main()
