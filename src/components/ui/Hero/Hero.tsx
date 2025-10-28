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

function HeroSlide({ children }: HeroSlideProps) {
  const [activeIndex, setActiveIndex] = useState(0)
  const howManySlides = Array.isArray(children) ? children.length : 1
  return (
    <HeroSlideContext.Provider value={{ activeIndex, setActiveIndex }}>
      <Carousel withControls={howManySlides > 1}>{children}</Carousel>
    </HeroSlideContext.Provider>
  )
}

interface HeroSlideItemProps extends React.HTMLAttributes<HTMLDivElement> {
  // index: number
  children: ReactNode
  bgImageSrc?: string
}

function HeroSlideItem({ children, bgImageSrc, ...props }: HeroSlideItemProps) {
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
    // <div
    //   className={`transition-opacity duration-700 ${
    //     ctx.activeIndex === index ? 'opacity-100' : 'pointer-events-none opacity-0'
    //   }`}
    // >
    //   {children}
    // </div>
  )
}

// type HeroSlideControlsProps = {
//   total: number
// }

// function HeroSlideControls({ total }: HeroSlideControlsProps) {
//   const ctx = useContext(HeroSlideContext)
//   if (!ctx) throw new Error('HeroSlide.Controls deve ser usado dentro de <HeroSlide>')

//   return (
//     <div className="absolute right-0 bottom-4 left-0 flex justify-center gap-2">
//       {Array.from({ length: total }).map((_, i) => (
//         <button
//           key={i}
//           onClick={() => ctx.setActiveIndex(i)}
//           className={`h-3 w-3 rounded-full ${
//             ctx.activeIndex === i ? 'bg-blue-500' : 'bg-gray-400'
//           }`}
//         />
//       ))}
//     </div>
//   )
// }

HeroSlide.Item = HeroSlideItem
// HeroSlide.Controls = HeroSlideControls

export default HeroSlide
