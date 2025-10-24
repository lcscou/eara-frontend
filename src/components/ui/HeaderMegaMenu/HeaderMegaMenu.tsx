'use client'
import { HeaderMegaMenuProps, HeaderMenuItemsProps, MenuItemMobileProps } from '@/lib/types'
import { getMenu } from '@/lib/utils'
import { Burger, Button, Container, Drawer, Group, HoverCard, NavLink } from '@mantine/core'
import { useDisclosure, useMediaQuery } from '@mantine/hooks'
import { IconChevronDown } from '@tabler/icons-react'
import Image from 'next/image'
import Link from 'next/link'
import Search from '../Search/Search'
export default function HeaderMegaMenu({ data }: HeaderMegaMenuProps) {
  const main_menu_left = getMenu('MAIN_MENU_LEFT', data)
  const main_menu_right = getMenu('MAIN_MENU_RIGHT', data)
  const isMobile = useMediaQuery('(min-width: 1300px)')
  const [opened, { toggle, close }] = useDisclosure()
  return (
    <>
      <header className="fixed top-0 left-0 z-50 w-full">
        <Container fluid>
          <div className="bg-backgroundMenu flex h-[100px] items-center justify-between rounded-b-xl p-5 backdrop-blur-xl">
            <div id="header-left-section" className="flex gap-10">
              <Link href="/">
                <Image src="/logo-eara.svg" width={200} height={200} alt="Logo Eara" />
              </Link>
              {isMobile && (
                <Group id="header-menu-left" gap={15}>
                  {main_menu_left?.menuItems?.nodes &&
                    main_menu_left?.menuItems?.nodes.map((item) => {
                      return (
                        <MenuItem
                          childItems={item.childItems}
                          key={item.id}
                          uri={item.uri}
                          label={item.label}
                          {...(main_menu_left.menuGeral?.menuTextColor
                            ? { menuTextColor: main_menu_left.menuGeral?.menuTextColor }
                            : {})}
                          variant={item.menuAcf?.ismegamenu ? 'megamenu' : 'dropdown'}
                        />
                      )
                    })}
                </Group>
              )}
            </div>

            <div id="header-right-section">
              <div id="header-menu-right">
                <Group id="header-menu-right" gap={15}>
                  {isMobile ? (
                    <>
                      {main_menu_right?.menuItems?.nodes &&
                        main_menu_right?.menuItems?.nodes.map((item) => {
                          return (
                            <MenuItem
                              childItems={item.childItems}
                              key={item.id}
                              uri={item.uri}
                              label={item.label}
                              {...(main_menu_right.menuGeral?.menuTextColor
                                ? { menuTextColor: main_menu_right.menuGeral?.menuTextColor }
                                : {})}
                              variant={item.menuAcf?.ismegamenu ? 'megamenu' : 'dropdown'}
                            />
                          )
                        })}
                    </>
                  ) : (
                    <Burger opened={opened} onClick={toggle} aria-label="Toggle navigation" />
                  )}
                  <Search />
                </Group>
              </div>
            </div>
          </div>

          <Drawer
            opened={opened}
            onClose={close}
            offset={16}
            withOverlay={false}
            radius="lg"
            withCloseButton={false}
            position="bottom"
            size="calc(100% - 120px)"
            styles={{
              content: {
                background: 'var(--color-backgroundMenu)',
                backdropFilter: 'blur(24px)',
              },
            }}
          >
            <MenuItemMobile menu={main_menu_left} />
            <MenuItemMobile menu={main_menu_right} />
          </Drawer>
        </Container>
      </header>
    </>
  )
}
export function MenuItem({
  variant = 'dropdown',
  label,
  uri,
  childItems,
  menuTextColor,
}: HeaderMenuItemsProps) {
  const dropDownStyle = {
    megamenu: {
      left: '16px',
      borderRadius: '.75rem',
      background: 'rgba(255,255,255,0.45)',
      border: 0,
      backdropFilter: 'blur(24px)',
      padding: '40px 0',
      width: 'calc(100% - 32px)',
    },
    dropdown: {
      borderRadius: '.75rem',
      background: 'rgba(255,255,255,0.45)',
      border: 0,
      minWidth: '200px',
      backdropFilter: 'blur(24px)',
      padding: '20px 20px',
    },
    link: {},
  }
  const hasChildren = childItems?.nodes && childItems?.nodes.length > 0

  return (
    <>
      {hasChildren && (
        <HoverCard
          preventPositionChangeWhenVisible
          styles={{ dropdown: { ...dropDownStyle[variant] } }}
          offset={35}
        >
          <HoverCard.Target>
            <Button
              variant="menu"
              className=".mega-col"
              c={menuTextColor || 'primaryColor.9'}
              rightSection={hasChildren && <IconChevronDown size={15} />}
            >
              {label}
            </Button>
          </HoverCard.Target>
          <HoverCard.Dropdown>
            {variant === 'megamenu' && (
              <div className="grid grid-cols-4 px-60">
                {childItems?.nodes.map((submenus) => {
                  return (
                    <div key={submenus.id} className="mega-col flex flex-col items-start">
                      <Button variant="menu">{submenus.label}</Button>
                      {submenus.childItems?.nodes.map((third) => {
                        return (
                          <Button
                            c={'earaDark.9'}
                            fw={500}
                            variant="menu"
                            {...(third.uri ? { component: 'a' } : {})}
                            {...(third.uri ? { href: third.uri } : {})}
                            key={third.id}
                          >
                            {third.label}
                          </Button>
                        )
                      })}
                    </div>
                  )
                })}
              </div>
            )}
            {variant === 'dropdown' && (
              <div className="flex flex-col items-start">
                {childItems?.nodes.map((submenus) => {
                  return (
                    <Button
                      variant="menu"
                      {...(submenus.uri ? { component: 'a' } : {})}
                      {...(submenus.uri ? { href: submenus.uri } : {})}
                      c={'earaDark.9'}
                      fw={500}
                      key={submenus.id}
                    >
                      {submenus.label}
                    </Button>
                  )
                })}
              </div>
            )}
          </HoverCard.Dropdown>
        </HoverCard>
      )}
      {!hasChildren && (
        <Button
          c={menuTextColor || 'primaryColor.9'}
          variant="menu"
          {...(uri ? { component: 'a' } : {})}
          {...(uri ? { href: uri } : {})}
        >
          {label} {menuTextColor && menuTextColor}
        </Button>
      )}
    </>
  )
}

export function MenuItemMobile({ menu }: MenuItemMobileProps) {
  return (
    <>
      {menu?.menuItems?.nodes &&
        menu?.menuItems?.nodes.map((item) => {
          return (
            <NavLink
              styles={{ root: { borderRadius: '.45rem' } }}
              key={item.id}
              label={item.label}
              {...(item.uri ? { href: item.uri } : {})}
            >
              {item.childItems?.nodes &&
                item.childItems?.nodes.length > 0 &&
                item.childItems?.nodes.map((thirdLevel) => {
                  return (
                    <NavLink
                      key={thirdLevel.id}
                      styles={{ root: { borderRadius: '.45rem' } }}
                      label={thirdLevel.label}
                      {...(thirdLevel.uri ? { href: thirdLevel.uri } : {})}
                    >
                      {thirdLevel.childItems?.nodes &&
                        thirdLevel.childItems?.nodes.length > 0 &&
                        thirdLevel.childItems?.nodes.map((fourthLevel) => {
                          return (
                            <NavLink
                              key={fourthLevel.id}
                              styles={{ root: { borderRadius: '.45rem' } }}
                              label={fourthLevel.label}
                              {...(fourthLevel.uri ? { href: fourthLevel.uri } : {})}
                            />
                          )
                        })}
                    </NavLink>
                  )
                })}
            </NavLink>
          )
        })}
    </>
  )
}
