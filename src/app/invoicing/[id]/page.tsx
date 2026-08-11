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
  Receipt,
  DollarSign,
  ArrowLeft,
  UserCheck,
  CreditCard,
  CheckCircle2,
  ShieldCheck,
  AlertCircle,
} from "lucide-react";

export default function InvoiceDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const invoiceIdParam = resolvedParams.id;
  const { invoices, recordInvoicePayment } = useRcmDataStore();

  const invoice = invoices.find((i) => i.id === invoiceIdParam || i.invoiceNumber === invoiceIdParam);
  const [isPayModalOpen, setIsPayModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  if (!invoice) {
    return (
      <AppShell>
        <div className="max-w-md mx-auto my-12 neu p-8 text-center space-y-4 select-none bg-[var(--surface)]">
          <div className="w-12 h-12 rounded-full bg-[var(--status-critical-bg)] text-[var(--status-critical)] flex items-center justify-center mx-auto">
            <AlertCircle className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-[18px] font-extrabold text-[var(--foreground)]">Invoice Not Found</h2>
            <p className="text-[12px] text-[var(--foreground-muted)] font-medium mt-1">
              No invoice matching ID <span className="font-mono text-[var(--foreground)]">{invoiceIdParam}</span> exists.
            </p>
          </div>
          <Link href="/invoicing">
            <Button variant="primary" size="sm" className="w-full justify-center">
              <ArrowLeft className="w-4 h-4" /> Return to Invoicing
            </Button>
          </Link>
        </div>
      </AppShell>
    );
  }

  const handleCharge = () => {
    recordInvoicePayment(invoice.id, invoice.balanceDue, "Card");
    setToastMessage(`Successfully processed payment of $${invoice.balanceDue.toFixed(2)} for ${invoice.patientName}! Sealed receipt issued.`);
    setIsPayModalOpen(false);
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
              Patient: <Link href={`/patients/${invoice.patientName === "Sarah Jenkins" ? "PAT-101" : invoice.patientName === "Michael Chang" ? "PAT-102" : "PAT-103"}`} className="text-[var(--foreground)] font-bold hover:text-[var(--accent)] hover:underline transition-colors">{invoice.patientName}</Link> • Due Date:{" "}
              {formatDate(invoice.dueDate)} • Issued: {formatDate(invoice.issuedDate)}
            </p>
          </div>

          <div className="flex items-center gap-2">
            {invoice.balanceDue > 0 ? (
              <Button variant="primary" size="sm" onClick={() => setIsPayModalOpen(true)}>
                <CreditCard className="w-3.5 h-3.5 mr-1" /> Charge Card-on-File
              </Button>
            ) : (
              <Link href={`/invoicing/${invoice.id}/receipt`}>
                <Button variant="secondary" size="sm">
                  View Sealed Receipt
                </Button>
              </Link>
            )}
          </div>
        </div>

        {/* Invoice Financial KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <KpiCard
            label="Total Gross Service Charge"
            value={`$${invoice.totalAmount.toFixed(2)}`}
            subtitle="Provider Charge Schedule"
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
            value={`$${(invoice.totalAmount - (invoice.insurancePaid ?? 0)).toFixed(2)}`}
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
              {(invoice.lineItems || invoice.items || [
                { description: "Behavioral Health Session", charge: invoice.totalAmount, patientDue: invoice.totalAmount }
              ]).map((item, idx) => (
                <div key={idx} className="p-4 flex items-center justify-between text-xs">
                  <div className="space-y-1">
                    <div className="font-bold text-[var(--foreground)]">
                      {item.description}
                    </div>
                    <div className="text-[var(--foreground-muted)] font-medium">
                      Line Charge: ${(item.charge || item.patientDue).toFixed(2)}
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="font-extrabold text-sm text-[var(--accent)] tabular-nums">
                      ${(item.patientDue || item.charge).toFixed(2)}
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
                <span className="font-mono text-[var(--foreground)]">Visa ending in •••• 4242</span>
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
                <span className="font-bold text-[var(--accent)]">Card-on-File (Visa •••• 4242)</span>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <Button variant="secondary" size="sm" onClick={() => setIsPayModalOpen(false)}>
                Cancel
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={handleCharge}
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
