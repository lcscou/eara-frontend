'use client'
import ButtonEara from '@/components/ui/ButtonEara/ButtonEara'
import Gallery from '@/components/ui/Gallery/Gallery'
import PageTitleBar from '@/components/ui/PageTitleBar/PageTitleBar'
import { GetMediasBankDocument, GetSettingsDocument } from '@/graphql/generated/graphql'

import { getMediaType } from '@/lib/utils'
import { useQuery, useSuspenseQuery } from '@apollo/client/react'
import { Chip, Container, Group, Loader } from '@mantine/core'
import { Suspense, useCallback, useMemo, useState } from 'react'

export default function MediaBank() {
  const [loadingMore, setLoadingMore] = useState(false)
  const [selectedSpecies, setSelectedSpecies] = useState<string | null>(null)

  const POSTS_PER_PAGE = 12

  const { data, error, fetchMore } = useSuspenseQuery(GetMediasBankDocument, {
    variables: { first: POSTS_PER_PAGE },
  })

  const { data: settings } = useQuery(GetSettingsDocument)
  const medias = getMediaType(data?.mediasBank)

  const filteredMedias = useMemo(() => {
    const allMedias = medias || []
    if (!selectedSpecies) return allMedias

    return allMedias.filter((media) => {
      return media?.speciesFeaturedOrNewApproachMethodology === selectedSpecies
    })
  }, [medias, selectedSpecies])

  const hasNextPage = data?.mediasBank?.pageInfo?.hasNextPage
  const endCursor = data?.mediasBank?.pageInfo?.endCursor

  const handleResetFilters = () => {
    setSelectedSpecies(null)
  }

  const hasActiveFilters = selectedSpecies !== null

  const handleLoadMore = useCallback(() => {
    if (!hasNextPage || loadingMore) return

    setLoadingMore(true)

    setTimeout(async () => {
      try {
        await fetchMore({
          variables: {
            first: POSTS_PER_PAGE,
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

          <Group mb={30} gap="md">
            <Chip
              checked={selectedSpecies === null}
              onChange={() => setSelectedSpecies(null)}
              variant="filled"
            >
              All Species
            </Chip>
            <Chip
              checked={selectedSpecies === 'Pig'}
              onChange={() => setSelectedSpecies('Pig')}
              variant="filled"
            >
              Pig
            </Chip>
            <Chip
              checked={selectedSpecies === 'Sheep'}
              onChange={() => setSelectedSpecies('sheep')}
              variant="filled"
            >
              Sheep
            </Chip>
            <Chip
              checked={selectedSpecies === 'Dog'}
              onChange={() => setSelectedSpecies('Dog')}
              variant="filled"
            >
              Dog
            </Chip>
            <Chip
              checked={selectedSpecies === 'Rat'}
              onChange={() => setSelectedSpecies('Rat')}
              variant="filled"
            >
              Rat
            </Chip>
            {hasActiveFilters && (
              <ButtonEara variant="outline" onClick={handleResetFilters} label="Reset Filters" />
            )}
          </Group>

          <Suspense fallback={<div>Loading...</div>}>
            <Gallery data={filteredMedias} loadingMore={loadingMore} />
          </Suspense>

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
