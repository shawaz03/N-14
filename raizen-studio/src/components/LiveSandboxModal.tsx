"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  RotateCw,
  Monitor,
  Tablet,
  Smartphone,
  Copy,
  Check,
  ShieldCheck,
  AlertTriangle,
  CheckCircle2,
} from "lucide-react";
import { cn } from "../lib/utils";

export type ViewportMode = "desktop" | "tablet" | "mobile";

export interface LiveSandboxModalProps {
  isOpen: boolean;
  onClose: () => void;
  code: string;
  language?: string;
  filename?: string;
}

export function LiveSandboxModal({
  isOpen,
  onClose,
  code,
  language = "tsx",
  filename,
}: LiveSandboxModalProps) {
  const [viewport, setViewport] = useState<ViewportMode>("desktop");
  const [copied, setCopied] = useState(false);
  const [renderKey, setRenderKey] = useState(0);
  const [isCompiling, setIsCompiling] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const iframeRef = useRef<HTMLIFrameElement | null>(null);

  const displayLang = (language || "tsx").toLowerCase();
  const displayFilename =
    filename ||
    (displayLang === "html"
      ? "index.html"
      : displayLang === "css"
      ? "styles.css"
      : displayLang === "javascript" || displayLang === "js"
      ? "script.js"
      : "Component.tsx");

  // Handle ESC key listener to dismiss modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  // Listen to sandbox telemetry messages from iframe
  useEffect(() => {
    const handleIframeMessage = (event: MessageEvent) => {
      if (event.data?.type === "RAIZEN_SANDBOX_ERROR") {
        setError(event.data.message || "Runtime error in preview execution");
        setIsCompiling(false);
      } else if (event.data?.type === "RAIZEN_SANDBOX_SUCCESS") {
        setError(null);
        setIsCompiling(false);
      }
    };

    window.addEventListener("message", handleIframeMessage);
    return () => window.removeEventListener("message", handleIframeMessage);
  }, []);

  // Iframe Live Compiler Effect (Supports Full HTML, Tailwind CSS & React/TSX with Babel Standalone)
  useEffect(() => {
    if (!isOpen) return;

    setIsCompiling(true);
    setError(null);

    const isFullHtml =
      code.trim().toLowerCase().startsWith("<!doctype html") ||
      code.trim().toLowerCase().startsWith("<html") ||
      code.includes("<html");

    const isReact =
      !isFullHtml &&
      (["react", "tsx", "jsx", "typescript", "ts", "javascript", "js"].includes(displayLang) ||
        code.includes("import React") ||
        code.includes("from 'lucide-react'") ||
        code.includes('from "lucide-react"') ||
        code.includes("<") ||
        code.includes("export default function") ||
        code.includes("function "));

    const telemetryScript = `
      <script>
        window.onerror = function(msg, url, lineNo, columnNo, err) {
          var detail = (err && err.message) ? err.message : msg;
          window.parent.postMessage({
            type: 'RAIZEN_SANDBOX_ERROR',
            message: detail + (lineNo ? ' (line ' + lineNo + ')' : '')
          }, '*');
          return false;
        };
        window.addEventListener('unhandledrejection', function(event) {
          window.parent.postMessage({
            type: 'RAIZEN_SANDBOX_ERROR',
            message: event.reason ? (event.reason.message || String(event.reason)) : 'Promise Rejection'
          }, '*');
        });
      </script>
    `;

    let compiledHtml = "";

    if (isFullHtml) {
      compiledHtml = code;
      // Inject Tailwind CSS CDN if not present in head
      if (!compiledHtml.includes("cdn.tailwindcss.com") && !compiledHtml.includes("tailwind")) {
        if (compiledHtml.includes("</head>")) {
          compiledHtml = compiledHtml.replace("</head>", '<script src="https://cdn.tailwindcss.com"></script></head>');
        } else if (compiledHtml.includes("<head>")) {
          compiledHtml = compiledHtml.replace("<head>", '<head><script src="https://cdn.tailwindcss.com"></script>');
        }
      }

      // Inject telemetry before </body> or at the end
      if (compiledHtml.includes("</body>")) {
        compiledHtml = compiledHtml.replace(
          "</body>",
          `${telemetryScript}<script>window.addEventListener('DOMContentLoaded', function() { window.parent.postMessage({ type: 'RAIZEN_SANDBOX_SUCCESS' }, '*'); });</script></body>`
        );
      } else {
        compiledHtml += `${telemetryScript}<script>window.addEventListener('DOMContentLoaded', function() { window.parent.postMessage({ type: 'RAIZEN_SANDBOX_SUCCESS' }, '*'); });</script>`;
      }
    } else if (isReact) {
      // 1. Sanitize React Source
      let cleanSource = code;
      cleanSource = cleanSource.replace(/import\s+[\s\S]*?from\s+['"][^'"]+['"];?/g, "");
      cleanSource = cleanSource.replace(/export\s+default\s+function\s+([A-Za-z0-9_]+)/g, "function $1");
      cleanSource = cleanSource.replace(/export\s+function\s+([A-Za-z0-9_]+)/g, "function $1");
      cleanSource = cleanSource.replace(/export\s+default\s+([A-Za-z0-9_]+);?/g, "window.__RAIZEN_ROOT_COMPONENT__ = $1;");
      cleanSource = cleanSource.replace(/export\s+default\s+/g, "window.__RAIZEN_ROOT_COMPONENT__ = ");
      cleanSource = cleanSource.replace(/export\s*\{[^}]*\};?/g, "");

      // 2. Auto-detect Root Component to mount
      const allFunctions = Array.from(cleanSource.matchAll(/function\s+([A-Z][A-Za-z0-9_]*)/g)).map((m) => m[1]);
      let rootName = null;
      if (allFunctions.includes("App")) {
        rootName = "App";
      } else if (allFunctions.includes("LandingPage")) {
        rootName = "LandingPage";
      } else if (allFunctions.includes("Main")) {
        rootName = "Main";
      } else if (allFunctions.includes("Page")) {
        rootName = "Page";
      } else if (allFunctions.includes("Dashboard")) {
        rootName = "Dashboard";
      } else if (allFunctions.includes("PricingMatrix")) {
        rootName = "PricingMatrix";
      } else if (allFunctions.includes("Component")) {
        rootName = "Component";
      } else if (allFunctions.length > 0) {
        rootName = allFunctions[allFunctions.length - 1];
      }

      if (rootName) {
        cleanSource += `\nwindow.__RAIZEN_ROOT_COMPONENT__ = ${rootName};`;
      }

      const encodedSource = JSON.stringify(cleanSource);

      compiledHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>RAIZEN Live React Sandbox</title>
  
  <!-- Tailwind CSS CDN -->
  <script src="https://cdn.tailwindcss.com"></script>
  <script>
    tailwind.config = {
      darkMode: 'class',
      theme: {
        extend: {
          colors: {
            brand: {
              saffron: '#EA580C',
              canvas: '#FAF8F5',
              ink: '#121316',
            }
          }
        }
      }
    };
  </script>

  <!-- React 18 & Babel Standalone 7.24.4 -->
  <script crossorigin src="https://unpkg.com/react@18/umd/react.production.min.js"></script>
  <script crossorigin src="https://unpkg.com/react-dom@18/umd/react-dom.production.min.js"></script>
  <script src="https://unpkg.com/@babel/standalone@7.24.4/babel.min.js"></script>
  <!-- Lucide Icons Bundle -->
  <script src="https://unpkg.com/lucide@latest"></script>

  <style>
    * { box-sizing: border-box; }
    body {
      margin: 0;
      padding: 16px;
      background-color: #FAF8F5;
      color: #121316;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      min-height: 100vh;
    }
  </style>

  ${telemetryScript}
</head>
<body>
  <div id="root"></div>

  <script>
    // Universal Lucide React SVG Generator & Shims
    function toPascalCase(str) {
      return str.replace(/(^\\w|-\\w)/g, function(c) { return c.replace('-', '').toUpperCase(); });
    }

    function createLucideReactComponent(iconName, iconDef) {
      return function IconComponent(props) {
        var p = props || {};
        var size = p.size || p.width || 20;
        var strokeWidth = p.strokeWidth || 2;
        var className = p.className || '';
        var color = p.color || 'currentColor';

        var inner = '';
        if (Array.isArray(iconDef)) {
          inner = iconDef.map(function(item) {
            var tag = item[0];
            var attrs = item[1];
            var attrStr = Object.keys(attrs).map(function(k) {
              return k + '="' + attrs[k] + '"';
            }).join(' ');
            return '<' + tag + ' ' + attrStr + '></' + tag + '>';
          }).join('');
        }

        return React.createElement('svg', {
          xmlns: 'http://www.w3.org/2000/svg',
          width: size,
          height: size,
          viewBox: '0 0 24 24',
          fill: 'none',
          stroke: color,
          strokeWidth: strokeWidth,
          strokeLinecap: 'round',
          strokeLinejoin: 'round',
          className: className,
          dangerouslySetInnerHTML: { __html: inner }
        });
      };
    }

    window.__initLucideIcons = function() {
      var lucideObj = window.lucide || {};
      var icons = lucideObj.icons || {};

      Object.keys(icons).forEach(function(key) {
        var pascal = toPascalCase(key);
        var comp = createLucideReactComponent(key, icons[key]);
        window[pascal] = comp;
        window[key] = comp;
      });

      var fallbackIcon = function FallbackIcon(props) {
        return React.createElement('span', { className: (props && props.className) || 'inline-block text-orange-500 font-mono' }, '✦');
      };

      [
        'Sparkles', 'Check', 'ArrowRight', 'ArrowLeft', 'ShieldCheck', 'Zap', 'Code', 'Eye',
        'Copy', 'RotateCcw', 'Maximize2', 'Minimize2', 'FileCode', 'Download', 'MessageSquare',
        'Columns', 'Code2', 'Cpu', 'Terminal', 'Play', 'Pause', 'Trash', 'Settings', 'Search',
        'Menu', 'X', 'ExternalLink', 'Github', 'ChevronRight', 'ChevronDown', 'Star', 'User',
        'ShoppingCart', 'Heart', 'Package', 'CreditCard', 'Activity', 'Sliders', 'Layers',
        'Globe', 'Lock', 'Mail', 'Phone', 'MapPin', 'Calendar', 'Clock', 'Bell', 'AlertTriangle',
        'Info', 'CheckCircle2', 'Plus', 'Minus', 'RefreshCw'
      ].forEach(function(name) {
        if (!window[name]) {
          var lowerKey = name.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase();
          if (icons[lowerKey]) {
            window[name] = createLucideReactComponent(lowerKey, icons[lowerKey]);
          } else {
            window[name] = fallbackIcon;
          }
        }
      });
    };
  </script>

  <script>
    (function() {
      try {
        window.__initLucideIcons();
        var rawSource = ${encodedSource};

        // Compile TSX/React with Babel Standalone
        var compiled = Babel.transform(rawSource, {
          presets: ['react', 'typescript'],
          filename: 'component.tsx'
        }).code;

        // Execute compiled code with React hooks in scope
        var executeFn = new Function(
          'React', 'ReactDOM', 'useState', 'useEffect', 'useRef', 'useMemo', 'useCallback',
          compiled
        );

        executeFn(
          React, ReactDOM,
          React.useState, React.useEffect, React.useRef, React.useMemo, React.useCallback
        );

        var TargetComponent = window.__RAIZEN_ROOT_COMPONENT__;
        if (TargetComponent) {
          var root = ReactDOM.createRoot(document.getElementById('root'));
          root.render(React.createElement(TargetComponent));
          window.parent.postMessage({ type: 'RAIZEN_SANDBOX_SUCCESS' }, '*');
        } else {
          document.getElementById('root').innerHTML = '<div style="padding: 20px; font-family: monospace; color: #EA580C;">⚡ Component evaluated. No React component found to mount.</div>';
          window.parent.postMessage({ type: 'RAIZEN_SANDBOX_SUCCESS' }, '*');
        }
      } catch (err) {
        var errorMsg = err && (err.message || String(err));
        document.getElementById('root').innerHTML = '<div style="padding: 16px; font-family: monospace; color: #DC2626; background: #FEF2F2; border: 1px solid #FECACA;"><h4 style="margin: 0 0 8px 0; color: #DC2626;">[REACT COMPILATION ERROR]</h4><pre style="margin: 0; white-space: pre-wrap; font-size: 11px;">' + errorMsg + '</pre></div>';
        window.parent.postMessage({
          type: 'RAIZEN_SANDBOX_ERROR',
          message: errorMsg
        }, '*');
      }
    })();
  </script>
</body>
</html>`;
    } else {
      // HTML Fragment / Tailwind UI snippet
      compiledHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>RAIZEN Live Preview</title>
  <!-- Tailwind CSS CDN -->
  <script src="https://cdn.tailwindcss.com"></script>
  <script>
    tailwind.config = {
      darkMode: 'class',
      theme: {
        extend: {
          colors: {
            brand: {
              saffron: '#EA580C',
              canvas: '#FAF8F5',
              ink: '#121316',
            }
          }
        }
      }
    };
  </script>
  <style>
    * { box-sizing: border-box; }
    body {
      margin: 0;
      padding: 20px;
      background-color: #FAF8F5;
      color: #121316;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      min-height: 100vh;
    }
  </style>
  ${telemetryScript}
</head>
<body>
  ${code}
  <script>
    window.addEventListener('DOMContentLoaded', function() {
      window.parent.postMessage({ type: 'RAIZEN_SANDBOX_SUCCESS' }, '*');
    });
  </script>
</body>
</html>`;
    }

    if (iframeRef.current) {
      iframeRef.current.srcdoc = compiledHtml;
    }
  }, [code, language, displayLang, renderKey, isOpen]);

  const handleRefresh = () => {
    setError(null);
    setRenderKey((prev) => prev + 1);
  };

  const handleCopyCode = () => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 select-none font-sans">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.98, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.98, y: 12 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
            className="relative w-full max-w-6xl h-[92vh] max-h-[900px] bg-white border border-swiss-border rounded-2xl text-swiss-ink shadow-swiss-lg z-10 flex flex-col overflow-hidden"
          >
            {/* 1. Modal Top Bar (Swiss Editorial Design + Responsive Viewport Controls) */}
            <div className="flex items-center justify-between px-4 sm:px-6 py-3 bg-white border-b border-swiss-border shrink-0 gap-2">
              {/* Left: Brand Tag, Filename, Language & Status Indicator */}
              <div className="flex items-center gap-3 shrink-0">
                <div className="w-6 h-6 rounded-md bg-swiss-saffron-tint text-swiss-saffron-text font-extrabold flex items-center justify-center font-frozen text-xs shrink-0">
                  ✦
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-extrabold text-xs sm:text-sm text-swiss-ink tracking-wider font-frozen uppercase truncate max-w-[140px] sm:max-w-xs">
                    {displayFilename}
                  </span>
                  <span className="text-[9.5px] uppercase font-mono px-2 py-0.5 rounded-full bg-swiss-canvas border border-swiss-border text-swiss-muted font-bold">
                    {displayLang}
                  </span>
                  {/* Status Indicator */}
                  <div className="hidden sm:flex items-center gap-1.5 pl-1">
                    {error ? (
                      <span className="inline-flex items-center gap-1 text-[9.5px] font-bold px-2 py-0.5 rounded-pill bg-red-50 text-red-700 border border-red-200 font-frozen tracking-wide">
                        <AlertTriangle className="w-3 h-3 text-red-600" />
                        <span>RUNTIME ERROR</span>
                      </span>
                    ) : isCompiling ? (
                      <span className="inline-flex items-center gap-1 text-[9.5px] font-bold px-2 py-0.5 rounded-pill bg-amber-50 text-amber-700 border border-amber-200 font-frozen tracking-wide">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-ping" />
                        <span>COMPILING...</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[9.5px] font-bold px-2 py-0.5 rounded-pill bg-emerald-50 text-emerald-700 border border-emerald-200 font-frozen tracking-wide">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        <span>LIVE SANDBOX</span>
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Center: Interactive 3-Way Device Viewport Switcher */}
              <div className="flex items-center gap-1 p-1 bg-swiss-canvas border border-swiss-border rounded-pill text-xs shrink-0">
                <button
                  type="button"
                  onClick={() => setViewport("desktop")}
                  className={cn(
                    "flex items-center gap-1.5 px-3 py-1 rounded-pill font-bold transition-all text-[11px] font-frozen tracking-wide",
                    viewport === "desktop"
                      ? "bg-white text-swiss-ink shadow-sm border border-swiss-border/60"
                      : "text-swiss-muted hover:text-swiss-ink"
                  )}
                  title="Desktop Viewport (100% Fluid)"
                >
                  <Monitor className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Desktop</span>
                </button>
                <button
                  type="button"
                  onClick={() => setViewport("tablet")}
                  className={cn(
                    "flex items-center gap-1.5 px-3 py-1 rounded-pill font-bold transition-all text-[11px] font-frozen tracking-wide",
                    viewport === "tablet"
                      ? "bg-white text-swiss-ink shadow-sm border border-swiss-border/60"
                      : "text-swiss-muted hover:text-swiss-ink"
                  )}
                  title="Tablet Viewport (768px - iPad)"
                >
                  <Tablet className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Tablet</span>
                </button>
                <button
                  type="button"
                  onClick={() => setViewport("mobile")}
                  className={cn(
                    "flex items-center gap-1.5 px-3 py-1 rounded-pill font-bold transition-all text-[11px] font-frozen tracking-wide",
                    viewport === "mobile"
                      ? "bg-white text-swiss-ink shadow-sm border border-swiss-border/60"
                      : "text-swiss-muted hover:text-swiss-ink"
                  )}
                  title="Mobile Viewport (375px - iPhone)"
                >
                  <Smartphone className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Mobile</span>
                </button>
              </div>

              {/* Right: Actions & Close */}
              <div className="flex items-center gap-1.5 shrink-0">
                {/* Refresh Render */}
                <button
                  type="button"
                  onClick={handleRefresh}
                  className="p-1.5 text-swiss-muted hover:text-swiss-ink hover:bg-swiss-canvas border border-transparent hover:border-swiss-border rounded-full transition-colors"
                  title="Refresh Sandbox Render"
                >
                  <RotateCw className={cn("w-4 h-4", isCompiling && "animate-spin text-swiss-saffron")} />
                </button>

                {/* Copy Code */}
                <button
                  type="button"
                  onClick={handleCopyCode}
                  className="p-1.5 text-swiss-muted hover:text-swiss-ink hover:bg-swiss-canvas border border-transparent hover:border-swiss-border rounded-full transition-colors"
                  title={copied ? "Code Copied!" : "Copy Code"}
                >
                  {copied ? (
                    <Check className="w-4 h-4 text-emerald-600" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </button>

                {/* Close Button */}
                <button
                  type="button"
                  onClick={onClose}
                  className="text-swiss-muted hover:text-swiss-ink p-1.5 rounded-full hover:bg-swiss-canvas transition-colors ml-1"
                  title="Close Modal (Esc)"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Error Banner if Present */}
            {error && (
              <div className="px-6 py-2 bg-red-50 border-b border-red-200 text-red-700 text-xs flex items-center justify-between font-mono shrink-0">
                <span>⚠ {error}</span>
                <button onClick={() => setError(null)} className="underline hover:text-red-900 text-[11px]">
                  Dismiss
                </button>
              </div>
            )}

            {/* 2. Modal Body Workspace with Responsive Device Frame */}
            <div className="flex-1 bg-swiss-canvas/80 relative overflow-hidden flex flex-col items-center justify-center p-2 sm:p-4 md:p-6">
              {/* Active Viewport Frame with Smooth Animation */}
              <div
                className={cn(
                  "h-full bg-white border border-swiss-border rounded-xl shadow-swiss-md transition-all duration-300 ease-out flex flex-col overflow-hidden relative",
                  viewport === "desktop" && "w-full",
                  viewport === "tablet" && "w-[768px] max-w-full rounded-2xl shadow-swiss-lg border-2 border-swiss-border-card",
                  viewport === "mobile" && "w-[375px] max-w-full rounded-3xl shadow-swiss-lg border-2 border-swiss-border-card"
                )}
              >
                {/* Device Notch / Dimension Header for Tablet & Mobile Frames */}
                {viewport !== "desktop" && (
                  <div className="w-full py-1.5 px-4 bg-swiss-canvas border-b border-swiss-border flex items-center justify-between text-[9.5px] text-swiss-muted font-mono shrink-0">
                    <span className="font-bold font-frozen text-swiss-ink">
                      {viewport === "tablet" ? "iPad Pro Frame (768px)" : "iPhone 15 Pro Frame (375px)"}
                    </span>
                    <span className="text-[9px]">
                      {viewport === "tablet" ? "768 × 1024" : "375 × 667"}
                    </span>
                  </div>
                )}

                {/* Live Sandbox Iframe Container */}
                <div className="flex-1 w-full h-full relative overflow-hidden bg-white">
                  <iframe
                    ref={iframeRef}
                    sandbox="allow-scripts allow-forms allow-modals allow-same-origin"
                    className="w-full h-full border-0 bg-white"
                    title="RAIZEN Live Preview"
                  />
                </div>
              </div>
            </div>

            {/* 3. Modal Footer Bar */}
            <div className="px-4 sm:px-6 py-2.5 bg-swiss-canvas border-t border-swiss-border flex items-center justify-between text-[11px] text-swiss-muted font-frozen shrink-0">
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-swiss-saffron" />
                <span>Zero-Latency In-App Preview (Bypass Popup Blockers)</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-[10px] text-swiss-muted font-mono">
                  Viewport: <b className="text-swiss-ink uppercase font-frozen">{viewport}</b>
                </span>
                <span className="text-swiss-ink font-bold font-frozen tracking-wider">
                  RAIZEN STUDIO
                </span>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
