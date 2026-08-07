"use client";

import React, { useState } from "react";
import { KpiCard } from "@/components/ui/kpi-card";
import { StatusBadge } from "@/components/ui/status-badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { DataTable, Column } from "@/components/ui/data-table";
import { GlassModal } from "@/components/ui/glass-modal";
import { BulkActionBar } from "@/components/ui/bulk-action-bar";
import { DollarSign, ShieldCheck, AlertCircle, Clock, Sparkles, Layers, SlidersHorizontal } from "lucide-react";

interface SampleClaim {
  id: string;
  claimId: string;
  patientName: string;
  payer: string;
  dos: string;
  cptCode: string;
  amount: number;
  status: "Paid" | "Denied" | "InAdjudication" | "Draft";
  priority: "Critical" | "Standard";
}

const mockClaims: SampleClaim[] = [
  {
    id: "CLM-901",
    claimId: "CLM-2026-901",
    patientName: "Sarah Jenkins",
    payer: "Blue Cross Blue Shield",
    dos: "2026-08-05",
    cptCode: "90837 (60m Psychotherapy)",
    amount: 175.0,
    status: "Paid",
    priority: "Standard",
  },
  {
    id: "CLM-902",
    claimId: "CLM-2026-902",
    patientName: "Michael Vance",
    payer: "Aetna Behavioral",
    dos: "2026-08-04",
    cptCode: "90791 (Intake Eval)",
    amount: 220.0,
    status: "Denied",
    priority: "Critical",
  },
  {
    id: "CLM-903",
    claimId: "CLM-2026-903",
    patientName: "Elena Rostova",
    payer: "United Healthcare",
    dos: "2026-08-03",
    cptCode: "90834 (45m Psychotherapy)",
    amount: 140.0,
    status: "InAdjudication",
    priority: "Standard",
  },
  {
    id: "CLM-904",
    claimId: "CLM-2026-904",
    patientName: "David Kim",
    payer: "Cigna Health",
    dos: "2026-08-02",
    cptCode: "90837 + 90785",
    amount: 195.0,
    status: "Draft",
    priority: "Standard",
  },
];

export default function SandboxPage() {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [autoSubmit, setAutoSubmit] = useState(true);
  const [searchValue, setSearchValue] = useState("");

  const handleSelectRow = (id: string, selected: boolean) => {
    if (selected) {
      setSelectedIds((prev) => [...prev, id]);
    } else {
      setSelectedIds((prev) => prev.filter((item) => item !== id));
    }
  };

  const handleSelectAll = (selected: boolean) => {
    if (selected) {
      setSelectedIds(mockClaims.map((c) => c.id));
    } else {
      setSelectedIds([]);
    }
  };

  const columns: Column<SampleClaim>[] = [
    {
      key: "claimId",
      header: "Claim ID",
      accessor: (row) => <span className="font-mono text-xs font-semibold">{row.claimId}</span>,
      sortable: true,
    },
    {
      key: "patientName",
      header: "Patient",
      accessor: (row) => <span className="font-medium text-[var(--foreground)]">{row.patientName}</span>,
      sortable: true,
    },
    {
      key: "payer",
      header: "Payer",
      accessor: (row) => <span className="text-[var(--foreground-muted)]">{row.payer}</span>,
      sortable: true,
    },
    {
      key: "dos",
      header: "Date of Service",
      accessor: (row) => <span className="tabular-nums text-xs">{row.dos}</span>,
      sortable: true,
    },
    {
      key: "cptCode",
      header: "Service / CPT",
      accessor: (row) => <span className="text-xs text-[var(--foreground-muted)]">{row.cptCode}</span>,
    },
    {
      key: "amount",
      header: "Amount",
      accessor: (row) => `$${row.amount.toFixed(2)}`,
      align: "right",
      sortable: true,
    },
    {
      key: "status",
      header: "Status",
      accessor: (row) => {
        if (row.status === "Paid") return <StatusBadge tone="success" label="Paid" />;
        if (row.status === "Denied") return <StatusBadge tone="critical" label="Denied (CARC 16)" />;
        if (row.status === "InAdjudication") return <StatusBadge tone="warning" label="In Adjudication" />;
        return <StatusBadge tone="neutral" label="Draft" />;
      },
      align: "center",
    },
  ];

  return (
    <div className="relative min-h-screen p-6 max-w-7xl mx-auto space-y-8">
      {/* Floating Glass Chrome Header */}
      <header className="glass-chrome p-4 flex items-center justify-between sticky top-4 z-30 shadow-lg">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-[var(--accent)] text-[var(--accent-foreground)] flex items-center justify-center font-bold text-lg shadow-sm">
            M
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-[16px] font-bold tracking-tight text-[var(--foreground)]">
                MantraCare RCM
              </h1>
              <span className="px-2 py-0.5 rounded-full text-[10px] uppercase font-bold tracking-wider bg-[var(--accent-soft)] text-[var(--accent)] border border-[var(--accent)]/20">
                Milestone 1 — Design Sandbox
              </span>
            </div>
            <p className="text-[12px] text-[var(--foreground-muted)]">
              Light Monochrome Neumorphism + Glassmorphism Chrome Architecture
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Button variant="secondary" size="sm" onClick={() => setIsModalOpen(true)}>
            <Sparkles className="w-4 h-4 text-[var(--accent)]" />
            Test Glass Modal
          </Button>
          <Button variant="primary" size="sm">
            Primary Action
          </Button>
        </div>
      </header>

      {/* Section 1: Signature Neumorphic KPI Cards */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-[12px] font-semibold uppercase tracking-wider text-[var(--foreground-faint)] flex items-center gap-1.5">
            <Layers className="w-4 h-4 text-[var(--accent)]" />
            Neumorphic Material (Soft-Extrude Cards)
          </h2>
          <span className="text-[12px] text-[var(--foreground-faint)]">
            Same-color base + Dual soft shadows
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          <KpiCard
            label="Net Collection Rate"
            value="98.4%"
            delta="+2.1%"
            deltaType="increase"
            subtitle="vs. 96.3% prior 30d period"
            icon={<DollarSign className="w-5 h-5" />}
          />
          <KpiCard
            label="Clean Claim Rate"
            value="94.2%"
            delta="+1.5%"
            deltaType="increase"
            subtitle="Target: >90% touchless"
            icon={<ShieldCheck className="w-5 h-5" />}
          />
          <KpiCard
            label="Denial Rate"
            value="4.8%"
            delta="-0.9%"
            deltaType="increase"
            subtitle="Clustered by root cause"
            icon={<AlertCircle className="w-5 h-5" />}
          />
          <KpiCard
            label="Days in A/R"
            value="18.4d"
            delta="-2.4d"
            deltaType="increase"
            subtitle="Industry average: 35d"
            icon={<Clock className="w-5 h-5" />}
          />
        </div>
      </section>

      {/* Section 2: Recessed Inset Controls */}
      <section className="neu p-6 space-y-4">
        <h2 className="text-[14px] font-bold text-[var(--foreground)] flex items-center gap-2">
          <SlidersHorizontal className="w-4 h-4 text-[var(--accent)]" />
          Interactive Inset Form Controls & Toggles
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 items-end">
          <Input
            label="Search Claims & Encounters"
            placeholder="Type patient, claim ID, or CPT..."
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
          />

          <div className="neu-pressed px-3.5 py-2 rounded-lg text-[13px] text-[var(--foreground)] flex items-center justify-between">
            <span className="text-[var(--foreground-muted)] text-[12px]">Filter Payer:</span>
            <span className="font-medium">All Payers (BCBS, Aetna, UHC)</span>
          </div>

          <div className="flex items-center h-10 px-3">
            <Switch
              checked={autoSubmit}
              onChange={setAutoSubmit}
              label="Enable 90% Silent-Partner Auto Submission"
            />
          </div>
        </div>
      </section>

      {/* Section 3: Athelas Flat Data Table Surface */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-[12px] font-semibold uppercase tracking-wider text-[var(--foreground-faint)]">
            Flat Data Surface (Data Legibility)
          </h2>
          <span className="text-[12px] text-[var(--foreground-faint)]">
            Opaque surface + Hairline borders + 13px primary text
          </span>
        </div>

        <DataTable
          columns={columns}
          data={mockClaims}
          selectedIds={selectedIds}
          onSelectRow={handleSelectRow}
          onSelectAll={handleSelectAll}
          onRowClick={(row) => console.log("Clicked row", row)}
        />
      </section>

      {/* Floating Bulk Action Bar (Triggers when rows selected) */}
      <BulkActionBar
        selectedCount={selectedIds.length}
        onClearSelection={() => setSelectedIds([])}
        onResubmit={() => alert(`Resubmitting ${selectedIds.length} claims in batch!`)}
        onSendStatement={() => alert(`Sending statements for ${selectedIds.length} claims`)}
      />

      {/* Test Glass Modal */}
      <GlassModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Eligibility & Benefit Detail"
        description="Payer: Blue Cross Blue Shield — Member ID: W2048591"
      >
        <div className="space-y-4">
          <div className="p-3.5 neu-pressed rounded-lg space-y-2">
            <div className="flex justify-between text-xs">
              <span className="text-[var(--foreground-muted)]">Active Coverage:</span>
              <span className="font-semibold text-[var(--status-success)]">Eligible — In Network</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-[var(--foreground-muted)]">Copay per Session:</span>
              <span className="font-semibold tabular-nums">$30.00</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-[var(--foreground-muted)]">Deductible Remaining:</span>
              <span className="font-semibold tabular-nums">$250.00 / $1,000.00</span>
            </div>
          </div>

          <p className="text-xs text-[var(--foreground-muted)]">
            This modal demonstrates true backdrop glassmorphism (<code className="text-[var(--accent)] font-semibold">backdrop-filter: blur(28px)</code>) with hairline border and inner highlight.
          </p>

          <div className="flex justify-end gap-2 pt-2">
            <Button variant="secondary" size="sm" onClick={() => setIsModalOpen(false)}>
              Close
            </Button>
            <Button variant="primary" size="sm" onClick={() => setIsModalOpen(false)}>
              Confirm Coverage
            </Button>
          </div>
        </div>
      </GlassModal>
    </div>
  );
}
