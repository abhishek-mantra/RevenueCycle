"use client";

import React, { useState } from "react";
import { AppShell } from "@/components/layout/app-shell";
import { KpiCard } from "@/components/ui/kpi-card";
import { StatusBadge } from "@/components/ui/status-badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { GlassModal } from "@/components/ui/glass-modal";
import { motion } from "framer-motion";
import {
  Upload,
  FileSpreadsheet,
  Building2,
  CheckCircle2,
  AlertTriangle,
  History,
  ShieldCheck,
  ArrowRight,
} from "lucide-react";

export default function OnboardingPage() {
  const [importStatus, setImportStatus] = useState<"idle" | "success">("idle");
  const [importedCount, setImportedCount] = useState(0);

  const handleSimulateImport = () => {
    setImportedCount(14);
    setImportStatus("success");
  };

  return (
    <AppShell>
      <div className="space-y-6 select-none">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-[22px] font-extrabold tracking-tight text-[var(--foreground)]">
                Migration & Shadow Mode Import
              </h1>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] uppercase font-bold bg-[var(--accent-soft)] text-[var(--accent)] border border-black/5">
                Legacy System Import
              </span>
            </div>
            <p className="text-[13px] text-[var(--foreground-muted)] font-medium mt-1">
              Import open A/R claims from SimplePractice, TherapyNotes, or Therabill into Shadow Mode without losing status tracking.
            </p>
          </div>
        </div>

        {/* CSV Import Surface */}
        <div className="neu p-6 space-y-4">
          <h2 className="text-[15px] font-bold text-[var(--foreground)] flex items-center gap-2">
            <FileSpreadsheet className="w-5 h-5 text-[var(--accent)]" />
            Upload Legacy Open A/R CSV File
          </h2>

          <div className="border-2 border-dashed border-[var(--border)] rounded-2xl p-8 text-center space-y-3 neu-pressed bg-transparent">
            <Upload className="w-10 h-10 text-[var(--accent)] mx-auto opacity-80" />
            <div>
              <div className="text-[14px] font-bold text-[var(--foreground)]">
                Drag and drop your legacy Open A/R export here
              </div>
              <p className="text-xs text-[var(--foreground-muted)] font-medium mt-1">
                Supports SimplePractice CSV, TherapyNotes export, or custom column mapping.
              </p>
            </div>

            <Button variant="primary" size="sm" onClick={handleSimulateImport}>
              Select CSV File to Import
            </Button>
          </div>

          {importStatus === "success" && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4 bg-[var(--status-success-bg)] border border-[var(--status-success)]/20 rounded-2xl flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-[var(--status-success)] shrink-0" />
                <div>
                  <div className="text-xs font-bold text-[var(--status-success)]">
                    Successfully imported {importedCount} claims-in-flight into Shadow Mode!
                  </div>
                  <p className="text-[11px] text-[var(--foreground-muted)] font-medium">
                    Imported claims are tagged with an "Imported" badge and tracked in your main worklist.
                  </p>
                </div>
              </div>

              <Button size="sm" variant="secondary" onClick={() => alert("Viewing imported shadow claims in worklist")}>
                View Imported Claims →
              </Button>
            </motion.div>
          )}
        </div>

        {/* Historical Superbill Reconstruction Path (PRD §8.0.2) */}
        <div className="neu p-6 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-[15px] font-bold text-[var(--foreground)] flex items-center gap-2">
              <History className="w-4 h-4 text-[var(--accent)]" />
              Historical Superbill Reconstruction
            </h3>
            <StatusBadge tone="neutral" label="Out-of-Network Fallback" />
          </div>

          <p className="text-xs text-[var(--foreground-muted)] font-medium">
            Generate itemized superbills for sessions documented before migration so clients seeking out-of-network reimbursement are never left stranded.
          </p>

          <Button size="sm" variant="secondary" onClick={() => alert("Opened Historical Superbill Generator")}>
            Generate Historical Superbill
          </Button>
        </div>
      </div>
    </AppShell>
  );
}
