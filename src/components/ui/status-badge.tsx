import React from "react";
import { clsx } from "clsx";

export type StatusTone = "success" | "warning" | "critical" | "neutral" | "accent";

export interface StatusBadgeProps {
  tone?: StatusTone;
  label: string;
  showDot?: boolean;
  className?: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  tone = "neutral",
  label,
  showDot = true,
  className,
}) => {
  const toneStyles: Record<StatusTone, { bg: string; text: string; dot: string }> = {
    success: {
      bg: "bg-[var(--status-success-bg)]",
      text: "text-[var(--status-success)]",
      dot: "bg-[var(--status-success)]",
    },
    warning: {
      bg: "bg-[var(--status-warning-bg)]",
      text: "text-[var(--status-warning)]",
      dot: "bg-[var(--status-warning)]",
    },
    critical: {
      bg: "bg-[var(--status-critical-bg)]",
      text: "text-[var(--status-critical)]",
      dot: "bg-[var(--status-critical)]",
    },
    neutral: {
      bg: "bg-[var(--status-neutral-bg)]",
      text: "text-[var(--status-neutral)]",
      dot: "bg-[var(--status-neutral)]",
    },
    accent: {
      bg: "bg-[var(--accent-soft)]",
      text: "text-[var(--accent)]",
      dot: "bg-[var(--accent)]",
    },
  };

  const current = toneStyles[tone];

  return (
    <span
      className={clsx(
        "inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[12px] font-medium tracking-tight border border-current/10",
        current.bg,
        current.text,
        className
      )}
    >
      {showDot && <span className={clsx("w-1.5 h-1.5 rounded-full shrink-0", current.dot)} />}
      <span>{label}</span>
    </span>
  );
};
