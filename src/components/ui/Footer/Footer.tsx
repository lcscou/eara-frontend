'use client'
import { Button, Container, Grid, Group, Image, Stack, Title, Text } from '@mantine/core'
import styles from './Footer.module.css'
import { FooterProps } from '@/lib/types'
import {
  IconBrandFacebook,
  IconBrandInstagram,
  IconBrandLinkedin,
  IconBrandYoutube,
} from '@tabler/icons-react'
import { title } from 'process'

const footerColumns = [
  {
    title: 'Quick Links',
    links: [
      {
        label: 'Engaging',
        uri: '#',
      },
      {
        label: 'Informing',
        uri: '#',
      },
      {
        label: 'Supporting',
        uri: '#',
      },
      {
        label: 'About us',
        uri: '#',
      },
      {
        label: 'Contact',
        uri: '#',
      },
    ],
  },
  {
    title: 'Legal',
    links: [
      {
        label: 'Privacy Policy',
        uri: '#',
      },
      {
        label: 'Terms of Service',
        uri: '#',
      },
      {
        label: 'Cookies Policy',
        uri: '#',
      },
    ],
  },
  {
    title: 'Legal',
    links: [
      {
        label: 'Privacy Policy',
        uri: '#',
      },
      {
        label: 'Terms of Service',
        uri: '#',
      },
      {
        label: 'Cookies Policy',
        uri: '#',
      },
    ],
  },
  {
    title: 'Legal',
    links: [
      {
        label: 'Privacy Policy',
        uri: '#',
      },
      {
        label: 'Terms of Service',
        uri: '#',
      },
      {
        label: 'Cookies Policy',
        uri: '#',
      },
    ],
  },
]

export default function Footer({ id }: FooterProps) {
  return (
    <>
      <Container fluid className="py-[16px]">
        <footer className="bg-earaDark rounded-2xl p-10 text-white">
          <div className="border-b-1 border-[#ffffff25] pb-16">
            <Grid gutter={50}>
              <Grid.Col span={{sm: 4}}>
                <Image w={350} src="/logo-eara-light.svg" alt="Logo Eara" />
              </Grid.Col>
              <Grid.Col span={{sm: 4}}>
                <Title order={4} c="earaDark.5">
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
              <Grid.Col span={{sm: 4}}>
                <Title order={4} size={30}>
                  Subscribe our newsletter
                </Title>
              </Grid.Col>
            </Grid>
          </div>

          <div className="pt-16">
            <Grid>
              <FooterColumn data={footerColumns} />
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

export function FooterColumn({ data }: { data: typeof footerColumns }) {
  return (
    <>
      {data &&
        data.map((col, i) => {
          return (
            <Grid.Col key={col.title.split('').join() + i} span={{sm: 3}}>
              <Title order={4} c="earaDark.5">
                {col.title}
              </Title>
              <Stack className="mt-4" gap={5}>
                {col.links &&
                  col.links.map((links) => (
                    <Button key={links.label} unstyled component="a" href={links.uri}>
                      {links.label}
                    </Button>
                  ))}
              </Stack>
            </Grid.Col>
          )
        })}
    </>
  )
}
