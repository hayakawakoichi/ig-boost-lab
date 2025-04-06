'use client'

import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'

import { useState } from 'react'
import { EvaluateSchema, evaluateSchema } from './schema'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'

export default function HomePage() {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<EvaluateSchema>({
        mode: 'onBlur',
        resolver: zodResolver(evaluateSchema),
        defaultValues: {
            captionA: '',
            captionB: '',
            genre: '',
            target: '',
        },
    })

    const [result, setResult] = useState<string | null>(null)
    const [loading, setLoading] = useState(false)

    const onSubmit = async (data: EvaluateSchema) => {
        setLoading(true)
        const result = await fetch('/api/evaluate', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        })
        const json = await result.json()
        setResult(json.result)
        setLoading(false)
    }

    return (
        <main className="max-w-2xl mx-auto px-4 py-8 space-y-6">
            <h1 className="text-3xl font-bold text-center">InstaBoostLab</h1>
            <p className="text-center text-muted-foreground">InstagramキャプションA/BをAIが評価します。</p>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div>
                    <Label htmlFor="captionA">キャプションA</Label>
                    <Textarea {...register('captionA')} id="captionA" className="w-full border p-2" />
                    {errors.captionA && <p className="text-red-500 text-sm">{errors.captionA.message}</p>}
                </div>

                <div>
                    <Label htmlFor="captionB">キャプションB</Label>
                    <Textarea {...register('captionB')} id="captionB" className="w-full border p-2" />
                    {errors.captionB && <p className="text-red-500 text-sm">{errors.captionB.message}</p>}
                </div>

                <div>
                    <Label htmlFor="genre">投稿ジャンル</Label>
                    <Input {...register('genre')} id="genre" className="w-full border p-2" />
                </div>

                <div>
                    <Label htmlFor="target">ターゲット層</Label>
                    <Input {...register('target')} id="target" className="w-full border p-2" />
                </div>

                <Button type="submit" className="w-full bg-blue-600 text-white py-2 rounded-md">
                    AIに評価してもらう
                </Button>
            </form>

            {loading && <p>評価中...</p>}
            {result && (
                <div className="mt-6 p-4 border rounded-md bg-muted">
                    <h2 className="font-semibold">🧠 AIの評価結果</h2>
                    <pre className="whitespace-pre-wrap text-sm">{result}</pre>
                </div>
            )}
        </main>
    )
}
