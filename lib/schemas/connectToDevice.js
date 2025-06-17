import { z } from "zod";

export const connectToDeviceSchema = z.object({
    username: z.string().min(5, "Username is required"),
    password: z.string().min(8, "Min of 8 characters should be provided").max(20, "Max of 20 characters should be provided")
}); 
