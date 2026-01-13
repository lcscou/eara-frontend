'use client'

import { GetPressReleaseQuery } from '@/graphql/generated/graphql'
import { renderPageBlocks } from '@/lib/blockRenderer'
import { Button, Container, Stack } from '@mantine/core'
import { IconArrowLeft, IconDownload } from '@tabler/icons-react'
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
        <div>{renderPageBlocks(data.pressRelease?.blocks)}</div>
        {data.pressRelease?.acfPressRelease?.documents &&
          data.pressRelease.acfPressRelease.documents.length > 0 && (
            <div className="mt-10">
              <h2 className="mb-4 text-2xl font-semibold">Download</h2>
              <Stack className="w-fit" gap={5}>
                {data.pressRelease.acfPressRelease.documents.map((doc, index) => (
                  <Button
                    key={doc?.title || index}
                    component="a"
                    variant="light"
                    href={doc?.file?.node.guid || '#'}
                    target="_blank"
                    rel="noopener noreferrer"
                    download
                    rightSection={<IconDownload size={18} />}
                  >
                    {doc?.title || doc?.file?.node.title || 'Document'}
                  </Button>
                ))}
              </Stack>
            </div>
          )}
      </Container>
    </>
  )
}
