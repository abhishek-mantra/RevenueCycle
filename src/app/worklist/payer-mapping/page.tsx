"use client";

import React, { useState } from "react";
import { AppShell } from "@/components/layout/app-shell";
import { StatusBadge } from "@/components/ui/status-badge";
import { Button } from "@/components/ui/button";
import { CheckCircle2, GitMerge, Link2, ShieldAlert } from "lucide-react";

interface PayerMappingItem {
  id: string;
  rawPayerName: string;
  rawPayerId: string;
  heldClaimCount: number;
  totalHeldValue: number;
  suggestedClearinghouseId: string;
  suggestedClearinghouseName: string;
  status: "Unmapped" | "Mapped";
}

const initialPayerMappings: PayerMappingItem[] = [
  {
    id: "MAP-101",
    rawPayerName: "BCBS Texas Horizon Health",
    rawPayerId: "PAY-TEX-99",
    heldClaimCount: 3,
    totalHeldValue: 525.0,
    suggestedClearinghouseId: "00010 (BCBS National Clearinghouse)",
    suggestedClearinghouseName: "Stedi / Change Healthcare Payer #00010",
    status: "Unmapped",
  },
  {
    id: "MAP-102",
    rawPayerName: "Aetna Behavioral Direct Pay",
    rawPayerId: "PAY-AET-DIR",
    heldClaimCount: 2,
    totalHeldValue: 380.0,
    suggestedClearinghouseId: "60054 (Aetna Health Management)",
    suggestedClearinghouseName: "Availity Payer ID #60054",
    status: "Unmapped",
  },
  {
    id: "MAP-103",
    rawPayerName: "United Behavioral Health Plan NJ",
    rawPayerId: "PAY-UHC-BH",
    heldClaimCount: 1,
    totalHeldValue: 175.0,
    suggestedClearinghouseId: "87726 (Optum / UHC Behavioral)",
    suggestedClearinghouseName: "Optum Payer ID #87726",
    status: "Unmapped",
  },
  {
    id: "MAP-104",
    rawPayerName: "Cigna International Health Care",
    rawPayerId: "PAY-CIG-INTL",
    heldClaimCount: 1,
    totalHeldValue: 160.0,
    suggestedClearinghouseId: "62308 (Cigna Behavioral Health)",
    suggestedClearinghouseName: "Availity Payer ID #62308",
    status: "Unmapped",
  },
];

export default function PayerMappingPage({ embedInShell }: any) {
  const [items, setItems] = useState<PayerMappingItem[]>(initialPayerMappings);

  const handleMap = (id: string) => {
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, status: "Mapped" } : item))
    );
  };

  const handleRemove = (id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  const openCount = items.filter((i) => i.status === "Unmapped").length;

  const content = (
    <div className="space-y-6 select-none">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-[22px] font-extrabold text-[var(--foreground)] tracking-tight">Payer Mapping Queue</h1>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[var(--status-warning-bg)] text-[var(--status-warning)] border border-[var(--status-warning)]/20">
                {openCount} Unmapped Payers
              </span>
            </div>
            <p className="text-[13px] text-[var(--foreground-muted)] font-medium mt-1">
              Unrecognized EDI Payer IDs requiring one-time clearinghouse mapping rules before auto-dispatch.
            </p>
          </div>
        </div>

        <div className="space-y-3">
          {items.length === 0 ? (
            <div className="neu p-8 text-center space-y-2">
              <CheckCircle2 className="w-10 h-10 text-[var(--status-success)] mx-auto" />
              <h3 className="text-base font-bold text-[var(--foreground)]">All Payer IDs Mapped</h3>
              <p className="text-xs text-[var(--foreground-muted)]">No active unmapped EDI Payer IDs remaining in queue.</p>
            </div>
          ) : (
            items.map((item) => (
              <div key={item.id} className="neu p-5 space-y-3 border border-white/60">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-3 border-b border-[var(--border)]">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-[14px] text-[var(--foreground)]">{item.rawPayerName}</span>
                    <span className="font-mono text-xs text-[var(--foreground-muted)]">({item.rawPayerId})</span>
                    <StatusBadge
                      tone={item.status === "Mapped" ? "success" : "warning"}
                      label={item.status === "Mapped" ? "Mapped & Released" : "Mapping Needed"}
                    />
                  </div>
                  <div className="text-xs text-[var(--foreground-muted)] font-medium">
                    Held Claims: <span className="font-bold text-[var(--foreground)]">{item.heldClaimCount}</span> (${item.totalHeldValue.toFixed(2)})
                  </div>
                </div>

                <div className="p-3 neu-pressed rounded-2xl space-y-1.5 text-xs">
                  <div className="font-semibold text-[var(--foreground)] flex items-center gap-1.5">
                    <Link2 className="w-4 h-4 text-[var(--accent)] shrink-0" /> Target Clearinghouse Routing: {item.suggestedClearinghouseName}
                  </div>
                  <div className="text-[var(--foreground-muted)] pl-5 font-medium">
                    <span className="font-bold text-[var(--foreground)]">Recommended Mapping ID:</span> {item.suggestedClearinghouseId}
                  </div>
                </div>

                <div className="flex items-center justify-end gap-2 pt-1">
                  {item.status === "Unmapped" ? (
                    <Button variant="primary" size="sm" onClick={() => handleMap(item.id)}>
                      <GitMerge className="w-3.5 h-3.5 mr-1" /> Map & Release {item.heldClaimCount} Claims
                    </Button>
                  ) : (
                    <Button variant="secondary" size="sm" onClick={() => handleRemove(item.id)}>
                      Clear from Queue
                    </Button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
  );

  return embedInShell ? content : <AppShell>{content}</AppShell>;
}
