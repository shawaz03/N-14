"use client";

import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { CodeBlock } from "./CodeBlock";
import { ThoughtAccordion } from "./ThoughtAccordion";
import { AsciiDivider } from "./AsciiDivider";
import { cn } from "../lib/utils";

interface MarkdownRendererProps {
  content: string;
  onRunInSandbox?: (code: string, language: string) => void;
  onSaveSnippet?: (code: string, language: string, filename?: string) => void;
  className?: string;
}

export function MarkdownRenderer({
  content,
  onRunInSandbox,
  onSaveSnippet,
  className,
}: MarkdownRendererProps) {
  // Extract <think>...</think> reasoning blocks if present
  let thought: string | null = null;
  let remainingContent = content;

  const closedThinkMatch = /<think>([\s\S]*?)<\/think>/i.exec(content);
  if (closedThinkMatch) {
    thought = closedThinkMatch[1];
    remainingContent = content.replace(/<think>[\s\S]*?<\/think>/i, "").trim();
  } else if (content.includes("<think>")) {
    // Handle in-flight streaming thought block
    const parts = content.split(/<think>/i);
    thought = parts[1] || "";
    remainingContent = parts[0].trim();
  }

  return (
    <div className={cn("font-sans text-xs select-text", className)}>
      {/* Thought / Reasoning Section */}
      {thought !== null && thought.trim().length > 0 && (
        <ThoughtAccordion thought={thought} defaultExpanded={!remainingContent} />
      )}

      {/* Main Content Render */}
      {remainingContent.length > 0 && (
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          components={{
            pre({ children }) {
              return <>{children}</>;
            },
            code({ className: codeClassName, children, ...props }) {
              const match = /language-(\w+)/.exec(codeClassName || "");
              const codeString = String(children).replace(/\n$/, "");
              const isInline = !match && !codeString.includes("\n");

              if (isInline) {
                return (
                  <code
                    className="px-1.5 py-0.5 bg-swiss-canvas border border-swiss-border text-swiss-saffron-text font-mono text-[11px] rounded inline-block align-baseline font-bold"
                    {...props}
                  >
                    {children}
                  </code>
                );
              }

              const language = match ? match[1] : "text";

              return (
                <CodeBlock
                  code={codeString}
                  language={language}
                  onRunInSandbox={onRunInSandbox}
                  onSaveSnippet={onSaveSnippet}
                />
              );
            },
            p({ children }) {
              return (
                <p className="mb-2.5 leading-relaxed text-swiss-ink font-sans text-sm sm:text-[15px] tracking-normal last:mb-0">
                  {children}
                </p>
              );
            },
            h1({ children }) {
              return (
                <h1 className="text-base sm:text-lg font-bold text-swiss-ink font-frozen mt-4 mb-2 pb-1 border-b border-swiss-border flex items-center gap-1.5">
                  <span className="text-swiss-saffron">#</span>
                  <span>{children}</span>
                </h1>
              );
            },
            h2({ children }) {
              return (
                <h2 className="text-sm sm:text-base font-bold text-swiss-ink font-frozen mt-3 mb-1.5 pb-1 border-b border-swiss-border flex items-center gap-1.5">
                  <span className="text-swiss-saffron">##</span>
                  <span>{children}</span>
                </h2>
              );
            },
            h3({ children }) {
              return (
                <h3 className="text-xs sm:text-sm font-bold text-swiss-ink font-frozen mt-2 mb-1 flex items-center gap-1">
                  <span className="text-swiss-saffron">###</span>
                  <span>{children}</span>
                </h3>
              );
            },
            ul({ children }) {
              return (
                <ul className="my-2.5 ml-4 list-disc space-y-1 text-swiss-ink font-sans text-sm sm:text-[15px] marker:text-swiss-saffron">
                  {children}
                </ul>
              );
            },
            ol({ children }) {
              return (
                <ol className="my-2.5 ml-4 list-decimal space-y-1 text-swiss-ink font-sans text-sm sm:text-[15px] marker:text-swiss-saffron">
                  {children}
                </ol>
              );
            },
            li({ children }) {
              return <li className="leading-relaxed pl-0.5">{children}</li>;
            },
            blockquote({ children }) {
              return (
                <blockquote className="my-2.5 pl-3.5 border-l-2 border-swiss-saffron bg-swiss-canvas/80 text-swiss-body italic py-1.5 rounded-r-md font-sans">
                  {children}
                </blockquote>
              );
            },
            table({ children }) {
              return (
                <div className="my-3 overflow-x-auto border border-swiss-border rounded-xl">
                  <table className="w-full text-left border-collapse text-xs font-sans bg-white">
                    {children}
                  </table>
                </div>
              );
            },
            thead({ children }) {
              return (
                <thead className="bg-swiss-canvas border-b border-swiss-border text-swiss-ink font-frozen">
                  {children}
                </thead>
              );
            },
            th({ children }) {
              return (
                <th className="px-3.5 py-2 font-bold uppercase tracking-wider text-[11px] border-r border-swiss-border last:border-r-0 text-swiss-ink">
                  {children}
                </th>
              );
            },
            td({ children }) {
              return (
                <td className="px-3.5 py-2 border-t border-swiss-border border-r border-swiss-border last:border-r-0 text-swiss-body font-sans text-xs sm:text-sm">
                  {children}
                </td>
              );
            },
            a({ href, children }) {
              return (
                <a
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-swiss-saffron hover:underline font-bold transition-colors font-mono"
                >
                  {children}
                </a>
              );
            },
            hr() {
              return <AsciiDivider />;
            },
          }}
        >
          {remainingContent}
        </ReactMarkdown>
      )}
    </div>
  );
}
