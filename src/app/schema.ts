import { z } from 'zod'

export const evaluateSchema = z.object({
    captionA: z.string().min(1, 'キャプションAは必須です'),
    captionB: z.string().min(1, 'キャプションBは必須です'),
    genre: z.string().optional(),
    target: z.string().optional(),
})

export type EvaluateSchema = z.infer<typeof evaluateSchema>
