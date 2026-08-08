"use client";

import React, { useState, use } from "react";
import Link from "next/link";
import { AppShell } from "@/components/layout/app-shell";
import { KpiCard } from "@/components/ui/kpi-card";
import { StatusBadge } from "@/components/ui/status-badge";
import { Button } from "@/components/ui/button";
import { GlassModal } from "@/components/ui/glass-modal";
import { mockClaims } from "@/data/mockClaims";
import { mockDenialClusters } from "@/data/mockDenials";
import {
  FileText,
  Clock,
  ShieldCheck,
  AlertTriangle,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  RotateCw,
  Send,
  UserCheck,
  Building2,
  Calendar,
  Layers,
} from "lucide-react";

export default function ClaimDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const claimIdParam = resolvedParams.id;

  const claim = mockClaims.find((c) => c.claimId === claimIdParam || c.id === claimIdParam) || mockClaims[0];
  const parentCluster = mockDenialClusters.find((c) => c.claims.some((d) => d.claimId === claim.claimId));
  const relatedDenial = parentCluster?.claims.find((d) => d.claimId === claim.claimId);

  const [isResubmitModalOpen, setIsResubmitModalOpen] = useState(false);

  return (
    <AppShell>
      <div className="space-y-6 select-none">
        {/* Header Breadcrumb */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <Link
              href="/claims"
              className="text-xs font-bold text-[var(--accent)] hover:underline flex items-center gap-1"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Back to Claims List
            </Link>
            <div className="flex items-center gap-3 pt-1">
              <h1 className="text-[24px] font-extrabold tracking-tight text-[var(--foreground)]">
                Claim {claim.claimId}
              </h1>
              <StatusBadge
                tone={claim.status === "Paid" ? "success" : claim.status === "Denied" ? "critical" : "warning"}
                label={claim.status}
              />
            </div>
            <p className="text-[13px] text-[var(--foreground-muted)] font-medium">
              Patient: <strong className="text-[var(--foreground)]">{claim.patientName}</strong> • Payer:{" "}
              <strong className="text-[var(--foreground)]">{claim.payerName}</strong> • Service Date: {claim.serviceDate}
            </p>
          </div>

          <div className="flex items-center gap-2">
            {claim.status === "Denied" && (
              <Button variant="primary" size="sm" onClick={() => setIsResubmitModalOpen(true)}>
                <RotateCw className="w-3.5 h-3.5 mr-1" /> Correct & Resubmit 837P
              </Button>
            )}
          </div>
        </div>

        {/* Claim Overview KPI Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <KpiCard
            label="Billed Charge Amount"
            value={`$${(claim.submittedAmount ?? claim.billedAmount).toFixed(2)}`}
            subtitle="Original 837P Charge"
            icon={<FileText className="w-5 h-5" />}
          />
          <KpiCard
            label="Allowed Rate"
            value={claim.allowedAmount ? `$${claim.allowedAmount.toFixed(2)}` : "Pending"}
            subtitle="Fee Schedule Target"
            icon={<ShieldCheck className="w-5 h-5" />}
          />
          <KpiCard
            label="Paid Amount (ERA 835)"
            value={claim.paidAmount ? `$${claim.paidAmount.toFixed(2)}` : "$0.00"}
            delta={claim.paidAmount && claim.paidAmount > 0 ? "Adjudicated" : "Unpaid / Denied"}
            deltaType={claim.paidAmount && claim.paidAmount > 0 ? "increase" : "decrease"}
            subtitle="Remittance Posted"
            icon={<CheckCircle2 className="w-5 h-5" />}
          />
          <KpiCard
            label="Timely Filing Days"
            value={`${claim.timelyDaysRemaining ?? 15} Days`}
            delta={claim.timelyDaysRemaining && claim.timelyDaysRemaining < 15 ? "Action Urgently Needed" : "Within Boundary"}
            deltaType={claim.timelyDaysRemaining && claim.timelyDaysRemaining < 15 ? "decrease" : "increase"}
            subtitle="Payer Submission Limit"
            icon={<Clock className="w-5 h-5" />}
          />
        </div>

        {/* Claim Detail Panels */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main 837 Line Items Panel */}
          <div className="lg:col-span-2 neu p-6 space-y-4">
            <h3 className="text-[15px] font-bold text-[var(--foreground)] border-b border-[var(--border)] pb-2">
              837P Claim Line Details & Procedure Codes
            </h3>

            <div className="divide-y divide-[var(--border)] border border-[var(--border)] rounded-2xl overflow-hidden bg-[var(--surface)]">
              <div className="p-4 flex items-center justify-between text-xs">
                <div className="space-y-1">
                  <div className="font-mono font-bold text-sm text-[var(--foreground)]">
                    CPT {claim.cptCode} — Psychotherapy Service
                  </div>
                  <div className="text-[var(--foreground-muted)] font-medium">
                    PCCN: <span className="font-mono text-[var(--foreground)]">{claim.pccn || "PCCN-99120"}</span> | Associated Encounter:{" "}
                    <Link href={`/encounters/${claim.encounterId}`} className="font-mono text-[var(--accent)] hover:underline">
                      {claim.encounterId}
                    </Link>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-extrabold text-sm text-[var(--foreground)] tabular-nums">
                    ${(claim.submittedAmount ?? claim.billedAmount).toFixed(2)}
                  </div>
                  <span className="text-[10px] font-bold text-[var(--foreground-muted)]">Units: 1</span>
                </div>
              </div>
            </div>

            {parentCluster && (
              <div className="p-4 neu-pressed rounded-2xl space-y-2 border-l-4 border-[var(--status-critical)] text-xs">
                <div className="font-bold text-[var(--status-critical)] flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4" /> Remittance Denial Reason (CARC {parentCluster.carc.code}): {parentCluster.denialReason}
                </div>
                <div className="text-[var(--foreground-muted)] font-medium pl-5">
                  <strong className="text-[var(--foreground)]">CARC Description:</strong> {parentCluster.carc.description}
                </div>
                <div className="text-[var(--accent)] font-medium pl-5">
                  <strong className="text-[var(--foreground)]">Required Fix Action:</strong> {parentCluster.suggestedFixSummary}
                </div>
              </div>
            )}
          </div>

          {/* Right Sidebar Metadata */}
          <div className="neu p-6 space-y-4">
            <h3 className="text-[15px] font-bold text-[var(--foreground)] border-b border-[var(--border)] pb-2">
              Payer Routing & Transmission Log
            </h3>

            <div className="space-y-3 text-xs">
              <div className="flex justify-between py-1 border-b border-[var(--border)]">
                <span className="text-[var(--foreground-muted)] font-medium">Clearinghouse Gateway:</span>
                <span className="font-bold text-[var(--foreground)]">Stedi EDI 837 Network</span>
              </div>
              <div className="flex justify-between py-1 border-b border-[var(--border)]">
                <span className="text-[var(--foreground-muted)] font-medium">Functional Ack 999:</span>
                <span className="font-bold text-[var(--status-success)]">Accepted (2026-08-01)</span>
              </div>
              <div className="flex justify-between py-1 border-b border-[var(--border)]">
                <span className="text-[var(--foreground-muted)] font-medium">277 Claim Status:</span>
                <span className="font-bold text-[var(--foreground)]">{claim.status}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-[var(--border)]">
                <span className="text-[var(--foreground-muted)] font-medium">Source Record:</span>
                <span className="font-mono text-[var(--foreground)]">EHR Signed Handoff</span>
              </div>
            </div>
          </div>
        </div>

        {/* Resubmit Modal */}
        <GlassModal
          isOpen={isResubmitModalOpen}
          onClose={() => setIsResubmitModalOpen(false)}
          title={`Correct & Resubmit Claim ${claim.claimId}`}
          description={`Patient: ${claim.patientName} — Payer: ${claim.payerName}`}
        >
          <div className="space-y-4">
            <div className="p-3.5 neu-pressed rounded-2xl space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-[var(--foreground-muted)]">Billed Amount:</span>
                <span className="font-bold tabular-nums">${(claim.submittedAmount ?? claim.billedAmount).toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[var(--foreground-muted)]">Resubmission Type:</span>
                <span className="font-mono font-bold text-[var(--accent)]">Replacement Claim (Freq Code 7)</span>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <Button variant="secondary" size="sm" onClick={() => setIsResubmitModalOpen(false)}>
                Cancel
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={() => {
                  alert(`Claim ${claim.claimId} corrected and re-submitted to ${claim.payerName}!`);
                  setIsResubmitModalOpen(false);
                }}
              >
                <Send className="w-3.5 h-3.5 mr-1" /> Approve & Transmit 837P
              </Button>
            </div>
          </div>
        </GlassModal>
      </div>
    </AppShell>
  );
}
