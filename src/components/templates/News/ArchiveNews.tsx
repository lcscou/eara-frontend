'use client'
import ButtonEara from '@/components/ui/ButtonEara/ButtonEara'
import NewsCard from '@/components/ui/NewsCard/NewsCard'
import ResultNotFound from '@/components/ui/ResultNotFound/ResultNotFound'
import {
  GetAllAnimalsDocument,
  GetAllAnimalsQuery,
  GetAllCategoriesNewsDocument,
  GetAllCategoriesNewsQuery,
  GetAllCountryInNewsDocument,
  GetAllCountryInNewsQuery,
  GetAllNewsDocument,
  GetAllNewsQuery,
} from '@/graphql/generated/graphql'
import { cleanHTMLTAG } from '@/lib/utils'
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
import { useCallback, useEffect, useMemo, useState } from 'react'

// interface ArchiveNewsProps {
//   data: GetAllNewsQuery
// }
const PAGE_SIZE = 12
export default function ArchiveNews() {
  const [loadingMore, setLoadingMore] = useState(false)
  const [isFiltering, setIsFiltering] = useState(false)
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null)
  const [selectedAnimal, setSelectedAnimal] = useState<string | null>(null)
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [selectedIsEaraMember, setSelectedIsEaraMember] = useState<boolean | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [debouncedSearch] = useDebouncedValue(searchQuery, 300)

  const { data, fetchMore } = useSuspenseQuery<GetAllNewsQuery>(GetAllNewsDocument, {
    variables: {
      first: PAGE_SIZE,
      category: selectedCategory,
      country: selectedCountry,
      animal: selectedAnimal,
    },
  })

  // Fetch categories using dedicated query
  const { data: categoriesData } = useSuspenseQuery<GetAllCategoriesNewsQuery>(
    GetAllCategoriesNewsDocument
  )

  // Fetch animals using dedicated query
  const { data: animalsData } = useSuspenseQuery<GetAllAnimalsQuery>(GetAllAnimalsDocument, {
    variables: { first: 100 },
  })

  // Fetch countries using dedicated query
  const { data: countriesData } = useSuspenseQuery<GetAllCountryInNewsQuery>(
    GetAllCountryInNewsDocument
  )

  // Extract categories from query
  const categories = useMemo(() => categoriesData?.categoriesNews?.nodes ?? [], [categoriesData])

  // Extract animals from query
  const animals = useMemo(() => animalsData?.animals?.nodes ?? [], [animalsData])

  // Extract countries from query
  const countries = useMemo(() => countriesData?.newsCountries ?? [], [countriesData])

  // Effect to handle filter changes and show loading state
  useEffect(() => {
    setIsFiltering(true)
    const timeout = setTimeout(() => {
      setIsFiltering(false)
    }, 500) // Show loader for at least 500ms

    return () => clearTimeout(timeout)
  }, [selectedCategory, selectedCountry, selectedAnimal, selectedIsEaraMember, debouncedSearch])

  const countryCombobox = useCombobox({
    onDropdownClose: () => countryCombobox.resetSelectedOption(),
  })

  const categoryCombobox = useCombobox({
    onDropdownClose: () => categoryCombobox.resetSelectedOption(),
  })

  const animalCombobox = useCombobox({
    onDropdownClose: () => animalCombobox.resetSelectedOption(),
  })

  const hasNextPage = data?.allNews?.pageInfo?.hasNextPage
  const endCursor = data?.allNews?.pageInfo?.endCursor

  const filteredNews = useMemo(() => {
    let filtered = data?.allNews?.nodes ?? []

    // Apply search filter
    if (debouncedSearch.trim()) {
      const searchLower = debouncedSearch.toLowerCase().trim()
      filtered = filtered.filter((newsItem) => {
        const title = newsItem?.title?.toLowerCase() || ''
        const content = cleanHTMLTAG(newsItem?.content || '').toLowerCase()
        // const excerpt = newsItem?.excerpt?.toLowerCase() || ''
        const author =
          `${newsItem?.author?.node.firstName} ${newsItem?.author?.node.lastName}`.toLowerCase()

        return (
          title.includes(searchLower) ||
          content.includes(searchLower) ||
          // excerpt.includes(searchLower) ||
          author.includes(searchLower)
        )
      })
    }

    if (selectedIsEaraMember !== null) {
      filtered = filtered.filter(
        (newsItem) => newsItem?.acfNews?.earaMember === selectedIsEaraMember
      )
    }

    return filtered
  }, [data, selectedIsEaraMember, debouncedSearch])
  const handleLoadMore = useCallback(() => {
    if (!hasNextPage || loadingMore) return
    setLoadingMore(true)
    setTimeout(async () => {
      try {
        await fetchMore({
          variables: { first: PAGE_SIZE, after: endCursor },
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
  }, [hasNextPage, loadingMore, endCursor, fetchMore])

  const handleResetFilters = () => {
    setSelectedCategory(null)
    setSelectedCountry(null)
    countryCombobox.resetSelectedOption()
    setSelectedAnimal(null)
    animalCombobox.resetSelectedOption()
    categoryCombobox.resetSelectedOption()
    setSelectedIsEaraMember(null)
    setSearchQuery('')
  }

  const hasActiveFilters =
    selectedCategory !== null ||
    selectedCountry !== null ||
    selectedAnimal !== null ||
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
                  {animals.find((animal) => animal?.databaseId?.toString() === selectedAnimal)
                    ?.title || 'Animal'}
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
                      key={animal?.databaseId}
                      value={animal?.databaseId?.toString() || ''}
                      className="overflow-hidden text-ellipsis whitespace-nowrap"
                    >
                      {animal?.title}
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
                  author={`${newsItem.author?.node.firstName} ${newsItem.author?.node.lastName}`}
                  excerpt={cleanHTMLTAG(newsItem.content || '').substring(0, 100) + '...'}
                  featuredImage={newsItem.featuredImage?.node.guid || '/eara-fallback.jpg'}
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

      {hasNextPage && !hasActiveFilters && (
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
