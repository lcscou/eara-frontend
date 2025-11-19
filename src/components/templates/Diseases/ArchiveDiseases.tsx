'use client'

import AnimalsCard from '@/components/ui/AnimalsCard/AnimalsCard'
import ButtonEara from '@/components/ui/ButtonEara/ButtonEara'
import { GetAllDiseasesDocument, GetAllDiseasesQuery } from '@/graphql/generated/graphql'
import { useSuspenseQuery } from '@apollo/client/react'
import { Group, Loader, Skeleton } from '@mantine/core'
import { useCallback, useState } from 'react'

const PAGE_SIZE = 12

export default function ArchiveDiseases() {
  const [loadingMore, setLoadingMore] = useState(false)
  const { data, fetchMore } = useSuspenseQuery<GetAllDiseasesQuery>(GetAllDiseasesDocument, {
    variables: { first: PAGE_SIZE },
  })

  const hasNextPage = data?.allDiseases?.pageInfo?.hasNextPage
  const endCursor = data?.allDiseases?.pageInfo?.endCursor

  const handleLoadMore = useCallback(() => {
    if (!hasNextPage || loadingMore) return
    setLoadingMore(true)
    setTimeout(async () => {
      try {
        await fetchMore({
          variables: { first: PAGE_SIZE, after: endCursor },
          updateQuery: (
            prev: GetAllDiseasesQuery,
            { fetchMoreResult }: { fetchMoreResult?: GetAllDiseasesQuery }
          ) => {
            if (!fetchMoreResult?.allDiseases?.nodes) return prev
            return {
              ...prev,
              allDiseases: {
                ...fetchMoreResult.allDiseases,
                pageInfo: fetchMoreResult.allDiseases.pageInfo,
                nodes: [
                  ...(prev?.allDiseases?.nodes ?? []),
                  ...(fetchMoreResult.allDiseases.nodes ?? []),
                ],
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
        {data.allDiseases?.nodes.map((disease) => (
          <div key={disease?.id} className="card">
            <AnimalsCard
              id={disease?.id}
              title={disease?.title}
              uri={disease?.uri}
              featuredImage={disease.featuredImage?.node?.guid}
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
