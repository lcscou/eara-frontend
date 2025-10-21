'use client'
<<<<<<< HEAD
import React from 'react'
import { MantineProvider } from '@mantine/core'
import Accordion from '@/components/ui/Accordion/Accordion'

export default function Page() {
  const items = [
    {
      value: 'item-1',
      titulo: 'Accordion title 1',
      conteudo: (
        <p>
          Behind every medical advance, there is research, and often, animals have played a crucial
          role. Biomedical research using animals helps scientists understand diseases and develop
          new treatments for both humans and animals.
        </p>
      ),
    },
    {
      value: 'item-2',
      titulo: 'Accordion title 2',
      conteudo: (
        <p>
          Behind every medical advance, there is research, and often, animals have played a crucial
          role. Biomedical research using animals helps scientists understand diseases and develop
          new treatments for both humans and animals.
        </p>
      ),
    },
    {
      value: 'item-3',
      titulo: 'Accordion title 3',
      conteudo: (
        <p>
          Behind every medical advance, there is research, and often, animals have played a crucial
          role. Biomedical research using animals helps scientists understand diseases and develop
          new treatments for both humans and animals.
        </p>
      ),
    },
  ]
  return (
    <div className="pt-[120px]">
      <MantineProvider withGlobalStyles withNormalizeCSS>
        <main style={{ padding: 24, maxWidth: 900, margin: '0 auto' }}>
          <Accordion items={items} variant="green" />
        </main>
      </MantineProvider>
    </div>
=======
import CardExamples from '@/components/ui/Card/Card.examples'
import ButtonEara from '@/components/ui/ButtonEara/ButtonEara'
import Hero from '@/components/ui/Hero/Hero'
import Quote from '@/components/ui/Quote/Quote'
import { Container, Group, Title, Text } from '@mantine/core'
import Section from '@/components/ui/Section/Section'
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
      <Section
        title="Become a Member"
        subtitle="Member"
        description="More than 500 institutions across Europe have signed Transparency Agreements. In 2022 alone, 6,996,249 animals were used for scientific purposes, data openly reported by the EU."
      >
        <h2>ola</h2>
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
>>>>>>> 5cdbe392fcdfff35e65bb071e7a08880374c06d4
  )
}
