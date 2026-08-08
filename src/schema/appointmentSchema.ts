import { z } from "zod";

export const AppointmentSchema = z.object({
  id: z.string(),
  patientName: z.string(),
  providerName: z.string(),
  time: z.string(),
  payerName: z.string(),
  memberId: z.string().optional(),
  eligibilityStatus: z.enum(["Active", "Inactive", "DataMismatch", "Eligible", "Mismatch", "NoCoverage", "Pending"]),
  preVisitStatus: z.enum(["Collected", "LinkSent", "ActionNeeded"]).optional(),
  workflowStatus: z.string(),
  copayAmount: z.number().optional(),
  deductibleRemaining: z.number().optional(),
  submittedMemberId: z.string().optional(),
  returnedMemberId: z.string().optional(),
  billableEventId: z.string().optional(),
});

export type Appointment = z.infer<typeof AppointmentSchema>;
