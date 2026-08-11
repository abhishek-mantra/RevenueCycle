"use client";

import React, { useState } from "react";
import Link from "next/link";
import { AppShell } from "@/components/layout/app-shell";
import { StatusBadge } from "@/components/ui/status-badge";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/formatDate";
import { CheckCircle2, FileCode, Wrench } from "lucide-react";

interface SubmissionErrorItem {
  id: string;
  claimId: string;
  patientName: string;
  payerName: string;
  dos: string;
  segmentError: string;
  errorDescription: string;
  fixAction: string;
  status: "PendingCorrection" | "Transmitted";
}

const initialSubmissionErrors: SubmissionErrorItem[] = [
  {
    id: "SUB-101",
    claimId: "CLM-2026-8912",
    patientName: "Michael Vance",
    payerName: "Aetna Behavioral Health",
    dos: "2026-08-03",
    segmentError: "Loop 2010AA Segment PRV03",
    errorDescription: "Billing Provider Taxonomy Code missing required 10-character X12 format.",
    fixAction: "Auto-insert Taxonomy 101YM0800X into Loop 2010AA and validate X12 5010 schema.",
    status: "PendingCorrection",
  },
  {
    id: "SUB-102",
    claimId: "CLM-2026-8815",
    patientName: "Michael Vance",
    payerName: "Blue Cross Blue Shield",
    dos: "2026-07-27",
    segmentError: "Loop 2310B Segment NPI",
    errorDescription: "Rendering Provider NPI (PRV-10) contains non-numeric characters.",
    fixAction: "Clean NPI string to 10-digit numeric ID 1982049102.",
    status: "PendingCorrection",
  },
  {
    id: "SUB-103",
    claimId: "CLM-2026-9045",
    patientName: "Robert Chen",
    payerName: "Aetna Behavioral Health",
    dos: "2026-07-28",
    segmentError: "Loop 2300 Segment CLM05-1",
    errorDescription: "Facility Code / Place of Service (POS 11) missing 02 (Telehealth) indicator.",
    fixAction: "Update POS code from 11 (Office) to 02 (Telehealth) in Loop 2300.",
    status: "PendingCorrection",
  },
  {
    id: "SUB-104",
    claimId: "CLM-2026-8910",
    patientName: "Elena Rostova",
    payerName: "Cigna Health",
    dos: "2026-08-01",
    segmentError: "Loop 2010BA Segment N403",
    errorDescription: "Subscriber Zip Code contains 4 digits instead of valid 5 or 9-digit format.",
    fixAction: "Lookup & append 5-digit Zip 07030 from USPS database API.",
    status: "PendingCorrection",
  },
];

export default function SubmissionErrorsPage({ embedInShell }: any) {
  const [items, setItems] = useState<SubmissionErrorItem[]>(initialSubmissionErrors);

  const handleFix = (id: string) => {
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, status: "Transmitted" } : item))
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
            <h1 className="text-[22px] font-extrabold text-[var(--foreground)] tracking-tight">Submission Errors Queue</h1>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[var(--status-critical-bg)] text-[var(--status-critical)] border border-[var(--status-critical)]/20">
              {openCount} EDI Syntax Errors
            </span>
          </div>
          <p className="text-[13px] text-[var(--foreground-muted)] font-medium mt-1">
            Clearinghouse X12 5010 837P file validation errors caught prior to batch transmission.
          </p>
        </div>
      </div>

      <div className="space-y-3">
        {items.length === 0 ? (
          <div className="neu p-8 text-center space-y-2">
            <CheckCircle2 className="w-10 h-10 text-[var(--status-success)] mx-auto" />
            <h3 className="text-base font-bold text-[var(--foreground)]">All Submission Syntax Errors Resolved</h3>
            <p className="text-xs text-[var(--foreground-muted)]">No active EDI 837P syntax errors remaining in clearinghouse queue.</p>
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
                    tone={item.status === "Transmitted" ? "success" : "warning"}
                    label={item.status === "Transmitted" ? "Corrected & Transmitted" : "EDI Syntax Error"}
                  />
                  <span className="text-xs text-[var(--foreground-muted)] font-medium">• {item.payerName}</span>
                </div>
                <div className="text-xs text-[var(--foreground-muted)] font-medium">
                  DOS: {formatDate(item.dos)} | Patient: <span className="font-bold text-[var(--foreground)]">{item.patientName}</span>
                </div>
              </div>

              <div className="p-3 neu-pressed rounded-2xl space-y-1.5 text-xs">
                <div className="font-mono font-bold text-[var(--accent)] flex items-center gap-1.5">
                  <FileCode className="w-4 h-4 shrink-0" /> {item.segmentError}: {item.errorDescription}
                </div>
                <div className="text-[var(--foreground-muted)] pl-5 font-medium">
                  <span className="font-bold text-[var(--foreground)]">Automated Repair:</span> {item.fixAction}
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-1">
                {item.status === "PendingCorrection" ? (
                  <Button variant="primary" size="sm" onClick={() => handleFix(item.id)}>
                    <Wrench className="w-3.5 h-3.5 mr-1" /> Auto-Fix EDI Syntax & Re-batch
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
