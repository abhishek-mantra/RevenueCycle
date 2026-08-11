"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { Claim } from "@/schema/claimSchema";
import { DenialClusterGroup, DenialClaimItem } from "@/schema/denialSchema";
import { Encounter } from "@/schema/encounterSchema";
import { Appointment } from "@/schema/appointmentSchema";
import { Invoice } from "@/schema/invoiceSchema";
import { PatientArBalance, ClawbackEntry } from "@/schema/patientArSchema";
import { CredentialingVaultEntry } from "@/schema/credentialingSchema";

import { mockClaims } from "@/data/mockClaims";
import { mockDenialClusters } from "@/data/mockDenials";
import { mockEncounters } from "@/data/mockEncounters";
import { mockAppointments } from "@/data/mockAppointments";
import { mockInvoices } from "@/data/mockInvoices";
import { mockPatientArBalances, mockClawbacks } from "@/data/mockPatientAr";
import { mockCredentialingVault } from "@/data/mockCredentialing";

export interface ScrubRule {
  id: string;
  ruleName: string;
  ruleType: string;
  description: string;
  targetPayer: string;
  cptCode?: string;
  requiredModifier?: string;
  enabled: boolean;
  claimsScrubbedCount: number;
  lastTriggered: string;
  severity: "Critical" | "Warning" | "Info";
}

const initialScrubRules: ScrubRule[] = [
  {
    id: "RULE-101",
    ruleName: "BCBS Telehealth Modifier Check (CPT 90837)",
    ruleType: "Modifier Required",
    description: "Appends modifier 95 to CPT 90837 for BCBS video telehealth sessions.",
    targetPayer: "Blue Cross Blue Shield",
    cptCode: "90837",
    requiredModifier: "95",
    enabled: true,
    claimsScrubbedCount: 142,
    lastTriggered: "2026-08-10",
    severity: "Critical",
  },
  {
    id: "RULE-102",
    ruleName: "Aetna Prior Auth Validation",
    ruleType: "Prior Auth Required",
    description: "Flags claims missing Auth # for Aetna Behavioral Health CPT 90791/90834.",
    targetPayer: "Aetna Behavioral Health",
    cptCode: "90791",
    enabled: true,
    claimsScrubbedCount: 88,
    lastTriggered: "2026-08-09",
    severity: "Critical",
  },
  {
    id: "RULE-103",
    ruleName: "UHC Timely Filing Window Warning (<30 Days)",
    ruleType: "Timely Filing Window",
    description: "Triggers urgent alert when claim DOS approaches UHC 90-day filing cutoff.",
    targetPayer: "United Healthcare",
    enabled: true,
    claimsScrubbedCount: 35,
    lastTriggered: "2026-08-08",
    severity: "Warning",
  },
  {
    id: "RULE-104",
    ruleName: "Cigna Rendering Provider NPI Validation",
    ruleType: "NPI Validation",
    description: "Validates active NPI and Taxonomy Code against Cigna Provider Directory.",
    targetPayer: "Cigna Health",
    enabled: true,
    claimsScrubbedCount: 64,
    lastTriggered: "2026-08-07",
    severity: "Critical",
  },
  {
    id: "RULE-105",
    ruleName: "ICD-10 F41.1 Specificity Check",
    ruleType: "ICD-10 Specificity",
    description: "Ensures primary diagnosis F41.1 (Generalized Anxiety) includes secondary assessment notes.",
    targetPayer: "All Payers",
    enabled: false,
    claimsScrubbedCount: 19,
    lastTriggered: "2026-07-28",
    severity: "Info",
  },
  {
    id: "RULE-106",
    ruleName: "Medicare Incident-To Supervision Rule",
    ruleType: "Supervision Requirement",
    description: "Verifies supervising physician NPI is attached for LCSW incident-to encounters.",
    targetPayer: "Medicare Demo",
    enabled: true,
    claimsScrubbedCount: 42,
    lastTriggered: "2026-08-05",
    severity: "Warning",
  },
];

interface RcmDataState {
  claims: Claim[];
  denialClusters: DenialClusterGroup[];
  encounters: Encounter[];
  appointments: Appointment[];
  invoices: Invoice[];
  patientArBalances: PatientArBalance[];
  clawbacks: ClawbackEntry[];
  credentialingRecords: CredentialingVaultEntry[];
  scrubRules: ScrubRule[];

  // Actions
  updateClaimStatus: (claimId: string, status: Claim["status"]) => void;
  resubmitClaims: (claimIds: string[]) => void;
  resolveDenialCluster: (clusterId: string) => void;
  resolveDenialClaim: (clusterId: string, claimId: string) => void;

  addAppointment: (app: Omit<Appointment, "id">) => void;
  completeAppointment: (appointmentId: string) => void;

  addInvoice: (inv: Omit<Invoice, "id">) => void;
  recordInvoicePayment: (
    invoiceId: string,
    amount: number,
    method: "Card" | "PayLink" | "PaymentPlan"
  ) => void;

  toggleScrubRule: (ruleId: string) => void;
  addScrubRule: (rule: Omit<ScrubRule, "id" | "claimsScrubbedCount" | "lastTriggered">) => void;

  resetDemoData: () => void;
}

export const useRcmDataStore = create<RcmDataState>()(
  persist(
    (set, get) => ({
      claims: mockClaims,
      denialClusters: mockDenialClusters,
      encounters: mockEncounters,
      appointments: mockAppointments,
      invoices: mockInvoices,
      patientArBalances: mockPatientArBalances,
      clawbacks: mockClawbacks,
      credentialingRecords: mockCredentialingVault,
      scrubRules: initialScrubRules,

      updateClaimStatus: (claimId, status) => {
        set((state) => ({
          claims: state.claims.map((c) =>
            c.claimId === claimId || c.id === claimId ? { ...c, status } : c
          ),
        }));
      },

      resubmitClaims: (claimIds) => {
        set((state) => ({
          claims: state.claims.map((c) =>
            claimIds.includes(c.id) || claimIds.includes(c.claimId)
              ? { ...c, status: "InAdjudication" as const, acknowledged: true }
              : c
          ),
          denialClusters: state.denialClusters.map((cluster) => ({
            ...cluster,
            claims: cluster.claims.map((c) =>
              claimIds.includes(c.claimId) || claimIds.includes(c.id)
                ? { ...c, status: "Resubmitted" as const }
                : c
            ),
          })),
        }));
      },

      resolveDenialCluster: (clusterId) => {
        const cluster = get().denialClusters.find((c) => c.id === clusterId);
        if (!cluster) return;

        const clusterClaimIds = cluster.claims.map((c) => c.claimId);

        set((state) => ({
          denialClusters: state.denialClusters.filter((c) => c.id !== clusterId),
          claims: state.claims.map((c) =>
            clusterClaimIds.includes(c.claimId) || clusterClaimIds.includes(c.id)
              ? { ...c, status: "InAdjudication" as const }
              : c
          ),
        }));
      },

      resolveDenialClaim: (clusterId, claimId) => {
        set((state) => ({
          denialClusters: state.denialClusters
            .map((cluster) => {
              if (cluster.id !== clusterId) return cluster;
              const remainingClaims = cluster.claims.filter(
                (c) => c.claimId !== claimId && c.id !== claimId
              );
              return {
                ...cluster,
                claims: remainingClaims,
                claimCount: remainingClaims.length,
              };
            })
            .filter((cluster) => cluster.claims.length > 0),
          claims: state.claims.map((c) =>
            c.claimId === claimId || c.id === claimId
              ? { ...c, status: "InAdjudication" as const }
              : c
          ),
        }));
      },

      addAppointment: (appData) => {
        const newId = `APT-${Date.now().toString().slice(-4)}`;
        const newApp: Appointment = {
          ...appData,
          id: newId,
        };
        set((state) => ({
          appointments: [newApp, ...state.appointments],
        }));
      },

      completeAppointment: (appointmentId) => {
        const state = get();
        const app = state.appointments.find((a) => a.id === appointmentId);
        if (!app) return;

        // 1. Update appointment status
        const updatedAppointments = state.appointments.map((a) =>
          a.id === appointmentId ? { ...a, status: "Completed" as const, visitStatus: "Completed" as const } : a
        );

        const newEncId = `ENC-${Date.now().toString().slice(-4)}`;
        const newClaimId = `CLM-2026-${Math.floor(1000 + Math.random() * 9000)}`;
        const todayStr = new Date().toISOString().split("T")[0];

        const newEncounter: Encounter = {
          id: newEncId,
          encounterId: newEncId,
          billableEventId: `EVT-${Date.now().toString().slice(-4)}`,
          patientName: app.patientName,
          providerName: app.providerName,
          serviceDate: todayStr,
          dos: todayStr,
          primaryPayer: app.payerName,
          totalCharges: 175.0,
          adjustments: 35.0,
          insurancePaid: 120.0,
          patientResponsibility: 20.0,
          balanceDue: 20.0,
          claimIds: [newClaimId],
          status: "PendingAdjudication",
        };

        // 3. Auto-generate linked Claim
        const newClaim: Claim = {
          id: newClaimId,
          claimId: newClaimId,
          encounterId: newEncId,
          patientName: app.patientName,
          payerName: app.payerName,
          cptCode: "90837",
          serviceDate: todayStr,
          dos: todayStr,
          status: "AwaitingAcknowledgement",
          pccn: `PCCN-${Math.floor(10000 + Math.random() * 90000)}`,
          billedAmount: 175.0,
          submittedAmount: 175.0,
          allowedAmount: 140.0,
          paidAmount: 0.0,
          acknowledged: false,
          timelyDaysRemaining: 90,
          source: "native",
        };

        set({
          appointments: updatedAppointments,
          encounters: [newEncounter, ...state.encounters],
          claims: [newClaim, ...state.claims],
        });
      },

      addInvoice: (invData) => {
        const newId = `INV-2026-${Math.floor(1000 + Math.random() * 9000)}`;
        const newInv: Invoice = {
          ...invData,
          id: newId,
        };
        set((state) => ({
          invoices: [newInv, ...state.invoices],
        }));
      },

      recordInvoicePayment: (invoiceId, amount, method) => {
        set((state) => ({
          invoices: state.invoices.map((inv) => {
            if (inv.id !== invoiceId) return inv;

            const newBalance = Math.max(0, inv.balanceDue - amount);
            const newStatus = newBalance === 0 ? "Paid" : "PartiallyPaid";
            const receiptNum = `RCP-2026-${Math.floor(1000 + Math.random() * 9000)}`;
            const todayStr = new Date().toISOString().split("T")[0];

            return {
              ...inv,
              balanceDue: newBalance,
              status: newStatus as Invoice["status"],
              receipts: [
                ...inv.receipts,
                {
                  id: `RCP-${Date.now().toString().slice(-4)}`,
                  receiptNumber: receiptNum,
                  paymentDate: todayStr,
                  amount: amount,
                  method: method === "Card" ? "Card-on-File" : method === "PayLink" ? "Pay-By-Link SMS" : "Payment Plan",
                  reference: `TXN-${Math.floor(100000 + Math.random() * 900000)}`,
                },
              ],
            };
          }),
        }));
      },

      toggleScrubRule: (ruleId) => {
        set((state) => ({
          scrubRules: state.scrubRules.map((r) =>
            r.id === ruleId ? { ...r, enabled: !r.enabled } : r
          ),
        }));
      },

      addScrubRule: (ruleData) => {
        const newId = `RULE-${Date.now().toString().slice(-4)}`;
        const todayStr = new Date().toISOString().split("T")[0];
        const newRule: ScrubRule = {
          ...ruleData,
          id: newId,
          claimsScrubbedCount: 0,
          lastTriggered: todayStr,
        };
        set((state) => ({
          scrubRules: [newRule, ...state.scrubRules],
        }));
      },

      resetDemoData: () => {
        set({
          claims: mockClaims,
          denialClusters: mockDenialClusters,
          encounters: mockEncounters,
          appointments: mockAppointments,
          invoices: mockInvoices,
          patientArBalances: mockPatientArBalances,
          clawbacks: mockClawbacks,
          credentialingRecords: mockCredentialingVault,
          scrubRules: initialScrubRules,
        });
      },
    }),
    {
      name: "mantracare_rcm_store",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
