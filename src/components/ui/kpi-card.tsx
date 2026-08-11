"use client";

import React from "react";
import { motion } from "framer-motion";
import { clsx } from "clsx";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

export interface KpiCardProps {
  label: string;
  value: string | number;
  delta?: string;
  deltaType?: "increase" | "decrease" | "neutral";
  subtitle?: string;
  icon?: React.ReactNode;
  className?: string;
}

export const KpiCard: React.FC<KpiCardProps> = ({
  label,
  value,
  delta,
  deltaType = "neutral",
  subtitle,
  icon,
  className,
}) => {
  const getDeltaTone = () => {
    if (deltaType === "increase") return "text-[var(--status-success)] bg-[var(--status-success-bg)] border-[var(--status-success)]/15";
    if (deltaType === "decrease") return "text-[var(--status-critical)] bg-[var(--status-critical-bg)] border-[var(--status-critical)]/15";
    return "text-[var(--foreground-muted)] bg-[var(--surface-muted)] border-[var(--border)]";
  };

  const getDeltaIcon = () => {
    if (deltaType === "increase") return <TrendingUp className="w-3.5 h-3.5" />;
    if (deltaType === "decrease") return <TrendingDown className="w-3.5 h-3.5" />;
    return <Minus className="w-3.5 h-3.5" />;
  };

  return (
    <motion.div
      whileHover={{ y: -3, scale: 1.01 }}
      transition={{ type: "spring", stiffness: 350, damping: 25 }}
      className={clsx(
        "neu neu-hover p-5.5 flex flex-col justify-between select-none relative overflow-hidden group cursor-pointer",
        className
      )}
    >
      <div className="flex items-center justify-between gap-2 mb-3">
        <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--foreground-faint)]">
          {label}
        </span>
        {icon && (
          <div className="w-9 h-9 rounded-2xl neu-soft flex items-center justify-center text-[var(--foreground)] group-hover:scale-110 transition-transform">
            {icon}
          </div>
        )}
      </div>

      <div className="flex items-baseline justify-between gap-3 mt-1">
        <div className="text-[32px] font-black tracking-tight text-[var(--foreground)] tabular-nums">
          {value}
        </div>
        {delta && (
          <div className={clsx("inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold tracking-tight whitespace-nowrap shrink-0 border", getDeltaTone())}>
            {getDeltaIcon()}
            <span className="whitespace-nowrap">{delta}</span>
          </div>
        )}
      </div>

      {subtitle && (
        <div className="mt-2.5 text-[12px] text-[var(--foreground-muted)] font-medium">
          {subtitle}
        </div>
      )}
    </motion.div>
  );
};
