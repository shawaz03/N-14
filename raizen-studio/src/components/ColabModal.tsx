"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  ExternalLink,
  Zap,
  CheckCircle2,
  AlertCircle,
  Copy,
  Terminal,
  HelpCircle,
  Cpu,
  ShieldCheck,
} from "lucide-react";
import { UseRaizenConnectionReturn } from "../types/connection";

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
            className="fixed inset-0 bg-black/80 backdrop-blur-sm"
          />

          {/* Modal Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.98, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.98, y: 8 }}
            transition={{ duration: 0.15 }}
            className="relative w-full max-w-2xl bg-surface border border-edge text-text-primary shadow-hard-dark z-10 overflow-hidden font-mono"
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between px-5 py-3.5 bg-void border-b border-edge">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 bg-signal" />
                <span className="font-bold text-sm text-text-primary tracking-wide uppercase">
                  LAUNCH RAIZEN GPU ENGINE
                </span>
                <span className="text-[10px] px-1.5 py-0.5 bg-surface border border-edge text-signal">
                  $0 / MONTH
                </span>
              </div>
              <button
                onClick={onClose}
                className="text-text-muted hover:text-text-primary p-1 hover:bg-surface-elevated border border-transparent hover:border-edge transition-colors"
                title="Close Modal (Esc)"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-5 space-y-5 max-h-[80vh] overflow-y-auto">
              {/* Architecture Intro */}
              <div className="p-3 bg-void border border-edge flex items-start gap-3">
                <Cpu className="w-5 h-5 text-signal shrink-0 mt-0.5" />
                <div className="text-xs space-y-1">
                  <p className="text-text-primary font-bold">
                    Zero-Cost Google Colab Backend Architecture
                  </p>
                  <p className="text-text-muted text-[11px] leading-relaxed">
                    Run the 7.61B parameter RAIZEN model on Google Colab&apos;s free
                    Tesla T4 GPU. Cloudflare Tunnel assigns a public HTTPS endpoint
                    that this studio connects to via streaming SSE.
                  </p>
                </div>
              </div>

              {/* 3 Step Protocol */}
              <div className="space-y-3">
                <div className="text-[11px] text-text-muted uppercase tracking-wider font-bold">
                  EXECUTION PROTOCOL (3 STEPS)
                </div>

                {/* Step 1 */}
                <div className="p-3.5 bg-void border border-edge flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 bg-surface border border-edge flex items-center justify-center text-xs font-bold text-signal">
                      1
                    </div>
                    <div>
                      <div className="text-xs font-bold text-text-primary">
                        Open Google Colab Notebook
                      </div>
                      <div className="text-[10px] text-text-muted">
                        Pre-configured 1-click Colab engine
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 w-full sm:w-auto">
                    <a
                      href={COLAB_NOTEBOOK_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-3 py-1.5 bg-signal hover:bg-signal-hover text-void text-xs font-bold transition-transform active:translate-y-0.5"
                    >
                      <Zap className="w-3.5 h-3.5" />
                      <span>OPEN COLAB</span>
                      <ExternalLink className="w-3 h-3 ml-0.5" />
                    </a>
                    <button
                      type="button"
                      onClick={handleCopyNotebookLink}
                      className="p-1.5 bg-surface hover:bg-surface-elevated border border-edge text-text-muted hover:text-text-primary transition-colors"
                      title={copied ? "Copied!" : "Copy Notebook URL"}
                    >
                      {copied ? (
                        <CheckCircle2 className="w-3.5 h-3.5 text-terminal-success" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Step 2 */}
                <div className="p-3.5 bg-void border border-edge flex items-center gap-3">
                  <div className="w-6 h-6 bg-surface border border-edge flex items-center justify-center text-xs font-bold text-signal shrink-0">
                    2
                  </div>
                  <div>
                    <div className="text-xs font-bold text-text-primary">
                      Run All Cells in Colab
                    </div>
                    <div className="text-[10px] text-text-muted">
                      In the notebook, click{" "}
                      <span className="text-signal">Runtime ➔ Run all</span> (takes
                      ~90s to load 4-bit model and launch Cloudflare tunnel).
                    </div>
                  </div>
                </div>

                {/* Step 3: Connect Input */}
                <div className="p-3.5 bg-void border border-edge space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 bg-surface border border-edge flex items-center justify-center text-xs font-bold text-signal shrink-0">
                      3
                    </div>
                    <div>
                      <div className="text-xs font-bold text-text-primary">
                        Paste Public Cloudflare Tunnel URL
                      </div>
                      <div className="text-[10px] text-text-muted">
                        Copy the generated{" "}
                        <span className="text-signal">*.trycloudflare.com</span>{" "}
                        URL from Cell 11 output.
                      </div>
                    </div>
                  </div>

                  <form onSubmit={handleConnect} className="space-y-2">
                    <div className="flex items-center border border-edge bg-surface focus-within:border-signal p-1">
                      <Terminal className="w-3.5 h-3.5 text-signal ml-2 mr-1 shrink-0" />
                      <input
                        type="text"
                        value={modalUrl}
                        onChange={(e) => setModalUrl(e.target.value)}
                        placeholder="https://random-words.trycloudflare.com"
                        className="w-full bg-transparent px-2 py-1 text-xs text-text-primary placeholder:text-text-muted focus:outline-none"
                      />
                      <button
                        type="submit"
                        disabled={
                          connection.status === "connecting" || !modalUrl.trim()
                        }
                        className="px-4 py-1.5 bg-signal hover:bg-signal-hover text-void text-xs font-bold shrink-0 transition-transform active:translate-y-0.5 disabled:opacity-50"
                      >
                        {connection.status === "connecting"
                          ? "VERIFYING..."
                          : "CONNECT"}
                      </button>
                    </div>

                    {/* Connection Feedback Message */}
                    {connection.status === "connected" && (
                      <div className="p-2 bg-void border border-terminal-success/30 text-terminal-success text-xs flex items-center justify-between">
                        <div className="flex items-center gap-1.5">
                          <CheckCircle2 className="w-4 h-4" />
                          <span>Connected to RAIZEN Engine ({connection.modelInfo?.model || "7.61B"})</span>
                        </div>
                        {connection.latencyMs !== null && (
                          <span className="text-[10px] text-text-muted">
                            Latency: {connection.latencyMs}ms
                          </span>
                        )}
                      </div>
                    )}

                    {connection.status === "error" && connection.errorMessage && (
                      <div className="p-2 bg-void border border-terminal-error/30 text-terminal-error text-xs flex items-center gap-1.5">
                        <AlertCircle className="w-4 h-4 shrink-0" />
                        <span>{connection.errorMessage}</span>
                      </div>
                    )}
                  </form>
                </div>
              </div>

              {/* Troubleshooting Drawer */}
              <div className="border-t border-edge pt-3">
                <button
                  type="button"
                  onClick={() => setShowTroubleshoot(!showTroubleshoot)}
                  className="w-full flex items-center justify-between text-xs text-text-muted hover:text-text-primary py-1"
                >
                  <span className="flex items-center gap-1.5">
                    <HelpCircle className="w-3.5 h-3.5 text-signal" />
                    <span>Troubleshooting & FAQ</span>
                  </span>
                  <span className="text-[10px]">{showTroubleshoot ? "▲" : "▼"}</span>
                </button>

                {showTroubleshoot && (
                  <div className="mt-2 p-3 bg-void border border-edge text-[11px] text-text-muted space-y-2">
                    <p>
                      <strong className="text-text-primary">Q: Does Colab disconnect if I switch tabs?</strong>
                      <br />
                      The notebook includes an automated keep-alive watchdog pinging every 180s. Keep the Colab browser tab open in the background.
                    </p>
                    <p>
                      <strong className="text-text-primary">Q: How do I get a new tunnel URL?</strong>
                      <br />
                      Re-run Cell 10 and Cell 11 in your Colab notebook to generate a fresh Cloudflare Tunnel endpoint.
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-5 py-3 bg-void border-t border-edge flex items-center justify-between text-[11px] text-text-muted">
              <div className="flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-signal" />
                <span>Zero GPU compute charges</span>
              </div>
              <a
                href="https://shawaz.vercel.app/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-signal hover:underline"
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
