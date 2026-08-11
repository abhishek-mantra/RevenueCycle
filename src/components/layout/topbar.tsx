"use client";

import React, { useState, useRef, useEffect } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { useAppStore } from "@/store/useAppStore";
import { useRcmDataStore } from "@/store/useRcmDataStore";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Bell, X, FileText, User, ShieldAlert, ArrowRight } from "lucide-react";
import { clsx } from "clsx";

export const Topbar: React.FC = () => {
  const pathname = usePathname();
  const { sidebarCollapsed } = useAppStore();
  const { claims, patientArBalances, denialClusters } = useRcmDataStore();

  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const searchContainerRef = useRef<HTMLDivElement>(null);
  const notifContainerRef = useRef<HTMLDivElement>(null);

  // Close search/notifications on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target as Node)) {
        setIsSearchOpen(false);
      }
      if (notifContainerRef.current && !notifContainerRef.current.contains(e.target as Node)) {
        setShowNotifications(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Filter search results
  const matchingClaims = searchQuery.trim()
    ? claims.filter(
        (c) =>
          c.claimId.toLowerCase().includes(searchQuery.toLowerCase()) ||
          c.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          c.cptCode.toLowerCase().includes(searchQuery.toLowerCase())
      ).slice(0, 3)
    : [];

  const matchingPatients = searchQuery.trim()
    ? patientArBalances.filter(
        (p) =>
          p.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.patientId.toLowerCase().includes(searchQuery.toLowerCase())
      ).slice(0, 3)
    : [];

  const matchingDenials = searchQuery.trim()
    ? denialClusters.filter(
        (d) =>
          d.denialReason.toLowerCase().includes(searchQuery.toLowerCase()) ||
          d.payerName.toLowerCase().includes(searchQuery.toLowerCase())
      ).slice(0, 3)
    : [];

  const hasResults =
    matchingClaims.length > 0 || matchingPatients.length > 0 || matchingDenials.length > 0;

  const getBreadcrumb = () => {
    if (pathname.includes("/insights/overview")) return { group: "INSIGHTS & ANALYTICS", title: "Overview" };
    if (pathname.includes("/insights/revenue-analysis")) return { group: "INSIGHTS & ANALYTICS", title: "Revenue Analysis" };
    if (pathname.includes("/insights/payer-performance")) return { group: "INSIGHTS & ANALYTICS", title: "Payer Performance" };
    if (pathname.includes("/insights/ai-insights")) return { group: "INSIGHTS & ANALYTICS", title: "AI Assistant" };

    if (pathname.includes("/appointments")) return { group: "DAILY OPERATIONS", title: "Pre-Visit & Eligibility" };
    if (pathname.includes("/encounters")) return { group: "DAILY OPERATIONS", title: "Encounters" };
    if (pathname.includes("/claims")) return { group: "DAILY OPERATIONS", title: "Claim Status" };
    if (pathname.includes("/invoicing")) return { group: "DAILY OPERATIONS", title: "Invoicing & Billing" };
    if (pathname.includes("/patient-responsibility")) return { group: "DAILY OPERATIONS", title: "Patient AR & Balances" };
    if (pathname.includes("/patients")) return { group: "DAILY OPERATIONS", title: "Patient Profile" };
    if (pathname.includes("/onboarding")) return { group: "DAILY OPERATIONS", title: "Migration / Onboarding" };

    // Action Items sub-routes
    if (pathname.includes("/worklist/payment-posting")) return { group: "ACTION ITEMS", title: "Payment Posting" };
    if (pathname.includes("/worklist/import-errors")) return { group: "ACTION ITEMS", title: "Import Errors" };
    if (pathname.includes("/worklist/payer-mapping")) return { group: "ACTION ITEMS", title: "Payer Mappings" };
    if (pathname.includes("/worklist/submission-errors")) return { group: "ACTION ITEMS", title: "Submission Errors" };
    if (pathname.includes("/worklist/rejections")) return { group: "ACTION ITEMS", title: "Payer Rejections" };
    if (pathname.includes("/worklist/edi-era")) return { group: "ACTION ITEMS", title: "EDI / ERA Enrollments" };
    if (pathname.includes("/worklist")) return { group: "ACTION ITEMS", title: "Denial Management" };

    if (pathname.includes("/credentialing")) return { group: "CREDENTIALING", title: "Payer Credentialing" };

    // Automation sub-routes
    if (pathname.includes("/automation/prior-auth")) return { group: "AUTOMATION CONFIG", title: "Prior Authorizations" };
    if (pathname.includes("/automation/insurance-intake")) return { group: "AUTOMATION CONFIG", title: "Insurance Intake" };
    if (pathname.includes("/automation/patient-flow")) return { group: "AUTOMATION CONFIG", title: "Patient Flow" };
    if (pathname.includes("/automation/patient-statements")) return { group: "AUTOMATION CONFIG", title: "Patient Statements" };
    if (pathname.includes("/automation")) return { group: "AUTOMATION CONFIG", title: "Scrub Rules Engine" };

    if (pathname.includes("/settings")) return { group: "SYSTEM", title: "Settings & Profile" };
    return { group: "INSIGHTS & ANALYTICS", title: "Overview" };
  };

  const breadcrumb = getBreadcrumb();

  return (
    <header
      className={clsx(
        "glass-chrome fixed top-4 right-4 z-30 transition-all duration-300 px-5 py-3 flex items-center justify-between shadow-xl border border-white/70 select-none rounded-3xl h-14",
        sidebarCollapsed ? "left-28" : "left-72"
      )}
    >
      {/* Left: Clean Breadcrumb & Live Ops Indicator */}
      <div className="flex items-center gap-3 shrink-0">
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-bold uppercase tracking-wider text-[var(--foreground-faint)]">
            {breadcrumb.group}
          </span>
          <span className="text-[12px] text-[var(--foreground-muted)] font-medium">/</span>
          <h2 className="text-[14px] font-extrabold text-[var(--foreground)] tracking-tight">
            {breadcrumb.title}
          </h2>
        </div>

        <span className="hidden sm:flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[var(--status-success-bg)] text-[var(--status-success)] border border-[var(--status-success)]/20">
          <span className="w-1.5 h-1.5 rounded-full bg-[var(--status-success)] animate-pulse" />
          Live Ops
        </span>
      </div>

      {/* Center: Search Bar with Interactive Dropdown (8.6, 8.10) */}
      <div ref={searchContainerRef} className="hidden lg:block relative">
        <div className="flex items-center gap-2 neu-pressed px-4 py-1.5 rounded-full w-80 text-[13px] transition-all focus-within:ring-2 focus-within:ring-[var(--accent)]">
          <Search className="w-3.5 h-3.5 text-[var(--foreground-faint)] shrink-0" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setIsSearchOpen(true);
            }}
            onFocus={() => setIsSearchOpen(true)}
            placeholder="Search patient, claim ID, or CPT code..."
            aria-label="Search patient, claim ID, or CPT code"
            className="bg-transparent border-none outline-none text-[12px] text-[var(--foreground)] placeholder-[var(--foreground-faint)] w-full"
          />
          {searchQuery ? (
            <button
              onClick={() => setSearchQuery("")}
              aria-label="Clear search"
              className="text-[var(--foreground-faint)] hover:text-[var(--foreground)]"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          ) : (
            <kbd className="px-1.5 py-0.5 text-[10px] font-mono text-[var(--foreground-faint)] bg-white rounded-md border border-[var(--border)] shadow-xs">
              ⌘K
            </kbd>
          )}
        </div>

        {/* Search Results Dropdown Overlay */}
        <AnimatePresence>
          {isSearchOpen && searchQuery.trim().length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
              className="absolute top-12 left-0 right-0 glass-chrome bg-[var(--surface)]/95 backdrop-blur-xl border border-[var(--border)] rounded-2xl shadow-2xl overflow-hidden z-50 p-2 space-y-2 text-[12px]"
            >
              {hasResults ? (
                <div className="max-h-72 overflow-y-auto space-y-2 pr-1 custom-scrollbar">
                  {matchingClaims.length > 0 && (
                    <div>
                      <div className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-[var(--foreground-faint)] flex items-center gap-1">
                        <FileText className="w-3 h-3 text-[var(--accent)]" /> Claims
                      </div>
                      {matchingClaims.map((claim) => (
                        <Link
                          key={claim.id}
                          href={`/claims/${claim.claimId}`}
                          onClick={() => setIsSearchOpen(false)}
                          className="flex items-center justify-between px-2.5 py-1.5 rounded-xl hover:bg-[var(--accent-soft)] transition-colors group"
                        >
                          <div>
                            <div className="font-bold text-[var(--foreground)] group-hover:text-[var(--accent)]">
                              {claim.claimId} — {claim.patientName}
                            </div>
                            <div className="text-[10px] text-[var(--foreground-muted)]">
                              {claim.payerName} • CPT {claim.cptCode}
                            </div>
                          </div>
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[var(--surface-muted)] text-[var(--foreground-muted)]">
                            ${claim.billedAmount}
                          </span>
                        </Link>
                      ))}
                    </div>
                  )}

                  {matchingPatients.length > 0 && (
                    <div>
                      <div className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-[var(--foreground-faint)] flex items-center gap-1">
                        <User className="w-3 h-3 text-[var(--accent)]" /> Patients (AR)
                      </div>
                      {matchingPatients.map((pat) => (
                        <Link
                          key={pat.id}
                          href="/patient-responsibility"
                          onClick={() => setIsSearchOpen(false)}
                          className="flex items-center justify-between px-2.5 py-1.5 rounded-xl hover:bg-[var(--accent-soft)] transition-colors group"
                        >
                          <div>
                            <div className="font-bold text-[var(--foreground)] group-hover:text-[var(--accent)]">
                              {pat.patientName} ({pat.patientId})
                            </div>
                            <div className="text-[10px] text-[var(--foreground-muted)]">
                              {pat.primaryPayer}
                            </div>
                          </div>
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[var(--accent-soft)] text-[var(--accent)]">
                            ${pat.invoiceableBalance.toFixed(2)}
                          </span>
                        </Link>
                      ))}
                    </div>
                  )}

                  {matchingDenials.length > 0 && (
                    <div>
                      <div className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-[var(--foreground-faint)] flex items-center gap-1">
                        <ShieldAlert className="w-3 h-3 text-[var(--status-critical)]" /> Denials
                      </div>
                      {matchingDenials.map((den) => (
                        <Link
                          key={den.id}
                          href="/worklist/denials"
                          onClick={() => setIsSearchOpen(false)}
                          className="flex items-center justify-between px-2.5 py-1.5 rounded-xl hover:bg-[var(--status-critical-bg)] transition-colors group"
                        >
                          <div className="truncate pr-2">
                            <div className="font-bold text-[var(--foreground)] truncate group-hover:text-[var(--status-critical)]">
                              {den.denialReason}
                            </div>
                            <div className="text-[10px] text-[var(--foreground-muted)]">
                              {den.payerName} • {den.claimCount} claims
                            </div>
                          </div>
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[var(--status-critical-bg)] text-[var(--status-critical)] shrink-0">
                            ${den.totalAmountAtRisk}
                          </span>
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <div className="p-4 text-center text-[var(--foreground-muted)] text-[12px]">
                  No matching claims, patients, or denials found.
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Right: Notifications & User Profile (8.10) */}
      <div className="flex items-center gap-3 shrink-0">
        {/* Notifications Button & Dropdown */}
        <div ref={notifContainerRef} className="relative">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowNotifications((prev) => !prev)}
            aria-label="Notifications"
            className="relative p-2 rounded-full neu-soft hover:bg-[var(--surface-muted)] text-[var(--foreground-muted)] hover:text-[var(--foreground)] transition-colors cursor-pointer"
            title="Notifications"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-[var(--status-critical)]" />
          </motion.button>

          <AnimatePresence>
            {showNotifications && (
              <motion.div
                initial={{ opacity: 0, y: 8, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 8, scale: 0.95 }}
                className="absolute right-0 top-12 w-80 glass-chrome bg-[var(--surface)]/95 backdrop-blur-xl border border-[var(--border)] rounded-2xl shadow-2xl overflow-hidden z-50 p-3 space-y-3"
              >
                <div className="flex items-center justify-between border-b border-[var(--border)] pb-2">
                  <h3 className="text-[12px] font-extrabold text-[var(--foreground)]">
                    Notifications & Alerts
                  </h3>
                  <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-[var(--status-critical-bg)] text-[var(--status-critical)]">
                    3 New
                  </span>
                </div>

                <div className="space-y-2 text-[12px]">
                  <Link
                    href="/worklist/denials"
                    onClick={() => setShowNotifications(false)}
                    className="block p-2 rounded-xl bg-[var(--surface-muted)]/70 hover:bg-[var(--accent-soft)] transition-colors"
                  >
                    <div className="font-bold text-[var(--foreground)] flex items-center justify-between">
                      <span>Denial Batch Alert</span>
                      <span className="text-[10px] text-[var(--foreground-faint)]">10m ago</span>
                    </div>
                    <p className="text-[11px] text-[var(--foreground-muted)] mt-0.5">
                      BCBS Telehealth modifier missing across 14 claims ($2,450 at risk).
                    </p>
                  </Link>

                  <Link
                    href="/appointments"
                    onClick={() => setShowNotifications(false)}
                    className="block p-2 rounded-xl bg-[var(--surface-muted)]/70 hover:bg-[var(--accent-soft)] transition-colors"
                  >
                    <div className="font-bold text-[var(--foreground)] flex items-center justify-between">
                      <span>Pre-Visit Member ID Check</span>
                      <span className="text-[10px] text-[var(--foreground-faint)]">1h ago</span>
                    </div>
                    <p className="text-[11px] text-[var(--foreground-muted)] mt-0.5">
                      3 appointments scheduled today require Member ID verification.
                    </p>
                  </Link>

                  <Link
                    href="/invoicing"
                    onClick={() => setShowNotifications(false)}
                    className="block p-2 rounded-xl bg-[var(--surface-muted)]/70 hover:bg-[var(--accent-soft)] transition-colors"
                  >
                    <div className="font-bold text-[var(--foreground)] flex items-center justify-between">
                      <span>Invoice Statement Batch</span>
                      <span className="text-[10px] text-[var(--foreground-faint)]">3h ago</span>
                    </div>
                    <p className="text-[11px] text-[var(--foreground-muted)] mt-0.5">
                      Monthly patient statements ready for review and dispatch.
                    </p>
                  </Link>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* User Profile */}
        <div
          aria-label="User Profile — Alex River"
          className="flex items-center gap-2 pl-2 border-l border-[var(--border)]"
        >
          <div className="w-7 h-7 rounded-full bg-[var(--accent)] text-white flex items-center justify-center font-extrabold text-xs shadow-xs">
            AR
          </div>
          <div className="hidden xl:block text-left leading-none">
            <div className="text-[12px] font-bold text-[var(--foreground)]">Alex River</div>
            <div className="text-[10px] font-medium text-[var(--foreground-muted)]">Practice Admin</div>
          </div>
        </div>
      </div>
    </header>
  );
};
