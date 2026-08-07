"use client";

import React, { useState } from "react";
import { AppShell } from "@/components/layout/app-shell";
import { KpiCard } from "@/components/ui/kpi-card";
import { StatusBadge } from "@/components/ui/status-badge";
import { Button } from "@/components/ui/button";
import { GlassModal } from "@/components/ui/glass-modal";
import { mockInvoices } from "@/data/mockInvoices";
import { Invoice } from "@/schema/invoiceSchema";
import { motion } from "framer-motion";
import {
  Receipt,
  DollarSign,
  CreditCard,
  Send,
  Plus,
  Calendar,
  CheckCircle2,
  Clock,
  Mail,
  MessageSquare,
} from "lucide-react";

export default function InvoicingPage() {
  const [activePaymentInvoice, setActivePaymentInvoice] = useState<Invoice | null>(null);

  const totalBilledInvoices = mockInvoices.reduce((acc, i) => acc + i.totalAmount, 0);
  const totalCollectedInvoices = mockInvoices.reduce((acc, i) => acc + i.amountPaid, 0);
  const totalOutstandingInvoices = mockInvoices.reduce((acc, i) => acc + i.balanceDue, 0);

  return (
    <AppShell>
      <div className="space-y-6 select-none">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-[22px] font-extrabold tracking-tight text-[var(--foreground)]">
                Invoicing & Patient Receipts
              </h1>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] uppercase font-bold bg-[var(--accent-soft)] text-[var(--accent)] border border-black/5">
                Daily Operations
              </span>
            </div>
            <p className="text-[13px] text-[var(--foreground-muted)] font-medium mt-1">
              Generated automatically from adjudicated Encounters or manual standalone creation. Immutable receipt logging.
            </p>
          </div>

          <Button variant="primary" size="sm" onClick={() => alert("Opened New Standalone Invoice Builder")}>
            <Plus className="w-4 h-4" />
            Create Standalone Invoice
          </Button>
        </div>

        {/* KPI Strip */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <KpiCard
            label="Total Invoiced"
            value={`$${totalBilledInvoices.toFixed(2)}`}
            subtitle="3 Active statements"
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
            delta="1 Overdue"
            deltaType="decrease"
            subtitle="Auto-statement schedule"
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
            <h2 className="text-[14px] font-bold text-[var(--foreground)]">
              Patient Statement & Invoice Log
            </h2>
            <span className="text-[12px] text-[var(--foreground-muted)] font-medium">
              Receipts sealed upon payment
            </span>
          </div>

          <div className="divide-y divide-[var(--border)] border border-[var(--border)] rounded-2xl overflow-hidden bg-[var(--surface)]">
            {mockInvoices.map((inv) => (
              <div
                key={inv.id}
                className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-[var(--surface-muted)] transition-colors"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-xs px-2.5 py-0.5 rounded-full bg-[var(--accent-soft)] text-[var(--accent)]">
                      {inv.invoiceNumber}
                    </span>
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
                    {inv.patientName} — <span className="text-[var(--foreground-muted)] font-medium">{inv.patientEmail}</span>
                  </h3>

                  <div className="flex items-center gap-4 text-xs text-[var(--foreground-muted)] font-medium">
                    <span>Issued: {inv.issuedDate}</span>
                    <span>Due: {inv.dueDate}</span>
                    {inv.receipts.length > 0 && (
                      <span className="text-[var(--status-success)] font-bold flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Receipt #{inv.receipts[0].receiptNumber}
                      </span>
                    )}
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
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() => alert(`Viewing sealed receipt #${inv.receipts[0]?.receiptNumber}`)}
                    >
                      View Receipt
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Payment Collector Modal */}
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
                {activePaymentInvoice.lineItems.map((item) => (
                  <div key={item.id} className="flex justify-between text-[var(--foreground-muted)] font-medium">
                    <span>{item.description}</span>
                    <span className="tabular-nums font-bold text-[var(--foreground)]">${item.amount.toFixed(2)}</span>
                  </div>
                ))}
              </div>

              <div className="space-y-2">
                <label className="font-bold text-[var(--foreground)]">Select Payment Collection Channel:</label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                  <Button variant="primary" size="sm" onClick={() => {
                    alert(`Charged card on file for ${activePaymentInvoice.patientName}! Receipt auto-issued.`);
                    setActivePaymentInvoice(null);
                  }}>
                    <CreditCard className="w-3.5 h-3.5" /> Card on File
                  </Button>
                  <Button variant="secondary" size="sm" onClick={() => {
                    alert(`Pay-by-Link SMS sent to ${activePaymentInvoice.patientEmail}!`);
                    setActivePaymentInvoice(null);
                  }}>
                    <MessageSquare className="w-3.5 h-3.5" /> Pay-by-Link SMS
                  </Button>
                  <Button variant="secondary" size="sm" onClick={() => {
                    alert("3-Month Payment Plan set up ($41.66 / mo)!");
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
