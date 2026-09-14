"use client";

import React from "react";
import { motion } from "framer-motion";
import { cn } from "../../lib/utils";

export interface SpecialistBadgeProps {
  personaId: string;
  accentColor: string;
  isSelected?: boolean;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function SpecialistBadge({
  personaId,
  accentColor,
  isSelected = false,
  size = "md",
  className,
}: SpecialistBadgeProps) {
  const sizeMap = {
    sm: "w-7 h-7 text-[10px]",
    md: "w-9 h-9 text-xs",
    lg: "w-11 h-11 text-sm",
  };

  const svgSize = size === "sm" ? 18 : size === "lg" ? 26 : 22;

  return (
    <motion.div
      className={cn(
        "relative rounded-xl flex items-center justify-center shrink-0 overflow-hidden transition-colors border",
        sizeMap[size],
        className
      )}
      style={{
        backgroundColor: `${accentColor}14`,
        borderColor: isSelected ? `${accentColor}80` : `${accentColor}2E`,
        boxShadow: isSelected
          ? `0 0 14px -2px ${accentColor}40, inset 0 1px 0 rgba(255, 255, 255, 0.3)`
          : `inset 0 1px 0 rgba(255, 255, 255, 0.15)`,
      }}
      whileHover={{ scale: 1.1, rotate: 2 }}
      whileTap={{ scale: 0.92 }}
      transition={{ type: "spring", stiffness: 400, damping: 17 }}
    >
      {/* 1. React & UI Architect (Atomic Orbital Rings) */}
      {personaId === "frontend-architect" && (
        <svg
          width={svgSize}
          height={svgSize}
          viewBox="0 0 24 24"
          fill="none"
          className="relative z-10"
        >
          {/* Nucleus Core */}
          <motion.circle
            cx="12"
            cy="12"
            r="2.5"
            fill={accentColor}
            animate={{ scale: [1, 1.25, 1], opacity: [0.9, 1, 0.9] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          />
          {/* Orbital Ring 1 */}
          <motion.ellipse
            cx="12"
            cy="12"
            rx="9"
            ry="3.8"
            stroke={accentColor}
            strokeWidth="1.35"
            strokeOpacity="0.75"
            strokeDasharray="4 2"
            animate={{ rotate: 360 }}
            transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
            style={{ transformOrigin: "center" }}
          />
          {/* Orbital Ring 2 */}
          <motion.ellipse
            cx="12"
            cy="12"
            rx="9"
            ry="3.8"
            stroke={accentColor}
            strokeWidth="1.35"
            strokeOpacity="0.75"
            animate={{ rotate: -360 }}
            transition={{ duration: 11, repeat: Infinity, ease: "linear" }}
            style={{ transformOrigin: "center", transform: "rotate(60deg)" }}
          />
        </svg>
      )}

      {/* 2. Fullstack Next.js Specialist (Tiered Isometric Stack) */}
      {personaId === "fullstack-nextjs" && (
        <svg
          width={svgSize}
          height={svgSize}
          viewBox="0 0 24 24"
          fill="none"
          className="relative z-10"
        >
          {/* Top Layer (Client) */}
          <motion.path
            d="M12 3L20 7.5L12 12L4 7.5L12 3Z"
            fill={`${accentColor}40`}
            stroke={accentColor}
            strokeWidth="1.4"
            animate={{ y: [0, -1.5, 0] }}
            transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
          />
          {/* Middle Layer (Server) */}
          <motion.path
            d="M4 11.5L12 16L20 11.5"
            stroke={accentColor}
            strokeWidth="1.4"
            strokeOpacity="0.75"
            animate={{ y: [0, -0.7, 0] }}
            transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut", delay: 0.2 }}
          />
          {/* Bottom Layer (Database/Edge) */}
          <motion.path
            d="M4 15.5L12 20L20 15.5"
            stroke={accentColor}
            strokeWidth="1.4"
            strokeOpacity="0.5"
            animate={{ y: [0, 0, 0] }}
            transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut", delay: 0.4 }}
          />
        </svg>
      )}

      {/* 3. Python & AI Systems Engineer (Neural Core & Chip Traces) */}
      {personaId === "python-ai-systems" && (
        <svg
          width={svgSize}
          height={svgSize}
          viewBox="0 0 24 24"
          fill="none"
          className="relative z-10"
        >
          {/* Chip Center Body */}
          <rect
            x="6.5"
            y="6.5"
            width="11"
            height="11"
            rx="2.5"
            fill={`${accentColor}35`}
            stroke={accentColor}
            strokeWidth="1.4"
          />
          {/* Radar Expansion Ring */}
          <motion.circle
            cx="12"
            cy="12"
            r="4"
            stroke={accentColor}
            strokeWidth="1.2"
            animate={{ r: [4, 8, 4], opacity: [0.9, 0, 0.9] }}
            transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
          />
          {/* Center Brain Core */}
          <circle cx="12" cy="12" r="2" fill={accentColor} />
          {/* Pin Traces */}
          <line x1="9" y1="3.5" x2="9" y2="6.5" stroke={accentColor} strokeWidth="1.3" />
          <line x1="15" y1="3.5" x2="15" y2="6.5" stroke={accentColor} strokeWidth="1.3" />
          <line x1="9" y1="17.5" x2="9" y2="20.5" stroke={accentColor} strokeWidth="1.3" />
          <line x1="15" y1="17.5" x2="15" y2="20.5" stroke={accentColor} strokeWidth="1.3" />
          <line x1="3.5" y1="9" x2="6.5" y2="9" stroke={accentColor} strokeWidth="1.3" />
          <line x1="3.5" y1="15" x2="6.5" y2="15" stroke={accentColor} strokeWidth="1.3" />
          <line x1="17.5" y1="9" x2="20.5" y2="9" stroke={accentColor} strokeWidth="1.3" />
          <line x1="17.5" y1="15" x2="20.5" y2="15" stroke={accentColor} strokeWidth="1.3" />
        </svg>
      )}

      {/* 4. Algorithm & Optimizer (Prism Node Logic Graph) */}
      {personaId === "algorithm-optimizer" && (
        <svg
          width={svgSize}
          height={svgSize}
          viewBox="0 0 24 24"
          fill="none"
          className="relative z-10"
        >
          {/* Outer Triangle Polygon */}
          <motion.polygon
            points="12,3 21,19 3,19"
            fill={`${accentColor}25`}
            stroke={accentColor}
            strokeWidth="1.3"
            animate={{ scale: [1, 1.04, 1] }}
            transition={{ duration: 2.6, repeat: Infinity, ease: "easeInOut" }}
            style={{ transformOrigin: "center" }}
          />
          {/* Dynamic Lightning / Graph Path */}
          <motion.path
            d="M12 7L10 13H14L12 18"
            stroke={accentColor}
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            animate={{ opacity: [0.75, 1, 0.75] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          />
        </svg>
      )}

      {/* Fallback Badge if custom ID */}
      {personaId !== "frontend-architect" &&
        personaId !== "fullstack-nextjs" &&
        personaId !== "python-ai-systems" &&
        personaId !== "algorithm-optimizer" && (
          <motion.span
            className="font-frozen font-bold select-none text-sm"
            style={{ color: accentColor }}
            animate={{ rotate: [0, 180, 360] }}
            transition={{ duration: 14, repeat: Infinity, ease: "linear" }}
          >
            ✦
          </motion.span>
        )}
    </motion.div>
  );
}
