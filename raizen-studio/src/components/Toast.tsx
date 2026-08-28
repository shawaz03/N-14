"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, AlertTriangle, Info, X } from "lucide-react";
import { ToastMessage } from "../types/toast";
import { cn } from "../lib/utils";

interface ToastProps {
  toasts: ToastMessage[];
  onDismiss: (id: string) => void;
  className?: string;
}

export function ToastContainer({ toasts, onDismiss, className }: ToastProps) {
  return (
    <div
      aria-live="assertive"
      className={cn(
        "fixed bottom-10 right-4 z-50 flex flex-col gap-2 pointer-events-none font-mono select-none max-w-sm w-full",
        className
      )}
    >
      <AnimatePresence>
        {toasts.map((t) => (
          <motion.div
            key={t.id}
            initial={{ opacity: 0, y: 15, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className={cn(
              "pointer-events-auto p-3 bg-surface border border-edge shadow-hard-dark flex items-start gap-2.5 text-xs text-text-primary",
              t.type === "error"
                ? "border-l-4 border-l-terminal-error"
                : t.type === "warning"
                ? "border-l-4 border-l-yellow-400"
                : t.type === "info"
                ? "border-l-4 border-l-cyan-400"
                : "border-l-4 border-l-signal"
            )}
          >
            {/* Icon */}
            <div className="shrink-0 mt-0.5">
              {t.type === "error" ? (
                <AlertTriangle className="w-3.5 h-3.5 text-terminal-error" />
              ) : t.type === "warning" ? (
                <AlertTriangle className="w-3.5 h-3.5 text-yellow-400" />
              ) : t.type === "info" ? (
                <Info className="w-3.5 h-3.5 text-cyan-400" />
              ) : (
                <CheckCircle2 className="w-3.5 h-3.5 text-signal" />
              )}
            </div>

            {/* Content */}
            <div className="flex-1 space-y-0.5">
              {t.title && (
                <div className="font-bold uppercase tracking-wider text-[11px] text-text-primary">
                  {t.title}
                </div>
              )}
              <div className="text-[11px] text-text-muted leading-relaxed">
                {t.message}
              </div>
            </div>

            {/* Dismiss trigger */}
            <button
              type="button"
              onClick={() => onDismiss(t.id)}
              className="p-1 text-text-muted hover:text-text-primary transition-colors shrink-0"
              title="Dismiss notification"
            >
              <X className="w-3 h-3" />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
