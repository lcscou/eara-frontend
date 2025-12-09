'use client'
import PageTitleBar from '@/components/ui/PageTitleBar/PageTitleBar'
import Ticker from '@/components/ui/Ticker'
import { GetPageQuery } from '@/graphql/generated/graphql'
import { useTicker } from '@/hooks/useTicker'
import { renderPageBlocks } from '@/lib/blockRenderer'

export default function PageTemplate({
  data,
  hideTitleBar,
  withTicker,
}: {
  data: GetPageQuery
  withTicker?: boolean
  hideTitleBar?: boolean
}) {
  const { tickers } = useTicker()
  return (
    <>
      {!hideTitleBar && (
        <PageTitleBar
          title={data.page?.title}
          featuredImage={data.page?.featuredImage?.node.guid}
          date={data.page?.date}
          readingTime={data.page?.seo?.readingTime}
          subtitle={data.page?.seo?.breadcrumbs?.slice(-2)?.[0]?.text ?? ''}
          // author={`${data.page?.author?.node.firstName} ${data.page?.author?.node.lastName}`}
        />
      )}
      <div>{renderPageBlocks(data.page?.blocks)}</div>
      {withTicker && tickers && tickers.length > 0 && (
        <Ticker
          messages={tickers ?? []}
          className=""
          bgColor="secondary"
          textColor="dark"
          position="fixed-bottom"
          dismissible={true}
        />
      )}
    </>
  )
}
