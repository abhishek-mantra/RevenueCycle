"use client";

import React, { useState } from "react";
import { AppShell } from "@/components/layout/app-shell";
import { StatusBadge } from "@/components/ui/status-badge";
import { Button } from "@/components/ui/button";
import { AlertCircle, RotateCw } from "lucide-react";

export default function RejectionsPage() {
  const [resolved, setResolved] = useState(false);

  return (
    <AppShell>
      <div className="space-y-6 select-none">
        <div>
          <h1 className="text-[22px] font-extrabold text-[var(--foreground)] tracking-tight">Payer Rejections Queue</h1>
          <p className="text-[13px] text-[var(--foreground-muted)] font-medium mt-1">
            Claims received by payer but rejected prior to adjudication (e.g. member ID or DOB mismatch).
          </p>
        </div>

        <div className="neu p-5 space-y-4">
          <div className="p-4 bg-[var(--surface)] border border-[var(--border)] rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono font-bold text-xs">CLM-2026-9040</span>
                <StatusBadge tone="critical" label="Payer Pre-Adjudication Rejection" />
              </div>
              <p className="text-xs text-[var(--status-critical)] font-semibold mt-1">
                Rejection Reason: Patient DOB (1992-05-14) does not match payer eligibility file.
              </p>
            </div>

            <Button variant="primary" size="sm" onClick={() => {
              setResolved(true);
              alert("Corrected Patient DOB and re-filed claim!");
            }}>
              {resolved ? "DOB Corrected & Re-filed" : "Correct DOB & Re-file"}
            </Button>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
