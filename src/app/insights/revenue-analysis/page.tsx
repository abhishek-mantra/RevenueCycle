"use client";

import React, { useState, useEffect } from "react";
import { AppShell } from "@/components/layout/app-shell";
import { KpiCard } from "@/components/ui/kpi-card";
import { mockMonthlyRevenueData } from "@/data/mockAnalytics";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import {
  TrendingUp,
  DollarSign,
  Layers,
  Sparkles,
} from "lucide-react";

export default function RevenueAnalysisPage() {
  const [dateAxis, setDateAxis] = useState<"DatePosted" | "DateOfService" | "CheckDate">("DatePosted");
  const [sliceSegment, setSliceSegment] = useState<"Payer" | "Provider" | "CPT" | "Facility">("Payer");
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const totalInsurance = mockMonthlyRevenueData.reduce((acc, m) => acc + m.insurancePaid, 0);
  const totalPatient = mockMonthlyRevenueData.reduce((acc, m) => acc + m.patientPaid, 0);
  const totalGross = totalInsurance + totalPatient;

  return (
    <AppShell>
      <div className="space-y-6 select-none">
        {/* Header (8.18 - Simplified Title) */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-[22px] font-extrabold tracking-tight text-[var(--foreground)]">
                Revenue Analysis
              </h1>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] uppercase font-bold bg-[var(--accent-soft)] text-[var(--accent)] border border-black/5">
                Financial Analytics
              </span>
            </div>
            <p className="text-[13px] text-[var(--foreground-muted)] font-medium mt-1">
              Monthly revenue stacked by Insurance Paid vs. Patient Paid with multi-dimensional segment slicing.
            </p>
          </div>
        </div>

        {/* Dynamic Financial KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <KpiCard
            label="Total Gross Collections"
            value={`$${(totalGross / 1000).toFixed(1)}k`}
            delta="+4.2% MoM"
            deltaType="increase"
            subtitle="Adjudicated 6-month sum"
            icon={<DollarSign className="w-5 h-5" />}
          />
          <KpiCard
            label="Insurance ERA Posted"
            value={`$${(totalInsurance / 1000).toFixed(1)}k`}
            delta="71.1% of Gross"
            deltaType="increase"
            subtitle="Auto-posted 835"
            icon={<TrendingUp className="w-5 h-5" />}
          />
          <KpiCard
            label="Patient Direct Payments"
            value={`$${(totalPatient / 1000).toFixed(1)}k`}
            delta="28.9% of Gross"
            deltaType="neutral"
            subtitle="Co-pay & Statements"
            icon={<Sparkles className="w-5 h-5" />}
          />
          <KpiCard
            label="Net Collection Rate"
            value="98.4%"
            delta="+2.1% Target"
            deltaType="increase"
            subtitle="Top tier benchmark"
            icon={<Layers className="w-5 h-5" />}
          />
        </div>

        {/* Date Basis & Segment Controls */}
        <div className="neu p-5 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="text-[12px] font-bold text-[var(--foreground-muted)]">Date Basis:</span>
            <div className="neu-pressed p-1 rounded-full flex items-center gap-1 text-[12px]">
              {(["DatePosted", "DateOfService", "CheckDate"] as const).map((axis) => (
                <button
                  key={axis}
                  onClick={() => setDateAxis(axis)}
                  className={`px-3.5 py-1 rounded-full font-bold transition-all cursor-pointer ${
                    dateAxis === axis ? "bg-[var(--accent)] text-white shadow-xs" : "text-[var(--foreground-muted)]"
                  }`}
                >
                  {axis === "DatePosted" ? "Date Posted" : axis === "DateOfService" ? "Date of Service" : "Check Date"}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-[12px] font-bold text-[var(--foreground-muted)]">Slice By:</span>
            <div className="neu-pressed p-1 rounded-full flex items-center gap-1 text-[12px]">
              {(["Payer", "Provider", "CPT", "Facility"] as const).map((seg) => (
                <button
                  key={seg}
                  onClick={() => setSliceSegment(seg)}
                  className={`px-3.5 py-1 rounded-full font-bold transition-all cursor-pointer ${
                    sliceSegment === seg ? "bg-[var(--accent)] text-white shadow-xs" : "text-[var(--foreground-muted)]"
                  }`}
                >
                  {seg}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Stacked Recharts Visual Graph */}
        <div className="neu p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-[15px] font-bold text-[var(--foreground)]">
              Monthly Revenue Performance ({dateAxis} Basis)
            </h2>
            <span className="text-[12px] text-[var(--foreground-muted)] font-medium">
              Insurance Paid vs. Patient Paid
            </span>
          </div>

          <div className="h-80 w-full pt-4 min-h-[320px]">
            {isMounted ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={mockMonthlyRevenueData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.06)" vertical={false} />
                  <XAxis dataKey="month" stroke="#858d9d" fontSize={12} tickLine={false} />
                  <YAxis stroke="#858d9d" fontSize={12} tickLine={false} tickFormatter={(v) => `$${v / 1000}k`} />
                  <Tooltip
                    formatter={(value: number) => [`$${value.toLocaleString()}`, "Amount"]}
                    contentStyle={{ backgroundColor: "#ffffff", borderRadius: "16px", border: "1px solid rgba(0,0,0,0.08)", boxShadow: "0 10px 25px rgba(0,0,0,0.1)" }}
                  />
                  <Legend iconType="circle" wrapperStyle={{ paddingTop: "12px", fontSize: "12px" }} />
                  <Bar dataKey="insurancePaid" name="Insurance Paid" stackId="a" fill="#1f2e4a" radius={[0, 0, 0, 0]} />
                  <Bar dataKey="patientPaid" name="Patient Paid" stackId="a" fill="#868e96" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="w-full h-full neu-pressed rounded-2xl animate-pulse" />
            )}
          </div>
        </div>
      </div>
    </AppShell>
  );
}
