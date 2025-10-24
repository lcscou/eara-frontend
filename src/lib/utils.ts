import { GetMenuQuery_RootQuery } from '@/graphql/generated/graphql'

export function getMenu(
  location: 'MAIN_MENU_LEFT' | 'MAIN_MENU_RIGHT' | 'MAIN_FOOTER',
  data: GetMenuQuery_RootQuery | undefined
) {
  const menus = data?.menus?.nodes ?? []
  const result = menus.find((m) => m?.locations?.includes(location))
  const a = result
  return result
}
