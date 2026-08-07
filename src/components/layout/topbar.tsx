"use client";

import React from "react";
import { usePathname } from "next/navigation";
import { useAppStore } from "@/store/useAppStore";
import { motion } from "framer-motion";
import { Search, Bell, UserCheck, ShieldAlert } from "lucide-react";
import { clsx } from "clsx";

export const Topbar: React.FC = () => {
  const pathname = usePathname();
  const { role, setRole, sidebarCollapsed } = useAppStore();

  const getPageTitle = () => {
    if (pathname.includes("/insights/overview")) return "Executive Revenue Overview";
    if (pathname.includes("/insights/revenue-analysis")) return "Revenue Analysis & Financials";
    if (pathname.includes("/insights/payer-performance")) return "Payer Performance & Contract Variance";
    if (pathname.includes("/insights/ai-insights")) return "AI Revenue Cycle Assistant";
    if (pathname.includes("/appointments")) return "Pre-Visit Financials & Eligibility Worklist";
    if (pathname.includes("/encounters")) return "Encounter Management";
    if (pathname.includes("/claims")) return "Claim Submission & Lifecycle Tracker";
    if (pathname.includes("/invoicing")) return "Patient Invoicing & Receipts";
    if (pathname.includes("/patient-responsibility")) return "Patient AR & Collections";
    if (pathname.includes("/onboarding")) return "System Migration & Shadow Mode Import";
    if (pathname.includes("/worklist/denials")) return "Denial Management & Root-Cause Groups";
    if (pathname.includes("/worklist")) return "Exception Worklist Queue";
    if (pathname.includes("/credentialing")) return "Credentialing & Transaction Enrollment Vault";
    if (pathname.includes("/automation")) return "Rules & Automation Configuration";
    if (pathname.includes("/settings")) return "Account & System Settings";
    return "MantraCare Revenue Operations";
  };

  return (
    <header
      className={clsx(
        "glass-chrome fixed top-4 right-4 z-30 transition-all duration-300 p-3.5 flex items-center justify-between shadow-xl border border-white/70 select-none rounded-3xl",
        sidebarCollapsed ? "left-24" : "left-76"
      )}
    >
      {/* Title & Greeting */}
      <div className="flex items-center gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-[16px] font-bold text-[var(--foreground)] tracking-tight">
              {getPageTitle()}
            </h2>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[var(--surface-muted)] text-[var(--foreground-muted)] border border-[var(--border)]">
              {role === "biller" ? "Cross-Practice Biller" : "Self-Serve Provider"}
            </span>
          </div>
          <p className="text-[12px] text-[var(--foreground-muted)] font-medium">
            Welcome back, <span className="font-bold text-[var(--foreground)]">Alex River</span> 👋
          </p>
        </div>
      </div>

      {/* Global Search Bar (Capsule design) */}
      <div className="hidden md:flex items-center gap-2 neu-pressed px-4 py-2 rounded-full w-80 text-[13px] transition-all focus-within:ring-2 focus-within:ring-[var(--accent)]">
        <Search className="w-4 h-4 text-[var(--foreground-faint)] shrink-0" />
        <input
          type="text"
          placeholder="Search patient, claim ID, or CPT code..."
          className="bg-transparent border-none outline-none text-[13px] text-[var(--foreground)] placeholder-[var(--foreground-faint)] w-full"
        />
        <kbd className="hidden lg:inline-block px-1.5 py-0.5 text-[10px] font-mono text-[var(--foreground-faint)] bg-white rounded-md border border-[var(--border)] shadow-xs">
          ⌘K
        </kbd>
      </div>

      {/* Role Switcher & User Profile Pill */}
      <div className="flex items-center gap-3">
        {/* Role Switcher Segmented Control with Framer Motion layoutId glide */}
        <div className="neu-pressed p-1 rounded-full flex items-center gap-1 relative">
          <button
            onClick={() => setRole("biller")}
            className={clsx(
              "relative px-3.5 py-1 text-[11px] font-bold rounded-full transition-colors cursor-pointer z-10 flex items-center gap-1.5",
              role === "biller" ? "text-white" : "text-[var(--foreground-muted)] hover:text-[var(--foreground)]"
            )}
          >
            {role === "biller" && (
              <motion.div
                layoutId="activeRolePill"
                className="absolute inset-0 bg-[var(--accent)] rounded-full z-[-1] shadow-xs"
                transition={{ type: "spring", stiffness: 450, damping: 30 }}
              />
            )}
            <ShieldAlert className="w-3.5 h-3.5" />
            Biller Mode
          </button>

          <button
            onClick={() => setRole("provider")}
            className={clsx(
              "relative px-3.5 py-1 text-[11px] font-bold rounded-full transition-colors cursor-pointer z-10 flex items-center gap-1.5",
              role === "provider" ? "text-white" : "text-[var(--foreground-muted)] hover:text-[var(--foreground)]"
            )}
          >
            {role === "provider" && (
              <motion.div
                layoutId="activeRolePill"
                className="absolute inset-0 bg-[var(--accent)] rounded-full z-[-1] shadow-xs"
                transition={{ type: "spring", stiffness: 450, damping: 30 }}
              />
            )}
            <UserCheck className="w-3.5 h-3.5" />
            Provider Mode
          </button>
        </div>

        {/* Notifications Icon with Badge */}
        <motion.button
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.95 }}
          className="relative p-2.5 rounded-full neu-soft hover:bg-[var(--surface-muted)] text-[var(--foreground-muted)] hover:text-[var(--foreground)] transition-colors cursor-pointer"
          title="Notifications"
        >
          <Bell className="w-4 h-4" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[var(--status-critical)]" />
        </motion.button>

        {/* User Profile Pill */}
        <div className="flex items-center gap-2.5 pl-2 border-l border-[var(--border)]">
          <div className="w-8 h-8 rounded-full bg-[var(--accent)] text-white flex items-center justify-center font-extrabold text-xs shadow-xs">
            AR
          </div>
          <div className="hidden xl:block text-left">
            <div className="text-[12px] font-bold leading-tight text-[var(--foreground)]">Alex River</div>
            <div className="text-[10px] font-medium text-[var(--foreground-muted)]">Practice Admin</div>
          </div>
        </div>
      </div>
    </header>
  );
};
