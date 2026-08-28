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
  className?: string;
}

export function MarkdownRenderer({
  content,
  onRunInSandbox,
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
    <div className={cn("prose-terminal font-mono text-xs select-text", className)}>
      {/* Thought / Reasoning Section */}
      {thought !== null && thought.trim().length > 0 && (
        <ThoughtAccordion thought={thought} defaultExpanded={!remainingContent} />
      )}

      {/* Main Content Render */}
      {remainingContent.length > 0 && (
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          components={{
            code({ className: codeClassName, children, ...props }) {
              const match = /language-(\w+)/.exec(codeClassName || "");
              const codeString = String(children).replace(/\n$/, "");
              const isInline = !match && !codeString.includes("\n");

              if (isInline) {
                return (
                  <code
                    className="px-1.5 py-0.5 bg-void border border-edge text-signal font-mono text-[11px] rounded-none inline-block align-baseline"
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
                />
              );
            },
            p({ children }) {
              return <p className="mb-2 leading-relaxed text-[#E5E5E5] last:mb-0">{children}</p>;
            },
            h1({ children }) {
              return (
                <h1 className="text-base font-bold text-text-primary mt-4 mb-2 pb-1 border-b border-edge flex items-center gap-1.5">
                  <span className="text-signal">#</span>
                  <span>{children}</span>
                </h1>
              );
            },
            h2({ children }) {
              return (
                <h2 className="text-sm font-bold text-text-primary mt-3 mb-1.5 pb-1 border-b border-edge flex items-center gap-1.5">
                  <span className="text-signal">##</span>
                  <span>{children}</span>
                </h2>
              );
            },
            h3({ children }) {
              return (
                <h3 className="text-xs font-bold text-text-primary mt-2 mb-1 flex items-center gap-1">
                  <span className="text-signal">###</span>
                  <span>{children}</span>
                </h3>
              );
            },
            ul({ children }) {
              return <ul className="my-2 ml-4 list-disc space-y-1 text-text-primary marker:text-signal">{children}</ul>;
            },
            ol({ children }) {
              return <ol className="my-2 ml-4 list-decimal space-y-1 text-text-primary marker:text-signal">{children}</ol>;
            },
            li({ children }) {
              return <li className="leading-relaxed pl-0.5">{children}</li>;
            },
            blockquote({ children }) {
              return (
                <blockquote className="my-2 pl-3 border-l-2 border-signal/60 text-text-muted italic bg-void/50 py-1">
                  {children}
                </blockquote>
              );
            },
            table({ children }) {
              return (
                <div className="my-3 overflow-x-auto border border-edge">
                  <table className="w-full text-left border-collapse text-xs font-mono">{children}</table>
                </div>
              );
            },
            thead({ children }) {
              return <thead className="bg-void border-b border-edge text-signal">{children}</thead>;
            },
            th({ children }) {
              return <th className="px-3 py-1.5 font-bold uppercase tracking-wider text-[11px] border-r border-edge last:border-r-0">{children}</th>;
            },
            td({ children }) {
              return <td className="px-3 py-1.5 border-t border-edge border-r border-edge last:border-r-0 text-text-primary">{children}</td>;
            },
            a({ href, children }) {
              return (
                <a
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-signal underline decoration-signal/40 hover:decoration-signal transition-colors font-bold"
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
