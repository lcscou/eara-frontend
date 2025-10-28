import {
  GetMediasBankQuery_RootQuery_mediasBank_RootQueryToMediaBankConnection,
  GetMenuQuery_RootQuery,
} from '@/graphql/generated/graphql'

export function getMenu(
  location: 'MAIN_MENU_LEFT' | 'MAIN_MENU_RIGHT' | 'MAIN_FOOTER',
  data: GetMenuQuery_RootQuery | undefined
) {
  const menus = data?.menus?.nodes ?? []
  const result = menus.find((m) => m?.locations?.includes(location))

  return result
}

export function PickRandom<T>(arr: T[]): T {
  const randomIndex = Math.floor(Math.random() * arr.length)
  return arr[randomIndex]
}

export function randomColor(): string {
  const letters = '0123456789ABCDEF'
  let color = '#'
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)]
  }
  return color
}

export function getMediaType(
  data: GetMediasBankQuery_RootQuery_mediasBank_RootQueryToMediaBankConnection | undefined | null
): { src: string; width: number; height: number; description: string }[] {
  const medias = data?.nodes ?? []
  const result = medias.reduce(
    (acc, media) => {
      const cfMedia = media?.cfMediaBank
      if (cfMedia) {
        acc.push({
          src: cfMedia.image?.node.guid || '',
          width: cfMedia.image?.node.mediaDetails?.width ?? 0,
          height: cfMedia.image?.node.mediaDetails?.height ?? 0,
          description: cfMedia.description ?? '',
        })
      }
      return acc
    },
    [] as { src: string; width: number; height: number; description: string }[]
  )
  return result
}

export function cleanHTMLTAG(input: string): string {
  return input.replace(/<\/?[^>]+(>|$)/g, '')
}
