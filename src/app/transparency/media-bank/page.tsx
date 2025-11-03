'use client'
import ButtonEara from '@/components/ui/ButtonEara/ButtonEara'
import Gallery from '@/components/ui/Gallery/Gallery'
import PageTitleBar from '@/components/ui/PageTitleBar/PageTitleBar'
import { GetMediasBankDocument, GetSettingsDocument } from '@/graphql/generated/graphql'

import { getMediaType } from '@/lib/utils'
import { useQuery, useSuspenseQuery } from '@apollo/client/react'
import { Container, Group, Loader, Skeleton } from '@mantine/core'
import { Suspense, useCallback, useState } from 'react'

export default function MediaBank() {
  const [loadingMore, setLoadingMore] = useState(false)

  const { data, error, fetchMore } = useSuspenseQuery(GetMediasBankDocument, {
    variables: { first: 12 },
  })

  const { data: settings } = useQuery(GetSettingsDocument)
  const medias = getMediaType(data?.mediasBank)

  const hasNextPage = data?.mediasBank?.pageInfo?.hasNextPage
  const endCursor = data?.mediasBank?.pageInfo?.endCursor

  const handleLoadMore = useCallback(() => {
    if (!hasNextPage || loadingMore) return

    setLoadingMore(true)

    setTimeout(async () => {
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
    }, 0)
  }, [hasNextPage, loadingMore, endCursor, fetchMore])

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
            <div className="columns-3">
              {Array.from({ length: 9 }).map((_, i) => (
                <div key={i} className="flex flex-col gap-2">
                  <Skeleton height={250} radius="md" className="mb-4" />
                </div>
              ))}
            </div>
          )}

          {hasNextPage && (
            <Group justify="center" mt={40}>
              <ButtonEara
                size="lg"
                variant="filled"
                onClick={handleLoadMore}
                disabled={loadingMore}
                leftSection={loadingMore ? <Loader size="sm" color="white" /> : null}
                label={loadingMore ? 'Loading...' : 'Load More'}
              ></ButtonEara>
            </Group>
          )}
        </main>
      </Container>
    </>
  )
}
