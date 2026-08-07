"use client";

import React, { useState } from "react";
import { AppShell } from "@/components/layout/app-shell";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/ui/status-badge";
import { Switch } from "@/components/ui/switch";
import { Globe, Settings, ShieldCheck, CheckCircle2 } from "lucide-react";

export default function SettingsPage() {
  const [selectedRegion, setSelectedRegion] = useState<"US" | "UK" | "CA" | "UAE">("US");

  return (
    <AppShell>
      <div className="space-y-6 select-none">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-[22px] font-extrabold tracking-tight text-[var(--foreground)]">
                Settings & Regional Flexibility Configuration
              </h1>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] uppercase font-bold bg-[var(--accent-soft)] text-[var(--accent)] border border-black/5">
                PRD §10 Multi-Country Engine
              </span>
            </div>
            <p className="text-[13px] text-[var(--foreground-muted)] font-medium mt-1">
              Configure practice region, clearinghouse submission channels, code systems, and currency formatting.
            </p>
          </div>
        </div>

        {/* Regional Flexibility Selector (PRD §10) */}
        <div className="neu p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-[15px] font-bold text-[var(--foreground)] flex items-center gap-2">
              <Globe className="w-5 h-5 text-[var(--accent)]" />
              Practice Operating Country / Region
            </h2>
            <StatusBadge tone="success" label={`Active Market: ${selectedRegion}`} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[
              { code: "US", name: "United States", currency: "USD ($)", doc: "CMS-1500 / 837P", codes: "CPT / ICD-10" },
              { code: "UK", name: "United Kingdom", currency: "GBP (£)", doc: "Itemized Claim Summary", codes: "OPCS-4 / ICD-11" },
              { code: "CA", name: "Canada", currency: "CAD ($)", doc: "Provincial Claim Form", codes: "CCI / ICD-10-CA" },
              { code: "UAE", name: "United Arab Emirates", currency: "AED (AED)", doc: "Shafafiya / E-Claim", codes: "CPT / ICD-10" },
            ].map((reg) => (
              <div
                key={reg.code}
                onClick={() => setSelectedRegion(reg.code as any)}
                className={`neu p-4 rounded-2xl cursor-pointer transition-all border ${
                  selectedRegion === reg.code ? "border-[var(--accent)] bg-[var(--accent-soft)]/50" : "border-transparent"
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-bold text-[15px] text-[var(--foreground)]">{reg.name}</span>
                  {selectedRegion === reg.code && <CheckCircle2 className="w-4 h-4 text-[var(--accent)]" />}
                </div>
                <div className="text-xs space-y-1 text-[var(--foreground-muted)] font-medium">
                  <div>Currency: <strong className="text-[var(--foreground)]">{reg.currency}</strong></div>
                  <div>Doc Type: <strong className="text-[var(--foreground)]">{reg.doc}</strong></div>
                  <div>Code System: <strong className="text-[var(--foreground)]">{reg.codes}</strong></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AppShell>
  );
}
