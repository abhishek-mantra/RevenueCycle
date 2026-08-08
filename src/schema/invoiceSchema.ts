import { z } from "zod";

export const InvoiceItemSchema = z.object({
  cpt: z.string(),
  description: z.string(),
  dos: z.string(),
  charge: z.number(),
  insuranceCovered: z.number(),
  patientDue: z.number(),
});

export const InvoiceSchema = z.object({
  id: z.string(),
  invoiceNumber: z.string(),
  encounterId: z.string().nullable(),
  patientId: z.string(),
  patientName: z.string(),
  patientEmail: z.string().optional(),
  issueDate: z.string(),
  issuedDate: z.string().optional(),
  createdDate: z.string().optional(),
  dueDate: z.string(),
  totalAmount: z.number(),
  insurancePaid: z.number().optional(),
  patientResponsibility: z.number().optional(),
  amountPaid: z.number(),
  balanceDue: z.number(),
  status: z.enum(["Draft", "Sent", "PartiallyPaid", "Paid", "Overdue", "Void"]),
  receipts: z.array(
    z.object({
      id: z.string(),
      receiptNumber: z.string().optional(),
      paymentDate: z.string(),
      amount: z.number(),
      method: z.string(),
      reference: z.string(),
    })
  ),
  items: z.array(InvoiceItemSchema).optional(),
  lineItems: z.array(InvoiceItemSchema).optional(),
});

export type InvoiceItem = z.infer<typeof InvoiceItemSchema>;
export type Invoice = z.infer<typeof InvoiceSchema>;
