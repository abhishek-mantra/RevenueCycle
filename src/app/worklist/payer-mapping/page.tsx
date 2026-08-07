"use client";

import React, { useState } from "react";
import { AppShell } from "@/components/layout/app-shell";
import { StatusBadge } from "@/components/ui/status-badge";
import { Button } from "@/components/ui/button";
import { FileX2, CheckCircle2 } from "lucide-react";

export default function PayerMappingPage() {
  const [mapped, setMapped] = useState(false);

  return (
    <AppShell>
      <div className="space-y-6 select-none">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-[22px] font-extrabold text-[var(--foreground)] tracking-tight">Payer Mapping Queue</h1>
            <p className="text-[13px] text-[var(--foreground-muted)] font-medium mt-1">
              Unmapped payer IDs requiring one-time clearinghouse ID mapping before auto-submission.
            </p>
          </div>
        </div>

        <div className="neu p-5 space-y-4">
          <div className="p-4 bg-[var(--surface)] border border-[var(--border)] rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-[15px] text-[var(--foreground)]">Unrecognized Payer ID: PAY-UNKNOWN-99</span>
                <StatusBadge tone="warning" label="Mapping Needed" />
              </div>
              <p className="text-xs text-[var(--foreground-muted)] font-medium mt-1">
                3 Claims held waiting for clearinghouse mapping to Stedi / Alliance ID.
              </p>
            </div>

            <Button variant="primary" size="sm" onClick={() => {
              setMapped(true);
              alert("Mapped Payer PAY-UNKNOWN-99 to BCBS Clearinghouse ID 00010!");
            }}>
              {mapped ? "Mapped & Released" : "Map to BCBS ID 00010"}
            </Button>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
