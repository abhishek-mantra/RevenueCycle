"use client";

import React, { useState } from "react";
import { AppShell } from "@/components/layout/app-shell";
import { KpiCard } from "@/components/ui/kpi-card";
import { StatusBadge } from "@/components/ui/status-badge";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";
import {
  Mail,
  Sliders,
  Send,
  MessageSquare,
  Users,
  Calendar,
  CheckCircle2,
  Sparkles,
} from "lucide-react";

export default function PatientStatementsPage({ embedInShell }: any) {
  const [cadenceDays, setCadenceDays] = useState(14);
  const [maxPatients, setMaxPatients] = useState(50);
  const [enableSms, setEnableSms] = useState(true);
  const [enableEmail, setEnableEmail] = useState(true);

  const content = (
    <div className="space-y-6 select-none">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-[22px] font-extrabold tracking-tight text-[var(--foreground)]">
                Patient Statement Batch Automation
              </h1>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] uppercase font-bold bg-[var(--accent-soft)] text-[var(--accent)] border border-black/5">
                Automation Config
              </span>
            </div>
            <p className="text-[13px] text-[var(--foreground-muted)] font-medium mt-1">
              Configure cadence, balance threshold ranges, delivery channels, and preview upcoming statement batches.
            </p>
          </div>

          <Button variant="primary" size="sm" onClick={() => alert("Batch triggered! Sending statements now...")}>
            <Send className="w-4 h-4" /> Send Batch Now
          </Button>
        </div>

        {/* Configuration Panel */}
        <div className="neu p-6 space-y-6">
          <h2 className="text-[15px] font-bold text-[var(--foreground)] flex items-center gap-2">
            <Sliders className="w-4 h-4 text-[var(--accent)]" />
            Batch Delivery Parameters
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <label className="text-[12px] font-bold text-[var(--foreground)]">Auto-Reminder Cadence:</label>
              <div className="neu-pressed p-1 rounded-full flex items-center justify-around text-xs">
                {[7, 14, 21, 28].map((days) => (
                  <button
                    key={days}
                    onClick={() => setCadenceDays(days)}
                    className={`px-3 py-1 rounded-full font-bold transition-all cursor-pointer ${
                      cadenceDays === days ? "bg-[var(--accent)] text-white shadow-xs" : "text-[var(--foreground-muted)]"
                    }`}
                  >
                    {days} Days
                  </button>
                ))}
              </div>
            </div>

            <Input
              label="Maximum Patients per Batch"
              type="number"
              value={maxPatients}
              onChange={(e) => setMaxPatients(Number(e.target.value))}
            />

            <div className="space-y-2">
              <label className="text-[12px] font-bold text-[var(--foreground)]">Active Delivery Channels:</label>
              <div className="flex flex-col gap-2">
                <Switch checked={enableSms} onChange={setEnableSms} label="Pay-by-Link SMS Text" />
                <Switch checked={enableEmail} onChange={setEnableEmail} label="Email Statement PDF" />
              </div>
            </div>
          </div>
        </div>

        {/* Upcoming Batch Preview (PRD §8.8.2) */}
        <div className="neu p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-[15px] font-bold text-[var(--foreground)] flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[var(--accent)]" />
              Upcoming Scheduled Statement Batch Preview (12 Patients)
            </h3>
            <StatusBadge tone="success" label="Scheduled for Tomorrow 09:00 EST" />
          </div>

          <div className="divide-y divide-[var(--border)] border border-[var(--border)] rounded-2xl overflow-hidden bg-[var(--surface)]">
            <div className="p-4 flex items-center justify-between text-xs">
              <span className="font-bold text-[var(--foreground)]">Sarah Jenkins</span>
              <span className="text-[var(--foreground-muted)] font-medium">Balance: $30.00 (Copay)</span>
              <StatusBadge tone="neutral" label="SMS & Email Ready" />
            </div>
            <div className="p-4 flex items-center justify-between text-xs">
              <span className="font-bold text-[var(--foreground)]">Elena Rostova</span>
              <span className="text-[var(--foreground-muted)] font-medium">Balance: $125.00 (Deductible)</span>
              <StatusBadge tone="neutral" label="SMS & Email Ready" />
            </div>
          </div>
        </div>
      </div>
  );

  return embedInShell ? content : <AppShell>{content}</AppShell>;
}
