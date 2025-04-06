import { Card, CardContent } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import Image from 'next/image'
import { FormControl, FormDescription, FormItem, FormMessage } from './ui/form'
import { FormLabel } from './ui/form'
import { FormField } from './ui/form'
import { evaluateModel, EvaluateSchema } from '@/app/schema'
import { TooltipContent, TooltipTrigger } from './ui/tooltip'
import { Tooltip } from './ui/tooltip'
import { TooltipProvider } from './ui/tooltip'
import { Button } from './ui/button'
import { InfoIcon } from 'lucide-react'
import { UseFormReturn } from 'react-hook-form'

type PostCardProps = {
    label: string
    imagePreview: string | null
    onImageChange: (file: File | null) => void
    captionFieldProps: React.TextareaHTMLAttributes<HTMLTextAreaElement>
    form: UseFormReturn<EvaluateSchema>
    name: 'captionA' | 'captionB'
}

export function PostCard({ label, imagePreview, onImageChange, form, name }: PostCardProps) {
    return (
        <Card className="p-4 space-y-4">
            <h3 className="text-lg font-semibold">{label}</h3>

            <div className="space-y-2">
                <FormLabel htmlFor="image">画像アップロード</FormLabel>
                <Input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                        const file = e.target.files?.[0] || null
                        onImageChange(file)
                    }}
                />
                {imagePreview && (
                    <Image
                        src={imagePreview}
                        alt="プレビュー"
                        width={300}
                        height={300}
                        className="rounded-md object-cover"
                    />
                )}
            </div>

            <FormField
                control={form.control}
                name={name}
                render={({ field }) => (
                    <FormItem>
                        <div className="flex items-center gap-2">
                            <FormLabel htmlFor="captionA">{evaluateModel[name].description}</FormLabel>
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
                            {field.value?.length || 0} / {evaluateModel[name].maxLength}
                        </FormDescription>
                        <FormMessage />
                    </FormItem>
                )}
            />
        </Card>
    )
}
