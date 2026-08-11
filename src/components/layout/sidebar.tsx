"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAppStore } from "@/store/useAppStore";
import { motion, AnimatePresence } from "framer-motion";
import { clsx } from "clsx";
import {
  LayoutDashboard,
  TrendingUp,
  BarChart3,
  Sparkles,
  Calendar,
  FileCheck2,
  FileText,
  Receipt,
  UserCheck,
  Building2,
  Award,
  Sliders,
  Settings,
  Zap,
  ShieldAlert,
  ChevronDown,
  AlertTriangle,
  AlertCircle,
  FileCode,
  Radio,
  Layers,
} from "lucide-react";

interface NavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
  badge?: number | string;
  badgeColor?: string;
}

interface NavSection {
  title: string;
  items: NavItem[];
}

export const Sidebar: React.FC = () => {
  const pathname = usePathname();
  const { sidebarCollapsed, toggleSidebar } = useAppStore();

  const sections: NavSection[] = [
    {
      title: "INSIGHTS & ANALYTICS",
      items: [
        { label: "Overview", href: "/insights/overview", icon: <LayoutDashboard className="w-4 h-4" /> },
        { label: "Revenue Analysis", href: "/insights/revenue-analysis", icon: <TrendingUp className="w-4 h-4" /> },
        { label: "Payer Performance", href: "/insights/payer-performance", icon: <BarChart3 className="w-4 h-4" /> },
        { label: "AI Insights", href: "/insights/ai-insights", icon: <Sparkles className="w-4 h-4" />, badge: "AI" },
      ],
    },
    {
      title: "DAILY OPERATIONS",
      items: [
        { label: "Pre-Visit & Eligibility", href: "/appointments", icon: <Calendar className="w-4 h-4" />, badge: 3 },
        { label: "Encounters", href: "/encounters", icon: <FileCheck2 className="w-4 h-4" /> },
        { label: "Claim Status", href: "/claims", icon: <FileText className="w-4 h-4" /> },
        { label: "Invoicing & Billing", href: "/invoicing", icon: <Receipt className="w-4 h-4" /> },
        { label: "Patient AR & Balances", href: "/patient-responsibility", icon: <UserCheck className="w-4 h-4" /> },
        { label: "Migration / Onboarding", href: "/onboarding", icon: <Building2 className="w-4 h-4" /> },
      ],
    },
    {
      title: "ACTION ITEMS",
      items: [
        { label: "Denial Management", href: "/worklist/denials", icon: <AlertTriangle className="w-4 h-4" />, badge: 12 },
        { label: "Import Errors", href: "/worklist/import-errors", icon: <AlertCircle className="w-4 h-4" />, badge: 2 },
        { label: "Payer Mappings", href: "/worklist/payer-mapping", icon: <Layers className="w-4 h-4" />, badge: 4 },
        { label: "Submission Errors", href: "/worklist/submission-errors", icon: <FileCode className="w-4 h-4" />, badge: 4 },
        { label: "Payer Rejections", href: "/worklist/rejections", icon: <ShieldAlert className="w-4 h-4" />, badge: 4 },
        { label: "EDI / ERA Enrollments", href: "/worklist/edi-era", icon: <Radio className="w-4 h-4" />, badge: 4 },
      ],
    },
    {
      title: "CREDENTIALING",
      items: [
        { label: "Payer Credentialing", href: "/credentialing", icon: <Award className="w-4 h-4" /> },
      ],
    },
    {
      title: "AUTOMATION CONFIG",
      items: [
        { label: "Automation Rules", href: "/automation", icon: <Sliders className="w-4 h-4" /> },
      ],
    },
    {
      title: "SYSTEM",
      items: [
        { label: "Settings & Profile", href: "/settings", icon: <Settings className="w-4 h-4" /> },
      ],
    },
  ];

  // Initialize expanded sections: only expand the section containing active route on load
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>(() => {
    const initial: Record<string, boolean> = {};
    sections.forEach((sec) => {
      const hasActive = sec.items.some((item) => pathname.startsWith(item.href));
      initial[sec.title] = hasActive;
    });
    // Fallback: if no active section found, default INSIGHTS & ANALYTICS or DAILY OPERATIONS open
    if (!Object.values(initial).some(Boolean)) {
      initial["DAILY OPERATIONS"] = true;
    }
    return initial;
  });

  const toggleSection = (title: string) => {
    setExpandedSections((prev) => ({
      ...prev,
      [title]: !prev[title],
    }));
  };

  return (
    <aside
      aria-label="Main Navigation Sidebar"
      className={clsx(
        "glass-chrome fixed top-4 left-4 bottom-4 z-40 transition-all duration-300 flex flex-col justify-between shadow-xl border border-white/70 select-none rounded-3xl",
        sidebarCollapsed ? "w-20 p-3" : "w-64 p-4"
      )}
    >
      <div className="flex flex-col h-full overflow-hidden">
        {/* Brand Header */}
        {sidebarCollapsed ? (
          <div className="flex justify-center pb-3 mb-3 border-b border-[var(--border)] shrink-0 w-full pt-1">
            <button
              onClick={toggleSidebar}
              aria-label="Expand sidebar"
              className="p-1 rounded-2xl hover:bg-[var(--accent-soft)] transition-all cursor-pointer"
              title="Expand Sidebar"
            >
              <img
                src="/logo-icon.png"
                alt="MantraCare Logo Icon"
                className="w-9 h-9 object-contain hover:scale-105 transition-transform"
              />
            </button>
          </div>
        ) : (
          <div className="flex items-center justify-between pb-3.5 mb-3 border-b border-[var(--border)] shrink-0 pt-1 px-1 overflow-hidden">
            <button
              onClick={toggleSidebar}
              aria-label="Collapse sidebar"
              className="p-1 rounded-2xl hover:bg-[var(--accent-soft)] transition-all cursor-pointer text-left w-full flex items-center"
              title="Click to collapse sidebar"
            >
              <img
                src="/logo-full.png"
                alt="MantraCare RCM Logo"
                className="h-14 w-auto max-w-[220px] object-contain object-left scale-[1.55] origin-left my-1 ml-0.5 hover:opacity-90 transition-all"
              />
            </button>
          </div>
        )}

        {/* Navigation Sections */}
        <div className="flex-1 overflow-y-auto space-y-3 pr-1 custom-scrollbar">
          {sections.map((section) => {
            const isExpanded = !!expandedSections[section.title];
            const hasActiveChild = section.items.some((item) => pathname.startsWith(item.href));

            return (
              <div key={section.title} className="space-y-1">
                {!sidebarCollapsed ? (
                  <button
                    onClick={() => toggleSection(section.title)}
                    onMouseEnter={() => {
                      if (!expandedSections[section.title]) {
                        setExpandedSections((prev) => ({ ...prev, [section.title]: true }));
                      }
                    }}
                    aria-label={`Toggle ${section.title} section`}
                    aria-expanded={isExpanded}
                    className="w-full px-2 py-2 flex items-center justify-between text-[12px] font-extrabold uppercase tracking-wider text-[var(--foreground-muted)] hover:text-[var(--accent)] hover:bg-[var(--accent-soft)]/50 transition-all rounded-xl group cursor-pointer outline-none focus:outline-none focus-visible:outline-none focus:ring-0 focus-visible:ring-0 border-none"
                  >
                    <span className={clsx((hasActiveChild || isExpanded) ? "text-[var(--accent)] font-black" : "text-[var(--foreground-muted)]")}>
                      {section.title}
                    </span>
                  </button>
                ) : null}

                <AnimatePresence initial={false}>
                  {(isExpanded || sidebarCollapsed) && (
                    <motion.div
                      initial={sidebarCollapsed ? false : { height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={sidebarCollapsed ? undefined : { height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="space-y-1 overflow-hidden"
                    >
                      {section.items.map((item) => {
                        const isActive = pathname === item.href;

                        return (
                          <Link
                            key={item.href}
                            href={item.href}
                            aria-label={item.label}
                            className={clsx(
                              "relative flex items-center gap-3 px-3 py-2 rounded-2xl text-[13px] font-medium transition-all group",
                              isActive
                                ? "text-white font-semibold"
                                : "text-[var(--foreground-muted)] hover:text-[var(--foreground)] hover:bg-[var(--accent-soft)]"
                            )}
                            title={sidebarCollapsed ? item.label : undefined}
                          >
                            {isActive && (
                              <motion.div
                                layoutId="activeNavPill"
                                className="absolute inset-0 bg-[var(--accent)] rounded-2xl z-[-1] shadow-md"
                                transition={{ type: "spring", stiffness: 400, damping: 30 }}
                              />
                            )}

                            <div
                              className={clsx(
                                "shrink-0 transition-transform group-hover:scale-110",
                                isActive ? "text-white" : "text-[var(--foreground-muted)]"
                              )}
                            >
                              {item.icon}
                            </div>

                            {!sidebarCollapsed && (
                              <div className="flex items-center justify-between w-full truncate">
                                <span className="truncate">{item.label}</span>
                                {item.badge !== undefined && (
                                  <span
                                    className={clsx(
                                      "px-2 py-0.5 text-[10px] font-bold rounded-full tabular-nums ml-2 shrink-0 border border-current/10",
                                      isActive
                                        ? "bg-white/20 text-white"
                                        : item.badgeColor || "bg-[var(--accent-soft)] text-[var(--accent)]"
                                    )}
                                  >
                                    {item.badge}
                                  </span>
                                )}
                              </div>
                            )}
                          </Link>
                        );
                      })}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>

        {/* Bottom Card / Automation Widget */}
        {!sidebarCollapsed && (
          <div className="mt-3 pt-3 border-t border-[var(--border)] shrink-0">
            <div className="neu p-3.5 rounded-2xl bg-gradient-to-br from-[var(--canvas)] to-[var(--surface-muted)] space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--accent)] flex items-center gap-1">
                  <Zap className="w-3.5 h-3.5" /> Silent Partner Active
                </span>
                <span className="w-2 h-2 rounded-full bg-[var(--status-success)] animate-pulse" />
              </div>
              <p className="text-[11px] text-[var(--foreground-muted)] font-semibold leading-tight">
                94.2% Touchless Claim Automation in effect for practice.
              </p>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
};
