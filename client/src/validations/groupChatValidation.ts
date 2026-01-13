import {z} from "zod"

export const createChatSchema = z.object({
    title: z.string().min(4, {message: "Title must be at least 4 characters long"}).max(191, {message: "Chat title must less than 191 characters"}),
    passcode: z.string().min(4, {message: "Passcode must be at least 4 characters long"}).max(25, {message: "Chat title must less than 25 characters"})
}).required();


export type createChatSchemaType = z.infer<typeof createChatSchema>;