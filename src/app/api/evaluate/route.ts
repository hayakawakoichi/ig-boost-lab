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

---

🎯 出力は以下のJSON形式でお願いします:

{
  "recommended": "A または B",
  "reason": "おすすめした理由を200文字以内で簡潔に説明",
  "improvements": {
    "A": "A案の改善点を簡潔に",
    "B": "B案の改善点を簡潔に"
  }
}

※ JSON以外の文字や説明は含めないでください。
※出力はコードブロック（\`\`\`）なしの、純粋なJSON文字列のみでお願いします。
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
    const raw = data.choices?.[0]?.message?.content
        .replace(/```json\s*([\s\S]*?)\s*```/, '$1') // ```json ... ``` の中身だけ抜き出す
        .trim()

    let parsed
    try {
        parsed = JSON.parse(raw)
    } catch (err) {
        parsed = { error: 'AIからの返答を解析できませんでした', raw }
    }
    return NextResponse.json({ result: parsed })
}
