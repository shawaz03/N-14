import type { Metadata } from "next";
import localFont from "next/font/local";
import { JetBrains_Mono, Space_Grotesk } from "next/font/google";
import "./globals.css";

// Google Fonts for Terminal Brutalism Prose, UI & Monospace Code
const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

// Custom Local Display Fonts for Hero Branding & Unique Badges
const gcFodax = localFont({
  src: "./fonts/GC-Fodax-Demo-BF68b80f61230dc.ttf",
  variable: "--font-fodax",
  display: "swap",
  weight: "400 900",
});

const peachtea = localFont({
  src: "./fonts/Peachtea-BF68fcd726682b8.otf",
  variable: "--font-peachtea",
  display: "swap",
  weight: "400",
});

export const metadata: Metadata = {
  title: "RAIZEN Studio — Enterprise Coding Intelligence by SHAWAZ",
  description:
    "High-performance Terminal Brutalist AI coding studio and live sandbox powered by RAIZEN 7.61B fine-tuned model. Developed by SHAWAZ (https://shawaz.vercel.app/).",
  authors: [{ name: "SHAWAZ", url: "https://shawaz.vercel.app/" }],
  creator: "SHAWAZ",
  keywords: [
    "RAIZEN",
    "SHAWAZ",
    "AI Code Assistant",
    "Terminal Brutalism",
    "Qwen2.5-Coder",
    "Next.js Code Studio",
    "Live Code Sandbox",
  ],
  openGraph: {
    title: "RAIZEN Studio — Enterprise Coding Intelligence",
    description: "Mission control AI coding studio crafted by SHAWAZ.",
    url: "https://shawaz.vercel.app/",
    siteName: "RAIZEN Studio",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${jetbrainsMono.variable} ${spaceGrotesk.variable} ${gcFodax.variable} ${peachtea.variable} font-mono bg-[#050505] text-[#E5E5E5] antialiased selection:bg-[#CCFF00] selection:text-[#050505]`}
      >
        {children}
      </body>
    </html>
  );
}
