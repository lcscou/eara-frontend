'use client'

import { GetEventsQuery } from '@/graphql/generated/graphql'
import PageTitleBar from '../../ui/PageTitleBar/PageTitleBar'

export default function SingleEvents({ data }: { data: GetEventsQuery }) {
  return (
    <>
      <PageTitleBar
        title={data.events?.title || undefined}
        featuredImage={data.events?.featuredImage?.node.guid}
        date={data.events?.date}
        readingTime={data.events?.seo?.readingTime}
        author={`${data.events?.author?.node.firstName} ${data.events?.author?.node.lastName}`}
      />
      <div dangerouslySetInnerHTML={{ __html: data.events?.content || '' }}></div>
    </>
  )
}
