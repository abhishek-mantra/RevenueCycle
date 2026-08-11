"use client";

import React, { useState } from "react";
import Link from "next/link";
import { AppShell } from "@/components/layout/app-shell";
import { KpiCard } from "@/components/ui/kpi-card";
import { StatusBadge } from "@/components/ui/status-badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { GlassModal } from "@/components/ui/glass-modal";
import { useRcmDataStore } from "@/store/useRcmDataStore";
import { formatDate } from "@/lib/formatDate";
import { Appointment } from "@/schema/appointmentSchema";
import {
  Calendar,
  ShieldCheck,
  CreditCard,
  AlertTriangle,
  Plus,
  MessageSquare,
  CheckCircle2,
  AlertCircle,
  FileCheck2,
  Sparkles,
} from "lucide-react";

export default function AppointmentsPage() {
  const { appointments, addAppointment, completeAppointment } = useRcmDataStore();

  const [activeEligibilityModal, setActiveEligibilityModal] = useState<Appointment | null>(null);
  const [activeChargeModal, setActiveChargeModal] = useState<Appointment | null>(null);
  const [isNewAppModalOpen, setIsNewAppModalOpen] = useState(false);

  // New Appointment Form State
  const [newPatientName, setNewPatientName] = useState("");
  const [newPayerName, setNewPayerName] = useState("Blue Cross Blue Shield");
  const [newMemberId, setNewMemberId] = useState("");
  const [newServiceDate, setNewServiceDate] = useState("2026-08-11");
  const [newTime, setNewTime] = useState("10:00 AM");

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleCreateAppointment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPatientName || !newMemberId) return;

    addAppointment({
      patientName: newPatientName,
      providerName: "Dr. Evelyn Vance",
      payerName: newPayerName,
      memberId: newMemberId,
      submittedMemberId: newMemberId,
      returnedMemberId: newMemberId,
      eligibilityStatus: "Eligible",
      workflowStatus: "Scheduled",
      time: newTime,
      copayAmount: 20.0,
      deductibleRemaining: 150.0,
    });

    showToast(`New appointment created for ${newPatientName}!`);
    setIsNewAppModalOpen(false);
    setNewPatientName("");
    setNewMemberId("");
  };

  const handleCompleteVisit = (apt: Appointment) => {
    completeAppointment(apt.id);
    showToast(`Visit completed for ${apt.patientName}! Auto-generated linked Encounter & Claim on /claims.`);
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

        {/* Header (8.18 - Simplified Title) */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-[22px] font-extrabold tracking-tight text-[var(--foreground)]">
                Appointments
              </h1>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] uppercase font-bold bg-[var(--accent-soft)] text-[var(--accent)] border border-black/5">
                Pre-Visit Worklist
              </span>
            </div>
            <p className="text-[13px] text-[var(--foreground-muted)] font-medium mt-1">
              Real-time automated coverage verification prior to session + upfront copay collection and visit completion flow.
            </p>
          </div>

          <Button variant="primary" size="sm" onClick={() => setIsNewAppModalOpen(true)}>
            <Plus className="w-4 h-4" />
            New Appointment
          </Button>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <KpiCard
            label="Total Appointments"
            value={`${appointments.length} Sessions`}
            subtitle="100% checked automatically"
            icon={<Calendar className="w-5 h-5" />}
          />
          <KpiCard
            label="Coverage Active"
            value={`${appointments.filter((a) => a.eligibilityStatus === "Eligible").length} Verified`}
            delta="88.8% Active"
            deltaType="increase"
            subtitle="Eligible — In Network"
            icon={<ShieldCheck className="w-5 h-5" />}
          />
          <KpiCard
            label="Data Mismatches"
            value={`${appointments.filter((a) => a.eligibilityStatus === "Mismatch").length} Flagged`}
            delta="Member ID Diff"
            deltaType="decrease"
            subtitle="Inline diff correctable"
            icon={<AlertTriangle className="w-5 h-5" />}
          />
          <KpiCard
            label="Upfront Copays Collected"
            value="$420.00"
            delta="+35% vs post-visit"
            deltaType="increase"
            subtitle="Point-of-service capture"
            icon={<CreditCard className="w-5 h-5" />}
          />
        </div>

        {/* Appointments Table */}
        <div className="neu p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-[14px] font-bold text-[var(--foreground)]">
              Scheduled Appointments Financial Worklist
            </h2>
            <span className="text-[12px] text-[var(--foreground-muted)] font-medium">
              Real-time 270/271 EDI verification active
            </span>
          </div>

          <div className="divide-y divide-[var(--border)] border border-[var(--border)] rounded-2xl overflow-hidden bg-[var(--surface)]">
            {appointments.map((apt) => (
              <div
                key={apt.id}
                className="p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-[var(--surface-muted)] transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="px-3 py-1.5 rounded-2xl neu-pressed text-[13px] font-bold tabular-nums text-[var(--foreground)]">
                    {apt.time}
                  </div>
                  <div>
                    <h3 className="text-[15px] font-bold text-[var(--foreground)]">
                      <Link
                        href={`/patients/${apt.patientName === "Sarah Jenkins" ? "PAT-101" : apt.patientName === "Michael Chang" ? "PAT-102" : "PAT-103"}`}
                        className="hover:text-[var(--accent)] hover:underline transition-colors"
                      >
                        {apt.patientName}
                      </Link>{" "}
                      — <span className="text-[var(--foreground-muted)] font-medium">{apt.providerName}</span>
                    </h3>
                    <div className="flex items-center gap-3 text-xs text-[var(--foreground-muted)] font-medium mt-0.5">
                      <span>{apt.payerName}</span>
                      <span className="font-mono">ID: {apt.memberId}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  {apt.workflowStatus === "Completed" ? (
                    <StatusBadge tone="success" label="Visit Completed (Claim Generated)" />
                  ) : apt.eligibilityStatus === "Eligible" ? (
                    <StatusBadge tone="success" label="Active Coverage — In Network" />
                  ) : (
                    <StatusBadge tone="critical" label="Member ID Mismatch Flag" />
                  )}

                  <div className="flex items-center gap-2">
                    {apt.workflowStatus !== "Completed" && (
                      <Button
                        size="sm"
                        variant="primary"
                        onClick={() => handleCompleteVisit(apt)}
                      >
                        <FileCheck2 className="w-3.5 h-3.5" /> Complete Visit
                      </Button>
                    )}

                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() => setActiveEligibilityModal(apt)}
                    >
                      Verify Benefits
                    </Button>

                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() => setActiveChargeModal(apt)}
                    >
                      <CreditCard className="w-3.5 h-3.5" />
                      Copay (${apt.copayAmount})
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* New Appointment Modal (Stage 9 Creation Flow) */}
        <GlassModal
          isOpen={isNewAppModalOpen}
          onClose={() => setIsNewAppModalOpen(false)}
          title="Create New Appointment"
          description="Schedule a new session with real-time pre-visit eligibility verification"
        >
          <form onSubmit={handleCreateAppointment} className="space-y-4 text-xs">
            <div>
              <label className="block font-bold text-[var(--foreground)] mb-1">Patient Name *</label>
              <input
                type="text"
                required
                value={newPatientName}
                onChange={(e) => setNewPatientName(e.target.value)}
                placeholder="e.g. Elena Rostova"
                className="w-full neu-pressed px-3.5 py-2 rounded-xl text-[13px] text-[var(--foreground)] bg-transparent border-none outline-none focus:ring-2 focus:ring-[var(--accent)]"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-[var(--foreground)] mb-1">Insurance Payer</label>
                <select
                  value={newPayerName}
                  onChange={(e) => setNewPayerName(e.target.value)}
                  className="w-full neu-pressed px-3 py-2 rounded-xl text-[12px] text-[var(--foreground)] bg-transparent border-none outline-none focus:ring-2 focus:ring-[var(--accent)]"
                >
                  <option value="Blue Cross Blue Shield">Blue Cross Blue Shield</option>
                  <option value="Aetna Behavioral Health">Aetna Behavioral Health</option>
                  <option value="United Healthcare">United Healthcare</option>
                  <option value="Cigna Health">Cigna Health</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-[var(--foreground)] mb-1">Member ID *</label>
                <input
                  type="text"
                  required
                  value={newMemberId}
                  onChange={(e) => setNewMemberId(e.target.value)}
                  placeholder="e.g. BCBS-994120"
                  className="w-full neu-pressed px-3.5 py-2 rounded-xl text-[13px] text-[var(--foreground)] bg-transparent border-none outline-none focus:ring-2 focus:ring-[var(--accent)]"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-[var(--foreground)] mb-1">Service Date</label>
                <input
                  type="date"
                  value={newServiceDate}
                  onChange={(e) => setNewServiceDate(e.target.value)}
                  className="w-full neu-pressed px-3.5 py-2 rounded-xl text-[13px] text-[var(--foreground)] bg-transparent border-none outline-none focus:ring-2 focus:ring-[var(--accent)]"
                />
              </div>

              <div>
                <label className="block font-bold text-[var(--foreground)] mb-1">Time Slot</label>
                <input
                  type="text"
                  value={newTime}
                  onChange={(e) => setNewTime(e.target.value)}
                  className="w-full neu-pressed px-3.5 py-2 rounded-xl text-[13px] text-[var(--foreground)] bg-transparent border-none outline-none focus:ring-2 focus:ring-[var(--accent)]"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-[var(--border)]">
              <Button type="button" variant="secondary" size="sm" onClick={() => setIsNewAppModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" variant="primary" size="sm">
                <Plus className="w-3.5 h-3.5" /> Schedule & Verify
              </Button>
            </div>
          </form>
        </GlassModal>

        {/* Eligibility Modal */}
        <GlassModal
          isOpen={!!activeEligibilityModal}
          onClose={() => setActiveEligibilityModal(null)}
          title={`Eligibility & Benefits — ${activeEligibilityModal?.patientName}`}
          description={`Payer: ${activeEligibilityModal?.payerName}`}
        >
          {activeEligibilityModal && (
            <div className="space-y-4 text-xs">
              {activeEligibilityModal.eligibilityStatus === "Mismatch" && (
                <div className="p-3.5 bg-[var(--status-critical-bg)] border border-[var(--status-critical)]/20 rounded-2xl space-y-1.5">
                  <div className="font-bold text-[var(--status-critical)] flex items-center gap-1.5">
                    <AlertCircle className="w-4 h-4" /> Inline Field Mismatch Flagged by Payer
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <span className="text-[var(--foreground-muted)]">Submitted Member ID:</span>
                      <div className="font-mono font-bold text-[var(--status-critical)]">
                        {activeEligibilityModal.submittedMemberId}
                      </div>
                    </div>
                    <div>
                      <span className="text-[var(--foreground-muted)]">Payer Returned Member ID:</span>
                      <div className="font-mono font-bold text-[var(--status-success)]">
                        {activeEligibilityModal.returnedMemberId}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div className="p-4 neu-pressed rounded-2xl space-y-2">
                <div className="flex justify-between">
                  <span className="text-[var(--foreground-muted)] font-medium">Copay per Session:</span>
                  <span className="font-bold tabular-nums">${(activeEligibilityModal.copayAmount ?? 0).toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[var(--foreground-muted)] font-medium">Deductible Remaining:</span>
                  <span className="font-bold tabular-nums">${(activeEligibilityModal.deductibleRemaining ?? 0).toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[var(--foreground-muted)] font-medium">In-Network Status:</span>
                  <span className="font-bold text-[var(--status-success)]">In-Network Tier 1</span>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <Button variant="secondary" size="sm" onClick={() => setActiveEligibilityModal(null)}>
                  Close
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => {
                    showToast("Corrected Member ID updated in EHR & RCM patient file!");
                    setActiveEligibilityModal(null);
                  }}
                >
                  Accept Payer Returned ID
                </Button>
              </div>
            </div>
          )}
        </GlassModal>

        {/* Pre-Visit Charge Builder Modal */}
        <GlassModal
          isOpen={!!activeChargeModal}
          onClose={() => setActiveChargeModal(null)}
          title={`Pre-Visit Upfront Charge Builder — ${activeChargeModal?.patientName}`}
          description="Collect copay or deposit prior to session start"
        >
          {activeChargeModal && (
            <div className="space-y-4">
              <div className="p-4 neu-pressed rounded-2xl space-y-2 text-xs">
                <div className="flex justify-between font-semibold">
                  <span>Line Item: Session Copay</span>
                  <span className="tabular-nums">${(activeChargeModal.copayAmount ?? 0).toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-[var(--foreground-muted)]">
                  <span>Card Processing Fee (2.9%):</span>
                  <span className="tabular-nums">$0.87</span>
                </div>
                <div className="border-t border-[var(--border)] pt-2 flex justify-between font-extrabold text-sm text-[var(--foreground)]">
                  <span>Total Amount Due:</span>
                  <span className="tabular-nums">${((activeChargeModal.copayAmount ?? 0) + 0.87).toFixed(2)}</span>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[12px] font-bold text-[var(--foreground)]">Collection Delivery Method:</label>
                <div className="grid grid-cols-2 gap-2">
                  <Button variant="secondary" size="sm" onClick={() => {
                    showToast("Payment link sent via SMS/Text!");
                    setActiveChargeModal(null);
                  }}>
                    <MessageSquare className="w-3.5 h-3.5" /> Send Pay-by-Link (SMS)
                  </Button>
                  <Button variant="primary" size="sm" onClick={() => {
                    showToast("Charged card on file successfully!");
                    setActiveChargeModal(null);
                  }}>
                    <CreditCard className="w-3.5 h-3.5" /> Charge Card on File
                  </Button>
                </div>
              </div>
            </div>
          )}
        </GlassModal>
      </div>
    </AppShell>
  );
}
