"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, ChevronRight, Brain, Sparkles } from "lucide-react";
import { cn } from "../lib/utils";

interface ThoughtAccordionProps {
  thought: string;
  defaultExpanded?: boolean;
  isStreaming?: boolean;
  className?: string;
}

export function ThoughtAccordion({
  thought,
  defaultExpanded = false,
  isStreaming = false,
  className,
}: ThoughtAccordionProps) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  if (!thought.trim()) return null;

  return (
    <div
      className={cn(
        "my-2.5 w-full rounded-md bg-white border border-swiss-border-card border-l-2 border-l-swiss-saffron shadow-swiss overflow-hidden select-text text-xs",
        className
      )}
    >
      {/* Accordion Toggle Header */}
      <button
        type="button"
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between px-3.5 py-2 bg-swiss-saffron-tint/40 hover:bg-swiss-saffron-tint/70 text-swiss-body hover:text-swiss-ink transition-all select-none"
      >
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded-full bg-swiss-saffron-tint text-swiss-saffron flex items-center justify-center shrink-0">
            {isStreaming ? (
              <Sparkles className="w-3 h-3 animate-spin text-swiss-saffron" style={{ animationDuration: "3s" }} />
            ) : (
              <Brain className="w-3 h-3 text-swiss-saffron" />
            )}
          </div>
          <span className="font-mono font-bold text-[11px] uppercase tracking-wide text-swiss-saffron-text">
            Thought & Architectural Reasoning / Chain of Thought
          </span>
        </div>

        <div className="flex items-center gap-1.5 text-[10.5px] font-mono text-swiss-muted">
          <span>{isExpanded ? "Hide reasoning" : "Show reasoning"}</span>
          {isExpanded ? (
            <ChevronDown className="w-3.5 h-3.5 text-swiss-saffron" />
          ) : (
            <ChevronRight className="w-3.5 h-3.5" />
          )}
        </div>
      </button>

      {/* Accordion Expanded Content */}
      <AnimatePresence initial={false}>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="overflow-hidden border-t border-swiss-border/60"
          >
            <div className="p-3.5 text-[12px] leading-relaxed text-swiss-ink bg-swiss-canvas/40 whitespace-pre-wrap font-mono">
              {thought.trim()}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
