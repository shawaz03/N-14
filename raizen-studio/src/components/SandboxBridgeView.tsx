"use client";

import React, { useState } from "react";
import {
  Play,
  ExternalLink,
  Code2,
  Zap,
  Globe,
  Copy,
  Check,
} from "lucide-react";
import { launchInOpenSourceSandbox } from "../lib/sandboxLauncher";
import { cn } from "../lib/utils";

interface StarterTemplate {
  id: string;
  title: string;
  category: "frontend" | "dashboard" | "ecommerce" | "python";
  description: string;
  tags: string[];
  language: string;
  code: string;
}

const STARTER_TEMPLATES: StarterTemplate[] = [
  {
    id: "saas-pricing",
    title: "SaaS Pricing Matrix & Hero",
    category: "frontend",
    description: "Modern 3-tier pricing matrix with monthly/yearly billing toggle, feature pills, and glowing cards.",
    tags: ["#React", "#Tailwind", "#FramerMotion", "#UI"],
    language: "tsx",
    code: `import React, { useState } from "react";
import { Check, Zap, Sparkles, ArrowRight } from "lucide-react";

export default function PricingMatrix() {
  const [annual, setAnnual] = useState(true);

  const tiers = [
    { name: "Starter", price: annual ? 19 : 29, desc: "For individual builders", features: ["1 GPU Engine", "32k Context Window", "Community Support"] },
    { name: "Pro Studio", price: annual ? 49 : 69, desc: "For professional developers", popular: true, features: ["Unlimited GPU Sessions", "Zero-Latency Sandboxes", "Custom Personas", "Priority SSE Stream"] },
    { name: "Enterprise", price: annual ? 199 : 249, desc: "For scaling engineering teams", features: ["Dedicated Private Node", "Custom LoRA Adapters", "99.99% SLA", "24/7 Dedicated Support"] }
  ];

  return (
    <div className="min-h-screen bg-[#0F1015] text-white p-8 flex flex-col items-center justify-center font-sans">
      <div className="text-center max-w-2xl mx-auto space-y-4 mb-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/30 text-orange-400 text-xs font-bold uppercase">
          <Sparkles className="w-3.5 h-3.5" /> Next-Gen AI Pricing
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">Flexible compute for every builder</h1>
        <p className="text-gray-400 text-sm">Scale your AI coding workflows from solo prototypes to enterprise clusters.</p>

        {/* Toggle */}
        <div className="inline-flex items-center gap-3 bg-white/5 border border-white/10 p-1 rounded-full text-xs font-bold">
          <button onClick={() => setAnnual(false)} className={\`px-4 py-1.5 rounded-full transition-all \${!annual ? "bg-orange-600 text-white" : "text-gray-400"}\`}>Monthly</button>
          <button onClick={() => setAnnual(true)} className={\`px-4 py-1.5 rounded-full transition-all \${annual ? "bg-orange-600 text-white" : "text-gray-400"}\`}>Annual (20% OFF)</button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl w-full">
        {tiers.map((tier) => (
          <div key={tier.name} className={\`relative p-6 rounded-2xl border flex flex-col justify-between transition-all hover:scale-105 \${tier.popular ? "bg-[#181920] border-orange-500 shadow-2xl shadow-orange-500/20 ring-1 ring-orange-500" : "bg-[#14151B] border-white/10 hover:border-white/20"}\`}>
            {tier.popular && <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 bg-orange-500 text-white text-[10px] font-extrabold uppercase rounded-full tracking-wider">Most Popular</span>}
            <div>
              <h3 className="text-lg font-bold">{tier.name}</h3>
              <p className="text-xs text-gray-400 mt-1">{tier.desc}</p>
              <div className="my-6">
                <span className="text-4xl font-extrabold">$\${tier.price}</span>
                <span className="text-xs text-gray-400">/month</span>
              </div>
              <ul className="space-y-2.5 text-xs text-gray-300">
                {tier.features.map((f) => (
                  <li key={f} className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-orange-400 shrink-0" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
            </div>
            <button className={\`w-full mt-8 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all \${tier.popular ? "bg-orange-600 hover:bg-orange-500 text-white shadow-lg shadow-orange-600/30" : "bg-white/10 hover:bg-white/20 text-white"}\`}>
              <span>Get Started</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}`,
  },
  {
    id: "analytics-dashboard",
    title: "Precision Telemetry Analytics HUD",
    category: "dashboard",
    description: "Live cluster metrics HUD with real-time token throughput gauge, latency ping, and active worker nodes.",
    tags: ["#React", "#Tailwind", "#Telemetry", "#HUD"],
    language: "tsx",
    code: `import React, { useState, useEffect } from "react";
import { Cpu, Zap, Activity, ShieldCheck, Server, Radio } from "lucide-react";

export default function TelemetryDashboard() {
  const [tokens, setTokens] = useState(14820);
  const [speed, setSpeed] = useState(128.4);
  const [vram, setVram] = useState(5.2);

  useEffect(() => {
    const interval = setInterval(() => {
      setTokens(prev => prev + Math.floor(Math.random() * 40));
      setSpeed(120 + Math.random() * 15);
      setVram(5.1 + Math.random() * 0.3);
    }, 1500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-[#0C0D12] text-white p-8 font-mono">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 rounded-full bg-emerald-500 animate-ping" />
            <h1 className="text-lg font-bold tracking-wider">RAIZEN CLUSTER HUD // NODE T4-01</h1>
          </div>
          <span className="text-xs px-2.5 py-1 bg-white/5 border border-white/10 text-emerald-400 rounded">LIVE STREAMING</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 rounded-xl bg-[#14151D] border border-white/10">
            <div className="flex items-center justify-between text-xs text-gray-400">
              <span>GENERATION SPEED</span>
              <Zap className="w-4 h-4 text-orange-500" />
            </div>
            <div className="text-2xl font-bold mt-2 text-white">{speed.toFixed(1)} <span className="text-xs text-gray-400">tok/s</span></div>
          </div>

          <div className="p-4 rounded-xl bg-[#14151D] border border-white/10">
            <div className="flex items-center justify-between text-xs text-gray-400">
              <span>TOTAL TOKENS</span>
              <Activity className="w-4 h-4 text-emerald-500" />
            </div>
            <div className="text-2xl font-bold mt-2 text-white">{tokens.toLocaleString()} <span className="text-xs text-gray-400">tokens</span></div>
          </div>

          <div className="p-4 rounded-xl bg-[#14151D] border border-white/10">
            <div className="flex items-center justify-between text-xs text-gray-400">
              <span>TESLA T4 VRAM</span>
              <Cpu className="w-4 h-4 text-blue-500" />
            </div>
            <div className="text-2xl font-bold mt-2 text-white">{vram.toFixed(2)} <span className="text-xs text-gray-400">/ 15.0 GB</span></div>
          </div>
        </div>

        <div className="p-5 rounded-xl bg-[#14151D] border border-white/10 space-y-3">
          <h2 className="text-xs font-bold text-gray-400 uppercase tracking-widest">Active Model Pipeline</h2>
          <div className="p-3 bg-black/40 border border-white/5 rounded text-xs space-y-1.5 text-gray-300">
            <p><strong className="text-orange-400">Model:</strong> RAIZEN 7.61B (Qwen2.5-Coder base)</p>
            <p><strong className="text-blue-400">Quantization:</strong> 4-Bit NormalFloat (NF4)</p>
            <p><strong className="text-emerald-400">Fine-Tuning:</strong> QLoRA Rank 64 / Alpha 16</p>
            <p><strong className="text-purple-400">Architect:</strong> SHAWAZ (https://shawaz.vercel.app/)</p>
          </div>
        </div>
      </div>
    </div>
  );
}`,
  },
  {
    id: "ecommerce-storefront",
    title: "E-Commerce Storefront & Cart Drawer",
    category: "ecommerce",
    description: "Interactive product gallery with search filters, dynamic star ratings, and flyout sliding cart drawer.",
    tags: ["#React", "#Tailwind", "#Lucide", "#Store"],
    language: "tsx",
    code: `import React, { useState } from "react";
import { ShoppingBag, Star, Plus, Trash2, X, ArrowRight } from "lucide-react";

export default function Storefront() {
  const [cart, setCart] = useState<{ id: number; title: string; price: number }[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  const products = [
    { id: 1, title: "Obsidian Neural Mechanical Keyboard", price: 189, rating: 4.9, img: "⌨️" },
    { id: 2, title: "Precision Wireless Studio Mouse", price: 99, rating: 4.8, img: "🖱️" },
    { id: 3, title: "4K Quantum HDR Ultrawide Monitor", price: 649, rating: 5.0, img: "🖥️" },
  ];

  const addToCart = (p: typeof products[0]) => {
    setCart(prev => [...prev, p]);
    setIsCartOpen(true);
  };

  const totalPrice = cart.reduce((sum, item) => sum + item.price, 0);

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans p-6">
      <header className="max-w-5xl mx-auto flex items-center justify-between border-b pb-4">
        <h1 className="text-xl font-extrabold text-orange-600 tracking-wider">RAIZEN GEAR // STUDIO STORE</h1>
        <button onClick={() => setIsCartOpen(true)} className="relative p-2 bg-white border rounded-full shadow-sm hover:shadow">
          <ShoppingBag className="w-5 h-5 text-gray-700" />
          {cart.length > 0 && <span className="absolute -top-1 -right-1 w-5 h-5 bg-orange-600 text-white rounded-full text-xs font-bold flex items-center justify-center">{cart.length}</span>}
        </button>
      </header>

      <main className="max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-6 mt-8">
        {products.map(p => (
          <div key={p.id} className="bg-white border rounded-2xl p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
            <div className="text-5xl text-center py-6 bg-gray-50 rounded-xl mb-4">{p.img}</div>
            <div>
              <h3 className="font-bold text-sm text-gray-800">{p.title}</h3>
              <div className="flex items-center gap-1 my-2 text-xs text-amber-500"><Star className="w-3.5 h-3.5 fill-current" /> <span>{p.rating}</span></div>
              <div className="text-lg font-extrabold text-gray-900">$\${p.price}</div>
            </div>
            <button onClick={() => addToCart(p)} className="mt-4 w-full py-2 bg-orange-600 hover:bg-orange-700 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1 transition-all">
              <Plus className="w-4 h-4" /> Add to Cart
            </button>
          </div>
        ))}
      </main>

      {/* Cart Drawer */}
      {isCartOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/40 backdrop-blur-sm">
          <div className="w-full max-w-sm bg-white h-full p-6 shadow-2xl flex flex-col justify-between animate-in slide-in-from-right">
            <div>
              <div className="flex items-center justify-between border-b pb-3">
                <h2 className="font-bold text-base">Your Cart ({cart.length})</h2>
                <button onClick={() => setIsCartOpen(false)}><X className="w-5 h-5 text-gray-500" /></button>
              </div>
              <div className="space-y-3 mt-4 overflow-y-auto max-h-[60vh]">
                {cart.length === 0 ? <p className="text-xs text-gray-400 text-center py-8">Cart is currently empty.</p> : cart.map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl text-xs">
                    <span className="font-bold truncate max-w-[180px]">{item.title}</span>
                    <span className="font-extrabold text-orange-600">$\${item.price}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="border-t pt-4 space-y-3">
              <div className="flex items-center justify-between font-extrabold text-base">
                <span>Total:</span>
                <span>$\${totalPrice}</span>
              </div>
              <button disabled={cart.length === 0} className="w-full py-3 bg-orange-600 disabled:opacity-50 text-white font-bold rounded-xl text-xs uppercase tracking-wider flex items-center justify-center gap-2">
                <span>Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}`,
  },
];

interface SandboxBridgeViewProps {
  onRunInSandbox?: (code: string, language: string) => void;
  className?: string;
}

export function SandboxBridgeView({
  onRunInSandbox,
  className,
}: SandboxBridgeViewProps) {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleLaunchBlank = (type: "standalone" | "codesandbox" | "stackblitz") => {
    const blankStarter = `import React from "react";
import { Sparkles, Terminal } from "lucide-react";

export default function App() {
  return (
    <div className="min-h-screen bg-[#0F1015] text-white flex flex-col items-center justify-center p-6 font-sans">
      <div className="p-8 bg-[#181920] border border-orange-500/30 rounded-2xl max-w-md w-full text-center space-y-4 shadow-2xl">
        <div className="w-12 h-12 rounded-full bg-orange-500/20 text-orange-400 mx-auto flex items-center justify-center text-xl font-bold">✦</div>
        <h1 className="text-xl font-extrabold text-white">RAIZEN Sandbox Runner</h1>
        <p className="text-xs text-gray-400">Live browser sandbox environment with React 18, Tailwind CSS, and Lucide icons pre-configured.</p>
        <button className="px-4 py-2 bg-orange-600 hover:bg-orange-500 text-white text-xs font-bold rounded-full uppercase tracking-wider transition-all">Ready to Code</button>
      </div>
    </div>
  );
};`;

    launchInOpenSourceSandbox(blankStarter, "tsx", type);
    if (onRunInSandbox) {
      onRunInSandbox(blankStarter, "tsx");
    }
  };

  const handleRunTemplate = (template: StarterTemplate) => {
    launchInOpenSourceSandbox(template.code, template.language, "standalone");
    if (onRunInSandbox) {
      onRunInSandbox(template.code, template.language);
    }
  };

  const handleCopyTemplateCode = (template: StarterTemplate) => {
    navigator.clipboard.writeText(template.code);
    setCopiedId(template.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className={cn("w-full h-full flex flex-col bg-swiss-canvas overflow-hidden select-none", className)}>
      {/* 1. Top Header Bar */}
      <div className="px-6 py-5 bg-white border-b border-swiss-border flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-swiss-saffron-tint text-swiss-saffron flex items-center justify-center font-frozen text-xs">
            ✦
          </div>
          <div>
            <h1 className="text-base sm:text-lg font-bold text-swiss-ink font-frozen uppercase tracking-wider">
              Sandbox Bridge & Launchpad
            </h1>
            <p className="text-xs text-swiss-muted font-mono">
              Multi-provider zero-latency browser execution runners & starter templates
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 font-mono text-xs">
          <span className="px-3 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-pill font-bold">
            ✓ 100% Client-Side Isolated
          </span>
        </div>
      </div>

      {/* 2. Main Scrollable Body */}
      <div className="flex-1 w-full overflow-y-auto p-4 sm:p-6 select-text">
        <div className="max-w-5xl mx-auto space-y-6">
          {/* Section A: 3 Multi-Provider Sandbox Engines */}
        <div className="space-y-3">
          <h2 className="text-xs font-bold text-swiss-muted uppercase tracking-widest font-frozen px-1">
            Execution Providers
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Provider 1: Standalone Zero-Latency */}
            <div className="p-5 bg-white border border-swiss-border rounded-2xl shadow-swiss flex flex-col justify-between gap-4">
              <div className="space-y-2">
                <div className="w-8 h-8 rounded-lg bg-swiss-saffron-tint text-swiss-saffron flex items-center justify-center">
                  <Zap className="w-4 h-4" />
                </div>
                <h3 className="font-bold text-sm text-swiss-ink font-frozen tracking-wide">
                  Standalone Sandbox
                </h3>
                <p className="text-xs text-swiss-muted leading-relaxed">
                  Zero-latency offline sandbox with React 18, Babel standalone, Tailwind CDN, and 50+ Lucide icons.
                </p>
              </div>

              <button
                type="button"
                onClick={() => handleLaunchBlank("standalone")}
                className="w-full py-2 bg-swiss-saffron hover:bg-swiss-saffron-hover text-white text-xs font-bold rounded-pill uppercase tracking-wider transition-all font-frozen flex items-center justify-center gap-1 shadow-swiss-saffron"
              >
                <Play className="w-3 h-3 fill-current" />
                <span>Launch Standalone</span>
              </button>
            </div>

            {/* Provider 2: CodeSandbox Bridge */}
            <div className="p-5 bg-white border border-swiss-border rounded-2xl shadow-swiss flex flex-col justify-between gap-4">
              <div className="space-y-2">
                <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                  <Code2 className="w-4 h-4" />
                </div>
                <h3 className="font-bold text-sm text-swiss-ink font-frozen tracking-wide">
                  CodeSandbox Cloud
                </h3>
                <p className="text-xs text-swiss-muted leading-relaxed">
                  Export components into full cloud IDEs with package.json, TypeScript config, and npm dependencies.
                </p>
              </div>

              <button
                type="button"
                onClick={() => handleLaunchBlank("codesandbox")}
                className="w-full py-2 bg-white hover:bg-swiss-canvas border border-swiss-border text-swiss-ink text-xs font-bold rounded-pill uppercase tracking-wider transition-all font-frozen flex items-center justify-center gap-1"
              >
                <ExternalLink className="w-3 h-3" />
                <span>Open CodeSandbox</span>
              </button>
            </div>

            {/* Provider 3: StackBlitz WebContainers */}
            <div className="p-5 bg-white border border-swiss-border rounded-2xl shadow-swiss flex flex-col justify-between gap-4">
              <div className="space-y-2">
                <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center">
                  <Globe className="w-4 h-4" />
                </div>
                <h3 className="font-bold text-sm text-swiss-ink font-frozen tracking-wide">
                  StackBlitz WebContainers
                </h3>
                <p className="text-xs text-swiss-muted leading-relaxed">
                  Full in-browser Node.js runtime environment for Next.js and Vite starter applications.
                </p>
              </div>

              <button
                type="button"
                onClick={() => handleLaunchBlank("stackblitz")}
                className="w-full py-2 bg-white hover:bg-swiss-canvas border border-swiss-border text-swiss-ink text-xs font-bold rounded-pill uppercase tracking-wider transition-all font-frozen flex items-center justify-center gap-1"
              >
                <ExternalLink className="w-3 h-3" />
                <span>Open StackBlitz</span>
              </button>
            </div>
          </div>
        </div>

        {/* Section B: Pre-Configured Starter Templates */}
        <div className="space-y-3 pt-2">
          <div className="flex items-center justify-between px-1">
            <h2 className="text-xs font-bold text-swiss-muted uppercase tracking-widest font-frozen">
              Starter Component Templates
            </h2>
            <span className="text-xs text-swiss-muted font-mono">
              Click &quot;Run in Sandbox&quot; to test instantly
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {STARTER_TEMPLATES.map((tpl) => {
              const isCopied = copiedId === tpl.id;
              return (
                <div
                  key={tpl.id}
                  className="bg-white border border-swiss-border hover:border-swiss-border-card rounded-2xl p-4 shadow-swiss flex flex-col justify-between gap-3 group transition-all"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold uppercase font-mono px-1.5 py-0.5 rounded bg-swiss-canvas border border-swiss-border text-swiss-ink">
                        {tpl.category}
                      </span>
                      <span className="text-[10px] text-swiss-muted font-mono">
                        {tpl.language.toUpperCase()}
                      </span>
                    </div>

                    <h3 className="font-bold text-xs sm:text-[13px] text-swiss-ink font-frozen tracking-wide">
                      {tpl.title}
                    </h3>
                    <p className="text-xs text-swiss-muted leading-relaxed line-clamp-2">
                      {tpl.description}
                    </p>

                    {/* Tag Pills */}
                    <div className="flex items-center gap-1 flex-wrap pt-1">
                      {tpl.tags.map((tag) => (
                        <span
                          key={tag}
                          className="text-[9.5px] font-mono font-bold px-1.5 py-0.5 rounded bg-swiss-saffron-tint text-swiss-saffron-text border border-swiss-saffron/20"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-swiss-border/60 gap-1.5">
                    <button
                      type="button"
                      onClick={() => handleRunTemplate(tpl)}
                      className="flex-1 py-1.5 bg-swiss-saffron hover:bg-swiss-saffron-hover text-white text-[10.5px] font-bold rounded-pill uppercase transition-all shadow-sm active:scale-95 font-frozen tracking-wider flex items-center justify-center gap-1"
                    >
                      <Play className="w-2.5 h-2.5 fill-current" />
                      <span>Run Sandbox</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleCopyTemplateCode(tpl)}
                      className="px-2.5 py-1.5 bg-swiss-canvas hover:bg-white border border-swiss-border text-swiss-ink text-[10px] font-bold rounded-pill uppercase transition-colors font-mono flex items-center gap-1"
                      title="Copy template source code"
                    >
                      {isCopied ? (
                        <>
                          <Check className="w-3 h-3 text-emerald-600" />
                          <span className="text-emerald-600">Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3 text-swiss-muted" />
                          <span>Copy</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        </div>
      </div>
    </div>
  );
}
