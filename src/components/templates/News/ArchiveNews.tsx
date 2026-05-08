'use client'
import { useSuspenseQuery } from '@apollo/client/react'
import {
  Button,
  Combobox,
  Container,
  Group,
  Loader,
  Skeleton,
  Stack,
  TextInput,
  useCombobox,
} from '@mantine/core'
import { useDebouncedValue } from '@mantine/hooks'
import { IconCheck, IconChevronDown, IconRestore, IconSearch } from '@tabler/icons-react'
import { useCallback, useMemo, useState } from 'react'

import ButtonEara from '@/components/ui/ButtonEara/ButtonEara'
import NewsCard from '@/components/ui/NewsCard/NewsCard'
import ResultNotFound from '@/components/ui/ResultNotFound/ResultNotFound'
import {
  GetAllAnimalsNewsDocument,
  GetAllAnimalsNewsQuery,
  GetAllCategoriesNewsDocument,
  GetAllCategoriesNewsQuery,
  GetAllCountryInNewsDocument,
  GetAllCountryInNewsQuery,
  GetAllNewsDocument,
  GetAllNewsQuery,
  GetAllResearchAreasNewsDocument,
  GetAllResearchAreasNewsQuery,
} from '@/graphql/generated/graphql'
import { cleanHTMLTAG } from '@/lib/utils'

// interface ArchiveNewsProps {
//   data: GetAllNewsQuery
// }
const PAGE_SIZE = 12
type NewsNode = NonNullable<NonNullable<GetAllNewsQuery['allNews']>['nodes'][number]>

export default function ArchiveNews() {
  const [loadingMore, setLoadingMore] = useState(false)
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null)
  const [selectedAnimal, setSelectedAnimal] = useState<string | null>(null)
  const [selectedResearchArea, setSelectedResearchArea] = useState<string | null>(null)
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [selectedIsEaraMember, setSelectedIsEaraMember] = useState<boolean | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [debouncedSearch] = useDebouncedValue(searchQuery, 300)
  const filterTransitionKey = `${selectedCategory ?? ''}|${selectedCountry ?? ''}|${selectedAnimal ?? ''}|${selectedResearchArea ?? ''}|${selectedIsEaraMember ?? ''}|${debouncedSearch.trim()}`
  const [debouncedFilterTransitionKey] = useDebouncedValue(filterTransitionKey, 500)
  const isFiltering = debouncedFilterTransitionKey !== filterTransitionKey

  const { data, fetchMore } = useSuspenseQuery<GetAllNewsQuery>(GetAllNewsDocument, {
    variables: {
      first: PAGE_SIZE,
      search: debouncedSearch.trim() || undefined,
      category: selectedCategory,
      country: selectedCountry,
      animalNews: selectedAnimal,
      researchAreasNews: selectedResearchArea,
    },
    fetchPolicy: 'cache-and-network',
    context: {
      fetchOptions: {
        next: {
          revalidate: 3600,
          tags: ['news'],
        },
      },
    },
  })

  // Fetch categories using dedicated query
  const { data: categoriesData } = useSuspenseQuery<GetAllCategoriesNewsQuery>(
    GetAllCategoriesNewsDocument,
    {
      fetchPolicy: 'cache-and-network',
      context: {
        fetchOptions: {
          next: {
            revalidate: 3600,
            tags: ['news'],
          },
        },
      },
    }
  )

  // Fetch animalsNews taxonomy using dedicated query
  const { data: animalsData } = useSuspenseQuery<GetAllAnimalsNewsQuery>(
    GetAllAnimalsNewsDocument,
    {
      fetchPolicy: 'cache-and-network',
      context: {
        fetchOptions: {
          next: {
            revalidate: 3600,
            tags: ['news'],
          },
        },
      },
    }
  )

  // Fetch researchAreaNews taxonomy using dedicated query
  const { data: researchAreasData } = useSuspenseQuery<GetAllResearchAreasNewsQuery>(
    GetAllResearchAreasNewsDocument,
    {
      fetchPolicy: 'cache-and-network',
      context: {
        fetchOptions: {
          next: {
            revalidate: 3600,
            tags: ['news'],
          },
        },
      },
    }
  )

  // Fetch countries using dedicated query
  const { data: countriesData } = useSuspenseQuery<GetAllCountryInNewsQuery>(
    GetAllCountryInNewsDocument,
    {
      fetchPolicy: 'cache-and-network',
      context: {
        fetchOptions: {
          next: {
            revalidate: 3600,
            tags: ['news'],
          },
        },
      },
    }
  )

  // Extract categories from query
  const categories = useMemo(() => categoriesData?.categoriesNews?.nodes ?? [], [categoriesData])

  // Extract animalsNews taxonomy from query
  const animals = useMemo(() => animalsData?.animalsNews?.nodes ?? [], [animalsData])

  // Extract researchAreaNews taxonomy from query
  const researchAreas = useMemo(
    () => researchAreasData?.researchAreaNews?.nodes ?? [],
    [researchAreasData]
  )

  // Extract countries from query
  const countries = useMemo(() => countriesData?.newsCountries ?? [], [countriesData])

  const countryCombobox = useCombobox({
    onDropdownClose: () => countryCombobox.resetSelectedOption(),
  })

  const categoryCombobox = useCombobox({
    onDropdownClose: () => categoryCombobox.resetSelectedOption(),
  })

  const animalCombobox = useCombobox({
    onDropdownClose: () => animalCombobox.resetSelectedOption(),
  })

  const researchAreaCombobox = useCombobox({
    onDropdownClose: () => researchAreaCombobox.resetSelectedOption(),
  })

  const hasNextPage = data?.allNews?.pageInfo?.hasNextPage
  const endCursor = data?.allNews?.pageInfo?.endCursor

  const filteredNews = useMemo(() => {
    let filtered = (data?.allNews?.nodes ?? []).filter((newsItem): newsItem is NewsNode =>
      Boolean(newsItem)
    )

    if (selectedIsEaraMember !== null) {
      filtered = filtered.filter(
        (newsItem) => newsItem?.acfNews?.earaMember === selectedIsEaraMember
      )
    }

    return filtered
  }, [data, selectedIsEaraMember])
  const handleLoadMore = useCallback(() => {
    if (!hasNextPage || loadingMore) return
    setLoadingMore(true)
    setTimeout(async () => {
      try {
        await fetchMore({
          variables: {
            first: PAGE_SIZE,
            after: endCursor,
            search: debouncedSearch.trim() || undefined,
            category: selectedCategory,
            country: selectedCountry,
            animalNews: selectedAnimal,
            researchAreasNews: selectedResearchArea,
          },
          updateQuery: (
            prev: GetAllNewsQuery,
            { fetchMoreResult }: { fetchMoreResult?: GetAllNewsQuery }
          ) => {
            if (!fetchMoreResult?.allNews?.nodes) return prev
            return {
              ...prev,
              allNews: {
                ...fetchMoreResult.allNews,
                pageInfo: fetchMoreResult.allNews.pageInfo,
                nodes: [...(prev?.allNews?.nodes ?? []), ...(fetchMoreResult.allNews.nodes ?? [])],
              },
            }
          },
        })
      } finally {
        setLoadingMore(false)
      }
    }, 0)
  }, [
    hasNextPage,
    loadingMore,
    endCursor,
    fetchMore,
    debouncedSearch,
    selectedCategory,
    selectedCountry,
    selectedAnimal,
    selectedResearchArea,
  ])

  const handleResetFilters = () => {
    setSelectedCategory(null)
    setSelectedCountry(null)
    countryCombobox.resetSelectedOption()
    setSelectedAnimal(null)
    animalCombobox.resetSelectedOption()
    setSelectedResearchArea(null)
    researchAreaCombobox.resetSelectedOption()
    categoryCombobox.resetSelectedOption()
    setSelectedIsEaraMember(null)
    setSearchQuery('')
  }

  const hasActiveFilters =
    selectedCategory !== null ||
    selectedCountry !== null ||
    selectedAnimal !== null ||
    selectedResearchArea !== null ||
    selectedIsEaraMember !== null ||
    searchQuery.trim() !== ''

  return (
    <>
      <Container size="xl" my={50}>
        <div className="flex flex-col gap-4">
          <Group gap={5}>
            <Combobox
              onOptionSubmit={(value) => {
                setSelectedCategory(value === 'all' ? null : value)
                categoryCombobox.closeDropdown()
              }}
              styles={{
                dropdown: {
                  minWidth: 'fit-content',
                  whiteSpace: 'nowrap',
                },
              }}
              store={categoryCombobox}
              disabled={isFiltering}
            >
              <Combobox.Target>
                <ButtonEara
                  size="md"
                  onClick={() => categoryCombobox.toggleDropdown()}
                  rightSection={<IconChevronDown size={14} />}
                >
                  {categories.find((cat) => cat?.slug === selectedCategory)?.name ||
                    'News Category'}
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
                  <Combobox.Option value="all">All Categories</Combobox.Option>
                  {categories.map((category) => (
                    <Combobox.Option
                      key={category?.slug}
                      value={category?.slug || ''}
                      className="overflow-hidden text-ellipsis whitespace-nowrap"
                    >
                      {category?.name}
                    </Combobox.Option>
                  ))}
                </Combobox.Options>
              </Combobox.Dropdown>
            </Combobox>
            <Combobox
              onOptionSubmit={(value) => {
                setSelectedCountry(value === 'all' ? null : value)
                countryCombobox.closeDropdown()
              }}
              styles={{
                dropdown: {
                  minWidth: 'fit-content',
                  whiteSpace: 'nowrap',
                },
              }}
              store={countryCombobox}
              width="fit-content"
              disabled={isFiltering}
            >
              <Combobox.Target>
                <ButtonEara
                  size="md"
                  onClick={() => countryCombobox.toggleDropdown()}
                  rightSection={<IconChevronDown size={14} />}
                  label={''}
                >
                  {countries.find((country) => country?.value === selectedCountry)?.label ||
                    'Country'}
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
                  <Combobox.Option value="all">All Countries</Combobox.Option>
                  {countries.map((country) => (
                    <Combobox.Option
                      key={country?.value}
                      value={country?.value || ''}
                      className="overflow-hidden text-ellipsis whitespace-nowrap"
                    >
                      {country?.label}
                    </Combobox.Option>
                  ))}
                </Combobox.Options>
              </Combobox.Dropdown>
            </Combobox>
            <Combobox
              onOptionSubmit={(value) => {
                setSelectedAnimal(value === 'all' ? null : value)
                animalCombobox.closeDropdown()
              }}
              styles={{
                dropdown: {
                  minWidth: 'fit-content',
                  whiteSpace: 'nowrap',
                },
              }}
              store={animalCombobox}
              disabled={isFiltering}
            >
              <Combobox.Target>
                <ButtonEara
                  size="md"
                  onClick={() => animalCombobox.toggleDropdown()}
                  rightSection={<IconChevronDown size={14} />}
                >
                  {animals.find((animal) => animal?.slug === selectedAnimal)?.name || 'Animal'}
                </ButtonEara>
              </Combobox.Target>
              <Combobox.Dropdown>
                <Combobox.Options
                  styles={{
                    options: {
                      maxHeight: 300,
                      overflowY: 'auto',
                    },
                  }}
                >
                  <Combobox.Option value="all">All Animals</Combobox.Option>
                  {animals.map((animal) => (
                    <Combobox.Option
                      key={animal?.slug}
                      value={animal?.slug || ''}
                      className="overflow-hidden text-ellipsis whitespace-nowrap"
                    >
                      {animal?.name}
                    </Combobox.Option>
                  ))}
                </Combobox.Options>
              </Combobox.Dropdown>
            </Combobox>
            <Combobox
              onOptionSubmit={(value) => {
                setSelectedResearchArea(value === 'all' ? null : value)
                researchAreaCombobox.closeDropdown()
              }}
              styles={{
                dropdown: {
                  minWidth: 'fit-content',
                  whiteSpace: 'nowrap',
                },
              }}
              store={researchAreaCombobox}
              disabled={isFiltering}
            >
              <Combobox.Target>
                <ButtonEara
                  size="md"
                  onClick={() => researchAreaCombobox.toggleDropdown()}
                  rightSection={<IconChevronDown size={14} />}
                >
                  {researchAreas.find((ra) => ra?.slug === selectedResearchArea)?.name ||
                    'Research Area'}
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
                  <Combobox.Option value="all">All Research Areas</Combobox.Option>
                  {researchAreas.map((ra) => (
                    <Combobox.Option
                      key={ra?.slug}
                      value={ra?.slug || ''}
                      className="overflow-hidden text-ellipsis whitespace-nowrap"
                    >
                      {ra?.name}
                    </Combobox.Option>
                  ))}
                </Combobox.Options>
              </Combobox.Dropdown>
            </Combobox>

            <Button
              size="md"
              leftSection={selectedIsEaraMember ? <IconCheck size={18} /> : null}
              fw={500}
              tt="uppercase"
              fz={13}
              onClick={() => setSelectedIsEaraMember((prev) => (prev === true ? null : true))}
              variant={selectedIsEaraMember ? 'light' : 'outline'}
              disabled={isFiltering}
            >
              Eara Member
            </Button>
            <TextInput
              size="md"
              placeholder="Search..."
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
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.currentTarget.value)}
              radius="80px"
              disabled={isFiltering}
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
        </div>
      </Container>
      <Container mb={50}>
        <div className="relative">
          <Stack>
            {isFiltering ? (
              <div className="space-y-4">
                {Array.from({ length: PAGE_SIZE }).map((_, i) => (
                  <div key={i} className="flex gap-4">
                    <Skeleton height={150} width={150} radius="md" />
                    <div className="flex-1 space-y-2">
                      <Skeleton height={20} width="80%" radius="sm" />
                      <Skeleton height={16} width="60%" radius="sm" />
                      <Skeleton height={16} width="40%" radius="sm" />
                    </div>
                  </div>
                ))}
              </div>
            ) : filteredNews && filteredNews.length > 0 ? (
              filteredNews.map((newsItem) => (
                <NewsCard
                  key={newsItem.id}
                  date={newsItem.date || ''}
                  title={newsItem.title || 'No Title'}
                  timeReading={newsItem.seo?.readingTime}
                  author={[newsItem.author?.node?.firstName, newsItem.author?.node?.lastName]
                    .filter(Boolean)
                    .join(' ')}
                  excerpt={cleanHTMLTAG(newsItem.content || '').substring(0, 100) + '...'}
                  featuredImage={newsItem.featuredImage?.node?.guid || '/eara-fallback.png'}
                  link={`/news/${newsItem.slug}`}
                />
              ))
            ) : (
              <ResultNotFound resetFilters={handleResetFilters} />
            )}
          </Stack>
          {isFiltering && (
            <div className="absolute inset-0 flex items-center justify-center rounded-lg bg-white/50">
              <Loader size="lg" />
            </div>
          )}
        </div>
      </Container>

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
