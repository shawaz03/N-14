"use client";

import React, { useState, useMemo } from "react";
import {
  Search,
  Clock,
  Pin,
  Trash2,
  Edit3,
  MessageSquare,
  Plus,
  ArrowUpRight,
  X,
} from "lucide-react";
import { UseRaizenHistoryReturn } from "../hooks/useRaizenHistory";
import { ChatSession, HistoryTimeBucket } from "../types/session";
import { cn } from "../lib/utils";

interface HistoryViewProps {
  history: UseRaizenHistoryReturn;
  onSelectSession: (session: ChatSession) => void;
  onNewSession: () => void;
  className?: string;
}

export function HistoryView({
  history,
  onSelectSession,
  onNewSession,
  className,
}: HistoryViewProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeBucket, setActiveBucket] = useState<HistoryTimeBucket | "all">("all");
  const [pinnedOnly, setPinnedOnly] = useState(false);
  const [editingSessionId, setEditingSessionId] = useState<string | null>(null);
  const [editTitleText, setEditTitleText] = useState("");

  const timelineGroups = useMemo(() => {
    return history.getTimelineGroups({
      searchQuery,
      timeRange: activeBucket,
      pinnedOnly,
    });
  }, [history, searchQuery, activeBucket, pinnedOnly]);

  const totalSessionsCount = history.sessions.length;

  const handleStartRename = (session: ChatSession, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingSessionId(session.id);
    setEditTitleText(session.title);
  };

  const handleSaveRename = (sessionId: string, e: React.FormEvent) => {
    e.preventDefault();
    history.renameSession(sessionId, editTitleText);
    setEditingSessionId(null);
  };

  const handleDelete = (sessionId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    history.deleteSession(sessionId);
  };

  const handleTogglePin = (sessionId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    history.togglePinSession(sessionId);
  };

  return (
    <div className={cn("w-full h-full flex flex-col bg-swiss-canvas overflow-hidden select-none", className)}>
      {/* 1. Header Bar */}
      <div className="px-6 py-5 bg-white border-b border-swiss-border flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-swiss-saffron-tint text-swiss-saffron flex items-center justify-center font-frozen text-xs">
            ✦
          </div>
          <div>
            <h1 className="text-base sm:text-lg font-bold text-swiss-ink font-frozen uppercase tracking-wider">
              Conversation History
            </h1>
            <p className="text-xs text-swiss-muted font-mono">
              {totalSessionsCount} recorded {totalSessionsCount === 1 ? "session" : "sessions"} across time
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={onNewSession}
          className="flex items-center gap-1.5 px-4 py-2 bg-swiss-saffron hover:bg-swiss-saffron-hover text-white text-xs font-bold rounded-pill transition-all shadow-swiss-saffron active:scale-95 font-frozen tracking-wide"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>New Session</span>
        </button>
      </div>

      {/* 2. Filter & Search Controls */}
      <div className="p-4 sm:px-6 bg-white/70 border-b border-swiss-border flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
        {/* Search Bar */}
        <div className="relative w-full sm:w-96 flex items-center">
          <Search className="w-4 h-4 text-swiss-muted absolute left-3 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search sessions or code prompts..."
            className="w-full bg-white border border-swiss-border rounded-pill pl-9 pr-8 py-1.5 text-xs text-swiss-ink placeholder:text-swiss-muted/60 focus:outline-none focus:border-swiss-saffron shadow-sm transition-all"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery("")}
              className="absolute right-2.5 text-swiss-muted hover:text-swiss-ink p-0.5 rounded-full"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Time Bucket Filter Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar w-full sm:w-auto py-0.5">
          <button
            type="button"
            onClick={() => setPinnedOnly(!pinnedOnly)}
            className={cn(
              "px-3 py-1 rounded-pill text-[11px] font-bold transition-all flex items-center gap-1 font-frozen",
              pinnedOnly
                ? "bg-swiss-saffron text-white shadow-swiss-saffron"
                : "bg-white border border-swiss-border text-swiss-muted hover:text-swiss-ink"
            )}
          >
            <Pin className="w-3 h-3" />
            <span>Pinned</span>
          </button>

          {(["all", "today", "yesterday", "week", "older"] as const).map((bucket) => (
            <button
              key={bucket}
              type="button"
              onClick={() => setActiveBucket(bucket)}
              className={cn(
                "px-3 py-1 rounded-pill text-[11px] font-bold uppercase transition-all font-frozen tracking-wide",
                activeBucket === bucket
                  ? "bg-swiss-ink text-white shadow-sm"
                  : "bg-white border border-swiss-border text-swiss-muted hover:text-swiss-ink"
              )}
            >
              {bucket === "all" ? "All Time" : bucket === "week" ? "7 Days" : bucket}
            </button>
          ))}
        </div>
      </div>

      {/* 3. Main Timeline Session List */}
      <div className="flex-1 w-full overflow-y-auto p-4 sm:p-6 select-text">
        <div className="max-w-5xl mx-auto space-y-6">
          {timelineGroups.length === 0 ? (
          /* Empty Search State */
          <div className="my-16 flex flex-col items-center justify-center text-center p-8 bg-white border border-swiss-border rounded-2xl shadow-swiss max-w-md mx-auto space-y-3 animate-in fade-in">
            <div className="w-12 h-12 rounded-full bg-swiss-saffron-tint text-swiss-saffron flex items-center justify-center font-frozen text-lg">
              ✦
            </div>
            <h3 className="text-sm sm:text-base font-bold text-swiss-ink font-frozen uppercase tracking-wider">
              {searchQuery ? "No Matching Sessions Found" : "No Past Sessions Yet"}
            </h3>
            <p className="text-xs text-swiss-muted leading-relaxed">
              {searchQuery
                ? `No conversation matched "${searchQuery}". Try searching for other keywords.`
                : "Start prompting RAIZEN in the Chat Studio to create your first session."}
            </p>
            <button
              type="button"
              onClick={onNewSession}
              className="mt-2 px-4 py-2 bg-swiss-saffron hover:bg-swiss-saffron-hover text-white text-xs font-bold rounded-pill transition-all font-frozen tracking-wide shadow-swiss-saffron"
            >
              Start First Session
            </button>
          </div>
        ) : (
          /* Chronological Groups */
          timelineGroups.map((group) => (
            <div key={group.bucket} className="space-y-3 animate-in fade-in duration-200">
              {/* Group Section Header */}
              <div className="flex items-center gap-2 px-1">
                <Clock className="w-3.5 h-3.5 text-swiss-saffron" />
                <h2 className="text-xs font-bold text-swiss-muted uppercase tracking-widest font-frozen">
                  {group.label}
                </h2>
                <span className="text-[10px] px-2 py-0.5 rounded-pill bg-white border border-swiss-border text-swiss-muted font-mono font-bold">
                  {group.sessions.length}
                </span>
              </div>

              {/* Session Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                {group.sessions.map((session) => {
                  const isActive = session.id === history.activeSessionId;
                  const isEditing = session.id === editingSessionId;

                  return (
                    <div
                      key={session.id}
                      onClick={() => onSelectSession(session)}
                      className={cn(
                        "group relative p-4 rounded-xl border transition-all cursor-pointer shadow-swiss flex flex-col justify-between gap-3 text-left",
                        isActive
                          ? "bg-white border-swiss-saffron shadow-swiss-saffron"
                          : "bg-white hover:bg-white/95 border-swiss-border hover:border-swiss-border-card"
                      )}
                    >
                      {/* Top Card Header */}
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-2 flex-1 min-w-0">
                          {session.isPinned && (
                            <Pin className="w-3 h-3 text-swiss-saffron fill-swiss-saffron shrink-0" />
                          )}
                          {isEditing ? (
                            <form
                              onSubmit={(e) => handleSaveRename(session.id, e)}
                              onClick={(e) => e.stopPropagation()}
                              className="flex-1 flex items-center gap-1"
                            >
                              <input
                                type="text"
                                value={editTitleText}
                                onChange={(e) => setEditTitleText(e.target.value)}
                                autoFocus
                                className="w-full bg-swiss-canvas px-2 py-1 text-xs font-bold border border-swiss-saffron rounded outline-none font-frozen"
                              />
                              <button
                                type="submit"
                                className="px-2 py-1 bg-swiss-saffron text-white text-[10px] font-bold rounded font-frozen"
                              >
                                Save
                              </button>
                            </form>
                          ) : (
                            <h3 className="font-bold text-xs sm:text-[13px] text-swiss-ink truncate font-frozen tracking-wide">
                              {session.title}
                            </h3>
                          )}
                        </div>

                        {/* Quick Card Action Buttons */}
                        <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100 transition-opacity">
                          <button
                            type="button"
                            onClick={(e) => handleTogglePin(session.id, e)}
                            className={cn(
                              "p-1 rounded-full hover:bg-swiss-canvas transition-colors",
                              session.isPinned ? "text-swiss-saffron" : "text-swiss-muted hover:text-swiss-ink"
                            )}
                            title={session.isPinned ? "Unpin session" : "Pin session"}
                          >
                            <Pin className="w-3.5 h-3.5" />
                          </button>

                          <button
                            type="button"
                            onClick={(e) => handleStartRename(session, e)}
                            className="p-1 rounded-full text-swiss-muted hover:text-swiss-ink hover:bg-swiss-canvas transition-colors"
                            title="Rename session"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>

                          <button
                            type="button"
                            onClick={(e) => handleDelete(session.id, e)}
                            className="p-1 rounded-full text-swiss-muted hover:text-red-600 hover:bg-red-50 transition-colors"
                            title="Delete session"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      {/* Preview Snippet */}
                      {session.lastMessagePreview && (
                        <p className="text-xs text-swiss-body leading-relaxed line-clamp-2 font-sans">
                          {session.lastMessagePreview}
                        </p>
                      )}

                      {/* Footer Metadata */}
                      <div className="flex items-center justify-between pt-2 border-t border-swiss-border/60 text-[10.5px] text-swiss-muted font-mono">
                        <div className="flex items-center gap-2">
                          <span className="flex items-center gap-1">
                            <MessageSquare className="w-3 h-3 text-swiss-saffron" />
                            <span>{session.messageCount} {session.messageCount === 1 ? "turn" : "turns"}</span>
                          </span>
                          <span>•</span>
                          <span>{new Date(session.updatedAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</span>
                        </div>

                        <div className="flex items-center gap-1 font-frozen text-swiss-saffron font-bold group-hover:translate-x-0.5 transition-transform text-[11px]">
                          <span>Resume</span>
                          <ArrowUpRight className="w-3 h-3" />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))
        )}
        </div>
      </div>
    </div>
  );
}
