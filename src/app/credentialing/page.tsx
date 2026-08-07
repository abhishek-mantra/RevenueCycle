"use client";

import React, { useState } from "react";
import { AppShell } from "@/components/layout/app-shell";
import { KpiCard } from "@/components/ui/kpi-card";
import { StatusBadge } from "@/components/ui/status-badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { GlassModal } from "@/components/ui/glass-modal";
import { mockCredentialingVault } from "@/data/mockCredentialing";
import { CredentialingVaultEntry } from "@/schema/credentialingSchema";
import { motion } from "framer-motion";
import {
  Award,
  ShieldCheck,
  AlertTriangle,
  Calendar,
  Search,
  Plus,
  Radio,
  UserCheck,
  Lock,
  CheckCircle2,
  AlertCircle,
  Clock,
  ArrowRight,
} from "lucide-react";

export default function CredentialingPage() {
  const [testServiceDate, setTestServiceDate] = useState("2026-08-04");
  const [activeCheckResult, setActiveCheckResult] = useState<{
    valid: boolean;
    message: string;
  } | null>(null);

  const handleVerifyServiceDate = (entry: CredentialingVaultEntry) => {
    const sDate = new Date(testServiceDate);
    const eDate = new Date(entry.effectiveDate);

    if (sDate < eDate) {
      setActiveCheckResult({
        valid: false,
        message: `SUBMISSION BLOCKED: Service date (${testServiceDate}) is PRIOR to provider's effective enrollment date (${entry.effectiveDate}) with ${entry.payerName}. Claims will be rejected by payer for 'Provider Not Enrolled'.`,
      });
    } else {
      setActiveCheckResult({
        valid: true,
        message: `SUBMISSION APPROVED: Service date (${testServiceDate}) falls within active enrollment window (${entry.effectiveDate} to ${entry.terminationDate || "Present"}).`,
      });
    }
  };

  return (
    <AppShell>
      <div className="space-y-6 select-none">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-[22px] font-extrabold tracking-tight text-[var(--foreground)]">
                Credentialing & Transaction Enrollment Vault
              </h1>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] uppercase font-bold bg-[var(--accent-soft)] text-[var(--accent)] border border-black/5">
                Payer Vault & Effective Dates
              </span>
            </div>
            <p className="text-[13px] text-[var(--foreground-muted)] font-medium mt-1">
              Tracks two parallel statuses per provider-payer pair + pre-submission service date window verification.
            </p>
          </div>

          <Button variant="primary" size="sm" onClick={() => alert("Opened Enrollment Wizard")}>
            <Plus className="w-4 h-4" />
            Add Provider Enrollment
          </Button>
        </div>

        {/* KPI Strip */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <KpiCard
            label="Live EDI Transactions"
            value="14 Payers"
            delta="100% 837/835 Live"
            deltaType="increase"
            subtitle="Electronic remittance live"
            icon={<Radio className="w-5 h-5" />}
          />
          <KpiCard
            label="True Credentialed Panels"
            value="12 Panels"
            delta="Active contracts"
            deltaType="increase"
            subtitle="Provider panel status"
            icon={<Award className="w-5 h-5" />}
          />
          <KpiCard
            label="Action Required"
            value="1 Payer"
            delta="Aetna Attestation"
            deltaType="decrease"
            subtitle="Provider action pending"
            icon={<AlertTriangle className="w-5 h-5" />}
          />
          <KpiCard
            label="Effective Window Rules"
            value="1 Blocked"
            delta="Future Effective Date"
            deltaType="neutral"
            subtitle="Prevents migration claim loss"
            icon={<Lock className="w-5 h-5" />}
          />
        </div>

        {/* Date Window Pre-Submission Rule Simulator */}
        <div className="neu p-5 space-y-3 bg-gradient-to-r from-[var(--canvas)] to-[var(--surface-muted)] border border-white/60">
          <div className="flex items-center justify-between">
            <h2 className="text-[14px] font-bold text-[var(--foreground)] flex items-center gap-2">
              <Calendar className="w-4 h-4 text-[var(--accent)]" />
              Pre-Submission Effective Date Window Checker (Simulate Rule)
            </h2>
            <span className="text-[11px] text-[var(--foreground-muted)] font-medium">
              Prevent Invalid Credential Submissions
            </span>
          </div>

          <div className="flex flex-col md:flex-row items-center gap-4">
            <div className="w-full md:w-64">
              <Input
                label="Simulate Service Date (DOS)"
                type="date"
                value={testServiceDate}
                onChange={(e) => setTestServiceDate(e.target.value)}
              />
            </div>
            <p className="text-xs text-[var(--foreground-muted)] font-medium max-w-md pt-5">
              Select a date to verify if a claim's service date falls inside provider's active effective window before allowing submission.
            </p>
          </div>
        </div>

        {/* Credentialing Vault Table */}
        <div className="neu p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-[14px] font-bold text-[var(--foreground)]">
              Provider × Payer Enrollment Matrix
            </h2>
            <span className="text-[12px] text-[var(--foreground-muted)] font-medium">
              Two parallel statuses (Never merged into one flat badge)
            </span>
          </div>

          <div className="divide-y divide-[var(--border)] border border-[var(--border)] rounded-2xl overflow-hidden bg-[var(--surface)]">
            {mockCredentialingVault.map((entry) => (
              <div
                key={entry.id}
                className="p-5 flex flex-col lg:flex-row lg:items-center justify-between gap-4 hover:bg-[var(--surface-muted)] transition-colors"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h3 className="text-[16px] font-bold text-[var(--foreground)]">
                      {entry.providerName}
                    </h3>
                    <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[var(--accent-soft)] text-[var(--accent)] border border-black/5">
                      {entry.payerName}
                    </span>
                  </div>

                  <div className="flex items-center gap-4 text-xs text-[var(--foreground-muted)] font-medium">
                    <span className="font-mono">NPI: {entry.npi}</span>
                    <span className="font-mono">Tax ID: {entry.taxId}</span>
                    <span className="tabular-nums font-semibold text-[var(--foreground)]">
                      Effective: {entry.effectiveDate} {entry.terminationDate ? `to ${entry.terminationDate}` : "(Active)"}
                    </span>
                  </div>
                </div>

                {/* Two Separate Status Columns */}
                <div className="flex items-center gap-6">
                  {/* Column 1: True Credentialing */}
                  <div className="text-right">
                    <div className="text-[10px] font-bold uppercase tracking-wider text-[var(--foreground-faint)]">
                      True Credentialing
                    </div>
                    <div className="mt-1">
                      <StatusBadge
                        tone={entry.trueCredentialingStatus === "Credentialed" ? "success" : "warning"}
                        label={entry.trueCredentialingStatus}
                      />
                    </div>
                  </div>

                  {/* Column 2: Transaction Enrollment */}
                  <div className="text-right border-l border-[var(--border)] pl-4">
                    <div className="text-[10px] font-bold uppercase tracking-wider text-[var(--foreground-faint)]">
                      Transaction Enrollment
                    </div>
                    <div className="mt-1">
                      <StatusBadge
                        tone={
                          entry.transactionEnrollmentStatus === "Live"
                            ? "success"
                            : entry.transactionEnrollmentStatus === "ProviderActionRequired"
                            ? "critical"
                            : "warning"
                        }
                        label={entry.transactionEnrollmentStatus}
                      />
                    </div>
                  </div>

                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => handleVerifyServiceDate(entry)}
                  >
                    Test DOS Window
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Date Check Result Modal */}
        <GlassModal
          isOpen={!!activeCheckResult}
          onClose={() => setActiveCheckResult(null)}
          title="Pre-Submission Effective Date Result"
          description={`Tested DOS: ${testServiceDate}`}
        >
          {activeCheckResult && (
            <div className="space-y-4 text-xs">
              <div
                className={`p-4 rounded-2xl border space-y-2 ${
                  activeCheckResult.valid
                    ? "bg-[var(--status-success-bg)] border-[var(--status-success)]/20 text-[var(--status-success)]"
                    : "bg-[var(--status-critical-bg)] border-[var(--status-critical)]/20 text-[var(--status-critical)]"
                }`}
              >
                <div className="font-bold text-sm flex items-center gap-2">
                  {activeCheckResult.valid ? <CheckCircle2 className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
                  {activeCheckResult.valid ? "Validation Passed" : "Pre-Submission Rule Triggered"}
                </div>
                <p className="font-medium text-xs leading-relaxed">{activeCheckResult.message}</p>
              </div>

              <div className="flex justify-end pt-2">
                <Button variant="secondary" size="sm" onClick={() => setActiveCheckResult(null)}>
                  Close Result
                </Button>
              </div>
            </div>
          )}
        </GlassModal>
      </div>
    </AppShell>
  );
}
