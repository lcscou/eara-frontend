'use client'
import ButtonEara from '@/components/ui/ButtonEara/ButtonEara'
import Hero from '@/components/ui/Hero/Hero'
import Card from '@/components/ui/Card/Card'
import { Container, Group, Title, Text, Grid, List, ActionIcon } from '@mantine/core'
import { Carousel } from '@mantine/carousel'
import Section from '@/components/ui/Section/Section'

import SectionCard from '@/components/sections/SectionCard/SectionCard'
import { IconArrowLeft, IconArrowRight, IconCircleCheck, IconNotebook } from '@tabler/icons-react'
import Ticker from '@/components/ui/Ticker'
import EventCard from '@/components/ui/EventCard/EventCard'
import { EmblaCarouselType } from 'embla-carousel'
import { useState } from 'react'

export default function Home() {
  const [embla, setEmbla] = useState<EmblaCarouselType | null>(null)
  return (
    <>
      <Carousel withIndicators controlSize={50}>
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
                      <ButtonEara label="Learn Since Still Needs Animals" variant="filled" />
                      <ButtonEara label="Learn Since Still Needs Animals" variant="outline" />
                    </Group>
                  </div>
                </Container>
              </>
            }
          />
        </Carousel.Slide>
      </Carousel>
      <Section title="Our Three Pillars" subtitle="About">
        <Grid>
          <Grid.Col span={{ sm: 12, md: 4 }}>
            <Card
              title="Engaging"
              variant="horizontal"
              bgColor="light"
              avatarSize="large"
              textAlign="center"
              avatar="/one-scientists-one-bunny.png"
              description="We engage for the responsible use of animals in research, ensuring ethical standards and transparency."
            />
          </Grid.Col>
          <Grid.Col span={{ sm: 12, md: 4 }}>
            <Card
              title="Informing"
              variant="horizontal"
              bgColor="light"
              avatarSize="large"
              textAlign="center"
              avatar="/informing.jpg"
              description="We communicate the importance of animal research to the public, fostering understanding and support."
            />
          </Grid.Col>
          <Grid.Col span={{ sm: 12, md: 4 }}>
            <Card
              title="Supporting"
              variant="horizontal"
              bgColor="light"
              avatarSize="large"
              textAlign="center"
              avatar="/two-scientists.png"
              description="We collaborate with stakeholders to advance biomedical progress through responsible animal research."
            />
          </Grid.Col>
        </Grid>
      </Section>
      <SectionCard image="/informing.jpg" orientation="image-left">
        <div>
          <Title order={3} mb={20} className="text-primaryColor">
            What is Animal Research?
          </Title>
          <Text fw={'bold'}>
            Behind every medical advance, there is research, and often, animals have played a
            crucial role.
          </Text>
          <Text>
            Biomedical research using animals helps scientists understand diseases and develop new
            treatments for both humans and animals.
          </Text>
          <Text>
            Animals can suffer from many of the same conditions as humans, such as cancer, heart
            disease, epilepsy and infectious diseases.
          </Text>
          <Text>
            Research with animals has been essential to develop vaccines, medicines and therapies
            that save lives.
          </Text>
          <ButtonEara
            className="mt-7"
            label="Learn more about Why Animal Research"
            variant="with-arrow"
          />
        </div>
      </SectionCard>
      <SectionCard image="/informing.jpg" orientation="image-right">
        <div>
          <Title order={3} mb={20} className="text-primaryColor">
            What is Animal Research?
          </Title>
          <Text fw={'bold'}>
            Behind every medical advance, there is research, and often, animals have played a
            crucial role.
          </Text>
          <Text>
            Biomedical research using animals helps scientists understand diseases and develop new
            treatments for both humans and animals.
          </Text>
          <Text>
            Animals can suffer from many of the same conditions as humans, such as cancer, heart
            disease, epilepsy and infectious diseases.
          </Text>
          <Text>
            Research with animals has been essential to develop vaccines, medicines and therapies
            that save lives.
          </Text>
          <ButtonEara
            className="mt-7"
            label="Learn more about Why Animal Research"
            variant="with-arrow"
          />
        </div>
      </SectionCard>{' '}
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
        title="Choose Your Path"
        subtitle="Audiences"
        description="EARA provides tailored information for different audiences. Find the resources and information most relevant to you."
      >
        <div className="grid grid-cols-3 gap-10">
          <div className="col-span-1">
            <Card
              title="For the Public"
              variant="vertical"
              bgColor="light"
              image="/informing.jpg"
              icon={<IconNotebook />}
              // avatarSize="large"
              textAlign="center"
              links={[
                {
                  label: 'WHY IS ANIMAL RESEARCH NEEDED?',
                  href: '/research-needed',
                  variant: 'arrow',
                },
                {
                  label: 'FACTS AND FIGURES',
                  href: '/facts-figures',
                  variant: 'arrow',
                },
              ]}
              description="Explore accessible resources that explain the role of animals in research, ethical considerations, and how animal welfare is ensured."
            />
          </div>
          <div className="col-span-1">
            <Card
              title="For the Public"
              variant="vertical"
              bgColor="light"
              image="/informing.jpg"
              icon={<IconNotebook />}
              // avatarSize="large"
              textAlign="center"
              links={[
                {
                  label: 'WHY IS ANIMAL RESEARCH NEEDED?',
                  href: '/research-needed',
                  variant: 'arrow',
                },
                {
                  label: 'FACTS AND FIGURES',
                  href: '/facts-figures',
                  variant: 'arrow',
                },
              ]}
              description="Explore accessible resources that explain the role of animals in research, ethical considerations, and how animal welfare is ensured."
            />
          </div>
          <div className="col-span-1">
            <Card
              title="For the Public"
              variant="vertical"
              bgColor="light"
              image="/informing.jpg"
              icon={<IconNotebook />}
              // avatarSize="large"
              textAlign="center"
              links={[
                {
                  label: 'WHY IS ANIMAL RESEARCH NEEDED?',
                  href: '/research-needed',
                  variant: 'arrow',
                },
                {
                  label: 'FACTS AND FIGURES',
                  href: '/facts-figures',
                  variant: 'arrow',
                },
              ]}
              description="Explore accessible resources that explain the role of animals in research, ethical considerations, and how animal welfare is ensured."
            />
          </div>
          <div className="col-span-1">
            <Card
              title="For the Public"
              variant="vertical"
              bgColor="light"
              image="/informing.jpg"
              icon={<IconNotebook />}
              // avatarSize="large"
              textAlign="center"
              links={[
                {
                  label: 'WHY IS ANIMAL RESEARCH NEEDED?',
                  href: '/research-needed',
                  variant: 'arrow',
                },
                {
                  label: 'FACTS AND FIGURES',
                  href: '/facts-figures',
                  variant: 'arrow',
                },
              ]}
              description="Explore accessible resources that explain the role of animals in research, ethical considerations, and how animal welfare is ensured."
            />
          </div>
          <div className="col-span-1">
            <Card
              title="For the Public"
              variant="vertical"
              bgColor="light"
              image="/informing.jpg"
              icon={<IconNotebook />}
              // avatarSize="large"
              textAlign="center"
              links={[
                {
                  label: 'WHY IS ANIMAL RESEARCH NEEDED?',
                  href: '/research-needed',
                  variant: 'arrow',
                },
                {
                  label: 'FACTS AND FIGURES',
                  href: '/facts-figures',
                  variant: 'arrow',
                },
              ]}
              description="Explore accessible resources that explain the role of animals in research, ethical considerations, and how animal welfare is ensured."
            />
          </div>
          <div className="col-span-1">
            <Card
              title="For the Public"
              variant="vertical"
              bgColor="light"
              image="/informing.jpg"
              icon={<IconNotebook />}
              // avatarSize="large"
              textAlign="center"
              links={[
                {
                  label: 'WHY IS ANIMAL RESEARCH NEEDED?',
                  href: '/research-needed',
                  variant: 'arrow',
                },
                {
                  label: 'FACTS AND FIGURES',
                  href: '/facts-figures',
                  variant: 'arrow',
                },
              ]}
              description="Explore accessible resources that explain the role of animals in research, ethical considerations, and how animal welfare is ensured."
            />
          </div>
        </div>
      </Section>
      <Section title="Become a Member" subtitle="Members">
        <div className="grid grid-cols-2 gap-10">
          <div className="col-span-1">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3114.0571234222157!2d-9.2214321!3d38.6935321!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xd1ecb6efee9e7f1%3A0x93b51451a062a591!2sFunda%C3%A7%C3%A3o%20Champalimaud!5e0!3m2!1spt-BR!2sbr!4v1761139288585!5m2!1spt-BR!2sbr"
              width="500"
              height="550"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              className="rounded-xl"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
          <div className="col-span-1">
            <Text mb={10}>
              Since its founding in 2014, EARA has grown into an association of more than 200 member
              organisations from 25 European countries and 21 others worldwide.
            </Text>
            <Text>
              Through its members, EARA raises public understanding of animal research, supports
              advocacy and communications, and represents the biomedical research sector at EU and
              national levels.
            </Text>

            <List mt={30} icon={<IconCircleCheck size={18} className="text-secondaryColor" />}>
              <List.Item fw="700">Join a network of like-minded organisations.</List.Item>
              <List.Item fw="700">Access exclusive resources and events.</List.Item>
              <List.Item fw="700">
                Contribute to shaping the future of animal research in Europe.
              </List.Item>
              <List.Item fw="700">Enhance your organisation visibility and impact.</List.Item>
            </List>

            <Text mt={30}>
              Join EARA and be part of the European voice for transparency and responsible research
            </Text>
            <ButtonEara label="Become a member" link="#" variant="with-arrow" className="mt-7" />
          </div>
        </div>
      </Section>
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
      <Section title="EARA Events" subtitle="Events" containerSize="none" className="relative">
        <Group className="absolute top-40 right-20 sm:top-25">
          <ActionIcon variant="light" radius={80} aria-label="Settings">
            <IconArrowLeft onClick={() => embla?.scrollPrev()} />
          </ActionIcon>
          <Group gap={5}>
            {Array.from({ length: embla?.slideNodes().length || 3 }, (_, i) => i).map((_, j) => (
              <span key={j} className="aspect-square w-3 rounded-full bg-[#d6d6ec]"></span>
            ))}
          </Group>
          <ActionIcon variant="light" radius={80} aria-label="Settings">
            <IconArrowRight onClick={() => embla?.scrollNext()} />
          </ActionIcon>
        </Group>
        <Carousel
          slideSize="45%"
          getEmblaApi={setEmbla}
          slideGap={10}
          withControls={false}
          withIndicators={false}
          emblaOptions={{
            loop: true,
            dragFree: false,
            align: 'center',
          }}
          // slideGap={20}
        >
          <Carousel.Slide>
            <EventCard
              category="Conference"
              date="24 November 2025 - 09h"
              excerpt="Lorem ipsum dolor sit amet consectetur adipiscing elit. Quisque faucibus ex sapien vitae pellentesque sem placerat. In id cursus mi pretium tellus duis convallis."
              title="Event Title"
              featuredImage="/two-scientists.png"
            />
          </Carousel.Slide>
          <Carousel.Slide>
            <EventCard
              category="Conference"
              date="24 November 2025 - 09h"
              excerpt="Lorem ipsum dolor sit amet consectetur adipiscing elit. Quisque faucibus ex sapien vitae pellentesque sem placerat. In id cursus mi pretium tellus duis convallis."
              title="Event Title"
              featuredImage="/two-scientists.png"
            />
          </Carousel.Slide>
          <Carousel.Slide>
            <EventCard
              category="Conference"
              date="24 November 2025 - 09h"
              excerpt="Lorem ipsum dolor sit amet consectetur adipiscing elit. Quisque faucibus ex sapien vitae pellentesque sem placerat. In id cursus mi pretium tellus duis convallis."
              title="Event Title"
              featuredImage="/two-scientists.png"
            />
          </Carousel.Slide>
          <Carousel.Slide>
            <EventCard
              category="Conference"
              date="24 November 2025 - 09h"
              excerpt="Lorem ipsum dolor sit amet consectetur adipiscing elit. Quisque faucibus ex sapien vitae pellentesque sem placerat. In id cursus mi pretium tellus duis convallis."
              title="Event Title"
              featuredImage="/two-scientists.png"
            />
          </Carousel.Slide>
          <Carousel.Slide>
            <EventCard
              category="Conference"
              date="24 November 2025 - 09h"
              excerpt="Lorem ipsum dolor sit amet consectetur adipiscing elit. Quisque faucibus ex sapien vitae pellentesque sem placerat. In id cursus mi pretium tellus duis convallis."
              title="Event Title"
              featuredImage="/two-scientists.png"
            />
          </Carousel.Slide>
        </Carousel>
      </Section>
    </>
  )
}
