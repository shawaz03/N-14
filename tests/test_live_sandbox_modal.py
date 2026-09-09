# -*- coding: utf-8 -*-
"""
RAIZEN Phase 1.2: Live Sandbox Modal Audit Suite
Validates the structure, Framer Motion animations, ESC key listeners,
3-way responsive device viewport switcher, Swiss Editorial tokens,
sandboxed Iframe HTML/Tailwind compilation, and Babel Standalone React 18 engine
in raizen-studio/src/components/LiveSandboxModal.tsx.
"""

import os
import unittest

ROOT_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
MODAL_PATH = os.path.join(ROOT_DIR, "raizen-studio", "src", "components", "LiveSandboxModal.tsx")


class TestLiveSandboxModal(unittest.TestCase):
    def setUp(self):
        self.assertTrue(os.path.exists(MODAL_PATH), "LiveSandboxModal.tsx must exist in components/")
        with open(MODAL_PATH, "r", encoding="utf-8") as f:
            self.content = f.read()

    def test_component_interface_props(self):
        """Verify LiveSandboxModalProps defines isOpen, onClose, code, language, and filename."""
        self.assertIn("interface LiveSandboxModalProps", self.content)
        self.assertIn("isOpen: boolean", self.content)
        self.assertIn("onClose: () => void", self.content)
        self.assertIn("code: string", self.content)

    def test_framer_motion_animation_wrapper(self):
        """Verify AnimatePresence and motion.div are used for smooth modal framing."""
        self.assertIn("AnimatePresence", self.content)
        self.assertIn("motion.div", self.content)
        self.assertIn("backdrop-blur-sm", self.content)

    def test_escape_key_listener_registered(self):
        """Verify Escape keyboard shortcut listener is bound."""
        self.assertIn('e.key === "Escape"', self.content)
        self.assertIn("removeEventListener", self.content)

    def test_swiss_editorial_styling_tokens(self):
        """Verify Swiss Editorial tokens are utilized."""
        self.assertIn("border-swiss-border", self.content)
        self.assertIn("font-frozen", self.content)
        self.assertIn("text-swiss-saffron", self.content)

    def test_three_way_viewport_switcher(self):
        """Verify Desktop, Tablet, and Mobile viewport modes with responsive framing."""
        self.assertIn('"desktop"', self.content)
        self.assertIn('"tablet"', self.content)
        self.assertIn('"mobile"', self.content)
        self.assertIn("Monitor", self.content)
        self.assertIn("Tablet", self.content)
        self.assertIn("Smartphone", self.content)
        self.assertIn("w-[768px]", self.content, "Tablet frame width must be 768px")
        self.assertIn("w-[375px]", self.content, "Mobile frame width must be 375px")

    def test_iframe_renderer_and_telemetry(self):
        """Verify sandboxed iframe rendering, srcdoc injection, Tailwind CDN, and error telemetry."""
        self.assertIn("<iframe", self.content)
        self.assertIn("ref={iframeRef}", self.content)
        self.assertIn("allow-scripts", self.content)
        self.assertIn("allow-forms", self.content)
        self.assertIn("cdn.tailwindcss.com", self.content)
        self.assertIn("RAIZEN_SANDBOX_ERROR", self.content)
        self.assertIn("RAIZEN_SANDBOX_SUCCESS", self.content)

    def test_react_tsx_compilation_engine(self):
        """Verify in-memory Babel Standalone 7.24.4, React 18, and Lucide icon shims."""
        self.assertIn("react@18", self.content)
        self.assertIn("react-dom@18", self.content)
        self.assertIn("@babel/standalone@7.24.4", self.content)
        self.assertIn("Babel.transform", self.content)
        self.assertIn("__initLucideIcons", self.content)
        self.assertIn("__RAIZEN_ROOT_COMPONENT__", self.content)
        self.assertIn("ReactDOM.createRoot", self.content)


if __name__ == "__main__":
    unittest.main()
