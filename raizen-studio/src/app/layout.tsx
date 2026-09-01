import type { Metadata } from "next";
import localFont from "next/font/local";
import { JetBrains_Mono, Plus_Jakarta_Sans, Space_Grotesk } from "next/font/google";
import "./globals.css";

// Google Fonts for Base UI & Monospace Code
const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

// ❄️ Custom Disney Font: Frozen for Headings, Brand, Badges & Action Buttons
const frozen = localFont({
  src: "./fonts/Frozen.otf",
  variable: "--font-frozen",
  display: "swap",
});

export const metadata: Metadata = {
  title: "RAIZEN Studio — Timeless Architectural Coding Intelligence by SHAWAZ",
  description:
    "High-performance AI coding studio and live sandbox powered by RAIZEN 7.61B fine-tuned model. Developed by SHAWAZ (https://shawaz.vercel.app/).",
  authors: [{ name: "SHAWAZ", url: "https://shawaz.vercel.app/" }],
  creator: "SHAWAZ",
  keywords: [
    "RAIZEN",
    "SHAWAZ",
    "AI Code Assistant",
    "Swiss Editorial",
    "Disney Frozen",
    "Qwen2.5-Coder",
    "Next.js Code Studio",
  ],
  openGraph: {
    title: "RAIZEN Studio — Architectural Coding Intelligence",
    description: "Swiss Editorial AI coding studio crafted by SHAWAZ.",
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
    <html lang="en">
      <body
        className={`${frozen.variable} ${plusJakartaSans.variable} ${jetbrainsMono.variable} ${spaceGrotesk.variable} font-sans bg-[#FAF8F5] text-[#121316] antialiased selection:bg-[#FFF2EB] selection:text-[#EA580C]`}
      >
        {children}
      </body>
    </html>
  );
}
