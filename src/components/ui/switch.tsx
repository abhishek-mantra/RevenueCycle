import React from "react";
import { clsx } from "clsx";

export interface SwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  className?: string;
}

export const Switch: React.FC<SwitchProps> = ({ checked, onChange, label, className }) => {
  return (
    <label className={clsx("inline-flex items-center gap-2.5 cursor-pointer select-none", className)}>
      <div
        onClick={() => onChange(!checked)}
        className={clsx(
          "w-11 h-6 rounded-full transition-colors p-0.5 relative cursor-pointer",
          checked ? "bg-[var(--accent)] shadow-inner" : "neu-soft"
        )}
      >
        <div
          className={clsx(
            "w-5 h-5 rounded-full bg-white transition-transform transform shadow-sm",
            checked ? "translate-x-5" : "translate-x-0"
          )}
        />
      </div>
      {label && <span className="text-[13px] font-medium text-[var(--foreground)]">{label}</span>}
    </label>
  );
};
