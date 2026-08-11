"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { AppShell } from "@/components/layout/app-shell";
import { Button } from "@/components/ui/button";
import { useRcmDataStore } from "@/store/useRcmDataStore";
import { ArrowLeft, Save, Receipt, Plus, Trash2 } from "lucide-react";
import Link from "next/link";

export default function NewStandaloneInvoicePage() {
  const router = useRouter();
  const { addInvoice } = useRcmDataStore();

  const [patientName, setPatientName] = useState("");
  const [patientEmail, setPatientEmail] = useState("");
  const [items, setItems] = useState<{ description: string; charge: number; patientDue: number }[]>([
    { description: "Behavioral Health Assessment Session (Standalone)", charge: 175.0, patientDue: 175.0 },
  ]);

  const handleAddItem = () => {
    setItems((prev) => [...prev, { description: "Additional Clinical Service", charge: 50.0, patientDue: 50.0 }]);
  };

  const handleRemoveItem = (index: number) => {
    if (items.length <= 1) return;
    setItems((prev) => prev.filter((_, i) => i !== index));
  };

  const totalAmount = items.reduce((sum, item) => sum + item.charge, 0);
  const balanceDue = items.reduce((sum, item) => sum + item.patientDue, 0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!patientName || !patientEmail) return;

    const todayStr = new Date().toISOString().split("T")[0];
    const dueDateStr = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split("T")[0];
    const invNum = `INV-2026-${Math.floor(1000 + Math.random() * 9000)}`;

    addInvoice({
      invoiceNumber: invNum,
      patientId: `PAT-${Math.floor(100 + Math.random() * 900)}`,
      patientName,
      patientEmail,
      encounterId: null,
      issueDate: todayStr,
      issuedDate: todayStr,
      dueDate: dueDateStr,
      status: "Sent",
      totalAmount,
      insurancePaid: 0,
      amountPaid: 0,
      balanceDue,
      lineItems: items.map((i) => ({
        dos: todayStr,
        cpt: "90837",
        description: i.description,
        charge: i.charge,
        insuranceCovered: 0,
        patientDue: i.patientDue,
      })),
      receipts: [],
    });

    router.push("/invoicing");
  };

  return (
    <AppShell>
      <div className="max-w-2xl mx-auto space-y-6 select-none">
        {/* Navigation */}
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
              Create Standalone Invoice
            </h1>
            <p className="text-[12px] text-[var(--foreground-muted)] font-medium">
              Issue an out-of-network or private-pay invoice directly to a patient.
            </p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="neu p-6 space-y-5 bg-[var(--surface)]">
          <div className="space-y-4 text-[13px]">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-bold text-[var(--foreground)] mb-1">
                  Patient Full Name <span className="text-[var(--status-critical)]">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={patientName}
                  onChange={(e) => setPatientName(e.target.value)}
                  placeholder="e.g. David Miller"
                  className="w-full neu-pressed px-3.5 py-2 rounded-xl text-[13px] text-[var(--foreground)] bg-transparent border-none outline-none focus:ring-2 focus:ring-[var(--accent)]"
                />
              </div>

              <div>
                <label className="block font-bold text-[var(--foreground)] mb-1">
                  Patient Email <span className="text-[var(--status-critical)]">*</span>
                </label>
                <input
                  type="email"
                  required
                  value={patientEmail}
                  onChange={(e) => setPatientEmail(e.target.value)}
                  placeholder="e.g. david.miller@example.com"
                  className="w-full neu-pressed px-3.5 py-2 rounded-xl text-[13px] text-[var(--foreground)] bg-transparent border-none outline-none focus:ring-2 focus:ring-[var(--accent)]"
                />
              </div>
            </div>

            {/* Line Items */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between">
                <label className="font-bold text-[var(--foreground)]">Invoice Line Items</label>
                <button
                  type="button"
                  onClick={handleAddItem}
                  className="text-xs font-bold text-[var(--accent)] hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" /> Add Item
                </button>
              </div>

              <div className="space-y-2">
                {items.map((item, index) => (
                  <div key={index} className="flex items-center gap-3 p-3 neu-pressed rounded-xl">
                    <input
                      type="text"
                      value={item.description}
                      onChange={(e) => {
                        const updated = [...items];
                        updated[index].description = e.target.value;
                        setItems(updated);
                      }}
                      placeholder="Service description"
                      className="flex-1 bg-transparent border-none outline-none text-[12px] font-medium text-[var(--foreground)]"
                    />
                    <div className="flex items-center gap-1">
                      <span className="text-xs font-bold text-[var(--foreground-muted)]">$</span>
                      <input
                        type="number"
                        value={item.patientDue}
                        onChange={(e) => {
                          const val = parseFloat(e.target.value) || 0;
                          const updated = [...items];
                          updated[index].charge = val;
                          updated[index].patientDue = val;
                          setItems(updated);
                        }}
                        className="w-20 bg-transparent border-none outline-none text-[12px] font-bold text-right text-[var(--foreground)]"
                      />
                    </div>
                    {items.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveItem(index)}
                        aria-label="Remove item"
                        className="text-[var(--status-critical)] hover:opacity-80 p-1 cursor-pointer"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Total Summary */}
            <div className="p-4 neu-pressed rounded-2xl flex items-center justify-between text-[14px] font-bold">
              <span className="text-[var(--foreground-muted)]">Total Amount Due:</span>
              <span className="text-[var(--accent)] text-[16px]">${balanceDue.toFixed(2)}</span>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-[var(--border)]">
            <Link href="/invoicing">
              <Button variant="secondary" size="sm">
                Cancel
              </Button>
            </Link>
            <Button type="submit" variant="primary" size="sm">
              <Save className="w-4 h-4" /> Issue Invoice
            </Button>
          </div>
        </form>
      </div>
    </AppShell>
  );
}
