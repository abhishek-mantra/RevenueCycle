"use client";

import React, { useState } from "react";
import Link from "next/link";
import { AppShell } from "@/components/layout/app-shell";
import { KpiCard } from "@/components/ui/kpi-card";
import { StatusBadge } from "@/components/ui/status-badge";
import { useRcmDataStore } from "@/store/useRcmDataStore";
import { formatDate } from "@/lib/formatDate";
import { motion, AnimatePresence } from "framer-motion";
import {
  FileCheck2,
  DollarSign,
  ChevronDown,
  ChevronUp,
  UserCheck,
  Layers,
  ArrowRight,
  ExternalLink,
} from "lucide-react";

export default function EncountersPage() {
  const { encounters, claims, addInvoice, resubmitClaims } = useRcmDataStore();
  const [expandedEncounterId, setExpandedEncounterId] = useState<string | null>(
    encounters[0]?.id || "ENC-401"
  );
  const [activeTab, setActiveTab] = useState<"primary" | "secondary" | "timeline">("primary");
  const [mainView, setMainView] = useState<"all" | "triage">("all");
  const [selectedTriageIds, setSelectedTriageIds] = useState<string[]>([]);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const totalGrossBilled = encounters.reduce((sum, e) => sum + (e.totalCharges || 0), 0);
  const totalInsurancePaid = encounters.reduce((sum, e) => sum + (e.insurancePaid || 0), 0);
  const totalAdjustments = encounters.reduce((sum, e) => sum + (e.adjustments || 0), 0);
  const totalPatientResp = encounters.reduce((sum, e) => sum + (e.patientResponsibility || 0), 0);

  const pendingEncounters = encounters.filter((e) => e.status !== "Reconciled");

  const handleBatchAutoSubmit = () => {
    if (selectedTriageIds.length === 0) return;
    const targetClaims = claims.filter((c) => selectedTriageIds.includes(c.encounterId || "")).map((c) => c.id);
    if (targetClaims.length > 0) {
      resubmitClaims(targetClaims);
    }
    setToastMessage(`AI Touchless Automation: Successfully scrubbed & submitted ${selectedTriageIds.length} 837P claims to Stedi Clearinghouse!`);
    setSelectedTriageIds([]);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const handleBatchIssueInvoices = () => {
    if (selectedTriageIds.length === 0) return;
    selectedTriageIds.forEach((encId) => {
      const enc = encounters.find((e) => e.id === encId);
      if (!enc) return;
      const todayStr = new Date().toISOString().split("T")[0];
      addInvoice({
        invoiceNumber: `INV-2026-${Math.floor(1000 + Math.random() * 9000)}`,
        patientId: `PAT-${Math.floor(100 + Math.random() * 900)}`,
        patientName: enc.patientName,
        encounterId: enc.id,
        issueDate: todayStr,
        issuedDate: todayStr,
        dueDate: todayStr,
        status: "Sent",
        totalAmount: enc.patientResponsibility || 50.0,
        amountPaid: 0,
        balanceDue: enc.patientResponsibility || 50.0,
        receipts: [],
      });
    });
    setToastMessage(`Issued ${selectedTriageIds.length} patient invoices with digital pay-links!`);
    setSelectedTriageIds([]);
    setTimeout(() => setToastMessage(null), 4000);
  };

  return (
    <AppShell>
      <div className="space-y-6 select-none">
        {/* Toast Notification Banner */}
        {toastMessage && (
          <div className="fixed bottom-6 right-6 z-50 px-4 py-3 rounded-2xl bg-[var(--accent)] text-white font-bold text-xs shadow-2xl flex items-center gap-2 animate-bounce">
            <FileCheck2 className="w-4 h-4 text-[var(--status-success)]" /> {toastMessage}
          </div>
        )}

        {/* Header (8.18 - Simplified Title) */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-[22px] font-extrabold tracking-tight text-[var(--foreground)]">
                Encounters
              </h1>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] uppercase font-bold bg-[var(--accent-soft)] text-[var(--accent)] border border-black/5">
                Core Data Keystone
              </span>
            </div>
            <p className="text-[13px] text-[var(--foreground-muted)] font-medium mt-1">
              Generated automatically from signed notes and visits. All downstream claims and patient AR derive from here.
            </p>
          </div>

          {/* Main View Toggle */}
          <div className="neu-pressed p-1 rounded-2xl flex items-center gap-1 text-xs self-start md:self-auto">
            <button
              onClick={() => setMainView("all")}
              className={`px-4 py-2 rounded-xl font-bold transition-all cursor-pointer ${
                mainView === "all" ? "bg-[var(--accent)] text-white shadow-xs" : "text-[var(--foreground-muted)] hover:text-[var(--foreground)]"
              }`}
            >
              All Encounters ({encounters.length})
            </button>
            <button
              onClick={() => setMainView("triage")}
              className={`px-4 py-2 rounded-xl font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                mainView === "triage" ? "bg-[var(--accent)] text-white shadow-xs" : "text-[var(--foreground-muted)] hover:text-[var(--foreground)]"
              }`}
            >
              <span>AI Triage & Pending Billing</span>
              <span className="px-2 py-0.5 text-[10px] font-extrabold rounded-full bg-[var(--status-warning-bg)] text-[var(--status-warning)]">
                {pendingEncounters.length}
              </span>
            </button>
          </div>
        </div>

        {/* Financial Reconciled KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <KpiCard
            label="Total Gross Billed"
            value={`$${totalGrossBilled.toFixed(2)}`}
            subtitle={`${encounters.length} Encounters active`}
            icon={<DollarSign className="w-5 h-5" />}
          />
          <KpiCard
            label="Insurance Payments"
            value={`$${totalInsurancePaid.toFixed(2)}`}
            delta="100% Adjudicated"
            deltaType="increase"
            subtitle="Auto-posted from ERA 835"
            icon={<FileCheck2 className="w-5 h-5" />}
          />
          <KpiCard
            label="Contract Adjustments"
            value={`$${totalAdjustments.toFixed(2)}`}
            subtitle="Contractual write-offs"
            icon={<Layers className="w-5 h-5" />}
          />
          <KpiCard
            label="Patient Responsibility"
            value={`$${totalPatientResp.toFixed(2)}`}
            delta="Decoupled AR"
            deltaType="neutral"
            subtitle="Patient AR balance"
            icon={<UserCheck className="w-5 h-5" />}
          />
        </div>

        {/* Conditional View: Triage vs All Encounters */}
        {mainView === "triage" ? (
          <div className="space-y-4">
            {/* Triage Batch Action Bar */}
            <div className="neu p-4 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[var(--surface)] border border-white/60">
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={selectedTriageIds.length === pendingEncounters.length && pendingEncounters.length > 0}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setSelectedTriageIds(pendingEncounters.map((p) => p.id));
                    } else {
                      setSelectedTriageIds([]);
                    }
                  }}
                  className="w-4 h-4 rounded text-[var(--accent)] cursor-pointer"
                />
                <span className="text-xs font-bold text-[var(--foreground)]">
                  {selectedTriageIds.length} Encounters Selected for AI Batch Dispatch
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleBatchAutoSubmit}
                  disabled={selectedTriageIds.length === 0}
                  className="px-3.5 py-1.5 rounded-xl text-xs font-bold bg-[var(--accent)] text-white hover:bg-[var(--accent-hover)] disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer shadow-xs"
                >
                  ⚡ Auto-Submit Selected 837P Claims
                </button>
                <button
                  onClick={handleBatchIssueInvoices}
                  disabled={selectedTriageIds.length === 0}
                  className="px-3.5 py-1.5 rounded-xl text-xs font-bold bg-[var(--surface-muted)] text-[var(--foreground)] hover:bg-[var(--border)] disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer border border-[var(--border)]"
                >
                  📝 Issue Patient Invoices
                </button>
              </div>
            </div>

            {/* Triage Encounters Card List */}
            {pendingEncounters.map((enc) => {
              const isSelected = selectedTriageIds.includes(enc.id);
              return (
                <div
                  key={enc.id}
                  className={`neu p-5 rounded-2xl transition-all border ${
                    isSelected ? "border-[var(--accent)] bg-[var(--accent-soft)]/20" : "border-white/60"
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-start gap-3">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedTriageIds([...selectedTriageIds, enc.id]);
                          } else {
                            setSelectedTriageIds(selectedTriageIds.filter((id) => id !== enc.id));
                          }
                        }}
                        className="w-4 h-4 rounded text-[var(--accent)] cursor-pointer mt-1"
                      />
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-mono font-bold text-xs px-2.5 py-0.5 rounded-full bg-[var(--accent-soft)] text-[var(--accent)]">
                            {enc.encounterId}
                          </span>
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] uppercase font-bold bg-[var(--status-success-bg)] text-[var(--status-success)] border border-[var(--status-success)]/20">
                            ✓ AI Clean Claim - 0 Scrub Errors
                          </span>
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] uppercase font-bold bg-[var(--status-warning-bg)] text-[var(--status-warning)]">
                            {enc.primaryPayer ? `837P Ready (${enc.primaryPayer})` : "Self-Pay Ready"}
                          </span>
                        </div>

                        <h3 className="text-[15px] font-bold text-[var(--foreground)]">
                          {enc.patientName} — <span className="text-[var(--foreground-muted)] font-normal">{enc.providerName}</span>
                        </h3>
                        <p className="text-xs text-[var(--foreground-muted)] font-medium">
                          DOS: {formatDate(enc.dos)} | Total Charges: ${(enc.totalCharges ?? 0).toFixed(2)} | Patient Copay: ${(enc.patientResponsibility ?? 0).toFixed(2)}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 self-end sm:self-center">
                      <Link
                        href={`/encounters/${enc.id}`}
                        className="px-3 py-1.5 rounded-xl text-xs font-bold bg-[var(--surface-muted)] text-[var(--foreground)] hover:bg-[var(--border)] transition-all flex items-center gap-1"
                      >
                        Inspect <ExternalLink className="w-3 h-3" />
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          /* Encounters List (8.2 - Clickable Rows linking to /encounters/[id]) */
          <div className="space-y-4">
            {encounters.map((enc) => {
              const isExpanded = expandedEncounterId === enc.id;
              return (
                <div key={enc.id} className="neu overflow-hidden border border-white/60">
                  {/* Encounter Summary Header Strip */}
                  <div className="p-5 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <Link
                        href={`/encounters/${enc.id}`}
                        className="font-mono font-bold text-xs px-2.5 py-0.5 rounded-full bg-[var(--accent-soft)] text-[var(--accent)] hover:bg-[var(--accent)] hover:text-white transition-all flex items-center gap-1 group"
                      >
                        <span>{enc.encounterId}</span>
                        <ExternalLink className="w-3 h-3 opacity-70 group-hover:opacity-100" />
                      </Link>
                      <StatusBadge
                        tone={enc.status === "Reconciled" ? "success" : "warning"}
                        label={enc.status === "Reconciled" ? "Reconciled & Posted" : "Pending Adjudication"}
                      />
                    </div>
                    <h3 className="text-[17px] font-bold text-[var(--foreground)]">
                      <Link href={`/patients/${enc.patientName === "Sarah Jenkins" ? "PAT-101" : enc.patientName === "Michael Chang" ? "PAT-102" : "PAT-103"}`} className="hover:text-[var(--accent)] hover:underline transition-colors font-bold text-[var(--foreground)]">
                        {enc.patientName}
                      </Link>{" "}
                      — <span className="text-[var(--foreground-muted)] font-medium">{enc.providerName}</span>
                    </h3>
                    <div className="flex items-center gap-4 text-xs text-[var(--foreground-muted)] font-medium">
                      <span>DOS: {formatDate(enc.dos)}</span>
                      <span>Primary: {enc.primaryPayer}</span>
                      {enc.secondaryPayer && <span>Secondary: {enc.secondaryPayer}</span>}
                    </div>
                  </div>

                  {/* Summary Strip Financial Metrics & Expand Control */}
                  <div className="flex items-center gap-6 self-end lg:self-center">
                    <div className="text-right">
                      <div className="text-[11px] font-bold uppercase tracking-wider text-[var(--foreground-faint)]">
                        Charges / Paid
                      </div>
                      <div className="text-[16px] font-extrabold text-[var(--foreground)] tabular-nums">
                        ${(enc.totalCharges ?? 0).toFixed(2)} / <span className="text-[var(--status-success)]">${(enc.insurancePaid ?? 0).toFixed(2)}</span>
                      </div>
                    </div>

                    <div className="text-right border-l border-[var(--border)] pl-4">
                      <div className="text-[11px] font-bold uppercase tracking-wider text-[var(--foreground-faint)]">
                        Patient AR
                      </div>
                      <div className="text-[16px] font-extrabold text-[var(--foreground)] tabular-nums">
                        ${(enc.patientResponsibility ?? 0).toFixed(2)}
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Link
                        href={`/encounters/${enc.id}`}
                        className="px-3 py-1 rounded-xl text-xs font-bold bg-[var(--accent-soft)] text-[var(--accent)] hover:bg-[var(--accent)] hover:text-white transition-all flex items-center gap-1"
                      >
                        Detail <ArrowRight className="w-3 h-3" />
                      </Link>
                      <button
                        onClick={() => setExpandedEncounterId(isExpanded ? null : enc.id)}
                        aria-label="Toggle encounter breakdown"
                        className="p-1.5 rounded-full neu-soft text-[var(--foreground-muted)] hover:text-[var(--foreground)] transition-colors cursor-pointer"
                      >
                        {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Expandable EOB Breakdown & Payer Tabs */}
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden bg-[var(--surface)] border-t border-[var(--border)] p-5 space-y-4"
                    >
                      {/* Payer Detail Tabs */}
                      <div className="flex items-center justify-between border-b border-[var(--border)] pb-3">
                        <div className="neu-pressed p-1 rounded-full flex items-center gap-1 text-[12px]">
                          <button
                            onClick={() => setActiveTab("primary")}
                            className={`px-4 py-1 rounded-full font-bold transition-all cursor-pointer ${
                              activeTab === "primary" ? "bg-[var(--accent)] text-white" : "text-[var(--foreground-muted)]"
                            }`}
                          >
                            Primary Payer Detail
                          </button>
                          <button
                            onClick={() => setActiveTab("secondary")}
                            className={`px-4 py-1 rounded-full font-bold transition-all cursor-pointer ${
                              activeTab === "secondary" ? "bg-[var(--accent)] text-white" : "text-[var(--foreground-muted)]"
                            }`}
                          >
                            Secondary Payer Detail
                          </button>
                          <button
                            onClick={() => setActiveTab("timeline")}
                            className={`px-4 py-1 rounded-full font-bold transition-all cursor-pointer ${
                              activeTab === "timeline" ? "bg-[var(--accent)] text-white" : "text-[var(--foreground-muted)]"
                            }`}
                          >
                            Audit Timeline
                          </button>
                        </div>
                      </div>

                      {/* EOB Line Items */}
                      <div className="space-y-3">
                        <h4 className="text-[12px] font-bold uppercase tracking-wider text-[var(--foreground-faint)]">
                          From EOB / ERA Line Item Adjudication
                        </h4>

                        <div className="divide-y divide-[var(--border)] border border-[var(--border)] rounded-2xl overflow-hidden">
                          {(enc.lines ?? []).map((line, idx) => (
                            <div key={idx} className="p-4 bg-[var(--surface)] space-y-2">
                              <div className="flex items-center justify-between text-xs font-bold">
                                <span>
                                  CPT {line.cpt} — <span className="text-[var(--foreground-muted)] font-normal">{line.description}</span>
                                </span>
                                <span className="tabular-nums">Billed: ${line.charge.toFixed(2)} | Paid: ${line.paid.toFixed(2)}</span>
                              </div>

                              <div className="p-3 neu-pressed rounded-xl text-xs space-y-1">
                                <div className="font-mono font-bold text-[var(--accent)]">
                                  {line.carc} Code Match
                                </div>
                                <div className="text-[var(--foreground-muted)] font-medium">
                                  {line.plainEnglishReason}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
        )}
      </div>
    </AppShell>
  );
}
