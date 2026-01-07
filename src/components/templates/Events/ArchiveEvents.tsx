'use client'
import ButtonEara from '@/components/ui/ButtonEara/ButtonEara'
import EventCard from '@/components/ui/EventCard/EventCard'
import ResultNotFound from '@/components/ui/ResultNotFound/ResultNotFound'
import { GetAllEventsDocument, GetAllEventsQuery } from '@/graphql/generated/graphql'

import { truncateText } from '@/lib/utils'
import { useSuspenseQuery } from '@apollo/client/react'
import { Button, Combobox, Container, Group, Loader, Skeleton, useCombobox } from '@mantine/core'
import { IconCheck, IconChevronDown, IconRestore } from '@tabler/icons-react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Suspense, useCallback, useEffect, useMemo, useState } from 'react'

const PAGE_SIZE = 12

function ArchiveEventsContent() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [loadingMore, setLoadingMore] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null)
  const [selectedLocationType, setSelectedLocationType] = useState<string | null>(null)
  const [selectedStatus, setSelectedStatus] = useState<'all' | 'upcoming' | 'past'>('all')

  const { data, fetchMore } = useSuspenseQuery<GetAllEventsQuery>(GetAllEventsDocument, {
    variables: { first: PAGE_SIZE },
  })

  // Initialize filters from URL params
  useEffect(() => {
    const status = searchParams.get('status')
    const category = searchParams.get('category')
    const country = searchParams.get('country')
    const locationType = searchParams.get('locationType')

    if (status === 'upcoming' || status === 'past') {
      setSelectedStatus(status)
    }
    if (category) {
      setSelectedCategory(category)
    }
    if (country) {
      setSelectedCountry(country)
    }
    if (locationType) {
      setSelectedLocationType(locationType)
    }
  }, [searchParams])

  // Update URL when filters change
  const updateURL = useCallback(
    (filters: {
      status?: 'all' | 'upcoming' | 'past'
      category?: string | null
      country?: string | null
      locationType?: string | null
    }) => {
      const params = new URLSearchParams()

      const statusValue = filters.status ?? selectedStatus
      const categoryValue = filters.category !== undefined ? filters.category : selectedCategory
      const countryValue = filters.country !== undefined ? filters.country : selectedCountry
      const locationTypeValue =
        filters.locationType !== undefined ? filters.locationType : selectedLocationType

      if (statusValue && statusValue !== 'all') {
        params.set('status', statusValue)
      }
      if (categoryValue) {
        params.set('category', categoryValue)
      }
      if (countryValue) {
        params.set('country', countryValue)
      }
      if (locationTypeValue) {
        params.set('locationType', locationTypeValue)
      }

      const queryString = params.toString()
      router.push(queryString ? `?${queryString}` : window.location.pathname, { scroll: false })
    },
    [selectedStatus, selectedCategory, selectedCountry, selectedLocationType, router]
  )

  const hasNextPage = data?.allEvents?.pageInfo?.hasNextPage
  const endCursor = data?.allEvents?.pageInfo?.endCursor

  // Filter events based on category, location and date
  const filteredEvents = useMemo(() => {
    let filtered = data?.allEvents?.nodes ?? []
    const now = new Date()

    // Filter by status (upcoming/past)
    if (selectedStatus === 'upcoming') {
      filtered = filtered.filter((event) => {
        const startDate = event?.customFields?.startDate
        return startDate && new Date(startDate) >= now
      })
    } else if (selectedStatus === 'past') {
      filtered = filtered.filter((event) => {
        const startDate = event?.customFields?.startDate
        return startDate && new Date(startDate) < now
      })
    }

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
  }, [
    data?.allEvents?.nodes,
    selectedCategory,
    selectedCountry,
    selectedLocationType,
    selectedStatus,
  ])

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

  const statusCombobox = useCombobox({
    onDropdownClose: () => statusCombobox.resetSelectedOption(),
  })

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
    setSelectedStatus('all')
    statusCombobox.resetSelectedOption()
    locationCombobox.resetSelectedOption()
    locationTypeCombobox.resetSelectedOption()
    router.push(window.location.pathname, { scroll: false })
  }

  const hasActiveFilters =
    selectedCategory !== null ||
    selectedCountry !== null ||
    selectedLocationType !== null ||
    selectedStatus !== 'all'

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
              onClick={() => {
                const newCategory = selectedCategory === null ? 'all' : null
                setSelectedCategory(newCategory)
                updateURL({ category: newCategory })
              }}
              variant={!selectedCategory ? 'light' : 'outline'}
            >
              All Categories
            </Button>
            <Button
              size="md"
              leftSection={selectedCategory === 'Conference' ? <IconCheck size={18} /> : null}
              fw={500}
              tt="uppercase"
              fz={13}
              onClick={() => {
                setSelectedCategory('Conference')
                updateURL({ category: 'Conference' })
              }}
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
              onClick={() => {
                setSelectedCategory('Media Training')
                updateURL({ category: 'Media Training' })
              }}
              variant={selectedCategory === 'Media Training' ? 'light' : 'outline'}
            >
              Media Training
            </Button>

            <Combobox
              store={locationCombobox}
              onOptionSubmit={(value) => {
                const newCountry = value === 'all' ? null : value
                setSelectedCountry(newCountry)
                updateURL({ country: newCountry })
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
                const newLocationType = value === 'all' ? null : value
                setSelectedLocationType(newLocationType)
                updateURL({ locationType: newLocationType })
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
                        : 'Event Type'
                  }
                />
              </Combobox.Target>
              <Combobox.Dropdown>
                <Combobox.Options>
                  <Combobox.Option value="all">All</Combobox.Option>
                  <Combobox.Option value="in-site">In-site</Combobox.Option>
                  <Combobox.Option value="online">Online</Combobox.Option>
                </Combobox.Options>
              </Combobox.Dropdown>
            </Combobox>

            <Combobox
              styles={{
                dropdown: {
                  minWidth: 'fit-content',
                },
              }}
              position="bottom-start"
              store={statusCombobox}
              onOptionSubmit={(value) => {
                const newStatus = value as 'all' | 'upcoming' | 'past'
                setSelectedStatus(newStatus)
                updateURL({ status: newStatus })
                statusCombobox.closeDropdown()
              }}
            >
              <Combobox.Target>
                <ButtonEara
                  size="md"
                  rightSection={<IconChevronDown size={16} />}
                  onClick={() => statusCombobox.toggleDropdown()}
                  label={
                    selectedStatus === 'all'
                      ? 'Status'
                      : selectedStatus === 'upcoming'
                        ? 'Upcoming Events'
                        : 'Past Events'
                  }
                />
              </Combobox.Target>
              <Combobox.Dropdown>
                <Combobox.Options>
                  <Combobox.Option value="all">All Events</Combobox.Option>
                  <Combobox.Option value="upcoming">Upcoming Events</Combobox.Option>
                  <Combobox.Option value="past">Past Events</Combobox.Option>
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

export default function ArchiveEventsTemplate() {
  return (
    <Suspense
      fallback={
        <Container size="xl" py={50}>
          <Group justify="center">
            <Loader />
          </Group>
        </Container>
      }
    >
      <ArchiveEventsContent />
    </Suspense>
  )
}
