"use client";

import React, { useState } from "react";
import { AppShell } from "@/components/layout/app-shell";
import { StatusBadge } from "@/components/ui/status-badge";
import { Button } from "@/components/ui/button";
import { Send, CheckCircle2 } from "lucide-react";

export default function SubmissionErrorsPage() {
  const [fixed, setFixed] = useState(false);

  return (
    <AppShell>
      <div className="space-y-6 select-none">
        <div>
          <h1 className="text-[22px] font-extrabold text-[var(--foreground)] tracking-tight">Submission Errors Queue</h1>
          <p className="text-[13px] text-[var(--foreground-muted)] font-medium mt-1">
            Claims rejected at clearinghouse format validation prior to reaching payer.
          </p>
        </div>

        <div className="neu p-5 space-y-4">
          <div className="p-4 bg-[var(--surface)] border border-[var(--border)] rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono font-bold text-xs">CLM-2026-9012</span>
                <StatusBadge tone="critical" label="Format Syntax Error" />
              </div>
              <p className="text-xs text-[var(--status-critical)] font-semibold mt-1">
                Clearinghouse 837P Segment Loop 2010AA taxonomy code missing.
              </p>
            </div>

            <Button variant="primary" size="sm" onClick={() => {
              setFixed(true);
              alert("Auto-inserted taxonomy 101YM0800X and re-submitted 837 claim!");
            }}>
              {fixed ? "Corrected & Sent" : "Auto-Fix Taxonomy & Resubmit"}
            </Button>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
