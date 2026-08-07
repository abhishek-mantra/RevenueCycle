import { z } from "zod";

export const MonthlyRevenuePointSchema = z.object({
  month: z.string(),
  insurancePaid: z.number(),
  patientPaid: z.number(),
  total: z.number(),
});

export const PayerPerformanceRowSchema = z.object({
  id: z.string(),
  payerId: z.string(),
  payerName: z.string(),
  approvalRate30d: z.number(),
  approvalRate60d: z.number(),
  approvalRateAllTime: z.number(),
  patientMixPct: z.number(),
  avgDaysToPay: z.number(),
  effectiveHourlyRate: z.number(),
  statusTone: z.enum(["success", "warning", "critical"]),
});

export const ContractVarianceItemSchema = z.object({
  id: z.string(),
  claimId: z.string(),
  payerName: z.string(),
  cptCode: z.string(),
  contractedRate: z.number(),
  actualPaidAmount: z.number(),
  underpaymentVariance: z.number(),
  clauseCite: z.string(),
  status: z.enum(["Flagged", "Disputed", "Resolved"]),
});

export type MonthlyRevenuePoint = z.infer<typeof MonthlyRevenuePointSchema>;
export type PayerPerformanceRow = z.infer<typeof PayerPerformanceRowSchema>;
export type ContractVarianceItem = z.infer<typeof ContractVarianceItemSchema>;
