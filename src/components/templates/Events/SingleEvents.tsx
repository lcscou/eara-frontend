'use client'

import { GetEventsQuery } from '@/graphql/generated/graphql'
import { Button, Container } from '@mantine/core'
import { IconArrowLeft } from '@tabler/icons-react'
import Link from 'next/link'
import PageTitleBar from '../../ui/PageTitleBar/PageTitleBar'

export default function SingleEvents({ data }: { data: GetEventsQuery }) {
  return (
    <>
      <PageTitleBar
        title={data.events?.title || undefined}
        featuredImage={data.events?.featuredImage?.node.guid}
        eventStartDate={data.events?.customFields?.startDate}
        eventEndDate={data.events?.customFields?.endDate}
        organizer={data.events?.customFields?.organizer}
        location={data.events?.customFields?.location}
        subtitle="Event"
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
        <div dangerouslySetInnerHTML={{ __html: data.events?.content || '' }}></div>
      </Container>
    </>
  )
}
