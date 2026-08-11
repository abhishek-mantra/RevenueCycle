"use client";

import React, { useState } from "react";
import Link from "next/link";
import { AppShell } from "@/components/layout/app-shell";
import { KpiCard } from "@/components/ui/kpi-card";
import { StatusBadge } from "@/components/ui/status-badge";
import { Button } from "@/components/ui/button";
import { GlassModal } from "@/components/ui/glass-modal";
import { BulkActionBar } from "@/components/ui/bulk-action-bar";
import { useRcmDataStore } from "@/store/useRcmDataStore";
import { formatDate } from "@/lib/formatDate";
import { Invoice } from "@/schema/invoiceSchema";
import {
  Receipt,
  DollarSign,
  CreditCard,
  Plus,
  Clock,
  CheckCircle2,
  MessageSquare,
  Send,
  ExternalLink,
} from "lucide-react";

export default function InvoicingPage() {
  const { invoices, recordInvoicePayment } = useRcmDataStore();
  const [activePaymentInvoice, setActivePaymentInvoice] = useState<Invoice | null>(null);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const totalBilledInvoices = invoices.reduce((acc, i) => acc + i.totalAmount, 0);
  const totalCollectedInvoices = invoices.reduce((acc, i) => acc + i.amountPaid, 0);
  const totalOutstandingInvoices = invoices.reduce((acc, i) => acc + i.balanceDue, 0);

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedIds(invoices.map((i) => i.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleSelectRow = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleBatchCollect = () => {
    selectedIds.forEach((id) => {
      const inv = invoices.find((i) => i.id === id);
      if (inv && inv.balanceDue > 0) {
        recordInvoicePayment(id, inv.balanceDue, "Card");
      }
    });
    showToast(`Batch collected payment for ${selectedIds.length} selected invoices!`);
    setSelectedIds([]);
  };

  const handleBatchSendStatements = () => {
    showToast(`Dispatched SMS & Email statements for ${selectedIds.length} selected invoices!`);
    setSelectedIds([]);
  };

  return (
    <AppShell>
      <div className="space-y-6 select-none">
        {/* Toast Notification Banner */}
        {toastMessage && (
          <div className="fixed bottom-6 right-6 z-50 px-4 py-3 rounded-2xl bg-[var(--accent)] text-white font-bold text-xs shadow-2xl flex items-center gap-2 animate-bounce">
            <CheckCircle2 className="w-4 h-4" /> {toastMessage}
          </div>
        )}

        {/* Header (8.18 - Simplified Title) */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-[22px] font-extrabold tracking-tight text-[var(--foreground)]">
                Invoicing
              </h1>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] uppercase font-bold bg-[var(--accent-soft)] text-[var(--accent)] border border-black/5">
                Daily Operations
              </span>
            </div>
            <p className="text-[13px] text-[var(--foreground-muted)] font-medium mt-1">
              Generated automatically from adjudicated Encounters or manual standalone creation. Immutable receipt logging.
            </p>
          </div>

          <Link href="/invoicing/new">
            <Button variant="primary" size="sm">
              <Plus className="w-4 h-4" />
              Create Standalone Invoice
            </Button>
          </Link>
        </div>

        {/* KPI Strip */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <KpiCard
            label="Total Invoiced"
            value={`$${totalBilledInvoices.toFixed(2)}`}
            subtitle={`${invoices.length} Statements logged`}
            icon={<Receipt className="w-5 h-5" />}
          />
          <KpiCard
            label="Collected"
            value={`$${totalCollectedInvoices.toFixed(2)}`}
            delta="100% Reconciled"
            deltaType="increase"
            subtitle="Receipts auto-issued"
            icon={<DollarSign className="w-5 h-5" />}
          />
          <KpiCard
            label="Outstanding Balance"
            value={`$${totalOutstandingInvoices.toFixed(2)}`}
            delta={`${invoices.filter((i) => i.status === "Overdue").length} Overdue`}
            deltaType="decrease"
            subtitle="Auto-statement cadence"
            icon={<Clock className="w-5 h-5" />}
          />
          <KpiCard
            label="Payment Plan Active"
            value="1 Patient"
            delta="3 Month cadence"
            deltaType="neutral"
            subtitle="Flexible patient options"
            icon={<CreditCard className="w-5 h-5" />}
          />
        </div>

        {/* Invoices List Table */}
        <div className="neu p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={selectedIds.length === invoices.length && invoices.length > 0}
                onChange={handleSelectAll}
                aria-label="Select all invoices"
                className="neu-pressed w-4 h-4 accent-[var(--accent)] rounded cursor-pointer"
              />
              <h2 className="text-[14px] font-bold text-[var(--foreground)]">
                Patient Statement & Invoice Log
              </h2>
            </div>
            <span className="text-[12px] text-[var(--foreground-muted)] font-medium">
              Receipts sealed upon payment
            </span>
          </div>

          <div className="divide-y divide-[var(--border)] border border-[var(--border)] rounded-2xl overflow-hidden bg-[var(--surface)]">
            {invoices.map((inv) => {
              const isSelected = selectedIds.includes(inv.id);
              return (
                <div
                  key={inv.id}
                  className={`p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 transition-colors ${
                    isSelected ? "bg-[var(--accent-soft)]/30" : "hover:bg-[var(--surface-muted)]"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => handleSelectRow(inv.id)}
                      aria-label={`Select invoice ${inv.invoiceNumber}`}
                      className="neu-pressed w-4 h-4 accent-[var(--accent)] rounded cursor-pointer mt-1"
                    />

                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <Link
                          href={`/invoicing/${inv.id}`}
                          className="font-mono font-bold text-xs px-2.5 py-0.5 rounded-full bg-[var(--accent-soft)] text-[var(--accent)] hover:bg-[var(--accent)] hover:text-white transition-all flex items-center gap-1 group"
                        >
                          <span>{inv.invoiceNumber}</span>
                          <ExternalLink className="w-3 h-3 opacity-70 group-hover:opacity-100" />
                        </Link>
                        <StatusBadge
                          tone={inv.status === "Paid" ? "success" : inv.status === "Overdue" ? "critical" : "warning"}
                          label={inv.status}
                        />
                        {inv.encounterId === null && (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[var(--surface-muted)] text-[var(--foreground-muted)] border border-[var(--border)]">
                            Standalone Invoice
                          </span>
                        )}
                      </div>

                      <h3 className="text-[15px] font-bold text-[var(--foreground)]">
                        <Link href={`/invoicing/${inv.id}`} className="hover:text-[var(--accent)] transition-colors">
                          {inv.patientName}
                        </Link>{" "}
                        — <span className="text-[var(--foreground-muted)] font-medium">{inv.patientEmail}</span>
                      </h3>

                      <div className="flex items-center gap-4 text-xs text-[var(--foreground-muted)] font-medium">
                        <span>Issued: {formatDate(inv.issuedDate)}</span>
                        <span>Due: {formatDate(inv.dueDate)}</span>
                        {inv.receipts.length > 0 && (
                          <span className="text-[var(--status-success)] font-bold flex items-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5" /> Receipt #{inv.receipts[0].receiptNumber}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-6">
                    <div className="text-right">
                      <div className="text-[10px] font-bold uppercase tracking-wider text-[var(--foreground-faint)]">
                        Total / Balance Due
                      </div>
                      <div className="text-[17px] font-extrabold text-[var(--foreground)] tabular-nums">
                        ${inv.totalAmount.toFixed(2)} / <span className={inv.balanceDue > 0 ? "text-[var(--status-critical)]" : "text-[var(--status-success)]"}>${inv.balanceDue.toFixed(2)}</span>
                      </div>
                    </div>

                    {inv.balanceDue > 0 ? (
                      <Button
                        size="sm"
                        variant="primary"
                        onClick={() => setActivePaymentInvoice(inv)}
                      >
                        <CreditCard className="w-3.5 h-3.5" />
                        Collect Payment
                      </Button>
                    ) : (
                      <Link href={`/invoicing/${inv.id}/receipt`}>
                        <Button size="sm" variant="secondary">
                          View Receipt
                        </Button>
                      </Link>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Bulk Action Bar (8.11) */}
        <BulkActionBar
          selectedCount={selectedIds.length}
          onClearSelection={() => setSelectedIds([])}
          onResubmit={handleBatchCollect}
          onSendStatement={handleBatchSendStatements}
        />

        {/* Payment Collector Modal (8.17) */}
        <GlassModal
          isOpen={!!activePaymentInvoice}
          onClose={() => setActivePaymentInvoice(null)}
          title={`Collect Payment — ${activePaymentInvoice?.invoiceNumber}`}
          description={`Patient: ${activePaymentInvoice?.patientName} — Balance Due: $${activePaymentInvoice?.balanceDue.toFixed(2)}`}
        >
          {activePaymentInvoice && (
            <div className="space-y-4 text-xs">
              <div className="p-4 neu-pressed rounded-2xl space-y-2">
                <div className="font-bold text-[var(--foreground)]">Invoice Line Item Summary:</div>
                {(activePaymentInvoice.lineItems || activePaymentInvoice.items || []).map((item, idx) => (
                  <div key={idx} className="flex justify-between text-[var(--foreground-muted)] font-medium">
                    <span>{item.description}</span>
                    <span className="tabular-nums font-bold text-[var(--foreground)]">${(item.patientDue ?? item.charge).toFixed(2)}</span>
                  </div>
                ))}
              </div>

              <div className="space-y-2">
                <label className="font-bold text-[var(--foreground)]">Select Payment Collection Channel:</label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                  <Button variant="primary" size="sm" onClick={() => {
                    recordInvoicePayment(activePaymentInvoice.id, activePaymentInvoice.balanceDue, "Card");
                    showToast(`Charged card on file for ${activePaymentInvoice.patientName}! Receipt auto-issued.`);
                    setActivePaymentInvoice(null);
                  }}>
                    <CreditCard className="w-3.5 h-3.5" /> Card on File
                  </Button>
                  <Button variant="secondary" size="sm" onClick={() => {
                    recordInvoicePayment(activePaymentInvoice.id, activePaymentInvoice.balanceDue, "PayLink");
                    showToast(`Pay-by-Link SMS sent to ${activePaymentInvoice.patientEmail}!`);
                    setActivePaymentInvoice(null);
                  }}>
                    <MessageSquare className="w-3.5 h-3.5" /> Pay-by-Link SMS
                  </Button>
                  <Button variant="secondary" size="sm" onClick={() => {
                    recordInvoicePayment(activePaymentInvoice.id, activePaymentInvoice.balanceDue, "PaymentPlan");
                    showToast("Payment plan set up successfully!");
                    setActivePaymentInvoice(null);
                  }}>
                    Setup Plan
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
