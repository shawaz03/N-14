"use client";

import { useState, useCallback } from "react";
import { SandboxTab } from "../components/SandboxHeader";

export const DEFAULT_STARTER_CODE = `function RaizenTelemetryWidget() {
  const [activeTab, setActiveTab] = React.useState('metrics');
  const [count, setCount] = React.useState(14);
  const [isLive, setIsLive] = React.useState(true);

  return (
    <div className="w-full max-w-xl mx-auto my-4 p-5 bg-[#050505] border border-[#1F1F1F] border-l-4 border-l-[#CCFF00] font-mono text-xs text-[#E5E5E5] shadow-[4px_4px_0px_#1F1F1F]">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[#1F1F1F] pb-3 mb-4">
        <div className="flex items-center gap-2">
          <span className="text-[#CCFF00] font-bold text-sm">█ RAIZEN SANDBOX</span>
          <span className="px-1.5 py-0.5 bg-[#0A0A0A] border border-[#1F1F1F] text-[10px] text-[#888888]">
            v1.0.0
          </span>
        </div>
        <div className="flex items-center gap-1.5 text-[10px]">
          <span className="w-2 h-2 bg-[#CCFF00] rounded-full animate-ping"></span>
          <span className="text-[#CCFF00] font-bold">ONLINE</span>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 mb-4">
        <button
          onClick={() => setActiveTab('metrics')}
          className={'px-3 py-1 text-[11px] font-bold uppercase transition-colors ' + 
            (activeTab === 'metrics' 
              ? 'bg-[#CCFF00] text-[#050505]' 
              : 'bg-[#0A0A0A] text-[#888888] border border-[#1F1F1F] hover:text-white')}
        >
          Telemetry
        </button>
        <button
          onClick={() => setActiveTab('creator')}
          className={'px-3 py-1 text-[11px] font-bold uppercase transition-colors ' + 
            (activeTab === 'creator' 
              ? 'bg-[#CCFF00] text-[#050505]' 
              : 'bg-[#0A0A0A] text-[#888888] border border-[#1F1F1F] hover:text-white')}
        >
          Creator Info
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === 'metrics' ? (
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 bg-[#0A0A0A] border border-[#1F1F1F]">
              <div className="text-[10px] text-[#888888]">GENERATION VELOCITY</div>
              <div className="text-lg font-bold text-[#CCFF00] mt-1">48.2 tok/s</div>
            </div>
            <div className="p-3 bg-[#0A0A0A] border border-[#1F1F1F]">
              <div className="text-[10px] text-[#888888]">T4 GPU MEMORY</div>
              <div className="text-lg font-bold text-white mt-1">5.8 / 15.0 GB</div>
            </div>
          </div>

          <div className="p-3 bg-[#0A0A0A] border border-[#1F1F1F] flex items-center justify-between">
            <span>INTERACTIVE TEST COUNTER</span>
            <div className="flex items-center gap-2">
              <button 
                onClick={() => setCount(c => c - 1)}
                className="px-2 py-0.5 bg-[#1F1F1F] hover:bg-[#333333] text-white font-bold"
              >
                -
              </button>
              <span className="text-[#CCFF00] font-bold w-6 text-center">{count}</span>
              <button 
                onClick={() => setCount(c => c + 1)}
                className="px-2 py-0.5 bg-[#1F1F1F] hover:bg-[#333333] text-white font-bold"
              >
                +
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="p-4 bg-[#0A0A0A] border border-[#1F1F1F] space-y-2">
          <div className="text-[#CCFF00] font-bold text-sm">ARCHITECT & CREATOR</div>
          <div className="text-white font-bold">SHAWAZ</div>
          <p className="text-[#888888] text-[11px] leading-relaxed">
            Enterprise Full-Stack AI Engineer & Creator of the RAIZEN 7.61B Qwen2.5-Coder Model.
          </p>
          <a
            href="https://shawaz.vercel.app/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block mt-2 px-3 py-1 bg-[#CCFF00] text-[#050505] font-bold text-[10px] uppercase hover:bg-[#B8E600] transition-colors"
          >
            Visit Portfolio ↗
          </a>
        </div>
      )}

      {/* Footer */}
      <div className="mt-4 pt-3 border-t border-[#1F1F1F] flex items-center justify-between text-[10px] text-[#666666]">
        <span>MODEL: RAIZEN-7.61B-CODER</span>
        <span>STATUS: READY</span>
      </div>
    </div>
  );
}`;

export interface UseSandboxBridgeReturn {
  code: string;
  language: string;
  filename: string;
  activeTab: SandboxTab;
  hasCodeLoaded: boolean;
  loadCode: (newCode: string, newLanguage?: string, newFilename?: string) => void;
  updateCode: (newCode: string) => void;
  resetCode: () => void;
  setActiveTab: (tab: SandboxTab) => void;
}

export function useSandboxBridge(): UseSandboxBridgeReturn {
  const [code, setCode] = useState<string>(DEFAULT_STARTER_CODE);
  const [language, setLanguage] = useState<string>("typescript");
  const [filename, setFilename] = useState<string>("RaizenWidget.tsx");
  const [activeTab, setActiveTab] = useState<SandboxTab>("preview");
  const [hasCodeLoaded, setHasCodeLoaded] = useState<boolean>(true);

  const loadCode = useCallback(
    (newCode: string, newLanguage = "typescript", newFilename?: string) => {
      const cleanCode = newCode.trim();
      if (!cleanCode) return;

      setCode(cleanCode);
      setLanguage(newLanguage);
      setFilename(
        newFilename ||
          (newLanguage.toLowerCase().includes("react") ||
          newLanguage.toLowerCase().includes("tsx") ||
          newLanguage.toLowerCase().includes("jsx")
            ? "Component.tsx"
            : newLanguage.toLowerCase().includes("html")
            ? "index.html"
            : `snippet.${newLanguage}`)
      );
      setHasCodeLoaded(true);
      setActiveTab("preview");
    },
    []
  );

  const updateCode = useCallback((newCode: string) => {
    setCode(newCode);
  }, []);

  const resetCode = useCallback(() => {
    setCode(DEFAULT_STARTER_CODE);
    setLanguage("typescript");
    setFilename("RaizenWidget.tsx");
    setActiveTab("preview");
  }, []);

  return {
    code,
    language,
    filename,
    activeTab,
    hasCodeLoaded,
    loadCode,
    updateCode,
    resetCode,
    setActiveTab,
  };
}
