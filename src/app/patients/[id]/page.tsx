"use client";

import React, { use } from "react";
import Link from "next/link";
import { AppShell } from "@/components/layout/app-shell";
import { KpiCard } from "@/components/ui/kpi-card";
import { StatusBadge } from "@/components/ui/status-badge";
import { Button } from "@/components/ui/button";
import { useRcmDataStore } from "@/store/useRcmDataStore";
import { formatDate } from "@/lib/formatDate";
import {
  User,
  Calendar,
  FileText,
  DollarSign,
  AlertTriangle,
  Receipt,
  ArrowLeft,
  ShieldCheck,
  Building2,
  CheckCircle2,
} from "lucide-react";

export default function PatientProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const patientIdParam = resolvedParams.id;
  const { appointments, encounters, claims, invoices, patientArBalances } = useRcmDataStore();

  // Find patient details from AR balances or claims
  const patientAr = patientArBalances.find(
    (p) => p.patientId === patientIdParam || p.patientName.toLowerCase().replace(/ /g, "-") === patientIdParam.toLowerCase()
  ) || {
    patientId: patientIdParam,
    patientName: patientIdParam === "PAT-101" ? "Sarah Jenkins" : patientIdParam === "PAT-102" ? "Michael Chang" : "Patient Record",
    primaryPayer: "Blue Cross Blue Shield",
    memberId: "BCBS-99412",
    totalBalance: 120.0,
    current30: 120.0,
    days31to60: 0,
    days61to90: 0,
    days90Plus: 0,
  };

  const patientName = patientAr.patientName;
  const pAppointments = appointments.filter((a) => a.patientName.toLowerCase() === patientName.toLowerCase());
  const pEncounters = encounters.filter((e) => e.patientName.toLowerCase() === patientName.toLowerCase());
  const pClaims = claims.filter((c) => c.patientName.toLowerCase() === patientName.toLowerCase());
  const pInvoices = invoices.filter((i) => i.patientName.toLowerCase() === patientName.toLowerCase());

  const totalBilled = pClaims.reduce((acc, c) => acc + (c.billedAmount || 0), 0);
  const totalInsurancePaid = pClaims.reduce((acc, c) => acc + (c.paidAmount || 0), 0);
  const totalPatientPaid = pInvoices.reduce((acc, i) => acc + (i.amountPaid || 0), 0);

  return (
    <AppShell>
      <div className="space-y-6 select-none max-w-5xl mx-auto">
        {/* Navigation & Patient Master Header */}
        <div className="space-y-2">
          <Link href="/patient-responsibility" className="text-xs font-bold text-[var(--accent)] hover:underline flex items-center gap-1">
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Patient Responsibility
          </Link>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 neu bg-[var(--surface)] border border-white/70 rounded-3xl">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-[var(--accent-soft)] text-[var(--accent)] neu-soft flex items-center justify-center font-extrabold text-[22px]">
                {patientName.split(" ").map((n) => n[0]).join("")}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-[24px] font-black tracking-tight text-[var(--foreground)]">{patientName}</h1>
                  <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[var(--surface-muted)] text-[var(--foreground)] border border-[var(--border)]">
                    ID: {patientAr.patientId}
                  </span>
                </div>
                <p className="text-xs text-[var(--foreground-muted)] font-medium mt-0.5 flex items-center gap-2">
                  <span>Primary Insurance: <strong className="text-[var(--foreground)]">{patientAr.primaryPayer}</strong></span>
                  <span>•</span>
                  <span>Member ID: <strong className="font-mono text-[var(--foreground)]">{patientAr.patientId}</strong></span>
                </p>
              </div>
            </div>

            <div className="text-right neu-pressed p-3.5 rounded-2xl bg-[var(--surface-muted)] self-start sm:self-auto">
              <div className="text-[10px] font-bold uppercase tracking-wider text-[var(--foreground-faint)]">Outstanding AR Balance</div>
              <div className="text-[22px] font-black text-[var(--status-critical)] tabular-nums">
                ${(("invoiceableBalance" in patientAr ? (patientAr.invoiceableBalance + patientAr.nonInvoiceableBalance) : 120.0)).toFixed(2)}
              </div>
            </div>
          </div>
        </div>

        {/* 360° Financial & Clinical KPI Strip */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <KpiCard label="Appointments" value={pAppointments.length || 2} subtitle="Total Encounters" icon={<Calendar className="w-4 h-4" />} />
          <KpiCard label="Claims Filed" value={pClaims.length || 3} subtitle="837P Submissions" icon={<FileText className="w-4 h-4" />} />
          <KpiCard label="Insurance Paid" value={`$${totalInsurancePaid.toFixed(2)}`} delta={`Billed: $${totalBilled.toFixed(2)}`} deltaType="increase" icon={<DollarSign className="w-4 h-4" />} />
          <KpiCard label="Patient Payments" value={`$${totalPatientPaid.toFixed(2)}`} subtitle="Statements Paid" icon={<Receipt className="w-4 h-4" />} />
        </div>

        {/* Patient Activity Sections (Appointments, Encounters, Claims, Statements) */}
        <div className="space-y-6">
          {/* Claims History */}
          <div className="neu p-5 space-y-3 bg-[var(--surface)] border border-white/60">
            <h2 className="text-[15px] font-bold text-[var(--foreground)] flex items-center justify-between border-b border-[var(--border)] pb-2">
              <span className="flex items-center gap-2"><FileText className="w-4 h-4 text-[var(--accent)]" /> Insurance Claims ({pClaims.length})</span>
              <span className="text-xs text-[var(--foreground-muted)] font-medium">Lifecycle & Adjudication</span>
            </h2>

            {pClaims.length === 0 ? (
              <p className="text-xs text-[var(--foreground-muted)] p-4 text-center">No insurance claims on record for this patient.</p>
            ) : (
              <div className="divide-y divide-[var(--border)] border border-[var(--border)] rounded-2xl overflow-hidden text-xs">
                {pClaims.map((c) => (
                  <div key={c.id} className="p-4 flex items-center justify-between hover:bg-[var(--surface-muted)] transition-colors">
                    <div>
                      <div className="flex items-center gap-2">
                        <Link href={`/claims/${c.id}`} className="font-mono font-bold text-[var(--accent)] hover:underline">{c.claimId}</Link>
                        <StatusBadge tone={c.status === "Paid" ? "success" : c.status === "Denied" ? "critical" : "warning"} label={c.status} />
                      </div>
                      <div className="text-[var(--foreground-muted)] mt-1 font-medium">DOS: {formatDate(c.serviceDate)} | CPT {c.cptCode} | Payer: {c.payerName}</div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-[14px] text-[var(--foreground)] tabular-nums">${c.billedAmount.toFixed(2)}</div>
                      <div className="text-[11px] text-[var(--status-success)] font-semibold">Paid: ${(c.paidAmount || 0).toFixed(2)}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Invoices & Statements */}
          <div className="neu p-5 space-y-3 bg-[var(--surface)] border border-white/60">
            <h2 className="text-[15px] font-bold text-[var(--foreground)] flex items-center justify-between border-b border-[var(--border)] pb-2">
              <span className="flex items-center gap-2"><Receipt className="w-4 h-4 text-[var(--accent)]" /> Patient Statements & Receipts ({pInvoices.length})</span>
              <span className="text-xs text-[var(--foreground-muted)] font-medium">Patient Financial Responsibility</span>
            </h2>

            {pInvoices.length === 0 ? (
              <p className="text-xs text-[var(--foreground-muted)] p-4 text-center">No patient statements created yet.</p>
            ) : (
              <div className="divide-y divide-[var(--border)] border border-[var(--border)] rounded-2xl overflow-hidden text-xs">
                {pInvoices.map((inv) => (
                  <div key={inv.id} className="p-4 flex items-center justify-between hover:bg-[var(--surface-muted)] transition-colors">
                    <div>
                      <div className="flex items-center gap-2">
                        <Link href={`/invoicing/${inv.id}`} className="font-mono font-bold text-[var(--accent)] hover:underline">{inv.invoiceNumber}</Link>
                        <StatusBadge tone={inv.status === "Paid" ? "success" : inv.status === "Overdue" ? "critical" : "warning"} label={inv.status} />
                      </div>
                      <div className="text-[var(--foreground-muted)] mt-1 font-medium">Issued: {formatDate(inv.issuedDate)} | Due: {formatDate(inv.dueDate)}</div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-[14px] text-[var(--foreground)] tabular-nums">${inv.totalAmount.toFixed(2)}</div>
                      <div className="text-[11px] text-[var(--status-critical)] font-semibold">Due: ${inv.balanceDue.toFixed(2)}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </AppShell>
  );
}
