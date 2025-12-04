'use client'
import { Carousel } from '@mantine/carousel'
import clsx from 'clsx'
import { createContext, ReactNode, useContext, useState } from 'react'
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
}

export function HeroSlideItem({ children, bgImageSrc, ...props }: HeroSlideItemProps) {
  const ctx = useContext(HeroSlideContext)
  if (!ctx) throw new Error('HeroSlide.Item deve ser usado dentro de <HeroSlide>')
  return (
    <Carousel.Slide>
      <div
        style={{ backgroundImage: `url(${bgImageSrc})` }}
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
