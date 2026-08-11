"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { AppShell } from "@/components/layout/app-shell";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Save, ShieldCheck, CheckCircle2 } from "lucide-react";
import Link from "next/link";

export default function NewEnrollmentWizardPage() {
  const router = useRouter();

  const [providerName, setProviderName] = useState("");
  const [npi, setNpi] = useState("");
  const [taxId, setTaxId] = useState("");
  const [payerName, setPayerName] = useState("Blue Cross Blue Shield");
  const [effectiveDate, setEffectiveDate] = useState("2026-08-01");
  const [isCompleted, setIsCompleted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!providerName || !npi) return;

    setIsCompleted(true);
    setTimeout(() => {
      router.push("/credentialing");
    }, 1500);
  };

  return (
    <AppShell>
      <div className="max-w-2xl mx-auto space-y-6 select-none">
        {/* Navigation */}
        <div className="flex items-center gap-3">
          <Link href="/credentialing">
            <button
              aria-label="Back to credentialing"
              className="p-2 rounded-xl neu-soft hover:bg-[var(--surface-muted)] text-[var(--foreground-muted)] hover:text-[var(--foreground)] transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
          </Link>
          <div>
            <h1 className="text-[20px] font-extrabold tracking-tight text-[var(--foreground)]">
              Payer Enrollment Wizard
            </h1>
            <p className="text-[12px] text-[var(--foreground-muted)] font-medium">
              Enroll a provider with an electronic transaction clearinghouse and payer panel.
            </p>
          </div>
        </div>

        {isCompleted ? (
          <div className="neu p-12 text-center space-y-3 bg-[var(--surface)] border border-[var(--border)] rounded-2xl">
            <div className="w-12 h-12 rounded-full bg-[var(--status-success-bg)] text-[var(--status-success)] flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-6 h-6 animate-bounce" />
            </div>
            <h2 className="text-[18px] font-extrabold text-[var(--foreground)]">Enrollment Application Submitted!</h2>
            <p className="text-[12px] text-[var(--foreground-muted)] font-medium max-w-sm mx-auto">
              Provider enrollment application for {providerName} has been transmitted to {payerName}. Returning to vault...
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="neu p-6 space-y-5 bg-[var(--surface)]">
            <div className="space-y-4 text-[13px]">
              <div>
                <label className="block font-bold text-[var(--foreground)] mb-1">
                  Provider Full Name <span className="text-[var(--status-critical)]">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={providerName}
                  onChange={(e) => setProviderName(e.target.value)}
                  placeholder="e.g. Dr. Evelyn Vance, MD"
                  className="w-full neu-pressed px-3.5 py-2 rounded-xl text-[13px] text-[var(--foreground)] bg-transparent border-none outline-none focus:ring-2 focus:ring-[var(--accent)]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-[var(--foreground)] mb-1">
                    National Provider Identifier (NPI) <span className="text-[var(--status-critical)]">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={npi}
                    onChange={(e) => setNpi(e.target.value)}
                    placeholder="10-digit NPI"
                    className="w-full neu-pressed px-3.5 py-2 rounded-xl text-[13px] text-[var(--foreground)] bg-transparent border-none outline-none focus:ring-2 focus:ring-[var(--accent)]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-[var(--foreground)] mb-1">
                    Practice Tax ID (EIN) <span className="text-[var(--status-critical)]">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={taxId}
                    onChange={(e) => setTaxId(e.target.value)}
                    placeholder="9-digit Tax ID"
                    className="w-full neu-pressed px-3.5 py-2 rounded-xl text-[13px] text-[var(--foreground)] bg-transparent border-none outline-none focus:ring-2 focus:ring-[var(--accent)]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-[var(--foreground)] mb-1">
                    Target Payer Panel
                  </label>
                  <select
                    value={payerName}
                    onChange={(e) => setPayerName(e.target.value)}
                    className="w-full neu-pressed px-3 py-2 rounded-xl text-[13px] text-[var(--foreground)] bg-transparent border-none outline-none focus:ring-2 focus:ring-[var(--accent)]"
                  >
                    <option value="Blue Cross Blue Shield">Blue Cross Blue Shield</option>
                    <option value="Aetna Behavioral Health">Aetna Behavioral Health</option>
                    <option value="United Healthcare">United Healthcare</option>
                    <option value="Cigna Health">Cigna Health</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-[var(--foreground)] mb-1">
                    Contract Effective Date
                  </label>
                  <input
                    type="date"
                    value={effectiveDate}
                    onChange={(e) => setEffectiveDate(e.target.value)}
                    className="w-full neu-pressed px-3.5 py-2 rounded-xl text-[13px] text-[var(--foreground)] bg-transparent border-none outline-none focus:ring-2 focus:ring-[var(--accent)]"
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-[var(--border)]">
              <Link href="/credentialing">
                <Button variant="secondary" size="sm">
                  Cancel
                </Button>
              </Link>
              <Button type="submit" variant="primary" size="sm">
                <Save className="w-4 h-4" /> Submit Enrollment Application
              </Button>
            </div>
          </form>
        )}
      </div>
    </AppShell>
  );
}
