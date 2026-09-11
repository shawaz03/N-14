import unittest
import os

class TestGlassButtons(unittest.TestCase):
    """
    Automated Audit Suite for Glass Button Engine:
    Verifies frosted backdrop blur, specular refraction highlights,
    glass shine reflection sweep, and absence of diffuse colored hover glow.
    """

    def setUp(self):
        self.css_path = os.path.abspath('raizen-studio/src/app/globals.css')
        self.query_exists = os.path.exists(self.css_path)
        with open(self.css_path, 'r', encoding='utf-8') as f:
            self.css_content = f.read()

    def test_glass_button_classes_defined(self):
        self.assertIn('.btn-glass-base', self.css_content)
        self.assertIn('.btn-glass-dark', self.css_content)
        self.assertIn('.btn-glass-light', self.css_content)
        self.assertIn('.btn-glass-shine', self.css_content)

    def test_frosted_backdrop_blur(self):
        self.assertIn('backdrop-filter: blur(12px)', self.css_content)
        self.assertIn('backdrop-filter: blur(10px)', self.css_content)

    def test_specular_refraction_highlights(self):
        self.assertIn('inset 0 1px 0 rgba(255, 255, 255, 0.22)', self.css_content)
        self.assertIn('inset 0 1px 0 rgba(255, 255, 255, 0.95)', self.css_content)

    def test_glass_shine_reflection_sweep(self):
        self.assertIn('.btn-glass-shine::after', self.css_content)
        self.assertIn('.btn-glass-shine:hover::after', self.css_content)
        self.assertIn('skewX(-24deg)', self.css_content)
        self.assertIn('translateX(380%)', self.css_content)

    def test_zero_hover_glow_on_buttons(self):
        dark_hover_start = self.css_content.find('.btn-glass-dark:hover {')
        self.assertNotEqual(dark_hover_start, -1)
        dark_hover_block = self.css_content[dark_hover_start:dark_hover_start + 400]
        self.assertNotIn('rgba(234, 88, 12', dark_hover_block)
        self.assertNotIn('rgba(204, 255, 0', dark_hover_block)

if __name__ == '__main__':
    unittest.main()
