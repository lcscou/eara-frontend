'use client'
import { Carousel } from '@mantine/carousel'
import clsx from 'clsx'
import type { CSSProperties } from 'react'
import { createContext, ReactNode, useContext, useState } from 'react'

import { getHeroBackgroundStyle } from '@/lib/heroBackground'

import s from './Hero.module.css'

type HeroSlideContextType = {
  activeIndex: number
  setActiveIndex: (index: number) => void
}

const HeroSlideContext = createContext<HeroSlideContextType | null>(null)

type HeroSlideProps = {
  children: ReactNode
}

interface HeroSlideItemProps extends React.HTMLAttributes<HTMLDivElement> {
  children: ReactNode
  bgImageSrc?: string
  backgroundStyle?: CSSProperties
}

export function HeroSlideItem({
  children,
  bgImageSrc,
  backgroundStyle,
  style,
  ...props
}: HeroSlideItemProps) {
  const ctx = useContext(HeroSlideContext)
  if (!ctx) {
    console.error(
      'HeroSlide.Item was rendered outside <HeroSlide>. This slide was skipped. Wrap it in <HeroSlide> to render it correctly.'
    )
    return null
  }
  return (
    <Carousel.Slide>
      <div
        style={{
          ...(backgroundStyle ?? getHeroBackgroundStyle({ imageUrl: bgImageSrc })),
          ...style,
        }}
        className={clsx(
          'bg-primaryColor flex min-h-svh items-center justify-center bg-cover',
          s.bgOverlay
        )}
        {...props}
      >
        <div className="z-2">{children}</div>
      </div>
    </Carousel.Slide>
  )
}

export function HeroSlideRoot({ children }: HeroSlideProps) {
  const [activeIndex, setActiveIndex] = useState(0)
  const howManySlides = Array.isArray(children) ? children.length : 1
  return (
    <HeroSlideContext.Provider value={{ activeIndex, setActiveIndex }}>
      <Carousel withControls={howManySlides > 1}>{children}</Carousel>
    </HeroSlideContext.Provider>
  )
}

const HeroSlide = Object.assign(HeroSlideRoot, {
  Item: HeroSlideItem,
})

export default HeroSlide
