import { NewsCardProps } from '@/lib/types'
import { Stack, Text, Title } from '@mantine/core'
import clsx from 'clsx'
import Image from 'next/image'
import Link from 'next/link'
import s from './NewsCard.module.css'

export default function NewsCard({
  featuredImage,
  title,
  timeReading,
  author,
  date,
  excerpt,
  link,
  orientation = 'vertical',
  isFeatured = false,
}: NewsCardProps) {
  const formatedDate = date
    ? new Date(date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : ''
  return (
    <>
      {orientation === 'horizontal' ? (
        <Link href={link || '#'}>
          <div
            className={clsx(
              'author flex h-full flex-col overflow-hidden rounded-2xl hover:shadow-xl',
              s.root,
              isFeatured ? 'bg-white' : 'bg-[#EAEAEA]'
            )}
          >
            <div className={s.imageWrapper}>
              {featuredImage && (
                <Image
                  src={featuredImage}
                  width={300}
                  height={600}
                  alt="Featured"
                  className={clsx(
                    'w-full object-cover',
                    isFeatured ? 'aspect-[4/2]' : 'aspect-[4/1.5]'
                  )}
                />
              )}
            </div>
            <div
              className={clsx(
                'z-10 -mt-10 flex flex-col justify-center rounded-2xl p-7',
                isFeatured ? 'bg-white' : 'bg-[#EAEAEA]'
              )}
            >
              <Stack gap={5}>
                <Text className="opacity-50">{formatedDate}</Text>
                <Title order={6}>{title}</Title>
                <Text className="uppercase" size="sm" c={'primaryColor.9'}>
                  {author}
                </Text>
                <Text className="opacity-50">{timeReading} min read</Text>
              </Stack>
              {excerpt && isFeatured && (
                <Text className="" mt={30}>
                  {excerpt}
                </Text>
              )}
            </div>
          </div>
        </Link>
      ) : (
        <Link href={link || '#'}>
          <div
            className={clsx(
              'author flex h-full origin-left flex-col overflow-hidden rounded-2xl bg-white hover:shadow-xl md:flex-row',
              s.root
            )}
          >
            <div className={clsx('w-full md:w-auto', s.imageWrapper)}>
              {featuredImage && (
                <Image
                  src={featuredImage}
                  width={400}
                  height={600}
                  alt="Featured"
                  className={clsx(
                    'aspect-[4/3] w-full object-cover object-left md:h-full md:w-[210px] lg:w-[400px]'
                  )}
                />
              )}
            </div>
            <div className="z-10 -mt-5 flex w-full max-w-none flex-col justify-center rounded-2xl bg-white p-7 md:-mt-0 md:-ml-10 md:max-w-[500px]">
              <Stack gap={3}>
                <Text className="opacity-50">{formatedDate}</Text>
                <Title order={6}>{title}</Title>
                <Text className="uppercase opacity-50" size="sm" c={'primaryColor.9'}>
                  {author}
                </Text>
                <Text className="opacity-50">{timeReading} min read</Text>
              </Stack>
              {excerpt && (
                <Text className="" mt={8}>
                  {excerpt}
                </Text>
              )}
            </div>
          </div>
        </Link>
      )}
    </>
  )
}
