import { z } from "zod";

export const EncounterLineSchema = z.object({
  cpt: z.string(),
  description: z.string(),
  charge: z.number(),
  paid: z.number(),
  balance: z.number(),
  carc: z.string(),
  plainEnglishReason: z.string(),
});

export const EncounterSchema = z.object({
  id: z.string(),
  encounterId: z.string().optional(),
  billableEventId: z.string(),
  patientName: z.string(),
  providerName: z.string(),
  serviceDate: z.string(),
  dos: z.string().optional(),
  primaryPayer: z.string().optional(),
  secondaryPayer: z.string().optional(),
  totalCharges: z.number().optional(),
  adjustments: z.number().optional(),
  insurancePaid: z.number().optional(),
  patientResponsibility: z.number().optional(),
  prEligible: z.number().optional(),
  prIneligible: z.number().optional(),
  balanceDue: z.number().optional(),
  claimIds: z.array(z.string()),
  invoiceId: z.string().optional(),
  status: z.enum(["Open", "Reconciled", "PendingAdjudication", "Completed", "Billable"]),
  lines: z.array(EncounterLineSchema).optional(),
});

export type EncounterLine = z.infer<typeof EncounterLineSchema>;
export type Encounter = z.infer<typeof EncounterSchema>;
