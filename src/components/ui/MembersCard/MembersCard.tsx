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
  countries,
  onCountryClick,
}: MembersCardProps) {
  const formatCountryLabel = (value: string) =>
    value
      .replace(/[-_]+/g, ' ')
      .replace(/\s+/g, ' ')
      .trim()
      .replace(/\b\w/g, (char) => char.toUpperCase())

  const normalizedCountries = (countries ?? [])
    .map((item) => item?.trim())
    .filter((item): item is string => Boolean(item))

  const countriesToRender =
    normalizedCountries.length > 0
      ? normalizedCountries
      : country
        ? country
            .split(',')
            .map((item) => item.trim())
            .filter(Boolean)
        : []

  return (
    <>
      <div className={clsx('overflow-hidden rounded-lg bg-[#DEE5D6]', s.root)}>
        <div className="flex aspect-[4/2.7] items-center justify-center rounded-lg bg-white p-4">
          <Image
            src={featuredImage || '/logo-eara.svg'}
            alt={title || 'Member Image'}
            width={180}
            height={180}
          />
        </div>
        <div className="flex flex-col gap-2 p-7">
          <Title order={5} fz={20}>
            {title}
          </Title>
          {countriesToRender.length > 0 && (
            <small className="text-[#312F86] uppercase">
              {countriesToRender.map((item, index) => {
                const isLast = index === countriesToRender.length - 1

                if (!onCountryClick) {
                  return (
                    <span key={item}>
                      {formatCountryLabel(item)}
                      {!isLast ? ', ' : ''}
                    </span>
                  )
                }

                return (
                  <span key={item}>
                    <button
                      type="button"
                      className="cursor-pointer underline decoration-transparent underline-offset-2 transition hover:decoration-current"
                      onClick={() => onCountryClick(item)}
                    >
                      {formatCountryLabel(item).toUpperCase()}
                    </button>
                    {!isLast ? ', ' : ''}
                  </span>
                )
              })}
            </small>
          )}
          {uri && (
            <ButtonEara tt="uppercase" variant="link" link={uri || '/'} target="_blank">
              Visit Website
            </ButtonEara>
          )}
        </div>
      </div>
    </>
  )
}
