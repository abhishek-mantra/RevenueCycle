import { z } from "zod";

export const InvoiceLineItemSchema = z.object({
  id: z.string(),
  description: z.string(),
  cptCode: z.string().optional(),
  amount: z.number(),
});

export const ReceiptSchema = z.object({
  id: z.string(),
  invoiceId: z.string(),
  amountPaid: z.number(),
  timestamp: z.string(),
  paymentMethod: z.enum(["Card", "ApplePay", "Link", "CardOnFile", "Manual"]),
  receiptNumber: z.string(),
});

export const InvoiceSchema = z.object({
  id: z.string(),
  invoiceNumber: z.string(),
  encounterId: z.string().nullable(),
  patientId: z.string(),
  patientName: z.string(),
  patientEmail: z.string(),
  status: z.enum(["Draft", "Sent", "Paid", "PartiallyPaid", "Overdue", "Void"]),
  issuedDate: z.string(),
  dueDate: z.string(),
  totalAmount: z.number(),
  amountPaid: z.number(),
  balanceDue: z.number(),
  lineItems: z.array(InvoiceLineItemSchema),
  receipts: z.array(ReceiptSchema),
});

export type InvoiceLineItem = z.infer<typeof InvoiceLineItemSchema>;
export type Receipt = z.infer<typeof ReceiptSchema>;
export type Invoice = z.infer<typeof InvoiceSchema>;
