/**
 * RAIZEN Studio — Saved Snippets & Component Vault Types
 * 
 * Defines data structures for bookmarking, tagging, filtering,
 * and managing reusable code components and snippets.
 * 
 * Crafted by SHAWAZ (https://shawaz.vercel.app/)
 */

export interface SavedSnippet {
  id: string;
  title: string;
  code: string;
  language: string; // e.g. "tsx", "jsx", "html", "python", "typescript", "css"
  filename?: string; // e.g. "Component.tsx", "PricingTable.tsx"
  description?: string;
  tags: string[]; // e.g. ["#React", "#Tailwind", "#NextJS", "#Hooks", "#UI"]
  createdAt: number; // Unix Epoch timestamp in ms
  updatedAt: number; // Unix Epoch timestamp in ms
  sessionId?: string; // Originating conversation session ID
  isFavorite?: boolean;
}

export type SnippetLanguageFilter = "all" | "react" | "tsx" | "python" | "html" | "css" | "typescript";

export interface SnippetFilterState {
  searchQuery: string;
  languageFilter: SnippetLanguageFilter;
  selectedTag?: string;
  favoritesOnly: boolean;
}
