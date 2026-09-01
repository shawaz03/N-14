"use client";

import React, { useState, useRef, useCallback } from "react";
import { Copy, Check, Play, FileCode, Code2, Bookmark, BookmarkCheck } from "lucide-react";
import { cn } from "../lib/utils";
import { launchInOpenSourceSandbox } from "../lib/sandboxLauncher";

interface CodeBlockProps {
  code: string;
  language?: string;
  filename?: string;
  onRunInSandbox?: (code: string, language: string) => void;
  onSaveSnippet?: (code: string, language: string, filename?: string) => void;
  className?: string;
}

export function CodeBlock({
  code,
  language = "typescript",
  filename,
  onRunInSandbox,
  onSaveSnippet,
  className,
}: CodeBlockProps) {
  const [copied, setCopied] = useState(false);
  const [saved, setSaved] = useState(false);
  const codeAreaRef = useRef<HTMLDivElement>(null);

  // Forward vertical wheel events to the parent scroll container
  // so scrolling over the code block doesn't get trapped
  const handleCodeWheel = useCallback((e: React.WheelEvent<HTMLDivElement>) => {
    const el = codeAreaRef.current;
    if (!el) return;

    // Only intercept if there's no horizontal scroll happening
    const hasHorizontalScroll = el.scrollWidth > el.clientWidth;
    const isHorizontalScroll = Math.abs(e.deltaX) > Math.abs(e.deltaY);

    // If user is scrolling horizontally and there IS horizontal overflow, let it be
    if (isHorizontalScroll && hasHorizontalScroll) return;

    // Otherwise, find the nearest scrollable parent and scroll it
    let parent = el.parentElement;
    while (parent) {
      if (parent.scrollHeight > parent.clientHeight && 
          getComputedStyle(parent).overflowY !== 'hidden' &&
          getComputedStyle(parent).overflowY !== 'visible') {
        parent.scrollTop += e.deltaY;
        e.preventDefault();
        return;
      }
      parent = parent.parentElement;
    }
  }, []);

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

  const handleCopy = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      if (typeof navigator !== "undefined" && navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(cleanCode);
      } else {
        const textArea = document.createElement("textarea");
        textArea.value = cleanCode;
        textArea.style.position = "fixed";
        textArea.style.opacity = "0";
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        document.execCommand("copy");
        document.body.removeChild(textArea);
      }
    } catch {
      // Fallback
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSave = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (onSaveSnippet) {
      onSaveSnippet(cleanCode, displayLang, displayFilename);
    } else if (typeof window !== "undefined") {
      try {
        const existing = JSON.parse(localStorage.getItem("raizen_saved_snippets") || "[]");
        const newSnippet = {
          id: `snippet-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
          title: displayFilename,
          code: cleanCode,
          language: displayLang,
          filename: displayFilename,
          tags: [`#${displayLang.toUpperCase()}`],
          createdAt: Date.now(),
          updatedAt: Date.now(),
        };
        localStorage.setItem("raizen_saved_snippets", JSON.stringify([newSnippet, ...existing]));
      } catch (err) {
        console.error("Failed to save snippet:", err);
      }
    }
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleRun = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    // Always launch sandbox directly in the synchronous click gesture stack
    // to prevent browser popup blockers from intercepting window.open
    launchInOpenSourceSandbox(cleanCode, displayLang, "standalone");
    // Notify parent for toast/UI feedback (non-blocking)
    if (onRunInSandbox) {
      onRunInSandbox(cleanCode, displayLang);
    }
  };

  const handleLaunchCodeSandbox = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    launchInOpenSourceSandbox(cleanCode, displayLang, "codesandbox");
  };

  const lines = cleanCode.split("\n");

  return (
    <div
      className={cn(
        "my-3.5 w-full rounded-xl bg-[#111215] border border-[#26282E] text-[#F3F4F6] font-mono text-xs shadow-swiss select-text",
        className
      )}
    >
      {/* Code Block Header */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-[#18191E] border-b border-[#26282E] select-none relative z-10">
        {/* Left: Language & Filename */}
        <div className="flex items-center gap-2">
          <FileCode className="w-4 h-4 text-swiss-saffron shrink-0" />
          <span className="text-white text-xs font-bold font-mono tracking-tight">
            {displayFilename}
          </span>
          <span className="text-[9.5px] uppercase font-mono px-2 py-0.5 rounded-full bg-black/40 border border-white/10 text-swiss-muted font-semibold">
            {displayLang}
          </span>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-1.5 shrink-0">
          {/* Run in Open-Source Sandbox Button */}
          {isRunnable && (
            <button
              type="button"
              onClick={handleRun}
              className="flex items-center gap-1.5 px-3 py-1 bg-swiss-saffron hover:bg-swiss-saffron-hover text-white text-[10.5px] font-bold rounded-pill uppercase transition-all shadow-sm active:scale-95 font-frozen tracking-wider cursor-pointer relative z-20"
              title="Open and run in Open-Source Browser Sandbox"
            >
              <Play className="w-2.5 h-2.5 fill-current" />
              <span>RUN IN SANDBOX</span>
            </button>
          )}

          {/* Direct CodeSandbox Link */}
          {isRunnable && (
            <button
              type="button"
              onClick={handleLaunchCodeSandbox}
              className="hidden sm:flex items-center gap-1 px-2.5 py-1 bg-white/5 hover:bg-white/10 border border-white/10 text-white/80 hover:text-white text-[10px] font-bold rounded-pill uppercase transition-colors font-mono cursor-pointer relative z-20"
              title="Export to CodeSandbox"
            >
              <Code2 className="w-3 h-3 text-swiss-saffron" />
              <span>CodeSandbox</span>
            </button>
          )}

          {/* Save / Bookmark to Vault Button */}
          <button
            type="button"
            onClick={handleSave}
            className="flex items-center gap-1 px-2.5 py-1 bg-white/5 hover:bg-white/10 border border-white/10 text-white/80 hover:text-white text-[10px] rounded-pill uppercase transition-colors font-mono cursor-pointer relative z-20"
            title={saved ? "Saved to Snippets Vault!" : "Save to Snippets Vault"}
          >
            {saved ? (
              <>
                <BookmarkCheck className="w-3 h-3 text-swiss-saffron" />
                <span className="text-swiss-saffron font-bold">SAVED</span>
              </>
            ) : (
              <>
                <Bookmark className="w-3 h-3" />
                <span>SAVE</span>
              </>
            )}
          </button>

          {/* Copy Button */}
          <button
            type="button"
            onClick={handleCopy}
            className="flex items-center gap-1 px-2.5 py-1 bg-white/5 hover:bg-white/10 border border-white/10 text-white/80 hover:text-white text-[10px] rounded-pill uppercase transition-colors font-mono cursor-pointer relative z-20"
            title={copied ? "Copied to clipboard" : "Copy Code"}
          >
            {copied ? (
              <>
                <Check className="w-3 h-3 text-emerald-400" />
                <span className="text-emerald-400 font-bold">COPIED</span>
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

      {/* Code Content with Clean Line Numbers and High-Legibility JetBrains Mono */}
      <div ref={codeAreaRef} onWheel={handleCodeWheel} className="p-4 overflow-x-auto no-scrollbar font-mono text-[13px] leading-[1.65] tracking-normal select-text" style={{ overscrollBehaviorY: "none" }}>
        <table className="w-full border-collapse">
          <tbody>
            {lines.map((line, idx) => (
              <tr key={idx} className="hover:bg-white/[0.03]">
                <td className="w-9 pr-4 text-right text-[11px] text-[#6B7280] select-none font-mono align-top font-normal">
                  {idx + 1}
                </td>
                <td className="whitespace-pre font-mono text-[#F3F4F6] break-normal font-normal">
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
