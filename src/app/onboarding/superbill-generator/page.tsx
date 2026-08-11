"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { AppShell } from "@/components/layout/app-shell";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Save, FileText, CheckCircle2, Printer } from "lucide-react";
import Link from "next/link";

export default function HistoricalSuperbillGeneratorPage() {
  const router = useRouter();

  const [patientName, setPatientName] = useState("");
  const [cptCode, setCptCode] = useState("90837");
  const [icdCode, setIcdCode] = useState("F41.1");
  const [serviceDate, setServiceDate] = useState("2026-07-15");
  const [amountBilled, setAmountBilled] = useState("175.00");
  const [amountPaid, setAmountPaid] = useState("175.00");
  const [isGenerated, setIsGenerated] = useState(false);

  const handleGenerate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!patientName) return;
    setIsGenerated(true);
  };

  return (
    <AppShell>
      <div className="max-w-2xl mx-auto space-y-6 select-none">
        {/* Navigation */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/onboarding">
              <button
                aria-label="Back to onboarding"
                className="p-2 rounded-xl neu-soft hover:bg-[var(--surface-muted)] text-[var(--foreground-muted)] hover:text-[var(--foreground)] transition-colors cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
            </Link>
            <div>
              <h1 className="text-[20px] font-extrabold tracking-tight text-[var(--foreground)]">
                Historical Superbill Generator
              </h1>
              <p className="text-[12px] text-[var(--foreground-muted)] font-medium">
                Reconstruct itemized superbills for out-of-network patient reimbursement.
              </p>
            </div>
          </div>

          {isGenerated && (
            <button
              onClick={() => window.print()}
              aria-label="Print superbill"
              className="px-3 py-1.5 rounded-xl neu-soft hover:bg-[var(--surface-muted)] text-xs font-bold text-[var(--foreground)] transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <Printer className="w-3.5 h-3.5" /> Print Superbill
            </button>
          )}
        </div>

        {isGenerated ? (
          /* Generated Itemized Superbill Card */
          <div className="neu p-8 space-y-6 bg-[var(--surface)] border border-white/80 relative overflow-hidden">
            <div className="flex items-center justify-between border-b border-[var(--border)] pb-4">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-2xl bg-[var(--accent-soft)] text-[var(--accent)] flex items-center justify-center shadow-xs">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-[16px] font-extrabold text-[var(--foreground)]">
                    Itemized Historical Superbill
                  </div>
                  <div className="text-[11px] font-bold text-[var(--accent)] flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Verified Provider Signature Attached
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 text-xs">
              <div className="space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--foreground-faint)]">
                  Patient Information
                </span>
                <div className="font-bold text-[14px] text-[var(--foreground)]">{patientName}</div>
                <div className="text-[var(--foreground-muted)]">Service Date: {serviceDate}</div>
              </div>

              <div className="space-y-1 text-right">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--foreground-faint)]">
                  Provider & Practice
                </span>
                <div className="font-bold text-[14px] text-[var(--foreground)]">Dr. Evelyn Vance, MD</div>
                <div className="text-[var(--foreground-muted)]">NPI: 1982049102 | Tax ID: 12-3456789</div>
              </div>
            </div>

            <div className="space-y-2 pt-2 border-t border-[var(--border)]">
              <div className="text-[10px] font-bold uppercase tracking-wider text-[var(--foreground-faint)] mb-2">
                Clinical Diagnosis & Procedure Breakdown
              </div>

              <div className="divide-y divide-[var(--border)] border border-[var(--border)] rounded-2xl overflow-hidden text-xs bg-[var(--surface)]">
                <div className="p-3.5 flex justify-between">
                  <span className="font-medium text-[var(--foreground)]">CPT {cptCode} — Psychotherapy Session (60 Min)</span>
                  <span className="font-bold text-[var(--foreground)] tabular-nums">${parseFloat(amountBilled).toFixed(2)}</span>
                </div>
                <div className="p-3.5 flex justify-between bg-[var(--surface-muted)]/40">
                  <span className="font-medium text-[var(--foreground-muted)]">Primary Diagnosis Code:</span>
                  <span className="font-mono font-bold text-[var(--foreground)]">{icdCode} (Generalized Anxiety)</span>
                </div>
              </div>
            </div>

            <div className="p-4 neu-pressed rounded-2xl space-y-1 text-xs">
              <div className="flex justify-between text-[var(--foreground-muted)] font-medium">
                <span>Total Charge Billed:</span>
                <span>${parseFloat(amountBilled).toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-[var(--status-success)] font-extrabold text-[15px] pt-1 border-t border-[var(--border)]">
                <span>Patient Amount Paid:</span>
                <span>${parseFloat(amountPaid).toFixed(2)}</span>
              </div>
            </div>
          </div>
        ) : (
          <form onSubmit={handleGenerate} className="neu p-6 space-y-5 bg-[var(--surface)]">
            <div className="space-y-4 text-[13px]">
              <div>
                <label className="block font-bold text-[var(--foreground)] mb-1">
                  Patient Full Name <span className="text-[var(--status-critical)]">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={patientName}
                  onChange={(e) => setPatientName(e.target.value)}
                  placeholder="e.g. Sarah Jenkins"
                  className="w-full neu-pressed px-3.5 py-2 rounded-xl text-[13px] text-[var(--foreground)] bg-transparent border-none outline-none focus:ring-2 focus:ring-[var(--accent)]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-[var(--foreground)] mb-1">
                    Procedure CPT Code
                  </label>
                  <select
                    value={cptCode}
                    onChange={(e) => setCptCode(e.target.value)}
                    className="w-full neu-pressed px-3 py-2 rounded-xl text-[13px] text-[var(--foreground)] bg-transparent border-none outline-none focus:ring-2 focus:ring-[var(--accent)]"
                  >
                    <option value="90837">90837 (60m Psychotherapy)</option>
                    <option value="90834">90834 (45m Psychotherapy)</option>
                    <option value="90791">90791 (Diagnostic Eval)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-[var(--foreground)] mb-1">
                    Diagnosis ICD-10 Code
                  </label>
                  <input
                    type="text"
                    value={icdCode}
                    onChange={(e) => setIcdCode(e.target.value)}
                    placeholder="e.g. F41.1, F33.1"
                    className="w-full neu-pressed px-3.5 py-2 rounded-xl text-[13px] text-[var(--foreground)] bg-transparent border-none outline-none focus:ring-2 focus:ring-[var(--accent)]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block font-bold text-[var(--foreground)] mb-1">
                    Service Date (DOS)
                  </label>
                  <input
                    type="date"
                    value={serviceDate}
                    onChange={(e) => setServiceDate(e.target.value)}
                    className="w-full neu-pressed px-3.5 py-2 rounded-xl text-[13px] text-[var(--foreground)] bg-transparent border-none outline-none focus:ring-2 focus:ring-[var(--accent)]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-[var(--foreground)] mb-1">
                    Amount Billed ($)
                  </label>
                  <input
                    type="text"
                    value={amountBilled}
                    onChange={(e) => setAmountBilled(e.target.value)}
                    className="w-full neu-pressed px-3.5 py-2 rounded-xl text-[13px] text-[var(--foreground)] bg-transparent border-none outline-none focus:ring-2 focus:ring-[var(--accent)]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-[var(--foreground)] mb-1">
                    Amount Paid ($)
                  </label>
                  <input
                    type="text"
                    value={amountPaid}
                    onChange={(e) => setAmountPaid(e.target.value)}
                    className="w-full neu-pressed px-3.5 py-2 rounded-xl text-[13px] text-[var(--foreground)] bg-transparent border-none outline-none focus:ring-2 focus:ring-[var(--accent)]"
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-[var(--border)]">
              <Link href="/onboarding">
                <Button variant="secondary" size="sm">
                  Cancel
                </Button>
              </Link>
              <Button type="submit" variant="primary" size="sm">
                <Save className="w-4 h-4" /> Generate Superbill Document
              </Button>
            </div>
          </form>
        )}
      </div>
    </AppShell>
  );
}
