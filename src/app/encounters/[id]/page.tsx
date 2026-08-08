"use client";

import React, { use } from "react";
import Link from "next/link";
import { AppShell } from "@/components/layout/app-shell";
import { KpiCard } from "@/components/ui/kpi-card";
import { StatusBadge } from "@/components/ui/status-badge";
import { Button } from "@/components/ui/button";
import { mockEncounters } from "@/data/mockEncounters";
import {
  FileCheck2,
  DollarSign,
  ArrowLeft,
  FileText,
  UserCheck,
  Building2,
  Calendar,
  Layers,
  Sparkles,
  Receipt,
} from "lucide-react";

export default function EncounterDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const encounterIdParam = resolvedParams.id;

  const encounter =
    mockEncounters.find((e) => e.id === encounterIdParam || e.encounterId === encounterIdParam) ||
    mockEncounters[0];

  return (
    <AppShell>
      <div className="space-y-6 select-none">
        {/* Header Breadcrumb */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <Link
              href="/encounters"
              className="text-xs font-bold text-[var(--accent)] hover:underline flex items-center gap-1"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Back to Encounters List
            </Link>
            <div className="flex items-center gap-3 pt-1">
              <h1 className="text-[24px] font-extrabold tracking-tight text-[var(--foreground)]">
                Encounter {encounter.encounterId || encounter.id}
              </h1>
              <StatusBadge
                tone={encounter.status === "Completed" || encounter.status === "Reconciled" ? "success" : "warning"}
                label={encounter.status}
              />
            </div>
            <p className="text-[13px] text-[var(--foreground-muted)] font-medium">
              Patient: <strong className="text-[var(--foreground)]">{encounter.patientName}</strong> • Provider:{" "}
              <strong className="text-[var(--foreground)]">{encounter.providerName}</strong> • Service Date:{" "}
              {encounter.dos || encounter.serviceDate}
            </p>
          </div>
        </div>

        {/* Financial KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <KpiCard
            label="Total Gross Billed"
            value={`$${(encounter.totalCharges ?? 250).toFixed(2)}`}
            subtitle="Provider Charge Schedule"
            icon={<DollarSign className="w-5 h-5" />}
          />
          <KpiCard
            label="Insurance Payments (835)"
            value={`$${(encounter.insurancePaid ?? 145).toFixed(2)}`}
            delta="100% Posted"
            deltaType="increase"
            subtitle="Auto-reconciled ERA"
            icon={<FileCheck2 className="w-5 h-5" />}
          />
          <KpiCard
            label="Contract Write-Offs"
            value={`$${(encounter.adjustments ?? 75).toFixed(2)}`}
            subtitle="Contractual Allowance"
            icon={<Layers className="w-5 h-5" />}
          />
          <KpiCard
            label="Patient Responsibility"
            value={`$${(encounter.patientResponsibility ?? 30).toFixed(2)}`}
            delta="Decoupled AR"
            deltaType="neutral"
            subtitle="Co-pay / Deductible"
            icon={<UserCheck className="w-5 h-5" />}
          />
        </div>

        {/* Associated Downstream Entities */}
        <div className="neu p-5 space-y-4">
          <h3 className="text-[15px] font-bold text-[var(--foreground)] border-b border-[var(--border)] pb-2 flex items-center justify-between">
            <span>Linked Downstream Billing Records</span>
            <span className="text-xs font-bold text-[var(--accent)] flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5" /> Single Source of Truth
            </span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="p-4 neu-pressed rounded-2xl space-y-2">
              <div className="font-bold text-[var(--foreground)] flex items-center gap-1.5">
                <FileText className="w-4 h-4 text-[var(--accent)]" /> Associated 837P Claims
              </div>
              <div className="space-y-1">
                {encounter.claimIds.map((cid) => (
                  <div key={cid} className="flex items-center justify-between">
                    <span className="text-[var(--foreground-muted)]">Claim ID:</span>
                    <Link href={`/claims/${cid}`} className="font-mono font-bold text-[var(--accent)] hover:underline">
                      {cid} →
                    </Link>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-4 neu-pressed rounded-2xl space-y-2">
              <div className="font-bold text-[var(--foreground)] flex items-center gap-1.5">
                <Receipt className="w-4 h-4 text-[var(--status-success)]" /> Patient Statement / Invoice
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[var(--foreground-muted)]">Patient Invoice ID:</span>
                {encounter.invoiceId ? (
                  <Link href={`/invoicing/${encounter.invoiceId}`} className="font-mono font-bold text-[var(--accent)] hover:underline">
                    {encounter.invoiceId} →
                  </Link>
                ) : (
                  <span className="text-[var(--foreground-faint)] italic">No Patient AR Due</span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* EOB/ERA Line Items */}
        <div className="neu p-6 space-y-4">
          <h3 className="text-[15px] font-bold text-[var(--foreground)] border-b border-[var(--border)] pb-2">
            EOB / ERA Line Item Adjudication Breakdown
          </h3>

          <div className="divide-y divide-[var(--border)] border border-[var(--border)] rounded-2xl overflow-hidden bg-[var(--surface)]">
            {(encounter.lines || []).map((line, idx) => (
              <div key={idx} className="p-4 space-y-2">
                <div className="flex items-center justify-between text-xs font-bold">
                  <span>
                    CPT {line.cpt} — <span className="text-[var(--foreground-muted)] font-normal">{line.description}</span>
                  </span>
                  <span className="tabular-nums">Billed: ${line.charge.toFixed(2)} | Paid: ${line.paid.toFixed(2)}</span>
                </div>
                <div className="p-2.5 neu-pressed rounded-xl text-[11px] space-y-1">
                  <div className="font-mono font-bold text-[var(--accent)]">
                    CARC {line.carc}
                  </div>
                  <div className="text-[var(--foreground-muted)] font-medium">{line.plainEnglishReason}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AppShell>
  );
}
