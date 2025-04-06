import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
    const body = await req.json()
    const { captionA, captionB, genre, target } = body

    const prompt = `
以下の2つのInstagram投稿キャプションのうち、どちらがより多くのエンゲージメント（いいね、保存、シェア）を獲得しやすいかを評価してください。

【投稿A】
${captionA}

【投稿B】
${captionB}

想定ターゲット：${target || '指定なし'}
投稿ジャンル：${genre || '指定なし'}

評価ポイント：言葉選び、感情の伝え方、共感度、具体性、ハッシュタグの有効性

出力フォーマット：
1. おすすめの投稿（A or B）
2. 理由（300文字以内）
3. それぞれの改善点（任意）
`

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            model: 'gpt-4-0125-preview',
            messages: [
                { role: 'system', content: 'あなたはSNSマーケティングの専門家です。' },
                { role: 'user', content: prompt },
            ],
            temperature: 0.7,
        }),
    })

    const data = await response.json()
    const message = data.choices?.[0]?.message?.content ?? '回答の取得に失敗しました'

    return NextResponse.json({ result: message })
}
