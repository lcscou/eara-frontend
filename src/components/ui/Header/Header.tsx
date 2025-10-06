"use client";
import { Button, Image, Container, Group, Menu } from "@mantine/core";
import Link from "next/link";
import {
  IconChevronDown,
  IconChevronsDown,
  IconGauge,
  IconMessageCircle,
  IconSearch,
  IconSettings,
} from "@tabler/icons-react";

interface MenusProps {
  label: string;
  href: string;
  submenu?: MenusProps[];
}

const menus: MenusProps[] = [
  {
    label: "Why animal research",
    href: "#",
    submenu: [
      {
        href: "#",
        label: "Know more",
      },
    ],
  },
  {
    label: "Beyond animal research",
    href: "#",
    submenu: [
      {
        href: "#",
        label: "Know more",
      },
    ],
  },
  {
    label: "Policy",
    href: "#",
    submenu: [
      {
        href: "#",
        label: "Know more",
      },
      {
        href: "#",
        label: "Know even more",
      },
    ],
  },
  {
    label: "Transparency",
    href: "#",
  },
];

const menus2: MenusProps[] = [
  {
    label: "News",
    href: "#",
  },
  {
    label: "Events",
    href: "#",
  },
  {
    label: "Projects",
    href: "#",
  },
  {
    label: "Membership",
    href: "#",
  },
  {
    label: "About EARA",
    href: "#",
  },
];

export default function Header() {
  return (
    <>
      <Container fluid>
        <header className="bg-gray-100 p-5 rounded-b-lg flex justify-between items-center gap-10">
          <div id="menu-left" className="flex gap-10">
            <Button unstyled component="a" href="/">
              <Image src="/logo-eara.svg" w={200} alt="Logo Eara" />
            </Button>
            <Group gap={10}>
              {menus.map((menu) => (
                <MenuItem key={menu.label} menus={menu} />
              ))}
            </Group>
          </div>
          <div id="menu-right" className="flex gap-10">
            <Group gap={10}>
              {menus2.map((menu) => (
                <MenuItem key={menu.label} color="textColorDark" menus={menu} />
              ))}
            </Group>
            <Button unstyled bg='secondaryColor.7' c="white" className="w-[40px] cursor-pointer flex items-center justify-center rounded-full aspect-square">
              <IconSearch size={18} />
            </Button>
          </div>
        </header>
      </Container>
    </>
  );
}

export function MenuItem({ menus, color = 'primaryColor.9' }: { menus: MenusProps, color?: string }) {
  return (
    <>
      <Menu key={menus.label} position="bottom-start" trigger="click-hover">
        <Menu.Target>
          <Button
            variant="menu"
            c={color}
            rightSection={menus.submenu && <IconChevronDown size={16} />}
            component={menus.submenu ? "button" : "a"}
            href={menus.submenu ? "" : menus.href}
          >
            {menus.label}
          </Button>
        </Menu.Target>

        {menus.submenu && (
          <Menu.Dropdown className="min-w-[200px]">
            {menus.submenu.map((s) => (
              <Menu.Item key={s.label} component="a" href={s.href}>
                {s.label}
              </Menu.Item>
            ))}
          </Menu.Dropdown>
        )}
      </Menu>
    </>
  );
}
