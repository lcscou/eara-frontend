import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

const YOAST_SITEMAP_FILE_REGEX = /^(?:.*\/)?[^/]*sitemap[^/]*\.(xml|xsl)$/i

const redirects: Record<string, string> = {
  '/post/feature-animal-research-saves-lives-so-why-do-opponents-say-it-is-ineffective':
    '/news/feature-animal-research-saves-lives-so-why-do-opponents-say-it-is-ineffective',
  '/mice-and-animal-research': '/animals/mice',
  '/why-dogs-are-used-in-research': '/animals/dogs',
  '/pigs-and-animal-research': '/animals/pigs',
  '/zebrafish-and-animal-research': '/animals/zebrafish',
  '/monkeys-and-animal-research': '/animals/monkeys',
  '/our-members': '/members',
  '/the-3rs-in-animal-research': '/any-alternatives/what-are-the-3rs',
  '/animal-research-law': '/policy/eu-regulations',
  '/media-training': '/projects/workshops-and-media-training',
  '/alternatives-to-research': '/any-alternatives/nams',
  '/replacing-animals-in-biomedical-research': '/any-alternatives/what-are-the-3rs',
  '/animal-research-and-diseases': '/diseases',
  '/why-are-animals-used-cancer-research': '/diseases/cancer',
  '/why-are-animals-used-in-brain-research': '/diseases/brain',
  '/animal-research-and-diseases/animals-in-rare-disease': '/diseases/rare-diseases',
  '/why-are-animals-used-infectious-disease': '/diseases/infectious-diseases',
  '/animal-research-in-covid-19': '/diseases/infectious-diseases',
  '/40-reasons': '/why-animals-are-needed',
  '/40-raisons-pour': '/why-animals-are-needed',
  '/cuarenta-razones-para-defender-la-i': '/why-animals-are-needed',
  '/40-grunde-warum-wir-tierversuche-in': '/why-animals-are-needed',
  '/40-razoes-pelas': '/why-animals-are-needed',
  '/small-mammals-and-animal-research': '/animals/small-mammals',
  '/eara-conference-2025': '/projects/eara-conference',
  '/genetically-altered-animals-in-research': '/policy/eu-regulations',
  '/non-technical-summaries': '/transparency/what-are-non-technical-summaries',
  '/animal-research-info': '/why-animals-are-needed',
  '/animal-research-alternatives': '/any-alternatives/nams',
  '/why-are-animals-used-in-basic-research': '/diseases/basicresearch',
  '/coronavirus-updates': '/diseases/infectious-diseases',
  '/cosmetic-ban': '/policy/eu-regulations',
  '/assessing-the-severity-of-animal-procedures': '/policy/eu-regulations',
  '/forty-reasons-why-it': '/why-animals-are-needed',
  '/get-on-board22': '/board22',
  '/get-on-board21': '/board21',
  '/about-board25': '/board25',
  '/eara2025': '/projects/eara-conference',
  '/get-on-board23': '/board23',
  '/de': '/projects/ambassadors-nework',
  '/es': '/projects/ambassadors-nework',
  '/switzerland': '/projects/ambassadors-nework',
  '/copy-of-greece': '/projects/ambassadors-nework',
  '/copy-of-uk': '/projects/ambassadors-nework',
  '/czechia': '/projects/ambassadors-nework',
  '/france': '/projects/ambassadors-nework',
  '/austria': '/projects/ambassadors-nework',
  '/countries': '/projects/ambassadors-nework',
  '/israel': '/projects/ambassadors-nework',
  '/sweden': '/projects/ambassadors-nework',
  '/portugal': '/projects/ambassadors-nework',
  '/news/categories/estonia': '/news',
}

export function proxy(request: NextRequest) {
  const maintenance = process.env.MAINTENANCE_MODE === 'true'
  const { pathname } = request.nextUrl

  const isYoastSitemapRequest = YOAST_SITEMAP_FILE_REGEX.test(pathname)

  // Keep public sitemap child URLs while routing them to the internal XML gateway.
  if (isYoastSitemapRequest && pathname !== '/sitemap.xml' && !pathname.startsWith('/sitemap/')) {
    const url = request.nextUrl.clone()
    url.pathname = `/sitemap${pathname}`
    return NextResponse.rewrite(url)
  }

  const normalizedPath =
    pathname !== '/' && pathname.endsWith('/') ? pathname.slice(0, -1) : pathname
  const redirectDestination = redirects[normalizedPath]
  if (redirectDestination) {
    const url = request.nextUrl.clone()
    url.pathname = redirectDestination
    return NextResponse.redirect(url, 308)
  }

  const postSlugMatch = pathname.match(/^\/post\/([^/]+)\/?$/)
  if (postSlugMatch) {
    const url = request.nextUrl.clone()
    url.pathname = `/news/${postSlugMatch[1]}`
    return NextResponse.redirect(url, 308)
  }

  if (!maintenance) return NextResponse.next()

  const allowed =
    pathname === '/maintenance' ||
    pathname.startsWith('/_next') ||
    pathname.startsWith('/favicon') ||
    pathname === '/robots.txt' ||
    pathname === '/sitemap.xml' ||
    pathname.startsWith('/sitemap/') ||
    isYoastSitemapRequest

  if (allowed) return NextResponse.next()

  const url = request.nextUrl.clone()
  url.pathname = '/maintenance'
  url.search = ''
  return NextResponse.rewrite(url)
}

export const config = {
  matcher: ['/((?!_next/static|_next/image).*)'],
}
