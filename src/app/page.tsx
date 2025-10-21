'use client'
import CardExamples from '@/components/ui/Card/Card.examples'
import ButtonEara from '@/components/ui/ButtonEara/ButtonEara'
import Hero from '@/components/ui/Hero/Hero'
import Quote from '@/components/ui/Quote/Quote'
import { Container, Group, Title, Text } from '@mantine/core'
import { Carousel } from '@mantine/carousel'
import Section from '@/components/ui/Section/Section'
export default function Home() {
  return (
    <>
      <Carousel withIndicators controlSize={50}>
        <Carousel.Slide>
          {' '}
          <Hero
            bgImageSrc="/eara-hero-bg.png"
            content={
              <>
                <Container mt={110}>
                  <div className="flex flex-col items-center justify-center gap-10">
                    <Title order={1} className="sm:text-center">
                      The place to learn about animal research: why science still needs animals and
                      how they are used responsibly and humanely.
                    </Title>
                    <Text>
                      Trusted, up-to-date information on animal research for different audiences.
                    </Text>
                    <Group>
                      <ButtonEara label="Learn Since Still Needs Animals" variant="with-arrow" />
                      <ButtonEara label="Learn Since Still Needs Animals" variant="outline" />
                    </Group>
                  </div>
                </Container>
              </>
            }
          />
        </Carousel.Slide>
        <Carousel.Slide>
          <Hero
            bgImageSrc="/eara-hero-bg.png"
            content={
              <>
                <Container mt={110}>
                  <div className="flex flex-col items-center justify-center gap-10">
                    <Title order={1} className="sm:text-center">
                      The place to learn about animal research: why science still needs animals and
                      how they are used responsibly and humanely.
                    </Title>
                    <Text>
                      Trusted, up-to-date information on animal research for different audiences.
                    </Text>
                    <Group>
                      <ButtonEara label="Learn Since Still Needs Animals" variant="with-arrow" />
                      <ButtonEara label="Learn Since Still Needs Animals" variant="outline" />
                    </Group>
                  </div>
                </Container>
              </>
            }
          />
        </Carousel.Slide>
        <Carousel.Slide></Carousel.Slide>
        {/* ...other slides */}
      </Carousel>

      <Section
        title="Become a Member"
        subtitle="Member"
        description="More than 500 institutions across Europe have signed Transparency Agreements. In 2022 alone, 6,996,249 animals were used for scientific purposes, data openly reported by the EU."
      >
        {/* AQUI VAI O SEU COMPONENTE */}
      </Section>

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
    </>
  )
}
