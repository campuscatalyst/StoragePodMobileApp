import { z } from "zod";

const additionalCommentsSchema = z.object({
  comments: z
    .string()
    .trim()
    .min(10, "Please provide feedback")
    .max(255, "Additional feedback should be less than 255 characters"),
});

export default additionalCommentsSchema;
