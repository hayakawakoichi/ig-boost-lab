'use client'

import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'

import { useState } from 'react'
import { EvaluateSchema, evaluateSchema, EvaluateResult, evaluateModel } from './schema'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { Form, FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from '@/components/ui/form'
import { TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { Tooltip } from '@/components/ui/tooltip'
import { TooltipProvider } from '@/components/ui/tooltip'
import { InfoIcon } from 'lucide-react'

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

            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <FormField
                        control={form.control}
                        name="captionA"
                        render={({ field }) => (
                            <FormItem>
                                <div className="flex items-center gap-2">
                                    <FormLabel htmlFor="captionA">{evaluateModel.captionA.description}</FormLabel>
                                    <TooltipProvider>
                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <Button variant="ghost" size="icon" className="h-4 w-4" type="button">
                                                    <InfoIcon className="h-3 w-3" />
                                                </Button>
                                            </TooltipTrigger>
                                            <TooltipContent side="right" className="max-w-[280px]">
                                                <p>
                                                    例:
                                                    <br />
                                                    京都の紅葉シーズンにふらっと一人旅🍁
                                                    <br />
                                                    早朝の清水寺は空気が澄んでて、本当に気持ちよかった。
                                                </p>
                                            </TooltipContent>
                                        </Tooltip>
                                    </TooltipProvider>
                                </div>
                                <FormControl>
                                    <Textarea {...field} id="captionA" className="w-full border p-2" />
                                </FormControl>
                                <FormDescription className="text-right text-xs text-muted-foreground">
                                    {field.value?.length || 0} / {evaluateModel.captionA.maxLength}
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="captionB"
                        render={({ field }) => (
                            <FormItem>
                                <div className="flex items-center gap-2">
                                    <FormLabel htmlFor="captionB">{evaluateModel.captionB.description}</FormLabel>
                                    <TooltipProvider>
                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <Button variant="ghost" size="icon" className="h-4 w-4" type="button">
                                                    <InfoIcon className="h-3 w-3" />
                                                </Button>
                                            </TooltipTrigger>
                                            <TooltipContent side="right" className="max-w-[280px]">
                                                <p>
                                                    例:
                                                    <br />
                                                    朝の清水寺で心が整った。こういう時間、大事。
                                                    <br />
                                                    #京都旅行 #紅葉シーズン #ひとり旅
                                                </p>
                                            </TooltipContent>
                                        </Tooltip>
                                    </TooltipProvider>
                                </div>
                                <FormControl>
                                    <Textarea {...field} id="captionB" className="w-full border p-2" />
                                </FormControl>
                                <FormDescription className="text-right text-xs text-muted-foreground">
                                    {field.value?.length || 0} / {evaluateModel.captionB.maxLength}
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

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

                    <Button type="submit" className="w-full bg-blue-600 text-white py-2 rounded-md">
                        AIに評価してもらう
                    </Button>
                </form>
            </Form>

            {loading && <p>評価中...</p>}
            {result && !result.error && (
                <div className="mt-6 p-4 border rounded-md bg-muted space-y-2">
                    <p>
                        ✅ <strong>おすすめ：</strong> {result.recommended}案
                    </p>
                    <p>
                        💬 <strong>理由：</strong> {result.reason}
                    </p>
                    <div>
                        <p className="font-semibold">💡 改善点</p>
                        <ul className="list-disc list-inside text-sm text-gray-800">
                            {result.improvements?.A && <li>A案: {result.improvements.A}</li>}
                            {result.improvements?.B && <li>B案: {result.improvements.B}</li>}
                        </ul>
                    </div>
                </div>
            )}
        </main>
    )
}
