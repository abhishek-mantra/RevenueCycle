"use client";

import React, { useState } from "react";
import { AppShell } from "@/components/layout/app-shell";
import { KpiCard } from "@/components/ui/kpi-card";
import { StatusBadge } from "@/components/ui/status-badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { GlassModal } from "@/components/ui/glass-modal";
import { DataTable, Column } from "@/components/ui/data-table";
import { motion } from "framer-motion";
import {
  FileText,
  Clock,
  ShieldCheck,
  AlertTriangle,
  Search,
  Filter,
  CheckCircle2,
  AlertCircle,
  RotateCw,
  Send,
} from "lucide-react";

interface ClaimRecord {
  id: string;
  claimId: string;
  patientName: string;
  payerName: string;
  dos: string;
  submittedAmount: number;
  allowedAmount?: number;
  paidAmount?: number;
  status:
    | "Draft"
    | "Submitted"
    | "AwaitingAcknowledgement"
    | "InAdjudication"
    | "Paid"
    | "Denied";
  acknowledged: boolean;
  timelyDaysRemaining: number;
  source: "native" | "imported";
}

const mockClaimsList: ClaimRecord[] = [
  {
    id: "CLM-101",
    claimId: "CLM-2026-8910",
    patientName: "Sarah Jenkins",
    payerName: "Blue Cross Blue Shield",
    dos: "2026-08-04",
    submittedAmount: 175.0,
    allowedAmount: 145.0,
    paidAmount: 145.0,
    status: "Paid",
    acknowledged: true,
    timelyDaysRemaining: 85,
    source: "native",
  },
  {
    id: "CLM-102",
    claimId: "CLM-2026-8911",
    patientName: "Michael Vance",
    payerName: "Aetna Behavioral",
    dos: "2026-08-03",
    submittedAmount: 220.0,
    status: "AwaitingAcknowledgement",
    acknowledged: false,
    timelyDaysRemaining: 12,
    source: "native",
  },
  {
    id: "CLM-103",
    claimId: "CLM-2026-8912",
    patientName: "Elena Rostova",
    payerName: "United Healthcare",
    dos: "2026-08-02",
    submittedAmount: 140.0,
    status: "InAdjudication",
    acknowledged: true,
    timelyDaysRemaining: 24,
    source: "native",
  },
  {
    id: "CLM-104",
    claimId: "CLM-2026-8913",
    patientName: "David Miller",
    payerName: "Cigna Health",
    dos: "2026-08-01",
    submittedAmount: 195.0,
    status: "Denied",
    acknowledged: true,
    timelyDaysRemaining: 18,
    source: "imported",
  },
];

export default function ClaimsPage() {
  const [activeTab, setActiveTab] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeResubmitClaim, setActiveResubmitClaim] = useState<ClaimRecord | null>(null);

  const filteredClaims = mockClaimsList.filter((claim) => {
    const matchesSearch =
      claim.claimId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      claim.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      claim.payerName.toLowerCase().includes(searchQuery.toLowerCase());

    if (activeTab === "All") return matchesSearch;
    if (activeTab === "StuckAck") return matchesSearch && !claim.acknowledged;
    return matchesSearch && claim.status === activeTab;
  });

  const columns: Column<ClaimRecord>[] = [
    {
      key: "claimId",
      header: "Claim ID",
      accessor: (row) => (
        <div className="flex items-center gap-1.5">
          <span className="font-mono font-bold text-xs">{row.claimId}</span>
          {row.source === "imported" && (
            <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-[var(--surface-muted)] text-[var(--foreground-muted)] border border-[var(--border)]">
              Imported
            </span>
          )}
        </div>
      ),
      sortable: true,
    },
    {
      key: "patientName",
      header: "Patient",
      accessor: (row) => <span className="font-semibold text-[var(--foreground)]">{row.patientName}</span>,
      sortable: true,
    },
    {
      key: "payerName",
      header: "Payer",
      accessor: (row) => <span className="text-[var(--foreground-muted)] font-medium">{row.payerName}</span>,
      sortable: true,
    },
    {
      key: "dos",
      header: "Service Date",
      accessor: (row) => <span className="tabular-nums text-xs text-[var(--foreground-muted)]">{row.dos}</span>,
      sortable: true,
    },
    {
      key: "submittedAmount",
      header: "Billed",
      accessor: (row) => `$${row.submittedAmount.toFixed(2)}`,
      align: "right",
      sortable: true,
    },
    {
      key: "status",
      header: "Lifecycle Status",
      accessor: (row) => {
        if (row.status === "Paid") return <StatusBadge tone="success" label="Paid (ERA Posted)" />;
        if (row.status === "Denied") return <StatusBadge tone="critical" label="Denied — Action Req." />;
        if (row.status === "InAdjudication") return <StatusBadge tone="neutral" label="In Adjudication" />;
        if (row.status === "AwaitingAcknowledgement")
          return <StatusBadge tone="warning" label="Awaiting 999 Ack" />;
        return <StatusBadge tone="neutral" label="Draft" />;
      },
      align: "center",
    },
    {
      key: "ack",
      header: "Ack Monitored",
      accessor: (row) =>
        row.acknowledged ? (
          <span className="text-[11px] font-semibold text-[var(--status-success)] flex items-center justify-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" /> 999 Recvd
          </span>
        ) : (
          <span className="text-[11px] font-bold text-[var(--status-warning)] flex items-center justify-center gap-1 animate-pulse">
            <AlertCircle className="w-3.5 h-3.5" /> Stuck (No Ack)
          </span>
        ),
      align: "center",
    },
    {
      key: "actions",
      header: "Action",
      accessor: (row) => (
        <Button
          size="sm"
          variant="ghost"
          onClick={() => setActiveResubmitClaim(row)}
        >
          Resubmit / Edit
        </Button>
      ),
      align: "right",
    },
  ];

  return (
    <AppShell>
      <div className="space-y-6 select-none">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-[22px] font-extrabold tracking-tight text-[var(--foreground)]">
                Claim Submission & Lifecycle Tracker
              </h1>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] uppercase font-bold bg-[var(--accent-soft)] text-[var(--accent)] border border-black/5">
                Daily Operations
              </span>
            </div>
            <p className="text-[13px] text-[var(--foreground-muted)] font-medium mt-1">
              90% silent partner automatic submission flow with functional acknowledgement (999) monitoring.
            </p>
          </div>
        </div>

        {/* KPI Strip */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <KpiCard
            label="Total Submitted Claims"
            value="142"
            delta="+12 today"
            deltaType="increase"
            subtitle="90% touchless path"
            icon={<FileText className="w-5 h-5" />}
          />
          <KpiCard
            label="Clean Claim Rate"
            value="94.2%"
            delta="+1.5%"
            deltaType="increase"
            subtitle="First submission pass"
            icon={<ShieldCheck className="w-5 h-5" />}
          />
          <KpiCard
            label="Stuck Acknowledgements"
            value="1 Claim"
            delta="> 48h no 999"
            deltaType="decrease"
            subtitle="Prevents 30-day silent loss"
            icon={<AlertTriangle className="w-5 h-5" />}
          />
          <KpiCard
            label="Avg Days to Adjudication"
            value="11.4d"
            delta="-2.1d"
            deltaType="increase"
            subtitle="Payer response median"
            icon={<Clock className="w-5 h-5" />}
          />
        </div>

        {/* Filters & Table Surface */}
        <div className="neu p-5 space-y-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="relative w-full md:w-80">
              <Search className="w-4 h-4 absolute left-3.5 top-3 text-[var(--foreground-faint)]" />
              <input
                type="text"
                placeholder="Search patient, claim ID, or payer..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="neu-pressed pl-10 pr-4 py-2 text-[13px] text-[var(--foreground)] placeholder-[var(--foreground-faint)] w-full outline-none focus:ring-2 focus:ring-[var(--accent)] transition-all rounded-full"
              />
            </div>

            {/* Lifecycle Status Filter Tabs */}
            <div className="neu-pressed p-1 rounded-full flex items-center gap-1 text-[12px] overflow-x-auto">
              {["All", "InAdjudication", "Paid", "Denied", "StuckAck"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-3.5 py-1 rounded-full transition-all cursor-pointer font-bold shrink-0 ${
                    activeTab === tab
                      ? "bg-[var(--accent)] text-white shadow-xs"
                      : "text-[var(--foreground-muted)] hover:text-[var(--foreground)]"
                  }`}
                >
                  {tab === "InAdjudication"
                    ? "In Adjudication"
                    : tab === "StuckAck"
                    ? "Stuck (No Ack)"
                    : tab}
                </button>
              ))}
            </div>
          </div>

          <DataTable columns={columns} data={filteredClaims} />
        </div>

        {/* Resubmit Modal */}
        <GlassModal
          isOpen={!!activeResubmitClaim}
          onClose={() => setActiveResubmitClaim(null)}
          title={`Correct & Resubmit Claim — ${activeResubmitClaim?.claimId}`}
          description={`Patient: ${activeResubmitClaim?.patientName} — Payer: ${activeResubmitClaim?.payerName}`}
        >
          {activeResubmitClaim && (
            <div className="space-y-4">
              <div className="p-3.5 neu-pressed rounded-2xl space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-[var(--foreground-muted)]">Billed Amount:</span>
                  <span className="font-bold tabular-nums">${activeResubmitClaim.submittedAmount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[var(--foreground-muted)]">Original Frequency Code:</span>
                  <span className="font-mono font-bold">1 (Original Submission)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[var(--foreground-muted)]">Resubmission Frequency Code:</span>
                  <span className="font-mono font-bold text-[var(--accent)]">7 (Replacement Claim)</span>
                </div>
              </div>

              <Input
                label="Payer Control Number (PCCN / Claim Control #)"
                defaultValue="PCCN-90412891"
              />

              <div className="flex justify-end gap-2 pt-2">
                <Button variant="secondary" size="sm" onClick={() => setActiveResubmitClaim(null)}>
                  Cancel
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => {
                    alert(`Claim ${activeResubmitClaim.claimId} resubmitted with PCCN!`);
                    setActiveResubmitClaim(null);
                  }}
                >
                  <Send className="w-3.5 h-3.5" />
                  Submit Replacement Claim
                </Button>
              </div>
            </div>
          )}
        </GlassModal>
      </div>
    </AppShell>
  );
}
