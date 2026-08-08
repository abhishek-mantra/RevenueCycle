"use client";

import React, { useState } from "react";
import Link from "next/link";
import { AppShell } from "@/components/layout/app-shell";
import { StatusBadge } from "@/components/ui/status-badge";
import { Button } from "@/components/ui/button";
import { CheckCircle2, RotateCw, AlertOctagon, UserX, CalendarX, ShieldAlert } from "lucide-react";

interface RejectionItem {
  id: string;
  claimId: string;
  patientName: string;
  payerName: string;
  dos: string;
  rejectionCode: string;
  rejectionReason: string;
  suggestedAction: string;
  status: "PendingCorrection" | "Resubmitted";
}

const initialRejections: RejectionItem[] = [
  {
    id: "REJ-101",
    claimId: "CLM-2026-9041",
    patientName: "Amanda Hayes",
    payerName: "Aetna Behavioral Health",
    dos: "2026-07-29",
    rejectionCode: "277-A7:254",
    rejectionReason: "Patient Date of Birth (1992-05-14) does not match Aetna eligibility record.",
    suggestedAction: "Update Patient DOB in EHR demographics to 1992-05-12 and resubmit.",
    status: "PendingCorrection",
  },
  {
    id: "REJ-102",
    claimId: "CLM-2026-8812",
    patientName: "Sarah Jenkins",
    payerName: "Blue Cross Blue Shield",
    dos: "2026-07-28",
    rejectionCode: "277-A7:140",
    rejectionReason: "Subscriber Member ID prefix invalid or terminated for service date.",
    suggestedAction: "Verify secondary insurance policy group ID and re-file 837P.",
    status: "PendingCorrection",
  },
  {
    id: "REJ-103",
    claimId: "CLM-2026-9045",
    patientName: "Robert Chen",
    payerName: "Aetna Behavioral Health",
    dos: "2026-07-28",
    rejectionCode: "277-A7:33",
    rejectionReason: "Attending Provider NPI missing taxonomy code for Telehealth Billing.",
    suggestedAction: "Attach behavioral health taxonomy 101YM0800X to provider profile.",
    status: "PendingCorrection",
  },
  {
    id: "REJ-104",
    claimId: "CLM-2026-7719",
    patientName: "Jessica Taylor",
    payerName: "United Healthcare",
    dos: "2026-07-22",
    rejectionCode: "277-A7:507",
    rejectionReason: "Patient Relationship to Subscriber specified as Dependent but policy lists Self.",
    suggestedAction: "Adjust Relationship Code to 18 (Self) in clearinghouse portal.",
    status: "PendingCorrection",
  },
];

export default function RejectionsPage({ embedInShell }: any) {
  const [items, setItems] = useState<RejectionItem[]>(initialRejections);

  const handleResolve = (id: string) => {
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, status: "Resubmitted" } : item))
    );
  };

  const handleRemove = (id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  const openCount = items.filter((i) => i.status === "PendingCorrection").length;

  const content = (
    <div className="space-y-6 select-none">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-[22px] font-extrabold text-[var(--foreground)] tracking-tight">Payer Rejections Queue</h1>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[var(--status-critical-bg)] text-[var(--status-critical)] border border-[var(--status-critical)]/20">
                {openCount} Open Rejections
              </span>
            </div>
            <p className="text-[13px] text-[var(--foreground-muted)] font-medium mt-1">
              Claims rejected by clearinghouse/payer pre-adjudication front-end edits prior to 835 ERA generation.
            </p>
          </div>
        </div>

        <div className="space-y-3">
          {items.length === 0 ? (
            <div className="neu p-8 text-center space-y-2">
              <CheckCircle2 className="w-10 h-10 text-[var(--status-success)] mx-auto" />
              <h3 className="text-base font-bold text-[var(--foreground)]">All Payer Rejections Resolved</h3>
              <p className="text-xs text-[var(--foreground-muted)]">No active front-end rejection edits remaining in queue.</p>
            </div>
          ) : (
            items.map((item) => (
              <div key={item.id} className="neu p-5 space-y-3 border border-white/60">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-3 border-b border-[var(--border)]">
                  <div className="flex items-center gap-2">
                    <Link href={`/claims/${item.claimId}`} className="font-mono font-bold text-xs text-[var(--accent)] hover:underline">
                      {item.claimId}
                    </Link>
                    <StatusBadge
                      tone={item.status === "Resubmitted" ? "success" : "critical"}
                      label={item.status === "Resubmitted" ? "Corrected & Resubmitted" : "Pre-Adjudication Rejection"}
                    />
                    <span className="text-xs text-[var(--foreground-muted)] font-medium">• {item.payerName}</span>
                  </div>
                  <div className="text-xs text-[var(--foreground-muted)] font-medium">
                    DOS: {item.dos} | Patient: <span className="font-bold text-[var(--foreground)]">{item.patientName}</span>
                  </div>
                </div>

                <div className="p-3 neu-pressed rounded-2xl space-y-1.5 text-xs">
                  <div className="font-bold text-[var(--status-critical)] flex items-center gap-1.5">
                    <ShieldAlert className="w-4 h-4 shrink-0" /> Edit Code {item.rejectionCode}: {item.rejectionReason}
                  </div>
                  <div className="text-[var(--foreground-muted)] pl-5 font-medium">
                    <span className="font-bold text-[var(--foreground)]">Suggested Fix:</span> {item.suggestedAction}
                  </div>
                </div>

                <div className="flex items-center justify-end gap-2 pt-1">
                  {item.status === "PendingCorrection" ? (
                    <Button variant="primary" size="sm" onClick={() => handleResolve(item.id)}>
                      <RotateCw className="w-3.5 h-3.5 mr-1" /> Correct & Re-file 837P
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
