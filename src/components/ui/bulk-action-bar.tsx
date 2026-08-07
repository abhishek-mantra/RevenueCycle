"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "./button";
import { CheckCircle2, RotateCw, Mail, X } from "lucide-react";

export interface BulkActionBarProps {
  selectedCount: number;
  onClearSelection: () => void;
  onResubmit?: () => void;
  onSendStatement?: () => void;
}

export const BulkActionBar: React.FC<BulkActionBarProps> = ({
  selectedCount,
  onClearSelection,
  onResubmit,
  onSendStatement,
}) => {
  return (
    <AnimatePresence>
      {selectedCount > 0 && (
        <motion.div
          initial={{ y: 80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 80, opacity: 0 }}
          transition={{ type: "spring", stiffness: 350, damping: 25 }}
          className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 glass-panel px-5 py-3 shadow-2xl flex items-center gap-5 min-w-[380px] justify-between"
        >
          <div className="flex items-center gap-2">
            <span className="flex items-center justify-center w-6 h-6 rounded-full bg-[var(--accent)] text-[var(--accent-foreground)] text-xs font-bold tabular-nums">
              {selectedCount}
            </span>
            <span className="text-[13px] font-semibold text-[var(--foreground)]">
              {selectedCount === 1 ? "1 item selected" : `${selectedCount} items selected`}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {onResubmit && (
              <Button size="sm" variant="primary" onClick={onResubmit}>
                <RotateCw className="w-3.5 h-3.5" />
                Resubmit Selected
              </Button>
            )}

            {onSendStatement && (
              <Button size="sm" variant="secondary" onClick={onSendStatement}>
                <Mail className="w-3.5 h-3.5" />
                Send Statement
              </Button>
            )}

            <button
              onClick={onClearSelection}
              className="p-1 rounded-md text-[var(--foreground-muted)] hover:text-[var(--foreground)] hover:bg-[var(--accent-soft)] transition-colors cursor-pointer"
              title="Clear selection"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
