import { z } from "zod";

export const BillableEventSchema = z.object({
  id: z.string(),
  patientName: z.string(),
  providerName: z.string(),
  serviceDate: z.string(),
  cptCode: z.string(),
  signedNoteLocked: z.boolean(),
  invoiceGenerated: z.boolean(),
  encounterId: z.string().optional(),
});

export type BillableEvent = z.infer<typeof BillableEventSchema>;
