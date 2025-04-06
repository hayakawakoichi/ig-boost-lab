export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
    const body = await req.json()
    const { captionA, captionB, genre, target, imageA, imageB } = body

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
                    },
                },
                { type: 'text', text: `キャプションA:\n${captionA}` },
                {
                    type: 'image_url',
                    image_url: {
                        url: imageB,
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

    const json = await response.json()
    const raw = json.choices?.[0]?.message?.content || ''

    try {
        const parsed = JSON.parse(raw)
        return NextResponse.json({ result: parsed })
    } catch (err) {
        console.error({ err, raw })
        return NextResponse.json({
            error: 'JSONパース失敗',
            raw,
        })
    }
}
