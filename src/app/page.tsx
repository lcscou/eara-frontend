'use client'
import CardExamples from '@/components/ui/Card/Card.examples'
import Ticker from '@/components/ui/Ticker/Ticker'
import ButtonEara from '@/components/ui/ButtonEara/ButtonEara'
import Hero from '@/components/ui/Hero/Hero'
import Quote from '@/components/ui/Quote/Quote'
import { Container, Group, Title, Text } from '@mantine/core'
export default function Home() {
  return (
    <>
      <Hero
        bgImageSrc="/eara-hero-bg.png"
        content={
          <>
            <Container mt={110}>
              <div className="flex flex-col items-center justify-center gap-10">
                <Title order={1} className="sm:text-center">
                  The place to learn about animal research: why science still needs animals and how
                  they are used responsibly and humanely.
                </Title>
                <Text>
                  Trusted, up-to-date information on animal research for different audiences.
                </Text>
                <Group>
                  <ButtonEara label="Learn Since Still Needs Animals" variant="filled" />
                  <ButtonEara label="Learn Since Still Needs Animals" variant="outline" />
                </Group>
              </div>
            </Container>
          </>
        }
      />
      <CardExamples />
      <div className="pt-[120px]">
        <Container size="sm">
          <Quote
            variant="light"
            texto="Animals can suffer from many of the same conditions as humans, such as cancer, heart disease, epilepsy and infectious diseases."
            author="António Exemplo"
            avatar="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
          />
        </Container>
      </div>
      <Ticker
        messages={[
          {
            id: '1',
            text: 'EARA conference will happen on 24 November 2025. Join our upcoming webinar on ethical research practices. Join our upcoming webinar on ethical research practices!!',
            link: '/conference-2025',
            linkLabel: 'KNOW MORE',
          },
          {
            id: '2',
            text: 'New research guidelines published for animal welfare',
            link: '/guidelines',
            linkLabel: 'READ MORE',
          },
          {
            id: '3',
            text: 'Join our upcoming webinar on ethical research practices',
            link: '/webinar',
            linkLabel: 'REGISTER',
          },
        ]}
        bgColor="secondary"
        textColor="dark"
        position="fixed-bottom"
        dismissible={true}
      />
    </>
  )
}
