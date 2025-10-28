import { EventCardProps } from '@/lib/types'
import { Title } from '@mantine/core'
import clsx from 'clsx'
import Image from 'next/image'
import Link from 'next/link'
import ButtonEara from '../ButtonEara/ButtonEara'
import s from './EventCard.module.css'

export default function EventCard({
  title,
  date,
  link,
  excerpt,
  category,
  featuredImage,
  orientation = 'horizontal',
}: EventCardProps) {
  return (
    <>
      {orientation === 'horizontal' && (
        <Link href={link || '#'}>
          <div
            className={clsx(
              'my-5 flex w-fit flex-col overflow-hidden rounded-2xl bg-white hover:shadow-lg sm:flex-row',
              s.root
            )}
          >
            <div className={clsx('relative', s.imageWrapper)}>
              {featuredImage && (
                <Image
                  src={featuredImage}
                  width={300}
                  height={300}
                  className="aspect-[4/3] h-full object-cover transition duration-300 hover:scale-105"
                  alt="Event"
                />
              )}

              <span className="bg-primaryColor absolute top-5 left-5 z-10 rounded-full px-3 py-2 text-xs tracking-wider text-white uppercase">
                {category}
              </span>
            </div>
            <div className="z-10 -ml-5 w-[350px] rounded-2xl bg-white p-10">
              <div>
                <Title order={6} mb={5}>
                  {title}
                </Title>
                <span className="text-primaryColor text-sm font-medium uppercase">
                  {date &&
                    !isNaN(new Date(date).getTime()) &&
                    new Date(date).toLocaleDateString('en-US', { dateStyle: 'medium' })}
                </span>
              </div>

              <p className="mt-5">{excerpt}</p>
            </div>
          </div>
        </Link>
      )}
      {orientation === 'vertical' && (
        <Link href={link || '#'}>
          <div
            className={clsx(
              'my-5 h-full w-full overflow-hidden rounded-2xl bg-white hover:shadow-lg sm:flex-row',
              s.root
            )}
          >
            <div className={clsx('relative overflow-hidden', s.imageWrapper)}>
              <Image
                src={featuredImage || '/eara-fallback.jpg'}
                width={300}
                height={300}
                className="flex aspect-[4/2.3] w-full object-cover transition duration-300 hover:scale-105"
                alt="Event"
              />

              <span className="bg-primaryColor absolute top-5 left-5 z-10 rounded-full px-3 py-2 text-xs tracking-wider text-white uppercase">
                {category}
              </span>
            </div>
            <div className="relative z-40 -mt-10 w-full rounded-2xl bg-white p-10">
              <div>
                <Title order={6} mb={5}>
                  {title}
                </Title>
                <span className="text-primaryColor text-sm font-medium uppercase">
                  {date &&
                    !isNaN(new Date(date).getTime()) &&
                    new Date(date).toLocaleDateString('en-US', { dateStyle: 'medium' })}
                </span>
              </div>

              <p className="my-5">{excerpt}</p>
              <ButtonEara label="Know More" className="pointer-events-none" variant="link" />
            </div>
          </div>
        </Link>
      )}
    </>
  )
}
