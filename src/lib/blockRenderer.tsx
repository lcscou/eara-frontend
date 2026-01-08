import FeaturedEvents from '@/components/sections/FeaturedEvents/FeaturedEvents'
import FeaturedNews from '@/components/sections/FeaturedNews/FeaturedNews'
import Accordion from '@/components/ui/Accordion/Accordion'
import ButtonEara from '@/components/ui/ButtonEara/ButtonEara'
import Card from '@/components/ui/Card/Card'

import SectionCard from '@/components/sections/SectionCard/SectionCard'
import { HeroSlideItem, HeroSlideRoot } from '@/components/ui/Hero/Hero'
import HomeHero from '@/components/ui/HomeHero/HomeHero'
import Section from '@/components/ui/Section/Section'
import { Box, Container, Group, MantineSize, TextProps, Title } from '@mantine/core'
import parse from 'html-react-parser'
import Image from 'next/image'
import { ReactNode } from 'react'
import { CardProps } from './types'

// Types para os blocos
export interface BlockAttribute {
  [key: string]: unknown
}

export interface Block {
  name: string
  attributes?: BlockAttribute
  innerBlocks?: Block[]
}

// Mapeamento de presets de spacing do WordPress para valores CSS
const spacingPresets: Record<string, string> = {
  '20': '0.5rem', // 8px
  '30': '0.75rem', // 12px
  '40': '1rem', // 16px
  '50': '1.5rem', // 24px
  '60': '2rem', // 32px
  '70': '2.5rem', // 40px
  '80': '3rem', // 48px
  '90': '3.5rem', // 56px
}

// Mapeamento de cores do WordPress para valores CSS
const colorPresets: Record<string, string> = {
  primary: '#0066cc',
  secondary: '#ff6600',
  white: '#ffff',
  accent: '#00cc66',
}

/**
 * Trata valores CSS customizados do WordPress
 * Exemplos:
 * - 'var:preset|spacing|40' -> '1rem'
 * - 'var:preset|color|primary' -> '#0066cc'
 * - '1rem' -> '1rem'
 */
function resolveWordPressValue(value: unknown): string | undefined {
  if (!value || typeof value !== 'string') return undefined

  // Se for um preset customizado do WordPress
  if (value.includes('var:preset')) {
    const parts = value.split('|')
    if (parts.length === 3) {
      const preset = parts[1]
      const key = parts[2]

      if (preset === 'spacing') {
        return spacingPresets[key] || undefined
      }
      if (preset === 'color') {
        return colorPresets[key] || undefined
      }
    }
    return undefined
  }

  // Se for um valor CSS válido direto
  if (value.match(/^[\d.]+(?:px|rem|em|%|vh|vw)$/)) {
    return value
  }

  return undefined
}

/**
 * Trata valores de cor com suporte a presets do WordPress
 */
function parseColor(value: unknown): string | undefined {
  if (!value || typeof value !== 'string') return undefined

  const resolved = resolveWordPressValue(value)
  return resolved || (value.startsWith('#') ? value : undefined)
}

// Mapeamento de presets de spacing do Container
const containerSizeMap: Record<string, MantineSize | 'none'> = {
  xs: 'xs',
  sm: 'sm',
  md: 'md',
  lg: 'lg',
  none: 'none',
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
      const link = attributes.link as string | undefined
      const className = attributes?.className as string | undefined
      const width = attributes?.width as string | undefined
      return (
        <ButtonEara
          key={index}
          label={label}
          w={width}
          className={className}
          variant={variant}
          size={size}
          link={link}
          // onClick={href ? () => (window.location.href = href) : undefined}
        />
      )
    }
    // Core Heading
    case 'core/heading': {
      const level = (attributes.level as number) || 2
      const content = (attributes.content as string) || ''
      const textColor = attributes.textColor as string | undefined
      const textAlign = attributes.textAlign as TextProps['ta'] | undefined
      const style = attributes.style as
        | {
            typography?: { fontSize?: string }
            elements?: { link?: { color?: { text?: string } } }
            spacing?: {
              padding?: { bottom?: string; top?: string; left?: string; right?: string }
              margin?: { bottom?: string; top?: string; left?: string; right?: string }
            }
          }
        | undefined
      const styleColor = style?.elements?.link?.color?.text
      const color = parseColor(textColor) || parseColor(styleColor) || undefined
      const fontSize = style?.typography?.fontSize
      const margin = style?.spacing?.margin
      return (
        <Title
          key={index}
          order={level as 1 | 2 | 3 | 4 | 5 | 6}
          c={color}
          fz={fontSize}
          mt={resolveWordPressValue(margin?.top)}
          mb={resolveWordPressValue(margin?.bottom) || '10px'}
          ml={resolveWordPressValue(margin?.left)}
          mr={resolveWordPressValue(margin?.right)}
          ta={textAlign}
        >
          {parse(content)}
        </Title>
      )
    }
    case 'eara/section': {
      const title = (attributes.title as string) || ''
      const subtitle = (attributes.subtitle as string) || ''
      const containerSize = containerSizeMap[attributes.containerSize as string] || 'lg'
      const backgroundColor = (attributes.backgroundColor as string) || undefined
      return (
        <Section
          key={index}
          title={title}
          subtitle={subtitle}
          containerSize={containerSize}
          className="relative"
          style={{ backgroundColor: backgroundColor }}
        >
          {innerBlocks.map((innerBlock, idx) => renderBlock(innerBlock, idx))}
        </Section>
      )
    }

    case 'eara/latest-news': {
      return <FeaturedNews key={index} withSectionWrapper={false} />
    }

    case 'eara/latest-events': {
      return <FeaturedEvents key={index} withSectionWrapper={false} />
    }

    case 'eara/section-card': {
      const image = (attributes.image as { url: string } | undefined)?.url || ''
      const orientation = (attributes.orientation as 'image-left' | 'image-right') || 'image-left'
      return (
        <SectionCard key={index} image={image} orientation={orientation}>
          {innerBlocks.map((innerBlock, idx) => renderBlock(innerBlock, idx))}
        </SectionCard>
      )
    }

    case 'eara/card': {
      const className = (attributes.className as string) || ''
      const featuredImage = attributes.featuredImage as { url: string } | undefined
      const title = (attributes.title as string) || ''
      const link = (attributes.uri as string) || ''
      const variant = (attributes.variant as CardProps['variant']) || 'layout-1'
      return (
        <Card
          id={index.toString()}
          key={index}
          variant={variant}
          uri={link}
          className={className}
          featuredImage={featuredImage?.url || ''}
          title={title}
        >
          {innerBlocks.map((innerBlock, idx) => renderBlock(innerBlock, idx))}
        </Card>
      )
    }

    case 'eara/box': {
      const className = (attributes.className as string) || ''
      const backgroundColor = attributes.backgroundColor as string | undefined
      const padding = attributes.padding as string | undefined
      const margin = attributes.margin as string | undefined
      // const href = attributes.href as string | undefined
      return (
        <Box
          key={index}
          className={className}
          bg={backgroundColor}
          p={padding}
          bdrs="lg"
          m={margin}
        >
          {innerBlocks.map((innerBlock, idx) => renderBlock(innerBlock, idx))}
        </Box>
      )
    }

    case 'eara/hero-home': {
      return (
        <HomeHero
          key={index}
          overlayOpacity={attributes.overlayOpacity as number | undefined}
          overlayColor={attributes.overlayColor as string | undefined}
        >
          {innerBlocks.map((innerBlock, idx) => renderBlock(innerBlock, idx))}
        </HomeHero>
      )
    }

    // Core Paragraph
    case 'core/paragraph': {
      const content = (attributes.content as string) || ''
      const textColor = attributes.textColor as string | undefined
      const fontSize = attributes.fontSize as string | undefined
      const style = attributes.style as
        | {
            spacing?: {
              padding?: { bottom?: string; top?: string; left?: string; right?: string }
              margin?: { bottom?: string; top?: string; left?: string; right?: string }
            }
            typography?: { fontSize?: string }
            elements?: { link?: { color?: { text?: string } } }
          }
        | undefined
      const color =
        parseColor(textColor) || parseColor(style?.elements?.link?.color?.text) || undefined
      const paddingBottom = resolveWordPressValue(style?.spacing?.padding?.bottom)
      const paddingTop = resolveWordPressValue(style?.spacing?.padding?.top)
      const marginBottom = resolveWordPressValue(style?.spacing?.margin?.bottom || '10px')
      const textAlign = attributes.textAlign as TextProps['ta'] | undefined
      return (
        <Box
          component="span"
          key={index}
          c={color}
          size={fontSize}
          ta={textAlign}
          pb={paddingBottom}
          pt={paddingTop}
          mb={marginBottom}
          display="block"
        >
          {parse(content)}
        </Box>
      )
    }
    // Core List
    case 'core/list': {
      const ordered = attributes.ordered || false
      const values = (attributes.values as string) || ''
      const ListTag = ordered ? 'ol' : 'ul'
      return <ListTag key={index}>{parse(values)}</ListTag>
    }
    // Hero Carousel
    case 'eara/hero-carousel': {
      return (
        <HeroSlideRoot key={index}>
          {innerBlocks.map((innerBlock, idx) => renderBlock(innerBlock, idx))}
        </HeroSlideRoot>
      )
    }
    // Hero Slide
    case 'eara/hero-slide': {
      const backgroundImage = attributes.backgroundImageDesktop as { url: string } | undefined
      return (
        <HeroSlideItem bgImageSrc={backgroundImage?.url} key={index}>
          {innerBlocks.map((innerBlock, idx) => renderBlock(innerBlock, idx))}
        </HeroSlideItem>
      )
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
