"use client";

import React, { useState } from "react";
import { AppShell } from "@/components/layout/app-shell";
import { StatusBadge } from "@/components/ui/status-badge";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { CreditCard, MessageSquare, Mail, Send, CheckCircle2 } from "lucide-react";

interface FlowDispatchedItem {
  id: string;
  patientName: string;
  sessionTime: string;
  deliveryMethod: "SMS Pay Link" | "Email Pre-Checkin" | "Portal Reminder";
  copayAmount: number;
  status: "Sent" | "Collected";
}

const initialDispatchedItems: FlowDispatchedItem[] = [
  {
    id: "FLOW-101",
    patientName: "Sarah Jenkins",
    sessionTime: "Today, 09:00 AM",
    deliveryMethod: "SMS Pay Link",
    copayAmount: 30.0,
    status: "Collected",
  },
  {
    id: "FLOW-102",
    patientName: "Elena Rostova",
    sessionTime: "Today, 01:15 PM",
    deliveryMethod: "Email Pre-Checkin",
    copayAmount: 25.0,
    status: "Sent",
  },
  {
    id: "FLOW-103",
    patientName: "David Miller",
    sessionTime: "Tomorrow, 11:00 AM",
    deliveryMethod: "SMS Pay Link",
    copayAmount: 50.0,
    status: "Sent",
  },
];

export default function PatientFlowPage({ embedInShell }: any) {
  const [autoSmsCopay, setAutoSmsCopay] = useState(true);
  const [autoEmailIntake, setAutoEmailIntake] = useState(true);
  const [items, setItems] = useState<FlowDispatchedItem[]>(initialDispatchedItems);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const handleCollect = (id: string) => {
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, status: "Collected" } : item))
    );
  };

  const handleResend = (id: string) => {
    const patientName = items.find((i) => i.id === id)?.patientName;
    setToastMessage(`Re-sent pre-visit payment link for ${patientName}!`);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const content = (
    <div className="space-y-6 select-none">
      {/* Toast Notification Banner */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 px-4 py-3 rounded-2xl bg-[var(--accent)] text-white font-bold text-xs shadow-2xl flex items-center gap-2 animate-bounce">
          <CheckCircle2 className="w-4 h-4" /> {toastMessage}
        </div>
      )}

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-[22px] font-extrabold text-[var(--foreground)] tracking-tight">Pre-Visit Patient Flow Rules</h1>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[var(--accent-soft)] text-[var(--accent)] border border-black/5">
              Automated Patient Engagement
            </span>
          </div>
          <p className="text-[13px] text-[var(--foreground-muted)] font-medium mt-1">
            Configure automated pre-session SMS/email copay collection, intake consent forms, and Card-on-File billing locks.
          </p>
        </div>
      </div>

      {/* Global Patient Flow Rules */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="neu p-4 flex items-center justify-between">
          <div className="space-y-0.5">
            <div className="font-bold text-xs text-[var(--foreground)] flex items-center gap-1.5">
              <MessageSquare className="w-4 h-4 text-[var(--accent)]" /> Auto-Send Pre-Session Copay SMS Link
            </div>
            <p className="text-[11px] text-[var(--foreground-muted)]">Dispatches secure pay-by-link text 24h prior to appointment start.</p>
          </div>
          <Switch checked={autoSmsCopay} onChange={setAutoSmsCopay} />
        </div>

        <div className="neu p-4 flex items-center justify-between">
          <div className="space-y-0.5">
            <div className="font-bold text-xs text-[var(--foreground)] flex items-center gap-1.5">
              <Mail className="w-4 h-4 text-[var(--accent)]" /> Auto-Send Pre-Checkin Intake Email
            </div>
            <p className="text-[11px] text-[var(--foreground-muted)]">Requests consent signature and updated insurance card photo.</p>
          </div>
          <Switch checked={autoEmailIntake} onChange={setAutoEmailIntake} />
        </div>
      </div>

      {/* Dispatched Pre-Visit Payment Link Queue */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-[14px] font-bold text-[var(--foreground)]">Today&apos;s Dispatched Pre-Session Pay Links</h3>
          <span className="text-xs font-bold text-[var(--foreground-muted)]">{items.length} Active Sessions</span>
        </div>

        <div className="space-y-3">
          {items.map((item) => (
            <div key={item.id} className="neu p-5 space-y-3 border border-white/60">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-3 border-b border-[var(--border)]">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-[14px] text-[var(--foreground)]">{item.patientName}</span>
                  <StatusBadge
                    tone={item.status === "Collected" ? "success" : "warning"}
                    label={item.status === "Collected" ? "Copay Paid Online" : "Pay Link Sent"}
                  />
                </div>
                <div className="text-xs text-[var(--foreground-muted)] font-medium">
                  Session: {item.sessionTime} | Delivery: <span className="font-bold text-[var(--foreground)]">{item.deliveryMethod}</span>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs">
                <div className="font-semibold text-[var(--foreground)]">
                  Session Copay Due: <span className="font-mono font-bold text-[var(--accent)]">${item.copayAmount.toFixed(2)}</span>
                </div>

                <div className="flex items-center gap-2">
                  {item.status === "Sent" ? (
                    <>
                      <Button variant="secondary" size="sm" onClick={() => handleResend(item.id)}>
                        <Send className="w-3.5 h-3.5 mr-1" /> Resend SMS
                      </Button>
                      <Button variant="primary" size="sm" onClick={() => handleCollect(item.id)}>
                        <CreditCard className="w-3.5 h-3.5 mr-1" /> Mark Copay Collected
                      </Button>
                    </>
                  ) : (
                    <span className="text-xs font-bold text-[var(--status-success)] flex items-center gap-1">
                      <CheckCircle2 className="w-4 h-4" /> Card-on-File Charged Successfully
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  return embedInShell ? content : <AppShell>{content}</AppShell>;
}
