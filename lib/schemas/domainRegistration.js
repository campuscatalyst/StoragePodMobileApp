import { z } from "zod";

//const hostnameRegex = /^\s*((?=.{1,255}$)(?:[a-zA-Z0-9](?:[a-zA-Z0-9\-]{0,61}[a-zA-Z0-9])?\.)*)campuscatalyst\.info\.?\s*$/;

export const domainRegistrationSchema = z.object({
    domain: z.string().nonempty(),
}); 
