"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { AppShell } from "@/components/layout/app-shell";
import DenialsPage from "./denials/page";
import ImportErrorsPage from "./import-errors/page";
import PayerMappingPage from "./payer-mapping/page";
import SubmissionErrorsPage from "./submission-errors/page";
import RejectionsPage from "./rejections/page";
import EdiEraPage from "./edi-era/page";
import { AlertCircle, FileX2, ShieldAlert, GitMerge, FileCode, Radio } from "lucide-react";

export type ActionItemsTab = "denials" | "import-errors" | "payer-mapping" | "submission-errors" | "rejections" | "edi-era";

export default function WorklistPage({ defaultTab }: any) {
  const searchParams = useSearchParams();
  const queryTab = searchParams.get("tab") as ActionItemsTab | null;

  const [activeTab, setActiveTab] = useState<ActionItemsTab>(
    defaultTab || queryTab || "denials"
  );

  useEffect(() => {
    if (queryTab && ["denials", "import-errors", "payer-mapping", "submission-errors", "rejections", "edi-era"].includes(queryTab)) {
      setActiveTab(queryTab);
    }
  }, [queryTab]);

  const tabs = [
    { id: "denials" as ActionItemsTab, label: "Denial Management", badge: "12", icon: <ShieldAlert className="w-3.5 h-3.5" /> },
    { id: "import-errors" as ActionItemsTab, label: "Import Errors", badge: "2", icon: <AlertCircle className="w-3.5 h-3.5" /> },
    { id: "payer-mapping" as ActionItemsTab, label: "Payer Mappings", badge: "4", icon: <GitMerge className="w-3.5 h-3.5" /> },
    { id: "submission-errors" as ActionItemsTab, label: "Submission Errors", badge: "4", icon: <FileCode className="w-3.5 h-3.5" /> },
    { id: "rejections" as ActionItemsTab, label: "Payer Rejections", badge: "4", icon: <FileX2 className="w-3.5 h-3.5" /> },
    { id: "edi-era" as ActionItemsTab, label: "EDI / ERA Enrollments", badge: "4", icon: <Radio className="w-3.5 h-3.5" /> },
  ];

  return (
    <AppShell>
      <div className="space-y-6 select-none">
        {/* Consolidated Action Items Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-[22px] font-extrabold tracking-tight text-[var(--foreground)]">
                Action Items & Exception Worklist
              </h1>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] uppercase font-bold bg-[var(--status-critical-bg)] text-[var(--status-critical)] border border-[var(--status-critical)]/20">
                30 Active Exceptions
              </span>
            </div>
            <p className="text-[13px] text-[var(--foreground-muted)] font-medium mt-1">
              Unified operational queue for root-cause denial clusters, EDI syntax edits, clearinghouse mappings, and import errors.
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

        {/* Active Queue Content */}
        <div className="pt-2">
          {activeTab === "denials" && <DenialsPage embedInShell />}
          {activeTab === "import-errors" && <ImportErrorsPage embedInShell />}
          {activeTab === "payer-mapping" && <PayerMappingPage embedInShell />}
          {activeTab === "submission-errors" && <SubmissionErrorsPage embedInShell />}
          {activeTab === "rejections" && <RejectionsPage embedInShell />}
          {activeTab === "edi-era" && <EdiEraPage embedInShell />}
        </div>
      </div>
    </AppShell>
  );
}
