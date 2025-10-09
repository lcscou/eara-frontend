import { HTMLAttributeAnchorTarget, ReactElement } from 'react'

export interface PageTitleBarProps {
  title: string
  author: string
  date: string
  readingTime: string
}

export interface HeroProps {
  content: ReactElement
  bgImageSrc?: string
}

export interface CardProps {
  id: string
}

export interface ButtonEaraProps {
  label: string
  link?: string
  target?: HTMLAttributeAnchorTarget
  leftSection?: ReactElement
  RightSection?: ReactElement
  variant?: 'filled' | 'outline' | 'link' | 'with-arrow'
}
