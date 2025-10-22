'use client'
import { CardExamples } from '@/components/ui/Card'
import Section from '@/components/ui/Section/Section'
import { Container } from '@mantine/core'

export default function Components() {
  return (
    <div className="py-[110px]">
      <Container fluid>
        <Section title="Accordion"></Section>
        <CardExamples />
      </Container>
    </div>
  )
}
