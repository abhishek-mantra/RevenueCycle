"use client";

import React from "react";
import { usePathname } from "next/navigation";
import { useAppStore } from "@/store/useAppStore";
import { motion } from "framer-motion";
import { Search, Bell } from "lucide-react";
import { clsx } from "clsx";

export const Topbar: React.FC = () => {
  const pathname = usePathname();
  const { sidebarCollapsed } = useAppStore();

  const getBreadcrumb = () => {
    if (pathname.includes("/insights/overview")) return { group: "Insights", title: "Executive Overview" };
    if (pathname.includes("/insights/revenue-analysis")) return { group: "Insights", title: "Revenue Analysis" };
    if (pathname.includes("/insights/payer-performance")) return { group: "Insights", title: "Payer Performance" };
    if (pathname.includes("/insights/ai-insights")) return { group: "Insights", title: "AI Assistant" };
    if (pathname.includes("/appointments")) return { group: "Daily Operations", title: "Pre-Visit Worklist" };
    if (pathname.includes("/encounters")) return { group: "Daily Operations", title: "Encounters" };
    if (pathname.includes("/claims")) return { group: "Daily Operations", title: "Claim Tracker" };
    if (pathname.includes("/invoicing")) return { group: "Daily Operations", title: "Invoicing & Receipts" };
    if (pathname.includes("/patient-responsibility")) return { group: "Daily Operations", title: "Patient AR" };
    if (pathname.includes("/onboarding")) return { group: "Daily Operations", title: "Migration Import" };
    if (pathname.includes("/worklist")) return { group: "Action Items", title: "Exceptions Queue" };
    if (pathname.includes("/credentialing")) return { group: "Credentialing", title: "Enrollments" };
    if (pathname.includes("/automation")) return { group: "Automation", title: "Rules & Flow" };
    if (pathname.includes("/settings")) return { group: "System", title: "Settings" };
    return { group: "MantraCare", title: "Operations" };
  };

  const breadcrumb = getBreadcrumb();

  return (
    <header
      className={clsx(
        "glass-chrome fixed top-4 right-4 z-30 transition-all duration-300 px-5 py-3 flex items-center justify-between shadow-xl border border-white/70 select-none rounded-3xl h-14",
        sidebarCollapsed ? "left-24" : "left-76"
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

      {/* Center: Absolute Fixed Search Bar (Never Shifts Position) */}
      <div className="hidden lg:flex items-center gap-2 neu-pressed px-4 py-1.5 rounded-full w-80 text-[13px] absolute left-1/2 -translate-x-1/2 transition-all focus-within:ring-2 focus-within:ring-[var(--accent)]">
        <Search className="w-3.5 h-3.5 text-[var(--foreground-faint)] shrink-0" />
        <input
          type="text"
          placeholder="Search patient, claim ID, or CPT code..."
          className="bg-transparent border-none outline-none text-[12px] text-[var(--foreground)] placeholder-[var(--foreground-faint)] w-full"
        />
        <kbd className="px-1.5 py-0.5 text-[10px] font-mono text-[var(--foreground-faint)] bg-white rounded-md border border-[var(--border)] shadow-xs">
          ⌘K
        </kbd>
      </div>

      {/* Right: Notifications & User Profile */}
      <div className="flex items-center gap-3 shrink-0">
        {/* Notifications Button */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="relative p-2 rounded-full neu-soft hover:bg-[var(--surface-muted)] text-[var(--foreground-muted)] hover:text-[var(--foreground)] transition-colors cursor-pointer"
          title="Notifications"
        >
          <Bell className="w-4 h-4" />
          <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-[var(--status-critical)]" />
        </motion.button>

        {/* User Profile */}
        <div className="flex items-center gap-2 pl-2 border-l border-[var(--border)]">
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
