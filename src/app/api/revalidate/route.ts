import { revalidatePath, revalidateTag } from 'next/cache'
import { NextRequest, NextResponse } from 'next/server'

import { getSiteConfig, getSiteConfigByKey } from '@/lib/site-config'

const REVALIDATE_TAG_PROFILE = 'max'

export async function POST(request: NextRequest) {
  try {
    // Validar token de segurança
    const secret = request.headers.get('x-revalidate-secret')

    if (secret !== process.env.REVALIDATE_SECRET) {
      console.error('Invalid revalidation secret')
      return NextResponse.json({ error: 'Invalid secret' }, { status: 401 })
    }

    const body = await request.json()
    const { path, tag, type, siteKey } = body
    const site = siteKey
      ? getSiteConfigByKey(siteKey)
      : getSiteConfig(request.headers.get('x-forwarded-host') || request.headers.get('host') || '')

    if (!site) {
      return NextResponse.json({ error: 'Unknown site.' }, { status: 400 })
    }

    const siteTag = (value: string) => `site:${site.key}:${value}`

    console.log('Revalidation request:', { path, tag, type, siteKey: site.key })

    // Revalidar por path específico
    if (path) {
      await revalidatePath(path)
      console.log(`Revalidated path: ${path}`)
    }

    // Revalidar por tag
    if (tag) {
      revalidateTag(siteTag(tag), REVALIDATE_TAG_PROFILE)
      console.log(`Revalidated tag: ${siteTag(tag)}`)
    }

    // Revalidar rotas relacionadas baseado no tipo
    if (type) {
      switch (type) {
        case 'post':
        case 'news':
          revalidatePath('/news')
          revalidateTag(siteTag('news'), REVALIDATE_TAG_PROFILE)
          console.log('Revalidated news archive')
          break

        case 'events':
          revalidatePath('/events')
          revalidateTag(siteTag('events'), REVALIDATE_TAG_PROFILE)
          console.log('Revalidated events archive')
          break

        case 'case-studies':
          revalidatePath('/case-studies')
          revalidateTag(siteTag('case-studies'), REVALIDATE_TAG_PROFILE)
          console.log('Revalidated case studies archive')
          break

        case 'animal':
          revalidatePath('/animals')
          revalidateTag(siteTag('animals'), REVALIDATE_TAG_PROFILE)
          console.log('Revalidated animals archive')
          break

        case 'member':
          revalidatePath('/members')
          revalidateTag(siteTag('members'), REVALIDATE_TAG_PROFILE)
          console.log('Revalidated members archive')
          break

        case 'page':
          revalidateTag(siteTag('pages'), REVALIDATE_TAG_PROFILE)
          console.log('Revalidated pages')
          break

        case 'team':
          revalidatePath('/team')
          revalidateTag(siteTag('team'), REVALIDATE_TAG_PROFILE)
          console.log('Revalidated team archive')
          break
        case 'press-release':
          revalidatePath('/press-releases')
          revalidateTag(siteTag('press-release'), REVALIDATE_TAG_PROFILE)
          console.log('Revalidated press releases archive')
          break

        case 'menu':
        case 'menus':
          revalidateTag(siteTag('menus'), REVALIDATE_TAG_PROFILE)
          console.log('Revalidated menus')
          break

        case 'ticker':
        case 'tickers':
          revalidateTag(siteTag('tickers'), REVALIDATE_TAG_PROFILE)
          console.log('Revalidated tickers')
          break
      }
    }

    return NextResponse.json({
      revalidated: true,
      timestamp: Date.now(),
      path,
      tag,
      type,
      siteKey: site.key,
    })
  } catch (error) {
    console.error('Revalidation error:', error)
    return NextResponse.json(
      {
        error: 'Failed to revalidate',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}
