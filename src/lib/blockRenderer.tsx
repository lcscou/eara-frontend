import Accordion from '@/components/ui/Accordion/Accordion'
import ButtonEara from '@/components/ui/ButtonEara/ButtonEara'
import { Container, Group, MantineSize, Text, Title } from '@mantine/core'
import parse from 'html-react-parser'
import Image from 'next/image'
import { ReactNode } from 'react'

// Types para os blocos
export interface BlockAttribute {
  [key: string]: unknown
}

export interface Block {
  name: string
  attributes?: BlockAttribute
  innerBlocks?: Block[]
}

// Mapeamento de tamanhos do Container
const containerSizeMap: Record<string, MantineSize> = {
  xs: 'xs',
  sm: 'sm',
  md: 'md',
  lg: 'lg',
  xl: 'xl',
}

// Mapeamento de justify para Group
const justifyMap: Record<string, string> = {
  start: 'flex-start',
  center: 'center',
  end: 'flex-end',
  'space-between': 'space-between',
  'space-around': 'space-around',
  'space-evenly': 'space-evenly',
}

// Mapeamento de align para Group
const alignMap: Record<string, string> = {
  start: 'flex-start',
  center: 'center',
  end: 'flex-end',
  stretch: 'stretch',
  baseline: 'baseline',
}

// Mapeamento de gap para Group
const gapMap: Record<string, MantineSize> = {
  xs: 'xs',
  sm: 'sm',
  md: 'md',
  lg: 'lg',
  xl: 'xl',
}

// Função para renderizar blocos individuais
function renderBlock(block: Block, index: number): ReactNode {
  const { name, attributes = {}, innerBlocks = [] } = block

  switch (name) {
    // Container personalizado
    case 'eara/container': {
      const size = containerSizeMap[attributes.size as string] || 'md'
      const px = attributes.px ? Number(attributes.px) : undefined
      const py = attributes.py ? Number(attributes.py) : undefined

      return (
        <Container key={index} size={size} px={px} py={py}>
          {innerBlocks.map((innerBlock, idx) => renderBlock(innerBlock, idx))}
        </Container>
      )
    }

    // Accordion Container
    case 'eara/accordion-container': {
      const items = innerBlocks
        .filter((block) => block.name === 'eara/accordion')
        .map((accordionBlock) => ({
          value: (accordionBlock.attributes?.title as string) || `item-${index}`,
          titulo: (accordionBlock.attributes?.title as string) || 'Untitled',
          conteudo: (
            <div>
              {accordionBlock.innerBlocks?.map((innerBlock, idx) => renderBlock(innerBlock, idx))}
            </div>
          ),
        }))

      return <Accordion key={index} items={items} />
    }

    // Group (flexbox)
    case 'eara/group': {
      const justify = justifyMap[attributes.justify as string] || 'flex-start'
      const align = alignMap[attributes.align as string] || 'center'
      const gap = gapMap[attributes.gap as string] || 'md'
      const grow = attributes.grow === true
      const wrap = attributes.wrap === 'wrap' ? 'wrap' : 'nowrap'
      const className = (attributes.className as string) || ''

      return (
        <Group
          key={index}
          justify={justify}
          align={align}
          gap={gap}
          grow={grow}
          wrap={wrap}
          className={className}
        >
          {innerBlocks.map((innerBlock, idx) => renderBlock(innerBlock, idx))}
        </Group>
      )
    }

    // Button personalizado
    case 'eara/button': {
      const label = (attributes.label as string) || 'Button'
      const variant =
        (attributes.variant as 'filled' | 'outline' | 'link' | 'with-arrow') || 'filled'
      const size = (attributes.size as string) || 'md'
      const href = attributes.href as string | undefined

      return (
        <ButtonEara
          key={index}
          label={label}
          variant={variant}
          size={size}
          onClick={href ? () => (window.location.href = href) : undefined}
        />
      )
    }

    // Core Heading
    case 'core/heading': {
      const level = (attributes.level as number) || 2
      const content = (attributes.content as string) || ''
      const textColor = attributes.textColor as string | undefined
      const style = attributes.style as
        | { elements?: { link?: { color?: { text?: string } } } }
        | undefined

      const color = textColor || style?.elements?.link?.color?.text

      return (
        <Title key={index} order={level as 1 | 2 | 3 | 4 | 5 | 6} c={color}>
          {parse(content)}
        </Title>
      )
    }

    // Core Paragraph
    case 'core/paragraph': {
      const content = (attributes.content as string) || ''
      const textColor = attributes.textColor as string | undefined
      const fontSize = attributes.fontSize as string | undefined

      return (
        <Text key={index} c={textColor} size={fontSize}>
          {parse(content)}
        </Text>
      )
    }

    // Core List
    case 'core/list': {
      const ordered = attributes.ordered || false
      const values = (attributes.values as string) || ''

      const ListTag = ordered ? 'ol' : 'ul'

      return <ListTag key={index}>{parse(values)}</ListTag>
    }

    // Core Image
    case 'core/image': {
      const url = (attributes.url || attributes.src) as string
      const alt = (attributes.alt || '') as string
      const width = attributes.width as number
      const height = attributes.height as number

      if (!url) return null

      return (
        <Image
          key={index}
          src={url}
          alt={alt}
          width={width || 800}
          height={height || 600}
          style={{ maxWidth: '100%', height: 'auto' }}
        />
      )
    }

    // Bloco desconhecido - renderiza HTML bruto ou aviso
    default: {
      console.warn(`Block type "${name}" not implemented yet`)

      // Se tiver innerBlocks, tenta renderizá-los
      if (innerBlocks.length > 0) {
        return (
          <div key={index}>
            {innerBlocks.map((innerBlock, idx) => renderBlock(innerBlock, idx))}
          </div>
        )
      }

      // Se tiver conteúdo HTML, renderiza com parse
      if (attributes.content) {
        return <div key={index}>{parse(attributes.content as string)}</div>
      }

      return null
    }
  }
}

// Função principal para renderizar array de blocos
export function renderBlocks(blocks: Block[]): ReactNode {
  if (!blocks || blocks.length === 0) {
    return null
  }

  return blocks.map((block, index) => renderBlock(block, index))
}

// Função helper para renderizar blocos de uma página
export function renderPageBlocks(blocks: string | Block[] | null | undefined): ReactNode {
  if (!blocks) return null

  // Se vier como string JSON, faz parse
  if (typeof blocks === 'string') {
    try {
      const parsed = JSON.parse(blocks)
      return renderBlocks(parsed)
    } catch (error) {
      console.error('Error parsing blocks JSON:', error)
      return null
    }
  }

  // Se já for array, renderiza direto
  return renderBlocks(blocks)
}
