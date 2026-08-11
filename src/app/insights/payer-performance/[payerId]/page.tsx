"use client";

import React, { use } from "react";
import Link from "next/link";
import { AppShell } from "@/components/layout/app-shell";
import { KpiCard } from "@/components/ui/kpi-card";
import { StatusBadge } from "@/components/ui/status-badge";
import { useRcmDataStore } from "@/store/useRcmDataStore";
import { mockPayerPerformance, mockContractVariances } from "@/data/mockAnalytics";
import { ArrowLeft, ShieldCheck, DollarSign, Clock, FileText, CheckCircle2, AlertCircle } from "lucide-react";

export default function PayerContractDetailPage({ params }: { params: Promise<{ payerId: string }> }) {
  const resolvedParams = use(params);
  const payerIdParam = resolvedParams.payerId;
  const { claims } = useRcmDataStore();

  const payer = mockPayerPerformance.find(
    (p) => p.id === payerIdParam || p.payerName.toLowerCase().replace(/ /g, "-") === payerIdParam.toLowerCase()
  );

  if (!payer) {
    return (
      <AppShell>
        <div className="max-w-xl mx-auto py-16 text-center space-y-4">
          <div className="neu p-8 rounded-3xl bg-[var(--surface)] space-y-4 select-none">
            <AlertCircle className="w-12 h-12 text-[var(--status-critical)] mx-auto" />
            <h2 className="text-[20px] font-extrabold text-[var(--foreground)]">Payer Contract Not Found</h2>
            <p className="text-xs text-[var(--foreground-muted)] font-medium">
              No active contract metrics found for payer ID: <span className="font-mono font-bold">{payerIdParam}</span>
            </p>
            <Link href="/insights/payer-performance">
              <button className="px-4 py-2 rounded-xl bg-[var(--accent)] text-white font-bold text-xs hover:bg-[var(--accent-hover)] transition-all cursor-pointer">
                Return to Payer Performance
              </button>
            </Link>
          </div>
        </div>
      </AppShell>
    );
  }

  const payerClaims = claims.filter((c) => c.payerName.toLowerCase().includes(payer.payerName.toLowerCase().split(" ")[0]));
  const livePaid = payerClaims.reduce((acc, c) => acc + (c.paidAmount || 0), 0);
  const liveBilled = payerClaims.reduce((acc, c) => acc + (c.billedAmount || c.submittedAmount || 0), 0);

  const variances = mockContractVariances.filter(
    (v) => v.payerName.toLowerCase() === payer.payerName.toLowerCase()
  );

  return (
    <AppShell>
      <div className="space-y-6 select-none max-w-4xl mx-auto">
        {/* Navigation & Header */}
        <div className="space-y-1">
          <Link
            href="/insights/payer-performance"
            className="text-xs font-bold text-[var(--accent)] hover:underline flex items-center gap-1"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Payer Performance
          </Link>
          <div className="flex items-center gap-3 pt-1">
            <h1 className="text-[24px] font-extrabold tracking-tight text-[var(--foreground)]">
              {payer.payerName} — Contract Analysis
            </h1>
            <StatusBadge tone={payer.statusTone} label={`${payer.approvalRate30d}% Approval Rate`} />
          </div>
          <p className="text-[13px] text-[var(--foreground-muted)] font-medium">
            Contracted Fee Schedule, Payment Velocity & Adjudication Rules Audit
          </p>
        </div>

        {/* KPI Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <KpiCard
            label="Effective Hourly Rate"
            value={`$${payer.effectiveHourlyRate.toFixed(2)}/hr`}
            subtitle="Practice Panel ROI"
            icon={<DollarSign className="w-5 h-5" />}
          />
          <KpiCard
            label="30-Day Approval Rate"
            value={`${payer.approvalRate30d}%`}
            subtitle="First-Pass Clean Claim"
            icon={<ShieldCheck className="w-5 h-5" />}
          />
          <KpiCard
            label="Avg Days-to-Pay"
            value={`${payer.avgDaysToPay} Days`}
            subtitle="Submission to ERA"
            icon={<Clock className="w-5 h-5" />}
          />
          <KpiCard
            label="Patient Mix %"
            value={`${payer.patientMixPct}%`}
            subtitle="Practice Panel Share"
            icon={<FileText className="w-5 h-5" />}
          />
        </div>

        {/* Contracted Fee Schedule Rules */}
        <div className="neu p-6 space-y-4 bg-[var(--surface)]">
          <h2 className="text-[15px] font-bold text-[var(--foreground)] border-b border-[var(--border)] pb-2">
            Active Contracted Fee Schedule & Rules
          </h2>

          <div className="space-y-3 text-xs">
            <div className="p-4 neu-pressed rounded-2xl space-y-1">
              <div className="font-bold text-[var(--foreground)] text-[13px]">
                CPT 90837 — 60-Minute Psychotherapy Session
              </div>
              <div className="flex items-center justify-between text-[var(--foreground-muted)] pt-1">
                <span>Contracted Rate: <strong className="text-[var(--foreground)]">$140.00</strong></span>
                <span>Timely Filing Limit: <strong className="text-[var(--foreground)]">90 Days</strong></span>
                <span>Prior Auth Requirement: <strong className="text-[var(--status-success)]">Not Required</strong></span>
              </div>
            </div>

            <div className="p-4 neu-pressed rounded-2xl space-y-1">
              <div className="font-bold text-[var(--foreground)] text-[13px]">
                CPT 90791 — Psychiatric Diagnostic Evaluation
              </div>
              <div className="flex items-center justify-between text-[var(--foreground-muted)] pt-1">
                <span>Contracted Rate: <strong className="text-[var(--foreground)]">$180.00</strong></span>
                <span>Timely Filing Limit: <strong className="text-[var(--foreground)]">90 Days</strong></span>
                <span>Prior Auth Requirement: <strong className="text-[var(--status-warning)] flex items-center gap-1 inline-flex"><CheckCircle2 className="w-3 h-3" /> Auth Required</strong></span>
              </div>
            </div>
          </div>
        </div>

        {/* Contract Variance History */}
        {variances.length > 0 && (
          <div className="neu p-6 space-y-4 bg-[var(--surface)]">
            <h2 className="text-[15px] font-bold text-[var(--foreground)] border-b border-[var(--border)] pb-2">
              Detected Underpayment Variances ({variances.length})
            </h2>

            <div className="divide-y divide-[var(--border)] border border-[var(--border)] rounded-2xl overflow-hidden text-xs">
              {variances.map((v) => (
                <div key={v.id} className="p-4 flex items-center justify-between">
                  <div>
                    <div className="font-bold text-[var(--foreground)]">
                      Claim {v.claimId} — CPT {v.cptCode}
                    </div>
                    <div className="text-[var(--foreground-muted)] mt-0.5">
                      Clause: {v.clauseCite}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-extrabold text-[var(--status-critical)] text-[14px]">
                      -${v.underpaymentVariance.toFixed(2)}
                    </div>
                    <div className="text-[10px] text-[var(--foreground-faint)]">
                      Expected ${v.contractedRate} vs Paid ${v.actualPaidAmount}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </AppShell>
  );
}
