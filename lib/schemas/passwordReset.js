import { z } from "zod";

export const passwordResetSchema = z.object({
    password: z.string().min(8, "Min of 8 characters should be provided").max(20, "Max of 20 characters should be provided")
}); 