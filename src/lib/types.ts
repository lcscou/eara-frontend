import { HTMLAttributeAnchorTarget, ReactElement } from 'react'
export interface PageTitleBarProps {
  title?: string | null
  author?: string | null
  date?: string | null
  featuredImage?: string | null
  readingTime?:  number | null
}
export interface HeroProps {
  content: ReactElement
  bgImageSrc?: string
}
export interface CardProps {
  id: string
}
export interface QuoteProps{
  texto:string
  author:string
  avatar?:string
  variant?:"light" | "dark"
}
export interface AccordionItem {
  value: string      // valor único para cada item
  titulo: string
  conteudo: React.ReactNode
}
export interface AccordionProps{
  items: AccordionItem[]
  variant?:"green" | "blue" | "lightblue" | "transparent"
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