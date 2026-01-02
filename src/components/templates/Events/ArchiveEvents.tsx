'use client'
import ButtonEara from '@/components/ui/ButtonEara/ButtonEara'
import EventCard from '@/components/ui/EventCard/EventCard'
import ResultNotFound from '@/components/ui/ResultNotFound/ResultNotFound'
import { GetAllEventsDocument, GetAllEventsQuery } from '@/graphql/generated/graphql'

import { truncateText } from '@/lib/utils'
import { useSuspenseQuery } from '@apollo/client/react'
import { Button, Combobox, Container, Group, Loader, Skeleton, useCombobox } from '@mantine/core'
import { IconCheck, IconChevronDown, IconRestore } from '@tabler/icons-react'
import { useCallback, useMemo, useState } from 'react'

const PAGE_SIZE = 12

export default function ArchiveEventsTemplate() {
  const [loadingMore, setLoadingMore] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null)
  const [selectedLocationType, setSelectedLocationType] = useState<string | null>(null)

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

    if (selectedCountry) {
      filtered = filtered.filter((event) => event?.customFields?.country?.includes(selectedCountry))
    }

    if (selectedLocationType) {
      filtered = filtered.filter(
        (event) => event?.customFields?.locationType === selectedLocationType
      )
    }

    return filtered
  }, [data?.allEvents?.nodes, selectedCategory, selectedCountry, selectedLocationType])

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

  const locationTypeCombobox = useCombobox({
    onDropdownClose: () => locationTypeCombobox.resetSelectedOption(),
  })

  const handleResetFilters = () => {
    setSelectedCategory(null)
    setSelectedCountry(null)
    setSelectedLocationType(null)
    locationCombobox.resetSelectedOption()
    locationTypeCombobox.resetSelectedOption()
  }

  const hasActiveFilters =
    selectedCategory !== null || selectedCountry !== null || selectedLocationType !== null

  return (
    <>
      <Container size="xl" py={50}>
        <div className="flex justify-between">
          <Group gap={5}>
            <Button
              size="md"
              leftSection={!selectedCategory ? <IconCheck size={18} /> : null}
              fw={500}
              tt="uppercase"
              fz={13}
              onClick={() => setSelectedCategory((prev) => (prev === null ? 'all' : null))}
              variant={!selectedCategory ? 'light' : 'outline'}
            >
              All Events
            </Button>
            <Button
              size="md"
              leftSection={selectedCategory === 'Conference' ? <IconCheck size={18} /> : null}
              fw={500}
              tt="uppercase"
              fz={13}
              onClick={() => setSelectedCategory('Conference')}
              variant={selectedCategory === 'Conference' ? 'light' : 'outline'}
            >
              Conference
            </Button>
            <Button
              size="md"
              leftSection={selectedCategory === 'Media Training' ? <IconCheck size={18} /> : null}
              fw={500}
              tt="uppercase"
              fz={13}
              onClick={() => setSelectedCategory('Media Training')}
              variant={selectedCategory === 'Media Training' ? 'light' : 'outline'}
            >
              Media Training
            </Button>

            <Combobox
              store={locationCombobox}
              onOptionSubmit={(value) => {
                setSelectedCountry(value === 'all' ? null : value)
                locationCombobox.closeDropdown()
              }}
            >
              <Combobox.Target>
                <ButtonEara
                  size="md"
                  rightSection={<IconChevronDown size={16} />}
                  onClick={() => locationCombobox.toggleDropdown()}
                  label={selectedCountry || 'Location'}
                />
              </Combobox.Target>
              <Combobox.Dropdown>
                <Combobox.Options>
                  <Combobox.Option value="all">All Country</Combobox.Option>
                  <Combobox.Option value="portugal">Portugal</Combobox.Option>
                  <Combobox.Option value="germany">Germany</Combobox.Option>
                </Combobox.Options>
              </Combobox.Dropdown>
            </Combobox>

            <Combobox
              store={locationTypeCombobox}
              onOptionSubmit={(value) => {
                setSelectedLocationType(value === 'all' ? null : value)
                locationTypeCombobox.closeDropdown()
              }}
            >
              <Combobox.Target>
                <ButtonEara
                  size="md"
                  rightSection={<IconChevronDown size={16} />}
                  onClick={() => locationTypeCombobox.toggleDropdown()}
                  label={
                    selectedLocationType === 'in-site'
                      ? 'In-site'
                      : selectedLocationType === 'online'
                        ? 'Online'
                        : 'All Location Type'
                  }
                />
              </Combobox.Target>
              <Combobox.Dropdown>
                <Combobox.Options>
                  <Combobox.Option value="all">All Location Type</Combobox.Option>
                  <Combobox.Option value="in-site">In-site</Combobox.Option>
                  <Combobox.Option value="online">Online</Combobox.Option>
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
            <ResultNotFound resetFilters={handleResetFilters} />
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
