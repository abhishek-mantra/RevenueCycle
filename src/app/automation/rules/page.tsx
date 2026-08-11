"use client";

import React from "react";
import Link from "next/link";
import { AppShell } from "@/components/layout/app-shell";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { StatusBadge } from "@/components/ui/status-badge";
import { useRcmDataStore } from "@/store/useRcmDataStore";
import { Plus, Sliders, ShieldCheck, Filter } from "lucide-react";

export default function AutomationRulesPage({ embedInShell }: any) {
  const { scrubRules, toggleScrubRule } = useRcmDataStore();

  const content = (
    <div className="space-y-6 select-none">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-[22px] font-extrabold tracking-tight text-[var(--foreground)]">
              Scrubbing Rules
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] uppercase font-bold bg-[var(--accent-soft)] text-[var(--accent)] border border-black/5">
              {scrubRules.filter((r) => r.enabled).length} Active Rules
            </span>
          </div>
          <p className="text-[13px] text-[var(--foreground-muted)] font-medium mt-1">
            Configure global and payer-specific claim scrubbing rules prior to clearinghouse submission.
          </p>
        </div>

        <Link href="/automation/rules/new">
          <Button variant="primary" size="sm">
            <Plus className="w-4 h-4" /> Add Scrubbing Rule
          </Button>
        </Link>
      </div>

      <div className="neu p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-[15px] font-bold text-[var(--foreground)] flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[var(--accent)]" /> Active Payer & Global Scrub Rules
          </h2>
          <span className="text-[11px] font-semibold text-[var(--foreground-muted)]">
            Total Rules: {scrubRules.length}
          </span>
        </div>

        <div className="divide-y divide-[var(--border)] border border-[var(--border)] rounded-2xl overflow-hidden bg-[var(--surface)] shadow-xs">
          {scrubRules.map((rule) => (
            <div key={rule.id} className="p-4 flex items-center justify-between gap-4 hover:bg-[var(--surface-muted)]/50 transition-colors">
              <div className="space-y-1.5 flex-1 pr-4">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-[14px] text-[var(--foreground)]">
                    {rule.ruleName}
                  </span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-[var(--surface-muted)] text-[var(--foreground-muted)] border border-[var(--border)]">
                    {rule.ruleType}
                  </span>
                  <span className="text-[11px] font-bold text-[var(--accent)]">
                    [{rule.targetPayer}]
                  </span>
                </div>
                <p className="text-xs text-[var(--foreground-muted)] font-medium">
                  {rule.description}
                </p>
                <div className="flex items-center gap-4 text-[10px] text-[var(--foreground-faint)] pt-1">
                  <span>Claims scrubbed: <strong>{rule.claimsScrubbedCount}</strong></span>
                  <span>Last triggered: {rule.lastTriggered}</span>
                </div>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                <StatusBadge
                  tone={rule.enabled ? "success" : "neutral"}
                  label={rule.enabled ? "Active" : "Disabled"}
                />
                <Switch
                  checked={rule.enabled}
                  onChange={() => toggleScrubRule(rule.id)}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  return embedInShell ? content : <AppShell>{content}</AppShell>;
}
