"use client";

import React, { useState, use } from "react";
import Link from "next/link";
import { AppShell } from "@/components/layout/app-shell";
import { KpiCard } from "@/components/ui/kpi-card";
import { StatusBadge } from "@/components/ui/status-badge";
import { Button } from "@/components/ui/button";
import { GlassModal } from "@/components/ui/glass-modal";
import { mockInvoices } from "@/data/mockInvoices";
import {
  Receipt,
  DollarSign,
  ArrowLeft,
  UserCheck,
  CreditCard,
  Send,
  CheckCircle2,
  Calendar,
  ShieldCheck,
} from "lucide-react";

export default function InvoiceDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const invoiceIdParam = resolvedParams.id;

  const invoice =
    mockInvoices.find((i) => i.id === invoiceIdParam || i.invoiceNumber === invoiceIdParam) ||
    mockInvoices[0];

  const [isPayModalOpen, setIsPayModalOpen] = useState(false);

  return (
    <AppShell>
      <div className="space-y-6 select-none">
        {/* Header Breadcrumb */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <Link
              href="/invoicing"
              className="text-xs font-bold text-[var(--accent)] hover:underline flex items-center gap-1"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Back to Invoicing & Receipts
            </Link>
            <div className="flex items-center gap-3 pt-1">
              <h1 className="text-[24px] font-extrabold tracking-tight text-[var(--foreground)]">
                Invoice {invoice.invoiceNumber}
              </h1>
              <StatusBadge
                tone={invoice.status === "Paid" ? "success" : invoice.status === "Overdue" ? "critical" : "warning"}
                label={invoice.status}
              />
            </div>
            <p className="text-[13px] text-[var(--foreground-muted)] font-medium">
              Patient: <strong className="text-[var(--foreground)]">{invoice.patientName}</strong> • Due Date:{" "}
              {invoice.dueDate} • Created: {invoice.createdDate || invoice.issueDate}
            </p>
          </div>

          <div className="flex items-center gap-2">
            {invoice.status !== "Paid" && (
              <Button variant="primary" size="sm" onClick={() => setIsPayModalOpen(true)}>
                <CreditCard className="w-3.5 h-3.5 mr-1" /> Charge Card-on-File
              </Button>
            )}
          </div>
        </div>

        {/* Invoice Financial KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <KpiCard
            label="Total Gross Service Charge"
            value={`$${invoice.totalAmount.toFixed(2)}`}
            subtitle="Provider Charge Amount"
            icon={<DollarSign className="w-5 h-5" />}
          />
          <KpiCard
            label="Insurance Coverage Paid"
            value={`$${(invoice.insurancePaid ?? 0).toFixed(2)}`}
            delta="EOB Posted"
            deltaType="increase"
            subtitle="Adjudicated 835"
            icon={<ShieldCheck className="w-5 h-5" />}
          />
          <KpiCard
            label="Patient Responsibility"
            value={`$${(invoice.patientResponsibility ?? invoice.totalAmount).toFixed(2)}`}
            delta={invoice.status === "Paid" ? "Collected" : "Balance Pending"}
            deltaType={invoice.status === "Paid" ? "increase" : "neutral"}
            subtitle="Decoupled AR State"
            icon={<UserCheck className="w-5 h-5" />}
          />
          <KpiCard
            label="Outstanding Balance"
            value={`$${invoice.balanceDue.toFixed(2)}`}
            delta={invoice.balanceDue > 0 ? "Statement Due" : "Settled"}
            deltaType={invoice.balanceDue > 0 ? "neutral" : "increase"}
            subtitle="Net Patient Due"
            icon={<Receipt className="w-5 h-5" />}
          />
        </div>

        {/* Line Items & Statement Summary */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 neu p-6 space-y-4">
            <h3 className="text-[15px] font-bold text-[var(--foreground)] border-b border-[var(--border)] pb-2">
              Patient Invoice Line Item Breakdown
            </h3>

            <div className="divide-y divide-[var(--border)] border border-[var(--border)] rounded-2xl overflow-hidden bg-[var(--surface)]">
              {(invoice.items || []).map((item, idx) => (
                <div key={idx} className="p-4 flex items-center justify-between text-xs">
                  <div className="space-y-1">
                    <div className="font-bold text-[var(--foreground)]">
                      CPT {item.cpt} — {item.description}
                    </div>
                    <div className="text-[var(--foreground-muted)] font-medium">
                      DOS: {item.dos} | Line Charge: ${item.charge.toFixed(2)} | Ins. Covered: ${item.insuranceCovered.toFixed(2)}
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="font-extrabold text-sm text-[var(--accent)] tabular-nums">
                      ${item.patientDue.toFixed(2)}
                    </div>
                    <span className="text-[10px] font-bold text-[var(--foreground-muted)]">Patient Due</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="neu p-6 space-y-4">
            <h3 className="text-[15px] font-bold text-[var(--foreground)] border-b border-[var(--border)] pb-2">
              Automated Statement Delivery History
            </h3>

            <div className="space-y-3 text-xs">
              <div className="flex justify-between py-1 border-b border-[var(--border)]">
                <span className="text-[var(--foreground-muted)] font-medium">Statement Cadence:</span>
                <span className="font-bold text-[var(--foreground)]">Auto-14 Day Cycle</span>
              </div>
              <div className="flex justify-between py-1 border-b border-[var(--border)]">
                <span className="text-[var(--foreground-muted)] font-medium">SMS Delivery:</span>
                <span className="font-bold text-[var(--status-success)]">Delivered (Link Opened)</span>
              </div>
              <div className="flex justify-between py-1 border-b border-[var(--border)]">
                <span className="text-[var(--foreground-muted)] font-medium">Card-on-File:</span>
                <span className="font-mono text-[var(--foreground)]">Visa ending in •••• 4092</span>
              </div>
            </div>
          </div>
        </div>

        {/* Charge Modal */}
        <GlassModal
          isOpen={isPayModalOpen}
          onClose={() => setIsPayModalOpen(false)}
          title={`Process Card Payment — ${invoice.patientName}`}
          description={`Invoice #${invoice.invoiceNumber} — Balance: $${invoice.balanceDue.toFixed(2)}`}
        >
          <div className="space-y-4">
            <div className="p-4 neu-pressed rounded-2xl space-y-2 text-xs">
              <div className="flex justify-between font-semibold">
                <span>Patient Balance Due:</span>
                <span className="tabular-nums">${invoice.balanceDue.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-[var(--foreground-muted)]">
                <span>Processing Method:</span>
                <span className="font-bold text-[var(--accent)]">Stripe Card-on-File (Visa •••• 4092)</span>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <Button variant="secondary" size="sm" onClick={() => setIsPayModalOpen(false)}>
                Cancel
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={() => {
                  alert(`Successfully processed payment of $${invoice.balanceDue.toFixed(2)} for ${invoice.patientName}!`);
                  setIsPayModalOpen(false);
                }}
              >
                <CheckCircle2 className="w-3.5 h-3.5 mr-1" /> Charge ${invoice.balanceDue.toFixed(2)}
              </Button>
            </div>
          </div>
        </GlassModal>
      </div>
    </AppShell>
  );
}
