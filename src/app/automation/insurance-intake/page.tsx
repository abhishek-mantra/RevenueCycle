"use client";

import React, { useState } from "react";
import { AppShell } from "@/components/layout/app-shell";
import { StatusBadge } from "@/components/ui/status-badge";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { FileCheck, ShieldCheck } from "lucide-react";

export default function InsuranceIntakePage() {
  const [ocrVerification, setOcrVerification] = useState(true);

  return (
    <AppShell>
      <div className="space-y-6 select-none">
        <div>
          <h1 className="text-[22px] font-extrabold text-[var(--foreground)] tracking-tight">Insurance Intake & OCR Rules</h1>
          <p className="text-[13px] text-[var(--foreground-muted)] font-medium mt-1">
            Automated insurance card photo OCR extraction and 270 real-time eligibility checking.
          </p>
        </div>

        <div className="neu p-5 space-y-4">
          <div className="p-4 bg-[var(--surface)] border border-[var(--border)] rounded-2xl flex items-center justify-between">
            <div className="space-y-1">
              <div className="font-bold text-sm text-[var(--foreground)]">Real-Time OCR Insurance Card Verification</div>
              <p className="text-xs text-[var(--foreground-muted)]">Extract Member ID, Group #, and Payer Name automatically upon photo upload.</p>
            </div>
            <Switch checked={ocrVerification} onChange={setOcrVerification} />
          </div>
        </div>
      </div>
    </AppShell>
  );
}
