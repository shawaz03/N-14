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

    def test_specialist_badge_component(self):
        badge_path = os.path.abspath('raizen-studio/src/components/ui/SpecialistBadge.tsx')
        self.assertTrue(os.path.exists(badge_path), "SpecialistBadge.tsx must exist")
        with open(badge_path, 'r', encoding='utf-8') as f:
            content = f.read()

        self.assertIn("export function SpecialistBadge", content)
        self.assertIn("frontend-architect", content, "Must support React Architect orbital rings")
        self.assertIn("fullstack-nextjs", content, "Must support Next.js tiered layers")
        self.assertIn("python-ai-systems", content, "Must support Python/AI neural core")
        self.assertIn("algorithm-optimizer", content, "Must support Algorithm logic graph")
        self.assertIn("whileHover", content, "Must feature spring hover feedback")

    def test_model_explorer_icons_and_badges(self):
        explorer_path = os.path.abspath('raizen-studio/src/components/ModelExplorerView.tsx')
        self.assertTrue(os.path.exists(explorer_path), "ModelExplorerView.tsx must exist")
        with open(explorer_path, 'r', encoding='utf-8') as f:
            content = f.read()

        self.assertIn('@phosphor-icons/react', content, "Must import duotone icons from Phosphor")
        self.assertIn('SpecialistBadge', content, "Must use SpecialistBadge for persona cards")
        self.assertIn('MotionIcon', content, "Must wrap interactive icons with MotionIcon")
        self.assertIn('personaId={persona.id}', content, "Must pass personaId to SpecialistBadge")
        self.assertNotIn('from "lucide-react"', content, "Must no longer use lucide-react in ModelExplorerView")

    def test_chat_message_item_motion_icons(self):
        msg_item_path = os.path.abspath('raizen-studio/src/components/ChatMessageItem.tsx')
        self.assertTrue(os.path.exists(msg_item_path), "ChatMessageItem.tsx must exist")
        with open(msg_item_path, 'r', encoding='utf-8') as f:
            content = f.read()

        self.assertIn('@phosphor-icons/react', content, "Must import from Phosphor icons")
        self.assertIn('MotionIcon', content, "Must wrap icons in MotionIcon")
        self.assertNotIn('from "lucide-react"', content, "Must no longer use lucide-react in ChatMessageItem")

    def test_sidebar_motion_icons(self):
        sidebar_path = os.path.abspath('raizen-studio/src/components/Sidebar.tsx')
        self.assertTrue(os.path.exists(sidebar_path), "Sidebar.tsx must exist")
        with open(sidebar_path, 'r', encoding='utf-8') as f:
            content = f.read()

        self.assertIn('@phosphor-icons/react', content, "Must import from Phosphor icons")
        self.assertIn('MotionIcon', content, "Must wrap icons in MotionIcon")
        self.assertIn('ChatCircleDots', content, "Must use ChatCircleDots for Chat Studio")
        self.assertIn('ClockCounterClockwise', content, "Must use ClockCounterClockwise for History")
        self.assertIn('BookmarkSimple', content, "Must use BookmarkSimple for Saved Snippets")
        self.assertNotIn('from "lucide-react"', content, "Must no longer use lucide-react in Sidebar")

    def test_chat_input_motion_icons(self):
        input_path = os.path.abspath('raizen-studio/src/components/ChatInput.tsx')
        self.assertTrue(os.path.exists(input_path), "ChatInput.tsx must exist")
        with open(input_path, 'r', encoding='utf-8') as f:
            content = f.read()

        self.assertIn('@phosphor-icons/react', content, "Must import from Phosphor icons")
        self.assertIn('MotionIcon', content, "Must wrap icons in MotionIcon")
        self.assertIn('PaperPlaneRight', content, "Must use PaperPlaneRight for Send")
        self.assertIn('Stop', content, "Must use Stop for streaming abort")
        self.assertIn('Trash', content, "Must use Trash for clear chat")
        self.assertIn('SlidersHorizontal', content, "Must use SlidersHorizontal for sampling temp")
        self.assertNotIn('from "lucide-react"', content, "Must no longer use lucide-react in ChatInput")

    def test_header_and_colab_modal_motion_icons(self):
        header_path = os.path.abspath('raizen-studio/src/components/Header.tsx')
        self.assertTrue(os.path.exists(header_path), "Header.tsx must exist")
        with open(header_path, 'r', encoding='utf-8') as f:
            header_content = f.read()

        self.assertIn('@phosphor-icons/react', header_content, "Must import from Phosphor icons in Header")
        self.assertIn('MotionIcon', header_content, "Must use MotionIcon in Header")
        self.assertNotIn('from "lucide-react"', header_content, "Must no longer use lucide-react in Header")

        colab_path = os.path.abspath('raizen-studio/src/components/ColabModal.tsx')
        self.assertTrue(os.path.exists(colab_path), "ColabModal.tsx must exist")
        with open(colab_path, 'r', encoding='utf-8') as f:
            colab_content = f.read()

        self.assertIn('@phosphor-icons/react', colab_content, "Must import from Phosphor icons in ColabModal")
        self.assertIn('MotionIcon', colab_content, "Must use MotionIcon in ColabModal")
        self.assertNotIn('from "lucide-react"', colab_content, "Must no longer use lucide-react in ColabModal")

    def test_codeblock_motion_icons(self):
        codeblock_path = os.path.abspath('raizen-studio/src/components/CodeBlock.tsx')
        self.assertTrue(os.path.exists(codeblock_path), "CodeBlock.tsx must exist")
        with open(codeblock_path, 'r', encoding='utf-8') as f:
            content = f.read()

        self.assertIn('@phosphor-icons/react', content, "Must import from Phosphor icons")
        self.assertIn('MotionIcon', content, "Must wrap icons in MotionIcon")
        self.assertIn('FileCode', content, "Must use FileCode for code block header")
        self.assertIn('BookmarkSimple', content, "Must use BookmarkSimple for Save")
        self.assertNotIn('from "lucide-react"', content, "Must no longer use lucide-react in CodeBlock")

    def test_thought_accordion_and_loading_effects(self):
        accordion_path = os.path.abspath('raizen-studio/src/components/ThoughtAccordion.tsx')
        claude_path = os.path.abspath('raizen-studio/src/components/ClaudeLoadingEffect.tsx')
        streaming_path = os.path.abspath('raizen-studio/src/components/StreamingIndicator.tsx')

        self.assertTrue(os.path.exists(accordion_path), "ThoughtAccordion.tsx must exist")
        self.assertTrue(os.path.exists(claude_path), "ClaudeLoadingEffect.tsx must exist")
        self.assertTrue(os.path.exists(streaming_path), "StreamingIndicator.tsx must exist")

        with open(accordion_path, 'r', encoding='utf-8') as f:
            acc_content = f.read()
        with open(claude_path, 'r', encoding='utf-8') as f:
            claude_content = f.read()
        with open(streaming_path, 'r', encoding='utf-8') as f:
            stream_content = f.read()

        # ThoughtAccordion checks
        self.assertIn('@phosphor-icons/react', acc_content)
        self.assertIn('MotionIcon', acc_content)
        self.assertIn('Brain', acc_content)
        self.assertNotIn('from "lucide-react"', acc_content)

        # ClaudeLoadingEffect checks
        self.assertIn('@phosphor-icons/react', claude_content)
        self.assertIn('MotionIcon', claude_content)
        self.assertIn('MagnifyingGlass', claude_content)
        self.assertNotIn('from "lucide-react"', claude_content)

        # StreamingIndicator checks
        self.assertIn('@phosphor-icons/react', stream_content)
        self.assertIn('MotionIcon', stream_content)
        self.assertIn('Cpu', stream_content)
        self.assertIn('Lightning', stream_content)
        self.assertNotIn('from "lucide-react"', stream_content)

    def test_toast_quick_actions_history_and_snippets(self):
        toast_path = os.path.abspath('raizen-studio/src/components/Toast.tsx')
        quick_path = os.path.abspath('raizen-studio/src/components/QuickActions.tsx')
        snippets_path = os.path.abspath('raizen-studio/src/components/SavedSnippetsView.tsx')
        history_path = os.path.abspath('raizen-studio/src/components/HistoryView.tsx')
        page_path = os.path.abspath('raizen-studio/src/app/page.tsx')

        for p in [toast_path, quick_path, snippets_path, history_path, page_path]:
            self.assertTrue(os.path.exists(p), f"{p} must exist")
            with open(p, 'r', encoding='utf-8') as f:
                content = f.read()
            self.assertIn('@phosphor-icons/react', content, f"{p} must use @phosphor-icons/react")
            self.assertIn('MotionIcon', content, f"{p} must use MotionIcon")
            self.assertNotIn('from "lucide-react"', content, f"{p} must NOT use lucide-react")

    def test_complete_zero_lucide_in_src(self):
        src_dir = os.path.abspath('raizen-studio/src')
        violations = []
        for root, _, files in os.walk(src_dir):
            for file in files:
                if file.endswith(('.tsx', '.ts')):
                    filepath = os.path.join(root, file)
                    with open(filepath, 'r', encoding='utf-8') as f:
                        text = f.read()
                    if 'from "lucide-react"' in text or "from 'lucide-react'" in text:
                        violations.append(filepath)
        self.assertEqual(violations, [], f"Found lingering lucide-react imports: {violations}")

    def test_neural_conduit_beam_component(self):
        beam_path = os.path.abspath('raizen-studio/src/components/ui/NeuralConduitBeam.tsx')
        header_path = os.path.abspath('raizen-studio/src/components/Header.tsx')

        self.assertTrue(os.path.exists(beam_path), "NeuralConduitBeam.tsx must exist")
        with open(beam_path, 'r', encoding='utf-8') as f:
            beam_content = f.read()

        self.assertIn('NeuralConduitBeam', beam_content)
        self.assertIn('TUNNEL LOCKED', beam_content)
        self.assertIn('TESLA T4 GPU', beam_content)
        self.assertIn('framer-motion', beam_content)

        with open(header_path, 'r', encoding='utf-8') as f:
            header_content = f.read()

        self.assertIn('NeuralConduitBeam', header_content, "Header must integrate NeuralConduitBeam")
        self.assertIn('animate-ping', header_content, "Header must render radar ping beacon")

    def test_colab_modal_connection_beacon(self):
        modal_path = os.path.abspath('raizen-studio/src/components/ColabModal.tsx')
        self.assertTrue(os.path.exists(modal_path), "ColabModal.tsx must exist")
        with open(modal_path, 'r', encoding='utf-8') as f:
            modal_content = f.read()

        self.assertIn('animate-ping', modal_content, "ColabModal must feature radar ping beacon")
        self.assertIn('justConnected', modal_content, "ColabModal must react to justConnected state")
        self.assertIn('cn(', modal_content, "ColabModal must use cn utility for conditional ring/glow")

if __name__ == '__main__':
    unittest.main()



