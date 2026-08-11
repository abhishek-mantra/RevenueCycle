"use client";

import React, { useState } from "react";
import Link from "next/link";
import { AppShell } from "@/components/layout/app-shell";
import { StatusBadge } from "@/components/ui/status-badge";
import { Button } from "@/components/ui/button";
import { GlassModal } from "@/components/ui/glass-modal";
import { useRcmDataStore } from "@/store/useRcmDataStore";
import { formatDate } from "@/lib/formatDate";
import {
  ShieldAlert,
  CheckCircle2,
  AlertTriangle,
  Plus,
  Clock,
  UserCheck,
  Building2,
  FileCheck2,
} from "lucide-react";

export default function PriorAuthPage() {
  const { priorAuths, addPriorAuth, updatePriorAuthVisits } = useRcmDataStore();

  const [isNewAuthModalOpen, setIsNewAuthModalOpen] = useState(false);
  const [patientName, setPatientName] = useState("");
  const [payerName, setPayerName] = useState("Blue Cross Blue Shield");
  const [cptCode, setCptCode] = useState("90837");
  const [authNumber, setAuthNumber] = useState("");
  const [visitsAuthorized, setVisitsAuthorized] = useState("12");
  const [expirationDate, setExpirationDate] = useState("2026-10-31");
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleCreateAuth = () => {
    if (!patientName || !authNumber) return;

    addPriorAuth({
      patientId: `PAT-${Math.floor(100 + Math.random() * 900)}`,
      patientName,
      payerName,
      cptCode,
      authNumber,
      visitsAuthorized: parseInt(visitsAuthorized) || 12,
      visitsUsed: 0,
      expirationDate,
      status: "Active",
    });

    showToast(`Created Prior Authorization #${authNumber} for ${patientName}!`);
    setIsNewAuthModalOpen(false);
    setPatientName("");
    setAuthNumber("");
  };

  const content = (
    <div className="space-y-6 select-none">
      {/* Toast Notification */}
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
              Prior Authorization Worklist
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] uppercase font-bold bg-[var(--accent-soft)] text-[var(--accent)] border border-black/5">
              Auth & Renewal Tracker
            </span>
          </div>
          <p className="text-[13px] text-[var(--foreground-muted)] font-medium mt-1">
            Track prior auth numbers, authorized vs used visit counts, and timely renewal reminders before expiration.
          </p>
        </div>

        <Button variant="primary" size="sm" onClick={() => setIsNewAuthModalOpen(true)}>
          <Plus className="w-4 h-4 mr-1" /> New Prior Auth Record
        </Button>
      </div>

      {/* Auth Cards List */}
      <div className="neu p-5 space-y-4 bg-[var(--surface)] border border-white/60">
        <div className="flex items-center justify-between border-b border-[var(--border)] pb-3">
          <h2 className="text-[14px] font-bold text-[var(--foreground)] flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-[var(--accent)]" /> Active & Pending Prior Authorizations ({priorAuths.length})
          </h2>
          <span className="text-xs text-[var(--foreground-muted)] font-medium">Auto-scrubbed against claim CPT codes</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {priorAuths.map((auth) => {
            const pctUsed = Math.min(100, Math.round((auth.visitsUsed / auth.visitsAuthorized) * 100));

            return (
              <div key={auth.id} className="neu p-5 space-y-3 border border-white/70 bg-[var(--surface)] hover:border-black/10 transition-all">
                <div className="flex items-center justify-between">
                  <span className="font-mono font-bold text-xs text-[var(--accent)] bg-[var(--accent-soft)] px-2.5 py-0.5 rounded-full">
                    {auth.authNumber}
                  </span>
                  <StatusBadge
                    tone={auth.status === "Active" ? "success" : auth.status === "ExpiringSoon" ? "warning" : "critical"}
                    label={auth.status === "Active" ? "Active" : auth.status === "ExpiringSoon" ? "Expiring Soon" : "Exhausted"}
                  />
                </div>

                <div>
                  <Link href={`/patients/${auth.patientId}`} className="font-bold text-[15px] text-[var(--foreground)] hover:underline">
                    {auth.patientName}
                  </Link>
                  <p className="text-xs text-[var(--foreground-muted)] font-medium">{auth.payerName} • CPT {auth.cptCode}</p>
                </div>

                {/* Visit Usage Bar */}
                <div className="space-y-1 pt-1">
                  <div className="flex justify-between text-xs font-bold">
                    <span className="text-[var(--foreground-muted)]">Visits Used:</span>
                    <span className="text-[var(--foreground)] tabular-nums">{auth.visitsUsed} / {auth.visitsAuthorized} ({pctUsed}%)</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-[var(--border)] overflow-hidden">
                    <div
                      className={`h-full transition-all rounded-full ${pctUsed >= 100 ? "bg-[var(--status-critical)]" : pctUsed >= 80 ? "bg-[var(--status-warning)]" : "bg-[var(--accent)]"}`}
                      style={{ width: `${pctUsed}%` }}
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs pt-2 border-t border-[var(--border)]">
                  <span className="text-[var(--foreground-muted)] font-medium">Expires: {formatDate(auth.expirationDate)}</span>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => updatePriorAuthVisits(auth.id, 1)}
                      className="px-2 py-0.5 rounded-lg neu-soft hover:bg-[var(--surface-muted)] text-[11px] font-bold text-[var(--foreground)] cursor-pointer"
                      title="Log 1 Visit Used"
                    >
                      +1 Visit
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* New Auth Modal */}
      <GlassModal
        isOpen={isNewAuthModalOpen}
        onClose={() => setIsNewAuthModalOpen(false)}
        title="Create Prior Authorization Record"
        description="Attach approved authorization number and visit allowance to patient profile."
      >
        <div className="space-y-4 text-xs select-none">
          <div>
            <label className="block font-bold text-[var(--foreground)] mb-1">Patient Name *</label>
            <input
              type="text"
              value={patientName}
              onChange={(e) => setPatientName(e.target.value)}
              placeholder="e.g. Sarah Jenkins"
              className="w-full neu-pressed px-3.5 py-2 rounded-xl text-xs text-[var(--foreground)] bg-transparent outline-none focus:ring-1 focus:ring-[var(--accent)]"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-[var(--foreground)] mb-1">Payer Name</label>
              <select
                value={payerName}
                onChange={(e) => setPayerName(e.target.value)}
                className="w-full neu-pressed px-3.5 py-2 rounded-xl text-xs text-[var(--foreground)] bg-transparent outline-none"
              >
                <option value="Blue Cross Blue Shield">Blue Cross Blue Shield</option>
                <option value="Aetna Behavioral Health">Aetna Behavioral Health</option>
                <option value="United Healthcare">United Healthcare</option>
                <option value="Cigna Health">Cigna Health</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-[var(--foreground)] mb-1">CPT Code</label>
              <input
                type="text"
                value={cptCode}
                onChange={(e) => setCptCode(e.target.value)}
                className="w-full neu-pressed px-3.5 py-2 rounded-xl text-xs text-[var(--foreground)] font-mono font-bold bg-transparent outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-[var(--foreground)] mb-1">Auth # *</label>
              <input
                type="text"
                value={authNumber}
                onChange={(e) => setAuthNumber(e.target.value)}
                placeholder="e.g. AUTH-BCBS-9042"
                className="w-full neu-pressed px-3.5 py-2 rounded-xl text-xs text-[var(--foreground)] font-mono font-bold bg-transparent outline-none"
              />
            </div>

            <div>
              <label className="block font-bold text-[var(--foreground)] mb-1">Visits Authorized</label>
              <input
                type="number"
                value={visitsAuthorized}
                onChange={(e) => setVisitsAuthorized(e.target.value)}
                className="w-full neu-pressed px-3.5 py-2 rounded-xl text-xs text-[var(--foreground)] font-bold bg-transparent outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-[var(--foreground)] mb-1">Expiration Date</label>
            <input
              type="date"
              value={expirationDate}
              onChange={(e) => setExpirationDate(e.target.value)}
              className="w-full neu-pressed px-3.5 py-2 rounded-xl text-xs text-[var(--foreground)] bg-transparent outline-none"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-[var(--border)]">
            <Button variant="secondary" size="sm" onClick={() => setIsNewAuthModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" onClick={handleCreateAuth} disabled={!patientName || !authNumber}>
              Create Auth Record
            </Button>
          </div>
        </div>
      </GlassModal>
    </div>
  );

  return <AppShell>{content}</AppShell>;
}
