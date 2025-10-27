'use client'
import { PageTitleBarProps } from '@/lib/types'
import { Container, Title } from '@mantine/core'
import clsx from 'clsx'
import Image from 'next/image'
export default function PageTitleBar({
  title,
  author,
  date,
  subtitle,
  featuredImage,
  readingTime,
}: PageTitleBarProps) {
  return (
    <div
      className={clsx(
        'relative flex min-h-[300px] flex-col justify-center pt-[80px] text-white sm:min-h-[450px]',
        featuredImage ? 'bg-black' : 'bg-primaryColor'
      )}
    >
      <div className="z-10 w-full items-start gap-20 sm:flex">
        {subtitle ? (
          <>
            <div className="w-fit border-b border-b-gray-400 py-2 pl-20 sm:pl-40">
              <small className="uppercase">{subtitle}</small>
            </div>
            <div className="sm:px-unset mt-5 max-w-2xl grow px-[16px] sm:mt-0">
              <Title order={2} className="">
                {title}
              </Title>
            </div>
          </>
        ) : (
          <>
            <Container size="xl" className="w-full">
              <Title order={2} className="">
                {title}
              </Title>
            </Container>
          </>
        )}
      </div>
      {featuredImage && (
        <Image
          src={featuredImage}
          alt={title || ''}
          layout="fill"
          objectFit="cover"
          className="z-0 h-full object-center opacity-70"
        />
      )}
    </div>
  )
}
