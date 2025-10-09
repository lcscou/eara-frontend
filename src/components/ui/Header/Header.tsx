'use client'
import { Button, Image, Container, Group, Menu, Grid, Stack, Burger } from '@mantine/core'
import { IconChevronDown, IconSearch } from '@tabler/icons-react'

import { useSuspenseQuery } from '@apollo/client/react'
import { GetMenuDocument } from '@/graphql/generated/graphql'
import { MouseEvent, useState } from 'react'
import { useRef } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { useDisclosure, useMediaQuery } from '@mantine/hooks'

export default function Header() {
  const { data } = useSuspenseQuery(GetMenuDocument)
  const isMobile = useMediaQuery('(min-width: 1300px)')
  gsap.registerPlugin(useGSAP)
  const [opened, { toggle }] = useDisclosure()
  const [megaMenuOpen, setMegaMenuOpen] = useState(false)
  const [megaMenuContent, setMegaMenuContent] = useState<
    { id?: string; location?: unknown } | undefined
  >()
  const container = useRef(null)

  useGSAP(
    () => {
      gsap.from('.megamenu', { y: 50, opacity: 0, scaleY: 0.7, ease: 'circ', duration: 0.3 })
      gsap.from('.megamenu-col', { x: 50, opacity: 0, stagger: 0.14, ease: 'circ', delay: 0.1 })
    },
    { dependencies: [megaMenuOpen, megaMenuContent?.id] }
  )

  const MAIN_MENU_LEFT = data?.menus?.nodes?.filter((menu) =>
    menu?.locations?.find((loc) => loc == 'MAIN_MENU_LEFT')
  )[0]
  const MAIN_MENU_RIGHT = data?.menus?.nodes?.filter((menu) =>
    menu?.locations?.find((loc) => loc == 'MAIN_MENU_RIGHT')
  )[0]

  function getMegaMenuItems(location: typeof MAIN_MENU_RIGHT, id: string) {
    return location?.menuItems?.nodes.filter((el) => el.id === id)[0]?.childItems || []
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
      <Container fluid className="fixed w-full">
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
                      key={menu?.label}
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
                    <MenuItem key={menu?.label} color="textColorDark" menus={menu} />
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
            className="megamenu mt-1 flex min-h-[300px] origin-top gap-10 rounded-lg bg-[#ffffff80] py-14 backdrop-blur-sm"
          >
            <div className="grid w-full grid-cols-4 px-80" gutter={40}>
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
      </Container>
    </>
  )
}

import { MouseEvent as ReactMouseEvent } from 'react'

export function MenuItem({
  menus,
  color = 'primaryColor.9',
  mouseEnterCb,
  mouseLeaveCb,
  id,
  location,
  IsMegaMenuOpen,
}: {
  menus: any
  color?: string
  id: string
  IsMegaMenuOpen?: boolean
  location: string
  mouseEnterCb?: (e: ReactMouseEvent<HTMLButtonElement>) => void
  mouseLeaveCb?: (e: ReactMouseEvent<HTMLButtonElement>) => void
}) {
  return (
    <>
      <Menu key={menus.__typename} position="bottom-start">
        <Menu.Target>
          {menus.childItems?.nodes.length > 0 ? (
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
              href={menus.href}
            >
              {menus.label}
            </Button>
          )}
        </Menu.Target>

        {menus.childItems?.nodes.length > 0 && (
          <Menu.Dropdown className="min-w-[200px]">
            {menus.childItems?.nodes.map((s) => (
              <Menu.Item key={s.label} component="a" href={s.uri}>
                {s.label}
              </Menu.Item>
            ))}
          </Menu.Dropdown>
        )}
      </Menu>
    </>
  )
}

type MenuItem = {
  __typename: 'MenuItem'
  childItems: {
    __typename: 'MenuItemToMenuItemConnection'
    nodes: MenuItem[]
  }
  id: string
  label: string
  uri: string
}

export function MegaMenuItems({ menuItems }: { menuItems: MenuItem[] }) {
  return (
    <>
      {menuItems &&
        menuItems.map((menu, index) => {
          return (
            index <= 3 && (
              <div className="megamenu-col" key={menu.id}>
                <a className="text-primaryColor font-bold" href={menu.uri}>
                  {menu.label}
                </a>
                {menu.childItems.nodes.length > 0 && (
                  <Stack gap={2}>
                    {menu.childItems.nodes.map((e) => (
                      <a key={e.id} href={e.uri}>
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
