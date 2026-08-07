import { z } from "zod";

export const ClawbackEntrySchema = z.object({
  id: z.string(),
  claimId: z.string(),
  encounterId: z.string(),
  patientId: z.string(),
  patientName: z.string(),
  payerName: z.string(),
  originalPayment: z.number(),
  reversalAmount: z.number(),
  reasonCode: z.string(),
  plainEnglishReason: z.string(),
  reversalDate: z.string(),
  status: z.enum(["Disputed", "Resolved", "PendingAction"]),
});

export const PatientArBalanceSchema = z.object({
  id: z.string(),
  patientId: z.string(),
  patientName: z.string(),
  invoiceableBalance: z.number(),
  nonInvoiceableBalance: z.number(),
  lastAdjudicatedDate: z.string().optional(),
  primaryPayer: z.string(),
  hasActiveClawback: z.boolean(),
});

export type ClawbackEntry = z.infer<typeof ClawbackEntrySchema>;
export type PatientArBalance = z.infer<typeof PatientArBalanceSchema>;
