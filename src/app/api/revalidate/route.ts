import { revalidatePath, revalidateTag } from 'next/cache'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    // Validar token de segurança
    const secret = request.headers.get('x-revalidate-secret')

    if (secret !== process.env.REVALIDATE_SECRET) {
      console.error('Invalid revalidation secret')
      return NextResponse.json({ error: 'Invalid secret' }, { status: 401 })
    }

    const body = await request.json()
    const { path, tag, type } = body

    console.log('Revalidation request:', { path, tag, type })

    // Revalidar por path específico
    if (path) {
      await revalidatePath(path)
      console.log(`Revalidated path: ${path}`)
    }

    // Revalidar por tag
    if (tag) {
      revalidateTag(tag)
      console.log(`Revalidated tag: ${tag}`)
    }

    // Revalidar rotas relacionadas baseado no tipo
    if (type) {
      switch (type) {
        case 'post':
        case 'news':
          revalidatePath('/news')
          revalidateTag('news')
          console.log('Revalidated news archive')
          break

        case 'events':
          revalidatePath('/events')
          revalidateTag('events')
          console.log('Revalidated events archive')
          break

        case 'case-studies':
          revalidatePath('/case-studies')
          revalidateTag('case-studies')
          console.log('Revalidated case studies archive')
          break

        case 'animal':
          revalidatePath('/animals')
          revalidateTag('animals')
          console.log('Revalidated animals archive')
          break

        case 'member':
          revalidatePath('/members')
          revalidateTag('members')
          console.log('Revalidated members archive')
          break

        case 'page':
          revalidateTag('pages')
          console.log('Revalidated pages')
          break

        case 'menu':
        case 'menus':
          revalidateTag('menus')
          console.log('Revalidated menus')
          break

        case 'ticker':
        case 'tickers':
          revalidateTag('tickers')
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
