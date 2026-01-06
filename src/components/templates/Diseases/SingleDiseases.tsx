'use client'

import { GetDiseasesQuery } from '@/graphql/generated/graphql'
import { renderPageBlocks } from '@/lib/blockRenderer'
import { Button, Container } from '@mantine/core'
import { IconArrowLeft } from '@tabler/icons-react'
import Link from 'next/link'
import PageTitleBar from '../../ui/PageTitleBar/PageTitleBar'

export default function SingleDiseases({ data }: { data: GetDiseasesQuery }) {
  return (
    <>
      <PageTitleBar
        title={data.diseases?.title || undefined}
        featuredImage={data.diseases?.acfDiseases?.pageHeaderImage?.node?.link}
        date={data.diseases?.date}
        readingTime={data.diseases?.seo?.readingTime || 0}
        author={`${data.diseases?.author?.node.firstName} ${data.diseases?.author?.node.lastName}`}
      />
      <Container size="lg" className="my-20">
        <div className="mb-5 flex justify-end">
          <Link href="/diseases">
            <Button variant="subtle" leftSection={<IconArrowLeft size={16} />}>
              Back to diseases list
            </Button>
          </Link>
        </div>
      </Container>
      <div>{renderPageBlocks(data.diseases?.blocks)}</div>
    </>
  )
}
