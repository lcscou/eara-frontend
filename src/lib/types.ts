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
export interface SectionProps extends React.PropsWithChildren {
  title: string
  description?: string
  subtitle?: string
}
