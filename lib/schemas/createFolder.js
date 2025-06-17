import { z } from "zod";

const folderNameRegex = /^[^/]{1,255}$/;

export const createFolderSchema = z.object({
    folderName: z.string().regex(folderNameRegex, "Invalid folder name"),
}); 
