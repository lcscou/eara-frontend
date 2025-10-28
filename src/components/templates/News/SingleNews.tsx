'use client'

import { GetNewsQuery } from '@/graphql/generated/graphql'
import { Container } from '@mantine/core'
import PageTitleBar from '../../ui/PageTitleBar/PageTitleBar'

export default function SingleNews({ data }: { data: GetNewsQuery }) {
  return (
    <>
      <PageTitleBar
        title={data.news?.title || undefined}
        featuredImage={data.news?.featuredImage?.node.guid}
        date={data.news?.date}
        readingTime={data.news?.seo?.readingTime}
        author={`${data.news?.author?.node.firstName} ${data.news?.author?.node.lastName}`}
      />
      <Container size="lg" className="my-20">
        <div dangerouslySetInnerHTML={{ __html: data.news?.content || '' }}></div>
      </Container>
    </>
  )
}
