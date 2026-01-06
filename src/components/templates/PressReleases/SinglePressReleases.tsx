'use client'

import { GetPressReleaseQuery } from '@/graphql/generated/graphql'
import { Button, Container } from '@mantine/core'
import { IconArrowLeft } from '@tabler/icons-react'
import Link from 'next/link'
import PageTitleBar from '../../ui/PageTitleBar/PageTitleBar'

export default function SinglePressRelease({ data }: { data: GetPressReleaseQuery }) {
  return (
    <>
      <PageTitleBar
        title={data.pressRelease?.title || undefined}
        featuredImage={data.pressRelease?.featuredImage?.node.guid}
        date={data.pressRelease?.date}
        readingTime={data.pressRelease?.seo?.readingTime}
        author="EARA"
      />
      <Container size="lg" className="my-20">
        <div className="mb-5 flex justify-end">
          <Link href="/press-releases">
            <Button variant="subtle" leftSection={<IconArrowLeft size={16} />}>
              Back to press releases list
            </Button>
          </Link>
        </div>
        <div dangerouslySetInnerHTML={{ __html: data.pressRelease?.content || '' }}></div>
      </Container>
    </>
  )
}
