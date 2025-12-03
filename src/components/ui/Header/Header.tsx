'use client'
import {
  GetMenuDocument,
  GetMenuQuery,
  GetMenuQuery_RootQuery_menus_RootQueryToMenuConnection_nodes_Menu,
  GetMenuQuery_RootQuery_menus_RootQueryToMenuConnection_nodes_Menu_menuItems_MenuToMenuItemConnection_nodes_MenuItem,
} from '@/graphql/generated/graphql'
import { useSuspenseQuery } from '@apollo/client/react'
import { useGSAP } from '@gsap/react'
import { Burger, Button, Container, Group, Image, Menu, NavLink, Stack } from '@mantine/core'
import { useClickOutside, useDisclosure, useMediaQuery } from '@mantine/hooks'
import { IconChevronDown, IconSearch } from '@tabler/icons-react'
import clsx from 'clsx'
import gsap from 'gsap'
import { SplitText } from 'gsap/SplitText'
import { MouseEvent, MouseEvent as ReactMouseEvent, useMemo, useRef, useState } from 'react'
export default function Header() {
  const { data } = useSuspenseQuery<GetMenuQuery>(GetMenuDocument, {
    fetchPolicy: 'network-only',
    context: {
      fetchOptions: {
        next: {
          tags: ['menus'],

          revalidate: 0,
        },
      },
    },
  })
  const isMobile = useMediaQuery('(min-width: 1300px)')
  gsap.registerPlugin(useGSAP, SplitText)
  const [opened, { toggle, close }] = useDisclosure()
  const ref = useClickOutside(() => close())
  // const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [megaMenuOpen, setMegaMenuOpen] = useState(false)
  const [megaMenuContent, setMegaMenuContent] = useState<
    | { id?: string; location?: GetMenuQuery_RootQuery_menus_RootQueryToMenuConnection_nodes_Menu }
    | undefined
  >()
  const container = useRef(null)
  useGSAP(
    () => {
      gsap.from('.mobilemenu', { opacity: 0, y: 50, ease: 'circ', duration: 0.3 })
      gsap.from('.megamenu', { opacity: 0, scaleY: 0.7, ease: 'circ', duration: 0.3 })
      gsap.from('.megamenu-col', {
        x: 50,
        opacity: 0,
        stagger: 0.1,
        ease: 'circ',
        delay: 0.1,
        masks: 'lines',
      })
    },
    { dependencies: [megaMenuOpen, megaMenuContent?.id, opened] }
  )
  const [MAIN_MENU_LEFT, MAIN_MENU_RIGHT] = useMemo(() => {
    const menus = data?.menus?.nodes ?? []
    const left = menus.find((m) => m?.locations?.includes('MAIN_MENU_LEFT'))
    const right = menus.find((m) => m?.locations?.includes('MAIN_MENU_RIGHT'))
    return [left, right]
  }, [data])
  function getMegaMenuItems(location: typeof MAIN_MENU_RIGHT, id: string) {
    return (
      location?.menuItems?.nodes.filter((el) => el.id === id)[0]?.childItems ?? {
        nodes: [],
      }
    )
  }
  function handleMouseEnter(e: MouseEvent<HTMLButtonElement>) {
    const id = e.currentTarget.dataset?.id
    const location =
      e.currentTarget.dataset?.location === 'MAIN_MENU_LEFT' ? MAIN_MENU_LEFT : MAIN_MENU_RIGHT
    setMegaMenuContent({ id: id, location: location })
    setMegaMenuOpen(true)
  }
  function handleMouseLeave() {
    setMegaMenuOpen(false)
  }
  return (
    <>
      <Container ref={ref} fluid className="fixed z-[999999] w-full">
        <header
          ref={container}
          className="flex h-[110px] items-center justify-between gap-10 rounded-b-lg bg-[#ffffff80] p-6 backdrop-blur-sm"
        >
          <>
            <div id="menu-left" className="flex gap-10">
              <Button unstyled component="a" href="/">
                <Image src="/logo-eara.svg" className="max-w-[250px]" alt="Logo Eara" />
              </Button>
              {isMobile && (
                <Group gap={10}>
                  {MAIN_MENU_LEFT?.menuItems?.nodes?.map((menu) => (
                    <MenuItem
                      id={menu?.id}
                      location="MAIN_MENU_LEFT"
                      mouseEnterCb={handleMouseEnter}
                      mouseLeaveCb={handleMouseLeave}
                      IsMegaMenuOpen={megaMenuOpen}
                      key={menu?.id}
                      menus={menu}
                    />
                  ))}
                </Group>
              )}
            </div>
            <div id="menu-right" className="flex items-center gap-10">
              {isMobile ? (
                <Group gap={10}>
                  {MAIN_MENU_RIGHT?.menuItems?.nodes?.map((menu) => (
                    <MenuItem key={menu?.id} color="textColorDark" menus={menu} />
                  ))}
                </Group>
              ) : (
                <Burger opened={opened} onClick={toggle} aria-label="Toggle navigation" />
              )}
              <Button
                unstyled
                bg="secondaryColor.7"
                c="white"
                className="flex aspect-square w-[40px] cursor-pointer items-center justify-center rounded-full"
              >
                <IconSearch size={18} />
              </Button>
            </div>
          </>
        </header>
        {/* MegaMenu */}
        {megaMenuOpen && (
          <div
            onMouseLeave={handleMouseLeave}
            className="megamenu mt-1 flex min-h-[300px] origin-top-left gap-10 rounded-lg bg-[#ffffff80] py-14 backdrop-blur-sm"
          >
            <div className="grid w-full grid-cols-4 px-80">
              {megaMenuContent?.id && megaMenuContent?.location && (
                <MegaMenuItems
                  menuItems={
                    Array.isArray(
                      getMegaMenuItems(megaMenuContent?.location, megaMenuContent?.id)?.nodes
                    )
                      ? getMegaMenuItems(megaMenuContent?.location, megaMenuContent?.id)?.nodes
                      : []
                  }
                />
              )}
            </div>
          </div>
        )}
        {opened && (
          <div
            className={clsx(
              'mobilemenu mt-2 w-full rounded-lg bg-[#ffffff80] p-6 backdrop-blur-lg'
            )}
          >
            {MAIN_MENU_LEFT?.menuItems?.nodes?.map((menu) => (
              <>
                <NavLink
                  key={menu.id}
                  {...(menu.uri ? { href: menu.uri } : {})}
                  label={menu.label}
                  className="rounded"
                  childrenOffset={28}
                >
                  {menu.childItems?.nodes.length &&
                    menu.childItems.nodes.map((a) => (
                      <>
                        <NavLink
                          key={a.id}
                          {...(a.uri ? { href: a.uri } : {})}
                          label={a.label}
                          className="rounded"
                          childrenOffset={28}
                        >
                          {a.childItems?.nodes &&
                            a.childItems.nodes.map((b) => (
                              <>
                                <NavLink
                                  key={b.id}
                                  {...(b.uri ? { href: b.uri } : {})}
                                  label={b.label}
                                  className="rounded"
                                  childrenOffset={28}
                                ></NavLink>
                              </>
                            ))}
                        </NavLink>
                      </>
                    ))}
                </NavLink>
              </>
            ))}
            {MAIN_MENU_RIGHT?.menuItems?.nodes?.map((menu) => (
              <>
                <NavLink
                  key={menu.id}
                  {...(menu.uri ? { href: menu.uri } : {})}
                  label={menu.label}
                  className="rounded"
                  childrenOffset={28}
                >
                  {menu.childItems?.nodes.length &&
                    menu.childItems.nodes.map((a) => (
                      <>
                        <NavLink
                          key={a.id}
                          {...(a.uri ? { href: a.uri } : {})}
                          label={a.label}
                          className="rounded"
                          childrenOffset={28}
                        >
                          {a.childItems?.nodes &&
                            a.childItems.nodes.map((b) => (
                              <>
                                <NavLink
                                  key={b.id}
                                  {...(b.uri ? { href: b.uri } : {})}
                                  label={b.label}
                                  className="rounded"
                                  childrenOffset={28}
                                ></NavLink>
                              </>
                            ))}
                        </NavLink>
                      </>
                    ))}
                </NavLink>
              </>
            ))}
          </div>
        )}
      </Container>
    </>
  )
}
export function MenuItem({
  menus,
  color = 'primaryColor.9',
  mouseEnterCb,
  mouseLeaveCb,
  id,
  location,
}: {
  menus: Partial<GetMenuQuery_RootQuery_menus_RootQueryToMenuConnection_nodes_Menu_menuItems_MenuToMenuItemConnection_nodes_MenuItem>
  color?: string
  id?: string
  IsMegaMenuOpen?: boolean
  location?: string
  mouseEnterCb?: (e: ReactMouseEvent<HTMLButtonElement>) => void
  mouseLeaveCb?: (e: ReactMouseEvent<HTMLButtonElement>) => void
}) {
  return (
    <>
      <Menu key={menus.__typename} opened={false}>
        <Menu.Target>
          {menus?.childItems!.nodes?.length > 0 ? (
            <Button
              variant="menu"
              c={color}
              data-id={id}
              data-location={location}
              onMouseEnter={mouseEnterCb}
              rightSection={<IconChevronDown size={16} />}
              component="button"
              type="button"
            >
              {menus.label}
            </Button>
          ) : (
            <Button
              variant="menu"
              c={color}
              data-id={id}
              data-location={location}
              onMouseEnter={() => mouseLeaveCb}
              component="a"
              {...(menus.uri ? { href: menus.uri } : {})}
            >
              {menus.label}
            </Button>
          )}
        </Menu.Target>
        {menus.childItems!.nodes.length > 0 && (
          <Menu.Dropdown className="min-w-[200px]">
            {menus.childItems?.nodes.map((s) => (
              <Menu.Item key={s.label} component="a" {...(menus.uri ? { href: menus.uri } : {})}>
                {s.label}
              </Menu.Item>
            ))}
          </Menu.Dropdown>
        )}
      </Menu>
    </>
  )
}
type MenuItemType =
  GetMenuQuery_RootQuery_menus_RootQueryToMenuConnection_nodes_Menu_menuItems_MenuToMenuItemConnection_nodes_MenuItem
export function MegaMenuItems({ menuItems }: { menuItems: MenuItemType[] }) {
  return (
    <>
      {menuItems &&
        menuItems.map((menu, index) => {
          return (
            index <= 3 && (
              <div className="megamenu-col" key={menu.id}>
                <a
                  className="text-primaryColor font-bold hover:translate-x-0.5"
                  {...(menu.uri ? { href: menu.uri } : {})}
                >
                  {menu.label}
                </a>
                {menu?.childItems!.nodes.length > 0 && (
                  <Stack gap={2}>
                    {menu.childItems!.nodes.map((e) => (
                      <a
                        className="hover:translate-x-0.5 hover:font-semibold"
                        key={e.id}
                        {...(e.uri ? { href: e.uri } : {})}
                      >
                        {e.label}
                      </a>
                    ))}
                  </Stack>
                )}
              </div>
            )
          )
        })}
    </>
  )
}
