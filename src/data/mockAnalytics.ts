import {
  MonthlyRevenuePoint,
  PayerPerformanceRow,
  ContractVarianceItem,
} from "@/schema/analyticsSchema";

export const mockMonthlyRevenueData: MonthlyRevenuePoint[] = [
  { month: "Jan", insurancePaid: 42000, patientPaid: 12500, total: 54500 },
  { month: "Feb", insurancePaid: 46500, patientPaid: 14200, total: 60700 },
  { month: "Mar", insurancePaid: 51000, patientPaid: 15800, total: 66800 },
  { month: "Apr", insurancePaid: 48900, patientPaid: 13900, total: 62800 },
  { month: "May", insurancePaid: 55400, patientPaid: 16900, total: 72300 },
  { month: "Jun", insurancePaid: 62100, patientPaid: 18400, total: 80500 },
  { month: "Jul", insurancePaid: 68500, patientPaid: 20100, total: 88600 },
];

export const mockPayerPerformance: PayerPerformanceRow[] = [
  {
    id: "PAY-1",
    payerId: "payer-bcbs",
    payerName: "Blue Cross Blue Shield",
    approvalRate30d: 95.6,
    approvalRate60d: 94.2,
    approvalRateAllTime: 94.8,
    patientMixPct: 38.5,
    avgDaysToPay: 12.4,
    effectiveHourlyRate: 142.5,
    statusTone: "success",
  },
  {
    id: "PAY-2",
    payerId: "payer-aetna",
    payerName: "Aetna Behavioral Health",
    approvalRate30d: 88.2,
    approvalRate60d: 86.4,
    approvalRateAllTime: 87.1,
    patientMixPct: 24.0,
    avgDaysToPay: 19.8,
    effectiveHourlyRate: 118.0,
    statusTone: "warning",
  },
  {
    id: "PAY-3",
    payerId: "payer-uhc",
    payerName: "United Healthcare",
    approvalRate30d: 62.0,
    approvalRate60d: 64.5,
    approvalRateAllTime: 65.2,
    patientMixPct: 18.8,
    avgDaysToPay: 28.5,
    effectiveHourlyRate: 84.2, // Low ROI! High admin burden!
    statusTone: "critical",
  },
  {
    id: "PAY-4",
    payerId: "payer-cigna",
    payerName: "Cigna Health",
    approvalRate30d: 91.0,
    approvalRate60d: 90.5,
    approvalRateAllTime: 91.2,
    patientMixPct: 18.7,
    avgDaysToPay: 14.1,
    effectiveHourlyRate: 131.0,
    statusTone: "success",
  },
];

export const mockContractVariances: ContractVarianceItem[] = [
  {
    id: "VAR-101",
    claimId: "CLM-2026-8812",
    payerName: "United Healthcare",
    cptCode: "90837",
    contractedRate: 160.0,
    actualPaidAmount: 145.0,
    underpaymentVariance: 15.0,
    clauseCite: "Fee Schedule Addendum B §4.2 (2026 Outpatient Psychotherapy Rate)",
    status: "Flagged",
  },
  {
    id: "VAR-102",
    claimId: "CLM-2026-9045",
    payerName: "Aetna Behavioral Health",
    cptCode: "90791",
    contractedRate: 210.0,
    actualPaidAmount: 185.0,
    underpaymentVariance: 25.0,
    clauseCite: "Behavioral Health Specialist Rate Schedule 2025-2026 §1.1",
    status: "Disputed",
  },
];
