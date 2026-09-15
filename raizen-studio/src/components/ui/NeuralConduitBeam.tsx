"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Lightning, ShieldCheck } from "@phosphor-icons/react";
import { MotionIcon } from "./MotionIcon";
import { cn } from "../../lib/utils";

interface NeuralConduitBeamProps {
  isActive: boolean;
  latencyMs?: number | null;
  className?: string;
}

export function NeuralConduitBeam({
  isActive,
  latencyMs = null,
  className,
}: NeuralConduitBeamProps) {
  return (
    <>
      {/* 1. Laser Beam Sweep across input container */}
      <AnimatePresence>
        {isActive && (
          <motion.div
            key="conduit-laser-beam"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className={cn("absolute inset-0 pointer-events-none overflow-hidden rounded-pill z-10", className)}
          >
            {/* High-velocity luminous streak */}
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: "260%" }}
              transition={{
                duration: 1.1,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="w-1/3 h-full bg-gradient-to-r from-transparent via-emerald-400 to-transparent opacity-90 blur-[0.5px]"
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* 2. Floating High-Tech Telemetry HUD Toast */}
      <AnimatePresence>
        {isActive && (
          <motion.div
            key="conduit-hud-toast"
            initial={{ opacity: 0, y: -12, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 420, damping: 22 }}
            className="absolute top-14 left-1/2 -translate-x-1/2 z-50 px-4 py-1.5 bg-[#121316] border border-emerald-500/40 rounded-pill shadow-swiss-lg flex items-center gap-2.5 font-mono text-[11px] text-white select-none whitespace-nowrap backdrop-blur-md"
          >
            <div className="relative flex items-center justify-center w-2 h-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-80" />
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500" />
            </div>

            <div className="flex items-center gap-1.5 text-emerald-400 font-bold uppercase font-frozen text-[10.5px] tracking-wider">
              <MotionIcon icon={Lightning} size={13} weight="fill" animation="bounce" className="text-emerald-400" />
              <span>TUNNEL LOCKED</span>
            </div>

            <span className="text-white/30">•</span>

            <div className="flex items-center gap-1 text-gray-300 font-frozen text-[10px] tracking-wide">
              <MotionIcon icon={ShieldCheck} size={13} weight="duotone" className="text-swiss-saffron" />
              <span>TESLA T4 GPU</span>
            </div>

            {latencyMs !== null && (
              <>
                <span className="text-white/30">•</span>
                <span className="text-swiss-saffron font-bold text-[10px]">
                  {latencyMs}ms
                </span>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
