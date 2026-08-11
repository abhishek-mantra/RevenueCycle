"use client";

import React from "react";
import { Sidebar } from "./sidebar";
import { Topbar } from "./topbar";
import { AiAssistantPanel } from "./ai-assistant-panel";
import { useAppStore } from "@/store/useAppStore";
import { clsx } from "clsx";

export interface AppShellProps {
  children: React.ReactNode;
}

export const AppShell: React.FC<AppShellProps> = ({ children }) => {
  const { sidebarCollapsed } = useAppStore();

  return (
    <div className="relative min-h-screen bg-[var(--canvas)] text-[var(--foreground)]">
      {/* Background Ambient Depth Blobs for Glass Backdrop-Blur */}
      <div className="ambient-bg">
        <div className="ambient-blob-1" />
        <div className="ambient-blob-2" />
      </div>

      {/* Floating Glass Navigation */}
      <Sidebar />
      <Topbar />

      {/* Persistent AI Assistant Slide-Out Panel */}
      <AiAssistantPanel />

      {/* Main Content Viewport */}
      <main
        className={clsx(
          "pt-24 pb-12 px-6 transition-all duration-300 relative z-10",
          sidebarCollapsed ? "pl-28" : "pl-72"
        )}
      >
        <div className="max-w-7xl mx-auto space-y-6">{children}</div>
      </main>
    </div>
  );
};
