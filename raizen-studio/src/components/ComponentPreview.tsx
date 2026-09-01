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
      code.includes("export default function") ||
      code.includes("function ");

    let cleanSource = code;
    if (isReact) {
      // 1. Strip import statements
      cleanSource = cleanSource.replace(/import\s+[\s\S]*?from\s+['"][^'"]+['"];?/g, "");
      // 2. Replace multiple export default / export function declarations
      cleanSource = cleanSource.replace(/export\s+default\s+function\s+([A-Za-z0-9_]+)/g, "function $1");
      cleanSource = cleanSource.replace(/export\s+function\s+([A-Za-z0-9_]+)/g, "function $1");
      cleanSource = cleanSource.replace(/export\s+default\s+([A-Za-z0-9_]+);?/g, "window.__RAIZEN_ROOT_COMPONENT__ = $1;");
      cleanSource = cleanSource.replace(/export\s+default\s+/g, "window.__RAIZEN_ROOT_COMPONENT__ = ");
      cleanSource = cleanSource.replace(/export\s*\{[^}]*\};?/g, "");

      // 3. Detect root component to mount
      const allFunctions = Array.from(cleanSource.matchAll(/function\s+([A-Z][A-Za-z0-9_]*)/g)).map(m => m[1]);
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
      } else if (allFunctions.length > 0) {
        rootName = allFunctions[allFunctions.length - 1];
      }

      if (rootName) {
        cleanSource += `\nwindow.__RAIZEN_ROOT_COMPONENT__ = ${rootName};`;
      }
    }

    const encodedSource = JSON.stringify(cleanSource);

    const htmlDoc = `
      <!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <title>RAIZEN Live Sandbox</title>
          <!-- Tailwind CSS CDN -->
          <script src="https://cdn.tailwindcss.com"></script>
          <!-- React 18 & Babel Standalone (v7.24.4 Stable) -->
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
              background-color: #0F1015;
              color: #E5E5E5;
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            }
          </style>
        </head>
        <body>
          <div id="root"></div>

          <script>
            // Helper to convert kebab-case to PascalCase
            function toPascalCase(str) {
              return str.replace(/(^\\w|-\\w)/g, function(c) { return c.replace('-', '').toUpperCase(); });
            }

            // Create SVG React component for Lucide icons
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

            // Universal Lucide React Component Shim
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
            window.onerror = function(msg, url, lineNo, columnNo, error) {
              var detail = (error && error.message) ? error.message : msg;
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
              <script>
                (function() {
                  try {
                    window.__initLucideIcons();
                    var rawSource = ${encodedSource};

                    // Compile with Babel Standalone
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
                    document.getElementById('root').innerHTML = '<div style="padding: 16px; font-family: monospace; color: #DC2626; background: #FEF2F2; border: 1px solid #FECACA;"><h4 style="margin: 0 0 8px 0; color: #DC2626;">[EXECUTION ERROR]</h4><pre style="margin: 0; white-space: pre-wrap; font-size: 11px;">' + errorMsg + '</pre></div>';
                    window.parent.postMessage({
                      type: 'RAIZEN_SANDBOX_ERROR',
                      message: errorMsg
                    }, '*');
                  }
                })();
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
        "relative w-full h-full flex flex-col bg-[#0F1015] border-t border-swiss-border font-mono select-none overflow-hidden",
        className
      )}
    >
      {/* Sandbox Status Bar */}
      <div className="w-full h-8 bg-white border-b border-swiss-border flex items-center justify-between px-3 text-[10px] text-swiss-muted shrink-0">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5">
            {error ? (
              <AlertTriangle className="w-3 h-3 text-red-600" />
            ) : isCompiling ? (
              <span className="w-2 h-2 bg-swiss-saffron rounded-full animate-ping" />
            ) : (
              <CheckCircle2 className="w-3 h-3 text-emerald-600" />
            )}
            <span
              className={cn(
                "font-bold uppercase font-frozen text-[10px]",
                error ? "text-red-600" : isCompiling ? "text-swiss-saffron" : "text-swiss-ink"
              )}
            >
              {error ? "RUNTIME ERROR" : isCompiling ? "COMPILING..." : "LIVE SANDBOX ACTIVE"}
            </span>
          </div>

          <div className="hidden sm:flex items-center gap-1 text-[9px] border-l border-swiss-border pl-2 text-swiss-muted font-mono">
            <ShieldCheck className="w-2.5 h-2.5 text-swiss-saffron" />
            <span>SANDBOXED IFRAME</span>
          </div>
        </div>

        <button
          type="button"
          onClick={handleRefresh}
          className="p-1 px-2 rounded-pill hover:bg-swiss-canvas border border-transparent hover:border-swiss-border text-swiss-muted hover:text-swiss-ink flex items-center gap-1 uppercase transition-colors font-mono font-bold"
          title="Reload Sandbox"
        >
          <RotateCw className="w-2.5 h-2.5" />
          <span className="hidden sm:inline">REFRESH</span>
        </button>
      </div>

      {/* Error Overlay if code crashes */}
      {error && (
        <div className="w-full bg-red-50 border-b border-red-200 p-3 text-xs font-mono text-red-700 flex items-start gap-2 shrink-0">
          <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5 text-red-600" />
          <div className="space-y-1">
            <div className="font-bold uppercase tracking-wider text-[11px] font-frozen">
              [SANDBOX COMPILATION / RUNTIME ERROR]
            </div>
            <div className="text-[11px] text-red-800 whitespace-pre-wrap font-mono">
              {error}
            </div>
          </div>
        </div>
      )}

      {/* Sandboxed Iframe Container */}
      <div className="flex-1 w-full h-full bg-[#0F1015] relative">
        <iframe
          key={renderKey}
          ref={iframeRef}
          title="RAIZEN Live Component Sandbox"
          sandbox="allow-scripts allow-modals allow-same-origin"
          className="w-full h-full border-0 bg-[#0F1015]"
        />
      </div>
    </div>
  );
}
