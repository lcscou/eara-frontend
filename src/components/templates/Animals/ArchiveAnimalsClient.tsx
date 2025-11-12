'use client'

import AnimalsCard from '@/components/ui/AnimalsCard/AnimalsCard'
import ButtonEara from '@/components/ui/ButtonEara/ButtonEara'
import { gql } from '@apollo/client'
import { useSuspenseQuery } from '@apollo/client/react'
import { Group, Loader, Skeleton } from '@mantine/core'
import { useCallback, useMemo, useState } from 'react'

const PAGE_SIZE = 15

const GET_ALL_ANIMALS_PAGED = gql`
  query GetAllAnimalsPaged($first: Int, $after: String) {
    animals(first: $first, after: $after) {
      pageInfo {
        endCursor
        hasNextPage
      }
      nodes {
        id
        title
        uri
        featuredImage {
          node {
            guid
          }
        }
      }
    }
  }
`

type AnimalNode = {
  id: string
  title?: string | null
  uri?: string | null
  featuredImage?: { node?: { guid?: string | null } | null } | null
}

type AnimalsPagedData = {
  animals?: {
    pageInfo?: { endCursor?: string | null; hasNextPage?: boolean | null }
    nodes?: AnimalNode[]
  }
}

export default function ArchiveAnimalsClient() {
  const [loadingMore, setLoadingMore] = useState(false)

  const { data, fetchMore } = useSuspenseQuery<AnimalsPagedData>(GET_ALL_ANIMALS_PAGED, {
    variables: { first: PAGE_SIZE },
  })

  const nodes = useMemo<AnimalNode[]>(() => data?.animals?.nodes ?? [], [data])
  const hasNextPage = data?.animals?.pageInfo?.hasNextPage
  const endCursor = data?.animals?.pageInfo?.endCursor

  const handleLoadMore = useCallback(() => {
    if (!hasNextPage || loadingMore) return
    setLoadingMore(true)
    setTimeout(async () => {
      try {
        await fetchMore({
          variables: { first: PAGE_SIZE, after: endCursor },
          updateQuery: (
            prev: AnimalsPagedData,
            { fetchMoreResult }: { fetchMoreResult?: AnimalsPagedData }
          ) => {
            if (!fetchMoreResult?.animals?.nodes) return prev
            return {
              ...prev,
              animals: {
                ...fetchMoreResult.animals,
                pageInfo: fetchMoreResult.animals.pageInfo,
                nodes: [...(prev?.animals?.nodes ?? []), ...(fetchMoreResult.animals.nodes ?? [])],
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
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {nodes.map((animal) => (
          <div key={animal?.id} className="card">
            <AnimalsCard
              id={animal?.id}
              title={animal?.title}
              uri={animal?.uri}
              featuredImage={animal.featuredImage?.node?.guid}
            />
          </div>
        ))}
      </div>

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
