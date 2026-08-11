"use client";

import React, { useState } from "react";
import Link from "next/link";
import { AppShell } from "@/components/layout/app-shell";
import { KpiCard } from "@/components/ui/kpi-card";
import { StatusBadge } from "@/components/ui/status-badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { GlassModal } from "@/components/ui/glass-modal";
import { DataTable, Column } from "@/components/ui/data-table";
import { BulkActionBar } from "@/components/ui/bulk-action-bar";
import { useRcmDataStore } from "@/store/useRcmDataStore";
import { formatDate } from "@/lib/formatDate";
import { Claim } from "@/schema/claimSchema";
import {
  FileText,
  Clock,
  ShieldCheck,
  AlertTriangle,
  Search,
  CheckCircle2,
  AlertCircle,
  RotateCw,
  Send,
  ExternalLink,
} from "lucide-react";

export default function ClaimsPage() {
  const { claims, resubmitClaims } = useRcmDataStore();

  const [activeTab, setActiveTab] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeResubmitClaim, setActiveResubmitClaim] = useState<Claim | null>(null);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const filteredClaims = claims.filter((claim) => {
    const matchesSearch =
      claim.claimId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      claim.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      claim.payerName.toLowerCase().includes(searchQuery.toLowerCase());

    if (activeTab === "All") return matchesSearch;
    if (activeTab === "StuckAck") return matchesSearch && claim.status === "AwaitingAcknowledgement";
    return matchesSearch && claim.status === activeTab;
  });

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleSelectRow = (id: string, selected: boolean) => {
    setSelectedIds((prev) =>
      selected ? [...prev, id] : prev.filter((item) => item !== id)
    );
  };

  const handleSelectAll = (selected: boolean) => {
    if (selected) {
      setSelectedIds(filteredClaims.map((c) => c.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleBatchResubmit = () => {
    resubmitClaims(selectedIds);
    showToast(`Batch resubmitted ${selectedIds.length} claims! Status updated to In Adjudication.`);
    setSelectedIds([]);
  };

  const columns: Column<Claim>[] = [
    {
      key: "claimId",
      header: "Claim ID",
      accessor: (row) => (
        <div className="flex items-center gap-1.5">
          <Link
            href={`/claims/${row.claimId}`}
            className="font-mono font-bold text-xs text-[var(--accent)] hover:underline flex items-center gap-1 group"
          >
            <span>{row.claimId}</span>
            <ExternalLink className="w-3 h-3 opacity-70 group-hover:opacity-100" />
          </Link>
        </div>
      ),
      sortable: true,
    },
    {
      key: "patientName",
      header: "Patient",
      accessor: (row) => (
        <Link href={`/claims/${row.claimId}`} className="font-semibold text-[var(--foreground)] hover:text-[var(--accent)] transition-colors">
          {row.patientName}
        </Link>
      ),
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
      accessor: (row) => <span className="tabular-nums text-xs text-[var(--foreground-muted)]">{formatDate(row.serviceDate || row.dos)}</span>,
      sortable: true,
    },
    {
      key: "submittedAmount",
      header: "Billed",
      accessor: (row) => `$${(row.submittedAmount ?? row.billedAmount ?? 0).toFixed(2)}`,
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
        {/* Toast Notification Banner */}
        {toastMessage && (
          <div className="fixed bottom-6 right-6 z-50 px-4 py-3 rounded-2xl bg-[var(--accent)] text-white font-bold text-xs shadow-2xl flex items-center gap-2 animate-bounce">
            <CheckCircle2 className="w-4 h-4" /> {toastMessage}
          </div>
        )}

        {/* Header (8.18 - Simplified Title & Subtitle) */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-[22px] font-extrabold tracking-tight text-[var(--foreground)]">
                Claims
              </h1>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] uppercase font-bold bg-[var(--accent-soft)] text-[var(--accent)] border border-black/5">
                Daily Operations
              </span>
            </div>
            <p className="text-[13px] text-[var(--foreground-muted)] font-medium mt-1">
              Track claims from submission through payer acknowledgement and ERA posting.
            </p>
          </div>
        </div>

        {/* KPI Strip */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <KpiCard
            label="Total Submitted Claims"
            value={`${claims.length}`}
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
            value={`${claims.filter((c) => !c.acknowledged).length} Claims`}
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
                aria-label="Search claims"
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

          <DataTable
            columns={columns}
            data={filteredClaims}
            selectedIds={selectedIds}
            onSelectRow={handleSelectRow}
            onSelectAll={handleSelectAll}
            pageSize={10}
          />
        </div>

        {/* Bulk Action Bar (8.11) */}
        <BulkActionBar
          selectedCount={selectedIds.length}
          onClearSelection={() => setSelectedIds([])}
          onResubmit={handleBatchResubmit}
        />

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
                  <span className="font-bold tabular-nums">${(activeResubmitClaim.submittedAmount ?? activeResubmitClaim.billedAmount ?? 0).toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[var(--foreground-muted)]">Resubmission Frequency Code:</span>
                  <span className="font-mono font-bold text-[var(--accent)]">7 (Replacement Claim)</span>
                </div>
              </div>

              <Input
                label="Payer Control Number (PCCN / Claim Control #)"
                defaultValue={activeResubmitClaim.pccn || "PCCN-90412891"}
              />

              <div className="flex justify-end gap-2 pt-2">
                <Button variant="secondary" size="sm" onClick={() => setActiveResubmitClaim(null)}>
                  Cancel
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => {
                    resubmitClaims([activeResubmitClaim.claimId]);
                    showToast(`Claim ${activeResubmitClaim.claimId} corrected and resubmitted!`);
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
