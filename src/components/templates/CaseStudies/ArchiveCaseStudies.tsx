'use client'

import ButtonEara from '@/components/ui/ButtonEara/ButtonEara'
import CaseStudiesCard from '@/components/ui/CaseStudiesCard/CaseStudiesCard'
import ResultNotFound from '@/components/ui/ResultNotFound/ResultNotFound'
import { GetAllCaseStudiesDocument, GetAllCaseStudiesQuery } from '@/graphql/generated/graphql'

import { useSuspenseQuery } from '@apollo/client/react'
import { Button, Combobox, Container, Group, Loader, useCombobox } from '@mantine/core'
import { IconChevronDown, IconRestore } from '@tabler/icons-react'
import { useCallback, useEffect, useState } from 'react'

const PAGE_SIZE = 12

export default function ArchiveCaseStudies() {
  const [loadingMore, setLoadingMore] = useState(false)

  const [selectedInstitution, setSelectedInstitution] = useState<string | null>(null)

  const { data, fetchMore } = useSuspenseQuery(GetAllCaseStudiesDocument, {
    variables: { first: PAGE_SIZE },
  })
  const hasNextPage = data?.allCaseStudies?.pageInfo?.hasNextPage
  const endCursor = data?.allCaseStudies?.pageInfo?.endCursor

  const institutionCombobox = useCombobox({
    onDropdownClose: () => institutionCombobox.resetSelectedOption(),
  })

  const handleLoadMore = useCallback(() => {
    if (!hasNextPage || loadingMore) return
    setLoadingMore(true)
    setTimeout(async () => {
      try {
        await fetchMore({
          variables: { first: PAGE_SIZE, after: endCursor },
          updateQuery: (
            prev: GetAllCaseStudiesQuery,
            { fetchMoreResult }: { fetchMoreResult?: GetAllCaseStudiesQuery }
          ) => {
            if (!fetchMoreResult?.allCaseStudies?.nodes) return prev
            return {
              ...prev,
              allCaseStudies: {
                ...fetchMoreResult.allCaseStudies,
                pageInfo: fetchMoreResult.allCaseStudies.pageInfo,
                nodes: [
                  ...(prev?.allCaseStudies?.nodes ?? []),
                  ...(fetchMoreResult.allCaseStudies.nodes ?? []),
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

  useEffect(() => {
    fetchMore({
      variables: { first: PAGE_SIZE, institution: selectedInstitution || undefined },
      updateQuery: (
        _prev: GetAllCaseStudiesQuery,
        { fetchMoreResult }: { fetchMoreResult?: GetAllCaseStudiesQuery }
      ) => {
        if (!fetchMoreResult?.allCaseStudies?.nodes) return _prev
        return {
          ...fetchMoreResult,
        }
      },
    })
  }, [selectedInstitution, fetchMore])

  const handleResetFilters = () => {
    setSelectedInstitution(null)
    institutionCombobox.resetSelectedOption()
  }

  const hasActiveFilters = selectedInstitution !== null

  return (
    <>
      <Container size="xl" my={50}>
        <Group gap={5} mb={50}>
          <Combobox
            store={institutionCombobox}
            onOptionSubmit={(value) => {
              setSelectedInstitution(value === 'all' ? null : value)
              institutionCombobox.closeDropdown()
            }}
          >
            <Combobox.Target>
              <ButtonEara
                size="md"
                rightSection={<IconChevronDown size={16} />}
                onClick={() => institutionCombobox.toggleDropdown()}
                label={selectedInstitution || 'Institution'}
              />
            </Combobox.Target>
            <Combobox.Dropdown>
              <Combobox.Options>
                <Combobox.Option value="all">All Institutions</Combobox.Option>
                <Combobox.Option value="eara">Eara</Combobox.Option>
              </Combobox.Options>
            </Combobox.Dropdown>
          </Combobox>
          {hasActiveFilters && (
            <Button
              size="sm"
              variant="subtle"
              leftSection={<IconRestore size={16} />}
              onClick={handleResetFilters}
            >
              Reset
            </Button>
          )}
        </Group>
        {data?.allCaseStudies?.nodes && data.allCaseStudies.nodes.length > 0 ? (
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {data.allCaseStudies.nodes.map(
              (caseStudy) =>
                caseStudy && (
                  <CaseStudiesCard
                    key={caseStudy.id}
                    title={caseStudy.title}
                    uri={caseStudy.uri}
                    featuredImage={caseStudy.featuredImage?.node?.guid}
                  />
                )
            )}
          </div>
        ) : (
          <ResultNotFound />
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
      </Container>
    </>
  )
}
