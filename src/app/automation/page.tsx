"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { AppShell } from "@/components/layout/app-shell";
import RulesPage from "./rules/page";
import PatientStatementsPage from "./patient-statements/page";
import InsuranceIntakePage from "./insurance-intake/page";
import PatientFlowPage from "./patient-flow/page";
import { Sliders, Mail, Workflow, Activity } from "lucide-react";

export type AutomationTab = "rules" | "patient-statements" | "insurance-intake" | "patient-flow";

export default function AutomationPage({ defaultTab }: any) {
  const searchParams = useSearchParams();
  const queryTab = searchParams.get("tab") as AutomationTab | null;

  const [activeTab, setActiveTab] = useState<AutomationTab>(
    defaultTab || queryTab || "rules"
  );

  useEffect(() => {
    if (queryTab && ["rules", "patient-statements", "insurance-intake", "patient-flow"].includes(queryTab)) {
      setActiveTab(queryTab);
    }
  }, [queryTab]);

  const tabs = [
    { id: "rules" as AutomationTab, label: "Billing Scrub Rules", badge: "8 Active Rules", icon: <Sliders className="w-3.5 h-3.5" /> },
    { id: "patient-statements" as AutomationTab, label: "Patient Statements & Dunning", badge: "Auto-Cadence", icon: <Mail className="w-3.5 h-3.5" /> },
    { id: "insurance-intake" as AutomationTab, label: "Insurance Intake & OCR", badge: "AI Vision", icon: <Workflow className="w-3.5 h-3.5" /> },
    { id: "patient-flow" as AutomationTab, label: "Pre-Visit Flow & Copays", badge: "Card-on-File", icon: <Activity className="w-3.5 h-3.5" /> },
  ];

  return (
    <AppShell>
      <div className="space-y-6 select-none">
        {/* Consolidated Automation Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-[22px] font-extrabold tracking-tight text-[var(--foreground)]">
                Rules & Automation Configuration
              </h1>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] uppercase font-bold bg-[var(--accent-soft)] text-[var(--accent)] border border-black/5">
                Touchless RCM Engine
              </span>
            </div>
            <p className="text-[13px] text-[var(--foreground-muted)] font-medium mt-1">
              Configure billing scrub rules, automated dunning cadences, insurance OCR extraction, and pre-visit copay locks.
            </p>
          </div>
        </div>

        {/* Tab Sub-Navigation Bar */}
        <div className="neu p-1.5 rounded-2xl flex flex-wrap items-center gap-1 border border-white/60 bg-[var(--surface)]">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
                  isActive
                    ? "bg-[var(--accent)] text-white shadow-xs"
                    : "text-[var(--foreground-muted)] hover:text-[var(--foreground)] hover:bg-[var(--surface-muted)]"
                }`}
              >
                {tab.icon}
                <span>{tab.label}</span>
                <span
                  className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                    isActive
                      ? "bg-white/20 text-white"
                      : "bg-[var(--surface-muted)] text-[var(--foreground-muted)] border border-[var(--border)]"
                  }`}
                >
                  {tab.badge}
                </span>
              </button>
            );
          })}
        </div>

        {/* Active Automation Module Content */}
        <div className="pt-2">
          {activeTab === "rules" && <RulesPage embedInShell />}
          {activeTab === "patient-statements" && <PatientStatementsPage embedInShell />}
          {activeTab === "insurance-intake" && <InsuranceIntakePage embedInShell />}
          {activeTab === "patient-flow" && <PatientFlowPage embedInShell />}
        </div>
      </div>
    </AppShell>
  );
}
