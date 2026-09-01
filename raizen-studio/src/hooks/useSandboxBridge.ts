"use client";

import { useState, useCallback } from "react";
import { SandboxTab } from "../components/SandboxHeader";

export const DEFAULT_STARTER_CODE = `function RaizenTelemetryWidget() {
  const [activeTab, setActiveTab] = React.useState('metrics');
  const [count, setCount] = React.useState(14);
  const [isLive, setIsLive] = React.useState(true);

  return (
    <div className="w-full max-w-xl mx-auto my-4 p-6 bg-white border border-[#E6E1D8] rounded-2xl font-sans text-xs text-[#121316] shadow-[0_4px_20px_rgba(0,0,0,0.04)]">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[#E6E1D8] pb-3.5 mb-4">
        <div className="flex items-center gap-2">
          <span className="text-[#EA580C] font-bold text-sm tracking-wide">✦ RAIZEN SANDBOX</span>
          <span className="px-2 py-0.5 bg-[#FFF2EB] text-[#9A3412] border border-[#EA580C]/20 text-[10px] font-bold rounded-full">
            v2.4.0
          </span>
        </div>
        <div className="flex items-center gap-1.5 text-[11px]">
          <span className="w-2 h-2 bg-emerald-500 rounded-full animate-ping"></span>
          <span className="text-emerald-700 font-bold">ONLINE</span>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 mb-4">
        <button
          onClick={() => setActiveTab('metrics')}
          className={'px-3.5 py-1.5 text-[11px] font-bold uppercase rounded-full transition-all ' + 
            (activeTab === 'metrics' 
              ? 'bg-[#EA580C] text-white shadow-sm' 
              : 'bg-[#FAF8F5] text-[#6B7280] border border-[#E6E1D8] hover:text-[#121316]')}
        >
          Telemetry
        </button>
        <button
          onClick={() => setActiveTab('creator')}
          className={'px-3.5 py-1.5 text-[11px] font-bold uppercase rounded-full transition-all ' + 
            (activeTab === 'creator' 
              ? 'bg-[#EA580C] text-white shadow-sm' 
              : 'bg-[#FAF8F5] text-[#6B7280] border border-[#E6E1D8] hover:text-[#121316]')}
        >
          Creator Info
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === 'metrics' ? (
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3.5 bg-[#FAF8F5] border border-[#E6E1D8] rounded-xl">
              <div className="text-[10px] font-bold text-[#6B7280] uppercase tracking-wider">GENERATION VELOCITY</div>
              <div className="text-xl font-bold text-[#EA580C] mt-1 font-mono">48.2 tok/s</div>
            </div>
            <div className="p-3.5 bg-[#FAF8F5] border border-[#E6E1D8] rounded-xl">
              <div className="text-[10px] font-bold text-[#6B7280] uppercase tracking-wider">T4 GPU MEMORY</div>
              <div className="text-xl font-bold text-[#121316] mt-1 font-mono">5.8 / 15.0 GB</div>
            </div>
          </div>

          <div className="p-3.5 bg-[#FAF8F5] border border-[#E6E1D8] rounded-xl flex items-center justify-between">
            <span className="font-bold text-[#374151]">INTERACTIVE TEST COUNTER</span>
            <div className="flex items-center gap-2">
              <button 
                onClick={() => setCount(c => c - 1)}
                className="w-7 h-7 bg-white hover:bg-[#FAF8F5] border border-[#E6E1D8] text-[#121316] font-bold rounded-lg transition-colors flex items-center justify-center"
              >
                -
              </button>
              <span className="text-[#EA580C] font-mono font-bold w-6 text-center text-sm">{count}</span>
              <button 
                onClick={() => setCount(c => c + 1)}
                className="w-7 h-7 bg-white hover:bg-[#FAF8F5] border border-[#E6E1D8] text-[#121316] font-bold rounded-lg transition-colors flex items-center justify-center"
              >
                +
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="p-4 bg-[#FAF8F5] border border-[#E6E1D8] rounded-xl space-y-2">
          <div className="text-[#EA580C] font-bold text-xs uppercase tracking-wider">ARCHITECT & CREATOR</div>
          <div className="text-[#121316] text-base font-bold">SHAWAZ</div>
          <p className="text-[#6B7280] text-xs leading-relaxed">
            Enterprise Full-Stack AI Engineer & Creator of the RAIZEN 7.61B Qwen2.5-Coder Model.
          </p>
          <a
            href="https://shawaz.vercel.app/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block mt-2 px-3.5 py-1.5 bg-[#EA580C] hover:bg-[#C2410C] text-white font-bold text-[10.5px] uppercase rounded-full transition-colors shadow-sm"
          >
            Visit Portfolio ↗
          </a>
        </div>
      )}

      {/* Footer */}
      <div className="mt-4 pt-3 border-t border-[#E6E1D8] flex items-center justify-between text-[10.5px] text-[#6B7280] font-mono">
        <span>MODEL: RAIZEN-7.61B-CODER</span>
        <span className="text-emerald-700 font-bold">STATUS: READY</span>
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
