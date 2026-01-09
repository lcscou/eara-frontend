import FeaturedEvents from '@/components/sections/FeaturedEvents/FeaturedEvents'
import FeaturedNews from '@/components/sections/FeaturedNews/FeaturedNews'
import Accordion from '@/components/ui/Accordion/Accordion'
import ButtonEara from '@/components/ui/ButtonEara/ButtonEara'
import Card from '@/components/ui/Card/Card'
import Quote from '@/components/ui/Quote/Quote'

import SectionCard from '@/components/sections/SectionCard/SectionCard'
import { HeroSlideItem, HeroSlideRoot } from '@/components/ui/Hero/Hero'
import HomeHero from '@/components/ui/HomeHero/HomeHero'
import Section from '@/components/ui/Section/Section'
import {
  Box,
  Container,
  Group,
  List,
  MantineSize,
  SimpleGrid,
  Stack,
  TextProps,
  Title,
} from '@mantine/core'
import { IconCircleCheck } from '@tabler/icons-react'
import parse from 'html-react-parser'
import React, { ReactNode } from 'react'
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

// Interfaces para blocos core do Gutenberg
export interface CoreLayoutConfig {
  type?: 'default' | 'constrained' | 'flex' | 'grid'
  inherit?: boolean
  contentSize?: string
  wideSize?: string
  justifyContent?: string
  flexWrap?: 'wrap' | 'nowrap'
  orientation?: 'vertical' | 'horizontal'
  columnCount?: number
}

export interface CoreGroupAttributes extends BlockAttribute {
  tagName?: string
  templateLock?: 'all' | 'insert' | 'contentOnly' | false
  lock?: Record<string, unknown>
  metadata?: Record<string, unknown>
  align?: 'left' | 'center' | 'right' | 'wide' | 'full' | ''
  className?: string
  cssClassName?: string
  style?: {
    spacing?: {
      padding?: { bottom?: string; top?: string; left?: string; right?: string }
      margin?: { bottom?: string; top?: string; left?: string; right?: string }
    }
    typography?: { fontSize?: string; fontFamily?: string }
    color?: { background?: string; text?: string; gradient?: string }
    border?: {
      color?: string
      width?: string
      style?: string
      radius?: string
    }
  }
  backgroundColor?: string
  textColor?: string
  gradient?: string
  fontSize?: string
  fontFamily?: string
  borderColor?: string
  layout?: CoreLayoutConfig
  ariaLabel?: string
  allowedBlocks?: string[]
  anchor?: string
  settings?: Record<string, unknown>
}

export interface CoreRowAttributes extends CoreGroupAttributes {
  layout?: CoreLayoutConfig & { type: 'flex'; flexWrap: 'nowrap' }
}

export interface CoreStackAttributes extends CoreGroupAttributes {
  layout?: CoreLayoutConfig & { type: 'flex'; orientation: 'vertical' }
}

export interface CoreGridAttributes extends CoreGroupAttributes {
  layout?: CoreLayoutConfig & { type: 'grid'; columnCount: number }
}

export interface CoreColumnsAttributes extends BlockAttribute {
  isStackedOnMobile?: boolean
  verticalAlignment?: 'top' | 'center' | 'bottom' | 'stretch'
  layout?: CoreLayoutConfig
  cssClassName?: string
}

export interface CoreColumnAttributes extends BlockAttribute {
  width?: string | number
  verticalAlignment?: 'top' | 'center' | 'bottom' | 'stretch'
  cssClassName?: string
  backgroundColor?: string
  textColor?: string

  style?: {
    spacing?: {
      padding?: { bottom?: string; top?: string; left?: string; right?: string }
      margin?: { bottom?: string; top?: string; left?: string; right?: string }
    }
    typography?: { fontSize?: string }
    elements?: { link?: { color?: { text?: string } } }
    color: {
      background?: string
    }
  }
}

export interface CoreImageAttributes extends BlockAttribute {
  url?: string
  alt?: string
  caption?: string
  title?: string
  width?: number
  height?: number
  href?: string
  linkTarget?: '_blank' | '_self'
  rel?: string
  lightbox?: boolean | { enabled?: boolean }
  aspectRatio?: string
  scale?: string
  sizeSlug?: string
  focalPoint?: { x?: number; y?: number }
  className?: string
  id?: number
  blob?: string
  style?: {
    color?: { background?: string; text?: string }
    spacing?: {
      padding?: { bottom?: string; top?: string; left?: string; right?: string }
      margin?: { bottom?: string; top?: string; left?: string; right?: string }
    }
  }
}

export interface CoreVideoAttributes extends BlockAttribute {
  src?: string
  blob?: string
  id?: number
  poster?: string
  caption?: string
  controls?: boolean
  autoplay?: boolean
  loop?: boolean
  muted?: boolean
  playsInline?: boolean
  preload?: 'auto' | 'metadata' | 'none'
  tracks?: Array<{ kind?: string; src?: string; srcLang?: string }>
  className?: string
  style?: {
    color?: { background?: string; text?: string }
    spacing?: {
      padding?: { bottom?: string; top?: string; left?: string; right?: string }
      margin?: { bottom?: string; top?: string; left?: string; right?: string }
    }
  }
}

export interface CoreSpacerAttributes extends BlockAttribute {
  height?: string | number
  width?: string | number
  className?: string
}

export interface CoreEmbedAttributes extends BlockAttribute {
  url?: string
  providerNameSlug?: string
  type?: 'video' | 'photo' | 'rich' | 'link'
  caption?: string
  allowResponsive?: boolean
  responsive?: boolean
  previewable?: boolean
  className?: string
  style?: {
    color?: { background?: string; text?: string }
    spacing?: {
      padding?: { bottom?: string; top?: string; left?: string; right?: string }
      margin?: { bottom?: string; top?: string; left?: string; right?: string }
    }
  }
}

export interface CoreHtmlAttributes extends BlockAttribute {
  content?: string
  className?: string
}

export interface EaraGoogleMapsAttributes extends BlockAttribute {
  mapUrl?: string
  height?: string
  width?: string
  title?: string
  border?: boolean
  borderRadius?: string
  lock?: Record<string, unknown>
  className?: string
  metadata?: Record<string, unknown>
}

export interface EaraListAttributes extends BlockAttribute {
  withIcon?: boolean
  size?: 'sm' | 'md' | 'lg'
  color?: string
  spacing?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  listStyleType?: 'disc' | 'circle' | 'square' | 'decimal' | 'lower-alpha' | 'upper-alpha'
  lock?: Record<string, unknown>
  metadata?: Record<string, unknown>
  className?: string
}

export interface EaraListItemAttributes extends BlockAttribute {
  text?: string
  className?: string
}

export interface EaraQuoteAttributes extends BlockAttribute {
  content?: string
  author?: string
  backgroundColor?: 'white' | 'light-blue' | 'light-green' | 'light-gray'
  showAvatar?: boolean
  avatarImage?: {
    url?: string
    id?: number
    alt?: string
  }
  variant?: 'dark' | 'light'
  lock?: Record<string, unknown>
  metadata?: Record<string, unknown>
  className?: string
}

export interface CoreListAttributes extends BlockAttribute {
  ordered?: boolean
  values?: string
  type?: string
  start?: number
  reversed?: boolean
  placeholder?: string
  lock?: Record<string, unknown>
  metadata?: Record<string, unknown>
  className?: string
  style?: {
    spacing?: {
      padding?: { bottom?: string; top?: string; left?: string; right?: string }
      margin?: { bottom?: string; top?: string; left?: string; right?: string }
    }
    typography?: { fontSize?: string; fontFamily?: string }
    color?: { background?: string; text?: string }
  }
  backgroundColor?: string
  textColor?: string
  gradient?: string
  fontSize?: string
  fontFamily?: string
  borderColor?: string
  anchor?: string
}

export interface CoreListItemAttributes extends BlockAttribute {
  placeholder?: string
  content?: string
  lock?: Record<string, unknown>
  metadata?: Record<string, unknown>
  className?: string
  style?: {
    spacing?: {
      padding?: { bottom?: string; top?: string; left?: string; right?: string }
      margin?: { bottom?: string; top?: string; left?: string; right?: string }
    }
    typography?: { fontSize?: string; fontFamily?: string }
    color?: { background?: string; text?: string }
  }
  backgroundColor?: string
  textColor?: string
  gradient?: string
  fontSize?: string
  fontFamily?: string
  borderColor?: string
  anchor?: string
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
  primary: '#312f86',
  'primary-color': '#312f86',
  secondary: '#8fbf29',
  'secondary-color': '#8fbf29',
  white: '#ffff',
  'eara-bg-dark': '#e2e2e5',
  'eara-bg-light': '#ededfa',
  'eara-gray-light': '#eaeaea',
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

  if (value === 'secondary-color') {
    return colorPresets['secondary']
  }
  if (value === 'eara-bg-dark') {
    return colorPresets['eara-bg-dark']
  }
  if (value === 'eara-bg-light') {
    return colorPresets['eara-bg-light']
  }
  if (value === 'eara-gray-light') {
    return colorPresets['eara-gray-light']
  }
  if (value === 'primary-color') {
    return colorPresets['primary']
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

// Mapeamento de justify-content do Gutenberg para Mantine/CSS
const justifyContentMap: Record<string, string> = {
  'flex-start': 'flex-start',
  start: 'flex-start',
  'flex-end': 'flex-end',
  end: 'flex-end',
  center: 'center',
  'space-between': 'space-between',
  'space-around': 'space-around',
  'space-evenly': 'space-evenly',
  stretch: 'stretch',
}

/**
 * Extrai configurações de layout do bloco core/group e variações
 * Trata layout.type: 'default', 'constrained', 'flex', 'grid'
 */
function extractLayoutConfig(layout?: CoreLayoutConfig) {
  if (!layout) return {}

  const { type, justifyContent, orientation, columnCount, flexWrap } = layout

  return {
    layoutType: type || 'default',
    justifyContent: (justifyContentMap[justifyContent as string] ||
      justifyContent) as React.CSSProperties['justifyContent'],
    orientation: orientation || 'horizontal',
    columnCount: columnCount || 1,
    flexWrap: (flexWrap || 'wrap') as 'wrap' | 'nowrap',
  }
}

/**
 * Renderiza um bloco core/group com suporte a diferentes tipos de layout
 */
function renderCoreGroup(block: Block, index: number): ReactNode {
  const attributes = block.attributes as CoreGroupAttributes | undefined
  const tagName = (attributes?.tagName || 'div') as string
  const className = attributes?.className || attributes?.cssClassName || ''
  const layout = attributes?.layout
  const anchor = attributes?.anchor
  const ariaLabel = attributes?.ariaLabel
  const align = attributes?.align
  const style = attributes?.style

  // Processando cores
  const bgColor = parseColor(
    style?.color?.background || attributes?.backgroundColor || attributes?.style?.color?.background
  )
  const textColor = parseColor(style?.color?.text || attributes?.textColor)
  const gradient = attributes?.gradient || style?.color?.gradient

  // Processando fonts
  const fontSize = resolveWordPressValue(style?.typography?.fontSize || attributes?.fontSize)
  const fontFamily = style?.typography?.fontFamily || attributes?.fontFamily

  // Processando spacing
  const paddingBottom = resolveWordPressValue(style?.spacing?.padding?.bottom)
  const paddingTop = resolveWordPressValue(style?.spacing?.padding?.top)
  const paddingLeft = resolveWordPressValue(style?.spacing?.padding?.left)
  const paddingRight = resolveWordPressValue(style?.spacing?.padding?.right)
  const marginBottom = resolveWordPressValue(style?.spacing?.margin?.bottom)
  const marginTop = resolveWordPressValue(style?.spacing?.margin?.top)
  const marginLeft = resolveWordPressValue(style?.spacing?.margin?.left)
  const marginRight = resolveWordPressValue(style?.spacing?.margin?.right)

  // Processando border
  const borderColor = parseColor(style?.border?.color || attributes?.borderColor)
  const borderWidth = style?.border?.width
  const borderStyle = style?.border?.style
  const borderRadius = style?.border?.radius

  // Classes de alinhamento WordPress
  const alignClasses = align ? `align${align.charAt(0).toUpperCase()}${align.slice(1)}` : ''

  const combinedClassName = `${className} ${alignClasses}`.trim()

  const { layoutType, justifyContent, flexWrap } = extractLayoutConfig(layout)

  // Estilo inline para border e gradient
  const inlineStyle: React.CSSProperties = {}
  if (gradient) {
    inlineStyle.background = gradient
  } else if (bgColor) {
    inlineStyle.backgroundColor = bgColor
  }
  if (borderColor) inlineStyle.borderColor = borderColor
  if (borderWidth) inlineStyle.borderWidth = borderWidth
  if (borderStyle) inlineStyle.borderStyle = borderStyle
  if (borderRadius) inlineStyle.borderRadius = borderRadius

  // Props comuns para todos os layouts (sem key)
  const commonProps = {
    id: anchor,
    className: combinedClassName,
    'aria-label': ariaLabel,
    c: textColor,
    fz: fontSize,
    ff: fontFamily,
    pb: paddingBottom,
    pt: paddingTop,
    pl: paddingLeft,
    pr: paddingRight,
    mb: marginBottom,
    mt: marginTop,
    ml: marginLeft,
    mr: marginRight,
  }

  // Se for layout flex, usa Stack ou Group
  if (layoutType === 'flex') {
    const isHorizontal = layout?.orientation !== 'vertical'

    if (isHorizontal) {
      return (
        <Group
          key={index}
          component={tagName as 'div'}
          {...commonProps}
          justify={justifyContent as React.CSSProperties['justifyContent']}
          wrap={flexWrap}
          style={{ width: '100%', ...inlineStyle }}
        >
          {block.innerBlocks?.map((innerBlock, idx) => renderBlock(innerBlock, idx))}
        </Group>
      )
    } else {
      return (
        <Stack
          key={index}
          component={tagName as 'div'}
          {...commonProps}
          justify={justifyContent as React.CSSProperties['justifyContent']}
          style={{ width: '100%', ...inlineStyle }}
        >
          {block.innerBlocks?.map((innerBlock, idx) => renderBlock(innerBlock, idx))}
        </Stack>
      )
    }
  }

  // Se for layout grid
  if (layoutType === 'grid') {
    return (
      <SimpleGrid
        key={index}
        component={tagName as 'div'}
        cols={layout?.columnCount || 1}
        {...commonProps}
        style={inlineStyle}
      >
        {block.innerBlocks?.map((innerBlock, idx) => renderBlock(innerBlock, idx))}
      </SimpleGrid>
    )
  }

  // Default/constrained: renderiza como Box
  return (
    <Box
      key={index}
      component={tagName as 'div'}
      {...commonProps}
      style={inlineStyle}
      className="rounded-2xl"
    >
      {block.innerBlocks?.map((innerBlock, idx) => renderBlock(innerBlock, idx))}
    </Box>
  )
}

/**
 * Renderiza um bloco core/row (variação do core/group com layout flex horizontal)
 */
function renderCoreRow(block: Block, index: number): ReactNode {
  const attributes = block.attributes as CoreRowAttributes | undefined
  const tagName = (attributes?.tagName || 'div') as string
  const className = attributes?.cssClassName || ''
  const layout = attributes?.layout || { type: 'flex', flexWrap: 'nowrap' }

  const { justifyContent } = extractLayoutConfig(layout)

  return (
    <Group
      component={tagName as 'div'}
      key={index}
      className={className}
      justify={justifyContent as React.CSSProperties['justifyContent']}
      wrap={layout.flexWrap as 'wrap' | 'nowrap'}
      style={{ width: '100%' }}
    >
      {block.innerBlocks?.map((innerBlock, idx) => renderBlock(innerBlock, idx))}
    </Group>
  )
}

/**
 * Renderiza um bloco core/stack (variação do core/group com layout flex vertical)
 */
function renderCoreStack(block: Block, index: number): ReactNode {
  const attributes = block.attributes as CoreStackAttributes | undefined
  const tagName = (attributes?.tagName || 'div') as string
  const className = attributes?.cssClassName || ''
  const layout = attributes?.layout || { type: 'flex', orientation: 'vertical' }

  const { justifyContent } = extractLayoutConfig(layout)

  return (
    <Stack
      component={tagName as 'div'}
      key={index}
      className={className}
      justify={justifyContent as React.CSSProperties['justifyContent']}
      style={{ width: '100%' }}
    >
      {block.innerBlocks?.map((innerBlock, idx) => renderBlock(innerBlock, idx))}
    </Stack>
  )
}

/**
 * Renderiza um bloco core/grid (variação do core/group com layout grid)
 */
function renderCoreGrid(block: Block, index: number): ReactNode {
  const attributes = block.attributes as CoreGridAttributes | undefined
  const tagName = (attributes?.tagName || 'div') as string
  const className = attributes?.cssClassName || ''
  const columnCount = attributes?.layout?.columnCount || 1

  return (
    <SimpleGrid
      component={tagName as 'div'}
      cols={columnCount}
      key={index}
      className={className}
      style={{ width: '100%' }}
    >
      {block.innerBlocks?.map((innerBlock, idx) => renderBlock(innerBlock, idx))}
    </SimpleGrid>
  )
}

/**
 * Renderiza um bloco core/columns (container para múltiplas colunas)
 */
function renderCoreColumns(block: Block, index: number): ReactNode {
  const attributes = block.attributes as CoreColumnsAttributes | undefined
  const className = attributes?.cssClassName || ''
  const verticalAlignment = attributes?.verticalAlignment || 'top'

  return (
    <Group
      key={index}
      className={className}
      wrap="nowrap"
      align={
        verticalAlignment === 'center'
          ? 'center'
          : verticalAlignment === 'bottom'
            ? 'flex-end'
            : verticalAlignment === 'stretch'
              ? 'stretch'
              : 'flex-start'
      }
      style={{ width: '100%', gap: '0' }}
    >
      {block.innerBlocks?.map((innerBlock, idx) => renderBlock(innerBlock, idx))}
    </Group>
  )
}

/**
 * Renderiza um bloco core/column (coluna dentro de core/columns)
 */
function renderCoreColumn(block: Block, index: number): ReactNode {
  const attributes = block.attributes as CoreColumnAttributes | undefined
  const className = attributes?.cssClassName || ''
  const width = attributes?.width
  const verticalAlignment = attributes?.verticalAlignment || 'top'
  const backgroundColor = attributes?.style?.color?.background || attributes?.backgroundColor
  const textColor = parseColor(attributes?.textColor)
  const style = attributes?.style

  // Processando cores
  const bgColor = parseColor(backgroundColor)
  const color = parseColor(textColor) || parseColor(style?.elements?.link?.color?.text)

  // Processando spacing
  const paddingBottom = resolveWordPressValue(style?.spacing?.padding?.bottom)
  const paddingTop = resolveWordPressValue(style?.spacing?.padding?.top)
  const paddingLeft = resolveWordPressValue(style?.spacing?.padding?.left)
  const paddingRight = resolveWordPressValue(style?.spacing?.padding?.right)
  const marginBottom = resolveWordPressValue(style?.spacing?.margin?.bottom)
  const marginTop = resolveWordPressValue(style?.spacing?.margin?.top)
  const marginLeft = resolveWordPressValue(style?.spacing?.margin?.left)
  const marginRight = resolveWordPressValue(style?.spacing?.margin?.right)

  // Se não tiver width, cada coluna ocupa espaço igual (flex: 1)
  const flexBasis = width
    ? typeof width === 'number'
      ? `${width}%`
      : typeof width === 'string'
        ? width.includes('%') || width.includes('px')
          ? width
          : `${width}%`
        : 'auto'
    : 'auto'

  return (
    <Box
      key={index}
      className={className}
      bg={bgColor}
      c={color}
      pb={paddingBottom}
      pt={paddingTop}
      pl={paddingLeft}
      pr={paddingRight}
      mb={marginBottom}
      mt={marginTop}
      ml={marginLeft}
      mr={marginRight}
      style={{
        flex: width ? `0 0 ${flexBasis}` : '1 1 auto',
        minWidth: 0,
        display: 'flex',
        flexDirection: 'column',
        justifyContent:
          verticalAlignment === 'center'
            ? 'center'
            : verticalAlignment === 'bottom'
              ? 'flex-end'
              : 'flex-start',
      }}
    >
      {block.innerBlocks?.map((innerBlock, idx) => renderBlock(innerBlock, idx))}
    </Box>
  )
}

/**
 * Renderiza um bloco core/image com suporte completo a propriedades
 */
function renderCoreImage(block: Block, index: number): ReactNode {
  const attributes = block.attributes as CoreImageAttributes | undefined
  const url = attributes?.url || attributes?.src
  const alt = attributes?.alt || ''
  const caption = attributes?.caption
  const title = attributes?.title
  const width = attributes?.width || 800
  const href = attributes?.href
  const linkTarget = attributes?.linkTarget || '_self'
  const rel = attributes?.rel || ''
  const className = attributes?.className || ''
  const style = attributes?.style

  // Processando cores e spacing
  const bgColor = parseColor(style?.color?.background)
  const textColor = parseColor(style?.color?.text)

  // Processando spacing
  const paddingBottom = resolveWordPressValue(style?.spacing?.padding?.bottom)
  const paddingTop = resolveWordPressValue(style?.spacing?.padding?.top)
  const paddingLeft = resolveWordPressValue(style?.spacing?.padding?.left)
  const paddingRight = resolveWordPressValue(style?.spacing?.padding?.right)
  const marginBottom = resolveWordPressValue(style?.spacing?.margin?.bottom)
  const marginTop = resolveWordPressValue(style?.spacing?.margin?.top)
  const marginLeft = resolveWordPressValue(style?.spacing?.margin?.left)
  const marginRight = resolveWordPressValue(style?.spacing?.margin?.right)

  if (!url) return null

  const img = (
    <Box
      component="img"
      src={url as string}
      alt={alt}
      title={title}
      width={width}
      height="auto"
      className="rounded-lg"
      style={{ maxWidth: '100%', objectFit: 'cover' }}
    />
  )

  // Se tiver href, envolve em link
  const content = href ? (
    <a href={href} target={linkTarget} rel={rel}>
      {img}
    </a>
  ) : (
    img
  )

  return (
    <Box
      key={index}
      className={className}
      bg={bgColor}
      c={textColor}
      pb={paddingBottom}
      pt={paddingTop}
      pl={paddingLeft}
      pr={paddingRight}
      mb={marginBottom}
      mt={marginTop}
      ml={marginLeft}
      mr={marginRight}
      style={{ display: 'flex', flexDirection: 'column' }}
    >
      {content}
      {caption && <div style={{ marginTop: '0.5rem', fontSize: '0.875rem' }}>{parse(caption)}</div>}
    </Box>
  )
}

/**
 * Renderiza um bloco core/video com suporte completo a propriedades
 */
function renderCoreVideo(block: Block, index: number): ReactNode {
  const attributes = block.attributes as CoreVideoAttributes | undefined
  const src = (attributes?.src || attributes?.blob) as string | undefined
  const poster = attributes?.poster
  const caption = attributes?.caption
  const controls = attributes?.controls !== false
  const autoplay = attributes?.autoplay || false
  const loop = attributes?.loop || false
  const muted = attributes?.muted || false
  const playsInline = attributes?.playsInline || true
  const preload = attributes?.preload || 'metadata'
  const className = attributes?.className || ''
  const style = attributes?.style

  // Processando cores
  const bgColor = parseColor(style?.color?.background)
  const textColor = parseColor(style?.color?.text)

  // Processando spacing
  const paddingBottom = resolveWordPressValue(style?.spacing?.padding?.bottom)
  const paddingTop = resolveWordPressValue(style?.spacing?.padding?.top)
  const paddingLeft = resolveWordPressValue(style?.spacing?.padding?.left)
  const paddingRight = resolveWordPressValue(style?.spacing?.padding?.right)
  const marginBottom = resolveWordPressValue(style?.spacing?.margin?.bottom)
  const marginTop = resolveWordPressValue(style?.spacing?.margin?.top)
  const marginLeft = resolveWordPressValue(style?.spacing?.margin?.left)
  const marginRight = resolveWordPressValue(style?.spacing?.margin?.right)

  if (!src) return null

  return (
    <Box
      key={index}
      className={className}
      bg={bgColor}
      c={textColor}
      pb={paddingBottom}
      pt={paddingTop}
      pl={paddingLeft}
      pr={paddingRight}
      mb={marginBottom}
      mt={marginTop}
      ml={marginLeft}
      mr={marginRight}
      style={{ display: 'flex', flexDirection: 'column' }}
    >
      <video
        src={src}
        poster={poster}
        controls={controls}
        autoPlay={autoplay}
        loop={loop}
        muted={muted}
        playsInline={playsInline}
        preload={preload}
        style={{ width: '100%', height: 'auto' }}
      />
      {caption && <div style={{ marginTop: '0.5rem', fontSize: '0.875rem' }}>{parse(caption)}</div>}
    </Box>
  )
}

/**
 * Renderiza um bloco core/spacer
 */
function renderCoreSpacer(block: Block, index: number): ReactNode {
  const attributes = block.attributes as CoreSpacerAttributes | undefined
  const height = attributes?.height || '2rem'
  const width = attributes?.width || '100%'
  const className = attributes?.className || ''

  const heightValue =
    typeof height === 'number' ? `${height}px` : typeof height === 'string' ? height : '2rem'

  const widthValue =
    typeof width === 'number' ? `${width}px` : typeof width === 'string' ? width : '100%'

  return (
    <Box key={index} className={className} style={{ height: heightValue, width: widthValue }} />
  )
}

/**
 * Renderiza um bloco core/embed com suporte para diversos provedores
 */
function renderCoreEmbed(block: Block, index: number): ReactNode {
  const attributes = block.attributes as CoreEmbedAttributes | undefined
  const url = attributes?.url
  const provider = attributes?.providerNameSlug
  const caption = attributes?.caption
  const className = attributes?.className || ''
  const style = attributes?.style

  // Processando cores
  const bgColor = parseColor(style?.color?.background)
  const textColor = parseColor(style?.color?.text)

  // Processando spacing
  const paddingBottom = resolveWordPressValue(style?.spacing?.padding?.bottom)
  const paddingTop = resolveWordPressValue(style?.spacing?.padding?.top)
  const paddingLeft = resolveWordPressValue(style?.spacing?.padding?.left)
  const paddingRight = resolveWordPressValue(style?.spacing?.padding?.right)
  const marginBottom = resolveWordPressValue(style?.spacing?.margin?.bottom)
  const marginTop = resolveWordPressValue(style?.spacing?.margin?.top)
  const marginLeft = resolveWordPressValue(style?.spacing?.margin?.left)
  const marginRight = resolveWordPressValue(style?.spacing?.margin?.right)

  if (!url) return null

  // Diferentes tipos de embed baseado no provider
  let embedContent: ReactNode = null

  // Para YouTube e Vimeo, extrair ID e gerar iframe
  if (provider === 'youtube') {
    const videoId = url.split(/(?:youtube\.com\/watch\?v=|youtu\.be\/)/)[1]?.split(/[&\?]/)[0]
    if (videoId) {
      embedContent = (
        <div
          className="overflow-hidden rounded-lg"
          style={{ position: 'relative', width: '100%', paddingBottom: '56.25%' }}
        >
          <iframe
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              border: 'none',
            }}
            src={`https://www.youtube.com/embed/${videoId}`}
            title="YouTube video"
            allowFullScreen
          />
        </div>
      )
    }
  } else if (provider === 'vimeo') {
    const videoId = url.split('vimeo.com/')[1]?.split(/[&\?]/)[0]
    if (videoId) {
      embedContent = (
        <div style={{ position: 'relative', width: '100%', paddingBottom: '56.25%' }}>
          <iframe
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              border: 'none',
            }}
            src={`https://player.vimeo.com/video/${videoId}`}
            title="Vimeo video"
            allowFullScreen
          />
        </div>
      )
    }
  } else {
    // Para outros tipos, renderizar um iframe simples
    embedContent = (
      <iframe
        src={url}
        title="Embedded content"
        style={{ width: '100%', height: '400px', border: 'none' }}
        allowFullScreen
      />
    )
  }

  return (
    <Box
      key={index}
      className={className}
      bg={bgColor}
      c={textColor}
      pb={paddingBottom}
      pt={paddingTop}
      pl={paddingLeft}
      pr={paddingRight}
      mb={marginBottom}
      mt={marginTop}
      ml={marginLeft}
      mr={marginRight}
      style={{ display: 'flex', flexDirection: 'column' }}
    >
      {embedContent}
      {caption && <div style={{ marginTop: '0.5rem', fontSize: '0.875rem' }}>{parse(caption)}</div>}
    </Box>
  )
}

/**
 * Renderiza um bloco core/html para conteúdo HTML customizado
 */
function renderCoreHtml(block: Block, index: number): ReactNode {
  const attributes = block.attributes as CoreHtmlAttributes | undefined
  const content = attributes?.content
  const className = attributes?.className || ''

  if (!content) return null

  return (
    <Box key={index} className={className}>
      {parse(content)}
    </Box>
  )
}

/**
 * Renderiza um bloco eara/google-maps para mapas incorporados
 */
function renderEaraGoogleMaps(block: Block, index: number): ReactNode {
  const attributes = block.attributes as EaraGoogleMapsAttributes | undefined
  const mapUrl = attributes?.mapUrl || ''
  const height = attributes?.height ?? '400'
  const width = attributes?.width ?? '100%'
  const title = attributes?.title || 'Location Map'
  const border = attributes?.border !== false
  const borderRadius = attributes?.borderRadius ?? '8'
  const className = attributes?.className || ''

  if (!mapUrl) return null

  const heightValue = `${height}px`
  const widthValue = typeof width === 'number' ? `${width}px` : width
  const radiusValue = `${borderRadius}px`

  return (
    <Box
      key={index}
      className={className}
      style={{
        width: widthValue,
        height: heightValue,
        border: border ? '1px solid #ccc' : 'none',
        borderRadius: radiusValue,
        overflow: 'hidden',
      }}
    >
      <iframe
        src={mapUrl}
        title={title}
        style={{ width: '100%', height: '100%', border: '0' }}
        loading="lazy"
        allowFullScreen
        referrerPolicy="no-referrer-when-downgrade"
      />
    </Box>
  )
}

/**
 * Renderiza um bloco eara/list usando componentes Mantine
 */
function renderEaraList(block: Block, index: number): ReactNode {
  const attributes = block.attributes as EaraListAttributes | undefined
  const withIcon = attributes?.withIcon || false
  const size = (attributes?.size as MantineSize) || 'md'
  // const color = attributes?.color || 'blue'
  const spacing = attributes?.spacing || 'sm'
  const listStyleType = attributes?.listStyleType || 'disc'
  const className = attributes?.className || ''

  const icon = withIcon ? (
    // <Box
    //   component="span"
    //   style={{
    //     width: 8,
    //     height: 8,
    //     borderRadius: '50%',
    //     display: 'inline-block',
    //     backgroundColor: color,
    //   }}
    // />
    <IconCircleCheck size={18} className="text-secondaryColor" />
  ) : undefined

  return (
    <List
      key={index}
      spacing={spacing}
      size={size}
      icon={icon}
      className={className}
      style={withIcon ? undefined : { listStyleType }}
    >
      {block.innerBlocks?.map((innerBlock, idx) => {
        if (innerBlock.name === 'eara/list-item') {
          const itemAttrs = innerBlock.attributes as EaraListItemAttributes | undefined
          const text = itemAttrs?.text || ''
          const itemClassName = itemAttrs?.className || ''
          return (
            <List.Item key={idx} className={itemClassName}>
              {parse(text)}
            </List.Item>
          )
        }
        return <List.Item key={idx}>{renderBlock(innerBlock, idx)}</List.Item>
      })}
    </List>
  )
}

/**
 * Renderiza um item de lista customizado eara/list-item
 */
function renderEaraListItem(block: Block): ReactNode {
  const attributes = block.attributes as EaraListItemAttributes | undefined
  const text = attributes?.text || ''
  const className = attributes?.className || ''

  return <span className={className}>{parse(text)}</span>
}

/**
 * Renderiza um bloco eara/quote usando o componente Quote
 */
function renderEaraQuote(block: Block, index: number): ReactNode {
  const attributes = block.attributes as EaraQuoteAttributes | undefined
  const content = attributes?.content || ''
  const author = attributes?.author || 'Quote Author'
  const showAvatar = attributes?.showAvatar || false
  const avatarUrl = attributes?.avatarImage?.url || ''
  const variant = attributes?.variant || 'dark'
  const className = attributes?.className || ''

  return (
    <Box key={index} className={className}>
      <Quote
        texto={content}
        author={author}
        avatar={showAvatar && avatarUrl ? avatarUrl : undefined}
        variant={variant}
      />
    </Box>
  )
}

/**
 * Renderiza um item de lista Gutenberg core/list-item com suporte completo a atributos
 */
function renderCoreListItem(block: Block, index: number): ReactNode {
  const attributes = block.attributes as CoreListItemAttributes | undefined
  const content = attributes?.content || ''
  const className = (attributes?.className as string) || ''
  const anchor = (attributes?.anchor as string) || undefined

  const style = attributes?.style as
    | {
        spacing?: {
          padding?: { bottom?: string; top?: string; left?: string; right?: string }
          margin?: { bottom?: string; top?: string; left?: string; right?: string }
        }
        typography?: { fontSize?: string; fontFamily?: string }
        color?: { background?: string; text?: string }
      }
    | undefined

  // Colors
  const textColorAttr = (attributes?.textColor as string | undefined) || style?.color?.text
  const backgroundColorAttr =
    (attributes?.backgroundColor as string | undefined) || style?.color?.background
  const gradient = attributes?.gradient as string | undefined
  const borderColorAttr = attributes?.borderColor as string | undefined

  const color = parseColor(textColorAttr)
  const backgroundColor = parseColor(backgroundColorAttr)
  const borderColor = parseColor(borderColorAttr)

  // Typography
  const fontSize = (attributes?.fontSize as string | undefined) || style?.typography?.fontSize
  const fontFamily = (attributes?.fontFamily as string | undefined) || style?.typography?.fontFamily

  // Spacing
  const paddingBottom = resolveWordPressValue(style?.spacing?.padding?.bottom)
  const paddingTop = resolveWordPressValue(style?.spacing?.padding?.top)
  const paddingLeft = resolveWordPressValue(style?.spacing?.padding?.left)
  const paddingRight = resolveWordPressValue(style?.spacing?.padding?.right)
  const marginBottom = resolveWordPressValue(style?.spacing?.margin?.bottom)
  const marginTop = resolveWordPressValue(style?.spacing?.margin?.top)
  const marginLeft = resolveWordPressValue(style?.spacing?.margin?.left)
  const marginRight = resolveWordPressValue(style?.spacing?.margin?.right)

  return (
    <List.Item
      // component="li"
      key={index}
      id={anchor}
      className={className}
      c={color}
      fz={fontSize}
      ff={fontFamily}
      pb={paddingBottom}
      pt={paddingTop}
      pl={paddingLeft}
      pr={paddingRight}
      mb={marginBottom}
      mt={marginTop}
      ml={marginLeft}
      mr={marginRight}
      style={{
        background: gradient ? gradient : backgroundColor,
        border: borderColor ? `1px solid ${borderColor}` : undefined,
      }}
    >
      {parse(content)}
    </List.Item>
  )
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
    // Core Group - Bloco container do Gutenberg com suporte a múltiplos tipos de layout
    case 'core/group': {
      return renderCoreGroup(block, index)
    }
    // Core Row - Variação do core/group com layout flex horizontal
    case 'core/row': {
      return renderCoreRow(block, index)
    }
    // Core Stack - Variação do core/group com layout flex vertical
    case 'core/stack': {
      return renderCoreStack(block, index)
    }
    // Core Grid - Variação do core/group com layout grid responsivo
    case 'core/grid': {
      return renderCoreGrid(block, index)
    }
    // Core Columns - Container para múltiplas colunas
    case 'core/columns': {
      return renderCoreColumns(block, index)
    }
    // Core Column - Coluna dentro de core/columns
    case 'core/column': {
      return renderCoreColumn(block, index)
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
      const levelRaw = (attributes.level as number) ?? 2
      const level = Math.min(6, Math.max(1, levelRaw)) as 1 | 2 | 3 | 4 | 5 | 6
      const content = (attributes.content as string) || ''
      const className = (attributes.className as string) || ''
      const anchor = (attributes.anchor as string) || undefined

      const alignAttr = attributes.align as
        | 'left'
        | 'center'
        | 'right'
        | 'wide'
        | 'full'
        | ''
        | undefined
      const textAlignAttr = (attributes.textAlign as TextProps['ta']) || undefined
      const ta: TextProps['ta'] =
        textAlignAttr ||
        (alignAttr === 'left' || alignAttr === 'center' || alignAttr === 'right'
          ? (alignAttr as TextProps['ta'])
          : undefined)

      const style = attributes.style as
        | {
            spacing?: {
              padding?: { bottom?: string; top?: string; left?: string; right?: string }
              margin?: { bottom?: string; top?: string; left?: string; right?: string }
            }
            typography?: { fontSize?: string; fontFamily?: string }
            color?: { background?: string; text?: string }
            elements?: { link?: { color?: { text?: string } } }
          }
        | undefined

      // Colors
      const textColorAttr = (attributes.textColor as string | undefined) || style?.color?.text
      const backgroundColorAttr =
        (attributes.backgroundColor as string | undefined) || style?.color?.background
      const gradient = attributes.gradient as string | undefined
      const borderColorAttr = attributes.borderColor as string | undefined

      const color =
        parseColor(textColorAttr) || parseColor(style?.elements?.link?.color?.text) || undefined
      const backgroundColor = parseColor(backgroundColorAttr)
      const borderColor = parseColor(borderColorAttr)

      // Typography
      const fontSize = (attributes.fontSize as string | undefined) || style?.typography?.fontSize
      const fontFamily =
        (attributes.fontFamily as string | undefined) || style?.typography?.fontFamily

      // Spacing
      const paddingBottom = resolveWordPressValue(style?.spacing?.padding?.bottom)
      const paddingTop = resolveWordPressValue(style?.spacing?.padding?.top)
      const paddingLeft = resolveWordPressValue(style?.spacing?.padding?.left)
      const paddingRight = resolveWordPressValue(style?.spacing?.padding?.right)
      const marginBottom = resolveWordPressValue(style?.spacing?.margin?.bottom) || '20px'
      const marginTop = resolveWordPressValue(style?.spacing?.margin?.top)
      const marginLeft = resolveWordPressValue(style?.spacing?.margin?.left)
      const marginRight = resolveWordPressValue(style?.spacing?.margin?.right)

      // FitText for headings (data attribute for optional handling)
      const fitText = (attributes.fitText as boolean) || false

      // WP align classes for wide/full/left/center/right
      const alignClass = alignAttr
        ? alignAttr === 'left'
          ? 'alignleft'
          : alignAttr === 'center'
            ? 'aligncenter'
            : alignAttr === 'right'
              ? 'alignright'
              : alignAttr === 'wide'
                ? 'alignwide'
                : alignAttr === 'full'
                  ? 'alignfull'
                  : ''
        : ''
      const headingClassName = [className, alignClass].filter(Boolean).join(' ')

      return (
        <Title
          key={index}
          id={anchor}
          order={level}
          className={headingClassName}
          c={color}
          fz={fontSize}
          ff={fontFamily}
          ta={ta}
          pb={paddingBottom}
          pt={paddingTop}
          pl={paddingLeft}
          pr={paddingRight}
          mb={marginBottom}
          mt={marginTop}
          ml={marginLeft}
          mr={marginRight}
          data-fit-text={fitText || undefined}
          style={{
            background: gradient ? gradient : backgroundColor,
            border: borderColor ? `1px solid ${borderColor}` : undefined,
          }}
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

    case 'eara/google-maps': {
      return renderEaraGoogleMaps(block, index)
    }

    case 'eara/quote': {
      return renderEaraQuote(block, index)
    }

    case 'eara/latest-news': {
      return <FeaturedNews key={index} withSectionWrapper={false} />
    }

    case 'eara/latest-events': {
      return <FeaturedEvents key={index} withSectionWrapper={false} />
    }

    case 'eara/section-card': {
      const image = (attributes.image as { url: string } | undefined)?.url || ''
      const orientation = (attributes.orientation as 'left' | 'right') || 'left'
      const backgroundColor = (attributes.backgroundColor as string) || '#eaeaea'
      return (
        <SectionCard
          key={index}
          image={image}
          orientation={orientation}
          backgroundColor={backgroundColor}
        >
          {innerBlocks.map((innerBlock, idx) => renderBlock(innerBlock, idx))}
        </SectionCard>
      )
    }

    case 'eara/list': {
      return renderEaraList(block, index)
    }

    case 'eara/list-item': {
      return renderEaraListItem(block)
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
      const align =
        (attributes.align as TextProps['ta']) ||
        (attributes as unknown as { textAlign?: TextProps['ta'] }).textAlign
      const direction = attributes.direction as 'ltr' | 'rtl' | undefined
      const dropCap = (attributes.dropCap as boolean) || false
      const className = (attributes.className as string) || ''
      const anchor = (attributes.anchor as string) || undefined

      const style = attributes.style as
        | {
            spacing?: {
              padding?: { bottom?: string; top?: string; left?: string; right?: string }
              margin?: { bottom?: string; top?: string; left?: string; right?: string }
            }
            typography?: { fontSize?: string; fontFamily?: string }
            elements?: { link?: { color?: { text?: string } } }
            color?: { background?: string; text?: string }
          }
        | undefined

      const textColorAttr =
        style?.elements?.link?.color?.text ||
        (attributes.textColor as string | undefined) ||
        style?.color?.text
      const backgroundColorAttr =
        (attributes.backgroundColor as string | undefined) || style?.color?.background
      const gradient = attributes.gradient as string | undefined
      const fontSize = (attributes.fontSize as string | undefined) || style?.typography?.fontSize
      const fontFamily =
        (attributes.fontFamily as string | undefined) || style?.typography?.fontFamily
      const borderColorAttr = attributes.borderColor as string | undefined
      const fitText = (attributes.fitText as boolean) || false

      const color = parseColor(textColorAttr)
      const backgroundColor = parseColor(backgroundColorAttr)
      const borderColor = parseColor(borderColorAttr)

      const paddingBottom = resolveWordPressValue(style?.spacing?.padding?.bottom)
      const paddingTop = resolveWordPressValue(style?.spacing?.padding?.top)
      const paddingLeft = resolveWordPressValue(style?.spacing?.padding?.left)
      const paddingRight = resolveWordPressValue(style?.spacing?.padding?.right)
      const marginBottom = resolveWordPressValue(style?.spacing?.margin?.bottom) || '10px'
      const marginTop = resolveWordPressValue(style?.spacing?.margin?.top)
      const marginLeft = resolveWordPressValue(style?.spacing?.margin?.left)
      const marginRight = resolveWordPressValue(style?.spacing?.margin?.right)

      const computedClassName = dropCap ? `${className} has-drop-cap` : className

      return (
        <Box
          component="p"
          key={index}
          id={anchor}
          className={computedClassName}
          dir={direction}
          c={color}
          fz={fontSize}
          ff={fontFamily}
          ta={align}
          pb={paddingBottom}
          pt={paddingTop}
          pl={paddingLeft}
          pr={paddingRight}
          mb={marginBottom}
          mt={marginTop}
          ml={marginLeft}
          mr={marginRight}
          data-fit-text={fitText || undefined}
          style={{
            background: gradient ? gradient : backgroundColor,
            border: borderColor ? `1px solid ${borderColor}` : undefined,
          }}
        >
          {parse(content)}
        </Box>
      )
    }
    // Core List
    case 'core/list': {
      const attributes_list = attributes as CoreListAttributes | undefined
      const ordered = attributes_list?.ordered || false
      const values = (attributes_list?.values as string) || ''
      const type = attributes_list?.type as string | undefined
      const start = attributes_list?.start as number | undefined
      const reversed = attributes_list?.reversed || false
      const className = (attributes_list?.className as string) || ''
      const anchor = (attributes_list?.anchor as string) || undefined

      const style = attributes_list?.style as
        | {
            spacing?: {
              padding?: { bottom?: string; top?: string; left?: string; right?: string }
              margin?: { bottom?: string; top?: string; left?: string; right?: string }
            }
            typography?: { fontSize?: string; fontFamily?: string }
            color?: { background?: string; text?: string }
          }
        | undefined

      // Colors
      const textColorAttr = (attributes_list?.textColor as string | undefined) || style?.color?.text
      const backgroundColorAttr =
        (attributes_list?.backgroundColor as string | undefined) || style?.color?.background
      const gradient = attributes_list?.gradient as string | undefined
      const borderColorAttr = attributes_list?.borderColor as string | undefined

      const color = parseColor(textColorAttr)
      const backgroundColor = parseColor(backgroundColorAttr)
      const borderColor = parseColor(borderColorAttr)

      // Typography
      const fontSize =
        (attributes_list?.fontSize as string | undefined) || style?.typography?.fontSize
      const fontFamily =
        (attributes_list?.fontFamily as string | undefined) || style?.typography?.fontFamily

      // Spacing
      const paddingBottom = resolveWordPressValue(style?.spacing?.padding?.bottom)
      const paddingTop = resolveWordPressValue(style?.spacing?.padding?.top)
      const paddingLeft = resolveWordPressValue(style?.spacing?.padding?.left)
      const paddingRight = resolveWordPressValue(style?.spacing?.padding?.right)
      const marginBottom = resolveWordPressValue(style?.spacing?.margin?.bottom)
      const marginTop = resolveWordPressValue(style?.spacing?.margin?.top)
      const marginLeft = resolveWordPressValue(style?.spacing?.margin?.left)
      const marginRight = resolveWordPressValue(style?.spacing?.margin?.right)

      // const ListTag = ordered ? 'ol' : 'ul'

      return (
        <List
          // component={ListTag}
          type={ordered ? 'ordered' : 'unordered'}
          icon={<IconCircleCheck size={20} className="text-secondaryColor" />}
          key={index}
          id={anchor}
          className={className}
          c={color}
          fz={fontSize}
          ff={fontFamily}
          pb={paddingBottom}
          pt={paddingTop}
          pl={paddingLeft}
          pr={paddingRight}
          mb={marginBottom}
          mt={marginTop}
          ml={marginLeft}
          mr={marginRight}
          {...(ordered && start !== undefined && { start })}
          {...(ordered && reversed && { reversed: true })}
          style={{
            background: gradient ? gradient : backgroundColor,
            border: borderColor ? `1px solid ${borderColor}` : undefined,
            listStyleType: type || undefined,
          }}
        >
          {innerBlocks && innerBlocks.length > 0
            ? innerBlocks.map((innerBlock, idx) => renderBlock(innerBlock, idx))
            : parse(values)}
        </List>
      )
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
      return renderCoreImage(block, index)
    }
    // Core Video
    case 'core/video': {
      return renderCoreVideo(block, index)
    }
    // Core Spacer
    case 'core/spacer': {
      return renderCoreSpacer(block, index)
    }
    // Core Embed
    case 'core/embed': {
      return renderCoreEmbed(block, index)
    }
    // Core HTML
    case 'core/html': {
      return renderCoreHtml(block, index)
    }
    // Core List Item
    case 'core/list-item': {
      return renderCoreListItem(block, index)
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
