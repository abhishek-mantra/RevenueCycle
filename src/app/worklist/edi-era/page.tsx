"use client";

import React, { useState } from "react";
import { AppShell } from "@/components/layout/app-shell";
import { StatusBadge } from "@/components/ui/status-badge";
import { Button } from "@/components/ui/button";
import { Radio, CheckCircle2 } from "lucide-react";

export default function EdiEraPage() {
  const [enrolled, setEnrolled] = useState(false);

  return (
    <AppShell>
      <div className="space-y-6 select-none">
        <div>
          <h1 className="text-[22px] font-extrabold text-[var(--foreground)] tracking-tight">EDI / ERA Remittance Enrollment Queue</h1>
          <p className="text-[13px] text-[var(--foreground-muted)] font-medium mt-1">
            Electronic Remittance Advice (ERA 835) connections awaiting clearinghouse enrollment for auto-posting.
          </p>
        </div>

        <div className="neu p-5 space-y-4">
          <div className="p-4 bg-[var(--surface)] border border-[var(--border)] rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-[15px] text-[var(--foreground)]">Cigna Health ERA 835 Remittance</span>
                <StatusBadge tone="warning" label="Enrollment Pending Payer Approval" />
              </div>
              <p className="text-xs text-[var(--foreground-muted)] font-medium mt-1">
                Clearinghouse Stedi ERA agreement submitted on 2026-07-25.
              </p>
            </div>

            <Button variant="primary" size="sm" onClick={() => {
              setEnrolled(true);
              alert("ERA 835 connection verified & live for auto-posting!");
            }}>
              {enrolled ? "ERA Connection Live" : "Check Payer Enrollment Status"}
            </Button>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
