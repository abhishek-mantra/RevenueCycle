"use client";

import React, { useState } from "react";
import Link from "next/link";
import { AppShell } from "@/components/layout/app-shell";
import { KpiCard } from "@/components/ui/kpi-card";
import { StatusBadge } from "@/components/ui/status-badge";
import { Button } from "@/components/ui/button";
import { GlassModal } from "@/components/ui/glass-modal";
import { useRcmDataStore } from "@/store/useRcmDataStore";
import { formatDate } from "@/lib/formatDate";
import { ClawbackEntry } from "@/schema/patientArSchema";
import {
  UserCheck,
  DollarSign,
  AlertOctagon,
  Lock,
  ShieldAlert,
  Send,
  CheckCircle2,
} from "lucide-react";

export default function PatientResponsibilityPage() {
  const { patientArBalances, clawbacks } = useRcmDataStore();
  const [activeTab, setActiveTab] = useState<"balances" | "clawbacks">("balances");
  const [activeDisputeClawback, setActiveDisputeClawback] = useState<ClawbackEntry | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const totalInvoiceable = patientArBalances.reduce((acc, b) => acc + b.invoiceableBalance, 0);
  const totalNonInvoiceable = patientArBalances.reduce((acc, b) => acc + b.nonInvoiceableBalance, 0);
  const totalClawbacksAtRisk = clawbacks.reduce((acc, c) => acc + c.reversalAmount, 0);

  return (
    <AppShell>
      <div className="space-y-6 select-none">
        {/* Toast Notification Banner */}
        {toastMessage && (
          <div className="fixed bottom-6 right-6 z-50 px-4 py-3 rounded-2xl bg-[var(--accent)] text-white font-bold text-xs shadow-2xl flex items-center gap-2 animate-bounce">
            <CheckCircle2 className="w-4 h-4" /> {toastMessage}
          </div>
        )}

        {/* Header (8.18 - Simplified Title) */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-[22px] font-extrabold tracking-tight text-[var(--foreground)]">
                Patient Responsibility
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
            delta={`${clawbacks.length} Active reversals`}
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
                Decoupled Patient Balances ({patientArBalances.length})
              </button>
              <button
                onClick={() => setActiveTab("clawbacks")}
                className={`px-4 py-1.5 rounded-full font-bold transition-all cursor-pointer ${
                  activeTab === "clawbacks" ? "bg-[var(--accent)] text-white shadow-xs" : "text-[var(--foreground-muted)]"
                }`}
              >
                Clawback Ledger ({clawbacks.length} Active)
              </button>
            </div>
          </div>

          {activeTab === "balances" ? (
            <div className="space-y-4">
              {/* Patient Credit Ledger Card */}
              <PatientCreditLedgerCard showToast={showToast} />

              {/* Decoupled AR Table */}
              <div className="divide-y divide-[var(--border)] border border-[var(--border)] rounded-2xl overflow-hidden bg-[var(--surface)]">
              {patientArBalances.map((bal) => (
                <div
                  key={bal.id}
                  className="p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-[var(--surface-muted)] transition-colors"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <Link
                        href={`/patients/${bal.patientId}`}
                        className="text-[15px] font-bold text-[var(--foreground)] hover:text-[var(--accent)] hover:underline transition-colors"
                      >
                        {bal.patientName}
                      </Link>
                      {bal.hasActiveClawback && (
                        <StatusBadge tone="warning" label="Active Clawback Flag" />
                      )}
                    </div>
                    <div className="text-xs text-[var(--foreground-muted)] font-medium">
                      Primary Payer: {bal.primaryPayer} | Adjudicated: {formatDate(bal.lastAdjudicatedDate)}
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

                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        variant={bal.invoiceableBalance > 0 ? "primary" : "secondary"}
                        disabled={bal.invoiceableBalance === 0}
                        onClick={() => showToast(`Generated statement for ${bal.patientName} ($${bal.invoiceableBalance.toFixed(2)})`)}
                      >
                        {bal.invoiceableBalance > 0 ? "Generate Statement" : "Awaiting ERA"}
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
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
                {clawbacks.map((claw) => (
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
                  MantraCare EHR eligibility log confirms member was active on DOS ({formatDate(activeDisputeClawback.reversalDate)}).
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
                    showToast("Clawback dispute submitted to payer!");
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

function PatientCreditLedgerCard({ showToast }: { showToast: (msg: string) => void }) {
  const { patientCredits, applyPatientCredit } = useRcmDataStore();
  const totalCreditAvailable = patientCredits.reduce((sum, c) => sum + c.availableCredit, 0);

  if (totalCreditAvailable === 0) return null;

  return (
    <div className="p-4 neu-pressed rounded-2xl space-y-3 bg-[var(--surface-muted)]/50">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-[var(--status-success-bg)] text-[var(--status-success)] flex items-center justify-center font-bold">
            💳
          </div>
          <div>
            <h3 className="text-[13px] font-bold text-[var(--foreground)]">
              Active Patient Overpayment Credit Ledger
            </h3>
            <p className="text-[11px] text-[var(--foreground-muted)] font-medium">
              Available uncaptured credits from past overpayments or advance copayments ready to apply to open balances.
            </p>
          </div>
        </div>

        <span className="text-xs font-extrabold text-[var(--status-success)] bg-[var(--status-success-bg)] px-3 py-1 rounded-full border border-[var(--status-success)]/20">
          ${totalCreditAvailable.toFixed(2)} Total Available
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs pt-1">
        {patientCredits.map((cred) => (
          <div key={cred.patientId} className="p-3 bg-[var(--surface)] neu-soft rounded-xl flex items-center justify-between border border-[var(--border)]">
            <div>
              <div className="font-bold text-[var(--foreground)]">{cred.patientName}</div>
              <div className="text-[10px] text-[var(--foreground-muted)]">Available Credit: ${cred.availableCredit.toFixed(2)}</div>
            </div>
            <Button
              size="sm"
              variant="secondary"
              disabled={cred.availableCredit === 0}
              onClick={() => {
                applyPatientCredit(cred.patientId, cred.availableCredit);
                showToast(`Applied $${cred.availableCredit.toFixed(2)} credit to ${cred.patientName}'s balance!`);
              }}
            >
              Apply Credit
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}
