import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",

        // 🏛️ Timeless Swiss Editorial & Architectural Palette
        swiss: {
          canvas: "#FAF8F5",       // Warm Ivory Paper
          sidebar: "#F3EFEB",      // Warm Sandstone Linen
          card: "#FFFFFF",         // Pure Matte White
          "card-subtle": "#F7F5F0",// Sandstone Tile
          saffron: {
            DEFAULT: "#121316",    // Option 1: Deep Obsidian Ink
            hover: "#27272A",      // Charcoal Slate
            tint: "#EAE6DF",       // Warm Stone Linen
            text: "#121316",       // Deep Obsidian Text
          },
          ink: "#121316",          // Swiss Charcoal Ink
          body: "#374151",         // Neutral Slate Body
          muted: "#6B7280",        // Muted Slate
          subtle: "#9CA3AF",       // Hairline Grey
          border: {
            DEFAULT: "#E6E1D8",    // 1px Hairline Border
            card: "#E5DFD5",       // Card Border
            focus: "#121316",      // Focus Border
          },
          telemetry: "#111215",    // Top Obsidian Status Bar
        },

        // Terminal Brutalism Tokens & Aliases for backwards compatibility
        void: "#050505",
        surface: {
          DEFAULT: "#0A0A0A",
          elevated: "#111111",
          active: "#161616",
        },
        edge: {
          DEFAULT: "#1F1F1F",
          light: "#333333",
          dark: "#141414",
        },
        signal: {
          DEFAULT: "#121316",
          hover: "#27272A",
          dim: "#27272A",
          glow: "rgba(18, 19, 22, 0.08)",
        },
        terminal: {
          error: "#EF4444",
          success: "#10B981",
          warn: "#F59E0B",
          info: "#3B82F6",
        },
        text: {
          primary: "#121316",
          secondary: "#374151",
          muted: "#6B7280",
        },
      },
      fontFamily: {
        frozen: ["var(--font-frozen)", "var(--font-display)", "sans-serif"],
        sans: ["var(--font-sans)", "Plus Jakarta Sans", "Inter", "system-ui", "sans-serif"],
        mono: [
          "var(--font-mono)",
          "JetBrains Mono",
          "ui-monospace",
          "SFMono-Regular",
          "Menlo",
          "Monaco",
          "Consolas",
          "'Liberation Mono'",
          "'Courier New'",
          "monospace",
        ],
        display: ["var(--font-frozen)", "var(--font-display)", "Space Grotesk", "sans-serif"],
        fodax: ["var(--font-frozen)", "sans-serif"],
      },
      borderRadius: {
        pill: "9999px",
        card: "14px",
        soft: "4px",
        brutal: "0px",
      },
      boxShadow: {
        swiss: "0 1px 3px rgba(0, 0, 0, 0.04)",
        "swiss-md": "0 6px 16px rgba(0, 0, 0, 0.04)",
        "swiss-lg": "0 12px 32px rgba(0, 0, 0, 0.06)",
        "swiss-saffron": "0 1px 3px rgba(0, 0, 0, 0.08), 0 1px 2px rgba(0, 0, 0, 0.04)",
      },
    },
  },
  plugins: [],
};

export default config;
