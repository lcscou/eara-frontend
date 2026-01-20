'use client'

import { GetEventsQuery } from '@/graphql/generated/graphql'
import { renderPageBlocks } from '@/lib/blockRenderer'
import { Button, Container, Group, Stack, Title } from '@mantine/core'
import { IconArrowLeft, IconCalendar, IconMapPin } from '@tabler/icons-react'
import Link from 'next/link'
import PageTitleBar from '../../ui/PageTitleBar/PageTitleBar'

export default function SingleEvents({ data }: { data: GetEventsQuery }) {
  const startDate = data.events?.customFields?.startDate
    ? new Date(data.events.customFields.startDate).toLocaleString('en-US', {
        dateStyle: 'long',
        timeStyle: 'short',
      })
    : null
  const endDate = data.events?.customFields?.endDate
    ? new Date(data.events.customFields.endDate).toLocaleString('en-US', {
        dateStyle: 'long',
        timeStyle: 'short',
      })
    : null
  return (
    <>
      <PageTitleBar
        title={data.events?.title || undefined}
        featuredImage={data.events?.customFields?.pageHeaderImage?.node?.link}
        eventStartDate={data.events?.customFields?.startDate}
        eventEndDate={data.events?.customFields?.endDate}
        organizer={data.events?.customFields?.organizer}
        location={data.events?.customFields?.location}
        subtitle="Event"
        backgroundTitle
        // author={`${data.events?.author?.node.firstName} ${data.events?.author?.node.lastName}`}
      />
      <Container size="lg" className="prose prose-lg my-10 max-w-none">
        <div className="mb-5 flex justify-end">
          <Link href="/events">
            <Button variant="subtle" leftSection={<IconArrowLeft size={16} />}>
              Back to events list
            </Button>
          </Link>
        </div>
        <section className="py-10">
          <div className="grid gap-10 sm:grid-cols-12">
            <div className="sm:col-span-7">
              <Stack>
                <Group>
                  {startDate && <span>{startDate}</span>}
                  {endDate && <span> - {endDate}</span>}
                </Group>

                {data.events?.title && <Title order={2}>{data.events.title}</Title>}
                {data.events?.customFields?.organizer && (
                  <span>
                    by <b>{data.events.customFields.organizer}</b>
                  </span>
                )}

                {data.events?.customFields?.description && (
                  <p>{data.events.customFields.description}</p>
                )}

                {startDate && (
                  <div className="my-5 flex flex-col gap-5">
                    <Title order={5}>Date and time</Title>
                    <Group>
                      <IconCalendar />
                      <span>
                        {startDate}
                        {endDate && ` - ${endDate}`}
                      </span>
                    </Group>
                  </div>
                )}
                {data.events?.customFields?.location && (
                  <div className="mb-5 flex flex-col gap-5">
                    <Title order={5}>Location</Title>
                    <Group>
                      <IconMapPin />
                      <span>
                        {data.events.customFields.locationType === 'online'
                          ? 'Online'
                          : data.events.customFields.location}
                      </span>
                    </Group>
                  </div>
                )}
              </Stack>
            </div>
            <div className="sm:col-span-5">
              <div className="flex items-center justify-between rounded-xl bg-white p-8">
                <Stack gap={1}>
                  <span className="font-bold">Free</span>
                  {startDate && <span className="opacity-60">{startDate}</span>}
                </Stack>
                <Button size="md">Get tickets</Button>
              </div>
            </div>
          </div>
        </section>

        <div>{renderPageBlocks(data.events?.blocks)}</div>
      </Container>
    </>
  )
}
