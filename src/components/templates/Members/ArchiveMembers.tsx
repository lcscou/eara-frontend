'use client'
import ButtonEara from '@/components/ui/ButtonEara/ButtonEara'
import MembersCard from '@/components/ui/MembersCard/MembersCard'
import MembersMap from '@/components/ui/MembersMap/MembersMap'
import ResultNotFound from '@/components/ui/ResultNotFound/ResultNotFound'
import {
  GetAllCountriesInMembersDocument,
  GetAllMembersDocument,
  GetAllMembersQuery,
} from '@/graphql/generated/graphql'
import { useSuspenseQuery } from '@apollo/client/react'
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
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [loadingMore, setLoadingMore] = useState(false)
  const [debouncedSearch] = useDebouncedValue(searchQuery, 300)

  // Query para buscar países de todos os membros (sem paginação)
  const { data: countriesData } = useSuspenseQuery(GetAllCountriesInMembersDocument)

  // Query principal para buscar membros paginados
  const { data, fetchMore } = useSuspenseQuery(GetAllMembersDocument, {
    variables: {
      first: PAGE_SIZE,
      country: selectedCountry ?? undefined,
      search: debouncedSearch.trim() || undefined,
    },
  })

  const hasNextPage = data?.members?.pageInfo?.hasNextPage
  const endCursor = data?.members?.pageInfo?.endCursor

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

  const handleLoadMore = useCallback(() => {
    if (!hasNextPage || loadingMore) return
    setLoadingMore(true)
    setTimeout(async () => {
      try {
        await fetchMore({
          variables: {
            first: PAGE_SIZE,
            after: endCursor,
            country: selectedCountry ?? undefined,
            search: debouncedSearch.trim() || undefined,
          },
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
  }, [hasNextPage, loadingMore, endCursor, fetchMore, selectedCountry, debouncedSearch])

  const filteredMembers = allMembers

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
        </>
      </Container>
    </>
  )
}
