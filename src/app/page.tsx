'use client'

import { Input } from '@/components/ui/input'
import { LoadingButton } from '@/components/ui/button'

import { useState } from 'react'
import { EvaluateSchema, evaluateSchema, EvaluateResult, evaluateModel } from './schema'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { Form, FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from '@/components/ui/form'
import { PostCard } from '@/components/PostCard'
import { toast } from 'sonner'
import { EvaluationResult } from '@/components/EvaluationResult'

export default function HomePage() {
    const form = useForm<EvaluateSchema>({
        mode: 'onChange',
        resolver: zodResolver(evaluateSchema),
        defaultValues: {
            captionA: '',
            captionB: '',
            genre: '',
            target: '',
        },
    })

    const [result, setResult] = useState<EvaluateResult | null>(null)
    const [loading, setLoading] = useState(false)

    const [imageA, setImageA] = useState<File | null>(null)
    const [imageB, setImageB] = useState<File | null>(null)
    const [previewA, setPreviewA] = useState<string | null>(null)
    const [previewB, setPreviewB] = useState<string | null>(null)

    const handleImageChange = (
        file: File | null,
        setImage: (f: File | null) => void,
        setPreview: (s: string | null) => void
    ) => {
        setImage(file)
        if (file) {
            const reader = new FileReader()
            reader.onloadend = () => {
                setPreview(reader.result as string)
            }
            reader.readAsDataURL(file)
        } else {
            setPreview(null)
        }
    }

    const onSubmit = async (data: EvaluateSchema) => {
        setLoading(true)

        if (!imageA || !imageB) {
            alert('画像A/B両方をアップロードしてください')
            return
        }

        try {
            const [base64A, base64B] = await Promise.all([toBase64(imageA), toBase64(imageB)])

            const payload = {
                ...data,
                imageA: base64A,
                imageB: base64B,
            }

            const res = await fetch('/api/vision-evaluate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            })

            const json = await res.json()
            setResult(json.result)
            toast.success('✨ 評価が完了しました 🎉')
        } catch (error) {
            console.error('エラー:', error)
            toast.error('⚠️ 評価に失敗しました')
        }

        setLoading(false)
    }

    return (
        <main className="max-w-2xl mx-auto px-4 py-8 space-y-6">
            <h1 className="text-3xl font-bold text-center">InstaBoostLab</h1>
            <p className="text-center text-muted-foreground">InstagramキャプションA/BをAIが評価します。</p>

            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <PostCard
                            label="A案"
                            name="captionA"
                            imagePreview={previewA}
                            onImageChange={(f) => handleImageChange(f, setImageA, setPreviewA)}
                            captionFieldProps={form.register('captionA', { required: true })}
                            form={form}
                        />
                        <PostCard
                            label="B案"
                            name="captionB"
                            imagePreview={previewB}
                            onImageChange={(f) => handleImageChange(f, setImageB, setPreviewB)}
                            captionFieldProps={form.register('captionB', { required: true })}
                            form={form}
                        />
                    </div>

                    <FormField
                        control={form.control}
                        name="genre"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel htmlFor="genre">{evaluateModel.genre.description}</FormLabel>
                                <FormControl>
                                    <Input
                                        {...field}
                                        id="genre"
                                        className="w-full border p-2"
                                        placeholder="例: ファッション、美容"
                                    />
                                </FormControl>
                                <FormDescription className="text-right text-xs text-muted-foreground">
                                    {field.value?.length || 0} / {evaluateModel.genre.unwrap().maxLength}
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="target"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel htmlFor="target">{evaluateModel.target.description}</FormLabel>
                                <FormControl>
                                    <Input
                                        {...field}
                                        id="target"
                                        className="w-full border p-2"
                                        placeholder="例: 20代女性"
                                    />
                                </FormControl>
                                <FormDescription className="text-right text-xs text-muted-foreground">
                                    {field.value?.length || 0} / {evaluateModel.target.unwrap().maxLength}
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <LoadingButton
                        type="submit"
                        className="w-full bg-blue-600 text-white py-2 rounded-md"
                        disabled={loading || !form.formState.isValid}
                        loading={loading}
                    >
                        AIに評価してもらう
                    </LoadingButton>
                </form>
            </Form>

            {result && <EvaluationResult result={result} />}
        </main>
    )
}

function toBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.onloadend = () => resolve(reader.result as string)
        reader.onerror = reject
        reader.readAsDataURL(file)
    })
}
