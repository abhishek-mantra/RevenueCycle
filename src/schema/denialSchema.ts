import { z } from "zod";

export const CarcSchema = z.object({
  code: z.string(),
  description: z.string(),
});

export const RarcSchema = z.object({
  code: z.string(),
  description: z.string(),
});

export const DenialClaimItemSchema = z.object({
  id: z.string(),
  claimId: z.string(),
  encounterId: z.string(),
  patientId: z.string(),
  patientName: z.string(),
  providerId: z.string(),
  providerName: z.string(),
  dos: z.string(),
  cptCode: z.string(),
  amount: z.number(),
  timelyFilingDeadline: z.string(),
  timelyDaysRemaining: z.number(),
  priorityScore: z.number(),
  sessionNoteEvidenceSnippet: z.string(),
  status: z.enum(["Denied", "Resubmitted", "Reconciled", "Approved"]),
});

export const DenialClusterGroupSchema = z.object({
  id: z.string(),
  payerId: z.string(),
  payerName: z.string(),
  denialReason: z.string(),
  carc: CarcSchema,
  rarcs: z.array(RarcSchema),
  totalAmountAtRisk: z.number(),
  claimCount: z.number(),
  highestPriority: z.enum(["Critical", "High", "Standard"]),
  suggestedFixSummary: z.string(),
  appealDraftTemplate: z.string(),
  claims: z.array(DenialClaimItemSchema),
});

export type Carc = z.infer<typeof CarcSchema>;
export type Rarc = z.infer<typeof RarcSchema>;
export type DenialClaimItem = z.infer<typeof DenialClaimItemSchema>;
export type DenialClusterGroup = z.infer<typeof DenialClusterGroupSchema>;
