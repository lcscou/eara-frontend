'use client'
import CardExamples from '@/components/ui/Card/Card.examples'
import ButtonEara from '@/components/ui/ButtonEara/ButtonEara'
import Hero from '@/components/ui/Hero/Hero'
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
    </>
  )
}
