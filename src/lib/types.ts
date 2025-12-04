import {
  GetMenuQuery_RootQuery,
  GetMenuQuery_RootQuery_menus_RootQueryToMenuConnection_nodes_Menu,
  GetMenuQuery_RootQuery_menus_RootQueryToMenuConnection_nodes_Menu_menuItems_MenuToMenuItemConnection_nodes_MenuItem_childItems_MenuItemToMenuItemConnection,
} from '@/graphql/generated/graphql'
import { ButtonProps } from '@mantine/core'
import { HTMLAttributeAnchorTarget, MouseEventHandler, ReactElement } from 'react'

export interface PageTitleBarProps {
  title?: string | null
  author?: string | null
  date?: string | null
  subtitle?: string | null
  eventStartDate?: string | null
  organizer?: string | null
  eventEndDate?: string | null
  readingTime?: number | null
  featuredImage?: string | null
  location?: string | null
  backgroundTitle?: boolean
  aditionalInfoTable?: {
    label?: string | null
    value?: string | ReactElement | null
  }[]
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
export interface ButtonEaraProps extends ButtonProps {
  label?: string
  link?: string
  target?: HTMLAttributeAnchorTarget

  className?: string
  variant?: 'filled' | 'outline' | 'link' | 'with-arrow'
  onClick?: MouseEventHandler<HTMLButtonElement | HTMLAnchorElement>
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
    displayFrequency?: 'every-day' | 'once-a-week' | 'once-a-month' | null // default: 1 (mostra todas as mensagens)
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
  title?: string
  description?: string
  subtitle?: string
  className?: string
  noTitle?: boolean
  py?: string
  // variant?: 'default' | 'news-grid' | 'cards-grid' | 'featured-grid'
  containerSize?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'none'
  spacing?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
}

export interface BackToTopProps {
  id: string
}

export interface InfoButtonProps {
  content: string | React.ReactNode
  width?: number
  className?: string
}

export interface SectionCardProps extends React.PropsWithChildren {
  image: string
  orientation: 'image-left' | 'image-right'
}

export interface CarouselProps {
  id: string
}

export interface EventCardProps {
  id?: string
  title: string
  date?: string
  excerpt?: string
  category?: string
  featuredImage?: string
  link?: string
  orientation?: 'vertical' | 'horizontal'
}

export interface NewsCardProps {
  featuredImage?: string
  title?: string | null
  author?: string
  isFeatured?: boolean
  timeReading?: string | null | number
  orientation?: 'vertical' | 'horizontal'
  excerpt?: string
  link?: string
}

export interface HeaderMegaMenuProps {
  id?: string
  data: GetMenuQuery_RootQuery | undefined
}
export interface HeaderMenuItemsProps {
  variant?: 'megamenu' | 'dropdown' | 'link'
  label?: string | null
  uri?: string | null
  menuTextColor?: string | null
  childItems?: GetMenuQuery_RootQuery_menus_RootQueryToMenuConnection_nodes_Menu_menuItems_MenuToMenuItemConnection_nodes_MenuItem_childItems_MenuItemToMenuItemConnection | null
}
export interface MenuItemMobileProps {
  menu?: GetMenuQuery_RootQuery_menus_RootQueryToMenuConnection_nodes_Menu | null
}

// export interface SearchProps {
//   id: string
// }

export interface GalleryProps {
  loadingMore?: boolean
  data: {
    id: string
    uri?: string | null
    slug?: string | null
    src: string
    width: number
    height: number
    description: string
    creditsMoreInfo?: string | null
    creditWebsite?: string | null
    credits: string
    videoUrl?: string | null
    researchArea?: string
    mediaType?: (string | null)[] | null
    speciesFeaturedOrNewApproachMethodology?: string
    uploadedDate?: string
  }[]
}

export interface AnimalsCardProps {
  id?: string
  featuredImage?: string | null
  description?: string | null
  uri?: string | null
  title?: string | null
}

export interface MembersCardProps {
  id: string
  featuredImage?: string | null
  title?: string | null
  description?: string | null
  uri?: string | null
  country?: string | null
}

export interface ResultNotFoundProps {
  resetFilters?: () => void
}

export interface TeamCardProps {
  id: string
  title?: string | null
  featuredImage?: string | null
  description?: string | null
  uri?: string | null
  role?: string | null
}

export interface CaseStudiesCardProps {
  title?: string | null
  institution?: {
    name: string | null
    website?: string | null
  }
  uri?: string | null
  featuredImage?: string | null
  description?: string | null
}
