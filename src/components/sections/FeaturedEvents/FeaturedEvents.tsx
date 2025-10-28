'use client'
import EventCard from '@/components/ui/EventCard/EventCard'
import Section from '@/components/ui/Section/Section'
import { GetAllEventsDocument } from '@/graphql/generated/graphql'
import { useQuery } from '@apollo/client/react'
import { Carousel } from '@mantine/carousel'
import { ActionIcon, Group } from '@mantine/core'
import { IconArrowLeft, IconArrowRight } from '@tabler/icons-react'
import { EmblaCarouselType } from 'embla-carousel'
import { useState } from 'react'

export default function FeaturedEvents() {
  const [embla, setEmbla] = useState<EmblaCarouselType | null>(null)
  const { data } = useQuery(GetAllEventsDocument, {
    variables: { first: 6 },
    fetchPolicy: 'cache-and-network',
  })
  if (!data) {
    return null
  }
  return (
    <Section
      title="EARA Events"
      subtitle="Events"
      containerSize="none"
      className="bg-earaGrayLight relative"
    >
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
        // slideGap={20}
      >
        {data.allEvents?.nodes.map((event) => {
          return (
            <Carousel.Slide key={event.id}>
              <EventCard
                category="Conference"
                link={event.uri || '#'}
                date="24 November 2025 - 09h"
                excerpt="Lorem ipsum dolor sit amet consectetur adipiscing elit. Quisque faucibus ex sapien vitae pellentesque sem placerat. In id cursus mi pretium tellus duis convallis."
                title={event.title || 'Untitled Event'}
                featuredImage={event.featuredImage?.node.guid || '/eara-fallback.jpg'}
              />
            </Carousel.Slide>
          )
        })}
      </Carousel>
    </Section>
  )
}
