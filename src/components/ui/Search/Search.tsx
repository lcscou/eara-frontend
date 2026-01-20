'use client'

import { cleanHTMLTAG, truncateText } from '@/lib/utils'
import {
  Alert,
  Anchor,
  Box,
  Button,
  Group,
  Loader,
  Modal,
  ScrollArea,
  Stack,
  Text,
  TextInput,
} from '@mantine/core'
import { useDebouncedValue, useDisclosure, useMediaQuery } from '@mantine/hooks'
import { IconSearch } from '@tabler/icons-react'
import algoliasearch, { SearchIndex } from 'algoliasearch/lite'
import Link from 'next/link'
import { useEffect, useMemo, useRef, useState } from 'react'
import classes from './Search.module.css'

type HighlightField = { value?: string }

type AlgoliaHit = {
  objectID: string
  title?: string | null
  post_title?: string | null
  permalink?: string | null
  uri?: string | null
  content?: string | null
  post_content?: string | null
  excerpt?: string | null
  post_excerpt?: string | null
  _highlightResult?: {
    title?: HighlightField
    post_title?: HighlightField
    content?: HighlightField
    post_content?: HighlightField
    excerpt?: HighlightField
    post_excerpt?: HighlightField
  }
}

const ALGOLIA_APP_ID = process.env.NEXT_PUBLIC_ALGOLIA_APP_ID
const ALGOLIA_SEARCH_KEY = process.env.NEXT_PUBLIC_ALGOLIA_SEARCH_KEY
const ALGOLIA_INDEX_NAME = process.env.NEXT_PUBLIC_ALGOLIA_INDEX_NAME

const HIGHLIGHT_PROPS = {
  highlightPreTag: '<mark>',
  highlightPostTag: '</mark>',
}

export default function Search() {
  const [opened, { open, close }] = useDisclosure()
  const [query, setQuery] = useState('')
  const [debouncedQuery] = useDebouncedValue(query, 320)
  const [hits, setHits] = useState<AlgoliaHit[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement | null>(null)
  const isMobile = useMediaQuery('(max-width: 768px)')

  const isSearchConfigured = Boolean(ALGOLIA_APP_ID && ALGOLIA_SEARCH_KEY && ALGOLIA_INDEX_NAME)

  const index = useMemo<SearchIndex | null>(() => {
    if (!isSearchConfigured) return null
    return algoliasearch(ALGOLIA_APP_ID!, ALGOLIA_SEARCH_KEY!).initIndex(ALGOLIA_INDEX_NAME!)
  }, [isSearchConfigured])

  useEffect(() => {
    if (!opened) return
    inputRef.current?.focus()
  }, [opened])

  useEffect(() => {
    if (!debouncedQuery.trim()) {
      setHits([])
      setError(null)
      return
    }

    if (!index) {
      setError('Algolia search is not configured. Check environment variables.')
      return
    }

    setIsSearching(true)
    index
      .search<AlgoliaHit>(debouncedQuery, {
        hitsPerPage: 8,
        ...HIGHLIGHT_PROPS,
        attributesToHighlight: [
          'post_title',
          'title',
          'content',
          'post_content',
          'post_excerpt',
          'excerpt',
        ],
      })
      .then(({ hits: newHits }) => {
        setHits(newHits)
        setError(null)
      })
      .catch(() => setError('Não foi possível carregar os resultados agora.'))
      .finally(() => setIsSearching(false))
  }, [debouncedQuery, index])

  const handleOpen = () => {
    open()
  }

  const handleClose = () => {
    close()
    setQuery('')
    setHits([])
    setError(null)
  }

  const resolvePermalink = (permalink?: string | null, uri?: string | null) => {
    const raw = permalink || uri || ''
    if (!raw) return '#'

    try {
      const currentOrigin =
        process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, '') || window.location.origin
      const wpUrl = raw.startsWith('http') ? new URL(raw) : new URL(raw, currentOrigin)
      const normalized = new URL(wpUrl.pathname + wpUrl.search + wpUrl.hash, currentOrigin)
      return normalized.toString()
    } catch (err) {
      console.warn('Could not normalize permalink from Algolia hit', err)
      return raw
    }
  }

  const renderHighlightedText = (value?: string | null) => {
    if (!value) return null
    if (value.includes('<mark') || value.includes('<em')) {
      return <span dangerouslySetInnerHTML={{ __html: value }} />
    }
    return value
  }

  const getTitle = (hit: AlgoliaHit) => {
    return (
      hit._highlightResult?.title?.value ||
      hit._highlightResult?.post_title?.value ||
      hit.title ||
      hit.post_title ||
      'Sem título'
    )
  }

  const getSnippet = (hit: AlgoliaHit) => {
    const highlightedSnippet =
      hit._highlightResult?.post_excerpt?.value ||
      hit._highlightResult?.excerpt?.value ||
      hit._highlightResult?.content?.value ||
      hit._highlightResult?.post_content?.value

    if (highlightedSnippet) return highlightedSnippet

    const plainContent = hit.post_excerpt || hit.excerpt || hit.content || hit.post_content || ''

    if (!plainContent) return 'No preview available.'

    return truncateText(cleanHTMLTAG(plainContent), 40)
  }

  const hasResults = hits.length > 0

  return (
    <>
      <Button
        unstyled
        bg="secondaryColor.7"
        c="#272727"
        className="flex aspect-square w-[40px] cursor-pointer items-center justify-center rounded-full"
        onClick={handleOpen}
        aria-label="Search"
      >
        <IconSearch size={18} />
      </Button>

      <Modal
        opened={opened}
        onClose={handleClose}
        size={isMobile ? '100%' : '80%'}
        // fullScreen

        styles={{
          header: {
            background: '#EAEAEA',
          },
          content: {
            // overflow: 'hidden',
            borderRadius: '15px',
            background: '#EAEAEA',
            minHeight: 'var(--modal-content-max-height, calc(100dvh - var(--modal-y-offset) * 2))',
          },
        }}
        title="Search"
        centered
      >
        <Stack gap="md">
          {/* <Group justify="space-between" align="center">
            <Text fw={600}>Search</Text>
            <Button
              variant="subtle"
              color="gray"
              onClick={handleClose}
              leftSection={<IconX size={16} />}
            >
              Fechar
            </Button>
          </Group> */}

          <TextInput
            ref={inputRef}
            data-autofocus
            placeholder="Search contents"
            leftSection={<IconSearch size={18} />}
            value={query}
            size="xl"
            pt={20}
            variant="filled"
            styles={{
              input: {
                borderRadius: '80px',
              },
            }}
            onChange={(event) => setQuery(event.currentTarget.value)}
          />

          {!isSearchConfigured && (
            <Alert color="yellow" title="Algolia não configurado">
              Defina NEXT_PUBLIC_ALGOLIA_APP_ID, NEXT_PUBLIC_ALGOLIA_SEARCH_KEY e
              NEXT_PUBLIC_ALGOLIA_INDEX_NAME para habilitar a busca no frontend.
            </Alert>
          )}

          <ScrollArea.Autosize
            h=" calc(100dvh - 200px - var(--modal-y-offset) * 2)"
            scrollbarSize={10}
            offsetScrollbars
          >
            <Stack gap="sm">
              {isSearching && (
                <Group gap={8} align="center">
                  <Loader size="sm" />
                  <Text size="sm" c="dimmed">
                    Searching “{debouncedQuery}”
                  </Text>
                </Group>
              )}

              {error && !isSearching && (
                <Alert color="red" title="Search error">
                  {error}
                </Alert>
              )}

              {!isSearching && !error && !hasResults && debouncedQuery.trim() && (
                <Text size="sm" c="dimmed">
                  No results for “{debouncedQuery}”.
                </Text>
              )}

              {!debouncedQuery.trim() && !isSearching && (
                <Text size="sm" c="dimmed">
                  Type to search contents.
                </Text>
              )}

              {hasResults && (
                <Stack gap="sm">
                  {hits.map((hit) => {
                    const href = resolvePermalink(hit.permalink, hit.uri)
                    const title = getTitle(hit)
                    const snippet = getSnippet(hit)

                    return (
                      <Box key={hit.objectID} className={classes.resultCard}>
                        <Anchor component={Link} href={href} className={classes.resultLink}>
                          <Text fw={600} className={classes.resultTitle}>
                            {renderHighlightedText(title)}
                          </Text>
                          <Text size="sm" c="dimmed" className={classes.resultSnippet}>
                            {renderHighlightedText(snippet)}
                          </Text>
                          <Group gap={6} mt={6} wrap="nowrap" c="primaryColor.9">
                            <Text size="xs" className={classes.resultUrl}>
                              {href}
                            </Text>
                          </Group>
                        </Anchor>
                      </Box>
                    )
                  })}
                </Stack>
              )}
            </Stack>
          </ScrollArea.Autosize>
        </Stack>
      </Modal>
    </>
  )
}
