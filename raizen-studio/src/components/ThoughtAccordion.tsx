"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CaretDown, CaretRight, Brain, Sparkle } from "@phosphor-icons/react";
import { MotionIcon } from "./ui/MotionIcon";
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
              <MotionIcon icon={Sparkle} size={13} weight="duotone" animation="spin" className="text-swiss-saffron" />
            ) : (
              <MotionIcon icon={Brain} size={13} weight="duotone" animation="pulse" className="text-swiss-saffron" />
            )}
          </div>
          <span className="font-mono font-bold text-[11px] uppercase tracking-wide text-swiss-saffron-text">
            Thought & Architectural Reasoning / Chain of Thought
          </span>
        </div>

        <div className="flex items-center gap-1.5 text-[10.5px] font-mono text-swiss-muted">
          <span>{isExpanded ? "Hide reasoning" : "Show reasoning"}</span>
          {isExpanded ? (
            <MotionIcon icon={CaretDown} size={14} weight="bold" className="text-swiss-saffron" />
          ) : (
            <MotionIcon icon={CaretRight} size={14} weight="bold" />
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
