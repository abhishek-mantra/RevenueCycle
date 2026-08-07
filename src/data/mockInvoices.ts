import { Invoice } from "@/schema/invoiceSchema";

export const mockInvoices: Invoice[] = [
  {
    id: "INV-1001",
    invoiceNumber: "INV-2026-001",
    encounterId: "ENC-401",
    patientId: "PAT-001",
    patientName: "Sarah Jenkins",
    patientEmail: "sarah.j@example.com",
    status: "Paid",
    issuedDate: "2026-08-04",
    dueDate: "2026-08-18",
    totalAmount: 30.0,
    amountPaid: 30.0,
    balanceDue: 0.0,
    lineItems: [
      {
        id: "L-1",
        description: "Adjudicated Co-payment — Session 2026-08-04",
        cptCode: "90837",
        amount: 30.0,
      },
    ],
    receipts: [
      {
        id: "REC-501",
        invoiceId: "INV-1001",
        amountPaid: 30.0,
        timestamp: "2026-08-04 16:45:00",
        paymentMethod: "CardOnFile",
        receiptNumber: "REC-2026-001",
      },
    ],
  },
  {
    id: "INV-1002",
    invoiceNumber: "INV-2026-002",
    encounterId: "ENC-403",
    patientId: "PAT-003",
    patientName: "Elena Rostova",
    patientEmail: "elena.r@example.com",
    status: "Sent",
    issuedDate: "2026-08-03",
    dueDate: "2026-08-17",
    totalAmount: 125.0,
    amountPaid: 0.0,
    balanceDue: 125.0,
    lineItems: [
      {
        id: "L-2",
        description: "Post-Adjudication Deductible Balance — Session 2026-08-02",
        cptCode: "90834",
        amount: 125.0,
      },
    ],
    receipts: [],
  },
  {
    id: "INV-1003",
    invoiceNumber: "INV-2026-003",
    encounterId: null, // Standalone Invoice
    patientId: "PAT-004",
    patientName: "David Miller",
    patientEmail: "david.m@example.com",
    status: "Overdue",
    issuedDate: "2026-07-20",
    dueDate: "2026-08-03",
    totalAmount: 175.0,
    amountPaid: 0.0,
    balanceDue: 175.0,
    lineItems: [
      {
        id: "L-3",
        description: "Out-of-Network Private Pay Psychotherapy Session",
        cptCode: "90837",
        amount: 175.0,
      },
    ],
    receipts: [],
  },
];
