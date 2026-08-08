import { z } from "zod";

export const ClaimSchema = z.object({
  id: z.string(),           // canonical claim ID (e.g. "CLM-2026-8812")
  claimId: z.string(),      // canonical payer-facing display ID (e.g. "CLM-2026-8812")
  encounterId: z.string(),
  patientName: z.string(),
  payerName: z.string(),
  cptCode: z.string(),
  serviceDate: z.string(),
  dos: z.string().optional(),
  status: z.enum(["AwaitingAcknowledgement", "InAdjudication", "Denied", "Rejected", "Paid", "Void", "Draft", "Submitted"]),
  pccn: z.string().optional(),
  billedAmount: z.number(),
  submittedAmount: z.number().optional(),
  allowedAmount: z.number().optional(),
  paidAmount: z.number().optional(),
  acknowledged: z.boolean().optional(),
  timelyDaysRemaining: z.number().optional(),
  source: z.enum(["native", "imported"]).optional(),
});

export type Claim = z.infer<typeof ClaimSchema>;
