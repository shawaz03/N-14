import unittest
import os
import json

class TestNextjsInitialization(unittest.TestCase):
    """
    Automated Audit Suite for Sub-Step 5.1.1:
    Verifies Next.js 14 App Router project initialization, directory structure,
    dependencies, TypeScript config, and fonts availability.
    """

    def setUp(self):
        self.base_dir = os.path.abspath("raizen-studio")
        self.fonts_dir = os.path.abspath("fonts")

    def test_package_json_structure_and_dependencies(self):
        pkg_path = os.path.join(self.base_dir, "package.json")
        self.assertTrue(os.path.exists(pkg_path), "package.json must exist in raizen-studio")
        
        with open(pkg_path, "r", encoding="utf-8") as f:
            pkg = json.load(f)
            
        self.assertEqual(pkg.get("name"), "raizen-studio", "Project name must be raizen-studio")
        deps = pkg.get("dependencies", {})
        dev_deps = pkg.get("devDependencies", {})
        
        self.assertIn("next", deps, "next must be in dependencies")
        self.assertIn("react", deps, "react must be in dependencies")
        self.assertIn("react-dom", deps, "react-dom must be in dependencies")
        self.assertIn("typescript", dev_deps, "typescript must be in devDependencies")
        self.assertIn("tailwindcss", dev_deps, "tailwindcss must be in devDependencies")

    def test_tsconfig_and_aliases(self):
        tsconfig_path = os.path.join(self.base_dir, "tsconfig.json")
        self.assertTrue(os.path.exists(tsconfig_path), "tsconfig.json must exist")
        
        with open(tsconfig_path, "r", encoding="utf-8") as f:
            tsconfig = json.load(f)
            
        paths = tsconfig.get("compilerOptions", {}).get("paths", {})
        self.assertIn("@/*", paths, "tsconfig must configure @/* import alias")

    def test_src_directory_structure(self):
        expected_dirs = [
            os.path.join(self.base_dir, "src", "app"),
            os.path.join(self.base_dir, "src", "components"),
            os.path.join(self.base_dir, "src", "lib"),
            os.path.join(self.base_dir, "src", "hooks"),
            os.path.join(self.base_dir, "src", "types"),
        ]
        for d in expected_dirs:
            self.assertTrue(os.path.isdir(d), f"Directory {d} must exist")

    def test_app_router_files(self):
        layout_path = os.path.join(self.base_dir, "src", "app", "layout.tsx")
        page_path = os.path.join(self.base_dir, "src", "app", "page.tsx")
        globals_css = os.path.join(self.base_dir, "src", "app", "globals.css")
        
        self.assertTrue(os.path.exists(layout_path), "layout.tsx must exist in src/app")
        self.assertTrue(os.path.exists(page_path), "page.tsx must exist in src/app")
        self.assertTrue(os.path.exists(globals_css), "globals.css must exist in src/app")

    def test_fonts_folder_presence(self):
        self.assertTrue(os.path.isdir(self.fonts_dir), "fonts directory must exist in project root")
        files = os.listdir(self.fonts_dir)
        fodax = any("GC-Fodax" in f for f in files)
        peachtea = any("Peachtea" in f for f in files)
        self.assertTrue(fodax, "GC-Fodax font file must be present in fonts/")
        self.assertTrue(peachtea, "Peachtea font file must be present in fonts/")

if __name__ == "__main__":
    unittest.main()
