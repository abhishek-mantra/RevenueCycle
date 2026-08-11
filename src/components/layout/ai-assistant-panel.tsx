"use client";

import React, { useState } from "react";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, X, Send, Bot, User, ChevronLeft, ChevronRight } from "lucide-react";
import { clsx } from "clsx";

interface Message {
  id: string;
  sender: "user" | "assistant";
  text: string;
  timestamp: string;
}

export const AiAssistantPanel: React.FC = () => {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [inputQuery, setInputQuery] = useState("");

  const getContextualGreeting = () => {
    if (pathname.includes("/claims")) {
      return "I'm monitoring active claims and EDI acknowledgements. Ask me about claim adjudication status, denial codes, or timely filing rules.";
    }
    if (pathname.includes("/worklist")) {
      return "I'm tracking open action items and denial clusters. I can analyze root causes, generate appeal letter drafts, or recommend modifier fixes.";
    }
    if (pathname.includes("/invoicing") || pathname.includes("/patient-responsibility")) {
      return "I'm auditing patient balances and EOB posting status. Ask me about patient responsibility, pay-by-link flows, or clawback disputes.";
    }
    if (pathname.includes("/appointments")) {
      return "I'm inspecting pre-visit eligibility and copay estimates. Ask me about member ID verification or insurance coverage rules.";
    }
    return "Welcome! I am your MantraCare AI Silent Partner. How can I assist with your revenue cycle operations today?";
  };

  const [messages, setMessages] = useState<Message[]>([
    {
      id: "m-1",
      sender: "assistant",
      text: getContextualGreeting(),
      timestamp: "Just now",
    },
  ]);

  const handleSend = () => {
    if (!inputQuery.trim()) return;

    const userMsg: Message = {
      id: `u-${Date.now()}`,
      sender: "user",
      text: inputQuery,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMsg]);
    const userText = inputQuery;
    setInputQuery("");

    setTimeout(() => {
      let aiResponseText = `I have processed your query: "${userText}". Based on current practice claims data, touchless automation is operating at 94.2% efficiency with zero blocking ERA errors.`;
      
      if (userText.toLowerCase().includes("denial") || userText.toLowerCase().includes("appeal")) {
        aiResponseText = "Analyzing denial logs: 14 claims under Blue Cross Blue Shield are flagged for missing modifier 95 on CPT 90837. Auto-applying modifier 95 and preparing batch appeal submission.";
      } else if (userText.toLowerCase().includes("claim") || userText.toLowerCase().includes("status")) {
        aiResponseText = "Claim status lookup: 88% of claims filed in the last 7 days have reached 'In Adjudication' status with valid 999/277 acknowledgements.";
      } else if (userText.toLowerCase().includes("patient") || userText.toLowerCase().includes("balance")) {
        aiResponseText = "Patient AR summary: $330.00 is currently invoiceable across active patients. All card-on-file billing links are active.";
      }

      const aiMsg: Message = {
        id: `a-${Date.now()}`,
        sender: "assistant",
        text: aiResponseText,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };
      setMessages((prev) => [...prev, aiMsg]);
    }, 600);
  };

  return (
    <>
      {/* Minimalist Right Edge Glass Arrow Trigger */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          aria-label="Open AI Assistant Panel"
          className="fixed right-0 top-1/2 -translate-y-1/2 z-50 glass-chrome bg-white/85 p-3 rounded-l-2xl shadow-xl flex items-center justify-center hover:bg-white hover:scale-105 transition-all group cursor-pointer border border-r-0 border-white/80 text-[var(--foreground-muted)] select-none"
          title="Open AI Assistant Panel"
        >
          <ChevronLeft className="w-5 h-5 text-[var(--foreground)] group-hover:text-[var(--accent)] group-hover:-translate-x-0.5 transition-all" />
        </button>
      )}

      {/* Slide-out Persistent Drawer Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 350, damping: 30 }}
            className="fixed top-0 right-0 bottom-0 w-96 z-50 glass-chrome bg-[var(--surface)]/95 backdrop-blur-2xl border-l border-[var(--border)] shadow-2xl flex flex-col select-none"
          >
            {/* Header */}
            <div className="p-4 border-b border-[var(--border)] flex items-center justify-between bg-[var(--surface-muted)]/50">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-[var(--accent-soft)] text-[var(--accent)]">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-[13px] font-extrabold text-[var(--foreground)]">
                    AI Assistant Panel
                  </h3>
                  <p className="text-[10px] font-medium text-[var(--foreground-muted)]">
                    Context: <span className="text-[var(--accent)] font-semibold">{pathname}</span>
                  </p>
                </div>
              </div>

              <button
                onClick={() => setIsOpen(false)}
                aria-label="Close AI Assistant Panel"
                className="p-1.5 rounded-full hover:bg-[var(--border)] text-[var(--foreground-muted)] hover:text-[var(--foreground)] transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Conversation Messages */}
            <div className="flex-1 p-4 overflow-y-auto space-y-3.5 custom-scrollbar text-[12px]">
              {messages.map((m) => (
                <div
                  key={m.id}
                  className={clsx(
                    "flex gap-2.5 max-w-[92%]",
                    m.sender === "user" ? "ml-auto flex-row-reverse" : "mr-auto"
                  )}
                >
                  <div
                    className={clsx(
                      "w-6 h-6 rounded-full flex items-center justify-center shrink-0 text-[10px] font-bold",
                      m.sender === "user"
                        ? "bg-[var(--foreground)] text-white"
                        : "bg-[var(--accent)] text-white"
                    )}
                  >
                    {m.sender === "user" ? <User className="w-3 h-3" /> : <Bot className="w-3 h-3" />}
                  </div>
                  <div
                    className={clsx(
                      "p-3 rounded-2xl leading-relaxed shadow-xs",
                      m.sender === "user"
                        ? "bg-[var(--accent)] text-white rounded-tr-none"
                        : "neu-soft bg-[var(--surface)] text-[var(--foreground)] rounded-tl-none border border-[var(--border)]"
                    )}
                  >
                    <p>{m.text}</p>
                    <div
                      className={clsx(
                        "text-[9px] mt-1 text-right",
                        m.sender === "user" ? "text-white/70" : "text-[var(--foreground-faint)]"
                      )}
                    >
                      {m.timestamp}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Context Prompt Suggestions */}
            <div className="px-4 py-2 border-t border-[var(--border)] bg-[var(--surface-muted)]/30 flex gap-1.5 overflow-x-auto custom-scrollbar">
              <button
                onClick={() => setInputQuery("Analyze current page errors")}
                className="px-2 py-1 rounded-full text-[10px] font-semibold bg-[var(--accent-soft)] text-[var(--accent)] hover:bg-[var(--accent)] hover:text-white transition-colors shrink-0"
              >
                ⚡ Page Audit
              </button>
              <button
                onClick={() => setInputQuery("Draft appeal for open denial")}
                className="px-2 py-1 rounded-full text-[10px] font-semibold bg-[var(--surface-muted)] text-[var(--foreground-muted)] hover:bg-[var(--surface-muted)]/80 transition-colors shrink-0"
              >
                📝 Draft Appeal
              </button>
              <button
                onClick={() => setInputQuery("Check timely filing limits")}
                className="px-2 py-1 rounded-full text-[10px] font-semibold bg-[var(--surface-muted)] text-[var(--foreground-muted)] hover:bg-[var(--surface-muted)]/80 transition-colors shrink-0"
              >
                ⏱️ Timely Filing
              </button>
            </div>

            {/* Input Form */}
            <div className="p-3 border-t border-[var(--border)] bg-[var(--surface)]">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSend();
                }}
                className="flex items-center gap-2 neu-pressed px-3 py-1.5 rounded-full"
              >
                <input
                  type="text"
                  value={inputQuery}
                  onChange={(e) => setInputQuery(e.target.value)}
                  placeholder="Ask Assistant about claims..."
                  aria-label="Ask AI Assistant"
                  className="bg-transparent border-none outline-none text-[12px] text-[var(--foreground)] placeholder-[var(--foreground-faint)] w-full"
                />
                <button
                  type="submit"
                  aria-label="Send query"
                  className="p-1.5 rounded-full bg-[var(--accent)] text-white hover:bg-[var(--accent-hover)] transition-colors cursor-pointer shrink-0 shadow-xs"
                >
                  <Send className="w-3 h-3" />
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
