'use client'
import Gallery from '@/components/ui/Gallery/Gallery'
import PageTitleBar from '@/components/ui/PageTitleBar/PageTitleBar'
import { GetMediasBankDocument, GetSettingsDocument } from '@/graphql/generated/graphql'

import { getMediaType } from '@/lib/utils'
import { useQuery, useSuspenseQuery } from '@apollo/client/react'
import { Button, Container, Group, Loader, Skeleton } from '@mantine/core'
import { Suspense, useState } from 'react'

export default function MediaBank() {
  const [loadingMore, setLoadingMore] = useState(false)

  const { data, error, fetchMore } = useSuspenseQuery(GetMediasBankDocument, {
    variables: { first: 12 },
  })

  const { data: settings } = useQuery(GetSettingsDocument)
  const medias = getMediaType(data?.mediasBank)

  const hasNextPage = data?.mediasBank?.pageInfo?.hasNextPage
  const endCursor = data?.mediasBank?.pageInfo?.endCursor

  const handleLoadMore = async () => {
    if (!hasNextPage || loadingMore) return

    setLoadingMore(true)
    try {
      await fetchMore({
        variables: {
          first: 10,
          after: endCursor,
        },
        updateQuery: (previousResult, { fetchMoreResult }) => {
          if (!fetchMoreResult?.mediasBank?.nodes) return previousResult

          return {
            ...previousResult,
            mediasBank: {
              ...fetchMoreResult.mediasBank,
              nodes: [
                ...(previousResult?.mediasBank?.nodes || []),
                ...(fetchMoreResult?.mediasBank?.nodes || []),
              ],
            },
          }
        },
      })
    } catch (err) {
      console.error('Error loading more media:', err)
    } finally {
      setLoadingMore(false)
    }
  }

  if (error) return <p>Error: {error.message}</p>

  return (
    <>
      <PageTitleBar title="Media Bank" subtitle="Media Bank" />
      <Container size="xl" my={50}>
        <main>
          <div
            className="wp-block mb-20"
            dangerouslySetInnerHTML={{
              __html: settings?.earaSettings?.themeSettings?.mediabankIntro || '',
            }}
          ></div>
          <Suspense fallback={<div>Loading...</div>}>
            <Gallery data={medias} />
          </Suspense>

          {loadingMore && (
            <div className="mt-10 grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {Array.from({ length: 12 }).map((_, i) => (
                <div key={i} className="flex flex-col gap-2">
                  <Skeleton height={250} radius="md" />
                  <Skeleton height={20} width="70%" radius="sm" />
                  <Skeleton height={16} width="50%" radius="sm" />
                </div>
              ))}
            </div>
          )}

          {hasNextPage && (
            <Group justify="center" mt={40}>
              <Button
                size="lg"
                variant="filled"
                onClick={handleLoadMore}
                disabled={loadingMore}
                leftSection={loadingMore ? <Loader size="sm" color="white" /> : null}
              >
                {loadingMore ? 'Loading...' : 'Load More'}
              </Button>
            </Group>
          )}
        </main>
      </Container>
    </>
  )
}
