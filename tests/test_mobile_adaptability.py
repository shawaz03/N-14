import unittest
import os

class TestMobileAdaptability(unittest.TestCase):
    """
    Automated Audit Suite for Sub-Step 5.6.1:
    Verifies mobile responsive adaptability in SandboxContainer,
    100dvh dynamic mobile height, and mobile floating quick-action pill.
    """

    def setUp(self):
        self.container_path = os.path.abspath("raizen-studio/src/components/SandboxContainer.tsx")

    def test_container_file_exists(self):
        self.assertTrue(os.path.exists(self.container_path), "SandboxContainer.tsx must exist")

    def test_mobile_dvh_and_responsive_rules(self):
        with open(self.container_path, "r", encoding="utf-8") as f:
            content = f.read()

        self.assertIn("100dvh", content, "Must use 100dvh for mobile viewport height")
        self.assertIn("lg:hidden", content, "Must configure mobile-specific layout rules")
        self.assertIn("VIEW SANDBOX", content, "Must provide mobile quick-switch floating pill")

if __name__ == "__main__":
    unittest.main()
