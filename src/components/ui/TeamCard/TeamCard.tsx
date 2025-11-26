import { TeamCardProps } from '@/lib/types'
import { Title } from '@mantine/core'
import Image from 'next/image'
import Link from 'next/link'
import styles from './TeamCard.module.css'

export default function TeamCard({
  title,
  featuredImage,
  description,
  uri,
  country,
}: TeamCardProps) {
  const alt = title ? `${title} photo` : 'Animal photo'

  const CardContent = (
    <div className="flex cursor-pointer flex-col items-center justify-center gap-10 rounded-lg bg-white/20 p-4 px-6 py-12 transition-colors hover:bg-white/60">
      <Image
        className="border-secondaryColor aspect-square rounded-full border-4 object-cover"
        src={featuredImage || '/eara-fallback.jpg'}
        alt={alt}
        width={180}
        height={180}
        sizes="(max-width: 640px) 120px, (max-width: 1024px) 160px, 180px"
        loading="lazy"
        decoding="async"
      />
      <div className="text-center">
        <Title order={5} c="primaryColor.9" mb={15}>
          {title ?? 'Untitled'}
        </Title>
      </div>
    </div>
  )

  if (uri) {
    return (
      <Link href={uri} className={styles.cardLink} aria-label={title ? `Open ${title}` : 'Open'}>
        {CardContent}
      </Link>
    )
  }

  return CardContent
}
