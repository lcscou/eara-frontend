'use client'
import { Button, Container, Grid, Group, Image, Stack, Title, Text } from '@mantine/core'
import { FooterProps } from '@/lib/types'
import {
  IconBrandFacebook,
  IconBrandInstagram,
  IconBrandLinkedin,
  IconBrandYoutube,
} from '@tabler/icons-react'
import { useSuspenseQuery } from '@apollo/client/react'
import {
  GetMenuDocument,
  GetMenuQuery,
  GetMenuQuery_RootQuery_menus_RootQueryToMenuConnection_nodes_Menu_menuItems_MenuToMenuItemConnection_nodes_MenuItem,
} from '@/graphql/generated/graphql'

export default function Footer({}: FooterProps) {
  const { data } = useSuspenseQuery<GetMenuQuery>(GetMenuDocument, { fetchPolicy: 'cache-first' })
  const MAIN_FOOTER = data.menus?.nodes?.filter((menu) =>
    menu?.locations?.find((loc) => loc == 'MAIN_FOOTER')
  )[0]

  return (
    <>
      <Container fluid className="py-[16px]">
        <footer className="bg-earaDark rounded-2xl p-10 text-white">
          <div className="border-b-1 border-[#ffffff25] pb-16">
            <Grid gutter={50}>
              <Grid.Col span={{ sm: 4 }}>
                <Image w={350} src="/logo-eara-light.svg" alt="Logo Eara" />
              </Grid.Col>
              <Grid.Col span={{ sm: 4 }}>
                <Title order={6} c="earaDark.5">
                  Social Media
                </Title>
                <Group>
                  <Button component="a" href="https://sds" unstyled className="mt-4">
                    <IconBrandFacebook />
                  </Button>
                  <Button component="a" href="https://sds" unstyled className="mt-4">
                    <IconBrandInstagram />
                  </Button>
                  <Button component="a" href="https://sds" unstyled className="mt-4">
                    <IconBrandLinkedin />
                  </Button>
                  <Button component="a" href="https://sds" unstyled className="mt-4">
                    <IconBrandYoutube />
                  </Button>
                </Group>
              </Grid.Col>
              <Grid.Col span={{ sm: 4 }}>
                <Title order={6} size={30}>
                  Subscribe our newsletter
                </Title>
              </Grid.Col>
            </Grid>
          </div>

          <div className="pt-16">
            <Grid columns={MAIN_FOOTER?.menuItems?.nodes.length} gutter={50}>
              {MAIN_FOOTER?.menuItems?.nodes.map((menu) => (
                <FooterColumn key={menu.id} data={menu} />
              ))}
            </Grid>
          </div>

          <div className="pt-10">
            <Text c={'earaDark.5'}>
              © 2025 European Animal Research Association, All rights reserved.
            </Text>
          </div>
        </footer>
      </Container>
    </>
  )
}

export function FooterColumn({
  data,
}: {
  data: Partial<GetMenuQuery_RootQuery_menus_RootQueryToMenuConnection_nodes_Menu_menuItems_MenuToMenuItemConnection_nodes_MenuItem>
}) {
  return (
    <>
      <Grid.Col key={data.id} span={{ sm: 1 }}>
        <Title order={6} c="earaDark.5">
          {data.label}
        </Title>
        <Stack className="mt-4" gap={5}>
          {(data.childItems?.nodes ?? []).map((child) => (
            <div key={child?.id ?? child?.label}>
              {child?.label && child?.uri && !child?.menuAcf?.content && (
                <Button unstyled component="a" href={child?.uri || ''}>
                  {child.label}
                </Button>
              )}
              {child?.menuAcf?.content && (
                <p
                  className="max-w-[250px] whitespace-break-spaces"
                  dangerouslySetInnerHTML={{ __html: child.menuAcf?.content }}
                ></p>
              )}
            </div>
          ))}
        </Stack>
      </Grid.Col>
    </>
  )
}
