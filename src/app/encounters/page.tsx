"use client";

import React, { useState } from "react";
import { AppShell } from "@/components/layout/app-shell";
import { KpiCard } from "@/components/ui/kpi-card";
import { StatusBadge } from "@/components/ui/status-badge";
import { Button } from "@/components/ui/button";
import { DataTable, Column } from "@/components/ui/data-table";
import { motion, AnimatePresence } from "framer-motion";
import {
  FileCheck2,
  DollarSign,
  ChevronDown,
  ChevronUp,
  FileText,
  UserCheck,
  Building2,
  Calendar,
  Layers,
  ArrowRight,
  Sparkles,
} from "lucide-react";

interface EncounterRecord {
  id: string;
  encounterId: string;
  patientName: string;
  providerName: string;
  dos: string;
  primaryPayer: string;
  secondaryPayer?: string;
  totalCharges: number;
  adjustments: number;
  insurancePaid: number;
  patientResponsibility: number;
  prEligible: number;
  prIneligible: number;
  balanceDue: number;
  status: "Completed" | "PendingAdjudication" | "Billable";
  lines: {
    cpt: string;
    description: string;
    charge: number;
    paid: number;
    balance: number;
    carc: string;
    plainEnglishReason: string;
  }[];
}

const mockEncounters: EncounterRecord[] = [
  {
    id: "ENC-401",
    encounterId: "ENC-2026-401",
    patientName: "Sarah Jenkins",
    providerName: "Dr. Evelyn Vance",
    dos: "2026-08-04",
    primaryPayer: "Blue Cross Blue Shield",
    secondaryPayer: "Aetna (Secondary)",
    totalCharges: 250.0,
    adjustments: 75.0,
    insurancePaid: 145.0,
    patientResponsibility: 30.0,
    prEligible: 30.0,
    prIneligible: 0.0,
    balanceDue: 0.0,
    status: "Completed",
    lines: [
      {
        cpt: "90837",
        description: "Psychotherapy 60 min",
        charge: 200.0,
        paid: 145.0,
        balance: 0.0,
        carc: "CO 45",
        plainEnglishReason: "Contractual fee schedule adjustment applied per in-network agreement.",
      },
      {
        cpt: "90785",
        description: "Interactive Complexity Add-on",
        charge: 50.0,
        paid: 0.0,
        balance: 30.0,
        carc: "PR 1",
        plainEnglishReason: "Deductible applied to secondary coverage.",
      },
    ],
  },
  {
    id: "ENC-402",
    encounterId: "ENC-2026-402",
    patientName: "Michael Vance",
    providerName: "Marcus Sterling, LCSW",
    dos: "2026-08-03",
    primaryPayer: "Aetna Behavioral Health",
    totalCharges: 220.0,
    adjustments: 0.0,
    insurancePaid: 0.0,
    patientResponsibility: 220.0,
    prEligible: 0.0,
    prIneligible: 220.0,
    balanceDue: 220.0,
    status: "PendingAdjudication",
    lines: [
      {
        cpt: "90791",
        description: "Psychiatric Diagnostic Evaluation",
        charge: 220.0,
        paid: 0.0,
        balance: 220.0,
        carc: "CO 197",
        plainEnglishReason: "Pre-authorization required for initial intake evaluation.",
      },
    ],
  },
];

export default function EncountersPage() {
  const [expandedEncounterId, setExpandedEncounterId] = useState<string | null>("ENC-401");
  const [activeTab, setActiveTab] = useState<"primary" | "secondary" | "timeline">("primary");

  return (
    <AppShell>
      <div className="space-y-6 select-none">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-[22px] font-extrabold tracking-tight text-[var(--foreground)]">
                Encounters & Billable Events
              </h1>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] uppercase font-bold bg-[var(--accent-soft)] text-[var(--accent)] border border-black/5">
                Core Data Keystone
              </span>
            </div>
            <p className="text-[13px] text-[var(--foreground-muted)] font-medium mt-1">
              Generated automatically from signed note + invoice. All downstream claims & patient AR derive from here.
            </p>
          </div>
        </div>

        {/* Financial Reconciled KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <KpiCard
            label="Total Gross Billed"
            value="$470.00"
            subtitle="2 Encounters today"
            icon={<DollarSign className="w-5 h-5" />}
          />
          <KpiCard
            label="Insurance Payments"
            value="$145.00"
            delta="100% Adjudicated"
            deltaType="increase"
            subtitle="Auto-posted from ERA 835"
            icon={<FileCheck2 className="w-5 h-5" />}
          />
          <KpiCard
            label="Contract Adjustments"
            value="$75.00"
            subtitle="Contractual write-offs"
            icon={<Layers className="w-5 h-5" />}
          />
          <KpiCard
            label="Patient Responsibility"
            value="$250.00"
            delta="PR Eligible: $30"
            deltaType="neutral"
            subtitle="Decoupled AR state"
            icon={<UserCheck className="w-5 h-5" />}
          />
        </div>

        {/* Encounters List */}
        <div className="space-y-4">
          {mockEncounters.map((enc) => {
            const isExpanded = expandedEncounterId === enc.id;
            return (
              <div key={enc.id} className="neu overflow-hidden border border-white/60">
                {/* Encounter Summary Header Strip */}
                <div
                  onClick={() => setExpandedEncounterId(isExpanded ? null : enc.id)}
                  className="p-5.5 flex flex-col lg:flex-row lg:items-center justify-between gap-4 cursor-pointer hover:bg-[var(--surface-muted)]/50 transition-colors"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-xs px-2.5 py-0.5 rounded-full bg-[var(--accent-soft)] text-[var(--accent)]">
                        {enc.encounterId}
                      </span>
                      <StatusBadge
                        tone={enc.status === "Completed" ? "success" : "warning"}
                        label={enc.status === "Completed" ? "Reconciled & Posted" : "Pending Adjudication"}
                      />
                    </div>
                    <h3 className="text-[17px] font-bold text-[var(--foreground)]">
                      {enc.patientName} — <span className="text-[var(--foreground-muted)] font-medium">{enc.providerName}</span>
                    </h3>
                    <div className="flex items-center gap-4 text-xs text-[var(--foreground-muted)] font-medium">
                      <span>DOS: {enc.dos}</span>
                      <span>Primary: {enc.primaryPayer}</span>
                      {enc.secondaryPayer && <span>Secondary: {enc.secondaryPayer}</span>}
                    </div>
                  </div>

                  {/* Summary Strip Financial Metrics */}
                  <div className="flex items-center gap-6 self-end lg:self-center">
                    <div className="text-right">
                      <div className="text-[11px] font-bold uppercase tracking-wider text-[var(--foreground-faint)]">
                        Charges / Paid
                      </div>
                      <div className="text-[16px] font-extrabold text-[var(--foreground)] tabular-nums">
                        ${enc.totalCharges.toFixed(2)} / <span className="text-[var(--status-success)]">${enc.insurancePaid.toFixed(2)}</span>
                      </div>
                    </div>

                    <div className="text-right border-l border-[var(--border)] pl-4">
                      <div className="text-[11px] font-bold uppercase tracking-wider text-[var(--foreground-faint)]">
                        Patient AR
                      </div>
                      <div className="text-[16px] font-extrabold text-[var(--foreground)] tabular-nums">
                        ${enc.patientResponsibility.toFixed(2)}
                      </div>
                    </div>

                    <div className="p-1.5 rounded-full neu-soft text-[var(--foreground-muted)]">
                      {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
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
                          {enc.lines.map((line, idx) => (
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
      </div>
    </AppShell>
  );
}
