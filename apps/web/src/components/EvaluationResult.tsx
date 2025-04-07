import { EvaluateResult } from '../app/schema'
import { ThumbsUp, MessageCircle, Lightbulb } from 'lucide-react'

type EvaluationResultProps = {
    result: EvaluateResult
}

export function EvaluationResult({ result }: EvaluationResultProps) {
    if (result.error) return null

    return (
        <div className="mt-8 space-y-6">
            <div className="flex items-center justify-center">
                <div className="flex items-center gap-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-full shadow-sm">
                    <ThumbsUp className="w-4 h-4" />
                    <span className="text-sm font-semibold">AIのおすすめは「{result.recommended}案」です</span>
                </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
                <div className="flex items-center gap-2 mb-2 text-gray-800 font-semibold">
                    <MessageCircle className="w-4 h-4" />
                    <span>理由</span>
                </div>
                <p className="text-sm text-gray-700 whitespace-pre-wrap">{result.reason}</p>
            </div>

            <div className="space-y-4">
                <div className="flex items-center gap-2 text-gray-800 font-semibold">
                    <Lightbulb className="w-4 h-4" />
                    <span>改善点</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {result.improvements?.A && (
                        <div className="bg-muted p-4 rounded-md shadow-sm">
                            <p className="font-semibold mb-1">A案</p>
                            <p className="text-sm text-gray-700 whitespace-pre-wrap">{result.improvements.A}</p>
                        </div>
                    )}
                    {result.improvements?.B && (
                        <div className="bg-muted p-4 rounded-md shadow-sm">
                            <p className="font-semibold mb-1">B案</p>
                            <p className="text-sm text-gray-700 whitespace-pre-wrap">{result.improvements.B}</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
