'use client'
import ButtonEara from '@/components/ui/ButtonEara/ButtonEara'
import NewsCard from '@/components/ui/NewsCard/NewsCard'
import ResultNotFound from '@/components/ui/ResultNotFound/ResultNotFound'
import { GetAllPressReleaseDocument, GetAllPressReleaseQuery } from '@/graphql/generated/graphql'
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
import { IconChevronDown, IconRestore, IconSearch } from '@tabler/icons-react'
import { useCallback, useMemo, useState } from 'react'

const PAGE_SIZE = 12
export default function ArchivePressReleases() {
  const [loadingMore, setLoadingMore] = useState(false)
  const { data, fetchMore } = useSuspenseQuery<GetAllPressReleaseQuery>(
    GetAllPressReleaseDocument,
    {
      variables: { first: PAGE_SIZE },
    }
  )

  const [selectedType, setSelectedType] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [debouncedSearch] = useDebouncedValue(searchQuery, 300)

  const typeCombobox = useCombobox({
    onDropdownClose: () => typeCombobox.resetSelectedOption(),
  })

  const hasNextPage = data?.allPressRelease?.pageInfo?.hasNextPage
  const endCursor = data?.allPressRelease?.pageInfo?.endCursor

  const filteredPressReleases = useMemo(() => {
    let filtered = data?.allPressRelease?.nodes ?? []

    // Apply search filter
    if (debouncedSearch.trim()) {
      const searchLower = debouncedSearch.toLowerCase().trim()
      filtered = filtered.filter((item) => {
        const title = item?.title?.toLowerCase() || ''
        const content = cleanHTMLTAG(item?.content || '').toLowerCase()

        return title.includes(searchLower) || content.includes(searchLower)
      })
    }

    if (selectedType) {
      filtered = filtered.filter((item) =>
        item?.type?.nodes?.find((type) => type?.slug === selectedType)
      )
    }

    return filtered
  }, [data, selectedType, debouncedSearch])
  const handleLoadMore = useCallback(() => {
    if (!hasNextPage || loadingMore) return
    setLoadingMore(true)
    setTimeout(async () => {
      try {
        await fetchMore({
          variables: { first: PAGE_SIZE, after: endCursor },
          updateQuery: (
            prev: GetAllPressReleaseQuery,
            { fetchMoreResult }: { fetchMoreResult?: GetAllPressReleaseQuery }
          ) => {
            if (!fetchMoreResult?.allPressRelease?.nodes) return prev
            return {
              ...prev,
              allPressRelease: {
                ...fetchMoreResult.allPressRelease,
                pageInfo: fetchMoreResult.allPressRelease.pageInfo,
                nodes: [
                  ...(prev?.allPressRelease?.nodes ?? []),
                  ...(fetchMoreResult.allPressRelease.nodes ?? []),
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

  const handleResetFilters = () => {
    setSelectedType(null)
    typeCombobox.resetSelectedOption()
    setSearchQuery('')
  }

  const hasActiveFilters = selectedType !== null || searchQuery.trim() !== ''

  return (
    <>
      <Container size="xl" my={50}>
        <div className="flex flex-col gap-4">
          <Group gap={5}>
            <Combobox
              onOptionSubmit={(value) => {
                setSelectedType(value === 'all' ? null : value)
                typeCombobox.closeDropdown()
              }}
              store={typeCombobox}
              position="bottom-start"
              styles={{
                dropdown: {
                  minWidth: 'fit-content',
                },
                option: {
                  whiteSpace: 'nowrap',
                },
              }}
            >
              <Combobox.Target>
                <ButtonEara
                  size="md"
                  onClick={() => typeCombobox.toggleDropdown()}
                  rightSection={<IconChevronDown size={14} />}
                >
                  {selectedType || 'Type'}
                </ButtonEara>
              </Combobox.Target>
              <Combobox.Dropdown>
                <Combobox.Options>
                  <Combobox.Option value="all">All Types</Combobox.Option>
                  <Combobox.Option value="transparency-agreements">
                    Transparency Agreements
                  </Combobox.Option>
                </Combobox.Options>
              </Combobox.Dropdown>
            </Combobox>
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
          {filteredPressReleases && filteredPressReleases.length > 0 ? (
            filteredPressReleases.map((item) => (
              <NewsCard
                key={item.id}
                title={item.title || 'No Title'}
                timeReading={item.seo?.readingTime}
                author="EARA"
                excerpt={cleanHTMLTAG(item.content || '').substring(0, 100) + '...'}
                featuredImage={item.featuredImage?.node.guid || '/eara-fallback.jpg'}
                link={`/press-releases/${item.slug}`}
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
