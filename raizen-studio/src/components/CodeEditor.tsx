"use client";

import React, { useCallback } from "react";
import Editor, { Monaco } from "@monaco-editor/react";
import { cn } from "../lib/utils";

interface CodeEditorProps {
  code: string;
  language?: string;
  onChange?: (newCode: string) => void;
  readOnly?: boolean;
  height?: string;
  className?: string;
}

export const RAIZEN_MONACO_THEME = "raizen-obsidian";

export function CodeEditor({
  code,
  language = "typescript",
  onChange,
  readOnly = false,
  height = "100%",
  className,
}: CodeEditorProps) {
  // Normalize language for Monaco
  const monacoLang = (() => {
    const l = (language || "typescript").toLowerCase();
    if (l === "react" || l === "tsx") return "typescript";
    if (l === "jsx" || l === "js") return "javascript";
    if (l === "py") return "python";
    if (l === "html") return "html";
    if (l === "css") return "css";
    if (l === "json") return "json";
    return l;
  })();

  const handleEditorWillMount = useCallback((monaco: Monaco) => {
    monaco.editor.defineTheme(RAIZEN_MONACO_THEME, {
      base: "vs-dark",
      inherit: true,
      rules: [
        { token: "", foreground: "EDEDEE", background: "111215" },
        { token: "comment", foreground: "6B7280", fontStyle: "italic" },
        { token: "keyword", foreground: "EA580C", fontStyle: "bold" },
        { token: "string", foreground: "10B981" },
        { token: "number", foreground: "F59E0B" },
        { token: "type", foreground: "3B82F6" },
        { token: "identifier", foreground: "FFFFFF" },
        { token: "delimiter", foreground: "9CA3AF" },
      ],
      colors: {
        "editor.background": "#111215",
        "editor.foreground": "#EDEDEE",
        "editorCursor.foreground": "#EA580C",
        "editor.lineHighlightBackground": "#18191E",
        "editorLineNumber.foreground": "#555861",
        "editorLineNumber.activeForeground": "#EA580C",
        "editor.selectionBackground": "#EA580C33",
        "editor.inactiveSelectionBackground": "#EA580C1A",
        "editorIndentGuide.background": "#26282E",
        "editorIndentGuide.activeBackground": "#4B5563",
      },
    });
  }, []);

  return (
    <div
      className={cn(
        "relative w-full h-full bg-[#111215] font-mono border-t border-swiss-border",
        className
      )}
    >
      <Editor
        height={height}
        language={monacoLang}
        value={code}
        theme={RAIZEN_MONACO_THEME}
        beforeMount={handleEditorWillMount}
        onChange={(val) => onChange?.(val || "")}
        options={{
          readOnly,
          minimap: { enabled: false },
          fontSize: 12,
          lineHeight: 20,
          fontFamily:
            "var(--font-mono), 'JetBrains Mono', 'Consolas', monospace",
          fontLigatures: true,
          cursorBlinking: "solid",
          cursorStyle: "line",
          smoothScrolling: true,
          scrollBeyondLastLine: false,
          automaticLayout: true,
          tabSize: 2,
          renderLineHighlight: "all",
          padding: { top: 12, bottom: 12 },
        }}
        loading={
          <div className="w-full h-full flex flex-col items-center justify-center bg-[#111215] font-mono text-xs text-swiss-muted gap-2">
            <span className="text-swiss-saffron animate-pulse font-frozen font-bold">✦ LOADING CODE ENGINE...</span>
          </div>
        }
      />
    </div>
  );
}
