"use client";

import React, { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { clsx } from "clsx";

export interface GlassModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  children: React.ReactNode;
  maxWidth?: string;
}

export const GlassModal: React.FC<GlassModalProps> = ({
  isOpen,
  onClose,
  title,
  description,
  children,
  maxWidth = "max-w-lg",
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/30 backdrop-blur-md"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 12 }}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
            className={clsx(
              "glass-panel rounded-3xl p-7 relative z-10 shadow-2xl border border-white/90 select-none",
              maxWidth
            )}
          >
            <div className="flex items-start justify-between gap-4 pb-4 border-b border-[var(--border)] mb-5">
              <div>
                {title && (
                  <h3 className="text-[20px] font-black tracking-tight text-[var(--foreground)]">
                    {title}
                  </h3>
                )}
                {description && (
                  <p className="text-[13px] text-[var(--foreground-muted)] font-medium mt-1">
                    {description}
                  </p>
                )}
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-2xl neu-soft hover:bg-[var(--accent-soft)] text-[var(--foreground-muted)] hover:text-[var(--accent)] transition-all cursor-pointer shrink-0"
                aria-label="Close modal"
              >
                <X className="w-4.5 h-4.5" />
              </button>
            </div>

            <div>{children}</div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
