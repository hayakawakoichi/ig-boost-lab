import 'dotenv/config'
import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { logger } from 'hono/logger'
import { evaluateSchema, type EvaluateResult } from './schema'

console.log('OpenAI API Key:', process.env.OPENAI_API_KEY ? '設定されています' : '設定されていません')

const app = new Hono()

app.use('*', logger())
app.use(
    '*',
    cors({
        origin: ['http://localhost:3000', 'http://localhost:3001'],
        allowHeaders: ['Content-Type'],
        allowMethods: ['POST', 'GET', 'OPTIONS'],
    })
)

app.get('/', (c) => {
    return c.json({ message: 'InstaBoostLab API Server' })
})

app.post('/vision-evaluate', async (c) => {
    try {
        const body = await c.req.json()
        const validatedData = evaluateSchema.parse(body)
        const { captionA, captionB, genre, target, imageA, imageB } = validatedData

        if (!imageA || !imageB) {
            return c.json({ error: '画像A/B両方が必要です' }, 400)
        }

        const systemPrompt = 'あなたはSNSマーケティングの専門家です。'

        const userPrompt = `
以下の2つのInstagram投稿のうち、どちらがより多くのエンゲージメント（いいね、保存、シェア）を獲得しやすいかを評価してください。

想定ターゲット：${target || '指定なし'}
投稿ジャンル：${genre || '指定なし'}

評価ポイント：言葉選び、感情の伝え方、共感度、具体性、ハッシュタグの有効性、写真の見やすさ、写真のキャプションの有効性

---

🎯 出力は以下のJSON形式でお願いします:

{
  "recommended": "A または B",
  "reason": "おすすめした理由を、400文字以内で説明してください。添付された画像についてもコメントするようにしてください。",
  "improvements": {
    "A": "A案の改善点を、200文字以内で説明してください。添付された画像についてもコメントするようにしてください。",
    "B": "B案の改善点を、200文字以内で説明してください。添付された画像についてもコメントするようにしてください。"
  }
}

※ JSON以外は含めないでください。
※ 出力はコードブロック（\`\`\`）なしの、純粋なJSON文字列のみでお願いします。
`

        const messages = [
            {
                role: 'system',
                content: systemPrompt,
            },
            {
                role: 'user',
                content: [
                    { type: 'text', text: userPrompt },
                    {
                        type: 'image_url',
                        image_url: {
                            url: imageA,
                            detail: 'high',
                        },
                    },
                    { type: 'text', text: `キャプションA:\n${captionA}` },
                    {
                        type: 'image_url',
                        image_url: {
                            url: imageB,
                            detail: 'high',
                        },
                    },
                    { type: 'text', text: `キャプションB:\n${captionB}` },
                ],
            },
        ]

        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                model: 'gpt-4o-mini',
                messages,
                temperature: 0.7,
            }),
        })

        if (!response.ok) {
            const errorText = await response.text()
            console.error('OpenAI API Error Response:', errorText)
            throw new Error(`OpenAI API error: ${response.status} - ${errorText}`)
        }

        const json = (await response.json()) as any
        const raw = json.choices?.[0]?.message?.content || ''

        try {
            const parsed: EvaluateResult = JSON.parse(raw)
            return c.json({ result: parsed })
        } catch (err) {
            console.error({ err, raw })
            return c.json(
                {
                    error: 'JSONパース失敗',
                    raw,
                },
                500
            )
        }
    } catch (error) {
        console.error('API Error:', error)
        if (error instanceof Error) {
            return c.json({ error: error.message }, 400)
        }
        return c.json({ error: '予期しないエラーが発生しました' }, 500)
    }
})

const port = 3001
console.log(`Server is running on port ${port}`)

serve({
    fetch: app.fetch,
    port,
})
