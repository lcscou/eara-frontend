'use client'

import { GetMembersQuery } from '@/graphql/generated/graphql'
import { Button, Container } from '@mantine/core'
import { IconArrowLeft } from '@tabler/icons-react'
import Link from 'next/link'
import PageTitleBar from '../../ui/PageTitleBar/PageTitleBar'

export default function SingleMembers({ data }: { data: GetMembersQuery }) {
  return (
    <>
      <PageTitleBar
        title={data.member?.title || undefined}
        featuredImage={data.member?.featuredImage?.node.guid}
        date={data.member?.date}
        readingTime={data.member?.seo?.readingTime}
        author={`${data.member?.author?.node.firstName} ${data.member?.author?.node.lastName}`}
      />
      <Container size="lg" className="my-20">
        <div className="mb-5 flex justify-end">
          <Link href="/members">
            <Button variant="subtle" leftSection={<IconArrowLeft size={16} />}>
              Back to members list
            </Button>
          </Link>
        </div>
        <div dangerouslySetInnerHTML={{ __html: data.member?.content || '' }}></div>
      </Container>
    </>
  )
}
