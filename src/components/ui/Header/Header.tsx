"use client";
import { Button, Image, Container, Group, Menu } from "@mantine/core";
import { IconChevronDown, IconSearch } from "@tabler/icons-react";

import { useSuspenseQuery } from "@apollo/client/react";
import { Get_MenuDocument } from "@/graphql/generated/graphql";

type DeepNonNullable<T> = {
  [K in keyof T]-?: NonNullable<T[K]>;
};

export default function Header() {
  const { data } = useSuspenseQuery(Get_MenuDocument);

  const MAIN_MENU_LEFT = data?.menus?.nodes?.filter((menu) =>
    menu?.locations?.find((loc) => loc == "MAIN_MENU_LEFT")
  )[0];
  const MAIN_MENU_RIGHT = data?.menus?.nodes?.filter((menu) =>
    menu?.locations?.find((loc) => loc == "MAIN_MENU_RIGHT")
  )[0];

  return (
    <>
      <Container fluid className="fixed w-full">
        <header className="bg-[#ffffff80] backdrop-blur-sm  p-6   rounded-b-lg flex justify-between items-center gap-10 h-[110px]">
          <div id="menu-left" className="flex gap-10">
            <Button unstyled component="a" href="/">
              <Image
                src="/logo-eara.svg"
                className="max-w-[250px]"
                alt="Logo Eara"
              />
            </Button>
            <Group gap={10}>
              {MAIN_MENU_LEFT?.menuItems?.nodes?.map((menu) => (
                <MenuItem key={menu?.label} menus={menu} />
              ))}
            </Group>
          </div>
          <div id="menu-right" className="flex gap-10">
            <Group gap={10}>
              {MAIN_MENU_RIGHT?.menuItems?.nodes?.map((menu) => (
                <MenuItem
                  key={menu?.label}
                  color="textColorDark"
                  menus={menu}
                />
              ))}
            </Group>
            <Button
              unstyled
              bg="secondaryColor.7"
              c="white"
              className="w-[40px] cursor-pointer flex items-center justify-center rounded-full aspect-square"
            >
              <IconSearch size={18} />
            </Button>
          </div>
          <div className="bg-[#ffffff80] backdrop-blur-sm  p-6   rounded-b-lg flex justify-between items-center gap-10 h-[110px]">
            Mega Menu
          </div>
        </header>
      </Container>
    </>
  );
}

export function MenuItem({
  menus,
  color = "primaryColor.9",
}: {
  menus: MenuNodes;
  color?: string;
}) {
  return (
    <>
      <Menu
        key={menus.__typename}
        position="bottom-start"
        trigger="click-hover"
      >
        <Menu.Target>
          <Button
            variant="menu"
            c={color}
            rightSection={
              menus.childItems?.nodes.length > 0 && (
                <IconChevronDown size={16} />
              )
            }
            component={menus.childItems?.nodes.length > 0 ? "button" : "a"}
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
  );
}
