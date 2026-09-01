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
        "fixed bottom-6 right-6 z-50 flex flex-col gap-2.5 pointer-events-none font-sans select-none max-w-sm w-full",
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
              "pointer-events-auto p-3.5 bg-white border border-swiss-border rounded-xl shadow-swiss-lg flex items-start gap-3 text-xs",
              t.type === "error"
                ? "border-l-4 border-l-red-500"
                : t.type === "warning"
                ? "border-l-4 border-l-amber-500"
                : t.type === "info"
                ? "border-l-4 border-l-swiss-saffron"
                : "border-l-4 border-l-emerald-500"
            )}
          >
            {/* Icon */}
            <div className="shrink-0 mt-0.5">
              {t.type === "error" ? (
                <div className="w-5 h-5 rounded-full bg-red-50 text-red-600 flex items-center justify-center">
                  <AlertTriangle className="w-3.5 h-3.5" />
                </div>
              ) : t.type === "warning" ? (
                <div className="w-5 h-5 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center">
                  <AlertTriangle className="w-3.5 h-3.5" />
                </div>
              ) : t.type === "info" ? (
                <div className="w-5 h-5 rounded-full bg-swiss-saffron-tint text-swiss-saffron flex items-center justify-center">
                  <Info className="w-3.5 h-3.5" />
                </div>
              ) : (
                <div className="w-5 h-5 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                </div>
              )}
            </div>

            {/* Content */}
            <div className="flex-1 space-y-0.5 min-w-0">
              {t.title && (
                <div className="font-bold uppercase tracking-wider text-[11px] font-frozen text-swiss-ink">
                  {t.title}
                </div>
              )}
              <div className="text-[12px] text-swiss-body leading-relaxed font-sans">
                {t.message}
              </div>
            </div>

            {/* Dismiss trigger */}
            <button
              type="button"
              onClick={() => onDismiss(t.id)}
              className="p-1 rounded-md text-swiss-muted hover:text-swiss-ink hover:bg-swiss-canvas transition-colors shrink-0"
              title="Dismiss notification"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
