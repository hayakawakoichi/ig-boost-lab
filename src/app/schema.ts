import { z } from 'zod'

export const evaluateModel = {
    captionA: z
        .string()
        .min(1, 'キャプションAは必須です')
        .max(2200, 'キャプションAは2200文字以内で入力してください')
        .describe('キャプションA'),
    captionB: z
        .string()
        .min(1, 'キャプションBは必須です')
        .max(2200, 'キャプションBは2200文字以内で入力してください')
        .describe('キャプションB'),
    genre: z.string().max(100, 'ジャンルは100文字以内で入力してください').optional().describe('ジャンル'),
    target: z.string().max(100, 'ターゲット層は100文字以内で入力してください').optional().describe('ターゲット層'),
}

export const evaluateSchema = z.object(evaluateModel)

export type EvaluateSchema = z.infer<typeof evaluateSchema>

export type EvaluateResult = {
    recommended: string
    reason: string
    improvements: {
        A: string
        B: string
    }
    error?: string
}
