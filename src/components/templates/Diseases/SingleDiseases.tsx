'use client'

import { GetDiseasesQuery, GetEventsQuery } from '@/graphql/generated/graphql'
import PageTitleBar from '../../ui/PageTitleBar/PageTitleBar'

export default function SingleDiseases({ data }: { data: GetDiseasesQuery }) {
  return (
    <>
      <PageTitleBar
        title={data.diseases?.title || undefined}
        featuredImage={data.diseases?.featuredImage?.node.guid}
        date={data.diseases?.date}
        readingTime={data.diseases?.seo?.readingTime}
        author={`${data.diseases?.author?.node.firstName} ${data.diseases?.author?.node.lastName}`}
      />
      <div dangerouslySetInnerHTML={{ __html: data.diseases?.content || '' }}></div>
    </>
  )
}
