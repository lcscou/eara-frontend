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
  // Identificação
  id?: string

  // Layout e variante
  variant?: 'vertical' | 'horizontal' // default: 'horizontal'
  textAlign?: 'left' | 'center' // default: 'left'

  // Conteúdo principal
  title: string
  description: string
  date?: string

  // Mídia
  image?: string
  imagePosition?: 'left' | 'right' // default: 'left'
  icon?: ReactElement
  avatar?: string
  avatarSize?: 'small' | 'large' // default: 'large'

  // Interações
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

  // Estilo
  bgColor?: 'light' | 'dark' | 'white' // default: 'white'
  className?: string
  withBorder?: boolean // default: true
  shadow?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' // default: 'sm'
  radius?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' // default: 'md'
}
export interface QuoteProps{
  texto:string
  author:string
  avatar?:string
  variant?:"light" | "dark"
}

export interface ButtonEaraProps {
  label: string
  link?: string
  target?: HTMLAttributeAnchorTarget
  leftSection?: ReactElement
  RightSection?: ReactElement
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