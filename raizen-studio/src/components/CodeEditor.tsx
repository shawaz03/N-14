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

export const RAIZEN_MONACO_THEME = "raizen-dark";

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
        { token: "", foreground: "E5E5E5", background: "050505" },
        { token: "comment", foreground: "666666", fontStyle: "italic" },
        { token: "keyword", foreground: "CCFF00", fontStyle: "bold" },
        { token: "string", foreground: "00FF66" },
        { token: "number", foreground: "FFB800" },
        { token: "type", foreground: "00F0FF" },
        { token: "identifier", foreground: "FFFFFF" },
        { token: "delimiter", foreground: "888888" },
      ],
      colors: {
        "editor.background": "#050505",
        "editor.foreground": "#E5E5E5",
        "editorCursor.foreground": "#CCFF00",
        "editor.lineHighlightBackground": "#0A0A0A",
        "editorLineNumber.foreground": "#444444",
        "editorLineNumber.activeForeground": "#CCFF00",
        "editor.selectionBackground": "#CCFF0033",
        "editor.inactiveSelectionBackground": "#CCFF001A",
        "editorIndentGuide.background": "#1F1F1F",
        "editorIndentGuide.activeBackground": "#333333",
      },
    });
  }, []);

  return (
    <div
      className={cn(
        "relative w-full h-full bg-void font-mono border-t border-edge",
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
            "var(--font-jetbrains), 'JetBrains Mono', 'Consolas', monospace",
          fontLigatures: true,
          cursorBlinking: "solid",
          cursorStyle: "block",
          smoothScrolling: false,
          scrollBeyondLastLine: false,
          automaticLayout: true,
          tabSize: 2,
          renderLineHighlight: "all",
          padding: { top: 12, bottom: 12 },
        }}
        loading={
          <div className="w-full h-full flex flex-col items-center justify-center bg-void font-mono text-xs text-text-muted gap-2">
            <span className="text-signal animate-pulse">█ LOADING MONACO ENGINE...</span>
          </div>
        }
      />
    </div>
  );
}
