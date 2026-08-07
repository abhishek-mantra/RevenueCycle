"use client";

import React from "react";
import { motion, HTMLMotionProps } from "framer-motion";
import { clsx } from "clsx";

export interface ButtonProps extends Omit<HTMLMotionProps<"button">, "children"> {
  variant?: "primary" | "secondary" | "ghost" | "destructive";
  size?: "sm" | "md" | "lg";
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = "primary",
  size = "md",
  className,
  children,
  ...props
}) => {
  const baseStyles = "inline-flex items-center justify-center font-bold transition-all focus:outline-none focus:ring-2 focus:ring-[var(--accent)] disabled:opacity-50 disabled:pointer-events-none cursor-pointer select-none";
  
  const sizeStyles = {
    sm: "px-3.5 py-1.5 text-xs rounded-full gap-1.5",
    md: "px-4.5 py-2 text-sm rounded-full gap-2",
    lg: "px-6 py-2.5 text-base rounded-full gap-2.5",
  };

  const variantStyles = {
    primary: "bg-[#181e29] hover:bg-[#0a0e15] text-white shadow-sm border border-white/10",
    secondary: "neu-soft text-[var(--foreground)] hover:bg-[var(--surface-muted)]",
    ghost: "bg-transparent text-[var(--foreground-muted)] hover:text-[var(--foreground)] hover:bg-[var(--accent-soft)]",
    destructive: "bg-[var(--status-critical-bg)] text-[var(--status-critical)] border border-[var(--status-critical)]/20 hover:bg-[var(--status-critical)] hover:text-white",
  };

  return (
    <motion.button
      whileHover={{ y: -1.5, scale: 1.015 }}
      whileTap={{ scale: 0.97 }}
      transition={{ type: "spring", stiffness: 450, damping: 25 }}
      className={clsx(baseStyles, sizeStyles[size], variantStyles[variant], className)}
      {...props}
    >
      {children}
    </motion.button>
  );
};
