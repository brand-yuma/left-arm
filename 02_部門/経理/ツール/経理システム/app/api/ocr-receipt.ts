import type { VercelRequest, VercelResponse } from '@vercel/node'

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const apiKey = process.env.ANTHROPIC_API_KEY
  if (!apiKey) {
    return res.status(500).json({ error: 'ANTHROPIC_API_KEY is not configured' })
  }

  const { image, media_type } = req.body
  if (!image || !media_type) {
    return res.status(400).json({ error: 'image and media_type are required' })
  }

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 1024,
        messages: [
          {
            role: 'user',
            content: [
              {
                type: 'image',
                source: { type: 'base64', media_type, data: image },
              },
              {
                type: 'text',
                text: `この領収書/レシート画像から情報を読み取り、以下のJSON形式で返してください。
読み取れない項目はnullにしてください。金額は整数（円単位）で返してください。

{
  "date": "YYYY-MM-DD形式の日付",
  "store": "店名・サービス名",
  "amount": 税込合計金額（整数）,
  "tax": 消費税額（整数、不明ならnull）,
  "items": "購入品目（カンマ区切り）",
  "item_count": 品目の数（整数）,
  "confidence": {
    "date": "high/medium/low",
    "store": "high/medium/low",
    "amount": "high/medium/low",
    "items": "high/medium/low"
  }
}

JSONのみを返してください。説明文は不要です。`,
              },
            ],
          },
        ],
      }),
    })

    if (!response.ok) {
      const errorText = await response.text()
      return res.status(502).json({ error: 'Claude API error', detail: errorText })
    }

    const result = await response.json()
    const text = result.content?.[0]?.text || ''

    // Extract JSON from response
    const jsonMatch = text.match(/\{[\s\S]*\}/)
    if (!jsonMatch) {
      return res.status(502).json({ error: 'Failed to parse OCR result', raw: text })
    }

    const parsed = JSON.parse(jsonMatch[0])
    return res.status(200).json(parsed)
  } catch (error) {
    return res.status(500).json({ error: 'OCR processing failed', detail: String(error) })
  }
}
