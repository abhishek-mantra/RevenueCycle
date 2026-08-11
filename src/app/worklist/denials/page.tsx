"use client";

import React, { useState } from "react";
import Link from "next/link";
import { AppShell } from "@/components/layout/app-shell";
import { KpiCard } from "@/components/ui/kpi-card";
import { StatusBadge } from "@/components/ui/status-badge";
import { Button } from "@/components/ui/button";
import { GlassModal } from "@/components/ui/glass-modal";
import { BulkActionBar } from "@/components/ui/bulk-action-bar";
import { useRcmDataStore } from "@/store/useRcmDataStore";
import { formatDate } from "@/lib/formatDate";
import { DenialClusterGroup } from "@/schema/denialSchema";
import { motion, AnimatePresence } from "framer-motion";
import {
  AlertTriangle,
  Clock,
  Sparkles,
  ChevronDown,
  ChevronUp,
  Search,
  CheckSquare,
  Square,
  Send,
  Layers,
  CheckCircle2,
  ExternalLink,
} from "lucide-react";

export default function DenialsPage({ embedInShell }: any) {
  const { denialClusters, resolveDenialCluster, resubmitClaims } = useRcmDataStore();
  const [expandedClusterId, setExpandedClusterId] = useState<string | null>(
    denialClusters[0]?.id || "cluster-101"
  );
  const [selectedClaimIds, setSelectedClaimIds] = useState<string[]>([]);
  const [activeAppealCluster, setActiveAppealCluster] = useState<DenialClusterGroup | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPayerFilter, setSelectedPayerFilter] = useState<string>("All");
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const toggleCluster = (id: string) => {
    setExpandedClusterId((prev) => (prev === id ? null : id));
  };

  const handleSelectClaim = (claimId: string) => {
    setSelectedClaimIds((prev) =>
      prev.includes(claimId) ? prev.filter((id) => id !== claimId) : [...prev, claimId]
    );
  };

  const handleSelectClusterClaims = (cluster: DenialClusterGroup) => {
    const clusterClaimIds = cluster.claims.map((c) => c.id);
    const allSelected = clusterClaimIds.every((id) => selectedClaimIds.includes(id));

    if (allSelected) {
      setSelectedClaimIds((prev) => prev.filter((id) => !clusterClaimIds.includes(id)));
    } else {
      setSelectedClaimIds((prev) => Array.from(new Set([...prev, ...clusterClaimIds])));
    }
  };

  const handleBulkResubmit = () => {
    resubmitClaims(selectedClaimIds);
    showToast(`Bulk resubmitted ${selectedClaimIds.length} claims! Status updated to In Adjudication.`);
    setSelectedClaimIds([]);
  };

  const filteredClusters = denialClusters.filter((cluster) => {
    const matchesSearch =
      cluster.denialReason.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cluster.payerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cluster.carc.code.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesPayer = selectedPayerFilter === "All" || cluster.payerName === selectedPayerFilter;
    return matchesSearch && matchesPayer;
  });

  const totalAtRisk = denialClusters.reduce((acc, c) => acc + c.totalAmountAtRisk, 0);
  const totalClaims = denialClusters.reduce((acc, c) => acc + c.claimCount, 0);

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    show: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 350, damping: 25 } },
  };

  const content = (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="space-y-6 select-none"
    >
      {/* Toast Notification Banner */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 px-4 py-3 rounded-2xl bg-[var(--accent)] text-white font-bold text-xs shadow-2xl flex items-center gap-2 animate-bounce">
          <CheckCircle2 className="w-4 h-4" /> {toastMessage}
        </div>
      )}

      {/* Page Header (8.18 - Simplified Title) */}
      <motion.div variants={itemVariants} className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-[22px] font-extrabold tracking-tight text-[var(--foreground)]">
              Action Items
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] uppercase font-bold bg-[var(--status-critical-bg)] text-[var(--status-critical)] border border-[var(--status-critical)]/20">
              Exceptions Queue
            </span>
          </div>
          <p className="text-[13px] text-[var(--foreground-muted)] font-medium mt-1">
            Grouped by Payer + Denial Reason. Fix root causes in batches to resolve multiple claims simultaneously.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setActiveAppealCluster(denialClusters[0])}
          >
            <Sparkles className="w-4 h-4 text-[var(--accent)]" />
            Batch AI Appeal Generator
          </Button>
        </div>
      </motion.div>

      {/* Top Summary KPI Cards */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <KpiCard
          label="Total Revenue at Risk"
          value={`$${totalAtRisk.toLocaleString("en-US", { minimumFractionDigits: 2 })}`}
          delta="+4.2%"
          deltaType="decrease"
          subtitle={`${totalClaims} total claims in queue`}
          icon={<AlertTriangle className="w-5 h-5" />}
        />
        <KpiCard
          label="Avg Recoverability Score"
          value="86%"
          delta="+3.1%"
          deltaType="increase"
          subtitle="Based on clinical evidence match"
          icon={<Sparkles className="w-5 h-5" />}
        />
        <KpiCard
          label="Timely Filing Critical"
          value="3 Claims"
          delta="< 10 days left"
          deltaType="decrease"
          subtitle="Automatic worklist escalation"
          icon={<Clock className="w-5 h-5" />}
        />
        <KpiCard
          label="Root Cause Clusters"
          value={`${denialClusters.length} Groups`}
          delta="100% Grouped"
          deltaType="neutral"
          subtitle="No isolated flat denials"
          icon={<Layers className="w-5 h-5" />}
        />
      </motion.div>

      {/* Backlog Trend Bar & Filter Strip */}
      <motion.div variants={itemVariants} className="neu p-5 space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[var(--border)] pb-4">
          <div>
            <h2 className="text-[14px] font-bold text-[var(--foreground)]">
              Denial Backlog & Adjudication Trend
            </h2>
            <p className="text-[12px] text-[var(--foreground-muted)] font-medium">
              Track whether the root-cause denial backlog is shrinking or expanding over time.
            </p>
          </div>

          <div className="flex items-center gap-4 text-xs font-semibold">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-[var(--status-critical)]" />
              <span>Denied: $5.3k</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-[var(--status-warning)]" />
              <span>Resubmitted: $14.2k</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-[var(--status-success)]" />
              <span>Approved: $112.4k</span>
            </div>
          </div>
        </div>

        {/* Search & Payer Filters */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 absolute left-3.5 top-3 text-[var(--foreground-faint)]" />
            <input
              type="text"
              placeholder="Filter by payer, CARC code, or reason..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              aria-label="Filter denials"
              className="neu-pressed pl-10 pr-4 py-2 text-[13px] text-[var(--foreground)] placeholder-[var(--foreground-faint)] w-full outline-none focus:ring-2 focus:ring-[var(--accent)] transition-all rounded-full"
            />
          </div>

          <div className="flex items-center gap-2 w-full md:w-auto">
            <span className="text-[12px] text-[var(--foreground-muted)] font-semibold">Payer:</span>
            <div className="neu-pressed p-1 rounded-full flex items-center gap-1 text-[12px]">
              {["All", "Blue Cross Blue Shield", "Aetna Behavioral Health", "United Healthcare"].map(
                (payer) => (
                  <button
                    key={payer}
                    onClick={() => setSelectedPayerFilter(payer)}
                    className={`px-3.5 py-1 rounded-full transition-all cursor-pointer font-bold ${
                      selectedPayerFilter === payer
                        ? "bg-[var(--accent)] text-white shadow-xs"
                        : "text-[var(--foreground-muted)] hover:text-[var(--foreground)]"
                    }`}
                  >
                    {payer === "Blue Cross Blue Shield" ? "BCBS" : payer === "Aetna Behavioral Health" ? "Aetna" : payer === "United Healthcare" ? "UHC" : "All"}
                  </button>
                )
              )}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Denial Clusters List (8.16 Custom Empty State support) */}
      <motion.div variants={itemVariants} className="space-y-4">
        <div className="flex items-center justify-between px-1">
          <h3 className="text-[12px] font-bold uppercase tracking-wider text-[var(--foreground-faint)]">
            Root-Cause Denial Clusters ({filteredClusters.length})
          </h3>
          <span className="text-[12px] text-[var(--foreground-muted)] font-medium">
            Expand cluster to review claims or trigger AI fix
          </span>
        </div>

        {filteredClusters.length === 0 ? (
          <div className="neu p-12 text-center space-y-3 bg-[var(--surface)] border border-[var(--border)] rounded-2xl">
            <div className="w-12 h-12 rounded-full bg-[var(--status-success-bg)] text-[var(--status-success)] flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h3 className="text-[16px] font-extrabold text-[var(--foreground)]">All Denials Resolved — Nice Work!</h3>
            <p className="text-[12px] text-[var(--foreground-muted)] font-medium max-w-sm mx-auto">
              There are no active denial clusters requiring manual attention in your queue right now.
            </p>
          </div>
        ) : (
          filteredClusters.map((cluster) => {
            const isExpanded = expandedClusterId === cluster.id;
            const clusterClaimIds = cluster.claims.map((c) => c.id);
            const isClusterSelected = clusterClaimIds.every((id) => selectedClaimIds.includes(id));
            const isClusterPartiallySelected =
              clusterClaimIds.some((id) => selectedClaimIds.includes(id)) && !isClusterSelected;

            return (
              <motion.div
                key={cluster.id}
                layout
                transition={{ type: "spring", stiffness: 350, damping: 30 }}
                className="neu overflow-hidden transition-all border border-white/60 hover:border-black/10"
              >
                {/* Cluster Header Bar */}
                <div
                  onClick={() => toggleCluster(cluster.id)}
                  className="p-5.5 flex flex-col lg:flex-row lg:items-center justify-between gap-4 cursor-pointer hover:bg-[var(--surface-muted)]/60 transition-colors"
                >
                  <div className="flex items-start gap-4">
                    {/* Multi-select Cluster Checkbox */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSelectClusterClaims(cluster);
                      }}
                      aria-label="Select all claims in cluster"
                      className="mt-1 text-[var(--accent)] hover:scale-110 transition-transform cursor-pointer"
                      title="Select all claims in cluster"
                    >
                      {isClusterSelected ? (
                        <CheckSquare className="w-5 h-5" />
                      ) : isClusterPartiallySelected ? (
                        <div className="w-5 h-5 rounded-md neu-pressed flex items-center justify-center">
                          <span className="w-2.5 h-2.5 bg-[var(--accent)] rounded-xs" />
                        </div>
                      ) : (
                        <Square className="w-5 h-5 text-[var(--foreground-faint)]" />
                      )}
                    </button>

                    <div className="space-y-1.5">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="px-3 py-0.5 rounded-full text-[11px] font-bold bg-[var(--accent-soft)] text-[var(--accent)] border border-black/5">
                          {cluster.payerName}
                        </span>
                        {cluster.highestPriority === "Critical" && (
                          <StatusBadge tone="critical" label="Critical Priority" />
                        )}
                        <span className="text-[11px] font-mono font-bold px-2.5 py-0.5 rounded-full bg-[var(--surface-muted)] text-[var(--foreground-muted)] border border-[var(--border)]">
                          {cluster.carc.code}
                        </span>
                        {cluster.rarcs.map((r) => (
                          <span
                            key={r.code}
                            className="text-[11px] font-mono px-2.5 py-0.5 rounded-full bg-[var(--surface-muted)] text-[var(--foreground-faint)] border border-[var(--border)]"
                          >
                            {r.code}
                          </span>
                        ))}
                      </div>

                      <h3 className="text-[16px] font-bold tracking-tight text-[var(--foreground)]">
                        {cluster.denialReason}
                      </h3>

                      <p className="text-[12px] text-[var(--foreground-muted)] font-medium max-w-3xl">
                        <strong className="text-[var(--foreground)]">CARC Details:</strong> {cluster.carc.description}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-6 self-end lg:self-center">
                    <div className="text-right">
                      <div className="text-[18px] font-extrabold text-[var(--foreground)] tabular-nums">
                        ${cluster.totalAmountAtRisk.toFixed(2)}
                      </div>
                      <div className="text-[12px] font-semibold text-[var(--foreground-muted)]">
                        {cluster.claimCount} Claims at Risk
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={(e) => {
                          e.stopPropagation();
                          setActiveAppealCluster(cluster);
                        }}
                      >
                        <Sparkles className="w-3.5 h-3.5 text-[var(--accent)]" />
                        AI Draft Fix
                      </Button>

                      <div className="p-1.5 rounded-full neu-soft text-[var(--foreground-muted)] hover:text-[var(--foreground)]">
                        {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Suggested Fix Action Strip */}
                <div className="px-5.5 py-3 bg-[var(--accent-soft)]/40 border-t border-b border-[var(--border)] flex items-center justify-between text-[12px]">
                  <div className="flex items-center gap-2 text-[var(--foreground-muted)] font-medium">
                    <span className="font-bold text-[var(--foreground)] flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-[var(--accent)]" /> Suggested Root-Cause Fix:
                    </span>
                    <span>{cluster.suggestedFixSummary}</span>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSelectClusterClaims(cluster);
                    }}
                    className="font-bold text-[var(--accent)] hover:underline cursor-pointer"
                  >
                    Select All {cluster.claimCount} Claims →
                  </button>
                </div>

                {/* Expandable Claims Table */}
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                      className="overflow-hidden bg-[var(--surface)]"
                    >
                      <div className="p-4 overflow-x-auto">
                        <table className="w-full text-left text-[13px]">
                          <thead>
                            <tr className="border-b border-[var(--border)] text-[10px] uppercase font-bold text-[var(--foreground-faint)] tracking-wider">
                              <th className="p-3 w-8"></th>
                              <th className="p-3">Claim ID</th>
                              <th className="p-3">Patient Name</th>
                              <th className="p-3">Rendering Provider</th>
                              <th className="p-3">DOS</th>
                              <th className="p-3">CPT & Service</th>
                              <th className="p-3 text-right">Amount</th>
                              <th className="p-3 text-center">Filing Deadline</th>
                              <th className="p-3 text-right">Actions</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-[var(--border)]">
                            {cluster.claims.map((claim) => {
                              const isChecked = selectedClaimIds.includes(claim.id);
                              return (
                                <tr
                                  key={claim.id}
                                  className={`transition-colors hover:bg-[var(--surface-muted)] ${
                                    isChecked ? "bg-[var(--accent-soft)]/50" : ""
                                  }`}
                                >
                                  <td className="p-3">
                                    <input
                                      type="checkbox"
                                      checked={isChecked}
                                      onChange={() => handleSelectClaim(claim.id)}
                                      aria-label={`Select claim ${claim.claimId}`}
                                      className="neu-pressed w-4 h-4 accent-[var(--accent)] rounded cursor-pointer"
                                    />
                                  </td>
                                  <td className="p-3 font-mono font-bold text-xs text-[var(--foreground)]">
                                    {/* 8.5 - Real Link navigation instead of alert */}
                                    <Link
                                      href={`/claims/${claim.claimId}`}
                                      className="text-[var(--accent)] hover:underline flex items-center gap-1 group"
                                    >
                                      <span>{claim.claimId}</span>
                                      <ExternalLink className="w-3 h-3 opacity-70 group-hover:opacity-100" />
                                    </Link>
                                  </td>
                                  <td className="p-3 font-semibold text-[var(--foreground)]">
                                    <Link href={`/claims/${claim.claimId}`} className="hover:text-[var(--accent)] transition-colors">
                                      {claim.patientName}
                                    </Link>
                                  </td>
                                  <td className="p-3 text-[var(--foreground-muted)] font-medium">
                                    {claim.providerName}
                                  </td>
                                  <td className="p-3 tabular-nums text-xs text-[var(--foreground-muted)]">
                                    {formatDate(claim.dos)}
                                  </td>
                                  <td className="p-3 text-xs text-[var(--foreground-muted)] font-medium">
                                    {claim.cptCode}
                                  </td>
                                  <td className="p-3 text-right font-bold tabular-nums text-[var(--foreground)]">
                                    ${claim.amount.toFixed(2)}
                                  </td>
                                  <td className="p-3 text-center">
                                    <span
                                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold tabular-nums ${
                                        claim.timelyDaysRemaining <= 10
                                          ? "bg-[var(--status-critical-bg)] text-[var(--status-critical)] border border-[var(--status-critical)]/20"
                                          : "bg-[var(--surface-muted)] text-[var(--foreground-muted)] border border-[var(--border)]"
                                      }`}
                                    >
                                      {claim.timelyDaysRemaining}d remaining ({formatDate(claim.timelyFilingDeadline)})
                                    </span>
                                  </td>
                                  <td className="p-3 text-right">
                                    {/* 8.5 - Link directly to real claim detail view */}
                                    <Link href={`/claims/${claim.claimId}`}>
                                      <Button size="sm" variant="ghost">
                                        View & Fix
                                      </Button>
                                    </Link>
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          }))}
        </motion.div>

        {/* Spring-In Bulk Action Bar */}
        <BulkActionBar
          selectedCount={selectedClaimIds.length}
          onClearSelection={() => setSelectedClaimIds([])}
          onResubmit={handleBulkResubmit}
          onSendStatement={() => showToast(`Batch appealing ${selectedClaimIds.length} claims`)}
        />

        {/* Human-in-the-Loop AI Draft Appeal Modal */}
        <GlassModal
          isOpen={!!activeAppealCluster}
          onClose={() => setActiveAppealCluster(null)}
          title={`AI-Drafted Batch Appeal — ${activeAppealCluster?.payerName}`}
          description={`CARC ${activeAppealCluster?.carc.code}: ${activeAppealCluster?.denialReason}`}
          maxWidth="max-w-2xl"
        >
          {activeAppealCluster && (
            <div className="space-y-4">
              <div className="p-4 neu-pressed rounded-2xl space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-[var(--foreground-muted)] font-medium">Batch Scope:</span>
                  <span className="font-bold text-[var(--foreground)]">
                    {activeAppealCluster.claimCount} Claims (${activeAppealCluster.totalAmountAtRisk.toFixed(2)})
                  </span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-[var(--foreground-muted)] font-medium">Extracted Clinical Evidence:</span>
                  <span className="font-bold text-[var(--status-success)]">
                    Mantra EHR Signed Note Telehealth Verification Match
                  </span>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[12px] font-bold text-[var(--foreground)]">
                  Generated Appeal Letter (Editable):
                </label>
                <textarea
                  rows={6}
                  defaultValue={activeAppealCluster.appealDraftTemplate}
                  className="neu-pressed w-full p-4 text-[13px] font-mono text-[var(--foreground)] outline-none focus:ring-2 focus:ring-[var(--accent)] rounded-2xl"
                />
              </div>

              <div className="flex items-center justify-between pt-2">
                <span className="text-[11px] text-[var(--foreground-muted)] font-medium flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[var(--status-warning)]" />
                  Human-in-the-loop: review and confirm before submission.
                </span>

                <div className="flex items-center gap-2">
                  <Button variant="secondary" size="sm" onClick={() => setActiveAppealCluster(null)}>
                    Cancel
                  </Button>
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => {
                      resolveDenialCluster(activeAppealCluster.id);
                      showToast(`Batch appeal for ${activeAppealCluster.claimCount} claims submitted & cluster resolved!`);
                      setActiveAppealCluster(null);
                    }}
                  >
                    <Send className="w-3.5 h-3.5" />
                    Approve & Resubmit Batch
                  </Button>
                </div>
              </div>
            </div>
          )}
        </GlassModal>
      </motion.div>
  );

  return embedInShell ? content : <AppShell>{content}</AppShell>;
}
