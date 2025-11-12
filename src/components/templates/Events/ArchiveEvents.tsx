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
import { useCallback, useState } from 'react'

const PAGE_SIZE = 1
export default function ArchiveEventsTemplate() {
  const [loadingMore, setLoadingMore] = useState(false)

  const { data, fetchMore } = useSuspenseQuery<GetAllEventsQuery>(GetAllEventsDocument, {
    variables: { first: PAGE_SIZE },
  })

  const hasNextPage = data?.allEvents?.pageInfo?.hasNextPage
  const endCursor = data?.allEvents?.pageInfo?.endCursor

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

  const combobox = useCombobox({
    onDropdownClose: () => combobox.resetSelectedOption(),
  })
  const organizerCombobox = useCombobox({
    onDropdownClose: () => organizerCombobox.resetSelectedOption(),
  })
  return (
    <>
      <Container size="xl" className="py-20">
        <div className="flex justify-between">
          <Group gap={5}>
            <Chip defaultChecked variant="light" size="md">
              All Event
            </Chip>
            <Chip variant="light" size="md">
              Openesse Event
            </Chip>
            <Chip variant="light" size="md">
              Conference
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
                  <Combobox.Option value="all">All Events</Combobox.Option>
                  <Combobox.Option value="openesse">Openesse Events</Combobox.Option>
                  <Combobox.Option value="conference">Conferences</Combobox.Option>
                  <Combobox.Option value="workshop">Workshops</Combobox.Option>
                </Combobox.Options>
              </Combobox.Dropdown>
            </Combobox>
            <Combobox store={organizerCombobox}>
              <Combobox.Target>
                <ButtonEara
                  size="sm"
                  rightSection={<IconChevronDown size={16} />}
                  onClick={() => organizerCombobox.toggleDropdown()}
                  label="Organizer"
                />
              </Combobox.Target>
              <Combobox.Dropdown>
                <Combobox.Options>
                  <Combobox.Option value="all">All Events</Combobox.Option>
                  <Combobox.Option value="openesse">Openesse Events</Combobox.Option>
                  <Combobox.Option value="conference">Conferences</Combobox.Option>
                  <Combobox.Option value="workshop">Workshops</Combobox.Option>
                </Combobox.Options>
              </Combobox.Dropdown>
            </Combobox>
          </Group>
        </div>

        {data?.allEvents?.nodes ? (
          <div className="mt-10 grid gap-5 sm:grid-cols-3">
            {data.allEvents.nodes.map((event) => (
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
                <Button className="mt-4" variant="light" leftSection={<IconRestore size={18} />}>
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
    </>
  )
}
