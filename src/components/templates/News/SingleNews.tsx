'use client'

import { GetNewsQuery } from '@/graphql/generated/graphql'
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
      <div dangerouslySetInnerHTML={{ __html: data.news?.content || '' }}></div>
    </>
  )
}
