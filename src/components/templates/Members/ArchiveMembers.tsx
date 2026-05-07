'use client'
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
import { useCallback, useMemo, useState } from 'react'

import ButtonEara from '@/components/ui/ButtonEara/ButtonEara'
import MembersCard from '@/components/ui/MembersCard/MembersCard'
import ResultNotFound from '@/components/ui/ResultNotFound/ResultNotFound'
import {
  GetAllCountriesInMembersDocument,
  GetAllMembersDocument,
} from '@/graphql/generated/graphql'

const PAGE_SIZE = 16

export default function ArchiveMembers() {
  const apolloClient = useApolloClient()
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [loadingMore, setLoadingMore] = useState(false)
  const [debouncedSearch] = useDebouncedValue(searchQuery, 300)

  // Keep selected country valid against current options without effect-driven state sync.
  const isCountryValueValid = useCallback(
    (value: string | null, options: Array<{ value: string }>) =>
      Boolean(value && options.some((o) => o.value === value)),
    []
  )

  // Query para buscar países de todos os membros (sem paginação)
  const { data: countriesData } = useSuspenseQuery(GetAllCountriesInMembersDocument)

  // Query principal para buscar membros paginados
  const effectiveSelectedCountry = isCountryValueValid(
    selectedCountry,
    (countriesData?.getAllCountriesInMembers ?? [])
      .filter((country): country is { value: string } => Boolean(country?.value))
      .map((country) => ({ value: country.value }))
  )
    ? selectedCountry
    : null

  const { data, networkStatus } = useSuspenseQuery(GetAllMembersDocument, {
    variables: {
      first: PAGE_SIZE,
      country: effectiveSelectedCountry ?? undefined,
      search: debouncedSearch.trim() || undefined,
    },
  })

  const isUpdatingFilters = networkStatus === NetworkStatus.setVariables

  const [countrySearch, setCountrySearch] = useState('')
  const countryCombobox = useCombobox({
    onDropdownClose: () => {
      countryCombobox.resetSelectedOption()
      setCountrySearch('')
    },
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

  const filterKey = `${effectiveSelectedCountry ?? ''}::${debouncedSearch.trim()}`
  const [extraMembersByFilter, setExtraMembersByFilter] = useState<
    Record<string, NonNullable<(typeof allMembers)[number]>[]>
  >({})
  const [nextPageByFilter, setNextPageByFilter] = useState<
    Record<string, { hasNextPage: boolean; endCursor: string | null }>
  >({})

  const extraMembers = useMemo(
    () => extraMembersByFilter[filterKey] ?? [],
    [extraMembersByFilter, filterKey]
  )
  const nextPageState = nextPageByFilter[filterKey] ?? null

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
            country: effectiveSelectedCountry ?? undefined,
            search: debouncedSearch.trim() || undefined,
          },
        })

        const incomingNodes = (result.data?.members?.nodes ?? []).filter(
          (member): member is NonNullable<(typeof allMembers)[number]> => Boolean(member)
        )

        setExtraMembersByFilter((prevByFilter) => {
          const currentExtra = prevByFilter[filterKey] ?? []
          const seen = new Set(
            [...baseMembers, ...currentExtra].map((member) => member.id).filter(Boolean)
          )
          const next = incomingNodes.filter((member) => (member.id ? !seen.has(member.id) : true))
          if (next.length === 0) return prevByFilter

          return {
            ...prevByFilter,
            [filterKey]: [...currentExtra, ...next],
          }
        })

        setNextPageByFilter((prevByFilter) => ({
          ...prevByFilter,
          [filterKey]: {
            hasNextPage: Boolean(result.data?.members?.pageInfo?.hasNextPage),
            endCursor: result.data?.members?.pageInfo?.endCursor ?? null,
          },
        }))
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
    effectiveSelectedCountry,
    debouncedSearch,
    baseMembers,
    filterKey,
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

  const filteredCountryOptions = useMemo(() => {
    const normalizedSearch = countrySearch.trim().toLowerCase()
    if (!normalizedSearch) return countryOptions

    return countryOptions.filter((opt) => opt.label.toLowerCase().includes(normalizedSearch))
  }, [countryOptions, countrySearch])

  const selectedLabel = selectedCountry
    ? countryOptions.find((o) => o.value === selectedCountry)?.label || 'Country'
    : 'All Countries'

  const hasActiveFilters = effectiveSelectedCountry !== null || searchQuery.trim() !== ''

  const handleResetFilters = () => {
    setSelectedCountry(null)
    setSearchQuery('')
  }

  const handleCountryClick = useCallback((country: string) => {
    if (!country) return
    setSelectedCountry(country)
  }, [])

  return (
    <>
      <Container size="xl" my={100}>
        {/* <MembersMap height="fit-content" /> */}
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
            store={countryCombobox}
            onOptionSubmit={(value) => {
              setSelectedCountry(value === 'all' ? null : value)
              countryCombobox.closeDropdown()
            }}
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
              <Combobox.Search
                value={countrySearch}
                onChange={(event) => setCountrySearch(event.currentTarget.value)}
                placeholder="Search country..."
              />
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
                {filteredCountryOptions.length === 0 ? (
                  <Combobox.Empty>No countries found</Combobox.Empty>
                ) : (
                  filteredCountryOptions.map((opt) => (
                    <Combobox.Option key={opt.value} value={opt.value}>
                      {opt.label} ({opt.count})
                    </Combobox.Option>
                  ))
                )}
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
              <div key={member?.slug} className="h-full">
                <MembersCard
                  title={member.title}
                  featuredImage={member.featuredImage?.node?.guid}
                  uri={member.acfMembers?.website}
                  country={member.acfMembers?.country?.join(', ')}
                  countries={(member.acfMembers?.country ?? []).filter((item): item is string =>
                    Boolean(item?.trim())
                  )}
                  onCountryClick={handleCountryClick}
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
