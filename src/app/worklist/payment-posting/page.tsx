"use client";

import React, { useState } from "react";
import Link from "next/link";
import { AppShell } from "@/components/layout/app-shell";
import { StatusBadge } from "@/components/ui/status-badge";
import { Button } from "@/components/ui/button";
import { GlassModal } from "@/components/ui/glass-modal";
import { useRcmDataStore } from "@/store/useRcmDataStore";
import { formatDate } from "@/lib/formatDate";
import { Claim } from "@/schema/claimSchema";
import {
  DollarSign,
  FileCheck2,
  AlertTriangle,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  Building2,
  FileText,
} from "lucide-react";

export default function PaymentPostingPage() {
  const { claims, feeSchedule, reconcileEraPayment } = useRcmDataStore();

  const [activeReconcileClaim, setActiveReconcileClaim] = useState<Claim | null>(null);
  const [remittanceAmount, setRemittanceAmount] = useState("");
  const [adjustmentReason, setAdjustmentReason] = useState("Contractual Write-off");
  const [adjustmentNote, setAdjustmentNote] = useState("");
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Claims awaiting payment posting / reconciliation
  const unpostedClaims = claims.filter((c) => c.status === "AwaitingAcknowledgement" || c.status === "Submitted" || c.status === "InAdjudication");

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleOpenReconcile = (claim: Claim) => {
    const feeItem = feeSchedule.find((f) => f.cptCode === claim.cptCode);
    const expectedRate = feeItem ? feeItem.providerRate : claim.billedAmount;
    setActiveReconcileClaim(claim);
    setRemittanceAmount(expectedRate.toFixed(2));
    setAdjustmentReason("Contractual Write-off");
    setAdjustmentNote(`Contractual fee schedule adjustment per ${claim.payerName} fee schedule.`);
  };

  const handlePostPayment = () => {
    if (!activeReconcileClaim || !remittanceAmount) return;

    const paidNum = parseFloat(remittanceAmount);
    const feeItem = feeSchedule.find((f) => f.cptCode === activeReconcileClaim.cptCode);
    const expectedRate = feeItem ? feeItem.providerRate : activeReconcileClaim.billedAmount;
    const writeoffAmount = Math.max(0, activeReconcileClaim.billedAmount - paidNum);

    const adjustments = [
      {
        reasonCode: adjustmentReason,
        amount: writeoffAmount,
        note: adjustmentNote || "Contractual ERA 835 posting adjustment.",
      },
    ];

    reconcileEraPayment(activeReconcileClaim.id, paidNum, adjustments);

    const isUnderpaid = paidNum < expectedRate;
    showToast(
      isUnderpaid
        ? `Posted ERA 835 for ${activeReconcileClaim.claimId} ($${paidNum.toFixed(2)}). Underpayment exception logged ($${(expectedRate - paidNum).toFixed(2)} shortfall)!`
        : `Successfully posted ERA 835 remittance of $${paidNum.toFixed(2)} for ${activeReconcileClaim.claimId}!`
    );

    setActiveReconcileClaim(null);
  };

  const content = (
    <div className="space-y-6 select-none">
      {/* Toast Banner */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 px-4 py-3 rounded-2xl bg-[var(--accent)] text-white font-bold text-xs shadow-2xl flex items-center gap-2 animate-bounce">
          <CheckCircle2 className="w-4 h-4 text-[var(--status-success)]" /> {toastMessage}
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-[22px] font-extrabold text-[var(--foreground)] tracking-tight">
              ERA Payment Posting & Reconciliation
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] uppercase font-bold bg-[var(--accent-soft)] text-[var(--accent)] border border-black/5">
              835 Remittance Queue
            </span>
          </div>
          <p className="text-[13px] text-[var(--foreground-muted)] font-medium mt-1">
            Post 835 electronic remittance payments, audit contractual fee schedule rates, and log underpayment exceptions.
          </p>
        </div>

        <span className="px-3 py-1 rounded-full text-xs font-bold bg-[var(--status-warning-bg)] text-[var(--status-warning)] self-start sm:self-auto border border-[var(--status-warning)]/20">
          {unpostedClaims.length} Pending ERA Postings
        </span>
      </div>

      {/* Payment Posting Queue Table */}
      <div className="neu p-5 space-y-4 bg-[var(--surface)] border border-white/60">
        <div className="flex items-center justify-between border-b border-[var(--border)] pb-3">
          <h2 className="text-[14px] font-bold text-[var(--foreground)] flex items-center gap-2">
            <FileCheck2 className="w-4 h-4 text-[var(--accent)]" />
            Unposted 837P Claim Remittance Worklist
          </h2>
          <span className="text-xs text-[var(--foreground-muted)] font-medium">
            Comparing ERA Remittance vs Fee Schedule Contract Rates
          </span>
        </div>

        {unpostedClaims.length === 0 ? (
          <div className="p-12 text-center space-y-3 bg-[var(--surface)] neu-soft rounded-2xl">
            <CheckCircle2 className="w-10 h-10 text-[var(--status-success)] mx-auto" />
            <h3 className="text-[16px] font-extrabold text-[var(--foreground)]">All Remittances Reconciled!</h3>
            <p className="text-xs text-[var(--foreground-muted)] font-medium">
              Zero pending ERA payment postings remaining in queue.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-[var(--border)] border border-[var(--border)] rounded-2xl overflow-hidden bg-[var(--surface)]">
            {unpostedClaims.map((claim) => {
              const feeItem = feeSchedule.find((f) => f.cptCode === claim.cptCode);
              const contractedRate = feeItem ? feeItem.providerRate : claim.billedAmount;
              const hasDraftPaid = (claim.paidAmount || 0) > 0;
              const isUnderpaid = hasDraftPaid && (claim.paidAmount || 0) < contractedRate;

              return (
                <div
                  key={claim.id}
                  className="p-5 flex flex-col lg:flex-row lg:items-center justify-between gap-4 hover:bg-[var(--surface-muted)] transition-colors"
                >
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2 flex-wrap">
                      <Link
                        href={`/claims/${claim.id}`}
                        className="font-mono font-bold text-xs px-2.5 py-0.5 rounded-full bg-[var(--accent-soft)] text-[var(--accent)] hover:bg-[var(--accent)] hover:text-white transition-all"
                      >
                        {claim.claimId}
                      </Link>
                      <StatusBadge tone="warning" label={`Pending ERA (${claim.status})`} />
                      {isUnderpaid && (
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-[var(--status-critical-bg)] text-[var(--status-critical)] border border-[var(--status-critical)]/20">
                          ⚠️ Underpayment Exception
                        </span>
                      )}
                    </div>

                    <h3 className="text-[15px] font-bold text-[var(--foreground)]">
                      {claim.patientName} — <span className="text-[var(--foreground-muted)] font-normal">{claim.payerName}</span>
                    </h3>
                    <p className="text-xs text-[var(--foreground-muted)] font-medium">
                      DOS: {formatDate(claim.serviceDate)} | CPT Code: <span className="font-mono font-bold text-[var(--foreground)]">{claim.cptCode}</span>
                    </p>
                  </div>

                  <div className="flex items-center gap-6 self-end lg:self-center">
                    {/* Billed vs Fee Schedule Rate */}
                    <div className="text-right">
                      <div className="text-[10px] font-bold uppercase tracking-wider text-[var(--foreground-faint)]">
                        Billed / Contract Rate
                      </div>
                      <div className="text-[15px] font-extrabold text-[var(--foreground)] tabular-nums">
                        ${claim.billedAmount.toFixed(2)} / <span className="text-[var(--accent)]">${contractedRate.toFixed(2)}</span>
                      </div>
                    </div>

                    <Button
                      size="sm"
                      variant="primary"
                      onClick={() => handleOpenReconcile(claim)}
                    >
                      <DollarSign className="w-3.5 h-3.5" /> Post 835 Remittance
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Post ERA Remittance Modal */}
      <GlassModal
        isOpen={!!activeReconcileClaim}
        onClose={() => setActiveReconcileClaim(null)}
        title={`Post ERA 835 Remittance — ${activeReconcileClaim?.claimId}`}
        description={`Patient: ${activeReconcileClaim?.patientName} | Payer: ${activeReconcileClaim?.payerName}`}
      >
        {activeReconcileClaim && (
          <div className="space-y-4 text-xs select-none">
            <div className="p-3.5 neu-pressed rounded-2xl space-y-1 bg-[var(--surface-muted)]">
              <div className="flex justify-between font-bold">
                <span>CPT {activeReconcileClaim.cptCode} Billed Charge:</span>
                <span>${activeReconcileClaim.billedAmount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-[var(--accent)] font-bold">
                <span>Contracted Fee Schedule Rate:</span>
                <span>
                  $
                  {(
                    feeSchedule.find((f) => f.cptCode === activeReconcileClaim.cptCode)?.providerRate ||
                    activeReconcileClaim.billedAmount
                  ).toFixed(2)}
                </span>
              </div>
            </div>

            <div>
              <label className="block font-bold text-[var(--foreground)] mb-1">
                Actual Payer ERA Remittance Paid Amount ($) *
              </label>
              <input
                type="number"
                value={remittanceAmount}
                onChange={(e) => setRemittanceAmount(e.target.value)}
                placeholder="e.g. 140.00"
                className="w-full neu-pressed px-3.5 py-2 rounded-xl text-[13px] text-[var(--foreground)] font-bold bg-transparent outline-none focus:ring-2 focus:ring-[var(--accent)]"
              />
            </div>

            <div>
              <label className="block font-bold text-[var(--foreground)] mb-1">
                Contractual Write-Off Adjustment Reason
              </label>
              <select
                value={adjustmentReason}
                onChange={(e) => setAdjustmentReason(e.target.value)}
                className="w-full neu-pressed px-3.5 py-2 rounded-xl text-[13px] text-[var(--foreground)] bg-transparent outline-none focus:ring-2 focus:ring-[var(--accent)]"
              >
                <option value="Contractual Write-off">CO-45 Contractual Adjustment</option>
                <option value="Small Balance Removal">CO-Small Balance Waiver (&lt;$10)</option>
                <option value="Patient Copay Allocation">PR-1 Deductible/Copay Transfer</option>
                <option value="Administrative Courtesy">OA-Admin Courtesy Write-Off</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-[var(--foreground)] mb-1">
                Internal Audit Note / CARC Code Detail
              </label>
              <input
                type="text"
                value={adjustmentNote}
                onChange={(e) => setAdjustmentNote(e.target.value)}
                placeholder="e.g. CO-45 Fee Schedule Difference"
                className="w-full neu-pressed px-3.5 py-2 rounded-xl text-[13px] text-[var(--foreground)] bg-transparent outline-none focus:ring-2 focus:ring-[var(--accent)]"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-[var(--border)]">
              <Button variant="secondary" size="sm" onClick={() => setActiveReconcileClaim(null)}>
                Cancel
              </Button>
              <Button variant="primary" size="sm" onClick={handlePostPayment} disabled={!remittanceAmount}>
                <ShieldCheck className="w-4 h-4" /> Post & Reconcile ERA
              </Button>
            </div>
          </div>
        )}
      </GlassModal>
    </div>
  );

  return <AppShell>{content}</AppShell>;
}
