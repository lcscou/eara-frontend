'use client'
import FeaturedEvents from '@/components/sections/FeaturedEvents/FeaturedEvents'
import FeaturedNews from '@/components/sections/FeaturedNews/FeaturedNews'
import ButtonEara from '@/components/ui/ButtonEara/ButtonEara'
import Card from '@/components/ui/Card/Card'
import HeroSlide from '@/components/ui/Hero/Hero'
import InfoButton from '@/components/ui/InfoButton/InfoButton'

import Section from '@/components/ui/Section/Section'
import Ticker from '@/components/ui/Ticker'
import { Carousel } from '@mantine/carousel'
import { Container, Grid, Group, List, Text, Title } from '@mantine/core'
import { IconCircleCheck, IconNotebook } from '@tabler/icons-react'
import Image from 'next/image'

export default function Home() {
  return (
    <>
      <HeroSlide>
        <HeroSlide.Item bgImageSrc="/CursodeExperimentacaoAnimal-041.webp">
          <Container size="lg" className="mt-[80px] flex flex-col items-center gap-5 text-white">
            <Title order={1} className="text-white sm:text-center">
              The place to learn about animal research: why science still needs animals and how they
              are used responsibly and humanely.
            </Title>
            <Text>Trusted, up-to-date information on animal research for different audiences.</Text>
            <Group>
              <ButtonEara label="Learn Why Science Still Needs Animals" variant="filled" w={345} />
              <ButtonEara label="What we do" variant="outline" w={345} />
            </Group>
          </Container>
          <div className="absolute right-5 bottom-5">
            <InfoButton
              content={
                <>
                  <b>Credit</b> NOVA Medical School, Portugal
                  <ButtonEara
                    label="Find Out More"
                    variant="link"
                    size="sm"
                    w="fit-content"
                    link="/transparency/media-bank?media=cursodeexperimentacaoanimal-041"
                  />
                </>
              }
            />
          </div>
        </HeroSlide.Item>
      </HeroSlide>
      {/* Seção de Notícias */}
      <FeaturedNews />
      <FeaturedEvents />

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

      <Section noTitle py="30px">
        <div className="grid gap-5 sm:grid-cols-2">
          <div className="w-full rounded-2xl bg-[#1A2058] p-14 text-white">
            <Title order={4} mb={30}>
              What is Animal Research?
            </Title>
            <Text mb={7}>
              Behind every medical advance, there is research, and often, animals have played a
              crucial role.
            </Text>
            <Text mb={7}>
              Biomedical research using animals helps scientists understand diseases and develop new
              treatments for both humans and animals.
            </Text>
            <Text mb={7}>
              Animals can suffer from many of the same conditions as humans, such as cancer, heart
              disease, epilepsy and infectious diseases.
            </Text>
            <Text mb={7}>
              Research with animals has been essential to develop vaccines, medicines and therapies
              that save lives.
            </Text>
            <ButtonEara label="learn more about" variant="with-arrow" className="mt-10" />
          </div>
          <div className="bg-earaGrayLight w-full rounded-2xl p-20">
            <Title order={4} mb={30}>
              Beyond Animal Research
            </Title>
            <Text mb={7}>
              Behind every medical advance, there is research, and often, animals have played a
              crucial role.
            </Text>
            <Text mb={7}>
              Biomedical research using animals helps scientists understand diseases and develop new
              treatments for both humans and animals.
            </Text>
            <Text mb={7}>
              Animals can suffer from many of the same conditions as humans, such as cancer, heart
              disease, epilepsy and infectious diseases.
            </Text>
            <Text mb={7}>
              Research with animals has been essential to develop vaccines, medicines and therapies
              that save lives.
            </Text>
            <ButtonEara label="learn more about" variant="with-arrow" className="mt-10" />
          </div>
        </div>
      </Section>

      {/* <SectionCard image="/informing.jpg" orientation="image-left">
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
      </SectionCard> */}
      <Section
        title="Choose Your Path"
        subtitle="Audiences"
        containerSize="none"
        description="EARA provides tailored information for different audiences. Find the resources and information most relevant to you."
      >
        <Carousel slideSize="22%" slideGap={20} emblaOptions={{ align: 'center', loop: true }}>
          {Array.from({ length: 6 }, (_, i) => i).map((_, i) => (
            <Carousel.Slide key={i} className="py-10">
              <Card
                title="For the Public"
                variant="vertical"
                bgColor="white"
                image="/informing.jpg"
                icon={<IconNotebook />}
                // avatarSize="large"
                // textAlign="center"
                radius="lg"
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
            </Carousel.Slide>
          ))}
        </Carousel>
      </Section>
      <Section
        containerSize="xl"
        title="Transparency & Policy"
        subtitle="EARA POLICIEs"
        description="More than 500 institutions across Europe have signed Transparency Agreements. In 2022 alone, 6,996,249 animals were used for scientific purposes, data openly reported by the EU."
      >
        <div className="flex flex-col items-center justify-center gap-10">
          <div className="grid gap-5 sm:grid-cols-3">
            <div className="rounded-2xl bg-white p-10">
              <Image src="/logo-eara.svg" width={220} height={200} alt="Logo" className="mb-10" />
              <Title order={6} mb={15}>
                Transparency Agreements
              </Title>
              <Text>Learn about our agreements promoting openness in animal research.</Text>
            </div>
            <div className="rounded-2xl bg-white p-10">
              <Image src="/eu-policy.png" width={50} height={200} alt="Logo" className="mb-10" />
              <Title order={6} mb={15}>
                EU Policy
              </Title>
              <Text>Explore the legislative framework governing animal research in the EU.</Text>
            </div>
            <div className="rounded-2xl bg-white p-10">
              <Image
                src="/statistic-and-report.png"
                width={65}
                height={200}
                alt="Logo"
                className="mb-10"
              />
              <Title order={6} mb={15}>
                Statistics & Reports
              </Title>
              <Text>Access data and reports on the use of animals in scientific procedures.</Text>
            </div>
          </div>
          <ButtonEara
            label="Explore Transparency & Policy"
            className="max-w-fit"
            link="/policy/eara-work-on-policy"
            variant="with-arrow"
          />
        </div>
      </Section>
      <Section title="Become a Member" subtitle="Members">
        <div className="grid gap-10 sm:grid-cols-2">
          <div className="col-span-1">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3114.0571234222157!2d-9.2214321!3d38.6935321!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xd1ecb6efee9e7f1%3A0x93b51451a062a591!2sFunda%C3%A7%C3%A3o%20Champalimaud!5e0!3m2!1spt-BR!2sbr!4v1761139288585!5m2!1spt-BR!2sbr"
              width="500"
              height="550"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              className="max-w-full rounded-xl"
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
            link: '/events/eara-conference-2025',
            linkLabel: 'KNOW MORE',
          },
          {
            id: '2',
            text: 'Pill can print healing gel in rabbits’ gut',
            link: '/news/pill-can-print-healing-gel-in-rabbits-gut',
            linkLabel: 'READ MORE',
          },
          {
            id: '3',
            text: 'Join our upcoming webinar on ethical research practices',
            link: '/events/evento-teste',
            linkLabel: 'REGISTER',
          },
        ]}
        className=""
        bgColor="secondary"
        textColor="dark"
        position="fixed-bottom"
        dismissible={true}
      />
    </>
  )
}
