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
  excerpt,
  link,
  orientation = 'vertical',
  isFeatured = false,
}: NewsCardProps) {
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
              'author flex h-full origin-left overflow-hidden rounded-2xl bg-white hover:shadow-xl',
              s.root
            )}
          >
            <div className={s.imageWrapper}>
              {featuredImage && (
                <Image
                  src={featuredImage}
                  width={400}
                  height={600}
                  alt="Featured"
                  className={clsx(
                    'aspect-[4/3] h-full w-[210px] object-cover object-left sm:w-[400px]'
                  )}
                />
              )}
            </div>
            <div className="z-10 -ml-10 flex max-w-[300px] flex-col justify-center rounded-2xl bg-white p-7 sm:max-w-[500px]">
              <Stack gap={3}>
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
