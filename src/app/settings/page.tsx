"use client";

import React, { useState } from "react";
import { AppShell } from "@/components/layout/app-shell";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/ui/status-badge";
import { Switch } from "@/components/ui/switch";
import { useRcmDataStore } from "@/store/useRcmDataStore";
import { Settings, ShieldCheck, Radio, User, RotateCcw, CheckCircle2 } from "lucide-react";

export default function SettingsPage() {
  const { resetDemoData } = useRcmDataStore();

  const [npi, setNpi] = useState("1982049102");
  const [taxId, setTaxId] = useState("12-3456789");
  const [practiceName, setPracticeName] = useState("MantraCare Behavioral Health");
  const [autoStatementCadence, setAutoStatementCadence] = useState(true);
  const [autoScrubBeforeFiling, setAutoScrubBeforeFiling] = useState(true);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const handleReset = () => {
    resetDemoData();
    setToastMessage("Demo data and localStorage have been reset to original mock baseline!");
    setTimeout(() => setToastMessage(null), 3500);
  };

  return (
    <AppShell>
      <div className="space-y-6 select-none max-w-4xl mx-auto">
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
                Settings
              </h1>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] uppercase font-bold bg-[var(--accent-soft)] text-[var(--accent)] border border-black/5">
                Practice Profile & Gateway
              </span>
            </div>
            <p className="text-[13px] text-[var(--foreground-muted)] font-medium mt-1">
              Manage practice NPI identifiers, clearinghouse connection, user profile, and demo data state.
            </p>
          </div>
        </div>

        {/* Practice & Provider Credentials */}
        <div className="neu p-6 space-y-4 bg-[var(--surface)]">
          <div className="flex items-center justify-between border-b border-[var(--border)] pb-3">
            <h2 className="text-[15px] font-bold text-[var(--foreground)] flex items-center gap-2">
              <User className="w-4.5 h-4.5 text-[var(--accent)]" />
              US Behavioral Health Practice Profile
            </h2>
            <StatusBadge tone="success" label="US Healthcare Compliant" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-bold text-[var(--foreground)] mb-1">
                Practice Organization Name
              </label>
              <input
                type="text"
                value={practiceName}
                onChange={(e) => setPracticeName(e.target.value)}
                className="w-full neu-pressed px-3.5 py-2 rounded-xl text-[13px] text-[var(--foreground)] bg-transparent border-none outline-none focus:ring-2 focus:ring-[var(--accent)]"
              />
            </div>

            <div>
              <label className="block font-bold text-[var(--foreground)] mb-1">
                Primary Practice Tax ID (EIN)
              </label>
              <input
                type="text"
                value={taxId}
                onChange={(e) => setTaxId(e.target.value)}
                className="w-full neu-pressed px-3.5 py-2 rounded-xl text-[13px] text-[var(--foreground)] bg-transparent border-none outline-none focus:ring-2 focus:ring-[var(--accent)]"
              />
            </div>

            <div>
              <label className="block font-bold text-[var(--foreground)] mb-1">
                Billing Provider NPI (Type 2 Organization)
              </label>
              <input
                type="text"
                value={npi}
                onChange={(e) => setNpi(e.target.value)}
                className="w-full neu-pressed px-3.5 py-2 rounded-xl text-[13px] text-[var(--foreground)] bg-transparent border-none outline-none focus:ring-2 focus:ring-[var(--accent)]"
              />
            </div>

            <div>
              <label className="block font-bold text-[var(--foreground)] mb-1">
                Primary Taxonomy Code
              </label>
              <input
                type="text"
                readOnly
                value="101YM0800X (Behavioral Health)"
                className="w-full neu-pressed px-3.5 py-2 rounded-xl text-[13px] text-[var(--foreground-muted)] bg-transparent border-none outline-none cursor-not-allowed"
              />
            </div>
          </div>
        </div>

        {/* Clearinghouse Gateway Connection (Stedi) */}
        <div className="neu p-6 space-y-4 bg-[var(--surface)]">
          <div className="flex items-center justify-between border-b border-[var(--border)] pb-3">
            <h2 className="text-[15px] font-bold text-[var(--foreground)] flex items-center gap-2">
              <Radio className="w-4.5 h-4.5 text-[var(--accent)]" />
              Clearinghouse Gateway Connection (Stedi EDI)
            </h2>
            <StatusBadge tone="success" label="EDI 837 / 835 Live" />
          </div>

          <div className="p-4 neu-pressed rounded-2xl flex items-center justify-between text-xs">
            <div className="space-y-1">
              <div className="font-bold text-[var(--foreground)] text-[13px]">
                Stedi EDI Clearinghouse Gateway — Active
              </div>
              <p className="text-[var(--foreground-muted)] font-medium">
                Connected to Stedi 837P transmission network with automated 999 acknowledgement and 835 ERA remittance parsing.
              </p>
            </div>
            <div className="text-right shrink-0">
              <span className="text-[10px] font-bold text-[var(--status-success)] px-2.5 py-1 rounded-full bg-[var(--status-success-bg)]">
                ● Connected (200 OK)
              </span>
            </div>
          </div>
        </div>

        {/* Default Automation Preferences */}
        <div className="neu p-6 space-y-4 bg-[var(--surface)]">
          <h2 className="text-[15px] font-bold text-[var(--foreground)] border-b border-[var(--border)] pb-3 flex items-center gap-2">
            <ShieldCheck className="w-4.5 h-4.5 text-[var(--accent)]" />
            Global Automation Preferences
          </h2>

          <div className="space-y-3 text-xs">
            <div className="flex items-center justify-between p-3.5 neu-pressed rounded-xl">
              <div>
                <div className="font-bold text-[var(--foreground)]">Auto-Scrub Claims Before Clearinghouse Filing</div>
                <p className="text-[var(--foreground-muted)] font-medium">Applies all active CPT/Modifier and NPI scrub rules before generating 837P.</p>
              </div>
              <Switch checked={autoScrubBeforeFiling} onChange={setAutoScrubBeforeFiling} />
            </div>

            <div className="flex items-center justify-between p-3.5 neu-pressed rounded-xl">
              <div>
                <div className="font-bold text-[var(--foreground)]">Automated Patient Statement & Dunning Cadence</div>
                <p className="text-[var(--foreground-muted)] font-medium">Dispatches SMS/Email statements every 30 days for uncollected patient balances.</p>
              </div>
              <Switch checked={autoStatementCadence} onChange={setAutoStatementCadence} />
            </div>
          </div>
        </div>

        {/* Practice Fee Schedule Section (11.3) */}
        <FeeScheduleSection />

        {/* Practice Team & User Access Control (11.9) */}
        <div className="neu p-6 space-y-4 bg-[var(--surface)]">
          <div className="flex items-center justify-between border-b border-[var(--border)] pb-3">
            <h2 className="text-[15px] font-bold text-[var(--foreground)] flex items-center gap-2">
              <User className="w-4.5 h-4.5 text-[var(--accent)]" />
              Practice Team & Role Access Control
            </h2>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] uppercase font-bold bg-[var(--accent-soft)] text-[var(--accent)] border border-black/5">
              4 Active Team Members
            </span>
          </div>

          <div className="divide-y divide-[var(--border)] border border-[var(--border)] rounded-2xl overflow-hidden bg-[var(--surface)] text-xs">
            {[
              { name: "Dr. Rachel Vance, PsyD", role: "Attending Clinical Provider", npi: "1982049102", email: "rachel.vance@mantracare.com", status: "Active" },
              { name: "Alex River", role: "Lead Billing Specialist", npi: "1002941829", email: "alex.river@mantracare.com", status: "Active" },
              { name: "Dr. Marcus Thorne, MD", role: "Supervising Psychiatrist", npi: "1882940192", email: "marcus.thorne@mantracare.com", status: "Active" },
              { name: "Elena Rostova", role: "Intake & Eligibility Officer", npi: "N/A (Staff)", email: "elena.r@mantracare.com", status: "Active" },
            ].map((member, idx) => (
              <div key={idx} className="p-4 flex items-center justify-between hover:bg-[var(--surface-muted)] transition-colors">
                <div className="space-y-0.5">
                  <div className="font-bold text-[14px] text-[var(--foreground)]">{member.name}</div>
                  <div className="text-[var(--foreground-muted)] font-medium">
                    {member.role} • <span className="font-mono text-[var(--foreground)]">NPI: {member.npi}</span>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-[var(--foreground-faint)] font-mono">{member.email}</span>
                  <StatusBadge tone="success" label={member.status} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Stage 9 Reset Demo Data Action */}
        <div className="neu p-6 space-y-3 border border-[var(--status-critical)]/20 bg-[var(--surface)]">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-[15px] font-bold text-[var(--foreground)] flex items-center gap-2">
                <RotateCcw className="w-4.5 h-4.5 text-[var(--status-warning)]" />
                Reset Demo Data & Store State
              </h2>
              <p className="text-xs text-[var(--foreground-muted)] font-medium mt-1">
                Clears live `localStorage` persistence and reseeds all claims, appointments, encounters, and invoices to initial mock baseline.
              </p>
            </div>

            <Button variant="secondary" size="sm" onClick={handleReset}>
              <RotateCcw className="w-3.5 h-3.5" /> Reset Demo Data
            </Button>
          </div>
        </div>
      </div>
    </AppShell>
  );
}

function FeeScheduleSection() {
  const { feeSchedule, updateFeeScheduleItem } = useRcmDataStore();
  const [showAdd, setShowAdd] = useState(false);
  const [newCpt, setNewCpt] = useState("");
  const [newDesc, setNewDesc] = useState("");
  const [newRate, setNewRate] = useState("");

  const handleAdd = () => {
    if (!newCpt.trim() || !newRate) return;
    updateFeeScheduleItem(newCpt.trim().toUpperCase(), Number(newRate), newDesc.trim() || undefined);
    setNewCpt("");
    setNewDesc("");
    setNewRate("");
    setShowAdd(false);
  };

  return (
    <div className="neu p-6 space-y-4 bg-[var(--surface)]">
      <div className="flex items-center justify-between border-b border-[var(--border)] pb-3">
        <div>
          <h2 className="text-[15px] font-bold text-[var(--foreground)] flex items-center gap-2">
            <Settings className="w-4.5 h-4.5 text-[var(--accent)]" />
            Practice Charge Master & CPT Fee Schedule
          </h2>
          <p className="text-xs text-[var(--foreground-muted)] font-medium mt-0.5">
            Default provider asking rates per CPT code used across encounter billing and patient invoicing.
          </p>
        </div>

        <Button size="sm" onClick={() => setShowAdd(!showAdd)}>
          {showAdd ? "Cancel" : "+ Add CPT Rate"}
        </Button>
      </div>

      {showAdd && (
        <div className="p-4 neu-pressed rounded-2xl space-y-3">
          <h3 className="text-xs font-bold text-[var(--foreground)] uppercase tracking-wider">
            Define New CPT Asking Rate
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
            <div>
              <label className="block font-bold text-[var(--foreground)] mb-1">CPT Code *</label>
              <input
                type="text"
                value={newCpt}
                onChange={(e) => setNewCpt(e.target.value)}
                placeholder="e.g. 90837"
                className="w-full bg-[var(--surface)] px-3 py-1.5 rounded-xl text-[12px] border border-[var(--border)] outline-none"
              />
            </div>
            <div>
              <label className="block font-bold text-[var(--foreground)] mb-1">Service Description</label>
              <input
                type="text"
                value={newDesc}
                onChange={(e) => setNewDesc(e.target.value)}
                placeholder="e.g. Psychotherapy, 60 min"
                className="w-full bg-[var(--surface)] px-3 py-1.5 rounded-xl text-[12px] border border-[var(--border)] outline-none"
              />
            </div>
            <div>
              <label className="block font-bold text-[var(--foreground)] mb-1">Standard Rate ($) *</label>
              <input
                type="number"
                value={newRate}
                onChange={(e) => setNewRate(e.target.value)}
                placeholder="e.g. 175.00"
                className="w-full bg-[var(--surface)] px-3 py-1.5 rounded-xl text-[12px] border border-[var(--border)] outline-none"
              />
            </div>
          </div>
          <Button size="sm" onClick={handleAdd} disabled={!newCpt.trim() || !newRate}>
            Save to Fee Schedule
          </Button>
        </div>
      )}

      <div className="overflow-x-auto custom-scrollbar">
        <table className="w-full text-xs text-left select-none">
          <thead>
            <tr className="border-b border-[var(--border)] text-[var(--foreground-faint)] uppercase font-bold text-[10px] tracking-wider">
              <th className="py-2.5 px-3">CPT Code</th>
              <th className="py-2.5 px-3">Service Description</th>
              <th className="py-2.5 px-3 text-right">Practice Standard Rate ($)</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--border)] font-medium">
            {feeSchedule.map((item) => (
              <tr key={item.cptCode} className="hover:bg-[var(--surface-muted)]/50 transition-colors">
                <td className="py-2.5 px-3 font-mono font-bold text-[var(--foreground)]">{item.cptCode}</td>
                <td className="py-2.5 px-3 text-[var(--foreground-muted)]">{item.description}</td>
                <td className="py-2.5 px-3 text-right">
                  <input
                    type="number"
                    value={item.providerRate}
                    onChange={(e) => updateFeeScheduleItem(item.cptCode, Number(e.target.value), item.description)}
                    className="w-24 text-right px-2 py-1 rounded-lg bg-[var(--surface-muted)] text-[var(--foreground)] font-bold border border-[var(--border)] outline-none focus:ring-1 focus:ring-[var(--accent)]"
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
