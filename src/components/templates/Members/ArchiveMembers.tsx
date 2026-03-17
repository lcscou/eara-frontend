'use client'
import ButtonEara from '@/components/ui/ButtonEara/ButtonEara'
import MembersCard from '@/components/ui/MembersCard/MembersCard'
import MembersMap from '@/components/ui/MembersMap/MembersMap'
import ResultNotFound from '@/components/ui/ResultNotFound/ResultNotFound'
import {
  GetAllCountriesInMembersDocument,
  GetAllMembersDocument,
} from '@/graphql/generated/graphql'
import { NetworkStatus } from '@apollo/client'
import { useApolloClient, useSuspenseQuery } from '@apollo/client/react'
import {
  Autocomplete,
  Button,
  Combobox,
  Container,
  Group,
  Loader,
  useCombobox,
} from '@mantine/core'
import { useDebouncedValue } from '@mantine/hooks'
import { IconChevronDown, IconRestore, IconSearch } from '@tabler/icons-react'
import { useCallback, useEffect, useMemo, useState } from 'react'

const PAGE_SIZE = 12

export default function ArchiveMembers() {
  const apolloClient = useApolloClient()
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [loadingMore, setLoadingMore] = useState(false)
  const [debouncedSearch] = useDebouncedValue(searchQuery, 300)

  // Query para buscar países de todos os membros (sem paginação)
  const { data: countriesData } = useSuspenseQuery(GetAllCountriesInMembersDocument)

  // Query principal para buscar membros paginados
  const { data, networkStatus } = useSuspenseQuery(GetAllMembersDocument, {
    variables: {
      first: PAGE_SIZE,
      country: selectedCountry ?? undefined,
      search: debouncedSearch.trim() || undefined,
    },
  })

  const isUpdatingFilters = networkStatus === NetworkStatus.setVariables

  const countryCombobox = useCombobox({
    onDropdownClose: () => countryCombobox.resetSelectedOption(),
  })

  // Opcoes de pais vindas do backend ja com label/value/count
  const { countryOptions, totalMembers } = useMemo(() => {
    const options = (countriesData?.getAllCountriesInMembers ?? [])
      .filter(
        (country): country is { value: string; label: string; count: number } =>
          Boolean(country?.value && country?.label) && typeof country?.count === 'number'
      )
      .sort((a, b) => a.label.localeCompare(b.label))

    const membersCount = options.reduce((acc, country) => acc + country.count, 0)

    return { countryOptions: options, totalMembers: membersCount }
  }, [countriesData])

  const allMembers = useMemo(() => data?.members?.nodes ?? [], [data])
  const baseMembers = useMemo(
    () =>
      allMembers.filter((member): member is NonNullable<(typeof allMembers)[number]> =>
        Boolean(member)
      ),
    [allMembers]
  )

  const filterKey = `${selectedCountry ?? ''}::${debouncedSearch.trim()}`
  const [extraMembers, setExtraMembers] = useState<NonNullable<(typeof allMembers)[number]>[]>([])
  const [nextPageState, setNextPageState] = useState<{
    hasNextPage: boolean
    endCursor: string | null
  } | null>(null)

  useEffect(() => {
    setExtraMembers([])
    setNextPageState(null)
  }, [filterKey])

  const hasNextPage = nextPageState?.hasNextPage ?? Boolean(data?.members?.pageInfo?.hasNextPage)
  const endCursor = nextPageState?.endCursor ?? data?.members?.pageInfo?.endCursor ?? null

  const filteredMembers = useMemo(() => {
    const seen = new Set<string>()
    const merged = [...baseMembers, ...extraMembers]

    return merged.filter((member) => {
      if (!member.id) return true
      if (seen.has(member.id)) return false
      seen.add(member.id)
      return true
    })
  }, [baseMembers, extraMembers])

  const handleLoadMore = useCallback(() => {
    if (!hasNextPage || loadingMore || isUpdatingFilters || !endCursor) return
    setLoadingMore(true)
    ;(async () => {
      try {
        const result = await apolloClient.query({
          query: GetAllMembersDocument,
          fetchPolicy: 'network-only',
          variables: {
            first: PAGE_SIZE,
            after: endCursor,
            country: selectedCountry ?? undefined,
            search: debouncedSearch.trim() || undefined,
          },
        })

        const incomingNodes = (result.data?.members?.nodes ?? []).filter(
          (member): member is NonNullable<(typeof allMembers)[number]> => Boolean(member)
        )

        setExtraMembers((prev) => {
          const seen = new Set([...baseMembers, ...prev].map((member) => member.id).filter(Boolean))
          const next = incomingNodes.filter((member) => (member.id ? !seen.has(member.id) : true))
          return next.length > 0 ? [...prev, ...next] : prev
        })

        setNextPageState({
          hasNextPage: Boolean(result.data?.members?.pageInfo?.hasNextPage),
          endCursor: result.data?.members?.pageInfo?.endCursor ?? null,
        })
      } finally {
        setLoadingMore(false)
      }
    })()
  }, [
    hasNextPage,
    loadingMore,
    isUpdatingFilters,
    endCursor,
    apolloClient,
    selectedCountry,
    debouncedSearch,
    baseMembers,
  ])

  const memberTitleOptions = useMemo(() => {
    const seen = new Set<string>()

    return allMembers
      .map((member) => member?.title?.trim())
      .filter((title): title is string => Boolean(title))
      .filter((title) => {
        if (seen.has(title)) return false
        seen.add(title)
        return true
      })
      .sort((a, b) => a.localeCompare(b))
  }, [allMembers])

  useEffect(() => {
    if (selectedCountry && !countryOptions.some((o) => o.value === selectedCountry)) {
      setSelectedCountry(null)
    }
  }, [selectedCountry, countryOptions])

  const selectedLabel = selectedCountry
    ? countryOptions.find((o) => o.value === selectedCountry)?.label || 'Country'
    : 'Country'

  const hasActiveFilters = selectedCountry !== null || searchQuery.trim() !== ''

  const handleResetFilters = () => {
    setSelectedCountry(null)
    setSearchQuery('')
    countryCombobox.resetSelectedOption()
  }

  return (
    <>
      <Container size="xl" my={100}>
        <MembersMap height="fit-content" />
        <Group my={40} gap={5} justify="">
          {/* <SegmentedControl
            radius="xl"
            size="md"
            value={viewMode}
            onChange={(value) => setViewMode(value as 'list' | 'map')}
            data={[
              {
                label: (
                  <Group gap="xs" wrap="nowrap">
                    <IconList size={16} />
                    <span>List</span>
                  </Group>
                ),
                value: 'list',
              },
              {
                label: (
                  <Group gap="xs" wrap="nowrap">
                    <IconMap size={16} />
                    <span>Map</span>
                  </Group>
                ),
                value: 'map',
              },
            ]}
          /> */}

          <Combobox
            styles={{
              dropdown: {
                minWidth: 'fit-content',
                whiteSpace: 'nowrap',
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
              <Combobox.Options
                styles={{
                  options: {
                    maxHeight: 300,
                    overflowY: 'auto',
                    whiteSpace: 'nowrap',
                  },
                }}
              >
                <Combobox.Option value="all">All Countries ({totalMembers})</Combobox.Option>
                {countryOptions.map((opt) => (
                  <Combobox.Option key={opt.value} value={opt.value}>
                    {opt.label} ({opt.count})
                  </Combobox.Option>
                ))}
              </Combobox.Options>
            </Combobox.Dropdown>
          </Combobox>

          <Autocomplete
            size="md"
            placeholder="Search..."
            data={memberTitleOptions}
            value={searchQuery}
            onChange={setSearchQuery}
            rightSection={
              <IconSearch
                className="bg-secondaryColor m-0 rounded-full p-2.5 text-[#312F86]"
                size={40}
              />
            }
            styles={{
              input: {
                background: '#fff',
                borderColor: '#fff',
              },
            }}
            radius="80px"
          />

          {hasActiveFilters && (
            <Button
              size="md"
              variant="subtle"
              leftSection={<IconRestore size={16} />}
              onClick={handleResetFilters}
            >
              Reset
            </Button>
          )}
        </Group>

        <>
          {filteredMembers?.length === 0 && (
            <ResultNotFound
              resetFilters={() => {
                handleResetFilters()
              }}
            />
          )}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
            {filteredMembers?.map((member) => (
              <div key={member?.slug}>
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
                disabled={loadingMore || isUpdatingFilters || !endCursor}
                leftSection={loadingMore ? <Loader size="sm" color="white" /> : null}
              />
            </Group>
          )}
        </>
      </Container>
    </>
  )
}
