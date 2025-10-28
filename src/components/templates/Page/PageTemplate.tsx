import PageTitleBar from '@/components/ui/PageTitleBar/PageTitleBar'
import { GetPageQuery } from '@/graphql/generated/graphql'
export default function PageTemplate({ data }: { data: GetPageQuery }) {
  return (
    <>
      <PageTitleBar
        title={data.page?.title}
        featuredImage={data.page?.featuredImage?.node.guid}
        date={data.page?.date}
        readingTime={data.page?.seo?.readingTime}
        subtitle={data.page?.seo?.breadcrumbs?.slice(-2)?.[0]?.text ?? ''}
        // author={`${data.page?.author?.node.firstName} ${data.page?.author?.node.lastName}`}
      />
      <div dangerouslySetInnerHTML={{ __html: data.page?.content || '' }}></div>
    </>
  )
}
