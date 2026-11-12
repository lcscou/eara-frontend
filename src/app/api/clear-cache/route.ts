import { revalidatePath, revalidateTag } from 'next/cache'
import { NextResponse } from 'next/server'

import { getCurrentServerSiteConfig } from '@/lib/site-config-server'

const REVALIDATE_TAG_PROFILE = 'max'

export async function GET() {
  try {
    console.log('Starting cache clear...')
    const site = await getCurrentServerSiteConfig()
    const siteTag = (tag: string) => `site:${site.key}:${tag}`

    // Revalidar todas as tags
    const tags = [
      'menus',
      'tickers',
      'news',
      'events',
      'case-studies',
      'animals',
      'members',
      'pages',
      'diseases',
      'team',
      'media-bank',
      'press-release',
    ]

    tags.forEach((tag) => {
      revalidateTag(siteTag(tag), REVALIDATE_TAG_PROFILE)
      console.log(`Revalidated tag: ${siteTag(tag)}`)
    })

    // Revalidar paths principais
    const paths = [
      '/',
      '/news',
      '/events',
      '/case-studies',
      '/animals',
      '/members',
      '/team',
      '/diseases',
      '/transparency/media-bank',
      '/press-releases',
    ]

    paths.forEach((path) => {
      revalidatePath(path)
      console.log(`Revalidated path: ${path}`)
    })

    // Revalidar layout
    revalidatePath('/', 'layout')
    console.log('Revalidated root layout')

    return NextResponse.json({
      success: true,
      message: 'All caches cleared successfully',
      timestamp: Date.now(),
      clearedTags: tags,
      clearedPaths: paths,
    })
  } catch (error) {
    console.error('Cache clear error:', error)
    return NextResponse.json(
      {
        error: 'Failed to clear cache',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}
