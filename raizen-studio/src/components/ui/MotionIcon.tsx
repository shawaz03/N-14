"use client";

import React from "react";
import { motion, HTMLMotionProps, TargetAndTransition, Transition } from "framer-motion";
import { IconProps, IconWeight } from "@phosphor-icons/react";
import { cn } from "../../lib/utils";

export type MotionIconAnimation =
  | "bounce"
  | "tilt"
  | "spin"
  | "pulse"
  | "glance"
  | "float"
  | "none";

export interface MotionIconProps extends Omit<HTMLMotionProps<"span">, "children"> {
  icon: React.ComponentType<IconProps>;
  size?: number | string;
  weight?: IconWeight;
  animation?: MotionIconAnimation;
  className?: string;
  color?: string;
  mirrored?: boolean;
}

interface AnimationPreset {
  whileHover?: TargetAndTransition;
  whileTap?: TargetAndTransition;
  animate?: TargetAndTransition;
  transition?: Transition;
}

const animationVariants: Record<MotionIconAnimation, AnimationPreset> = {
  bounce: {
    whileHover: { scale: 1.15, y: -1.5 },
    whileTap: { scale: 0.9, y: 0 },
    transition: { type: "spring", stiffness: 420, damping: 16 },
  },
  tilt: {
    whileHover: { scale: 1.12, rotate: 12 },
    whileTap: { scale: 0.9, rotate: -6 },
    transition: { type: "spring", stiffness: 400, damping: 17 },
  },
  spin: {
    whileHover: { rotate: 180, scale: 1.12 },
    whileTap: { scale: 0.9 },
    transition: { type: "spring", stiffness: 350, damping: 18 },
  },
  pulse: {
    animate: {
      scale: [1, 1.08, 1],
      opacity: [0.9, 1, 0.9],
    },
    transition: {
      duration: 2.2,
      repeat: Infinity,
      ease: "easeInOut",
    },
    whileHover: { scale: 1.18 },
    whileTap: { scale: 0.9 },
  },
  glance: {
    whileHover: { x: 2.5, y: -2.5, scale: 1.08 },
    whileTap: { x: 0, y: 0, scale: 0.92 },
    transition: { type: "spring", stiffness: 450, damping: 18 },
  },
  float: {
    animate: {
      y: [0, -3, 0],
    },
    transition: {
      duration: 3,
      repeat: Infinity,
      ease: "easeInOut",
    },
    whileHover: { scale: 1.15, y: -4 },
    whileTap: { scale: 0.92 },
  },
  none: {
    whileHover: { scale: 1.04 },
    whileTap: { scale: 0.96 },
    transition: { type: "spring", stiffness: 400, damping: 20 },
  },
};

export function MotionIcon({
  icon: IconComponent,
  size = 16,
  weight = "duotone",
  animation = "bounce",
  className,
  color,
  mirrored = false,
  ...motionProps
}: MotionIconProps) {
  const preset = animationVariants[animation] || animationVariants.bounce;

  return (
    <motion.span
      className={cn("inline-flex items-center justify-center shrink-0 select-none", className)}
      whileHover={preset.whileHover}
      whileTap={preset.whileTap}
      animate={preset.animate}
      transition={preset.transition}
      {...motionProps}
    >
      <IconComponent
        size={size}
        weight={weight}
        color={color}
        mirrored={mirrored}
        className="w-full h-full"
      />
    </motion.span>
  );
}
