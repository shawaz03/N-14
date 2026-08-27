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
      },
      fontFamily: {
        mono: ["var(--font-mono)", "JetBrains Mono", "monospace"],
        display: ["var(--font-display)", "Space Grotesk", "sans-serif"],
        fodax: ["var(--font-fodax)", "sans-serif"],
        peachtea: ["var(--font-peachtea)", "cursive"],
      },
    },
  },
  plugins: [],
};
export default config;
