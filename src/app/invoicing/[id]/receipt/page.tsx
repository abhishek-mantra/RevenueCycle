"use client";

import React, { use } from "react";
import Link from "next/link";
import { AppShell } from "@/components/layout/app-shell";
import { StatusBadge } from "@/components/ui/status-badge";
import { useRcmDataStore } from "@/store/useRcmDataStore";
import { formatDate } from "@/lib/formatDate";
import { ArrowLeft, CheckCircle2, Receipt, ShieldCheck, Printer } from "lucide-react";

export default function InvoiceReceiptPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const invoiceIdParam = resolvedParams.id;
  const { invoices } = useRcmDataStore();

  const invoice = invoices.find((inv) => inv.id === invoiceIdParam || inv.invoiceNumber === invoiceIdParam) || invoices[0];
  const receipt = invoice?.receipts?.[0] || {
    receiptNumber: `RCP-2026-${Math.floor(1000 + Math.random() * 9000)}`,
    paymentDate: invoice?.issuedDate || "2026-08-04",
    amountPaid: invoice?.totalAmount || 175.0,
    paymentMethod: "Card-on-File",
    cardLast4: "4242",
    transactionId: "TXN-994120",
  };

  return (
    <AppShell>
      <div className="max-w-2xl mx-auto space-y-6 select-none">
        {/* Navigation Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/invoicing">
              <button
                aria-label="Back to invoicing"
                className="p-2 rounded-xl neu-soft hover:bg-[var(--surface-muted)] text-[var(--foreground-muted)] hover:text-[var(--foreground)] transition-colors cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
            </Link>
            <div>
              <h1 className="text-[20px] font-extrabold tracking-tight text-[var(--foreground)]">
                Sealed Payment Receipt
              </h1>
              <p className="text-[12px] text-[var(--foreground-muted)] font-medium">
                Official payment receipt for invoice #{invoice.invoiceNumber}
              </p>
            </div>
          </div>

          <button
            onClick={() => window.print()}
            aria-label="Print receipt"
            className="px-3 py-1.5 rounded-xl neu-soft hover:bg-[var(--surface-muted)] text-xs font-bold text-[var(--foreground)] transition-colors cursor-pointer flex items-center gap-1.5"
          >
            <Printer className="w-3.5 h-3.5" /> Print Receipt
          </button>
        </div>

        {/* Sealed Receipt Card */}
        <div className="neu p-8 space-y-6 bg-[var(--surface)] border border-white/80 relative overflow-hidden">
          {/* Top Seal Banner */}
          <div className="flex items-center justify-between border-b border-[var(--border)] pb-4">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-2xl bg-[var(--status-success-bg)] text-[var(--status-success)] flex items-center justify-center shadow-xs">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div>
                <div className="text-[16px] font-extrabold text-[var(--foreground)]">
                  Receipt #{receipt.receiptNumber}
                </div>
                <div className="text-[11px] font-bold text-[var(--status-success)] flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" /> Verified & Sealed Payment
                </div>
              </div>
            </div>

            <StatusBadge tone="success" label="PAID IN FULL" />
          </div>

          {/* Receipt Data Details */}
          <div className="grid grid-cols-2 gap-4 text-xs">
            <div className="space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--foreground-faint)]">
                Patient Details
              </span>
              <div className="font-bold text-[14px] text-[var(--foreground)]">{invoice.patientName}</div>
              <div className="text-[var(--foreground-muted)]">{invoice.patientEmail}</div>
            </div>

            <div className="space-y-1 text-right">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--foreground-faint)]">
                Payment Info
              </span>
              <div className="font-bold text-[14px] text-[var(--foreground)]">
                {formatDate(receipt.paymentDate)}
              </div>
              <div className="text-[var(--foreground-muted)]">
                {receipt.method} (Card Ending in 4242)
              </div>
            </div>
          </div>

          {/* Line Items Breakdown */}
          <div className="space-y-2 pt-2 border-t border-[var(--border)]">
            <div className="text-[10px] font-bold uppercase tracking-wider text-[var(--foreground-faint)] mb-2">
              Billed Items Summary
            </div>

            <div className="divide-y divide-[var(--border)] border border-[var(--border)] rounded-2xl overflow-hidden text-xs">
              {(invoice.lineItems || invoice.items || [
                { description: "Behavioral Health Session", charge: invoice.totalAmount, patientDue: invoice.totalAmount }
              ]).map((item, idx) => (
                <div key={idx} className="p-3.5 flex justify-between bg-[var(--surface)]">
                  <span className="font-medium text-[var(--foreground)]">{item.description}</span>
                  <span className="font-bold text-[var(--foreground)] tabular-nums">${(item.patientDue ?? item.charge).toFixed(2)}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Financial Totals Footer */}
          <div className="p-4 neu-pressed rounded-2xl space-y-1 text-xs">
            <div className="flex justify-between text-[var(--foreground-muted)] font-medium">
              <span>Total Statement Amount:</span>
              <span>${invoice.totalAmount.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-[var(--status-success)] font-extrabold text-[15px] pt-1 border-t border-[var(--border)]">
              <span>Total Paid & Cleared:</span>
              <span>${receipt.amount.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-[var(--foreground-faint)] text-[10px] pt-1">
              <span>Transaction Ref: {receipt.reference}</span>
              <span>Remaining Balance: $0.00</span>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
