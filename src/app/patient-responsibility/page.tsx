"use client";

import React, { useState } from "react";
import { AppShell } from "@/components/layout/app-shell";
import { KpiCard } from "@/components/ui/kpi-card";
import { StatusBadge } from "@/components/ui/status-badge";
import { Button } from "@/components/ui/button";
import { GlassModal } from "@/components/ui/glass-modal";
import { mockPatientArBalances, mockClawbacks } from "@/data/mockPatientAr";
import { ClawbackEntry } from "@/schema/patientArSchema";
import { motion } from "framer-motion";
import {
  UserCheck,
  DollarSign,
  AlertOctagon,
  FileCheck2,
  Lock,
  ArrowRight,
  ShieldAlert,
  Send,
  AlertCircle,
} from "lucide-react";

export default function PatientResponsibilityPage() {
  const [activeTab, setActiveTab] = useState<"balances" | "clawbacks">("balances");
  const [activeDisputeClawback, setActiveDisputeClawback] = useState<ClawbackEntry | null>(null);

  const totalInvoiceable = mockPatientArBalances.reduce((acc, b) => acc + b.invoiceableBalance, 0);
  const totalNonInvoiceable = mockPatientArBalances.reduce((acc, b) => acc + b.nonInvoiceableBalance, 0);
  const totalClawbacksAtRisk = mockClawbacks.reduce((acc, c) => acc + c.reversalAmount, 0);

  return (
    <AppShell>
      <div className="space-y-6 select-none">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-[22px] font-extrabold tracking-tight text-[var(--foreground)]">
                Patient AR & Decoupled Balances
              </h1>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] uppercase font-bold bg-[var(--accent-soft)] text-[var(--foreground)] border border-black/5">
                Decoupled Patient AR
              </span>
            </div>
            <p className="text-[13px] text-[var(--foreground-muted)] font-medium mt-1">
              Patient balances only become Invoiceable once real EOB/ERA adjudication exists. Prevents front-running insurance.
            </p>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <KpiCard
            label="Invoiceable AR (Billable)"
            value={`$${totalInvoiceable.toFixed(2)}`}
            delta="Ready for statement"
            deltaType="increase"
            subtitle="Adjudicated real numbers"
            icon={<DollarSign className="w-5 h-5" />}
          />
          <KpiCard
            label="Non-Invoiceable AR"
            value={`$${totalNonInvoiceable.toFixed(2)}`}
            delta="Protected from billing"
            deltaType="neutral"
            subtitle="Pending payer adjudication"
            icon={<Lock className="w-5 h-5" />}
          />
          <KpiCard
            label="Clawback Ledger at Risk"
            value={`$${totalClawbacksAtRisk.toFixed(2)}`}
            delta="2 Active reversals"
            deltaType="decrease"
            subtitle="Retroactive payer clawbacks"
            icon={<AlertOctagon className="w-5 h-5" />}
          />
          <KpiCard
            label="Clawback Dispute Rate"
            value="100%"
            delta="Active appeals"
            deltaType="increase"
            subtitle="Clinician retention protection"
            icon={<UserCheck className="w-5 h-5" />}
          />
        </div>

        {/* Navigation Sub-Tabs */}
        <div className="neu p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-[var(--border)] pb-4">
            <div className="neu-pressed p-1 rounded-full flex items-center gap-1 text-[12px]">
              <button
                onClick={() => setActiveTab("balances")}
                className={`px-4 py-1.5 rounded-full font-bold transition-all cursor-pointer ${
                  activeTab === "balances" ? "bg-[var(--accent)] text-white shadow-xs" : "text-[var(--foreground-muted)]"
                }`}
              >
                Decoupled Patient Balances ({mockPatientArBalances.length})
              </button>
              <button
                onClick={() => setActiveTab("clawbacks")}
                className={`px-4 py-1.5 rounded-full font-bold transition-all cursor-pointer ${
                  activeTab === "clawbacks" ? "bg-[var(--accent)] text-white shadow-xs" : "text-[var(--foreground-muted)]"
                }`}
              >
                Clawback Ledger ({mockClawbacks.length} Active)
              </button>
            </div>
          </div>

          {activeTab === "balances" ? (
            /* Decoupled AR Table */
            <div className="divide-y divide-[var(--border)] border border-[var(--border)] rounded-2xl overflow-hidden bg-[var(--surface)]">
              {mockPatientArBalances.map((bal) => (
                <div
                  key={bal.id}
                  className="p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-[var(--surface-muted)] transition-colors"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h3 className="text-[15px] font-bold text-[var(--foreground)]">{bal.patientName}</h3>
                      {bal.hasActiveClawback && (
                        <StatusBadge tone="warning" label="Active Clawback Flag" />
                      )}
                    </div>
                    <div className="text-xs text-[var(--foreground-muted)] font-medium">
                      Primary Payer: {bal.primaryPayer} | Adjudicated: {bal.lastAdjudicatedDate}
                    </div>
                  </div>

                  <div className="flex items-center gap-6">
                    {/* Invoiceable Column */}
                    <div className="text-right">
                      <div className="text-[10px] font-bold uppercase tracking-wider text-[var(--status-success)]">
                        Invoiceable (Billable)
                      </div>
                      <div className="text-[16px] font-extrabold text-[var(--foreground)] tabular-nums">
                        ${bal.invoiceableBalance.toFixed(2)}
                      </div>
                    </div>

                    {/* Non-Invoiceable Column */}
                    <div className="text-right border-l border-[var(--border)] pl-4">
                      <div className="text-[10px] font-bold uppercase tracking-wider text-[var(--foreground-faint)] flex items-center gap-1">
                        <Lock className="w-3 h-3 text-[var(--foreground-faint)]" /> Non-Invoiceable
                      </div>
                      <div className="text-[16px] font-extrabold text-[var(--foreground-muted)] tabular-nums">
                        ${bal.nonInvoiceableBalance.toFixed(2)}
                      </div>
                    </div>

                    <Button
                      size="sm"
                      variant={bal.invoiceableBalance > 0 ? "primary" : "secondary"}
                      disabled={bal.invoiceableBalance === 0}
                      onClick={() => alert(`Generated statement for ${bal.patientName} ($${bal.invoiceableBalance.toFixed(2)})`)}
                    >
                      {bal.invoiceableBalance > 0 ? "Generate Statement" : "Awaiting ERA"}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            /* Clawback Ledger View */
            <div className="space-y-4">
              <div className="p-3.5 bg-[var(--status-warning-bg)] border border-[var(--status-warning)]/20 rounded-2xl text-xs text-[var(--status-warning)] flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 shrink-0" />
                <span>
                  <strong>Clawback Protection:</strong> 52% of clinicians cite payment delays & clawbacks as their reason for leaving panels. Every reversal is tracked here for immediate appeal.
                </span>
              </div>

              <div className="divide-y divide-[var(--border)] border border-[var(--border)] rounded-2xl overflow-hidden bg-[var(--surface)]">
                {mockClawbacks.map((claw) => (
                  <div key={claw.id} className="p-5 space-y-2 hover:bg-[var(--surface-muted)] transition-colors">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-xs px-2.5 py-0.5 rounded-full bg-[var(--status-critical-bg)] text-[var(--status-critical)]">
                          {claw.reasonCode}
                        </span>
                        <h4 className="text-[15px] font-bold text-[var(--foreground)]">
                          {claw.patientName} — <span className="text-[var(--foreground-muted)] font-medium">{claw.payerName}</span>
                        </h4>
                      </div>

                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <span className="text-xs text-[var(--foreground-muted)] font-medium">Reversal Amount: </span>
                          <span className="text-[16px] font-extrabold text-[var(--status-critical)] tabular-nums">
                            -${claw.reversalAmount.toFixed(2)}
                          </span>
                        </div>

                        <Button
                          size="sm"
                          variant="secondary"
                          onClick={() => setActiveDisputeClawback(claw)}
                        >
                          Dispute Clawback
                        </Button>
                      </div>
                    </div>

                    <p className="text-xs text-[var(--foreground-muted)] font-medium bg-[var(--surface-muted)] p-3 rounded-xl">
                      <strong className="text-[var(--foreground)]">Payer Reversal Explanation:</strong> {claw.plainEnglishReason}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Dispute Clawback Modal */}
        <GlassModal
          isOpen={!!activeDisputeClawback}
          onClose={() => setActiveDisputeClawback(null)}
          title={`Dispute Payer Reversal — ${activeDisputeClawback?.claimId}`}
          description={`Payer: ${activeDisputeClawback?.payerName} — Amount: -$${activeDisputeClawback?.reversalAmount.toFixed(2)}`}
        >
          {activeDisputeClawback && (
            <div className="space-y-4 text-xs">
              <div className="p-3.5 neu-pressed rounded-2xl space-y-1.5">
                <div className="font-bold text-[var(--foreground)]">Extracted Timely Evidence:</div>
                <p className="text-[var(--foreground-muted)]">
                  MantraCare EHR eligibility log confirms member was active on DOS ({activeDisputeClawback.reversalDate}).
                </p>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-[var(--foreground)]">Dispute Appeal Letter:</label>
                <textarea
                  rows={4}
                  defaultValue={`RE: Formal Dispute of Post-Payment Reversal — Claim ${activeDisputeClawback.claimId}\n\nWe hereby dispute the retroactive clawback of $${activeDisputeClawback.reversalAmount.toFixed(2)}. Verification log confirms active eligibility at time of service.`}
                  className="neu-pressed w-full p-3 text-xs font-mono outline-none rounded-xl"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <Button variant="secondary" size="sm" onClick={() => setActiveDisputeClawback(null)}>
                  Cancel
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => {
                    alert("Clawback dispute submitted to payer!");
                    setActiveDisputeClawback(null);
                  }}
                >
                  <Send className="w-3.5 h-3.5" />
                  Submit Clawback Appeal
                </Button>
              </div>
            </div>
          )}
        </GlassModal>
      </div>
    </AppShell>
  );
}
