"use client";

import React, { useState } from "react";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, X, Send, Bot, User, ChevronRight, Zap, FileText, CheckCircle2, Sliders } from "lucide-react";
import { clsx } from "clsx";

interface Message {
  id: string;
  sender: "user" | "assistant";
  text: string;
  timestamp: string;
  metrics?: { label: string; value: string; tone?: "success" | "warning" | "accent" }[];
  suggestedAction?: { label: string; query: string };
}

export const AiAssistantPanel: React.FC = () => {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [inputQuery, setInputQuery] = useState("");

  const getContextualGreeting = (): { text: string; metrics?: any[]; action?: any } => {
    if (pathname.includes("/claims")) {
      return {
        text: "I am actively auditing 837P claim submissions and clearinghouse EDI status. All claim scrub rules are currently active.",
        metrics: [
          { label: "Scrub Accuracy", value: "98.4%", tone: "success" },
          { label: "Pending Claims", value: "8 Claims", tone: "warning" },
        ],
        action: { label: "Run Claim Scrub Audit", query: "Run full claim scrub audit" },
      };
    }
    if (pathname.includes("/worklist")) {
      return {
        text: "I am tracking open denial clusters and root causes. 14 claims are flagged for missing Modifier 95 on telehealth CPT 90837.",
        metrics: [
          { label: "Open Denials", value: "12 Clusters", tone: "warning" },
          { label: "Auto-Appeal Ready", value: "5 Claims", tone: "success" },
        ],
        action: { label: "Draft Batch Appeal Letter", query: "Draft batch appeal letter for open denials" },
      };
    }
    if (pathname.includes("/invoicing") || pathname.includes("/patient-responsibility")) {
      return {
        text: "I am auditing EOB postings and patient AR. $330.00 is currently invoiceable with active pay-by-link automated dunning.",
        metrics: [
          { label: "Invoiceable AR", value: "$330.00", tone: "accent" },
          { label: "Auto-Dunning", value: "Active", tone: "success" },
        ],
        action: { label: "Issue Pending Statements", query: "Issue all pending patient statements" },
      };
    }
    return {
      text: "Welcome to MantraCare AI Silent Partner. I provide real-time RCM intelligence, automated claim scrubbing, and appeal letter drafting.",
      metrics: [
        { label: "Touchless Rate", value: "94.2%", tone: "success" },
        { label: "System Status", value: "Live 200 OK", tone: "accent" },
      ],
      action: { label: "Perform Practice Audit", query: "Perform practice revenue audit" },
    };
  };

  const initialGreeting = getContextualGreeting();

  const [messages, setMessages] = useState<Message[]>([
    {
      id: "m-1",
      sender: "assistant",
      text: initialGreeting.text,
      timestamp: "Just now",
      metrics: initialGreeting.metrics,
      suggestedAction: initialGreeting.action,
    },
  ]);

  const handleSendQuery = (queryText: string) => {
    if (!queryText.trim()) return;

    const userMsg: Message = {
      id: `u-${Date.now()}`,
      sender: "user",
      text: queryText,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputQuery("");

    setTimeout(() => {
      let aiResponseText = `I have processed your query: "${queryText}". All automated billing engines are operating nominally with zero blocking ERA errors.`;
      let responseMetrics;
      let responseAction;

      if (queryText.toLowerCase().includes("denial") || queryText.toLowerCase().includes("appeal")) {
        aiResponseText = "Analyzed active denial clusters: 14 claims under Blue Cross Blue Shield are flagged for missing Modifier 95 on CPT 90837. Prepared batch appeal template with eligibility attachments.";
        responseMetrics = [
          { label: "Identified Root Cause", value: "Modifier 95 Missing", tone: "warning" as const },
          { label: "Recoverable Revenue", value: "$2,450.00", tone: "success" as const },
        ];
        responseAction = { label: "Execute Batch Resubmission", query: "Resubmit all claims with Modifier 95" };
      } else if (queryText.toLowerCase().includes("claim") || queryText.toLowerCase().includes("status") || queryText.toLowerCase().includes("scrub")) {
        aiResponseText = "Scrub Engine Audit Complete: 88% of claims filed in the last 7 days reached 'In Adjudication' with 0 EDI syntax rejections.";
        responseMetrics = [
          { label: "First-Pass Rate", value: "98.4%", tone: "success" as const },
          { label: "EDI 999 Status", value: "Accepted", tone: "accent" as const },
        ];
      } else if (queryText.toLowerCase().includes("patient") || queryText.toLowerCase().includes("statement") || queryText.toLowerCase().includes("ar")) {
        aiResponseText = "Patient AR Audit: Decoupled billing rules verified. No front-running insurance claims. 12 patient statements queued for automated SMS dispatch.";
        responseMetrics = [
          { label: "Invoiceable Balances", value: "$330.00", tone: "accent" as const },
          { label: "Pay-Link Delivery", value: "SMS + Email", tone: "success" as const },
        ];
      }

      const aiMsg: Message = {
        id: `a-${Date.now()}`,
        sender: "assistant",
        text: aiResponseText,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        metrics: responseMetrics,
        suggestedAction: responseAction,
      };
      setMessages((prev) => [...prev, aiMsg]);
    }, 600);
  };

  return (
    <>
      {/* Premium Neumorphic Edge Trigger Pill */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          aria-label="Open AI Assistant Panel"
          className="fixed right-0 top-1/2 -translate-y-1/2 z-50 neu bg-[var(--surface)] text-[var(--foreground)] border border-white/80 shadow-2xl rounded-l-2xl py-3 px-2 flex flex-col items-center gap-2 hover:translate-x-[-3px] transition-all cursor-pointer select-none group"
          title="Open MantraCare AI Silent Partner"
        >
          <div className="w-8 h-8 rounded-xl bg-[var(--accent-soft)] text-[var(--accent)] flex items-center justify-center group-hover:bg-[var(--accent)] group-hover:text-white transition-all shadow-xs">
            <Sparkles className="w-4 h-4" />
          </div>
          <span className="writing-vertical text-[9px] font-extrabold tracking-widest text-[var(--foreground-muted)] uppercase group-hover:text-[var(--accent)] transition-colors">
            AI Silent Partner
          </span>
          <span className="w-2 h-2 rounded-full bg-[var(--status-success)] animate-pulse" />
        </button>
      )}

      {/* Slide-out Persistent Drawer Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 380, damping: 32 }}
            className="fixed top-0 right-0 bottom-0 w-[410px] max-w-[90vw] z-50 glass-chrome bg-[var(--surface)]/95 backdrop-blur-2xl border-l border-[var(--border)] shadow-2xl flex flex-col select-none"
          >
            {/* Drawer Header */}
            <div className="p-4 border-b border-[var(--border)] flex items-center justify-between bg-[var(--surface)]">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-2xl neu-soft bg-[var(--surface)] text-[var(--accent)] flex items-center justify-center border border-white/80 shadow-xs">
                  <Sparkles className="w-4.5 h-4.5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-[14px] font-extrabold text-[var(--foreground)] tracking-tight">
                      MantraCare AI Copilot
                    </h3>
                    <span className="flex items-center gap-1 text-[10px] font-bold text-[var(--status-success)] bg-[var(--status-success-bg)] px-2 py-0.5 rounded-full border border-[var(--status-success)]/20">
                      <span className="w-1.5 h-1.5 rounded-full bg-[var(--status-success)] animate-pulse" /> Active
                    </span>
                  </div>
                  <p className="text-[11px] font-medium text-[var(--foreground-muted)] truncate max-w-[220px]">
                    Context: <span className="font-mono font-bold text-[var(--accent)]">{pathname}</span>
                  </p>
                </div>
              </div>

              <button
                onClick={() => setIsOpen(false)}
                aria-label="Close AI Assistant Panel"
                className="p-2 rounded-xl neu-soft text-[var(--foreground-muted)] hover:text-[var(--foreground)] hover:bg-[var(--surface-muted)] transition-colors cursor-pointer"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* Conversation Messages Stream */}
            <div className="flex-1 p-4 overflow-y-auto space-y-4 custom-scrollbar text-xs">
              {messages.map((m) => (
                <div
                  key={m.id}
                  className={clsx(
                    "flex gap-2.5 max-w-[96%]",
                    m.sender === "user" ? "ml-auto flex-row-reverse" : "mr-auto"
                  )}
                >
                  <div
                    className={clsx(
                      "w-7 h-7 rounded-xl flex items-center justify-center shrink-0 text-[10px] font-bold shadow-xs",
                      m.sender === "user"
                        ? "bg-[var(--foreground)] text-white"
                        : "bg-[var(--accent)] text-white"
                    )}
                  >
                    {m.sender === "user" ? <User className="w-3.5 h-3.5" /> : <Bot className="w-3.5 h-3.5" />}
                  </div>

                  <div
                    className={clsx(
                      "p-4 rounded-2xl leading-relaxed space-y-2.5 shadow-xs transition-all",
                      m.sender === "user"
                        ? "bg-[var(--accent)] text-white rounded-tr-xs"
                        : "neu bg-[var(--surface)] text-[var(--foreground)] rounded-tl-xs border border-white/80"
                    )}
                  >
                    <p className="font-medium text-[12.5px]">{m.text}</p>

                    {/* AI Structured Metrics Pills */}
                    {m.metrics && m.metrics.length > 0 && (
                      <div className="grid grid-cols-2 gap-2 pt-1 border-t border-[var(--border)]/40">
                        {m.metrics.map((met, idx) => (
                          <div key={idx} className="p-2 neu-pressed rounded-xl text-[10.5px]">
                            <div className="text-[var(--foreground-faint)] font-bold uppercase tracking-wider text-[9px]">
                              {met.label}
                            </div>
                            <div className="font-extrabold text-[var(--foreground)] mt-0.5">
                              {met.value}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* AI Suggested Action Button */}
                    {m.suggestedAction && (
                      <div className="pt-1">
                        <button
                          onClick={() => handleSendQuery(m.suggestedAction!.query)}
                          className="w-full py-1.5 px-3 rounded-xl bg-[var(--accent-soft)] text-[var(--accent)] hover:bg-[var(--accent)] hover:text-white font-bold text-[11px] transition-all flex items-center justify-center gap-1.5 border border-black/5 cursor-pointer"
                        >
                          <Zap className="w-3.5 h-3.5" /> {m.suggestedAction.label}
                        </button>
                      </div>
                    )}

                    <div
                      className={clsx(
                        "text-[9px] font-bold text-right",
                        m.sender === "user" ? "text-white/70" : "text-[var(--foreground-faint)]"
                      )}
                    >
                      {m.timestamp}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Quick Context Prompt Suggestions */}
            <div className="px-4 py-2.5 border-t border-[var(--border)] bg-[var(--surface-muted)]/40 flex gap-1.5 overflow-x-auto custom-scrollbar">
              <button
                onClick={() => handleSendQuery("Run full claim scrub audit")}
                className="px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-[var(--accent-soft)] text-[var(--accent)] hover:bg-[var(--accent)] hover:text-white transition-all shrink-0 border border-black/5 cursor-pointer"
              >
                ⚡ Page Audit
              </button>
              <button
                onClick={() => handleSendQuery("Draft batch appeal for open denials")}
                className="px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-[var(--surface)] text-[var(--foreground-muted)] hover:bg-[var(--surface-muted)] transition-all shrink-0 border border-[var(--border)] cursor-pointer"
              >
                📝 Draft Appeal
              </button>
              <button
                onClick={() => handleSendQuery("Check payer timely filing windows")}
                className="px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-[var(--surface)] text-[var(--foreground-muted)] hover:bg-[var(--surface-muted)] transition-all shrink-0 border border-[var(--border)] cursor-pointer"
              >
                ⏱️ Timely Filing
              </button>
            </div>

            {/* Inset Prompt Input Well */}
            <div className="p-3.5 border-t border-[var(--border)] bg-[var(--surface)]">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSendQuery(inputQuery);
                }}
                className="flex items-center gap-2 neu-pressed px-4 py-2 rounded-2xl"
              >
                <input
                  type="text"
                  value={inputQuery}
                  onChange={(e) => setInputQuery(e.target.value)}
                  placeholder="Ask Assistant about RCM rules, denials, or claims..."
                  aria-label="Ask AI Assistant"
                  className="bg-transparent border-none outline-none text-[12px] text-[var(--foreground)] placeholder-[var(--foreground-faint)] font-medium w-full"
                />
                <button
                  type="submit"
                  aria-label="Send query"
                  className="p-1.5 rounded-xl bg-[var(--accent)] text-white hover:bg-[var(--accent-hover)] transition-all cursor-pointer shrink-0 shadow-xs"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
