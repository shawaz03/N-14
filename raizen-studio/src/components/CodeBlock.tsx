"use client";

import React, { useState } from "react";
import { Copy, Check, Play, FileCode } from "lucide-react";
import { cn } from "../lib/utils";

interface CodeBlockProps {
  code: string;
  language?: string;
  filename?: string;
  onRunInSandbox?: (code: string, language: string) => void;
  className?: string;
}

export function CodeBlock({
  code,
  language = "typescript",
  filename,
  onRunInSandbox,
  className,
}: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  const cleanCode = code.trim();
  const displayLang = (language || "code").toLowerCase();
  const displayFilename =
    filename ||
    (displayLang === "react" || displayLang === "tsx" || displayLang === "jsx"
      ? "Component.tsx"
      : displayLang === "html"
      ? "index.html"
      : displayLang === "python" || displayLang === "py"
      ? "main.py"
      : displayLang === "typescript" || displayLang === "ts"
      ? "index.ts"
      : displayLang === "javascript" || displayLang === "js"
      ? "script.js"
      : displayLang === "css"
      ? "styles.css"
      : `snippet.${displayLang}`);

  const isRunnable =
    [
      "react",
      "tsx",
      "jsx",
      "html",
      "javascript",
      "js",
      "css",
      "typescript",
      "ts",
    ].includes(displayLang) ||
    cleanCode.includes("import React") ||
    cleanCode.includes("<") ||
    cleanCode.includes("export default function");

  const handleCopy = () => {
    navigator.clipboard.writeText(cleanCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleRun = () => {
    if (onRunInSandbox) {
      onRunInSandbox(cleanCode, displayLang);
    }
  };

  const lines = cleanCode.split("\n");

  return (
    <div
      className={cn(
        "my-3 w-full bg-black border border-edge-light border-l-2 border-l-signal text-text-primary font-mono text-xs shadow-hard-dark select-text",
        className
      )}
    >
      {/* Code Block Header */}
      <div className="flex items-center justify-between px-3 py-1.5 bg-[#080808] border-b border-edge-light select-none">
        {/* Left: Language & Filename */}
        <div className="flex items-center gap-2">
          <FileCode className="w-3.5 h-3.5 text-signal" />
          <span className="text-text-primary text-[11px] font-bold">
            {displayFilename}
          </span>
          <span className="text-[10px] uppercase font-mono px-1.5 py-0.2 bg-void border border-edge text-text-muted">
            {displayLang}
          </span>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-1.5">
          {/* Run in Sandbox Button */}
          {isRunnable && onRunInSandbox && (
            <button
              type="button"
              onClick={handleRun}
              className="flex items-center gap-1 px-2 py-0.5 bg-signal hover:bg-signal-hover text-void text-[10px] font-bold uppercase transition-transform active:translate-y-0.5 shadow-hard-sm"
              title="Run and preview live in sandbox"
            >
              <Play className="w-2.5 h-2.5 fill-current" />
              <span>RUN IN SANDBOX</span>
            </button>
          )}

          {/* Copy Button */}
          <button
            type="button"
            onClick={handleCopy}
            className="flex items-center gap-1 px-2 py-0.5 bg-surface-elevated hover:bg-surface-active border border-edge hover:border-edge-light text-text-muted hover:text-text-primary text-[10px] uppercase transition-colors"
            title={copied ? "Copied!" : "Copy Code"}
          >
            {copied ? (
              <>
                <Check className="w-3 h-3 text-terminal-success" />
                <span className="text-terminal-success">COPIED</span>
              </>
            ) : (
              <>
                <Copy className="w-3 h-3" />
                <span>COPY</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Code Content with Line Numbers */}
      <div className="p-3 overflow-x-auto no-scrollbar font-mono text-xs leading-relaxed">
        <table className="w-full border-collapse">
          <tbody>
            {lines.map((line, idx) => (
              <tr key={idx} className="hover:bg-white/[0.02]">
                <td className="w-8 pr-4 text-right text-[11px] text-[#444444] select-none font-mono align-top">
                  {idx + 1}
                </td>
                <td className="whitespace-pre font-mono text-[#E5E5E5] break-normal">
                  {line || " "}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
