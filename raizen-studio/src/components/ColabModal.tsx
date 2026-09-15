"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  ArrowSquareOut,
  Lightning,
  CheckCircle,
  WarningCircle,
  Copy,
  TerminalWindow,
  Question,
  Cpu,
  ShieldCheck,
  Sparkle,
} from "@phosphor-icons/react";
import { MotionIcon } from "./ui/MotionIcon";
import { UseRaizenConnectionReturn } from "../types/connection";
import { cn } from "../lib/utils";

interface ColabModalProps {
  isOpen: boolean;
  onClose: () => void;
  connection: UseRaizenConnectionReturn;
}

const COLAB_NOTEBOOK_URL =
  "https://colab.research.google.com/github/shawaz03/N-14/blob/main/notebooks/RAIZEN_Colab_Engine.ipynb";

export function ColabModal({ isOpen, onClose, connection }: ColabModalProps) {
  const [modalUrl, setModalUrl] = useState(connection.tunnelUrl);
  const [copied, setCopied] = useState(false);
  const [showTroubleshoot, setShowTroubleshoot] = useState(false);

  useEffect(() => {
    setModalUrl(connection.tunnelUrl);
  }, [connection.tunnelUrl]);

  // Handle ESC key listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  const handleConnect = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!modalUrl.trim()) return;
    const success = await connection.connect(modalUrl.trim());
    if (success) {
      setTimeout(() => {
        onClose();
      }, 1200);
    }
  };

  const handleCopyNotebookLink = () => {
    navigator.clipboard.writeText(COLAB_NOTEBOOK_URL);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
          />

          {/* Modal Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.98, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.98, y: 8 }}
            transition={{ duration: 0.15 }}
            className="relative w-full max-w-2xl bg-white border border-swiss-border rounded-2xl text-swiss-ink shadow-swiss-lg z-10 overflow-hidden font-sans select-none"
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 bg-white border-b border-swiss-border">
              <div className="flex items-center gap-2.5">
                <div className="w-6 h-6 rounded-md bg-swiss-saffron-tint text-swiss-saffron-text font-extrabold flex items-center justify-center font-frozen">
                  <MotionIcon icon={Sparkle} size={13} weight="duotone" animation="pulse" />
                </div>
                <span className="font-extrabold text-sm sm:text-base text-swiss-ink tracking-wider font-frozen uppercase">
                  LAUNCH RAIZEN GPU ENGINE
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-pill bg-swiss-saffron-tint text-swiss-saffron-text border border-swiss-border font-frozen tracking-wide">
                  $0 / MONTH
                </span>
              </div>
              <button
                onClick={onClose}
                className="text-swiss-muted hover:text-swiss-ink p-1.5 rounded-full hover:bg-swiss-canvas transition-colors flex items-center justify-center"
                title="Close Modal (Esc)"
              >
                <MotionIcon icon={X} size={16} weight="bold" animation="bounce" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-5 max-h-[80vh] overflow-y-auto">
              {/* Architecture Intro */}
              <div className="p-4 bg-swiss-canvas border border-swiss-border rounded-xl flex items-start gap-3.5">
                <div className="w-8 h-8 rounded-lg bg-swiss-saffron-tint text-swiss-saffron flex items-center justify-center shrink-0 mt-0.5">
                  <MotionIcon icon={Cpu} size={18} weight="duotone" animation="pulse" className="text-swiss-saffron" />
                </div>
                <div className="text-xs space-y-1">
                  <p className="text-swiss-ink font-bold font-frozen text-xs sm:text-sm">
                    Zero-Cost Google Colab Backend Architecture
                  </p>
                  <p className="text-swiss-muted text-[11.5px] leading-relaxed">
                    Run the 7.61B parameter RAIZEN model on Google Colab&apos;s free
                    Tesla T4 GPU accelerated by vLLM PagedAttention (8–15 tokens/sec). Cloudflare Tunnel assigns a public HTTPS endpoint
                    that this studio connects to via streaming SSE.
                  </p>
                </div>
              </div>

              {/* 3 Step Protocol */}
              <div className="space-y-3">
                <div className="text-[11px] text-swiss-muted uppercase tracking-widest font-bold font-frozen">
                  EXECUTION PROTOCOL (3 STEPS)
                </div>

                {/* Step 1 */}
                <div className="p-4 bg-swiss-canvas border border-swiss-border rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-7 h-7 rounded-full bg-swiss-saffron-tint text-swiss-saffron-text flex items-center justify-center text-xs font-bold font-frozen shrink-0">
                      1
                    </div>
                    <div>
                      <div className="text-xs sm:text-sm font-bold text-swiss-ink font-frozen tracking-wide">
                        Open Google Colab Notebook
                      </div>
                      <div className="text-[11px] text-swiss-muted">
                        Pre-configured 1-click Colab engine
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 w-full sm:w-auto">
                    <a
                      href={COLAB_NOTEBOOK_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-4 py-2 btn-glass-dark btn-glass-shine text-white text-xs font-bold rounded-pill transition-all active:scale-95 font-frozen tracking-wider"
                    >
                      <MotionIcon icon={Lightning} size={14} weight="duotone" animation="bounce" />
                      <span>OPEN COLAB</span>
                      <MotionIcon icon={ArrowSquareOut} size={13} weight="duotone" animation="glance" className="ml-0.5" />
                    </a>
                    <button
                      type="button"
                      onClick={handleCopyNotebookLink}
                      className="p-2 btn-glass-light btn-glass-shine rounded-pill text-swiss-muted hover:text-swiss-ink transition-colors flex items-center justify-center"
                      title={copied ? "Copied!" : "Copy Notebook URL"}
                    >
                      {copied ? (
                        <MotionIcon icon={CheckCircle} size={16} weight="duotone" className="text-emerald-600" />
                      ) : (
                        <MotionIcon icon={Copy} size={16} weight="duotone" animation="bounce" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Step 2 */}
                <div className="p-4 bg-swiss-canvas border border-swiss-border rounded-xl flex items-center gap-3">
                  <div className="w-7 h-7 rounded-full bg-swiss-saffron-tint text-swiss-saffron-text flex items-center justify-center text-xs font-bold font-frozen shrink-0">
                    2
                  </div>
                  <div>
                    <div className="text-xs sm:text-sm font-bold text-swiss-ink font-frozen tracking-wide">
                      Run All Cells in Colab
                    </div>
                    <div className="text-[11px] text-swiss-muted">
                      In the notebook, click{" "}
                      <span className="text-swiss-saffron font-bold font-mono">Runtime ➔ Run all</span> (takes
                      ~90s to load 4-bit model and launch Cloudflare tunnel).
                    </div>
                  </div>
                </div>

                {/* Step 3 */}
                <div
                  className={cn(
                    "p-4 bg-swiss-canvas border border-swiss-border rounded-xl space-y-3 transition-all",
                    connection.justConnected && "ring-2 ring-emerald-500/50 shadow-[0_0_24px_rgba(16,185,129,0.2)]"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-7 h-7 rounded-full bg-swiss-saffron-tint text-swiss-saffron-text flex items-center justify-center text-xs font-bold font-frozen shrink-0">
                      3
                    </div>
                    <div>
                      <div className="text-xs sm:text-sm font-bold text-swiss-ink font-frozen tracking-wide">
                        Paste Public Cloudflare Tunnel URL
                      </div>
                      <div className="text-[11px] text-swiss-muted">
                        Copy the generated{" "}
                        <span className="text-swiss-saffron font-bold font-mono">*.trycloudflare.com</span>{" "}
                        URL from Cell 11 output.
                      </div>
                    </div>
                  </div>

                  <form onSubmit={handleConnect} className="space-y-2.5">
                    <div className="flex items-center border border-swiss-border bg-white rounded-pill focus-within:border-swiss-saffron p-1 shadow-sm transition-all">
                      <MotionIcon icon={TerminalWindow} size={15} weight="duotone" className="text-swiss-saffron ml-2.5 mr-1 shrink-0" />
                      <input
                        type="text"
                        value={modalUrl}
                        onChange={(e) => setModalUrl(e.target.value)}
                        placeholder="https://random-words.trycloudflare.com"
                        className="w-full bg-transparent px-2 py-1 text-xs font-mono text-swiss-ink placeholder:text-swiss-muted/60 focus:outline-none"
                      />
                      <button
                        type="submit"
                        disabled={
                          connection.status === "connecting" || !modalUrl.trim()
                        }
                        className="px-5 py-2 btn-glass-dark btn-glass-shine text-white text-xs font-bold rounded-pill uppercase tracking-wider shrink-0 transition-all active:scale-95 disabled:opacity-50 font-frozen"
                      >
                        {connection.status === "connecting"
                          ? "VERIFYING..."
                          : "CONNECT"}
                      </button>
                    </div>

                    {/* Connection Feedback Message */}
                    {connection.status === "connected" && (
                      <div
                        className={cn(
                          "p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs flex items-center justify-between font-frozen tracking-wide transition-all",
                          connection.justConnected && "ring-2 ring-emerald-500/40 shadow-[0_0_18px_rgba(16,185,129,0.2)]"
                        )}
                      >
                        <div className="flex items-center gap-2.5">
                          <div className="relative flex items-center justify-center w-3 h-3">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                            <MotionIcon icon={CheckCircle} size={16} weight="duotone" className="relative text-emerald-600" />
                          </div>
                          <span>Connected to RAIZEN Engine ({connection.modelInfo?.model || "7.61B"})</span>
                        </div>
                        {connection.latencyMs !== null && (
                          <div className="flex items-center gap-1.5 font-mono text-[10.5px] bg-emerald-100/60 border border-emerald-300/40 px-2 py-0.5 rounded-pill text-emerald-800 font-bold">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                            <span>{connection.latencyMs}ms</span>
                          </div>
                        )}
                      </div>
                    )}

                    {connection.status === "error" && connection.errorMessage && (
                      <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-xs flex items-center gap-2 font-frozen tracking-wide">
                        <MotionIcon icon={WarningCircle} size={16} weight="duotone" className="shrink-0 text-red-600" />
                        <span>{connection.errorMessage}</span>
                      </div>
                    )}
                  </form>
                </div>
              </div>

              {/* Troubleshooting Drawer */}
              <div className="border-t border-swiss-border pt-3">
                <button
                  type="button"
                  onClick={() => setShowTroubleshoot(!showTroubleshoot)}
                  className="w-full flex items-center justify-between text-xs text-swiss-muted hover:text-swiss-ink py-1 font-frozen tracking-wide"
                >
                  <span className="flex items-center gap-1.5">
                    <MotionIcon icon={Question} size={15} weight="duotone" animation="bounce" className="text-swiss-saffron" />
                    <span>Troubleshooting & FAQ</span>
                  </span>
                  <span className="text-[10px]">{showTroubleshoot ? "▲" : "▼"}</span>
                </button>

                {showTroubleshoot && (
                  <div className="mt-2 p-3.5 bg-swiss-canvas border border-swiss-border rounded-xl text-[11.5px] text-swiss-muted space-y-2 leading-relaxed">
                    <p>
                      <strong className="text-swiss-ink font-frozen">Q: Does Colab disconnect if I switch tabs?</strong>
                      <br />
                      The notebook includes an automated keep-alive watchdog pinging every 180s. Keep the Colab browser tab open in the background.
                    </p>
                    <p>
                      <strong className="text-swiss-ink font-frozen">Q: How do I get a new tunnel URL?</strong>
                      <br />
                      Re-run Cell 10 and Cell 11 in your Colab notebook to generate a fresh Cloudflare Tunnel endpoint.
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-3.5 bg-swiss-canvas border-t border-swiss-border flex items-center justify-between text-[11px] text-swiss-muted font-frozen">
              <div className="flex items-center gap-1.5">
                <MotionIcon icon={ShieldCheck} size={15} weight="duotone" animation="pulse" className="text-swiss-saffron" />
                <span>Zero GPU compute charges</span>
              </div>
              <a
                href="https://shawaz.vercel.app/"
                target="_blank"
                rel="noopener noreferrer"
                className="font-bold text-swiss-ink hover:text-swiss-saffron transition-colors font-frozen tracking-wider"
              >
                Crafted by SHAWAZ
              </a>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
