"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAppStore } from "@/store/useAppStore";
import { motion } from "framer-motion";
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
  AlertOctagon,
  FileX2,
  Send,
  XCircle,
  AlertCircle,
  Radio,
  Award,
  Sliders,
  Mail,
  Workflow,
  Settings,
  ChevronLeft,
  ChevronRight,
  Activity,
  Zap,
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
  billerOnly?: boolean;
}

export const Sidebar: React.FC = () => {
  const pathname = usePathname();
  const { role, sidebarCollapsed, toggleSidebar } = useAppStore();

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
      title: "ACTION ITEMS (EXCEPTIONS)",
      billerOnly: true,
      items: [
        { label: "Denial Management", href: "/worklist/denials", icon: <XCircle className="w-4 h-4" />, badge: 12, badgeColor: "bg-[var(--status-critical-bg)] text-[var(--status-critical)]" },
        { label: "Import Errors", href: "/worklist/import-errors", icon: <AlertOctagon className="w-4 h-4" />, badge: 2 },
        { label: "Payer Mappings", href: "/worklist/payer-mapping", icon: <FileX2 className="w-4 h-4" /> },
        { label: "Submission Errors", href: "/worklist/submission-errors", icon: <Send className="w-4 h-4" />, badge: 4 },
        { label: "Payer Rejections", href: "/worklist/rejections", icon: <AlertCircle className="w-4 h-4" /> },
        { label: "EDI / ERA Enrollments", href: "/worklist/edi-era", icon: <Radio className="w-4 h-4" /> },
      ],
    },
    {
      title: "CREDENTIALING",
      billerOnly: true,
      items: [
        { label: "Payer Credentialing", href: "/credentialing", icon: <Award className="w-4 h-4" /> },
      ],
    },
    {
      title: "AUTOMATION CONFIG",
      billerOnly: true,
      items: [
        { label: "Billing Scrub Rules", href: "/automation/rules", icon: <Sliders className="w-4 h-4" /> },
        { label: "Patient Statements", href: "/automation/patient-statements", icon: <Mail className="w-4 h-4" /> },
        { label: "Insurance Intake", href: "/automation/insurance-intake", icon: <Workflow className="w-4 h-4" /> },
        { label: "Pre-Visit Flow", href: "/automation/patient-flow", icon: <Activity className="w-4 h-4" /> },
      ],
    },
    {
      title: "SYSTEM",
      items: [
        { label: "Settings & Profile", href: "/settings", icon: <Settings className="w-4 h-4" /> },
      ],
    },
  ];

  return (
    <aside
      className={clsx(
        "glass-chrome fixed top-4 left-4 bottom-4 z-40 transition-all duration-300 flex flex-col justify-between shadow-xl border border-white/70 select-none rounded-3xl",
        sidebarCollapsed ? "w-20 p-3" : "w-64 p-4"
      )}
    >
      <div className="flex flex-col h-full overflow-hidden">
        {/* Brand Header */}
        <div className="flex items-center justify-between pb-4 mb-3 border-b border-[var(--border)] shrink-0">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="w-9 h-9 rounded-2xl bg-[var(--accent)] text-white flex items-center justify-center font-extrabold text-lg shadow-sm shrink-0">
              M
            </div>
            {!sidebarCollapsed && (
              <div className="truncate">
                <h1 className="text-[15px] font-bold tracking-tight text-[var(--foreground)] leading-tight">
                  MantraCare
                </h1>
                <p className="text-[10px] font-bold text-[var(--foreground-muted)] tracking-wide uppercase">
                  RCM Operating System
                </p>
              </div>
            )}
          </div>

          <button
            onClick={toggleSidebar}
            className="p-1.5 rounded-full neu-soft hover:bg-[var(--accent-soft)] text-[var(--foreground-muted)] hover:text-[var(--accent)] transition-colors shrink-0 cursor-pointer"
            title={sidebarCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
          >
            {sidebarCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        {/* Navigation Sections */}
        <div className="flex-1 overflow-y-auto space-y-5 pr-1 custom-scrollbar">
          {sections.map((section, idx) => {
            if (section.billerOnly && role === "provider") return null;

            return (
              <div key={idx} className="space-y-1.5">
                {!sidebarCollapsed && (
                  <div className="px-2 text-[10px] font-bold uppercase tracking-wider text-[var(--foreground-faint)]">
                    {section.title}
                  </div>
                )}

                <div className="space-y-1">
                  {section.items.map((item) => {
                    const isActive = pathname === item.href;

                    return (
                      <Link
                        key={item.href}
                        href={item.href}
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
                </div>
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
