import unittest
import os
import json

class TestIconEngine(unittest.TestCase):
    """
    Automated Audit Suite for Phosphor Duotone & Motion Icon Engine:
    Verifies @phosphor-icons/react installation, package configuration,
    and compatibility with Next.js and Framer Motion.
    """

    def setUp(self):
        self.pkg_path = os.path.abspath('raizen-studio/package.json')
        self.assertTrue(os.path.exists(self.pkg_path), "package.json must exist")
        with open(self.pkg_path, 'r', encoding='utf-8') as f:
            self.pkg_data = json.load(f)

    def test_phosphor_icons_installed(self):
        deps = self.pkg_data.get('dependencies', {})
        self.assertIn('@phosphor-icons/react', deps, "@phosphor-icons/react must be listed in dependencies")

    def test_framer_motion_installed(self):
        deps = self.pkg_data.get('dependencies', {})
        self.assertIn('framer-motion', deps, "framer-motion must be present for icon micro-interactions")

    def test_motion_icon_component(self):
        motion_icon_path = os.path.abspath('raizen-studio/src/components/ui/MotionIcon.tsx')
        self.assertTrue(os.path.exists(motion_icon_path), "MotionIcon.tsx must exist")
        with open(motion_icon_path, 'r', encoding='utf-8') as f:
            content = f.read()

        self.assertIn("export function MotionIcon", content)
        self.assertIn('weight = "duotone"', content, "Must default to duotone weight for visual depth")
        self.assertIn("bounce", content)
        self.assertIn("tilt", content)
        self.assertIn("spin", content)
        self.assertIn("pulse", content)
        self.assertIn("glance", content)
        self.assertIn("float", content)

if __name__ == '__main__':
    unittest.main()
