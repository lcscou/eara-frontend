'use client'
import CardExamples from '@/components/ui/Card/Card.examples'
import Ticker from '@/components/ui/Ticker/Ticker'
import ButtonEara from '@/components/ui/ButtonEara/ButtonEara'
import Hero from '@/components/ui/Hero/Hero'
import Quote from '@/components/ui/Quote/Quote'
import Card from '@/components/ui/Card/Card'
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
      {/* Seção de Notícias */}
      <Section variant="news-grid" subtitle="NEWS" title="Latest research news" containerSize="lg">
        {/* Card principal (grande à esquerda) */}
        <Card
          variant="vertical"
          title="Animal research paved the way for a precision treatment for pancreatic cancer"
          description="A clinical trial in the UK will test for the first time a precision therapy for pancreatic cancer, which is one of the deadliest cancers and for which treatments have"
          image="/two-scientists.png"
          bgColor="white"
          date="2 days ago"
          button={{
            label: '2 min read',
            variant: 'anchor-text',
          }}
        />

        {/* Card superior direito */}
        <Card
          variant="horizontal"
          title="Animal research paved the way for a precision treatment for pancreatic cancer"
          description="INÊS SERRONHO"
          image="/girl-studying.png"
          imagePosition="right"
          bgColor="light"
          date="2 days ago"
          button={{
            label: '2 min read',
            variant: 'anchor-text',
          }}
        />

        {/* Card inferior direito */}
        <Card
          variant="horizontal"
          title="Animal research paved the way for a precision treatment for pancreatic cancer"
          description="INÊS SERRONHO"
          image="/two-scientists.png"
          imagePosition="right"
          bgColor="light"
          date="2 days ago"
          button={{
            label: '2 min read',
            variant: 'anchor-text',
          }}
        />
      </Section>
      <Section
        variant="cards-grid"
        subtitle="RESEARCH"
        title="Our research areas"
        description="Explore the different areas where animal research contributes to scientific advancement"
        containerSize="lg"
        spacing="lg"
      >
        <Card
          variant="vertical"
          title="Medical Research"
          description="Advancing treatments for human diseases through responsible animal research."
          image="/two-scientists.png"
          bgColor="light"
        />
        <Card
          variant="vertical"
          title="Drug Development"
          description="Testing new medications to ensure safety and efficacy before human trials."
          image="/girl-studying.png"
          bgColor="white"
        />
        <Card
          variant="vertical"
          title="Veterinary Science"
          description="Improving animal health and welfare through scientific research."
          image="/two-scientists.png"
          bgColor="dark"
        />
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
