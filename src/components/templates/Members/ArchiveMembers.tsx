'use client'
import ButtonEara from '@/components/ui/ButtonEara/ButtonEara'
import MembersCard from '@/components/ui/MembersCard/MembersCard'
import ResultNotFound from '@/components/ui/ResultNotFound/ResultNotFound'
import {
  GetAllMembersDocument,
  GetAllMembersQuery,
  GetMembersCountriesDocument,
} from '@/graphql/generated/graphql'
import { useSuspenseQuery } from '@apollo/client/react'
import { Combobox, Container, Group, Loader, useCombobox } from '@mantine/core'
import { IconChevronDown } from '@tabler/icons-react'
import { useCallback, useEffect, useMemo, useState } from 'react'

const PAGE_SIZE = 12

export default function ArchiveMembers() {
  // Query para buscar países de todos os membros (sem paginação)
  const { data: countriesData } = useSuspenseQuery(GetMembersCountriesDocument)

  // Query principal para buscar membros paginados
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

  const normalizeCountry = (value?: string | null) => value?.toLowerCase().trim() ?? ''
  const capitalizeCountry = (value: string) => value.replace(/\b\w/g, (c) => c.toUpperCase())

  // Gerar opções de países com base em TODOS os membros do backend
  const { countryOptions, totalMembers } = useMemo(() => {
    const allCountryMembers = countriesData?.members?.nodes ?? []
    const countryCount: Record<string, number> = {}

    for (const m of allCountryMembers) {
      const countries = m?.acfMembers?.country ?? []
      for (const raw of countries) {
        const value = normalizeCountry(raw)
        if (!value) continue
        countryCount[value] = (countryCount[value] ?? 0) + 1
      }
    }

    const options = Object.entries(countryCount)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([value, count]) => ({
        value,
        label: capitalizeCountry(value),
        count,
      }))

    return { countryOptions: options, totalMembers: allCountryMembers.length }
  }, [countriesData])

  // Membros visíveis na página atual
  const { allMembers, countryIndex } = useMemo(() => {
    const all = data?.members?.nodes ?? []
    const index: Record<string, Array<(typeof all)[number]>> = {}

    for (const m of all) {
      const countries = m?.acfMembers?.country ?? []
      for (const raw of countries) {
        const value = normalizeCountry(raw)
        if (!value) continue
        ;(index[value] ??= []).push(m)
      }
    }

    return { allMembers: all, countryIndex: index }
  }, [data])

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

  const filteredMembers = selectedCountry ? (countryIndex[selectedCountry] ?? []) : allMembers

  useEffect(() => {
    if (selectedCountry && !countryOptions.some((o) => o.value === selectedCountry)) {
      setSelectedCountry(null)
    }
  }, [selectedCountry, countryOptions])

  const selectedLabel = selectedCountry
    ? countryOptions.find((o) => o.value === selectedCountry)?.label || 'Country'
    : 'Country'

  return (
    <>
      <Container size="xl" my={100}>
        <Group mb={40}>
          <Combobox
            styles={{
              dropdown: {
                minWidth: 'fit-content',
              },
            }}
            position="bottom-end"
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
                {selectedLabel}
              </ButtonEara>
            </Combobox.Target>
            <Combobox.Dropdown>
              <Combobox.Options>
                <Combobox.Option value="all">All Countries ({totalMembers})</Combobox.Option>
                {countryOptions.map((opt) => (
                  <Combobox.Option key={opt.value} value={opt.value}>
                    {opt.label} ({opt.count})
                  </Combobox.Option>
                ))}
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
