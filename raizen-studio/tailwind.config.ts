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
        // Terminal Brutalism Palette ("Acid Lime" #CCFF00 on OLED Black #050505)
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
          DEFAULT: "#CCFF00",
          hover: "#B3E600",
          dim: "#99CC00",
          glow: "rgba(204, 255, 0, 0.15)",
        },
        terminal: {
          error: "#FF4444",
          success: "#33FF99",
          warn: "#FFAA00",
          info: "#00E5FF",
        },
        text: {
          primary: "#E5E5E5",
          secondary: "#888888",
          muted: "#666666",
        },
      },
      fontFamily: {
        mono: ["var(--font-mono)", "JetBrains Mono", "monospace"],
        display: ["var(--font-display)", "Space Grotesk", "sans-serif"],
        fodax: ["var(--font-fodax)", "sans-serif"],
        peachtea: ["var(--font-peachtea)", "cursive"],
      },
      borderRadius: {
        brutal: "0px",
        soft: "2px",
      },
      boxShadow: {
        hard: "4px 4px 0px #ffffff",
        "hard-signal": "4px 4px 0px #CCFF00",
        "hard-dark": "4px 4px 0px #333333",
        "hard-edge": "2px 2px 0px #1F1F1F",
        "hard-sm": "2px 2px 0px #ffffff",
      },
    },
  },
  plugins: [],
};

export default config;
