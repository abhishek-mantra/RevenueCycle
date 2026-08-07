"use client";

import React, { useState, useEffect } from "react";
import { AppShell } from "@/components/layout/app-shell";
import { KpiCard } from "@/components/ui/kpi-card";
import { StatusBadge } from "@/components/ui/status-badge";
import { Button } from "@/components/ui/button";
import { mockMonthlyRevenueData, mockPayerPerformance } from "@/data/mockAnalytics";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import {
  TrendingUp,
  ShieldCheck,
  AlertTriangle,
  Clock,
  Sparkles,
  DollarSign,
  Zap,
  Activity,
  PieChart as PieIcon,
} from "lucide-react";

export default function HomeDashboard() {
  const pieColors = ["#0a0e15", "#373f4e", "#858d9d", "#d1d6e0"];
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const pieData = mockPayerPerformance.map((p) => ({
    name: p.payerName === "Blue Cross Blue Shield" ? "BCBS" : p.payerName === "Aetna Behavioral Health" ? "Aetna" : p.payerName === "United Healthcare" ? "UHC" : "Cigna",
    value: p.patientMixPct,
    approval: p.approvalRate30d,
  }));

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.05 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    show: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 400, damping: 28 } },
  };

  return (
    <AppShell>
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="space-y-6 select-none"
      >
        {/* Top Header */}
        <motion.div variants={itemVariants} className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-[22px] font-extrabold tracking-tight text-[var(--foreground)]">
                MantraCare RCM Control Tower & Operations
              </h1>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] uppercase font-bold bg-[var(--accent-soft)] text-[var(--accent)] border border-black/5">
                Live System Ready
              </span>
            </div>
            <p className="text-[13px] text-[var(--foreground-muted)] font-medium mt-1">
              Real-time financial analytics, claim adjudication tracking, and automated denial management.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Link href="/worklist/denials">
              <Button variant="secondary" size="sm">
                <AlertTriangle className="w-4 h-4 text-amber-500" />
                <span>Review Denials Queue (3 Clusters)</span>
              </Button>
            </Link>
          </div>
        </motion.div>

        {/* Auto-Generated Revenue Intelligence Callouts (PRD §8.7.1) */}
        <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="neu p-5 border border-white/60 bg-gradient-to-br from-[var(--canvas)] to-[var(--surface-muted)] space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[var(--status-success)] flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-[var(--status-success)]" /> Top Performing Panel
              </span>
              <StatusBadge tone="success" label="95.6% Approval" />
            </div>
            <p className="text-[13px] font-semibold text-[var(--foreground)] leading-snug">
              Your highest approval rate is <strong className="text-[var(--accent)]">95.6% from Blue Cross Blue Shield</strong>, representing <strong className="text-[var(--foreground)]">38.5% of volume</strong> with an average 12.4-day payment velocity.
            </p>
          </div>

          <div className="neu p-5 border border-white/60 bg-gradient-to-br from-[var(--canvas)] to-[var(--status-critical-bg)]/30 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[var(--status-critical)] flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4 text-[var(--status-critical)]" /> Payer Panel ROI Warning
              </span>
              <StatusBadge tone="critical" label="62% Approval" />
            </div>
            <p className="text-[13px] font-semibold text-[var(--foreground)] leading-snug">
              You consistently get denied from <strong className="text-[var(--status-critical)]">United Healthcare at 38%</strong>. Effective ROI is <strong className="text-[var(--foreground)]">$84.20/hr</strong> vs practice average $128/hr.
            </p>
          </div>
        </motion.div>

        {/* Master Top-Line KPI Strip */}
        <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
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
        </motion.div>

        {/* Charts & Analytics Visual Surface */}
        <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Revenue Stacked Bar Chart */}
          <div className="lg:col-span-2 neu p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-[15px] font-bold text-[var(--foreground)] flex items-center gap-2">
                  <Activity className="w-4 h-4 text-[var(--accent)]" />
                  Monthly Adjudicated Revenue Trend
                </h2>
                <p className="text-[12px] text-[var(--foreground-muted)] font-medium">
                  Insurance Remittance (ERA) vs. Patient Payments
                </p>
              </div>
              <Link href="/insights/revenue-analysis">
                <Button size="sm" variant="ghost">
                  Full Analytics →
                </Button>
              </Link>
            </div>

            <div className="h-64 w-full pt-2 min-h-[240px]">
              {isMounted ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={mockMonthlyRevenueData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.06)" vertical={false} />
                    <XAxis dataKey="month" stroke="#858d9d" fontSize={11} tickLine={false} />
                    <YAxis stroke="#858d9d" fontSize={11} tickLine={false} tickFormatter={(v) => `$${v / 1000}k`} />
                    <Tooltip
                      formatter={(value: number) => [`$${value.toLocaleString()}`, "Amount"]}
                      contentStyle={{ backgroundColor: "#ffffff", borderRadius: "16px", border: "1px solid rgba(0,0,0,0.08)" }}
                    />
                    <Legend iconType="circle" wrapperStyle={{ paddingTop: "8px", fontSize: "11px" }} />
                    <Bar dataKey="insurancePaid" name="Insurance Paid" stackId="a" fill="#0a0e15" radius={[0, 0, 0, 0]} />
                    <Bar dataKey="patientPaid" name="Patient Paid" stackId="a" fill="#858d9d" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="w-full h-full neu-pressed rounded-2xl animate-pulse" />
              )}
            </div>
          </div>

          {/* Payer Volume Mix Pie / Donut Chart */}
          <div className="neu p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-[15px] font-bold text-[var(--foreground)] flex items-center gap-2">
                  <PieIcon className="w-4 h-4 text-[var(--accent)]" />
                  Payer Patient Mix %
                </h2>
                <p className="text-[12px] text-[var(--foreground-muted)] font-medium">
                  Volume distribution by payer
                </p>
              </div>
            </div>

            <div className="h-52 w-full min-h-[200px]">
              {isMounted ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={45}
                      outerRadius={75}
                      paddingAngle={4}
                      dataKey="value"
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={pieColors[index % pieColors.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value: number) => [`${value}%`, "Patient Mix"]} />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="w-full h-full neu-pressed rounded-2xl animate-pulse" />
              )}
            </div>

            <div className="space-y-1.5 pt-1">
              {pieData.map((item, idx) => (
                <div key={item.name} className="flex items-center justify-between text-xs font-semibold">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: pieColors[idx] }} />
                    <span className="text-[var(--foreground)]">{item.name}</span>
                  </div>
                  <span className="tabular-nums text-[var(--foreground-muted)]">{item.value}% mix ({item.approval}% appr.)</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Action Item Queues Quick Nav Grid */}
        <motion.div variants={itemVariants} className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-[12px] font-bold uppercase tracking-wider text-[var(--foreground-faint)]">
              Core Module Quick Navigation & Queue Status
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Link href="/worklist/denials">
              <div className="neu p-4 rounded-2xl hover:border-black/20 transition-all cursor-pointer space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-sm text-[var(--foreground)]">Denial Management</span>
                  <StatusBadge tone="critical" label="3 Clusters" />
                </div>
                <p className="text-xs text-[var(--foreground-muted)] font-medium">
                  Grouped root cause clusters ($19,530 at risk)
                </p>
              </div>
            </Link>

            <Link href="/claims">
              <div className="neu p-4 rounded-2xl hover:border-black/20 transition-all cursor-pointer space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-sm text-[var(--foreground)]">Claim Lifecycle</span>
                  <StatusBadge tone="warning" label="1 Stuck Ack" />
                </div>
                <p className="text-xs text-[var(--foreground-muted)] font-medium">
                  999 functional ack monitoring active
                </p>
              </div>
            </Link>

            <Link href="/encounters">
              <div className="neu p-4 rounded-2xl hover:border-black/20 transition-all cursor-pointer space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-sm text-[var(--foreground)]">Encounters</span>
                  <StatusBadge tone="success" label="Reconciled" />
                </div>
                <p className="text-xs text-[var(--foreground-muted)] font-medium">
                  Signed note keystone financial summary
                </p>
              </div>
            </Link>

            <Link href="/patient-responsibility">
              <div className="neu p-4 rounded-2xl hover:border-black/20 transition-all cursor-pointer space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-sm text-[var(--foreground)]">Patient Responsibility</span>
                  <StatusBadge tone="neutral" label="Decoupled AR" />
                </div>
                <p className="text-xs text-[var(--foreground-muted)] font-medium">
                  Invoiceable vs Non-Invoiceable balances
                </p>
              </div>
            </Link>
          </div>
        </motion.div>
      </motion.div>
    </AppShell>
  );
}
