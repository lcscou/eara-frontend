import { CardProps } from '@/lib/types'
import { Text, Title } from '@mantine/core'
import clsx from 'clsx'
import Image from 'next/image'
import Link from 'next/link'

export default function Card({
  title,
  description,
  featuredImage,
  uri,
  variant = 'layout-1',
  ...props
}: CardProps) {
  const cardContent = (
    <>
      {variant === 'layout-1' && (
        <div
          {...props}
          className={clsx(
            'flex cursor-pointer flex-col items-center justify-center gap-10 rounded-lg bg-white/20 p-4 px-6 py-12 transition-colors hover:bg-white/60'
          )}
        >
          <div>
            {featuredImage && (
              <Image
                className="border-secondaryColor aspect-square rounded-full border-4 object-cover"
                src={featuredImage || '/eara-fallback.jpg'}
                alt={title ? `${title} Image` : 'Card Image'}
                width={180}
                height={180}
                sizes="(max-width: 640px) 120px, (max-width: 1024px) 160px, 180px"
                loading="lazy"
                decoding="async"
              />
            )}
          </div>
          <div className="text-center">
            <Title order={5} c="primaryColor.9" mb={15}>
              {title ?? 'Untitled'}
            </Title>
            {props.children && (
              <Text fz={16} opacity={0.6} mb={10}>
                {props.children}
              </Text>
            )}
          </div>
        </div>
      )}
      {variant === 'layout-2' && (
        <div {...props} className={clsx('rounded-2xl bg-white p-10')}>
          <Image src="/logo-eara.svg" width={220} height={200} alt="Logo" className="mb-10" />
          <Title order={6} mb={15}>
            {title}
          </Title>
          <Text> {props.children}</Text>
        </div>
      )}
    </>
  )
  if (uri) {
    return (
      <Link href={uri} aria-label={title ? `Open ${title}` : 'Open'}>
        {cardContent}
      </Link>
    )
  }
  return cardContent
}
