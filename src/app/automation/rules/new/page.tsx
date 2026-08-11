"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { AppShell } from "@/components/layout/app-shell";
import { Button } from "@/components/ui/button";
import { useRcmDataStore } from "@/store/useRcmDataStore";
import { ArrowLeft, Save, Sliders, ShieldCheck } from "lucide-react";
import Link from "next/link";

export default function NewScrubRulePage() {
  const router = useRouter();
  const { addScrubRule } = useRcmDataStore();

  const [ruleName, setRuleName] = useState("");
  const [ruleType, setRuleType] = useState("Modifier Required");
  const [targetPayer, setTargetPayer] = useState("Blue Cross Blue Shield");
  const [description, setDescription] = useState("");
  const [cptCode, setCptCode] = useState("");
  const [requiredModifier, setRequiredModifier] = useState("");
  const [severity, setSeverity] = useState<"Critical" | "Warning" | "Info">("Critical");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ruleName || !description) return;

    addScrubRule({
      ruleName,
      ruleType,
      targetPayer,
      description,
      cptCode: cptCode || undefined,
      requiredModifier: requiredModifier || undefined,
      enabled: true,
      severity,
    });

    router.push("/automation");
  };

  return (
    <AppShell>
      <div className="max-w-2xl mx-auto space-y-6 select-none">
        {/* Top Header & Navigation */}
        <div className="flex items-center gap-3">
          <Link href="/automation">
            <button
              aria-label="Back to rules"
              className="p-2 rounded-xl neu-soft hover:bg-[var(--surface-muted)] text-[var(--foreground-muted)] hover:text-[var(--foreground)] transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
          </Link>
          <div>
            <h1 className="text-[20px] font-extrabold tracking-tight text-[var(--foreground)]">
              Create New Scrubbing Rule
            </h1>
            <p className="text-[12px] text-[var(--foreground-muted)] font-medium">
              Define automated validation criteria to catch claim errors before submission.
            </p>
          </div>
        </div>

        {/* Rule Builder Form */}
        <form onSubmit={handleSubmit} className="neu p-6 space-y-5 bg-[var(--surface)]">
          <div className="space-y-4 text-[13px]">
            <div>
              <label className="block font-bold text-[var(--foreground)] mb-1">
                Rule Title <span className="text-[var(--status-critical)]">*</span>
              </label>
              <input
                type="text"
                required
                value={ruleName}
                onChange={(e) => setRuleName(e.target.value)}
                placeholder="e.g. Require Modifier 95 for Telehealth CPT 90837"
                className="w-full neu-pressed px-3.5 py-2 rounded-xl text-[13px] text-[var(--foreground)] bg-transparent border-none outline-none focus:ring-2 focus:ring-[var(--accent)]"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-bold text-[var(--foreground)] mb-1">
                  Rule Category
                </label>
                <select
                  value={ruleType}
                  onChange={(e) => setRuleType(e.target.value)}
                  className="w-full neu-pressed px-3 py-2 rounded-xl text-[13px] text-[var(--foreground)] bg-transparent border-none outline-none focus:ring-2 focus:ring-[var(--accent)]"
                >
                  <option value="Modifier Required">Modifier Required</option>
                  <option value="Prior Auth Required">Prior Auth Required</option>
                  <option value="Timely Filing Window">Timely Filing Window</option>
                  <option value="NPI Validation">NPI Validation</option>
                  <option value="ICD-10 Specificity">ICD-10 Specificity</option>
                  <option value="CPT-Payer Mismatch">CPT-Payer Mismatch</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-[var(--foreground)] mb-1">
                  Target Payer
                </label>
                <select
                  value={targetPayer}
                  onChange={(e) => setTargetPayer(e.target.value)}
                  className="w-full neu-pressed px-3 py-2 rounded-xl text-[13px] text-[var(--foreground)] bg-transparent border-none outline-none focus:ring-2 focus:ring-[var(--accent)]"
                >
                  <option value="All Payers">All Payers</option>
                  <option value="Blue Cross Blue Shield">Blue Cross Blue Shield</option>
                  <option value="Aetna Behavioral Health">Aetna Behavioral Health</option>
                  <option value="United Healthcare">United Healthcare</option>
                  <option value="Cigna Health">Cigna Health</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-bold text-[var(--foreground)] mb-1">
                  Target CPT Code (Optional)
                </label>
                <input
                  type="text"
                  value={cptCode}
                  onChange={(e) => setCptCode(e.target.value)}
                  placeholder="e.g. 90837, 90791"
                  className="w-full neu-pressed px-3.5 py-2 rounded-xl text-[13px] text-[var(--foreground)] bg-transparent border-none outline-none focus:ring-2 focus:ring-[var(--accent)]"
                />
              </div>

              <div>
                <label className="block font-bold text-[var(--foreground)] mb-1">
                  Required Modifier (Optional)
                </label>
                <input
                  type="text"
                  value={requiredModifier}
                  onChange={(e) => setRequiredModifier(e.target.value)}
                  placeholder="e.g. 95, GT, 25"
                  className="w-full neu-pressed px-3.5 py-2 rounded-xl text-[13px] text-[var(--foreground)] bg-transparent border-none outline-none focus:ring-2 focus:ring-[var(--accent)]"
                />
              </div>
            </div>

            <div>
              <label className="block font-bold text-[var(--foreground)] mb-1">
                Rule Description & Action <span className="text-[var(--status-critical)]">*</span>
              </label>
              <textarea
                required
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Explain what error this rule catches and how claims are updated automatically..."
                className="w-full neu-pressed p-3.5 rounded-xl text-[13px] text-[var(--foreground)] bg-transparent border-none outline-none focus:ring-2 focus:ring-[var(--accent)]"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-[var(--border)]">
            <Link href="/automation">
              <Button variant="secondary" size="sm">
                Cancel
              </Button>
            </Link>
            <Button type="submit" variant="primary" size="sm">
              <Save className="w-4 h-4" /> Save Scrub Rule
            </Button>
          </div>
        </form>
      </div>
    </AppShell>
  );
}
