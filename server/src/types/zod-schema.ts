import { z } from "zod";

export const userSchema = z.object({
    name: z.string().min(1),
    email: z.string().email(),
})


export const chatSchema = z.object({
    role: z.string().min(1),
    content: z.string().min(1),
    createdAt: z.date(),
})

export const workspaceSchema = z.object({
    name: z.string().min(1),
    role: z.string().min(1),
    url: z.string().optional(),
})



