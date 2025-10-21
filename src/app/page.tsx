'use client'
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
  )
}
