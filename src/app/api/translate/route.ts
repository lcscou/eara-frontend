import { NextRequest, NextResponse } from 'next/server'

import { translateWithCache } from '@/lib/translation/kv-cache'

export async function POST(request: NextRequest) {
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

  const totalCharacters = Array.isArray(text)
    ? text.reduce((count, item) => count + item.length, 0)
    : text.length

  if (totalCharacters > 20_000) {
    return NextResponse.json(
      { error: 'Text payload exceeds maximum total size of 20000 characters' },
      { status: 400 }
    )
  }

  try {
    const { cacheKey, cacheStatus, translatedText } = await translateWithCache(
      text,
      target_language
    )

    return NextResponse.json(
      {
        cacheKey,
        cacheStatus,
        translated_text: translatedText,
      },
      {
        headers: {
          'Cache-Control': 'no-store',
          'X-Translation-Cache': cacheStatus,
        },
      }
    )
  } catch (error) {
    console.error('Translation error:', error)

    return NextResponse.json({ error: 'Translation failed' }, { status: 500 })
  }
}
