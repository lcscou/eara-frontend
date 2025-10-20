import { HTMLAttributeAnchorTarget, ReactElement } from 'react'
export interface PageTitleBarProps {
  title?: string | null
  author?: string | null
  date?: string | null
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
export interface FooterProps {
  id?: string
}