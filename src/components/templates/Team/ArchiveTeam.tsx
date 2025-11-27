'use client'
import ButtonEara from '@/components/ui/ButtonEara/ButtonEara'
import ResultNotFound from '@/components/ui/ResultNotFound/ResultNotFound'
import TeamCard from '@/components/ui/TeamCard/TeamCard'
import { GetAllTeamDocument, GetAllTeamQuery } from '@/graphql/generated/graphql'
import { useSuspenseQuery } from '@apollo/client/react'
import { Container, Group, Loader, useCombobox } from '@mantine/core'
import { useCallback, useState } from 'react'

const PAGE_SIZE = 12

export default function ArchiveTeam() {
  const { data, fetchMore } = useSuspenseQuery(GetAllTeamDocument, {
    variables: { first: PAGE_SIZE },
  })

  const [loadingMore, setLoadingMore] = useState(false)

  const hasNextPage = data?.allTeams?.pageInfo?.hasNextPage
  const endCursor = data?.allTeams?.pageInfo?.endCursor

  const countryCombobox = useCombobox({
    onDropdownClose: () => countryCombobox.resetSelectedOption(),
  })

  const handleLoadMore = useCallback(() => {
    if (!hasNextPage || loadingMore) return
    setLoadingMore(true)
    setTimeout(async () => {
      try {
        await fetchMore({
          variables: { first: PAGE_SIZE, after: endCursor },
          updateQuery: (
            prev: GetAllTeamQuery,
            { fetchMoreResult }: { fetchMoreResult?: GetAllTeamQuery }
          ) => {
            if (!fetchMoreResult?.allTeams?.nodes) return prev
            return {
              ...prev,
              allTeams: {
                ...fetchMoreResult.allTeams,
                pageInfo: fetchMoreResult.allTeams.pageInfo,
                nodes: [
                  ...(prev?.allTeams?.nodes ?? []),
                  ...(fetchMoreResult.allTeams.nodes ?? []),
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
      <Container size="xl" my={100}>
        {data?.allTeams?.nodes?.length === 0 && <ResultNotFound />}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          {data?.allTeams?.nodes?.map((team) => (
            <div key={team?.id}>
              <TeamCard
                id={team.id}
                title={team.title}
                featuredImage={team.featuredImage?.node.guid}
                role={team.roles?.nodes[0].name}
                uri={team.uri}
              />
            </div>
          ))}
        </div>
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
      </Container>
    </>
  )
}
