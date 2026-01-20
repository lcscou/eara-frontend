'use client'
import {
  GetMenuDocument,
  GetMenuQuery,
  GetMenuQuery_RootQuery_menus_RootQueryToMenuConnection_nodes_Menu_menuItems_MenuToMenuItemConnection_nodes_MenuItem,
  GetSettingsDocument,
} from '@/graphql/generated/graphql'
import { FooterProps } from '@/lib/types'
import { useSuspenseQuery } from '@apollo/client/react'
import { Button, Container, Grid, Group, Image, Stack, Text, Title } from '@mantine/core'
import {
  IconBrandBluesky,
  IconBrandFacebook,
  IconBrandInstagram,
  IconBrandLinkedin,
  IconBrandTiktok,
  IconBrandX,
  IconBrandYoutube,
} from '@tabler/icons-react'
import Link from 'next/link'
import ButtonEara from '../ButtonEara/ButtonEara'

export default function Footer({}: FooterProps) {
  const { data } = useSuspenseQuery<GetMenuQuery>(GetMenuDocument, {
    fetchPolicy: 'cache-first',
    context: {
      fetchOptions: {
        next: {
          tags: ['menus'],
          revalidate: 0,
        },
      },
    },
  })

  const { data: settingsData } = useSuspenseQuery(GetSettingsDocument, {
    fetchPolicy: 'cache-first',
    context: {
      fetchOptions: {
        next: {
          tags: ['earaSettings'],
          revalidate: 0,
        },
      },
    },
  })
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
                  {settingsData?.earaSettings?.themeSettings?.socialMediaLinks?.facebook && (
                    <Button
                      component="a"
                      target="_blank"
                      href={
                        settingsData?.earaSettings?.themeSettings?.socialMediaLinks?.facebook || ''
                      }
                      unstyled
                      className="mt-4"
                    >
                      <IconBrandFacebook />
                    </Button>
                  )}
                  {settingsData?.earaSettings?.themeSettings?.socialMediaLinks?.instagram && (
                    <Button
                      component="a"
                      target="_blank"
                      href={
                        settingsData?.earaSettings?.themeSettings?.socialMediaLinks?.instagram || ''
                      }
                      unstyled
                      className="mt-4"
                    >
                      <IconBrandInstagram />
                    </Button>
                  )}
                  {settingsData?.earaSettings?.themeSettings?.socialMediaLinks?.linkedin && (
                    <Button
                      component="a"
                      target="_blank"
                      href={
                        settingsData?.earaSettings?.themeSettings?.socialMediaLinks?.linkedin || ''
                      }
                      unstyled
                      className="mt-4"
                    >
                      <IconBrandLinkedin />
                    </Button>
                  )}
                  {settingsData?.earaSettings?.themeSettings?.socialMediaLinks?.youtube && (
                    <Button
                      component="a"
                      target="_blank"
                      href={
                        settingsData?.earaSettings?.themeSettings?.socialMediaLinks?.youtube || ''
                      }
                      unstyled
                      className="mt-4"
                    >
                      <IconBrandYoutube />
                    </Button>
                  )}
                  {settingsData?.earaSettings?.themeSettings?.socialMediaLinks?.x && (
                    <Button
                      component="a"
                      target="_blank"
                      href={settingsData?.earaSettings?.themeSettings?.socialMediaLinks?.x || ''}
                      unstyled
                      className="mt-4"
                    >
                      <IconBrandX />
                    </Button>
                  )}
                  {settingsData?.earaSettings?.themeSettings?.socialMediaLinks?.bluesky && (
                    <Button
                      component="a"
                      target="_blank"
                      href={
                        settingsData?.earaSettings?.themeSettings?.socialMediaLinks?.bluesky || ''
                      }
                      unstyled
                      className="mt-4"
                    >
                      <IconBrandBluesky />
                    </Button>
                  )}

                  {settingsData?.earaSettings?.themeSettings?.socialMediaLinks?.tiktok && (
                    <Button
                      component="a"
                      target="_blank"
                      href={
                        settingsData?.earaSettings?.themeSettings?.socialMediaLinks?.tiktok || ''
                      }
                      unstyled
                      className="mt-4"
                    >
                      <IconBrandTiktok />
                    </Button>
                  )}
                </Group>
              </Grid.Col>
              <Grid.Col span={{ sm: 4 }}>
                <Title order={4} c="white" mb="8px">
                  Subscribe our newsletter
                </Title>
                <Text c="earaDark.5" mb="20px">
                  Subscribe to receive the latest updates from us.
                </Text>
                <ButtonEara link="/newsletter-sign-up" variant="with-arrow">
                  Subscribe
                </ButtonEara>
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

          <div className="flex justify-between pt-10">
            <Text c={'earaDark.5'}>
              © {new Date().getFullYear()} European Animal Research Association, All rights
              reserved.
            </Text>
            <Text c={'earaDark.5'}>
              Design and developed by{' '}
              <Link className="underline" href="https://www.yomoc.com">
                YOMOC
              </Link>
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
      <Grid.Col key={data.id} span={{ sm: 1 }} maw={'100%'}>
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
