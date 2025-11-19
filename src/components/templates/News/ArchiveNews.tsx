'use client'
import ButtonEara from '@/components/ui/ButtonEara/ButtonEara'
import NewsCard from '@/components/ui/NewsCard/NewsCard'
import { GetAllNewsDocument, GetAllNewsQuery } from '@/graphql/generated/graphql'
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
  useCombobox,
} from '@mantine/core'
import { IconCheck, IconChevronDown, IconRestore } from '@tabler/icons-react'
import { useCallback, useMemo, useState } from 'react'

// interface ArchiveNewsProps {
//   data: GetAllNewsQuery
// }
const PAGE_SIZE = 12
export default function ArchiveNews() {
  const [loadingMore, setLoadingMore] = useState(false)
  const { data, fetchMore } = useSuspenseQuery<GetAllNewsQuery>(GetAllNewsDocument, {
    variables: { first: PAGE_SIZE },
  })

  const [selectedCountry, setSelectedCountry] = useState<string | null>(null)
  const [selectedAnimal, setSelectedAnimal] = useState<string | null>(null)
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [selectedIsEaraMember, setSelectedIsEaraMember] = useState<boolean | null>(null)

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
    if (selectedCountry) {
      filtered = filtered.filter((newsItem) =>
        newsItem?.acfNews?.country?.includes(selectedCountry)
      )
    }
    if (selectedAnimal) {
      filtered = filtered.filter((newsItem) =>
        newsItem?.acfNews?.animal?.nodes?.find((animal) => animal?.slug === selectedAnimal)
      )
    }

    if (selectedCategory) {
      filtered = filtered.filter((newsItem) =>
        newsItem?.categoriesNews?.nodes?.find((category) => category?.slug === selectedCategory)
      )
    }
    if (selectedIsEaraMember !== null) {
      filtered = filtered.filter(
        (newsItem) => newsItem?.acfNews?.earaMember === selectedIsEaraMember
      )
    }

    return filtered
  }, [data, selectedCountry, selectedAnimal, selectedIsEaraMember, selectedCategory])
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
  }

  const hasActiveFilters =
    selectedCategory !== null ||
    selectedCountry !== null ||
    selectedAnimal !== null ||
    selectedIsEaraMember !== null

  return (
    <>
      <Container size="xl" my={50}>
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
                {selectedCategory || 'News Category'}
              </ButtonEara>
            </Combobox.Target>
            <Combobox.Dropdown>
              <Combobox.Options>
                <Combobox.Option value="all">All Category</Combobox.Option>
                <Combobox.Option value="institutional">Institutional</Combobox.Option>
              </Combobox.Options>
            </Combobox.Dropdown>
          </Combobox>
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
                <Combobox.Option value="pig">Pig</Combobox.Option>
                <Combobox.Option value="dog">Dog</Combobox.Option>
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
            <p>No news available.</p>
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
