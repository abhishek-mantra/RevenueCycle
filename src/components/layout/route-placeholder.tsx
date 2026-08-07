"use client";

import React from "react";
import { AppShell } from "@/components/layout/app-shell";
import { KpiCard } from "@/components/ui/kpi-card";
import { Button } from "@/components/ui/button";
import { Clock, Layers, Sparkles } from "lucide-react";

interface RoutePlaceholderProps {
  title: string;
  category: string;
  milestone: string;
  description: string;
}

export const RoutePlaceholder: React.FC<RoutePlaceholderProps> = ({
  title,
  category,
  milestone,
  description,
}) => {
  return (
    <AppShell>
      <div className="space-y-6">
        <div className="neu p-6 rounded-2xl space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--accent)] flex items-center gap-1.5">
              <Layers className="w-4 h-4" /> {category}
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-[var(--accent-soft)] text-[var(--accent)] border border-[var(--accent)]/20">
              {milestone}
            </span>
          </div>

          <h1 className="text-[24px] font-extrabold tracking-tight text-[var(--foreground)]">
            {title}
          </h1>

          <p className="text-[14px] text-[var(--foreground-muted)] max-w-2xl leading-relaxed">
            {description}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <KpiCard
            label="Module Readiness"
            value="Wired"
            subtitle="Scaffolded in Milestone 2 Shell"
            icon={<Clock className="w-5 h-5" />}
          />
          <KpiCard
            label="Design Material"
            value="Neumorphic"
            subtitle="Closed monochrome + cobalt tokens"
            icon={<Sparkles className="w-5 h-5" />}
          />
          <KpiCard
            label="Data Contract"
            value="Zod Validated"
            subtitle="Mapped to 04-build.md §5"
            icon={<Layers className="w-5 h-5" />}
          />
        </div>
      </div>
    </AppShell>
  );
};
