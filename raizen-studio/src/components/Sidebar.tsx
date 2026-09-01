"use client";

import React, { useState } from "react";
import {
  MessageSquare,
  Compass,
  History,
  Bookmark,
  Wrench,
  Plus,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Cpu,
} from "lucide-react";
import { cn } from "../lib/utils";

interface SidebarProps {
  onNewChat: () => void;
  onOpenColabModal: () => void;
  activeTab?: string;
  onSelectTab?: (tabId: string) => void;
  className?: string;
}

export function Sidebar({
  onNewChat,
  onOpenColabModal,
  activeTab = "chat",
  onSelectTab,
  className,
}: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false);

  const navItems = [
    { id: "chat", label: "Chat Studio", icon: MessageSquare, badge: "Active" },
    { id: "explore", label: "Model Explorer", icon: Compass },
    { id: "history", label: "History", icon: History },
    { id: "saved", label: "Saved Snippets", icon: Bookmark },
    { id: "tools", label: "Sandbox Bridge", icon: Wrench },
  ];

  return (
    <aside
      className={cn(
        "h-full bg-swiss-sidebar border-r border-swiss-border flex flex-col transition-all duration-300 select-none z-20 shrink-0",
        collapsed ? "w-16" : "w-64",
        className
      )}
    >
      {/* 1. Header / Brand Mark */}
      <div className="p-4 flex items-center justify-between border-b border-swiss-border">
        {!collapsed && (
          <div className="flex items-center gap-2">
            <span className="font-frozen text-xl font-bold tracking-wider text-swiss-ink uppercase">
              RAIZEN
            </span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-pill bg-swiss-saffron-tint text-swiss-saffron-text border border-swiss-saffron/20 font-frozen tracking-wide">
              v2.4
            </span>
          </div>
        )}
        <button
          type="button"
          onClick={() => setCollapsed(!collapsed)}
          className="p-1.5 rounded-md hover:bg-black/5 text-swiss-muted hover:text-swiss-ink transition-colors"
          title={collapsed ? "Expand Sidebar" : "Collapse Sidebar"}
        >
          {collapsed ? (
            <ChevronRight className="w-4 h-4" />
          ) : (
            <ChevronLeft className="w-4 h-4" />
          )}
        </button>
      </div>

      {/* 2. Primary CTA: New Chat Pill */}
      <div className="p-3">
        <button
          type="button"
          onClick={onNewChat}
          className={cn(
            "w-full bg-swiss-saffron hover:bg-swiss-saffron-hover text-white font-bold rounded-pill text-xs py-2.5 px-3 flex items-center justify-center gap-2 shadow-swiss transition-all active:scale-[0.98] font-frozen tracking-wide",
            collapsed && "px-0"
          )}
          title="Start New Chat (⌘N)"
        >
          <Plus className="w-4 h-4 shrink-0 stroke-[2.5]" />
          {!collapsed && (
            <div className="flex items-center justify-between w-full pr-1">
              <span className="font-frozen tracking-wide text-xs">New Session</span>
              <kbd className="font-mono text-[9px] bg-white/20 px-1.5 py-0.5 rounded text-white/90">
                ⌘N
              </kbd>
            </div>
          )}
        </button>
      </div>

      {/* 3. Navigation Links */}
      <nav className="flex-1 overflow-y-auto px-2 py-2 space-y-1">
        {!collapsed && (
          <div className="text-[11px] font-bold uppercase tracking-widest text-swiss-muted px-3 py-1.5 font-frozen">
            Workspace
          </div>
        )}

        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onSelectTab?.(item.id)}
              className={cn(
                "w-full flex items-center justify-between px-3 py-2 rounded-md text-xs sm:text-[13px] font-medium transition-all font-frozen tracking-wide",
                isActive
                  ? "bg-white text-swiss-ink font-bold shadow-swiss border border-swiss-border-card"
                  : "text-swiss-body hover:bg-black/5 hover:text-swiss-ink",
                collapsed && "justify-center px-0"
              )}
              title={item.label}
            >
              <div className="flex items-center gap-2.5">
                <Icon
                  className={cn(
                    "w-4 h-4 shrink-0",
                    isActive ? "text-swiss-saffron" : "text-swiss-muted"
                  )}
                />
                {!collapsed && <span>{item.label}</span>}
              </div>

              {!collapsed && item.badge && (
                <span className="text-[9.5px] font-bold px-1.5 py-0.5 rounded-pill bg-swiss-saffron-tint text-swiss-saffron-text font-frozen tracking-wide">
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}

        {!collapsed && (
          <>
            <div className="text-[11px] font-bold uppercase tracking-widest text-swiss-muted px-3 pt-4 pb-1 font-frozen">
              Compute Node
            </div>
            <button
              type="button"
              onClick={onOpenColabModal}
              className="w-full flex items-center justify-between px-3 py-2 rounded-md text-xs sm:text-[13px] font-medium text-swiss-body hover:bg-black/5 hover:text-swiss-ink transition-colors font-frozen tracking-wide"
            >
              <div className="flex items-center gap-2.5">
                <Cpu className="w-4 h-4 text-emerald-600" />
                <span>Google Colab T4</span>
              </div>
              <ExternalLink className="w-3 h-3 text-swiss-muted" />
            </button>
          </>
        )}
      </nav>

      {/* 4. Creator & Profile Card Footer */}
      <div className="p-3 border-t border-swiss-border bg-swiss-sidebar">
        {!collapsed ? (
          <a
            href="https://shawaz.vercel.app/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between p-2 rounded-md bg-white border border-swiss-border-card hover:border-swiss-saffron/40 shadow-swiss transition-all group"
          >
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-full bg-swiss-saffron-tint text-swiss-saffron-text font-extrabold text-[11px] flex items-center justify-center font-frozen">
                SW
              </div>
              <div className="text-left">
                <div className="text-xs font-bold text-swiss-ink group-hover:text-swiss-saffron transition-colors font-frozen tracking-wide">
                  SHAWAZ
                </div>
                <div className="text-[10px] text-swiss-muted font-frozen tracking-wide">
                  Architect & Creator
                </div>
              </div>
            </div>
            <ExternalLink className="w-3.5 h-3.5 text-swiss-muted group-hover:text-swiss-saffron transition-colors" />
          </a>
        ) : (
          <div className="flex justify-center">
            <div className="w-8 h-8 rounded-full bg-swiss-saffron-tint text-swiss-saffron-text font-bold text-xs flex items-center justify-center font-frozen">
              SW
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}
