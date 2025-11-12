'use client'
import ButtonEara from '@/components/ui/ButtonEara/ButtonEara'
import NewsCard from '@/components/ui/NewsCard/NewsCard'
import { GetAllNewsDocument, GetAllNewsQuery } from '@/graphql/generated/graphql'
import { cleanHTMLTAG } from '@/lib/utils'
import { useSuspenseQuery } from '@apollo/client/react'
import { Container, Group, Loader, Skeleton, Stack } from '@mantine/core'
import { useCallback, useState } from 'react'

// interface ArchiveNewsProps {
//   data: GetAllNewsQuery
// }
const PAGE_SIZE = 1
export default function ArchiveNews() {
  const [loadingMore, setLoadingMore] = useState(false)
  const { data, fetchMore } = useSuspenseQuery<GetAllNewsQuery>(GetAllNewsDocument, {
    variables: { first: PAGE_SIZE },
  })

  const hasNextPage = data?.allNews?.pageInfo?.hasNextPage
  const endCursor = data?.allNews?.pageInfo?.endCursor
  const handleLoadMore = useCallback(() => {
    if (!hasNextPage || loadingMore) return
    setLoadingMore(true)
    setTimeout(async () => {
      try {
        await fetchMore({
          variables: { first: PAGE_SIZE, after: endCursor },
          updateQuery: (
            prev: GetAllNewsQuery,
            { fetchMoreResult }: { fetchMoreResult?: GetAllNewsQuery }
          ) => {
            if (!fetchMoreResult?.allNews?.nodes) return prev
            return {
              ...prev,
              allNews: {
                ...fetchMoreResult.allNews,
                pageInfo: fetchMoreResult.allNews.pageInfo,
                nodes: [...(prev?.allNews?.nodes ?? []), ...(fetchMoreResult.allNews.nodes ?? [])],
              },
            }
          },
        })
      } finally {
        setLoadingMore(false)
      }
    }, 0)
  }, [hasNextPage, loadingMore, endCursor, fetchMore])
  return (
    <>
      <Container className="my-20">
        <Stack>
          {data.allNews && data.allNews.nodes.length > 0 ? (
            data.allNews.nodes.map((newsItem) => (
              <NewsCard
                key={newsItem.id}
                title={newsItem.title || 'No Title'}
                timeReading={newsItem.seo?.readingTime}
                author={`${newsItem.author?.node.firstName} ${newsItem.author?.node.lastName}`}
                excerpt={cleanHTMLTAG(newsItem.content || '').substring(0, 100) + '...'}
                featuredImage={newsItem.featuredImage?.node.guid || '/eara-fallback.jpg'}
                link={`/news/${newsItem.slug}`}
              />
            ))
          ) : (
            <p>No news available.</p>
          )}
        </Stack>
      </Container>

      {loadingMore && (
        <div className="mt-10 grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {Array.from({ length: PAGE_SIZE }).map((_, i) => (
            <div key={i} className="flex flex-col gap-2">
              <Skeleton height={200} radius="md" />
              <Skeleton height={20} width="70%" radius="sm" />
              <Skeleton height={16} width="50%" radius="sm" />
            </div>
          ))}
        </div>
      )}

      {hasNextPage && (
        <Group justify="center" mt={40}>
          <ButtonEara
            label={loadingMore ? 'Loading...' : 'Load More'}
            size="lg"
            variant="filled"
            onClick={handleLoadMore}
            disabled={loadingMore}
            leftSection={loadingMore ? <Loader size="sm" color="white" /> : null}
          />
        </Group>
      )}
    </>
  )
}
