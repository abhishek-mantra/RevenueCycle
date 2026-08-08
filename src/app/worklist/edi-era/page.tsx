"use client";

import React, { useState } from "react";
import { AppShell } from "@/components/layout/app-shell";
import { StatusBadge } from "@/components/ui/status-badge";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Radio, Zap, ShieldCheck } from "lucide-react";

interface EdiEraItem {
  id: string;
  payerName: string;
  transactionType: "ERA 835 (Auto-Posting)" | "EFT 835 (Direct Deposit)" | "EDI 837 (Claims)";
  submissionDate: string;
  clearinghousePartner: string;
  status: "PendingPayerApproval" | "ActiveLive";
}

const initialEdiEraItems: EdiEraItem[] = [
  {
    id: "ERA-101",
    payerName: "Cigna Behavioral Health",
    transactionType: "ERA 835 (Auto-Posting)",
    submissionDate: "2026-07-25",
    clearinghousePartner: "Stedi EDI Gateway",
    status: "PendingPayerApproval",
  },
  {
    id: "ERA-102",
    payerName: "Aetna Behavioral Health",
    transactionType: "EFT 835 (Direct Deposit)",
    submissionDate: "2026-07-28",
    clearinghousePartner: "Availity Portal",
    status: "PendingPayerApproval",
  },
  {
    id: "ERA-103",
    payerName: "Optum / United Healthcare",
    transactionType: "ERA 835 (Auto-Posting)",
    submissionDate: "2026-07-20",
    clearinghousePartner: "Optum Direct",
    status: "PendingPayerApproval",
  },
  {
    id: "ERA-104",
    payerName: "Horizon BCBS New Jersey",
    transactionType: "EDI 837 (Claims)",
    submissionDate: "2026-08-01",
    clearinghousePartner: "Change Healthcare",
    status: "PendingPayerApproval",
  },
];

export default function EdiEraPage({ embedInShell }: any) {
  const [items, setItems] = useState<EdiEraItem[]>(initialEdiEraItems);

  const handleVerify = (id: string) => {
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, status: "ActiveLive" } : item))
    );
  };

  const handleRemove = (id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  const openCount = items.filter((i) => i.status === "PendingPayerApproval").length;

  const content = (
    <div className="space-y-6 select-none">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-[22px] font-extrabold text-[var(--foreground)] tracking-tight">EDI / ERA Remittance Enrollment Queue</h1>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[var(--status-warning-bg)] text-[var(--status-warning)] border border-[var(--status-warning)]/20">
                {openCount} Pending Enrollments
              </span>
            </div>
            <p className="text-[13px] text-[var(--foreground-muted)] font-medium mt-1">
              Electronic Remittance Advice (ERA 835) & EFT connections awaiting clearinghouse enrollment for touchless auto-posting.
            </p>
          </div>
        </div>

        <div className="space-y-3">
          {items.length === 0 ? (
            <div className="neu p-8 text-center space-y-2">
              <CheckCircle2 className="w-10 h-10 text-[var(--status-success)] mx-auto" />
              <h3 className="text-base font-bold text-[var(--foreground)]">All ERA / EDI Connections Active</h3>
              <p className="text-xs text-[var(--foreground-muted)]">No pending clearinghouse remittance agreements remaining in queue.</p>
            </div>
          ) : (
            items.map((item) => (
              <div key={item.id} className="neu p-5 space-y-3 border border-white/60">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-3 border-b border-[var(--border)]">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-[14px] text-[var(--foreground)]">{item.payerName}</span>
                    <StatusBadge
                      tone={item.status === "ActiveLive" ? "success" : "warning"}
                      label={item.status === "ActiveLive" ? "ERA Live & Connected" : "Pending Payer Approval"}
                    />
                  </div>
                  <div className="text-xs text-[var(--foreground-muted)] font-medium">
                    Submitted: {item.submissionDate} | Gateway: <span className="font-bold text-[var(--foreground)]">{item.clearinghousePartner}</span>
                  </div>
                </div>

                <div className="p-3 neu-pressed rounded-2xl space-y-1.5 text-xs">
                  <div className="font-bold text-[var(--accent)] flex items-center gap-1.5">
                    <Radio className="w-4 h-4 text-[var(--status-warning)] shrink-0" /> {item.transactionType}
                  </div>
                  <div className="text-[var(--foreground-muted)] pl-5 font-medium">
                    Enables 100% touchless ERA 835 remittance auto-reconciliation directly to patient encounters.
                  </div>
                </div>

                <div className="flex items-center justify-end gap-2 pt-1">
                  {item.status === "PendingPayerApproval" ? (
                    <Button variant="primary" size="sm" onClick={() => handleVerify(item.id)}>
                      <ShieldCheck className="w-3.5 h-3.5 mr-1" /> Check Payer Status & Activate ERA
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
