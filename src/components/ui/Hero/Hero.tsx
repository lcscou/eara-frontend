import { url } from 'inspector';
import styles from './Hero.module.css'
import { HeroProps } from '@/lib/types'

export default function Hero({ content, bgImageSrc }: HeroProps) {
  return <div style={{backgroundImage: `url(${bgImageSrc})`}} className='h-lvh bg-cover bg-primaryColor flex justify-center items-center text-white'>
    {content}
  </div>;
}
