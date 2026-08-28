"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, ChevronRight, BrainCircuit } from "lucide-react";
import { cn } from "../lib/utils";

interface ThoughtAccordionProps {
  thought: string;
  defaultExpanded?: boolean;
  className?: string;
}

export function ThoughtAccordion({
  thought,
  defaultExpanded = false,
  className,
}: ThoughtAccordionProps) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  if (!thought.trim()) return null;

  return (
    <div
      className={cn(
        "my-2.5 w-full bg-void border border-edge border-l-2 border-l-edge-light text-text-muted font-mono text-xs select-text",
        className
      )}
    >
      {/* Accordion Toggle Header */}
      <button
        type="button"
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between px-3 py-1.5 bg-surface/80 hover:bg-surface border-b border-edge/40 text-[11px] text-text-muted hover:text-text-primary transition-colors select-none"
      >
        <div className="flex items-center gap-1.5">
          <BrainCircuit className="w-3.5 h-3.5 text-signal" />
          <span className="font-bold tracking-wider uppercase">
            [REASONING / CHAIN OF THOUGHT]
          </span>
        </div>

        <div className="flex items-center gap-1 text-[10px] text-text-muted">
          <span>{isExpanded ? "COLLAPSE" : "EXPAND"}</span>
          {isExpanded ? (
            <ChevronDown className="w-3 h-3 text-signal" />
          ) : (
            <ChevronRight className="w-3 h-3" />
          )}
        </div>
      </button>

      {/* Accordion Content */}
      <AnimatePresence initial={false}>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="overflow-hidden"
          >
            <div className="p-3 text-[11px] leading-relaxed text-text-muted italic bg-void/90 whitespace-pre-wrap font-mono border-t border-edge/30">
              {thought.trim()}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
