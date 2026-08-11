"use client";

import React, { useState, use } from "react";
import Link from "next/link";
import { AppShell } from "@/components/layout/app-shell";
import { KpiCard } from "@/components/ui/kpi-card";
import { StatusBadge } from "@/components/ui/status-badge";
import { Button } from "@/components/ui/button";
import { GlassModal } from "@/components/ui/glass-modal";
import { useRcmDataStore } from "@/store/useRcmDataStore";
import { formatDate } from "@/lib/formatDate";
import {
  FileText,
  Clock,
  ShieldCheck,
  AlertTriangle,
  ArrowLeft,
  CheckCircle2,
  RotateCw,
  Send,
  AlertCircle,
} from "lucide-react";

export default function ClaimDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const claimIdParam = resolvedParams.id;
  const { claims, denialClusters, updateClaimStatus, addClaimNote } = useRcmDataStore();
  const [newNoteText, setNewNoteText] = useState("");

  const claim = claims.find((c) => c.claimId === claimIdParam || c.id === claimIdParam);
  const parentCluster = claim ? denialClusters.find((c) => c.claims.some((d) => d.claimId === claim.claimId)) : null;

  const [isResubmitModalOpen, setIsResubmitModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const handleAddNote = () => {
    if (!newNoteText.trim() || !claim) return;
    addClaimNote(claim.id, newNoteText.trim());
    setNewNoteText("");
    setToastMessage("Internal note added to claim activity log.");
    setTimeout(() => setToastMessage(null), 3000);
  };

  // 8.4 - Clean Not Found State if claim matching ID does not exist
  if (!claim) {
    return (
      <AppShell>
        <div className="max-w-md mx-auto my-12 neu p-8 text-center space-y-4 select-none bg-[var(--surface)]">
          <div className="w-12 h-12 rounded-full bg-[var(--status-critical-bg)] text-[var(--status-critical)] flex items-center justify-center mx-auto">
            <AlertCircle className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-[18px] font-extrabold text-[var(--foreground)]">Claim Not Found</h2>
            <p className="text-[12px] text-[var(--foreground-muted)] font-medium mt-1">
              No claim record matching ID <span className="font-mono text-[var(--foreground)]">{claimIdParam}</span> could be found.
            </p>
          </div>
          <Link href="/claims">
            <Button variant="primary" size="sm" className="w-full justify-center">
              <ArrowLeft className="w-4 h-4" /> Return to Claims Tracker
            </Button>
          </Link>
        </div>
      </AppShell>
    );
  }

  const handleResubmit = () => {
    updateClaimStatus(claim.claimId, "InAdjudication");
    setToastMessage(`Claim ${claim.claimId} corrected and re-submitted to ${claim.payerName}! Status updated to In Adjudication.`);
    setIsResubmitModalOpen(false);
    setTimeout(() => setToastMessage(null), 4000);
  };

  return (
    <AppShell>
      <div className="space-y-6 select-none">
        {/* Toast Notification Banner */}
        {toastMessage && (
          <div className="fixed bottom-6 right-6 z-50 px-4 py-3 rounded-2xl bg-[var(--status-success)] text-white font-bold text-xs shadow-2xl flex items-center gap-2 animate-bounce">
            <CheckCircle2 className="w-4 h-4" /> {toastMessage}
          </div>
        )}

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
              Patient: <Link href={`/patients/${claim.patientName === "Sarah Jenkins" ? "PAT-101" : claim.patientName === "Michael Chang" ? "PAT-102" : "PAT-103"}`} className="text-[var(--foreground)] font-bold hover:text-[var(--accent)] hover:underline transition-colors">{claim.patientName}</Link> • Payer:{" "}
              <strong className="text-[var(--foreground)]">{claim.payerName}</strong> • Service Date: {formatDate(claim.serviceDate)}
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
                <span className="font-bold text-[var(--status-success)]">Accepted ({formatDate(claim.serviceDate)})</span>
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

            {/* Internal Biller Notes & Activity Log (11.4) */}
            <div className="pt-4 border-t border-[var(--border)] space-y-3">
              <h4 className="text-[13px] font-extrabold text-[var(--foreground)] flex items-center justify-between">
                <span>Internal Biller Notes</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-[var(--accent-soft)] text-[var(--accent)] font-bold">
                  {(claim.notes || []).length} Notes
                </span>
              </h4>

              <div className="flex gap-2">
                <input
                  type="text"
                  value={newNoteText}
                  onChange={(e) => setNewNoteText(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleAddNote()}
                  placeholder="Add internal biller note..."
                  className="w-full neu-pressed px-3 py-1.5 rounded-xl text-xs text-[var(--foreground)] bg-transparent outline-none focus:ring-1 focus:ring-[var(--accent)]"
                />
                <Button size="sm" variant="primary" onClick={handleAddNote} disabled={!newNoteText.trim()}>
                  <Send className="w-3 h-3" />
                </Button>
              </div>

              <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                {(claim.notes || []).length === 0 ? (
                  <p className="text-[11px] text-[var(--foreground-muted)] italic">No notes added yet for this claim.</p>
                ) : (
                  (claim.notes || []).map((note) => (
                    <div key={note.id} className="p-2.5 neu-pressed rounded-xl text-xs space-y-1 bg-[var(--surface-muted)]">
                      <div className="flex justify-between items-center text-[10px] text-[var(--foreground-muted)] font-bold">
                        <span>{note.author}</span>
                        <span>{note.timestamp}</span>
                      </div>
                      <p className="text-[11.5px] text-[var(--foreground)] font-medium leading-tight">{note.text}</p>
                    </div>
                  ))
                )}
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
                onClick={handleResubmit}
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
