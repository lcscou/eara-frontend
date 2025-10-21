'use client'
import React from 'react'
import { Accordion as MantineAccordion } from '@mantine/core'
import s from './Accordion.module.css'
import clsx from 'clsx'
import { AccordionProps } from '@/lib/types'

export default function Accordion({ items, variant = 'blue' }: AccordionProps) {
  return (
    <MantineAccordion
      className={clsx(s.root)}
      multiple={false}
      chevronPosition="right"
      classNames={{
        item: clsx(
          s.item,
          variant === 'green' && s.greenItem,
          variant === 'blue' && s.blueItem,
          variant === 'lightblue' && s.lightblueItem,
          variant === 'transparent' && s.transparentItem
        ),
        control: s.control,
        panel: s.panel,
      }}
    >
      {items.map(({ value, titulo, conteudo }) => (
        <MantineAccordion.Item key={value} value={value}>
          <MantineAccordion.Control>{titulo}</MantineAccordion.Control>
          <MantineAccordion.Panel>{conteudo}</MantineAccordion.Panel>
        </MantineAccordion.Item>
      ))}
    </MantineAccordion>
  )
}
