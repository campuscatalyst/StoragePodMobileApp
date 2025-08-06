import { z } from "zod";

export const renameItemSchema = z.object({
    name: z.string().nonempty("Name shouldn't be empty")
}); 