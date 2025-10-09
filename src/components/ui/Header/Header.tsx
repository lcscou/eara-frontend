'use client'
import { Button, Image, Container, Group, Menu, Grid, Stack } from '@mantine/core'
import { IconChevronDown, IconChevronUp, IconSearch } from '@tabler/icons-react'

import { useSuspenseQuery } from '@apollo/client/react'
import { Get_MenuDocument } from '@/graphql/generated/graphql'
import { useState } from 'react'
import { useRef } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import clsx from 'clsx'

type DeepNonNullable<T> = {
  [K in keyof T]-?: NonNullable<T[K]>
}

export default function Header() {
  const { data } = useSuspenseQuery(Get_MenuDocument)

  gsap.registerPlugin(useGSAP) // register the hook to avoid React version discrepancies

  const [megaMenuOpen, setMegaMenuOpen] = useState(false)
  const container = useRef(null)

  useGSAP(
    () => {
      gsap.from('.megamenu', { y: 50, opacity: 0, scaleY: 0, ease: 'circ', duration: 0.3 })
      gsap.from('.megamenu-col', { x: 50, opacity: 0, stagger: 0.14, ease: 'circ', delay: 0.2 })
    },
    { dependencies: [megaMenuOpen] }
  )

  const MAIN_MENU_LEFT = data?.menus?.nodes?.filter((menu) =>
    menu?.locations?.find((loc) => loc == 'MAIN_MENU_LEFT')
  )[0]
  const MAIN_MENU_RIGHT = data?.menus?.nodes?.filter((menu) =>
    menu?.locations?.find((loc) => loc == 'MAIN_MENU_RIGHT')
  )[0]

  function handleMouseEnter() {
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
          <div id="menu-left" className="flex gap-10">
            <Button unstyled component="a" href="/">
              <Image src="/logo-eara.svg" className="max-w-[250px]" alt="Logo Eara" />
            </Button>
            <Group gap={10}>
              {MAIN_MENU_LEFT?.menuItems?.nodes?.map((menu) => (
                <MenuItem
                  mouseEnterCb={handleMouseEnter}
                  mouseLeaveCb={handleMouseLeave}
                  IsMegaMenuOpen={megaMenuOpen}
                  key={menu?.label}
                  menus={menu}
                />
              ))}
            </Group>
          </div>
          <div id="menu-right" className="flex gap-10">
            <Group gap={10}>
              {MAIN_MENU_RIGHT?.menuItems?.nodes?.map((menu) => (
                <MenuItem key={menu?.label} color="textColorDark" menus={menu} />
              ))}
            </Group>
            <Button
              unstyled
              bg="secondaryColor.7"
              c="white"
              className="flex aspect-square w-[40px] cursor-pointer items-center justify-center rounded-full"
            >
              <IconSearch size={18} />
            </Button>
          </div>
        </header>

        {/* MegaMenu */}
        {megaMenuOpen && (
          <div
            onMouseLeave={handleMouseLeave}
            className="megamenu mt-1 flex min-h-[300px] origin-top gap-10 rounded-lg bg-[#ffffff80] py-14 backdrop-blur-sm"
          >
            <Grid className="w-full px-80" gutter={40}>
              <Grid.Col span={3} className="megamenu-col">
                <Stack gap={5}>
                  <span className="text-primaryColor mb-3 font-medium">Overviwe</span>
                </Stack>
              </Grid.Col>
              <Grid.Col span={3} className="megamenu-col">
                <Stack gap={5}>
                  <span className="text-primaryColor mb-3 font-medium">Disease</span>
                  <a href="#" className="font-medium">
                    Main
                  </a>
                  <a href="#" className="font-medium">
                    Carrer
                  </a>
                </Stack>
              </Grid.Col>
              <Grid.Col span={3} className="megamenu-col">
                Col3
              </Grid.Col>
              <Grid.Col span={3} className="megamenu-col">
                Col3
              </Grid.Col>
            </Grid>
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
  IsMegaMenuOpen,
}: {
  menus: any
  color?: string
  IsMegaMenuOpen?: boolean
  mouseEnterCb?: () => void
  mouseLeaveCb?: () => void
}) {
  return (
    <>
      <Menu key={menus.__typename} position="bottom-start">
        <Menu.Target>
          <Button
            variant="menu"
            c={color}
            // className="transition-2"
            onMouseEnter={menus.childItems?.nodes.length > 0 ? mouseEnterCb : mouseLeaveCb}
            // onMouseLeave={!(menus.childItems?.nodes.length > 0) &&  mouseLeaveCb}
            rightSection={
              menus.childItems?.nodes.length > 0 && (
                <IconChevronDown
                  // className={clsx(IsMegaMenuOpen ? '-rotate-180' : 'rotate-0', 'transition-all')}
                  size={16}
                />
              )
            }
            component={menus.childItems?.nodes.length > 0 ? 'button' : 'a'}
            href={menus.childItems?.nodes.length > 0 ? null : menus.href}
          >
            {menus.label}
          </Button>
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
