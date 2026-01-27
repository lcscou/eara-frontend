'use client'

import { MouseEvent, useCallback, useEffect, useMemo, useState } from 'react'

import { extractYouTubeID, getMediaType } from '@/lib/utils'
import { Carousel } from '@mantine/carousel'
import { Combobox, Container, Group, List, Loader, Modal, useCombobox } from '@mantine/core'
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
// import { useSearchParams } from 'next/navigation'
import Masonry, { ResponsiveMasonry } from 'react-responsive-masonry'

import ResultNotFound from '@/components/ui/ResultNotFound/ResultNotFound'
import { useSuspenseQuery } from '@apollo/client/react'
import s from './ArchiveMediaBank.module.css'

const PAGE_SIZE = 12

import ButtonEara from '@/components/ui/ButtonEara/ButtonEara'
import { GetMediasBankDocument, GetMediasBankQuery } from '@/graphql/generated/graphql'
export default function ArchiveMediaBank() {
  const [loadingMore, setLoadingMore] = useState(false)

  // const searchParams = useSearchParams()
  // const media = searchParams.get('media')
  const media = null
  const [selectedAnimal, setSelectedAnimal] = useState<string | null>(null)
  const { data: d, fetchMore } = useSuspenseQuery(GetMediasBankDocument, {
    variables: {
      first: PAGE_SIZE,
      speciesFeatured: selectedAnimal || undefined,
    },
  })

  const animalCombobox = useCombobox({
    onDropdownClose: () => animalCombobox.resetSelectedOption(),
  })

  useEffect(() => {
    fetchMore({
      variables: {
        first: PAGE_SIZE,
        after: null,
        speciesFeatured: selectedAnimal || undefined,
      },
      updateQuery: (_, { fetchMoreResult }) => {
        return fetchMoreResult || _
      },
    })
  }, [selectedAnimal, fetchMore])

  const hasNextPage = d?.mediasBank?.pageInfo.hasNextPage
  const endCursor = d?.mediasBank?.pageInfo?.endCursor

  const handleLoadMore = useCallback(() => {
    if (!hasNextPage || loadingMore) return
    setLoadingMore(true)
    setTimeout(async () => {
      try {
        await fetchMore({
          variables: {
            first: PAGE_SIZE,
            after: endCursor,
            speciesFeatured: selectedAnimal || undefined,
          },
          updateQuery: (
            prev: GetMediasBankQuery,
            { fetchMoreResult }: { fetchMoreResult?: GetMediasBankQuery }
          ) => {
            if (!fetchMoreResult?.mediasBank?.nodes) return prev
            return {
              ...prev,
              mediasBank: {
                ...fetchMoreResult.mediasBank,
                pageInfo: fetchMoreResult.mediasBank.pageInfo,
                nodes: [
                  ...(prev?.mediasBank?.nodes ?? []),
                  ...(fetchMoreResult.mediasBank.nodes ?? []),
                ],
              },
            }
          },
        })
      } finally {
        setLoadingMore(false)
      }
    }, 0)
  }, [hasNextPage, loadingMore, endCursor, fetchMore, selectedAnimal])

  const filteredeMediaBank = useMemo(() => {
    const nodes = d?.mediasBank?.nodes ?? []
    return getMediaType(nodes)
  }, [d])

  const getIndexFromSlug = (slug: string | null) =>
    filteredeMediaBank.findIndex((item) => item.slug === slug)

  const [index, setIndex] = useState(getIndexFromSlug(media) >= 0 ? getIndexFromSlug(media) : 0)
  const [opened, { open, close }] = useDisclosure(getIndexFromSlug(media) >= 0 ? true : false)
  const handleClick = (ev: MouseEvent<HTMLDivElement>) => {
    console.log('clicked', ev.currentTarget.dataset.index)
    setIndex(Number(ev.currentTarget.dataset.index))
    open()
  }

  return (
    <>
      <Container size="xl" my={50}>
        <Group gap={5} mb={50}>
          <Combobox
            onOptionSubmit={(value) => {
              setSelectedAnimal(value === 'all' ? null : value)
              animalCombobox.closeDropdown()
            }}
            store={animalCombobox}
            width="fit-content"
            position="bottom-start"
          >
            <Combobox.Target>
              <ButtonEara
                size="md"
                onClick={() => animalCombobox.toggleDropdown()}
                rightSection={<IconChevronDown size={14} />}
              >
                {selectedAnimal || 'Animal'}
              </ButtonEara>
            </Combobox.Target>
            <Combobox.Dropdown>
              <Combobox.Options>
                <Combobox.Option value="all">All Animals</Combobox.Option>
                <Combobox.Option value="Rat">Rat</Combobox.Option>
                <Combobox.Option value="Mouse">Mouse</Combobox.Option>
                <Combobox.Option value="Rhesus macaque">Rhesus macaque</Combobox.Option>
                <Combobox.Option value="Cat">Cat</Combobox.Option>
                <Combobox.Option value="Non-human primate biobank">
                  Non-human primate biobank
                </Combobox.Option>
                <Combobox.Option value="Pig">Pig</Combobox.Option>
                <Combobox.Option value="Zebrafish">Zebrafish</Combobox.Option>
                <Combobox.Option value="Mice">Mice</Combobox.Option>
                <Combobox.Option value="Sheep">Sheep</Combobox.Option>
                <Combobox.Option value="Dog">Dog</Combobox.Option>
                <Combobox.Option value="Dog; Biobank">Dog; Biobank</Combobox.Option>
              </Combobox.Options>
            </Combobox.Dropdown>
          </Combobox>
        </Group>

        {filteredeMediaBank?.length === 0 && <ResultNotFound />}

        <ResponsiveMasonry columnsCountBreakPoints={{ 350: 1, 750: 2, 900: 3, 1200: 4 }}>
          <Masonry gutter="1rem">
            {filteredeMediaBank.map((item, idx) => (
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
            <div className="grid h-full grid-cols-1 grid-rows-1 gap-0 lg:grid-cols-6 lg:grid-rows-5">
              <div className="col-span-1 row-span-1 p-4 lg:col-span-4 lg:row-span-4 lg:p-7">
                <div className="bg-earaBgLight relative h-full w-full overflow-hidden rounded-lg">
                  {filteredeMediaBank[index]?.mediaType?.includes('video') &&
                    filteredeMediaBank[index]?.videoUrl && (
                      <iframe
                        className="h-full w-full"
                        src={`https://www.youtube.com/embed/${extractYouTubeID(
                          filteredeMediaBank[index].videoUrl
                        )}?rel=0&modestbranding=1`}
                        title="Eara Media Bank Video"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        referrerPolicy="strict-origin-when-cross-origin"
                        allowFullScreen
                      ></iframe>
                    )}
                  {filteredeMediaBank[index]?.mediaType?.includes('image') && (
                    <Image
                      style={{ objectFit: 'contain', overflow: 'hidden' }}
                      width={filteredeMediaBank[0].width}
                      height={filteredeMediaBank[0].height}
                      src={filteredeMediaBank[index].src}
                      alt={filteredeMediaBank[index].description || ''}
                      className="h-full w-full rounded-lg object-contain"
                    />
                  )}
                </div>
              </div>
              <div className="col-span-1 row-span-1 p-4 lg:col-span-2 lg:col-start-5 lg:row-span-4 lg:p-7">
                <div className="bg-earaBgLight h-full max-h-[400px] overflow-y-auto rounded-lg p-4 lg:max-h-none lg:p-8">
                  <List spacing="md" size="md">
                    <List.Item icon={<IconPaw className="text-secondaryColor" />}>
                      <small className="uppercase">
                        Species featured or new approach methodology
                      </small>
                      <p className="font-bold">
                        {filteredeMediaBank[index]?.speciesFeaturedOrNewApproachMethodology ||
                          'N/A'}
                      </p>
                    </List.Item>
                    <List.Item icon={<IconClipboardSearch className="text-secondaryColor" />}>
                      <small className="uppercase">Area of research</small>
                      <p className="font-bold">
                        {filteredeMediaBank[index]?.researchArea || 'N/A'}
                      </p>
                    </List.Item>
                    <List.Item icon={<IconFileDescription className="text-secondaryColor" />}>
                      <small className="uppercase">Description</small>
                      <p className="font-bold">{filteredeMediaBank[index]?.description}</p>
                    </List.Item>
                    <List.Item icon={<IconCreativeCommons className="text-secondaryColor" />}>
                      <small className="uppercase">Credit</small>
                      <p className="font-bold">{filteredeMediaBank[index]?.credits}</p>
                      <p className="font-bold">
                        {filteredeMediaBank[index]?.creditWebsite && (
                          <>
                            Website:{' '}
                            <a
                              href={filteredeMediaBank[index].creditWebsite}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="underline"
                            >
                              {filteredeMediaBank[index]?.creditWebsite}
                            </a>
                          </>
                        )}
                      </p>
                      <p className="font-bold">
                        {filteredeMediaBank[index]?.creditsMoreInfo && (
                          <>
                            More Information:{' '}
                            <a
                              href={filteredeMediaBank[index]?.creditsMoreInfo}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="underline"
                            >
                              {filteredeMediaBank[index]?.creditsMoreInfo}
                            </a>
                          </>
                        )}
                      </p>
                    </List.Item>
                    {filteredeMediaBank[index]?.uploadedDate && (
                      <List.Item icon={<IconCalendar className="text-secondaryColor" />}>
                        <small className="uppercase">Uploaded Date</small>
                        <p className="font-bold">
                          {new Date(filteredeMediaBank[index].uploadedDate).toLocaleDateString(
                            'en-US',
                            {
                              dateStyle: 'long',
                            }
                          ) || 'N/A'}
                        </p>
                      </List.Item>
                    )}
                  </List>
                </div>
              </div>
              <div className="col-span-1 row-span-1 flex w-full items-center overflow-hidden p-2 lg:col-span-6 lg:row-start-5 lg:px-5">
                <Carousel
                  slideSize={100}
                  emblaOptions={{ align: 'center' }}
                  defaultValue={index}
                  slideGap={5}
                  w="100%"
                >
                  {filteredeMediaBank.map((item, idx) => (
                    <Carousel.Slide
                      onClick={() => setIndex(idx)}
                      key={idx}
                      className={clsx(
                        'cursor-pointer opacity-60 saturate-0 hover:saturate-100',
                        index === idx ? 'opacity-100 saturate-100' : ''
                      )}
                    >
                      {item.mediaType?.includes('video') && item.videoUrl && (
                        <div className="relative aspect-square w-[70px] overflow-hidden rounded-lg object-cover lg:w-[70px]">
                          <div className="absolute top-0 left-0 z-40 flex h-full w-full items-center justify-center bg-black/50">
                            <div className="bg-secondaryColor flex aspect-square w-8 items-center justify-center rounded-full lg:w-10">
                              <IconPlayerPlayFilled size={20} className="lg:size-5" />
                            </div>
                          </div>
                        </div>
                      )}
                      {item.mediaType?.includes('image') && (
                        <Image
                          className="aspect-square rounded-lg object-cover"
                          width={70}
                          height={70}
                          src={item.src}
                          alt={item.description || ''}
                        />
                      )}
                    </Carousel.Slide>
                  ))}

                  {hasNextPage && (
                    <Carousel.Slide
                      key="load-more-sentinel"
                      className="opacity-100"
                      onMouseEnter={() => handleLoadMore()}
                      onPointerEnter={() => handleLoadMore()}
                      onFocus={() => handleLoadMore()}
                      onClick={() => handleLoadMore()}
                    >
                      <div className="bg-earaBgLight flex aspect-square w-[70px] items-center justify-center rounded-lg lg:w-[70px]">
                        <Loader size="sm" />
                      </div>
                    </Carousel.Slide>
                  )}
                </Carousel>
              </div>
            </div>
          </div>
        </Modal>

        {hasNextPage && (
          <Group justify="center" mt={40}>
            <ButtonEara
              label={loadingMore ? 'Loading...' : 'Load More'}
              size="lg"
              variant="filled"
              onClick={handleLoadMore}
              disabled={loadingMore}
              leftSection={loadingMore ? <Loader size="sm" color="white" /> : null}
            />
          </Group>
        )}
      </Container>
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
