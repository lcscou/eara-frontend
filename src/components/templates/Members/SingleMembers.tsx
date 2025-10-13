'use client'

import { GetMembersQuery } from '@/graphql/generated/graphql'
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
      <div dangerouslySetInnerHTML={{ __html: data.member?.content || '' }}></div>
    </>
  )
}
