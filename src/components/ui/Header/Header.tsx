"use client";

import { Button, Image, Container, Group, NavLink } from "@mantine/core";
import Link from "next/link";

export default function Header() {
  return (
    <>
      <Container fluid>
        <header className="bg-gray-100 p-5 rounded-b-lg flex justify-content-center items-center gap-10">
          <Image src="/logo-eara.svg" w={200} alt="Logo Eara" />

          <div id="menu-left">
            <Group>
              <NavLink
                href="#required-for-focus"
                label="With right section"
                leftSection={<IconGauge size={16} stroke={1.5} />}
                rightSection={
                  <IconChevronRight
                    size={12}
                    stroke={1.5}
                    className="mantine-rotate-rtl"
                  />
                }
              />
            </Group>
          </div>
          <div id="menu-right"></div>
        </header>
      </Container>
    </>
  );
}
