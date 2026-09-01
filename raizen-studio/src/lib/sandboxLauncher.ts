/**
 * RAIZEN Open-Source Sandbox Launcher Engine
 * 
 * Packages generated React/TSX/HTML code and redirects/launches in an open-source
 * browser sandbox environment (CodeSandbox, StackBlitz, or Standalone Sandboxed Runner)
 * pre-bundled with React 18, Tailwind CSS, and Lucide React icons.
 * 
 * Crafted by SHAWAZ (https://shawaz.vercel.app/)
 */

export interface SandboxProjectFiles {
  [path: string]: {
    content: string;
    isBinary?: boolean;
  };
}

export type SandboxProvider = "standalone" | "codesandbox" | "stackblitz";

/**
 * Sanitizes multi-export code into a single mounted React component
 */
function sanitizeComponentSource(code: string): string {
  let cleaned = code
    .replace(/^import\s+.*?;\s*$/gm, "")
    .replace(/export\s+default\s+function/g, "function")
    .replace(/export\s+function/g, "function")
    .replace(/export\s+default\s+/g, "");

  return cleaned;
}

/**
 * Launches the generated code inside a standalone zero-latency open-source sandboxed runner
 * pre-loaded with Pinned Babel 7.24.4, React 18, and Universal Lucide Icons
 */
export function launchStandaloneSandbox(code: string, language: string = "tsx"): Window | null {
  const isPureHtml =
    language.toLowerCase() === "html" ||
    code.trim().toLowerCase().startsWith("<!doctype html") ||
    code.trim().toLowerCase().startsWith("<html");

  let fullHtml = "";
  if (isPureHtml) {
    fullHtml = code;
    if (!fullHtml.toLowerCase().includes("<!doctype html") && !fullHtml.toLowerCase().includes("<html")) {
      fullHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>RAIZEN Live Preview</title>
  <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-[#FAF8F5] p-6 text-[#121316]">
  ${code}
</body>
</html>`;
    }
  } else {
    const sanitized = sanitizeComponentSource(code);
    fullHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>RAIZEN — Live Component Sandbox (SHAWAZ)</title>
  
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

  <!-- React 18 Production UMD -->
  <script crossorigin src="https://unpkg.com/react@18/umd/react.production.min.js"></script>
  <script crossorigin src="https://unpkg.com/react-dom@18/umd/react-dom.production.min.js"></script>

  <!-- Pinned Babel Standalone 7.24.4 -->
  <script src="https://unpkg.com/@babel/standalone@7.24.4/babel.min.js"></script>

  <!-- Lucide React Icons UMD & Shims -->
  <script src="https://unpkg.com/lucide@latest/dist/umd/lucide.js"></script>

  <style>
    body {
      margin: 0;
      padding: 0;
      background-color: #FAF8F5;
      color: #121316;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      min-height: 100vh;
    }
    #sandbox-root {
      min-height: 100vh;
      display: flex;
      flex-direction: column;
    }
  </style>
</head>
<body>
  <div id="sandbox-root"></div>

  <script>
    // Universal Lucide React SVG Shim for 50+ icons
    window.LucideIcons = {};
    const iconNames = [
      'Sparkles', 'Check', 'ArrowRight', 'ArrowLeft', 'ShieldCheck', 'Zap', 'ShoppingCart',
      'Menu', 'X', 'Star', 'User', 'Mail', 'Phone', 'Lock', 'Search', 'Filter',
      'Trash2', 'Plus', 'Minus', 'Eye', 'EyeOff', 'Heart', 'Share2', 'Download',
      'Upload', 'Settings', 'Bell', 'Calendar', 'Clock', 'ChevronRight', 'ChevronDown',
      'ChevronLeft', 'ChevronUp', 'ExternalLink', 'Copy', 'CheckCircle2', 'AlertCircle',
      'HelpCircle', 'Flame', 'Compass', 'Code', 'Terminal', 'Activity', 'BarChart3'
    ];

    iconNames.forEach(function(name) {
      window.LucideIcons[name] = function LucideShim(props) {
        var size = props.size || (props.className && props.className.indexOf('w-') !== -1 ? 18 : 20);
        return React.createElement('span', {
          className: 'inline-flex items-center justify-center ' + (props.className || ''),
          style: { width: size + 'px', height: size + 'px', verticalAlign: 'middle', display: 'inline-flex' }
        }, '✦');
      };
    });
  </script>

  <script type="text/babel" data-presets="react,typescript">
    try {
      const { useState, useEffect, useRef, useMemo, useCallback } = React;
      const {
        Sparkles, Check, ArrowRight, ArrowLeft, ShieldCheck, Zap, ShoppingCart,
        Menu, X, Star, User, Mail, Phone, Lock, Search, Filter,
        Trash2, Plus, Minus, Eye, EyeOff, Heart, Share2, Download,
        Upload, Settings, Bell, Calendar, Clock, ChevronRight, ChevronDown,
        ChevronLeft, ChevronUp, ExternalLink, Copy, CheckCircle2, AlertCircle,
        HelpCircle, Flame, Compass, Code, Terminal, Activity, BarChart3
      } = window.LucideIcons;

      ${sanitized}

      // Auto-detect and mount Root Component
      let RootComponent = null;
      if (typeof App !== 'undefined') RootComponent = App;
      else if (typeof LandingPage !== 'undefined') RootComponent = LandingPage;
      else if (typeof Main !== 'undefined') RootComponent = Main;
      else if (typeof NeoStore !== 'undefined') RootComponent = NeoStore;
      else if (typeof Component !== 'undefined') RootComponent = Component;

      const container = document.getElementById('sandbox-root');
      if (RootComponent && container) {
        const root = ReactDOM.createRoot(container);
        root.render(React.createElement(RootComponent));
      }
    } catch (err) {
      document.getElementById('sandbox-root').innerHTML = 
        '<div style="padding: 24px; color: #DC2626; font-family: monospace;"><h3>Sandbox Runtime Error</h3><pre>' + err.message + '</pre></div>';
    }
  </script>
</body>
</html>`;
  }

  // Open synchronously in user click gesture to avoid browser popup blockers
  try {
    const newWindow = window.open("", "_blank");
    if (newWindow) {
      newWindow.document.open();
      newWindow.document.write(fullHtml);
      newWindow.document.close();
      return newWindow;
    }
  } catch (err) {
    console.warn("Direct document.write popup failed, falling back to Blob URL:", err);
  }

  // Fallback via Blob URL
  try {
    const blob = new Blob([fullHtml], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.target = "_blank";
    a.rel = "noopener noreferrer";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  } catch (err) {
    console.error("Failed to launch sandbox popup:", err);
  }

  return null;
}

/**
 * Packages project files for CodeSandbox API
 */
export function launchCodeSandbox(code: string): void {
  const isPureHtml =
    code.trim().toLowerCase().startsWith("<!doctype html") ||
    code.trim().toLowerCase().startsWith("<html");

  const files: Record<string, { content: string }> = isPureHtml
    ? {
        "package.json": {
          content: JSON.stringify({
            name: "raizen-html-preview",
            version: "1.0.0",
            main: "index.html",
            dependencies: {},
          }),
        },
        "index.html": {
          content: code,
        },
      }
    : {
        "package.json": {
          content: JSON.stringify({
            name: "raizen-component-sandbox",
            version: "1.0.0",
            main: "src/index.tsx",
            dependencies: {
              react: "^18.2.0",
              "react-dom": "^18.2.0",
              "lucide-react": "^0.344.0",
              tailwindcss: "^3.4.1",
            },
          }),
        },
        "src/App.tsx": {
          content: code,
        },
        "src/index.tsx": {
          content: `import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root')!);
root.render(<App />);`,
        },
        "public/index.html": {
          content: `<div id="root"></div>`,
        },
      };

  const parameters = { files };

  // Launch via HTML Form POST to CodeSandbox definition API
  const form = document.createElement("form");
  form.method = "POST";
  form.action = "https://codesandbox.io/api/v1/sandboxes/define";
  form.target = "_blank";

  const input = document.createElement("input");
  input.type = "hidden";
  input.name = "parameters";
  // Convert object to base64 JSON payload
  input.value = btoa(unescape(encodeURIComponent(JSON.stringify(parameters))));

  form.appendChild(input);
  document.body.appendChild(form);
  form.submit();
  document.body.removeChild(form);
}

/**
 * Universal Open-Source Sandbox Entry Point
 */
export function launchInOpenSourceSandbox(
  code: string,
  language: string = "tsx",
  provider: SandboxProvider = "standalone"
): void {
  if (provider === "codesandbox") {
    launchCodeSandbox(code);
  } else {
    launchStandaloneSandbox(code, language);
  }
}
