'use client'

import { GetAnimalQuery } from '@/graphql/generated/graphql'
import PageTitleBar from '../ui/PageTitleBar/PageTitleBar'

export default function SingleAnimals({ data }: { data: GetAnimalQuery }) {
  return (
    <>
      <PageTitleBar
        title={data.animal?.title || undefined}
        featuredImage={data.animal?.featuredImage?.node.guid}
        date={data.animal?.date}
        readingTime={data.animal?.seo?.readingTime}
        author={`${data.animal?.author?.node.firstName} ${data.animal?.author?.node.lastName}`}
      />
      <div dangerouslySetInnerHTML={{ __html: data.animal?.content || '' }}></div>
    </>
  )
}
