'use client'

import { GetAnimalQuery } from '@/graphql/generated/graphql'
import { renderPageBlocks } from '@/lib/blockRenderer'
import { Button, Container } from '@mantine/core'
import { IconArrowLeft } from '@tabler/icons-react'
import Link from 'next/link'
import PageTitleBar from '../ui/PageTitleBar/PageTitleBar'

export default function SingleAnimals({ data }: { data: GetAnimalQuery }) {
  return (
    <>
      <PageTitleBar
        title={data.animal?.title || undefined}
        featuredImage={data.animal?.acfAnimal?.pageHeaderImage?.node?.link}
        date={data.animal?.date}
        readingTime={data.animal?.seo?.readingTime}
        author={`${data.animal?.author?.node.firstName} ${data.animal?.author?.node.lastName}`}
      />
      <Container size="lg" className="my-20">
        <div className="mb-5 flex justify-end">
          <Link href="/animals">
            <Button variant="subtle" leftSection={<IconArrowLeft size={16} />}>
              Back to animals list
            </Button>
          </Link>
        </div>
        <div>{renderPageBlocks(data.animal?.blocks)}</div>
      </Container>
    </>
  )
}
