'use client'
import { PageTitleBarProps } from '@/lib/types'
import { Container, Title } from '@mantine/core'
import clsx from 'clsx'
import Image from 'next/image'
import React, { memo, useMemo } from 'react'

type InfoRowProps = {
  label: string
  children: React.ReactNode
}

const InfoRow = memo(({ label, children }: InfoRowProps) => (
  <tr>
    <td className="pr-6 align-top">
      <small className="uppercase">{label}</small>
    </td>
    <td>
      <small className="font-bold">{children}</small>
    </td>
  </tr>
))
InfoRow.displayName = 'InfoRow'

function PageTitleBarComponent({
  title,
  subtitle,
  featuredImage,
  eventStartDate,
  eventEndDate,
  organizer,
  author,
  location,
}: PageTitleBarProps) {
  const dateText = useMemo(() => {
    if (!eventStartDate) return null
    const start = new Date(eventStartDate)
    const end = eventEndDate ? new Date(eventEndDate) : null
    const opts: Intl.DateTimeFormatOptions = { dateStyle: 'medium' }
    return end
      ? `${start.toLocaleString('en-US', opts)} - ${end.toLocaleString('en-US', opts)}`
      : start.toLocaleString('en-US', opts)
  }, [eventStartDate, eventEndDate])

  const containerClass = clsx(
    'relative flex min-h-[300px] flex-col justify-center pt-[80px] text-white sm:min-h-[450px]',
    featuredImage ? 'bg-black' : 'bg-primaryColor'
  )

  const EventinfoTable = (
    <table className="mt-5">
      <tbody>
        {dateText && <InfoRow label="Date/Time">{dateText}</InfoRow>}
        {organizer && <InfoRow label="Organizer">{organizer}</InfoRow>}
        {location && <InfoRow label="Location">{location}</InfoRow>}
      </tbody>
    </table>
  )

  const newsIngoTable = (
    <table className="mt-5">
      <tbody>{author && <InfoRow label="Author">{author}</InfoRow>}</tbody>
    </table>
  )

  return (
    <div className={containerClass}>
      <div className="z-10 w-full items-start gap-20 sm:flex">
        {subtitle ? (
          <>
            <div className="w-fit border-b border-b-gray-400 py-2 pl-20 sm:pl-40">
              <small className="uppercase">{subtitle}</small>
            </div>
            <div className="sm:px-unset mt-5 max-w-2xl grow px-[16px] sm:mt-0">
              <Title order={2}>{title}</Title>
              {EventinfoTable}
              {newsIngoTable}
            </div>
          </>
        ) : (
          <Container size="xl" className="w-full">
            <Title order={2} mb={10}>
              {title}
            </Title>
            {EventinfoTable}
            {newsIngoTable}
          </Container>
        )}
      </div>

      {featuredImage && (
        <Image
          src={featuredImage}
          alt={title ?? ''}
          fill
          style={{ objectFit: 'cover' }}
          className="z-0 h-full object-center opacity-70"
          priority={false}
        />
      )}
    </div>
  )
}

export default memo(PageTitleBarComponent)
