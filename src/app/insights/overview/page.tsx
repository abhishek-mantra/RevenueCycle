"use client";

import React from "react";
import { AppShell } from "@/components/layout/app-shell";
import { KpiCard } from "@/components/ui/kpi-card";
import { StatusBadge } from "@/components/ui/status-badge";
import { Button } from "@/components/ui/button";
import { mockPayerPerformance, mockContractVariances } from "@/data/mockAnalytics";
import { motion } from "framer-motion";
import {
  TrendingUp,
  ShieldCheck,
  AlertTriangle,
  Clock,
  Sparkles,
  DollarSign,
  Layers,
  ArrowRight,
  Zap,
} from "lucide-react";

export default function OverviewPage() {
  return (
    <AppShell>
      <div className="space-y-6 select-none">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-[22px] font-extrabold tracking-tight text-[var(--foreground)]">
                Revenue Cycle Control Tower
              </h1>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] uppercase font-bold bg-[var(--accent-soft)] text-[var(--foreground)] border border-black/5">
                Executive RCM Engine
              </span>
            </div>
            <p className="text-[13px] text-[var(--foreground-muted)] font-medium mt-1">
              Top-line health indicators, auto-generated plain-English callouts, and contract variance alerts.
            </p>
          </div>

          <Button variant="secondary" size="sm" onClick={() => alert("Exporting Executive Board Report")}>
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span>Export Board Report</span>
          </Button>
        </div>

        {/* Plain-English Auto-Generated Summary Callouts (PRD §8.7.1 & §8.7.3) */}
        <div className="space-y-3">
          <h2 className="text-[12px] font-bold uppercase tracking-wider text-[var(--foreground-faint)]">
            Auto-Generated Revenue Intelligence Callouts
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="neu p-5 border border-white/60 bg-gradient-to-br from-[var(--canvas)] to-[var(--surface-muted)] space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[var(--status-success)] flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-[var(--status-success)]" /> Top Performing Panel
                </span>
                <StatusBadge tone="success" label="95.6% Approval" />
              </div>
              <p className="text-[13px] font-semibold text-[var(--foreground)] leading-snug">
                Your highest approval rate is <strong className="text-[var(--accent)]">95.6% from Blue Cross Blue Shield</strong>, representing <strong className="text-[var(--foreground)]">38.5% of patient volume</strong> with an average 12.4-day payment velocity.
              </p>
            </div>

            <div className="neu p-5 border border-white/60 bg-gradient-to-br from-[var(--canvas)] to-[var(--status-critical-bg)]/40 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[var(--status-critical)] flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4 text-[var(--status-critical)]" /> Payer Panel ROI Warning
                </span>
                <StatusBadge tone="critical" label="62% Approval" />
              </div>
              <p className="text-[13px] font-semibold text-[var(--foreground)] leading-snug">
                You consistently get denied from <strong className="text-[var(--status-critical)]">United Healthcare at 38%</strong>, despite it being 18.8% of your mix. Effective ROI is <strong className="text-[var(--foreground)]">$84.20/hr</strong> vs practice average $128/hr.
              </p>
            </div>
          </div>
        </div>

        {/* Master Top-Line KPI Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <KpiCard
            label="Net Collection Rate"
            value="98.4%"
            delta="+2.1%"
            deltaType="increase"
            subtitle="Collectable revenue"
            icon={<DollarSign className="w-4 h-4" />}
          />
          <KpiCard
            label="Clean Claim Rate"
            value="94.2%"
            delta="+1.5%"
            deltaType="increase"
            subtitle="First pass success"
            icon={<ShieldCheck className="w-4 h-4" />}
          />
          <KpiCard
            label="Denial Rate"
            value="4.8%"
            delta="-0.9%"
            deltaType="increase"
            subtitle="Clustered by root cause"
            icon={<AlertTriangle className="w-4 h-4" />}
          />
          <KpiCard
            label="Days in A/R"
            value="18.4d"
            delta="-2.4d"
            deltaType="increase"
            subtitle="Industry avg 35d"
            icon={<Clock className="w-4 h-4" />}
          />
          <KpiCard
            label="Median Decision"
            value="12.0d"
            delta="-1.5d"
            deltaType="increase"
            subtitle="Submission to ERA"
            icon={<TrendingUp className="w-4 h-4" />}
          />
          <KpiCard
            label="Touchless Claim %"
            value="94.2%"
            delta="90% Target Met"
            deltaType="increase"
            subtitle="Zero human touch"
            icon={<Zap className="w-4 h-4" />}
          />
        </div>

        {/* Contract Variance Summary Card */}
        <div className="neu p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-[var(--border)] pb-3">
            <div>
              <h3 className="text-[15px] font-bold text-[var(--foreground)]">
                Contract Variance Underpayment Detections ({mockContractVariances.length} Flagged)
              </h3>
              <p className="text-[12px] text-[var(--foreground-muted)] font-medium">
                Actual paid amount compared against provider's contracted expected rate per CPT code.
              </p>
            </div>

            <StatusBadge tone="warning" label="$40.00 Underpayment Flagged" />
          </div>

          <div className="divide-y divide-[var(--border)] border border-[var(--border)] rounded-2xl overflow-hidden bg-[var(--surface)]">
            {mockContractVariances.map((varItem) => (
              <div key={varItem.id} className="p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-xs px-2.5 py-0.5 rounded-full bg-[var(--accent-soft)] text-[var(--accent)]">
                      {varItem.claimId}
                    </span>
                    <span className="font-bold text-xs text-[var(--foreground)]">{varItem.payerName} — CPT {varItem.cptCode}</span>
                  </div>
                  <div className="text-xs text-[var(--foreground-muted)] font-medium">
                    <strong className="text-[var(--foreground)]">Contract Clause:</strong> {varItem.clauseCite}
                  </div>
                </div>

                <div className="flex items-center gap-6">
                  <div className="text-right text-xs">
                    <span className="text-[var(--foreground-muted)]">Expected vs Paid: </span>
                    <span className="font-bold tabular-nums">${varItem.contractedRate} vs ${varItem.actualPaidAmount}</span>
                  </div>

                  <div className="text-right">
                    <div className="text-[10px] font-bold uppercase tracking-wider text-[var(--status-critical)]">Underpaid</div>
                    <div className="text-[16px] font-extrabold text-[var(--status-critical)] tabular-nums">
                      -${varItem.underpaymentVariance.toFixed(2)}
                    </div>
                  </div>

                  <Button size="sm" variant="secondary" onClick={() => alert(`Dispute filed for ${varItem.claimId} under contract clause!`)}>
                    File Dispute
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AppShell>
  );
}
