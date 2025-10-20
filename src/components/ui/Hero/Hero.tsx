// import styles from './Hero.module.css'
import { HeroProps } from '@/lib/types'
import { useMediaQuery } from '@mantine/hooks'

export default function Hero({ content, bgImageSrc, bgImageSrcMobile }: HeroProps) {
  const matches = useMediaQuery('(max-width: 600px)')
  return (
    <div
      style={{ backgroundImage: `url(${matches && bgImageSrcMobile ? bgImageSrcMobile : bgImageSrc })` }}
      className="bg-primaryColor flex min-h-svh items-center justify-center bg-cover text-white"
    >
      {content}
    </div>
  )
}
