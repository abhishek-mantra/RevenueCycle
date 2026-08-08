"use client";

import React, { useState } from "react";
import { AppShell } from "@/components/layout/app-shell";
import { StatusBadge } from "@/components/ui/status-badge";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { FileCheck, ShieldCheck, ScanLine, CheckCircle2, RefreshCw } from "lucide-react";

interface OcrIntakeItem {
  id: string;
  patientName: string;
  cardImageName: string;
  uploadTimestamp: string;
  extractedPayer: string;
  extractedMemberId: string;
  extractedGroup: string;
  confidenceScore: number;
  status: "ReviewNeeded" | "Verified";
}

const initialOcrItems: OcrIntakeItem[] = [
  {
    id: "OCR-101",
    patientName: "Michael Vance",
    cardImageName: "aetna_front_card_0803.png",
    uploadTimestamp: "Today, 10:14 AM",
    extractedPayer: "Aetna Behavioral Health",
    extractedMemberId: "AET-90124-01",
    extractedGroup: "GRP-99201",
    confidenceScore: 98.4,
    status: "ReviewNeeded",
  },
  {
    id: "OCR-102",
    patientName: "Elena Rostova",
    cardImageName: "cigna_card_0802.jpg",
    uploadTimestamp: "Today, 09:30 AM",
    extractedPayer: "Cigna Health",
    extractedMemberId: "CIG-441209",
    extractedGroup: "GRP-10492",
    confidenceScore: 94.2,
    status: "ReviewNeeded",
  },
  {
    id: "OCR-103",
    patientName: "David Miller",
    cardImageName: "bcbs_tx_photo.heic",
    uploadTimestamp: "Yesterday, 04:15 PM",
    extractedPayer: "Blue Cross Blue Shield TX",
    extractedMemberId: "W9920141",
    extractedGroup: "GRP-33100",
    confidenceScore: 89.1,
    status: "ReviewNeeded",
  },
];

export default function InsuranceIntakePage({ embedInShell }: any) {
  const [autoVerifyOcr, setAutoVerifyOcr] = useState(true);
  const [auto270Check, setAuto270Check] = useState(true);
  const [items, setItems] = useState<OcrIntakeItem[]>(initialOcrItems);

  const handleApprove = (id: string) => {
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, status: "Verified" } : item))
    );
  };

  const handleRemove = (id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  const pendingCount = items.filter((i) => i.status === "ReviewNeeded").length;

  const content = (
    <div className="space-y-6 select-none">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-[22px] font-extrabold text-[var(--foreground)] tracking-tight">Insurance Intake & OCR Rules</h1>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[var(--accent-soft)] text-[var(--accent)] border border-black/5">
                AI Vision Engine
              </span>
            </div>
            <p className="text-[13px] text-[var(--foreground-muted)] font-medium mt-1">
              Automated insurance card photo OCR extraction, Member ID parsing, and 270 real-time eligibility verification.
            </p>
          </div>
        </div>

        {/* Global OCR Config Rules Bar */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="neu p-4 flex items-center justify-between">
            <div className="space-y-0.5">
              <div className="font-bold text-xs text-[var(--foreground)] flex items-center gap-1.5">
                <ScanLine className="w-4 h-4 text-[var(--accent)]" /> Auto-Extract Insurance Card Photo OCR
              </div>
              <p className="text-[11px] text-[var(--foreground-muted)]">Parses Payer Name, Member ID, and Group # from uploaded images.</p>
            </div>
            <Switch checked={autoVerifyOcr} onChange={setAutoVerifyOcr} />
          </div>

          <div className="neu p-4 flex items-center justify-between">
            <div className="space-y-0.5">
              <div className="font-bold text-xs text-[var(--foreground)] flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-[var(--status-success)]" /> Instant 270 Eligibility Verification
              </div>
              <p className="text-[11px] text-[var(--foreground-muted)]">Dispatches 270 check automatically upon card extraction.</p>
            </div>
            <Switch checked={auto270Check} onChange={setAuto270Check} />
          </div>
        </div>

        {/* Active OCR Card Extraction Queue */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-[14px] font-bold text-[var(--foreground)]">Pending Insurance Card OCR Review Queue</h3>
            <span className="text-xs font-bold text-[var(--foreground-muted)]">{pendingCount} Cards Pending Review</span>
          </div>

          {items.length === 0 ? (
            <div className="neu p-8 text-center space-y-2">
              <CheckCircle2 className="w-10 h-10 text-[var(--status-success)] mx-auto" />
              <h3 className="text-base font-bold text-[var(--foreground)]">All Card Extractions Verified</h3>
              <p className="text-xs text-[var(--foreground-muted)]">No active insurance card photo extractions awaiting review.</p>
            </div>
          ) : (
            items.map((item) => (
              <div key={item.id} className="neu p-5 space-y-3 border border-white/60">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-3 border-b border-[var(--border)]">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-[14px] text-[var(--foreground)]">{item.patientName}</span>
                    <StatusBadge
                      tone={item.status === "Verified" ? "success" : "neutral"}
                      label={item.status === "Verified" ? "EHR File Updated" : `OCR Confidence: ${item.confidenceScore}%`}
                    />
                  </div>
                  <div className="text-xs text-[var(--foreground-muted)] font-medium">
                    Uploaded: {item.uploadTimestamp} | File: <span className="font-mono text-[var(--foreground)]">{item.cardImageName}</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                  <div className="neu-pressed p-3 rounded-2xl">
                    <div className="text-[10px] font-bold uppercase tracking-wider text-[var(--foreground-faint)]">Parsed Payer</div>
                    <div className="font-bold text-[var(--foreground)] mt-0.5">{item.extractedPayer}</div>
                  </div>

                  <div className="neu-pressed p-3 rounded-2xl">
                    <div className="text-[10px] font-bold uppercase tracking-wider text-[var(--foreground-faint)]">Extracted Member ID</div>
                    <div className="font-mono font-bold text-[var(--accent)] mt-0.5">{item.extractedMemberId}</div>
                  </div>

                  <div className="neu-pressed p-3 rounded-2xl">
                    <div className="text-[10px] font-bold uppercase tracking-wider text-[var(--foreground-faint)]">Extracted Group #</div>
                    <div className="font-mono font-bold text-[var(--foreground)] mt-0.5">{item.extractedGroup}</div>
                  </div>
                </div>

                <div className="flex items-center justify-end gap-2 pt-1">
                  {item.status === "ReviewNeeded" ? (
                    <Button variant="primary" size="sm" onClick={() => handleApprove(item.id)}>
                      <FileCheck className="w-3.5 h-3.5 mr-1" /> Confirm OCR Data & Attach to EHR
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
