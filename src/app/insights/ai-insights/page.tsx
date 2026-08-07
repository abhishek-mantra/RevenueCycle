"use client";

import React, { useState } from "react";
import { AppShell } from "@/components/layout/app-shell";
import { KpiCard } from "@/components/ui/kpi-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";
import { Sparkles, Send, Bot, User, ArrowRight, Zap, ShieldCheck } from "lucide-react";

export default function AiInsightsPage() {
  const [messages, setMessages] = useState([
    {
      sender: "ai",
      text: "Hello Alex! I am your MantraCare Revenue Cycle AI Assistant. I've analyzed your practice billing data. You have 14 denials clustered under Blue Cross Blue Shield telehealth modifier rules ($2,450 at risk). Would you like me to generate a batch appeal?",
    },
  ]);
  const [inputValue, setInputValue] = useState("");

  const handleSend = () => {
    if (!inputValue.trim()) return;
    const userMsg = inputValue;
    setMessages((prev) => [...prev, { sender: "user", text: userMsg }]);
    setInputValue("");

    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          sender: "ai",
          text: `Analysis complete for "${userMsg}": Contract Variance Analysis indicates United Healthcare underpaid 2 claims by $40 under Addendum B §4.2. Recommended action: File formal variance dispute.`,
        },
      ]);
    }, 800);
  };

  return (
    <AppShell>
      <div className="space-y-6 select-none max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-[22px] font-extrabold tracking-tight text-[var(--foreground)]">
                AI Revenue Cycle Assistant
              </h1>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] uppercase font-bold bg-[var(--accent-soft)] text-[var(--accent)] border border-black/5">
                Mock UI Intelligence
              </span>
            </div>
            <p className="text-[13px] text-[var(--foreground-muted)] font-medium mt-1">
              Conversational revenue cycle intelligence surface. Ask questions or run batch fixes.
            </p>
          </div>
        </div>

        {/* Quick Prompt Chips */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          {[
            "Explain BCBS denial spike",
            "Find contract underpayments this month",
            "Draft batch appeal for Auth denials",
            "Show Payer ROI ranking",
          ].map((prompt) => (
            <button
              key={prompt}
              onClick={() => {
                setInputValue(prompt);
              }}
              className="px-3.5 py-1.5 rounded-full neu-soft text-[var(--foreground-muted)] hover:text-[var(--foreground)] hover:bg-[var(--surface-muted)] font-semibold transition-all cursor-pointer flex items-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5 text-[var(--accent)]" />
              {prompt}
            </button>
          ))}
        </div>

        {/* Chat Stream Window */}
        <div className="neu p-6 space-y-4 min-h-[380px] flex flex-col justify-between">
          <div className="space-y-4 overflow-y-auto max-h-[420px] pr-2 custom-scrollbar">
            {messages.map((msg, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex gap-3 ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
              >
                {msg.sender === "ai" && (
                  <div className="w-8 h-8 rounded-full bg-[var(--accent)] text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-xs">
                    <Bot className="w-4 h-4" />
                  </div>
                )}

                <div
                  className={`p-4 rounded-2xl text-[13px] leading-relaxed max-w-xl ${
                    msg.sender === "user"
                      ? "bg-[var(--accent)] text-white font-medium"
                      : "neu-pressed text-[var(--foreground)] font-medium"
                  }`}
                >
                  {msg.text}
                </div>

                {msg.sender === "user" && (
                  <div className="w-8 h-8 rounded-full bg-[var(--surface-muted)] text-[var(--foreground)] flex items-center justify-center font-bold text-xs shrink-0 border border-[var(--border)]">
                    <User className="w-4 h-4" />
                  </div>
                )}
              </motion.div>
            ))}
          </div>

          {/* Input Bar */}
          <div className="flex items-center gap-2 pt-4 border-t border-[var(--border)]">
            <input
              type="text"
              placeholder="Ask AI revenue assistant..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              className="neu-pressed px-4 py-2.5 text-[13px] text-[var(--foreground)] placeholder-[var(--foreground-faint)] w-full outline-none focus:ring-2 focus:ring-[var(--accent)] rounded-full"
            />
            <Button variant="primary" size="md" onClick={handleSend}>
              <Send className="w-4 h-4" />
              Send
            </Button>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
