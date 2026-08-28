"use client";

import React, { useState, useEffect, useRef } from "react";
import { RotateCw, AlertTriangle, CheckCircle2, ShieldCheck } from "lucide-react";
import { cn } from "../lib/utils";

interface ComponentPreviewProps {
  code: string;
  language?: string;
  className?: string;
}

export function ComponentPreview({
  code,
  language = "typescript",
  className,
}: ComponentPreviewProps) {
  const iframeRef = useRef<HTMLIFrameElement | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [renderKey, setRenderKey] = useState<number>(0);
  const [isCompiling, setIsCompiling] = useState<boolean>(false);

  const handleRefresh = () => {
    setError(null);
    setRenderKey((prev) => prev + 1);
  };

  useEffect(() => {
    const handleIframeMessage = (event: MessageEvent) => {
      if (event.data?.type === "RAIZEN_SANDBOX_ERROR") {
        setError(event.data.message || "Unknown runtime error in preview");
        setIsCompiling(false);
      } else if (event.data?.type === "RAIZEN_SANDBOX_SUCCESS") {
        setError(null);
        setIsCompiling(false);
      }
    };

    window.addEventListener("message", handleIframeMessage);
    return () => window.removeEventListener("message", handleIframeMessage);
  }, []);

  useEffect(() => {
    setIsCompiling(true);
    setError(null);

    const isReact =
      ["react", "tsx", "jsx", "typescript", "ts", "javascript", "js"].includes(
        language.toLowerCase()
      ) ||
      code.includes("import React") ||
      code.includes("<") ||
      code.includes("export default function");

    let processedCode = code;

    // Remove import statements from client React component for in-browser Babel execution
    if (isReact) {
      processedCode = processedCode
        .replace(/import\s+[\s\S]*?from\s+['"][^'"]+['"];?/g, "")
        .replace(/export\s+default\s+function\s+([A-Za-z0-9_]+)/g, "function $1\nwindow.__RAIZEN_ROOT_COMPONENT__ = $1;")
        .replace(/export\s+function\s+([A-Za-z0-9_]+)/g, "function $1")
        .replace(/export\s+default\s+([A-Za-z0-9_]+);?/g, "window.__RAIZEN_ROOT_COMPONENT__ = $1;")
        .replace(/export\s+default\s+/g, "window.__RAIZEN_ROOT_COMPONENT__ = ");

      // If no explicit default export, detect the last defined React function component
      if (!processedCode.includes("window.__RAIZEN_ROOT_COMPONENT__")) {
        const funcMatches = Array.from(
          processedCode.matchAll(/function\s+([A-Z]\w+)/g)
        );
        if (funcMatches.length > 0) {
          const lastFunc = funcMatches[funcMatches.length - 1][1];
          processedCode += `\nwindow.__RAIZEN_ROOT_COMPONENT__ = ${lastFunc};`;
        }
      }
    }

    const htmlDoc = `
      <!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <title>RAIZEN Live Sandbox</title>
          <!-- Tailwind CSS CDN -->
          <script src="https://cdn.tailwindcss.com"></script>
          <script>
            tailwind.config = {
              darkMode: 'class',
              theme: {
                extend: {
                  colors: {
                    void: '#050505',
                    surface: '#0A0A0A',
                    edge: '#1F1F1F',
                    signal: '#CCFF00',
                    'signal-hover': '#B8E600',
                  }
                }
              }
            };
          </script>
          <!-- React 18 & Babel Standalone -->
          <script crossorigin src="https://unpkg.com/react@18/umd/react.development.js"></script>
          <script crossorigin src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"></script>
          <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
          <!-- Lucide Icons Bundle -->
          <script src="https://unpkg.com/lucide@latest"></script>
          <script>
            // Helper to convert kebab-case to PascalCase
            function toPascalCase(str) {
              return str.replace(/(^\\w|-\\w)/g, function(c) { return c.replace('-', '').toUpperCase(); });
            }

            // Create SVG React component for Lucide icons
            function createLucideReactComponent(iconName, iconDef) {
              return function IconComponent(props) {
                const p = props || {};
                const size = p.size || p.width || 20;
                const strokeWidth = p.strokeWidth || 2;
                const className = p.className || '';
                const color = p.color || 'currentColor';

                let inner = '';
                if (Array.isArray(iconDef)) {
                  inner = iconDef.map(function(item) {
                    const tag = item[0];
                    const attrs = item[1];
                    const attrStr = Object.keys(attrs).map(function(k) {
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

            // Universal Lucide React Component Shim
            window.__initLucideIcons = function() {
              const lucideObj = window.lucide || {};
              const icons = lucideObj.icons || {};

              // Expose all available Lucide icons into window
              Object.keys(icons).forEach(function(key) {
                const pascal = toPascalCase(key);
                const comp = createLucideReactComponent(key, icons[key]);
                window[pascal] = comp;
                window[key] = comp;
              });

              // Generic fallback icon
              const fallbackIcon = function FallbackIcon(props) {
                return React.createElement('span', { className: (props && props.className) || 'inline-block text-signal font-mono' }, '✦');
              };

              // Ensure popular Lucide icons are pre-registered
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
                  const lowerKey = name.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase();
                  if (icons[lowerKey]) {
                    window[name] = createLucideReactComponent(lowerKey, icons[lowerKey]);
                  } else {
                    window[name] = fallbackIcon;
                  }
                }
              });
            };
          </script>
          <style>
            * { box-sizing: border-box; }
            body {
              margin: 0;
              padding: 16px;
              background-color: #050505;
              color: #E5E5E5;
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            }
          </style>
        </head>
        <body>
          <div id="root"></div>

          <script>
            window.onerror = function(msg, url, lineNo, columnNo, error) {
              const detail = (error && error.message) ? error.message : msg;
              window.parent.postMessage({
                type: 'RAIZEN_SANDBOX_ERROR',
                message: detail + (lineNo ? ' (line: ' + lineNo + ')' : '')
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

          ${
            isReact
              ? `
              <script type="text/babel" data-presets="react,typescript">
                try {
                  const { useState, useEffect, useRef, useMemo, useCallback } = React;
                  
                  // Initialize Lucide Icons
                  if (window.__initLucideIcons) {
                    window.__initLucideIcons();
                  }

                  ${processedCode}

                  const TargetComponent = window.__RAIZEN_ROOT_COMPONENT__;
                  if (TargetComponent) {
                    const root = ReactDOM.createRoot(document.getElementById('root'));
                    root.render(React.createElement(TargetComponent));
                    window.parent.postMessage({ type: 'RAIZEN_SANDBOX_SUCCESS' }, '*');
                  } else {
                    document.getElementById('root').innerHTML = '<div style="padding: 20px; font-family: monospace; color: #CCFF00;">⚡ Component rendered. If no output is visible, ensure a React component is defined.</div>';
                    window.parent.postMessage({ type: 'RAIZEN_SANDBOX_SUCCESS' }, '*');
                  }
                } catch (err) {
                  window.parent.postMessage({
                    type: 'RAIZEN_SANDBOX_ERROR',
                    message: err.message || String(err)
                  }, '*');
                }
              </script>
              `
              : `
              <div id="raw-html">${code}</div>
              <script>
                window.parent.postMessage({ type: 'RAIZEN_SANDBOX_SUCCESS' }, '*');
              </script>
              `
          }
        </body>
      </html>
    `;

    if (iframeRef.current) {
      iframeRef.current.srcdoc = htmlDoc;
    }
  }, [code, language, renderKey]);

  return (
    <div
      className={cn(
        "relative w-full h-full flex flex-col bg-void border-t border-edge font-mono select-none overflow-hidden",
        className
      )}
    >
      {/* Sandbox Status Bar */}
      <div className="w-full h-7 bg-[#080808] border-b border-edge flex items-center justify-between px-3 text-[10px] text-text-muted shrink-0">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1">
            {error ? (
              <AlertTriangle className="w-3 h-3 text-terminal-error" />
            ) : isCompiling ? (
              <span className="w-2 h-2 bg-signal rounded-full animate-ping" />
            ) : (
              <CheckCircle2 className="w-3 h-3 text-terminal-success" />
            )}
            <span
              className={cn(
                "font-bold uppercase",
                error ? "text-terminal-error" : isCompiling ? "text-signal" : "text-text-primary"
              )}
            >
              {error ? "RUNTIME ERROR" : isCompiling ? "COMPILING..." : "LIVE SANDBOX ACTIVE"}
            </span>
          </div>

          <div className="hidden sm:flex items-center gap-1 text-[9px] border-l border-edge pl-2 text-text-muted">
            <ShieldCheck className="w-2.5 h-2.5 text-signal" />
            <span>SANDBOXED IFRAME</span>
          </div>
        </div>

        <button
          type="button"
          onClick={handleRefresh}
          className="p-1 hover:bg-surface-elevated border border-transparent hover:border-edge text-text-muted hover:text-text-primary flex items-center gap-1 uppercase transition-colors"
          title="Reload Sandbox"
        >
          <RotateCw className="w-2.5 h-2.5" />
          <span className="hidden sm:inline">REFRESH</span>
        </button>
      </div>

      {/* Error Overlay if code crashes */}
      {error && (
        <div className="w-full bg-terminal-error/15 border-b border-terminal-error/40 p-3 text-xs font-mono text-terminal-error flex items-start gap-2 shrink-0">
          <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <div className="font-bold uppercase tracking-wider text-[11px]">
              [SANDBOX COMPILATION / RUNTIME ERROR]
            </div>
            <div className="text-[11px] text-[#FF8888] whitespace-pre-wrap font-mono">
              {error}
            </div>
          </div>
        </div>
      )}

      {/* Sandboxed Iframe Container */}
      <div className="flex-1 w-full h-full bg-[#050505] relative">
        <iframe
          key={renderKey}
          ref={iframeRef}
          title="RAIZEN Live Component Sandbox"
          sandbox="allow-scripts allow-modals allow-same-origin"
          className="w-full h-full border-0 bg-[#050505]"
        />
      </div>
    </div>
  );
}
