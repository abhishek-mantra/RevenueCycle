"use client";

import React, { useState } from "react";
import { AppShell } from "@/components/layout/app-shell";
import { StatusBadge } from "@/components/ui/status-badge";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Sliders, Plus, CheckCircle2, ShieldCheck } from "lucide-react";

export default function AutomationRulesPage({ embedInShell }: any) {
  const [telehealthRule, setTelehealthRule] = useState(true);
  const [authRequiredRule, setAuthRequiredRule] = useState(true);

  const content = (
    <div className="space-y-6 select-none">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-[22px] font-extrabold tracking-tight text-[var(--foreground)]">
                Billing Scrub Rules Engine
              </h1>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] uppercase font-bold bg-[var(--accent-soft)] text-[var(--accent)] border border-black/5">
                Automation Config
              </span>
            </div>
            <p className="text-[13px] text-[var(--foreground-muted)] font-medium mt-1">
              Configure global and payer-specific claim scrubbing rules prior to clearinghouse submission.
            </p>
          </div>

          <Button variant="primary" size="sm" onClick={() => alert("Rule Builder opened")}>
            <Plus className="w-4 h-4" /> Add Scrubbing Rule
          </Button>
        </div>

        <div className="neu p-6 space-y-4">
          <h2 className="text-[15px] font-bold text-[var(--foreground)]">Active Payer & Global Scrub Rules</h2>

          <div className="divide-y divide-[var(--border)] border border-[var(--border)] rounded-2xl overflow-hidden bg-[var(--surface)]">
            <div className="p-4 flex items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="font-bold text-[14px] text-[var(--foreground)]">
                  Require Telehealth Modifier (95 / GT) for Code 90837
                </div>
                <p className="text-xs text-[var(--foreground-muted)] font-medium">
                  Applies to Blue Cross Blue Shield & Aetna telehealth claims. Prevents CARC 4 denials.
                </p>
              </div>
              <Switch checked={telehealthRule} onChange={setTelehealthRule} />
            </div>

            <div className="p-4 flex items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="font-bold text-[14px] text-[var(--foreground)]">
                  Block Submission if Prior Auth Exceeded
                </div>
                <p className="text-xs text-[var(--foreground-muted)] font-medium">
                  Verifies visit count against authorization caps before allowing 837 generation.
                </p>
              </div>
              <Switch checked={authRequiredRule} onChange={setAuthRequiredRule} />
            </div>
          </div>
        </div>
      </div>
  );

  return embedInShell ? content : <AppShell>{content}</AppShell>;
}
