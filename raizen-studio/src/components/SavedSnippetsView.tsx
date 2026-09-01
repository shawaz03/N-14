"use client";

import React, { useState, useMemo } from "react";
import {
  Search,
  Star,
  Play,
  Copy,
  Download,
  Trash2,
  Tag,
  FileCode,
  Check,
  X,
} from "lucide-react";
import { UseSavedSnippetsReturn } from "../hooks/useSavedSnippets";
import { SavedSnippet, SnippetLanguageFilter } from "../types/snippet";
import { launchInOpenSourceSandbox } from "../lib/sandboxLauncher";
import { cn } from "../lib/utils";

interface SavedSnippetsViewProps {
  snippetsVault: UseSavedSnippetsReturn;
  onRunInSandbox?: (code: string, language: string) => void;
  onExportCode?: (code: string, filename: string) => void;
  className?: string;
}

export function SavedSnippetsView({
  snippetsVault,
  onRunInSandbox,
  onExportCode,
  className,
}: SavedSnippetsViewProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeLanguage, setActiveLanguage] = useState<SnippetLanguageFilter>("all");
  const [selectedTag, setSelectedTag] = useState<string | undefined>(undefined);
  const [favoritesOnly, setFavoritesOnly] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const allTags = snippetsVault.getAllTags();

  const filteredSnippets = useMemo(() => {
    return snippetsVault.getFilteredSnippets({
      searchQuery,
      languageFilter: activeLanguage,
      selectedTag,
      favoritesOnly,
    });
  }, [snippetsVault, searchQuery, activeLanguage, selectedTag, favoritesOnly]);

  const handleCopyCode = (snippet: SavedSnippet) => {
    navigator.clipboard.writeText(snippet.code);
    setCopiedId(snippet.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleRun = (snippet: SavedSnippet) => {
    launchInOpenSourceSandbox(snippet.code, snippet.language, "standalone");
    if (onRunInSandbox) {
      onRunInSandbox(snippet.code, snippet.language);
    }
  };

  const handleDownload = (snippet: SavedSnippet) => {
    const filename = snippet.filename || `${snippet.title.replace(/\s+/g, "_")}.${snippet.language || "tsx"}`;
    if (onExportCode) {
      onExportCode(snippet.code, filename);
    } else if (typeof window !== "undefined") {
      const blob = new Blob([snippet.code], { type: "text/plain;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = filename;
      link.click();
      URL.revokeObjectURL(url);
    }
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
              Saved Snippets Vault
            </h1>
            <p className="text-xs text-swiss-muted font-mono">
              {snippetsVault.snippets.length} saved {snippetsVault.snippets.length === 1 ? "component" : "components"} & reusable modules
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 font-mono text-xs">
          <span className="px-3 py-1 bg-swiss-canvas border border-swiss-border rounded-pill text-swiss-muted font-bold">
            ⚡ 1-Click Sandbox Ready
          </span>
        </div>
      </div>

      {/* 2. Filter & Search Toolbar */}
      <div className="p-4 sm:px-6 bg-white/70 border-b border-swiss-border space-y-3 shrink-0">
        {/* Row A: Search Input + Language Tabs */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="relative w-full sm:w-80 flex items-center">
            <Search className="w-4 h-4 text-swiss-muted absolute left-3 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search components, functions, or tags..."
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

          {/* Language Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar w-full sm:w-auto py-0.5">
            <button
              type="button"
              onClick={() => setFavoritesOnly(!favoritesOnly)}
              className={cn(
                "px-3 py-1 rounded-pill text-[11px] font-bold transition-all flex items-center gap-1 font-frozen",
                favoritesOnly
                  ? "bg-amber-500 text-white shadow-sm"
                  : "bg-white border border-swiss-border text-swiss-muted hover:text-swiss-ink"
              )}
            >
              <Star className="w-3 h-3 fill-current" />
              <span>Favorites</span>
            </button>

            {(["all", "react", "typescript", "python", "html"] as const).map((lang) => (
              <button
                key={lang}
                type="button"
                onClick={() => setActiveLanguage(lang)}
                className={cn(
                  "px-3 py-1 rounded-pill text-[11px] font-bold uppercase transition-all font-frozen tracking-wide",
                  activeLanguage === lang
                    ? "bg-swiss-ink text-white shadow-sm"
                    : "bg-white border border-swiss-border text-swiss-muted hover:text-swiss-ink"
                )}
              >
                {lang === "all" ? "All Languages" : lang}
              </button>
            ))}
          </div>
        </div>

        {/* Row B: Tag Pills Filter */}
        {allTags.length > 0 && (
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pt-1">
            <Tag className="w-3 h-3 text-swiss-muted shrink-0 ml-1" />
            <button
              type="button"
              onClick={() => setSelectedTag(undefined)}
              className={cn(
                "px-2.5 py-0.5 rounded-pill text-[10px] font-bold font-mono transition-all",
                selectedTag === undefined
                  ? "bg-swiss-saffron text-white"
                  : "bg-white/80 border border-swiss-border text-swiss-muted hover:text-swiss-ink"
              )}
            >
              #All Tags
            </button>
            {allTags.map((tag) => (
              <button
                key={tag}
                type="button"
                onClick={() => setSelectedTag(selectedTag === tag ? undefined : tag)}
                className={cn(
                  "px-2.5 py-0.5 rounded-pill text-[10px] font-bold font-mono transition-all",
                  selectedTag === tag
                    ? "bg-swiss-saffron text-white"
                    : "bg-white/80 border border-swiss-border text-swiss-muted hover:text-swiss-ink"
                )}
              >
                {tag}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* 3. Snippets Grid */}
      <div className="flex-1 w-full overflow-y-auto p-4 sm:p-6 select-text">
        <div className="max-w-6xl mx-auto space-y-6">
          {filteredSnippets.length === 0 ? (
          /* Empty State */
          <div className="my-16 flex flex-col items-center justify-center text-center p-8 bg-white border border-swiss-border rounded-2xl shadow-swiss max-w-md mx-auto space-y-3 animate-in fade-in">
            <div className="w-12 h-12 rounded-full bg-swiss-saffron-tint text-swiss-saffron flex items-center justify-center font-frozen text-lg">
              ✦
            </div>
            <h3 className="text-sm sm:text-base font-bold text-swiss-ink font-frozen uppercase tracking-wider">
              {searchQuery || selectedTag ? "No Matching Snippets" : "Snippet Vault is Empty"}
            </h3>
            <p className="text-xs text-swiss-muted leading-relaxed">
              {searchQuery || selectedTag
                ? "No saved component matched your filters. Try clearing search keywords or tags."
                : "Bookmark code blocks in Chat Studio by clicking the [SAVE] button on any component."}
            </p>
          </div>
        ) : (
          /* Cards Grid */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredSnippets.map((snippet) => {
              const lines = snippet.code.split("\n");
              const previewLines = lines.slice(0, 7);
              const isCopied = copiedId === snippet.id;

              return (
                <div
                  key={snippet.id}
                  className="bg-white border border-swiss-border hover:border-swiss-border-card rounded-2xl p-4 shadow-swiss transition-all flex flex-col justify-between gap-3 text-left group"
                >
                  {/* Card Header */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-1.5 min-w-0">
                        <FileCode className="w-3.5 h-3.5 text-swiss-saffron shrink-0" />
                        <span className="text-[10px] font-bold uppercase font-mono px-1.5 py-0.5 rounded bg-swiss-canvas border border-swiss-border text-swiss-ink">
                          {snippet.language}
                        </span>
                        <span className="text-[10px] text-swiss-muted font-mono">
                          {lines.length} lines
                        </span>
                      </div>

                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => snippetsVault.toggleFavorite(snippet.id)}
                          className={cn(
                            "p-1 rounded-full hover:bg-swiss-canvas transition-colors",
                            snippet.isFavorite ? "text-amber-500" : "text-swiss-muted hover:text-amber-500"
                          )}
                          title={snippet.isFavorite ? "Remove from Favorites" : "Mark as Favorite"}
                        >
                          <Star className={cn("w-3.5 h-3.5", snippet.isFavorite && "fill-current")} />
                        </button>
                        <button
                          type="button"
                          onClick={() => snippetsVault.deleteSnippet(snippet.id)}
                          className="p-1 rounded-full text-swiss-muted hover:text-red-600 hover:bg-red-50 transition-colors"
                          title="Delete snippet"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    <h3 className="font-bold text-xs sm:text-[13px] text-swiss-ink truncate font-frozen tracking-wide">
                      {snippet.title}
                    </h3>

                    {/* Tags */}
                    {snippet.tags && snippet.tags.length > 0 && (
                      <div className="flex items-center gap-1 flex-wrap">
                        {snippet.tags.map((t) => (
                          <span
                            key={t}
                            className="text-[9.5px] font-mono font-bold px-1.5 py-0.5 rounded bg-swiss-saffron-tint text-swiss-saffron-text border border-swiss-saffron/20"
                          >
                            {t}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Mini Code Preview Window in Sagewold Monospace */}
                  <div className="bg-[#111215] border border-[#26282E] rounded-lg p-2.5 overflow-hidden font-mono text-[10.5px] leading-relaxed text-[#EDEDEE] select-text">
                    <pre className="overflow-x-auto no-scrollbar">
                      <code>{previewLines.join("\n")}</code>
                      {lines.length > 7 && (
                        <div className="text-[10px] text-[#555861] pt-1 italic font-mono">
                          ... +{lines.length - 7} more lines
                        </div>
                      )}
                    </pre>
                  </div>

                  {/* Card Actions Footer */}
                  <div className="flex items-center justify-between pt-2 border-t border-swiss-border/60 gap-1.5">
                    <button
                      type="button"
                      onClick={() => handleRun(snippet)}
                      className="flex-1 flex items-center justify-center gap-1 py-1.5 bg-swiss-saffron hover:bg-swiss-saffron-hover text-white text-[10.5px] font-bold rounded-pill uppercase transition-all shadow-sm active:scale-95 font-frozen tracking-wider"
                      title="Run in live sandbox"
                    >
                      <Play className="w-2.5 h-2.5 fill-current" />
                      <span>Run</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleCopyCode(snippet)}
                      className="px-2.5 py-1.5 bg-swiss-canvas hover:bg-white border border-swiss-border text-swiss-ink text-[10px] font-bold rounded-pill uppercase transition-colors font-frozen flex items-center gap-1"
                      title="Copy code to clipboard"
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

                    <button
                      type="button"
                      onClick={() => handleDownload(snippet)}
                      className="p-1.5 bg-swiss-canvas hover:bg-white border border-swiss-border text-swiss-muted hover:text-swiss-ink rounded-pill transition-colors"
                      title="Download file"
                    >
                      <Download className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
        </div>
      </div>
    </div>
  );
}
