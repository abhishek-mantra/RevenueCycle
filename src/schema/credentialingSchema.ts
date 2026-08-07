import { z } from "zod";

export const CredentialingVaultEntrySchema = z.object({
  id: z.string(),
  providerId: z.string(),
  providerName: z.string(),
  payerId: z.string(),
  payerName: z.string(),
  trueCredentialingStatus: z.enum(["NotCredentialed", "Pending", "Credentialed"]),
  transactionEnrollmentStatus: z.enum([
    "NotEnrolled",
    "EnrollmentPending",
    "ProviderActionRequired",
    "Live",
    "Rejected",
  ]),
  effectiveDate: z.string(),
  terminationDate: z.string().nullable(),
  npi: z.string(),
  taxId: z.string(),
  isServiceDateValid: z.boolean(),
});

export type CredentialingVaultEntry = z.infer<typeof CredentialingVaultEntrySchema>;
