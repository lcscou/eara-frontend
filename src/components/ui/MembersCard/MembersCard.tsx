'use client'
import { MembersCardProps } from '@/lib/types'
import { Title } from '@mantine/core'
import clsx from 'clsx'
import Image from 'next/image'
import ButtonEara from '../ButtonEara/ButtonEara'
import s from './MembersCard.module.css'

export default function MembersCard({
  featuredImage,
  title,
  // description,
  uri,
  country,
}: MembersCardProps) {
  return (
    <>
      <div className={clsx('overflow-hidden rounded-lg bg-[#DEE5D6]', s.root)}>
        <div className="flex aspect-[4/2.7] items-center justify-center rounded-lg bg-white p-4">
          <Image
            src={featuredImage || '/eara-fallback.jpg'}
            alt={title || 'Member Image'}
            width={180}
            height={180}
          />
        </div>
        <div className="flex flex-col gap-2 p-7">
          <Title order={5} fz={20}>
            {title}
          </Title>
          <small className="text-[#312F86] uppercase">{country}</small>
          <ButtonEara tt="uppercase" variant="link" link={uri || '/'} target="_blank">
            Visit Website
          </ButtonEara>
        </div>
      </div>
    </>
  )
}
