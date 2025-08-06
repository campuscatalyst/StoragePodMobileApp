import { z } from "zod";

export const renameDeviceSchema = z.object({
    name: z.string().min(5, "Min of 5 characters should be provided").max(20, "Max of 20 characters should be provided")
}); 