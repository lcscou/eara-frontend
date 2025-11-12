'use client'
import ButtonEara from '@/components/ui/ButtonEara/ButtonEara'
import EventCard from '@/components/ui/EventCard/EventCard'
import { GetAllEventsDocument, GetAllEventsQuery } from '@/graphql/generated/graphql'

import { truncateText } from '@/lib/utils'
import { useSuspenseQuery } from '@apollo/client/react'
import {
  Button,
  Chip,
  Combobox,
  Container,
  Group,
  Loader,
  Skeleton,
  Title,
  useCombobox,
} from '@mantine/core'
import { IconChevronDown, IconRestore, IconZoomCancel } from '@tabler/icons-react'
import { useCallback, useMemo, useState } from 'react'

const PAGE_SIZE = 12

export default function ArchiveEventsTemplate() {
  const [loadingMore, setLoadingMore] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null)

  const { data, fetchMore } = useSuspenseQuery<GetAllEventsQuery>(GetAllEventsDocument, {
    variables: { first: PAGE_SIZE },
  })

  const hasNextPage = data?.allEvents?.pageInfo?.hasNextPage
  const endCursor = data?.allEvents?.pageInfo?.endCursor

  // Filter events based on category and location
  const filteredEvents = useMemo(() => {
    let filtered = data?.allEvents?.nodes ?? []

    if (selectedCategory) {
      filtered = filtered.filter((event) => event?.customFields?.category === selectedCategory)
    }

    if (selectedLocation) {
      filtered = filtered.filter((event) => event?.customFields?.location === selectedLocation)
    }

    return filtered
  }, [data?.allEvents?.nodes, selectedCategory, selectedLocation])

  const handleLoadMore = useCallback(() => {
    if (!hasNextPage || loadingMore) return
    setLoadingMore(true)
    setTimeout(async () => {
      try {
        await fetchMore({
          variables: { first: PAGE_SIZE, before: endCursor },
          updateQuery: (
            prev: GetAllEventsQuery,
            { fetchMoreResult }: { fetchMoreResult?: GetAllEventsQuery }
          ) => {
            if (!fetchMoreResult?.allEvents?.nodes) return prev
            return {
              ...prev,
              allEvents: {
                ...fetchMoreResult.allEvents,
                pageInfo: fetchMoreResult.allEvents.pageInfo,
                nodes: [
                  ...(prev?.allEvents?.nodes ?? []),
                  ...(fetchMoreResult.allEvents.nodes ?? []),
                ],
              },
            }
          },
        })
      } finally {
        setLoadingMore(false)
      }
    }, 0)
  }, [hasNextPage, loadingMore, endCursor, fetchMore])

  const locationCombobox = useCombobox({
    onDropdownClose: () => locationCombobox.resetSelectedOption(),
  })

  const handleResetFilters = () => {
    setSelectedCategory(null)
    setSelectedLocation(null)
    locationCombobox.resetSelectedOption()
  }

  const hasActiveFilters = selectedCategory !== null || selectedLocation !== null

  return (
    <>
      <Container size="xl" className="py-20">
        <div className="flex justify-between">
          <Group gap={5}>
            <Chip
              checked={selectedCategory === null}
              onChange={() => setSelectedCategory(null)}
              variant="light"
              size="md"
            >
              All Events
            </Chip>
            <Chip
              checked={selectedCategory === 'Conference'}
              onChange={() => setSelectedCategory('Conference')}
              variant="light"
              size="md"
            >
              Conference
            </Chip>
            <Chip
              checked={selectedCategory === 'Media Training'}
              onChange={() => setSelectedCategory('Media Training')}
              variant="light"
              size="md"
            >
              Media Training
            </Chip>
            <Combobox
              store={locationCombobox}
              onOptionSubmit={(value) => {
                setSelectedLocation(value === 'all' ? null : value)
                locationCombobox.closeDropdown()
              }}
            >
              <Combobox.Target>
                <ButtonEara
                  size="sm"
                  rightSection={<IconChevronDown size={16} />}
                  onClick={() => locationCombobox.toggleDropdown()}
                  label={selectedLocation || 'Location'}
                />
              </Combobox.Target>
              <Combobox.Dropdown>
                <Combobox.Options>
                  <Combobox.Option value="all">All Locations</Combobox.Option>
                  <Combobox.Option value="Lisbon">Lisbon</Combobox.Option>
                  <Combobox.Option value="Berlin, Germany">Berlin, Germany</Combobox.Option>
                </Combobox.Options>
              </Combobox.Dropdown>
            </Combobox>
            {hasActiveFilters && (
              <Button
                size="sm"
                variant="subtle"
                leftSection={<IconRestore size={16} />}
                onClick={handleResetFilters}
              >
                Reset
              </Button>
            )}
          </Group>
        </div>

        {filteredEvents.length > 0 ? (
          <div className="mt-10 grid gap-5 sm:grid-cols-3">
            {filteredEvents.map((event) => (
              <EventCard
                key={event?.id}
                id={event?.uri || ''}
                orientation="vertical"
                link={event?.uri || ''}
                excerpt={truncateText(event?.customFields?.description || '', 15)}
                title={event?.title || ''}
                date={event?.customFields?.startDate || ''}
                category={event?.customFields?.category || 'General'}
                featuredImage={event?.featuredImage?.node?.guid || ''}
              />
            ))}
          </div>
        ) : (
          <>
            <div className="flex flex-col items-center justify-center gap-10 py-10">
              <IconZoomCancel size={150} stroke={1.1} className="mt-10 text-[#d6d6ec]" />
              <div className="flex flex-col items-center gap-4">
                <Title order={5} className="mt-10">
                  No result found.
                </Title>
                <p>We can&apos;t find any item matching your criteria.</p>
                <Button
                  className="mt-4"
                  variant="light"
                  leftSection={<IconRestore size={18} />}
                  onClick={handleResetFilters}
                >
                  Reset Filters
                </Button>
              </div>
            </div>
          </>
        )}
      </Container>

      {loadingMore && (
        <div className="mt-10 grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {Array.from({ length: PAGE_SIZE }).map((_, i) => (
            <div key={i} className="flex flex-col gap-2">
              <Skeleton height={200} radius="md" />
              <Skeleton height={20} width="70%" radius="sm" />
              <Skeleton height={16} width="50%" radius="sm" />
            </div>
          ))}
        </div>
      )}

      {hasNextPage && !hasActiveFilters && (
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
    </>
  )
}
