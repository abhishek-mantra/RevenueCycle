"use client";

import React, { useState } from "react";
import { AppShell } from "@/components/layout/app-shell";
import { KpiCard } from "@/components/ui/kpi-card";
import { StatusBadge } from "@/components/ui/status-badge";
import { Button } from "@/components/ui/button";
import { AlertOctagon, RefreshCw, FileText, CheckCircle2, ArrowRight } from "lucide-react";

export default function ImportErrorsPage({ embedInShell }: any) {
  const [items, setItems] = useState([
    { id: "ERR-1", eventId: "EVENT-8810", patient: "Sarah Jenkins", reason: "Missing required CPT procedure code in EHR note handoff", date: "2026-08-04" },
    { id: "ERR-2", eventId: "EVENT-8814", patient: "Michael Vance", reason: "Diagnosis pointer missing primary ICD-10 code F41.1", date: "2026-08-03" },
  ]);

  const content = (
    <div className="space-y-6 select-none">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-[22px] font-extrabold tracking-tight text-[var(--foreground)]">
                Import Error Exception Queue
              </h1>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] uppercase font-bold bg-[var(--status-critical-bg)] text-[var(--status-critical)] border border-black/5">
                Action Items Queue 1 of 6
              </span>
            </div>
            <p className="text-[13px] text-[var(--foreground-muted)] font-medium mt-1">
              Billable Events that failed initial claim generation due to missing source fields in the EHR handoff.
            </p>
          </div>
        </div>

        <div className="neu p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-[14px] font-bold text-[var(--foreground)]">Failed Event Handoffs ({items.length})</h2>
            <StatusBadge tone="critical" label="Action Required" />
          </div>

          <div className="divide-y divide-[var(--border)] border border-[var(--border)] rounded-2xl overflow-hidden bg-[var(--surface)]">
            {items.map((item) => (
              <div key={item.id} className="p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-xs px-2.5 py-0.5 rounded-full bg-[var(--accent-soft)] text-[var(--accent)]">
                      {item.eventId}
                    </span>
                    <h3 className="text-[15px] font-bold text-[var(--foreground)]">{item.patient}</h3>
                  </div>
                  <p className="text-xs text-[var(--status-critical)] font-semibold">
                    Error: {item.reason}
                  </p>
                </div>

                <Button size="sm" variant="primary" onClick={() => {
                  alert(`Re-extracted fields for ${item.eventId} from signed EHR note! Claim generated.`);
                  setItems(prev => prev.filter(i => i.id !== item.id));
                }}>
                  <RefreshCw className="w-3.5 h-3.5" /> Re-extract & Retry
                </Button>
              </div>
            ))}
          </div>
        </div>
      </div>
  );

  return embedInShell ? content : <AppShell>{content}</AppShell>;
}
