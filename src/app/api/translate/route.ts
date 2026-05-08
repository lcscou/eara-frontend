import { JigsawStack } from 'jigsawstack'
import { NextRequest, NextResponse } from 'next/server'

const jigsawstack = JigsawStack({
  apiKey: process.env.JIGSAWSTACK_API_KEY!,
})

export async function POST(request: NextRequest) {
  const apiKey = process.env.JIGSAWSTACK_API_KEY
  if (!apiKey) {
    return NextResponse.json({ error: 'Translation service not configured' }, { status: 503 })
  }

  let body: { text: string | string[]; target_language: string }
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 })
  }

  const { text, target_language } = body
  if (!text || !target_language) {
    return NextResponse.json(
      { error: 'Missing required fields: text, target_language' },
      { status: 400 }
    )
  }

  if (typeof text === 'string' && text.length > 5000) {
    return NextResponse.json(
      { error: 'Text exceeds maximum length of 5000 characters' },
      { status: 400 }
    )
  }

  if (Array.isArray(text)) {
    for (const t of text) {
      if (typeof t !== 'string' || t.length > 5000) {
        return NextResponse.json(
          { error: 'Each text item must be a string under 5000 characters' },
          { status: 400 }
        )
      }
    }
  }

  try {
    const response = await jigsawstack.translate.text({
      text,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      target_language: target_language as any,
    })
    return NextResponse.json(response)
  } catch (error) {
    console.error('JigsawStack translate error:', error)
    return NextResponse.json({ error: 'Translation failed' }, { status: 500 })
  }
}
