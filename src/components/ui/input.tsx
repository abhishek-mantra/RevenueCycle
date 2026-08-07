import React from "react";
import { clsx } from "clsx";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helperText, className, ...props }, ref) => {
    return (
      <div className="flex flex-col gap-1.5 w-full">
        {label && (
          <label className="text-[12px] font-medium text-[var(--foreground-muted)]">
            {label}
          </label>
        )}
        <input
          ref={ref}
          className={clsx(
            "neu-pressed px-3.5 py-2 text-[14px] text-[var(--foreground)] placeholder-[var(--foreground-faint)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)] transition-all disabled:opacity-50",
            error && "ring-1 ring-[var(--status-critical)]",
            className
          )}
          {...props}
        />
        {error ? (
          <span className="text-[12px] text-[var(--status-critical)]">{error}</span>
        ) : helperText ? (
          <span className="text-[12px] text-[var(--foreground-faint)]">{helperText}</span>
        ) : null}
      </div>
    );
  }
);

Input.displayName = "Input";
