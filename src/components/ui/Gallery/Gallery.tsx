'use client'
import { GalleryProps } from '@/lib/types'
import { MouseEvent, useState } from 'react'

import { extractYouTubeID } from '@/lib/utils'
import { Carousel } from '@mantine/carousel'
import { Chip, Combobox, Group, List, Modal, useCombobox } from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import {
  IconCalendar,
  IconChevronDown,
  IconClipboardSearch,
  IconCreativeCommons,
  IconFileDescription,
  IconPaw,
  IconPlayerPlayFilled,
  IconZoomIn,
} from '@tabler/icons-react'
import clsx from 'clsx'
import Image from 'next/image'
import { useSearchParams } from 'next/navigation'
import Masonry, { ResponsiveMasonry } from 'react-responsive-masonry'
import ButtonEara from '../ButtonEara/ButtonEara'
import s from './Gallery.module.css'
export default function Gallery({ data, loadingMore }: GalleryProps) {
  const searchParams = useSearchParams()
  const media = searchParams.get('media')

  const getIndexFromSlug = (slug: string | null) => data.findIndex((item) => item.slug === slug)

  const [index, setIndex] = useState(getIndexFromSlug(media) >= 0 ? getIndexFromSlug(media) : 0)
  const [opened, { open, close }] = useDisclosure(getIndexFromSlug(media) >= 0 ? true : false)
  const handleClick = (ev: MouseEvent<HTMLDivElement>) => {
    console.log('clicked', ev.currentTarget.dataset.index)
    setIndex(Number(ev.currentTarget.dataset.index))
    open()
  }

  const combobox = useCombobox({
    onDropdownClose: () => combobox.resetSelectedOption(),
  })
  const organizerCombobox = useCombobox({
    onDropdownClose: () => organizerCombobox.resetSelectedOption(),
  })

  return (
    <>
      <div className="mb-10">
        <Group gap={5}>
          <Chip defaultChecked variant="light" size="md">
            All Species
          </Chip>
          <Chip variant="light" size="md">
            Rat
          </Chip>
          <Chip variant="light" size="md">
            Mouse
          </Chip>
          <Chip variant="light" size="md">
            Pig
          </Chip>
          <Chip variant="light" size="md">
            Rhesus macaque
          </Chip>
          <Combobox store={combobox}>
            <Combobox.Target>
              <ButtonEara
                size="sm"
                rightSection={<IconChevronDown size={16} />}
                onClick={() => combobox.toggleDropdown()}
                label="Location"
              />
            </Combobox.Target>
            <Combobox.Dropdown>
              <Combobox.Options>
                <Combobox.Option value="all">All Locations</Combobox.Option>
                <Combobox.Option value="openesse">Portugal</Combobox.Option>
                <Combobox.Option value="conference">Germany</Combobox.Option>
                <Combobox.Option value="workshop">Spain</Combobox.Option>
                <Combobox.Option value="workshop">Brazil</Combobox.Option>
              </Combobox.Options>
            </Combobox.Dropdown>
          </Combobox>
        </Group>
      </div>
      {data?.length === 0 && <p>No media available.</p>}

      <ResponsiveMasonry columnsCountBreakPoints={{ 350: 1, 750: 2, 900: 3, 1200: 4 }}>
        <Masonry gutter="1rem">
          {data.map((item, idx) => (
            <div key={idx}>
              {item.mediaType?.includes('video') && item.videoUrl && (
                <VideoItem
                  key={idx}
                  idx={idx}
                  onClick={handleClick}
                  videoURL={extractYouTubeID(item.videoUrl) || undefined}
                />
              )}
              {item.mediaType?.includes('image') && (
                <div
                  onClick={handleClick}
                  data-index={idx}
                  className={clsx(
                    'relative cursor-pointer overflow-hidden rounded-lg',
                    s.galleryItem
                  )}
                >
                  <Image
                    className="rounded-lg"
                    width={item.width}
                    height={item.height}
                    key={idx}
                    src={item.src}
                    alt={item.description || ''}
                  />
                  <div
                    className={clsx(
                      'absolute top-0 right-0 flex h-full w-full items-center justify-center bg-black/60 p-1 text-white',
                      s.overlay
                    )}
                  >
                    <IconZoomIn size={30} />
                  </div>
                </div>
              )}
            </div>
          ))}
        </Masonry>
      </ResponsiveMasonry>

      <Modal
        opened={opened}
        fullScreen
        onClose={close}
        styles={{
          body: { height: '100%', paddingTop: 'var(--mantine-spacing-md)' },
          header: { position: 'fixed', width: '100%', backgroundColor: 'transparent' },
        }}
      >
        <div className="h-full w-full">
          <div className="grid h-full grid-cols-6 grid-rows-5 gap-0">
            <div className="col-span-4 row-span-4 rounded-xl p-7">
              <div className="bg-earaBgLight relative h-full w-full overflow-hidden rounded-lg">
                {data[index]?.mediaType?.includes('video') && data[index]?.videoUrl && (
                  <iframe
                    className="h-full w-full"
                    src={`https://www.youtube.com/embed/${extractYouTubeID(
                      data[index].videoUrl
                    )}?rel=0&modestbranding=1`}
                    title="Eara Media Bank Video"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    referrerPolicy="strict-origin-when-cross-origin"
                    allowFullScreen
                  ></iframe>
                )}
                {data[index]?.mediaType?.includes('image') && (
                  <Image
                    // fill
                    style={{ objectFit: 'contain', overflow: 'hidden' }}
                    width={data[0].width}
                    height={data[0].height}
                    src={data[index].src}
                    alt={data[index].description || ''}
                    className="h-full w-full rounded-lg object-contain"
                  />
                )}
              </div>
            </div>
            <div className="col-span-2 col-start-5 row-span-4 p-7">
              <div className="bg-earaBgLight h-full overflow-y-auto rounded-lg p-8">
                <List spacing="md" size="md">
                  <List.Item icon={<IconPaw className="text-secondaryColor" />}>
                    <small className="uppercase">
                      Species featured or new approach methodology
                    </small>
                    <p className="font-bold">
                      {data[index].speciesFeaturedOrNewApproachMethodology || 'N/A'}
                    </p>
                  </List.Item>
                  <List.Item icon={<IconClipboardSearch className="text-secondaryColor" />}>
                    <small className="uppercase">Area of research</small>
                    <p className="font-bold">{data[index].researchArea || 'N/A'}</p>
                  </List.Item>
                  <List.Item icon={<IconFileDescription className="text-secondaryColor" />}>
                    <small className="uppercase">Description</small>
                    <p className="font-bold">{data[index].description}</p>
                  </List.Item>
                  <List.Item icon={<IconCreativeCommons className="text-secondaryColor" />}>
                    <small className="uppercase">Credit</small>
                    <p className="font-bold">{data[index].credits}</p>
                    <p className="font-bold">
                      {data[index].creditWebsite && (
                        <>
                          Website:{' '}
                          <a
                            href={data[index].creditWebsite}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="underline"
                          >
                            {data[index].creditWebsite}
                          </a>
                        </>
                      )}
                    </p>
                    <p className="font-bold">
                      {data[index].creditsMoreInfo && (
                        <>
                          More Information:{' '}
                          <a
                            href={data[index].creditsMoreInfo}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="underline"
                          >
                            {data[index].creditsMoreInfo}
                          </a>
                        </>
                      )}
                    </p>
                  </List.Item>
                  {data[index].uploadedDate && (
                    <List.Item icon={<IconCalendar className="text-secondaryColor" />}>
                      <small className="uppercase">Uploaded Date</small>
                      <p className="font-bold">
                        {new Date(data[index].uploadedDate).toLocaleDateString('en-US', {
                          dateStyle: 'long',
                        }) || 'N/A'}
                      </p>
                    </List.Item>
                  )}
                </List>
              </div>
            </div>
            <div className="col-span-6 row-start-5 flex w-full items-center overflow-hidden px-5">
              <Carousel
                slideSize={100}
                emblaOptions={{ align: 'center' }}
                defaultValue={index}
                slideGap={5}
                w="100%"
              >
                {data.map((item, idx) => (
                  <Carousel.Slide
                    onClick={() => setIndex(idx)}
                    key={idx}
                    className={clsx(
                      'cursor-pointer opacity-60 saturate-0 hover:saturate-100',
                      index === idx ? 'opacity-100 saturate-100' : ''
                    )}
                  >
                    {item.mediaType?.includes('video') && item.videoUrl && (
                      <div className="relative aspect-square w-[90px] overflow-hidden rounded-lg object-cover">
                        <div className="absolute top-0 left-0 z-40 flex h-full w-full items-center justify-center bg-black/50">
                          <div className="bg-secondaryColor flex aspect-square w-10 items-center justify-center rounded-full">
                            <IconPlayerPlayFilled size={20} />
                          </div>
                        </div>
                      </div>
                    )}
                    {item.mediaType?.includes('image') && (
                      <Image
                        className={clsx(
                          'aspect-square rounded-lg object-cover',
                          index === idx ? '' : ''
                        )}
                        width={90}
                        height={90}
                        src={item.src}
                        alt={item.description || ''}
                      />
                    )}
                  </Carousel.Slide>
                ))}
              </Carousel>
            </div>
          </div>
        </div>
      </Modal>
    </>
  )
}

export function VideoItem({
  videoURL,
  onClick,
  idx,
}: {
  videoURL?: string
  onClick?: (ev: MouseEvent<HTMLDivElement>) => void
  idx?: number
}) {
  return (
    <div
      data-index={idx}
      className="relative aspect-video cursor-pointer overflow-hidden rounded-lg bg-gray-100"
      onClick={onClick}
    >
      <iframe
        className="h-full w-full"
        src={`https://www.youtube.com/embed/${videoURL}?rel=0&modestbranding=1`}
        title="Eara Media Bank Video"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        referrerPolicy="strict-origin-when-cross-origin"
        allowFullScreen
      ></iframe>
      <div className="absolute top-0 left-0 z-40 flex h-full w-full items-center justify-center bg-black/50">
        <div className="bg-secondaryColor flex aspect-square w-20 items-center justify-center rounded-full">
          <IconPlayerPlayFilled size={30} />
        </div>
      </div>
    </div>
  )
}
