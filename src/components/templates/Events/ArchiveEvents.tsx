'use client'
import ButtonEara from '@/components/ui/ButtonEara/ButtonEara'
import EventCard from '@/components/ui/EventCard/EventCard'
import { GetAllEventsQuery_RootQuery } from '@/graphql/generated/graphql'
import { truncateText } from '@/lib/utils'
import { Chip, Combobox, Container, Group, useCombobox } from '@mantine/core'
import { IconChevronDown } from '@tabler/icons-react'

interface ArchiveEventsProps {
  data?: GetAllEventsQuery_RootQuery
}

export default function ArchiveEventsTemplate({ data }: ArchiveEventsProps) {
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
                {/* <Button  onClick={() => combobox.toggleDropdown()} variant="filled" size="md">
                Filter by Category
              </Button> */}
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

        {data?.allEvents?.nodes && data.allEvents.nodes.length > 0 ? (
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
          <p className="mt-10">No events found.</p>
        )}
      </Container>
    </>
  )
}
