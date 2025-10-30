import {
  GetAllNewsQuery_RootQuery_allNews_RootQueryToNewsConnection_nodes_News_author_NodeWithAuthorToUserConnectionEdge,
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
): {
  src: string
  width: number
  height: number
  description: string
  credits: string
  researchArea?: string
  id: string
  uploadedDate?: string
  uri?: string | null
  slug?: string | null
  speciesFeaturedOrNewApproachMethodology?: string
}[] {
  const medias = data?.nodes ?? []
  const result = medias.reduce(
    (acc, media) => {
      const cfMedia = media?.cfMediaBank
      if (cfMedia && cfMedia.image && cfMedia.image.node) {
        acc.push({
          id: media.id,
          uri: media.uri,
          slug: media.slug,
          src: cfMedia.image?.node.guid || '',
          width: cfMedia.image?.node.mediaDetails?.width ?? 0,
          height: cfMedia.image?.node.mediaDetails?.height ?? 0,
          description: cfMedia.description ?? '',
          credits: cfMedia.credits ?? '',
          researchArea: cfMedia.researchArea ?? '',
          speciesFeaturedOrNewApproachMethodology:
            cfMedia.speciesFeaturedOrNewApproachMethodology ?? '',
          uploadedDate: cfMedia.uploadedDate ?? '',
        })
      }
      return acc
    },
    [] as {
      id: string
      src: string
      width: number
      height: number
      description: string
      slug?: string | null
      credits: string
      uploadedDate?: string
      researchArea?: string
      speciesFeaturedOrNewApproachMethodology?: string
      uri?: string | null
    }[]
  )
  return result
}

export function cleanHTMLTAG(input: string): string {
  return input.replace(/<\/?[^>]+(>|$)/g, '')
}

export function formatAuthorName(
  author?: GetAllNewsQuery_RootQuery_allNews_RootQueryToNewsConnection_nodes_News_author_NodeWithAuthorToUserConnectionEdge | null
): string {
  if (!author || !author.node) return ''
  return `${author.node.firstName || ''} ${author.node.lastName || ''}`.trim()
}

export function truncateText(input: string, maxLength: number): string {
  if (input.length <= maxLength) {
    return input
  }
  return input.split(' ').slice(0, maxLength).join(' ') + '...'
}
