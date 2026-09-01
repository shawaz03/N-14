"use client";

import { useState, useEffect, useCallback } from "react";
import {
  SavedSnippet,
  SnippetFilterState,
  SnippetLanguageFilter,
} from "../types/snippet";

export const SNIPPETS_STORAGE_KEY = "raizen_saved_snippets";

export interface UseSavedSnippetsReturn {
  snippets: SavedSnippet[];
  saveSnippet: (params: {
    title?: string;
    code: string;
    language?: string;
    filename?: string;
    tags?: string[];
    description?: string;
    sessionId?: string;
  }) => SavedSnippet;
  deleteSnippet: (snippetId: string) => void;
  updateSnippet: (snippetId: string, updates: Partial<SavedSnippet>) => void;
  toggleFavorite: (snippetId: string) => void;
  getAllTags: () => string[];
  getFilteredSnippets: (filter?: Partial<SnippetFilterState>) => SavedSnippet[];
  clearAllSnippets: () => void;
}

/**
 * Derives a clean title from the code structure
 */
function deriveSnippetTitle(code: string, language: string, fallback = "Saved Component"): string {
  // Check for React component function / const name
  const matchFn = code.match(/function\s+([A-Z][A-Za-z0-9_]*)/);
  if (matchFn && matchFn[1]) return `${matchFn[1]} Component`;

  const matchConst = code.match(/const\s+([A-Z][A-Za-z0-9_]*)\s*=/);
  if (matchConst && matchConst[1]) return `${matchConst[1]} Component`;

  const matchClass = code.match(/class\s+([A-Za-z0-9_]*)/);
  if (matchClass && matchClass[1]) return `${matchClass[1]} Class`;

  const firstLine = code.trim().split("\n")[0].slice(0, 30);
  return firstLine.replace(/[^a-zA-Z0-9_\s]/g, "").trim() || `${language.toUpperCase()} Snippet`;
}

/**
 * Auto-detects smart tags from code contents
 */
function extractSmartTags(code: string, language: string, customTags: string[] = []): string[] {
  const tags = new Set<string>(customTags);

  const lang = (language || "").toLowerCase();
  if (["tsx", "jsx", "react"].includes(lang) || code.includes("React") || code.includes("useState")) {
    tags.add("#React");
  }
  if (code.includes("className") || code.includes("tailwind") || code.includes("bg-") || code.includes("flex")) {
    tags.add("#Tailwind");
  }
  if (code.includes("useState") || code.includes("useEffect") || code.includes("useRef") || code.includes("useMemo")) {
    tags.add("#Hooks");
  }
  if (code.includes("motion.") || code.includes("framer-motion") || code.includes("AnimatePresence")) {
    tags.add("#Animation");
  }
  if (lang === "python" || lang === "py" || code.includes("def ") || code.includes("import torch")) {
    tags.add("#Python");
  }
  if (lang === "typescript" || lang === "ts") {
    tags.add("#TypeScript");
  }

  if (tags.size === 0) {
    tags.add(`#${language.toUpperCase()}`);
  }

  return Array.from(tags);
}

export function useSavedSnippets(): UseSavedSnippetsReturn {
  const [snippets, setSnippets] = useState<SavedSnippet[]>([]);

  // 1. Load snippets from localStorage on initial mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        const saved = localStorage.getItem(SNIPPETS_STORAGE_KEY);
        if (saved) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed)) {
            setSnippets(parsed);
          }
        }
      } catch (err) {
        console.error("Failed to load snippets from localStorage:", err);
      }
    }
  }, []);

  // 2. Persist to localStorage
  const persistSnippets = useCallback((updated: SavedSnippet[]) => {
    setSnippets(updated);
    if (typeof window !== "undefined") {
      localStorage.setItem(SNIPPETS_STORAGE_KEY, JSON.stringify(updated));
    }
  }, []);

  // 3. Save a new code snippet
  const saveSnippet = useCallback(
    (params: {
      title?: string;
      code: string;
      language?: string;
      filename?: string;
      tags?: string[];
      description?: string;
      sessionId?: string;
    }): SavedSnippet => {
      const now = Date.now();
      const language = (params.language || "typescript").toLowerCase();
      const title = params.title || deriveSnippetTitle(params.code, language);
      const tags = extractSmartTags(params.code, language, params.tags);

      const newSnippet: SavedSnippet = {
        id: `snippet-${now}-${Math.random().toString(36).slice(2, 7)}`,
        title,
        code: params.code.trim(),
        language,
        filename: params.filename,
        description: params.description,
        tags,
        createdAt: now,
        updatedAt: now,
        sessionId: params.sessionId,
        isFavorite: false,
      };

      const updated = [newSnippet, ...snippets];
      persistSnippets(updated);
      return newSnippet;
    },
    [snippets, persistSnippets]
  );

  // 4. Delete a snippet
  const deleteSnippet = useCallback(
    (snippetId: string) => {
      const updated = snippets.filter((s) => s.id !== snippetId);
      persistSnippets(updated);
    },
    [snippets, persistSnippets]
  );

  // 5. Update a snippet
  const updateSnippet = useCallback(
    (snippetId: string, updates: Partial<SavedSnippet>) => {
      const updated = snippets.map((s) =>
        s.id === snippetId ? { ...s, ...updates, updatedAt: Date.now() } : s
      );
      persistSnippets(updated);
    },
    [snippets, persistSnippets]
  );

  // 6. Toggle Favorite status
  const toggleFavorite = useCallback(
    (snippetId: string) => {
      const updated = snippets.map((s) =>
        s.id === snippetId ? { ...s, isFavorite: !s.isFavorite, updatedAt: Date.now() } : s
      );
      persistSnippets(updated);
    },
    [snippets, persistSnippets]
  );

  // 7. Get all unique tags across all snippets
  const getAllTags = useCallback((): string[] => {
    const set = new Set<string>();
    snippets.forEach((s) => s.tags?.forEach((t) => set.add(t)));
    return Array.from(set).sort();
  }, [snippets]);

  // 8. Filter and search snippets
  const getFilteredSnippets = useCallback(
    (filter: Partial<SnippetFilterState> = {}): SavedSnippet[] => {
      const query = (filter.searchQuery || "").toLowerCase().trim();
      const lang = filter.languageFilter || "all";
      const tag = filter.selectedTag;
      const favOnly = !!filter.favoritesOnly;

      return snippets.filter((s) => {
        if (favOnly && !s.isFavorite) return false;

        if (lang !== "all") {
          if (lang === "react" && !["react", "tsx", "jsx"].includes(s.language.toLowerCase())) {
            return false;
          } else if (lang !== "react" && s.language.toLowerCase() !== lang) {
            return false;
          }
        }

        if (tag && !s.tags.includes(tag)) return false;

        if (query) {
          const matchTitle = s.title.toLowerCase().includes(query);
          const matchCode = s.code.toLowerCase().includes(query);
          const matchTag = s.tags.some((t) => t.toLowerCase().includes(query));
          if (!matchTitle && !matchCode && !matchTag) return false;
        }

        return true;
      });
    },
    [snippets]
  );

  // 9. Clear all snippets
  const clearAllSnippets = useCallback(() => {
    persistSnippets([]);
  }, [persistSnippets]);

  return {
    snippets,
    saveSnippet,
    deleteSnippet,
    updateSnippet,
    toggleFavorite,
    getAllTags,
    getFilteredSnippets,
    clearAllSnippets,
  };
}
