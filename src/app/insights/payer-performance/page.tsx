"use client";

import React, { useState } from "react";
import Link from "next/link";
import { AppShell } from "@/components/layout/app-shell";
import { StatusBadge } from "@/components/ui/status-badge";
import { Button } from "@/components/ui/button";
import { useRcmDataStore } from "@/store/useRcmDataStore";
import { mockPayerPerformance, mockContractVariances } from "@/data/mockAnalytics";
import { CheckCircle2, ShieldAlert } from "lucide-react";

export default function PayerPerformancePage() {
  const { claims } = useRcmDataStore();
  const [activeTab, setActiveTab] = useState<"performance" | "variance" | "reconciliation">("performance");
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

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
                Payer Performance
              </h1>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] uppercase font-bold bg-[var(--accent-soft)] text-[var(--accent)] border border-black/5">
                Payer ROI & Variance Detection
              </span>
            </div>
            <p className="text-[13px] text-[var(--foreground-muted)] font-medium mt-1">
              Data-backed basis to decide which payer panels to keep vs drop based on effective $/hour ROI.
            </p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="neu p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-[var(--border)] pb-4">
            <div className="neu-pressed p-1 rounded-full flex items-center gap-1 text-[12px]">
              <button
                onClick={() => setActiveTab("performance")}
                className={`px-4 py-1.5 rounded-full font-bold transition-all cursor-pointer ${
                  activeTab === "performance" ? "bg-[var(--accent)] text-white shadow-xs" : "text-[var(--foreground-muted)]"
                }`}
              >
                Payer Panel ROI & Approval Rates
              </button>
              <button
                onClick={() => setActiveTab("variance")}
                className={`px-4 py-1.5 rounded-full font-bold transition-all cursor-pointer ${
                  activeTab === "variance" ? "bg-[var(--accent)] text-white shadow-xs" : "text-[var(--foreground-muted)]"
                }`}
              >
                Contract Variance Underpayments ({mockContractVariances.length})
              </button>
              <button
                onClick={() => setActiveTab("reconciliation")}
                className={`px-4 py-1.5 rounded-full font-bold transition-all cursor-pointer ${
                  activeTab === "reconciliation" ? "bg-[var(--accent)] text-white shadow-xs" : "text-[var(--foreground-muted)]"
                }`}
              >
                Bank & ERA Reconciliation
              </button>
            </div>
          </div>

          {activeTab === "performance" ? (
            /* Payer Performance Table */
            <div className="divide-y divide-[var(--border)] border border-[var(--border)] rounded-2xl overflow-hidden bg-[var(--surface)]">
              {mockPayerPerformance.map((row) => (
                <div
                  key={row.id}
                  className="p-5 flex flex-col lg:flex-row lg:items-center justify-between gap-4 hover:bg-[var(--surface-muted)] transition-colors"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h3 className="text-[16px] font-bold text-[var(--foreground)]">{row.payerName}</h3>
                      <StatusBadge tone={row.statusTone} label={`${row.approvalRate30d}% Approval (30d)`} />
                    </div>
                    <div className="text-xs text-[var(--foreground-muted)] font-medium">
                      Patient Mix: {row.patientMixPct}% | Avg Days-to-Pay: {row.avgDaysToPay}d
                    </div>
                  </div>

                  <div className="flex items-center gap-6">
                    {/* Effective Hourly Rate ROI */}
                    <div className="text-right">
                      <div className="text-[10px] font-bold uppercase tracking-wider text-[var(--foreground-faint)]">
                        Effective Hourly Rate (ROI)
                      </div>
                      <div className={`text-[18px] font-extrabold tabular-nums ${row.effectiveHourlyRate < 100 ? "text-[var(--status-critical)]" : "text-[var(--foreground)]"}`}>
                        ${row.effectiveHourlyRate.toFixed(2)}/hr
                      </div>
                    </div>

                    <Link href={`/insights/payer-performance/${row.id}`}>
                      <Button size="sm" variant="secondary">
                        Payer Analysis
                      </Button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          ) : activeTab === "variance" ? (
            /* Contract Variance Underpayment View */
            <div className="space-y-4">
              <div className="p-3.5 bg-[var(--status-warning-bg)] border border-[var(--status-warning)]/20 rounded-2xl text-xs text-[var(--status-warning)] flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 shrink-0" />
                <span>
                  <strong>Contract Variance Detection:</strong> Compares actual paid vs contracted rate clause per CPT code. Most competitors only compare paid vs allowed amount, missing underpayments!
                </span>
              </div>

              <div className="divide-y divide-[var(--border)] border border-[var(--border)] rounded-2xl overflow-hidden bg-[var(--surface)]">
                {mockContractVariances.map((item) => (
                  <div key={item.id} className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-xs px-2.5 py-0.5 rounded-full bg-[var(--accent-soft)] text-[var(--accent)]">
                          {item.claimId}
                        </span>
                        <h4 className="text-[15px] font-bold text-[var(--foreground)]">
                          {item.payerName} — CPT {item.cptCode}
                        </h4>
                      </div>
                      <p className="text-xs text-[var(--foreground-muted)] font-medium">
                        <strong className="text-[var(--foreground)]">Contract Clause Citation:</strong> {item.clauseCite}
                      </p>
                    </div>

                    <div className="flex items-center gap-6">
                      <div className="text-right">
                        <div className="text-[10px] font-bold uppercase tracking-wider text-[var(--status-critical)]">Variance Underpayment</div>
                        <div className="text-[17px] font-extrabold text-[var(--status-critical)] tabular-nums">
                          -${item.underpaymentVariance.toFixed(2)}
                        </div>
                      </div>

                      <Button size="sm" variant="primary" onClick={() => showToast(`Dispute filed for claim ${item.claimId}!`)}>
                        Submit Variance Appeal
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            /* Bank Reconciliation View */
            <div className="p-6 text-center space-y-3 neu-pressed rounded-2xl">
              <CheckCircle2 className="w-8 h-8 text-[var(--status-success)] mx-auto" />
              <h3 className="text-[16px] font-bold text-[var(--foreground)]">Bank & ERA 835 Reconciliation Matched</h3>
              <p className="text-xs text-[var(--foreground-muted)] max-w-md mx-auto">
                100% of recorded ERA payments reconcile with incoming bank deposits for the current period. Zero unallocated deposits.
              </p>
            </div>
          )}
        </div>
      </div>
    </AppShell>
  );
}
