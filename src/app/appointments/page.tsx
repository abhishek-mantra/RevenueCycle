"use client";

import React, { useState } from "react";
import { AppShell } from "@/components/layout/app-shell";
import { KpiCard } from "@/components/ui/kpi-card";
import { StatusBadge } from "@/components/ui/status-badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { GlassModal } from "@/components/ui/glass-modal";
import { motion } from "framer-motion";
import {
  Calendar,
  ShieldCheck,
  CreditCard,
  AlertTriangle,
  Search,
  Plus,
  Mail,
  MessageSquare,
  CheckCircle2,
  AlertCircle,
  Clock,
  Sparkles,
} from "lucide-react";
import { mockAppointments } from "@/data/mockAppointments";
import { Appointment } from "@/schema/appointmentSchema";

export default function AppointmentsPage() {
  const [activeEligibilityModal, setActiveEligibilityModal] = useState<Appointment | null>(null);
  const [activeChargeModal, setActiveChargeModal] = useState<Appointment | null>(null);

  return (
    <AppShell>
      <div className="space-y-6 select-none">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-[22px] font-extrabold tracking-tight text-[var(--foreground)]">
                Pre-Visit Financials & Eligibility Worklist
              </h1>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] uppercase font-bold bg-[var(--accent-soft)] text-[var(--accent)] border border-black/5">
                Appointments Worklist
              </span>
            </div>
            <p className="text-[13px] text-[var(--foreground-muted)] font-medium mt-1">
              Real-time automated coverage verification 24-48h prior to session + upfront copay collection.
            </p>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <KpiCard
            label="Today's Appointments"
            value="18 Session"
            subtitle="100% checked automatically"
            icon={<Calendar className="w-5 h-5" />}
          />
          <KpiCard
            label="Coverage Active"
            value="16 Verified"
            delta="88.8% Active"
            deltaType="increase"
            subtitle="Eligible — In Network"
            icon={<ShieldCheck className="w-5 h-5" />}
          />
          <KpiCard
            label="Data Mismatches"
            value="1 Flagged"
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
              Tomorrow's Appointments Financial Worklist
            </h2>
            <span className="text-[12px] text-[var(--foreground-muted)] font-medium">
              Real-time 270/271 EDI verification active
            </span>
          </div>

          <div className="divide-y divide-[var(--border)] border border-[var(--border)] rounded-2xl overflow-hidden bg-[var(--surface)]">
            {mockAppointments.map((apt) => (
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
                      {apt.patientName} — <span className="text-[var(--foreground-muted)] font-medium">{apt.providerName}</span>
                    </h3>
                    <div className="flex items-center gap-3 text-xs text-[var(--foreground-muted)] font-medium mt-0.5">
                      <span>{apt.payerName}</span>
                      <span className="font-mono">ID: {apt.memberId}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  {apt.eligibilityStatus === "Eligible" && (
                    <StatusBadge tone="success" label="Active Coverage — In Network" />
                  )}
                  {apt.eligibilityStatus === "Mismatch" && (
                    <StatusBadge tone="critical" label="Member ID Mismatch Flag" />
                  )}

                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() => setActiveEligibilityModal(apt)}
                    >
                      Verify Benefits
                    </Button>

                    <Button
                      size="sm"
                      variant="primary"
                      onClick={() => setActiveChargeModal(apt)}
                    >
                      <CreditCard className="w-3.5 h-3.5" />
                      Collect Copay (${apt.copayAmount})
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Eligibility Modal with Inline Field Diff */}
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
                    alert("Corrected Member ID updated in EHR & RCM patient file!");
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
                  <Button variant="secondary" size="sm" onClick={() => alert("Payment link sent via SMS/Text!")}>
                    <MessageSquare className="w-3.5 h-3.5" /> Send Pay-by-Link (SMS)
                  </Button>
                  <Button variant="primary" size="sm" onClick={() => alert("Charged card on file successfully!")}>
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
