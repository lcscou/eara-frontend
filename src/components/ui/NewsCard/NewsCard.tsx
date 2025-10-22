import { NewsCardProps } from '@/lib/types'
import { Stack, Text, Title } from '@mantine/core'
import clsx from 'clsx'
import Image from 'next/image'
import s from './NewsCard.module.css'

export default function NewsCard({
  featuredImage,
  title,
  timeReading,
  author,
  excerpt,
  isFeatured = false,
}: NewsCardProps) {
  return (
    <>
      <div
        className={clsx(
          'author flex h-full flex-col overflow-hidden rounded-2xl bg-white hover:shadow-xl',
          s.root
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
        <div className="z-10 -mt-10 flex flex-col justify-center rounded-2xl bg-white p-7">
          <Stack gap={5}>
            <Title order={6}>{title}</Title>
            <Text className="uppercase opacity-65">{author}</Text>
            <Text className="opacity-65">{timeReading}</Text>
          </Stack>
          {excerpt && isFeatured && (
            <Text className="opacity-65" mt={30}>
              {excerpt}
            </Text>
          )}
        </div>
      </div>
    </>
  )
}
