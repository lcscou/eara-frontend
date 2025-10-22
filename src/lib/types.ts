import { HTMLAttributeAnchorTarget, ReactElement } from 'react'
export interface PageTitleBarProps {
  title?: string | null
  author?: string | null
  date?: string | null
  readingTime?: number | null
  featuredImage?: string | null
}
export interface HeroProps {
  content: ReactElement
  bgImageSrc?: string
  bgImageSrcMobile?: string
}
export interface CardProps {
  id?: string
  variant?: 'vertical' | 'horizontal'
  textAlign?: 'left' | 'center'
  title: string
  description: string
  date?: string
  image?: string
  imagePosition?: 'left' | 'right'
  icon?: ReactElement
  avatar?: string
  avatarSize?: 'small' | 'large'
  links?: Array<{
    label: string
    href: string
    variant?: 'default' | 'arrow'
  }>
  button?: {
    label: string
    href?: string
    target?: HTMLAttributeAnchorTarget
    onClick?: () => void
    variant?: 'filled' | 'outline' | 'anchor-text'
  }
  bgColor?: 'light' | 'dark' | 'white'
  className?: string
  withBorder?: boolean
  shadow?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  radius?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
}
export interface QuoteProps {
  texto: string
  author: string
  avatar?: string
  variant?: 'light' | 'dark'
}
export interface AccordionItem {
  value: string // valor único para cada item
  titulo: string
  conteudo: React.ReactNode
}
export interface AccordionProps {
  items: AccordionItem[]
  variant?: 'green' | 'blue' | 'lightblue' | 'transparent'
}
export interface ButtonEaraProps {
  label: string
  link?: string
  target?: HTMLAttributeAnchorTarget
  leftSection?: ReactElement
  RightSection?: ReactElement
  className?: string
  variant?: 'filled' | 'outline' | 'link' | 'with-arrow'
}
export type MenuItemProps = {
  __typename: 'MenuItem'
  href?: string
  childItems: {
    __typename: 'MenuItemToMenuItemConnection'
    nodes: MenuItemProps[]
  }
  id: string
  label: string
  uri: string
}
export interface TickerProps {
  // Identificação
  id?: string

  // Mensagens do ticker
  messages: Array<{
    id: string
    text: string
    link?: string
    linkLabel?: string // default: 'KNOW MORE'
    target?: '_self' | '_blank' // default: '_self'
  }>

  // Configurações de comportamento
  autoPlay?: boolean // default: true
  autoPlayInterval?: number // default: 5000ms
  showNavigation?: boolean // default: true
  pauseOnHover?: boolean // default: true
  dismissible?: boolean // default: false
  onDismiss?: () => void

  // Posicionamento
  position?: 'static' | 'fixed-bottom' // default: 'static'

  // Estilo
  bgColor?: 'primary' | 'secondary' | 'light' | 'dark' | 'white' // default: 'secondary'
  textColor?: 'white' | 'dark' | 'auto' // default: 'auto'
  className?: string
  radius?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' // default: 'xl'
  size?: 'sm' | 'md' | 'lg' // default: 'md'
}

export interface FooterProps {
  id?: string
}
export interface SectionProps extends React.PropsWithChildren {
  title: string
  description?: string
  subtitle?: string
  className?: string
  variant?: 'default' | 'news-grid' | 'cards-grid' | 'featured-grid'
  containerSize?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'none'
  spacing?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
}

export interface BackToTopProps {
  id: string
}

export interface InfoButtonProps {
  content: string | React.ReactNode
  width?: number
}

export interface SectionCardProps extends React.PropsWithChildren {
  image: string
  orientation: 'image-left' | 'image-right'
}

export interface CarouselProps {
  id: string
}

export interface EventCardProps {
  title: string
  date?: string
  excerpt?: string
  category?: string
  featuredImage?: string
  link?: string
}

export interface NewsCardProps {
  featuredImage?: string
  title: string
  author?: string
  isFeatured?: boolean
  timeReading?: string
  excerpt?: string
  link?: string
}
