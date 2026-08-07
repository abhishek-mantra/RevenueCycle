"use client";

import React, { useState } from "react";
import { AppShell } from "@/components/layout/app-shell";
import { StatusBadge } from "@/components/ui/status-badge";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { UserCheck, CreditCard } from "lucide-react";

export default function PatientFlowPage() {
  const [autoCopay, setAutoCopay] = useState(true);

  return (
    <AppShell>
      <div className="space-y-6 select-none">
        <div>
          <h1 className="text-[22px] font-extrabold text-[var(--foreground)] tracking-tight">Pre-Visit Patient Flow Rules</h1>
          <p className="text-[13px] text-[var(--foreground-muted)] font-medium mt-1">
            Configure automated pre-session SMS/email copay collection and intake forms.
          </p>
        </div>

        <div className="neu p-5 space-y-4">
          <div className="p-4 bg-[var(--surface)] border border-[var(--border)] rounded-2xl flex items-center justify-between">
            <div className="space-y-1">
              <div className="font-bold text-sm text-[var(--foreground)]">Auto-Send Pre-Session Copay Request SMS</div>
              <p className="text-xs text-[var(--foreground-muted)]">Dispatches pay-by-link text 24h prior to appointment start time.</p>
            </div>
            <Switch checked={autoCopay} onChange={setAutoCopay} />
          </div>
        </div>
      </div>
    </AppShell>
  );
}
