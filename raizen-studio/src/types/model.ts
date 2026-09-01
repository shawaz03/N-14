/**
 * RAIZEN Studio — Model Explorer & Persona Engine Types
 * 
 * Defines architecture specifications for RAIZEN 7.61B model,
 * Hugging Face repository metadata, and specialized AI persona profiles.
 * 
 * Crafted by SHAWAZ (https://shawaz.vercel.app/)
 */

export interface ModelSpecification {
  name: string;
  version: string;
  parameters: string; // "7.61 Billion"
  baseModel: string; // "Qwen/Qwen2.5-Coder-7B-Instruct"
  quantization: string; // "4-bit NormalFloat (NF4)"
  fineTuningMethod: string; // "QLoRA (Rank 64, Alpha 16)"
  contextWindow: number; // 32768
  maxGenerationTokens: number; // 4096
  huggingFaceRepo: string; // "shawaz03/RAIZEN"
  creator: string; // "SHAWAZ"
  portfolioUrl: string; // "https://shawaz.vercel.app/"
  license: string; // "Apache 2.0"
  trainingHardware: string; // "NVIDIA A100 80GB & Tesla T4"
}

export type PersonaCategory = "frontend" | "fullstack" | "backend" | "optimizer";

export interface RaizenPersona {
  id: string;
  name: string;
  category: PersonaCategory;
  tagline: string;
  systemPrompt: string;
  defaultTemperature: number;
  iconName: string;
  badge: string;
  accentColor: string; // Tailwind color class or hex
  tags: string[];
}
