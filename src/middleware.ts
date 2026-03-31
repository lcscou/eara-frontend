import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

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
}

export function middleware(request: NextRequest) {
  const maintenance = process.env.MAINTENANCE_MODE === 'true'
  const { pathname } = request.nextUrl

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
    pathname === '/sitemap.xml'

  if (allowed) return NextResponse.next()

  const url = request.nextUrl.clone()
  url.pathname = '/maintenance'
  url.search = ''
  return NextResponse.rewrite(url)
}

export const config = {
  matcher: ['/((?!_next/static|_next/image).*)'],
}
