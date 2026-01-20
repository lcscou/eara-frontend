'use client'
import EventCard from '@/components/ui/EventCard/EventCard'
import Section from '@/components/ui/Section/Section'
import { GetAllEventsDocument } from '@/graphql/generated/graphql'
import { truncateText } from '@/lib/utils'
import { useQuery } from '@apollo/client/react'
import { Carousel } from '@mantine/carousel'
import { ActionIcon, Group } from '@mantine/core'
import { IconArrowLeft, IconArrowRight } from '@tabler/icons-react'
import { EmblaCarouselType } from 'embla-carousel'
import { useMemo, useState } from 'react'

export default function FeaturedEvents({
  withSectionWrapper = true,
}: {
  withSectionWrapper?: boolean
}) {
  const [embla, setEmbla] = useState<EmblaCarouselType | null>(null)
  const { data } = useQuery(GetAllEventsDocument, {
    variables: { first: 6 },
    fetchPolicy: 'cache-and-network',
  })

  // Filter to show only upcoming events
  const upcomingEvents = useMemo(() => {
    if (!data?.allEvents?.nodes) return []
    const now = new Date()
    return data.allEvents.nodes.filter((event) => {
      const startDate = event?.customFields?.startDate
      return startDate && new Date(startDate) >= now
    })
  }, [data])

  if (!data) {
    return null
  }

  // If no upcoming events, show message
  if (upcomingEvents.length === 0) {
    const emptyContent = (
      <div className="py-20 text-center">
        <p className="text-lg text-gray-600">No events scheduled at the moment.</p>
      </div>
    )

    if (!withSectionWrapper) {
      return emptyContent
    }

    return (
      <Section
        title="EARA Events"
        subtitle="Events"
        containerSize="none"
        className="bg-earaGrayLight relative"
      >
        {emptyContent}
      </Section>
    )
  }

  const content = (
    <>
      <Group className="absolute top-40 right-20 sm:top-25">
        <ActionIcon variant="light" radius={80} aria-label="Settings">
          <IconArrowLeft onClick={() => embla?.scrollPrev()} />
        </ActionIcon>
        <Group gap={5}>
          {Array.from({ length: embla?.slideNodes().length || 3 }, (_, i) => i).map((_, j) => (
            <span key={j} className="aspect-square w-3 rounded-full bg-[#d6d6ec]"></span>
          ))}
        </Group>
        <ActionIcon variant="light" radius={80} aria-label="Settings">
          <IconArrowRight onClick={() => embla?.scrollNext()} />
        </ActionIcon>
      </Group>
      <Carousel
        slideSize="37%"
        getEmblaApi={setEmbla}
        slideGap={10}
        withControls={false}
        withIndicators={false}
        emblaOptions={{
          loop: true,
          dragFree: false,
          align: 'center',
        }}
      >
        {upcomingEvents.map((event) => {
          return (
            <Carousel.Slide key={event.id}>
              <EventCard
                category={event?.customFields?.category || 'General'}
                link={event.uri || '#'}
                date={event.customFields?.startDate || undefined}
                location={event.customFields?.location || undefined}
                excerpt={truncateText(event?.customFields?.description || '', 15)}
                title={event.title || 'Untitled Event'}
                featuredImage={event.featuredImage?.node.guid || '/eara-fallback.jpg'}
              />
            </Carousel.Slide>
          )
        })}
      </Carousel>
    </>
  )

  if (!withSectionWrapper) {
    return content
  }

  return (
    <Section
      title="EARA Events"
      subtitle="Events"
      containerSize="none"
      className="bg-earaGrayLight relative"
    >
      {content}
    </Section>
  )
}
