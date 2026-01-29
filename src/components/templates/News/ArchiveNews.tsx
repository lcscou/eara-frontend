'use client'
import ButtonEara from '@/components/ui/ButtonEara/ButtonEara'
import NewsCard from '@/components/ui/NewsCard/NewsCard'
import ResultNotFound from '@/components/ui/ResultNotFound/ResultNotFound'
import {
  GetAllCategoriesNewsDocument,
  GetAllCategoriesNewsQuery,
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
import { useCallback, useMemo, useState } from 'react'

// interface ArchiveNewsProps {
//   data: GetAllNewsQuery
// }
const PAGE_SIZE = 12
export default function ArchiveNews() {
  const [loadingMore, setLoadingMore] = useState(false)
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null)
  const [selectedAnimal, setSelectedAnimal] = useState<string | null>(null)
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [selectedIsEaraMember, setSelectedIsEaraMember] = useState<boolean | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [debouncedSearch] = useDebouncedValue(searchQuery, 300)

  const { data, fetchMore } = useSuspenseQuery<GetAllNewsQuery>(GetAllNewsDocument, {
    variables: { first: PAGE_SIZE, category: selectedCategory, country: selectedCountry },
  })

  // Fetch categories using dedicated query
  const { data: categoriesData } = useSuspenseQuery<GetAllCategoriesNewsQuery>(
    GetAllCategoriesNewsDocument
  )

  // Extract categories from query
  const categories = useMemo(() => categoriesData?.categoriesNews?.nodes ?? [], [categoriesData])

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

    if (selectedAnimal) {
      filtered = filtered.filter((newsItem) =>
        newsItem?.acfNews?.animal?.nodes?.find((animal) => animal?.slug === selectedAnimal)
      )
    }

    if (selectedIsEaraMember !== null) {
      filtered = filtered.filter(
        (newsItem) => newsItem?.acfNews?.earaMember === selectedIsEaraMember
      )
    }

    return filtered
  }, [data, selectedAnimal, selectedIsEaraMember, debouncedSearch])
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
              store={categoryCombobox}
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
                <Combobox.Options>
                  <Combobox.Option value="all">All Categories</Combobox.Option>
                  {categories.map((category) => (
                    <Combobox.Option key={category?.slug} value={category?.slug || ''}>
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
              store={countryCombobox}
              width="fit-content"
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
                  <Combobox.Option value="all">All Countries</Combobox.Option>
                  <Combobox.Option value="portugal">Portugal</Combobox.Option>
                  <Combobox.Option value="germany">Germany</Combobox.Option>
                  {/* <Combobox.Option value="united-kingdom">United Kingdom</Combobox.Option>
                <Combobox.Option value="belgium">Belgium</Combobox.Option> */}
                </Combobox.Options>
              </Combobox.Dropdown>
            </Combobox>
            <Combobox
              onOptionSubmit={(value) => {
                setSelectedAnimal(value === 'all' ? null : value)
                animalCombobox.closeDropdown()
              }}
              store={animalCombobox}
            >
              <Combobox.Target>
                <ButtonEara
                  size="md"
                  onClick={() => animalCombobox.toggleDropdown()}
                  rightSection={<IconChevronDown size={14} />}
                >
                  {selectedAnimal || 'Animal'}
                </ButtonEara>
              </Combobox.Target>
              <Combobox.Dropdown>
                <Combobox.Options>
                  <Combobox.Option value="all">All Animals</Combobox.Option>
                  <Combobox.Option value="mice">Mice</Combobox.Option>
                  <Combobox.Option value="pigs">Pigs</Combobox.Option>
                  <Combobox.Option value="rats">Rats</Combobox.Option>
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
              // rightSection={
              //   searchQuery ? (
              //     <IconX
              //       size={18}
              //       style={{ cursor: 'pointer' }}
              //       onClick={() => setSearchQuery('')}
              //     />
              //   ) : null
              // }
              styles={{
                input: {
                  background: '#fff',
                  borderColor: '#fff',
                },
              }}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.currentTarget.value)}
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
        </div>
      </Container>
      <Container mb={50}>
        <Stack>
          {filteredNews && filteredNews.length > 0 ? (
            filteredNews.map((newsItem) => (
              <NewsCard
                key={newsItem.id}
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
      </Container>

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
