'use client'
import ButtonEara from '@/components/ui/ButtonEara/ButtonEara'
import MembersCard from '@/components/ui/MembersCard/MembersCard'
import ResultNotFound from '@/components/ui/ResultNotFound/ResultNotFound'
import { GetAllMembersDocument, GetAllMembersQuery } from '@/graphql/generated/graphql'
import { useSuspenseQuery } from '@apollo/client/react'
import { Combobox, Container, Group, Loader, useCombobox } from '@mantine/core'
import { IconChevronDown } from '@tabler/icons-react'
import { useCallback, useMemo, useState } from 'react'

const PAGE_SIZE = 12

export default function ArchiveMembers() {
  const { data, fetchMore } = useSuspenseQuery(GetAllMembersDocument, {
    variables: { first: PAGE_SIZE },
  })
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null)
  const [loadingMore, setLoadingMore] = useState(false)

  const hasNextPage = data?.members?.pageInfo?.hasNextPage
  const endCursor = data?.members?.pageInfo?.endCursor

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
            prev: GetAllMembersQuery,
            { fetchMoreResult }: { fetchMoreResult?: GetAllMembersQuery }
          ) => {
            if (!fetchMoreResult?.members?.nodes) return prev
            return {
              ...prev,
              members: {
                ...fetchMoreResult.members,
                pageInfo: fetchMoreResult.members.pageInfo,
                nodes: [...(prev?.members?.nodes ?? []), ...(fetchMoreResult.members.nodes ?? [])],
              },
            }
          },
        })
      } finally {
        setLoadingMore(false)
      }
    }, 0)
  }, [hasNextPage, loadingMore, endCursor, fetchMore])

  const filteredMembers = useMemo(() => {
    let filtered = data?.members?.nodes ?? []
    if (selectedCountry) {
      filtered = filtered.filter((newsItem) =>
        newsItem?.acfMembers?.country?.includes(selectedCountry)
      )
    }

    return filtered
  }, [data, selectedCountry])

  return (
    <>
      <Container size="xl" my={100}>
        <Group mb={40}>
          <Combobox
            onOptionSubmit={(value) => {
              setSelectedCountry(value === 'all' ? null : value)
              countryCombobox.closeDropdown()
            }}
            store={countryCombobox}
          >
            <Combobox.Target>
              <ButtonEara
                size="md"
                onClick={() => countryCombobox.toggleDropdown()}
                rightSection={<IconChevronDown size={14} />}
                label={''}
              >
                {selectedCountry || 'Country'}
              </ButtonEara>
            </Combobox.Target>
            <Combobox.Dropdown>
              <Combobox.Options>
                <Combobox.Option value="all">All Country</Combobox.Option>
                <Combobox.Option value="portugal">Portugal</Combobox.Option>
                <Combobox.Option value="brazil">Brazil</Combobox.Option>
                <Combobox.Option value="canada">Canada</Combobox.Option>
              </Combobox.Options>
            </Combobox.Dropdown>
          </Combobox>
        </Group>
        {filteredMembers?.length === 0 && (
          <ResultNotFound resetFilters={() => setSelectedCountry(null)} />
        )}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          {filteredMembers?.map((member) => (
            <div key={member?.id}>
              <MembersCard
                title={member.title}
                featuredImage={member.featuredImage?.node?.guid}
                uri={member.acfMembers?.website}
                country={member.acfMembers?.country?.join(', ')}
                id={member?.id}
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
