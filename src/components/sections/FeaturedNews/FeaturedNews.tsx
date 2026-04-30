'use client'

import ButtonEara from '@/components/ui/ButtonEara/ButtonEara'
import NewsCard from '@/components/ui/NewsCard/NewsCard'
import Section from '@/components/ui/Section/Section'
import { cleanHTMLTAG, formatAuthorName } from '@/lib/utils'
import { gql } from '@apollo/client'
import { useQuery } from '@apollo/client/react'
import { Center, Skeleton } from '@mantine/core'

const GetFeaturedNewsDocument = gql`
  query GetFeaturedNews($first: Int, $in: [ID]) {
    allNews(first: $first, where: { in: $in }) {
      nodes {
        id
        databaseId
        title
        slug
        content
        author {
          node {
            name
            firstName
            lastName
            nicename
          }
        }
        seo {
          readingTime
        }
        featuredImage {
          node {
            guid
          }
        }
      }
    }
  }
`

type FeaturedNewsItem = {
  id: string
  databaseId?: number | null
  title?: string | null
  slug?: string | null
  content?: string | null
  author?: {
    node: {
      name?: string | null
      firstName?: string | null
      lastName?: string | null
      nicename?: string | null
    }
  } | null
  seo?: {
    readingTime?: number | null
  } | null
  featuredImage?: {
    node: {
      guid?: string | null
    }
  } | null
}

type GetFeaturedNewsQueryData = {
  allNews?: {
    nodes: FeaturedNewsItem[]
  } | null
}

type FeaturedNewsMode = 'highlight' | 'latest'

export default function FeaturedNews({
  withSectionWrapper = true,
  mode = 'latest',
  selectedNews = [],
}: {
  withSectionWrapper?: boolean
  mode?: FeaturedNewsMode
  selectedNews?: Array<number | string>
}) {
  const normalizedSelectedNews = selectedNews
    .map((id) => String(id))
    .filter((id) => id.trim().length > 0)

  const isHighlightMode = mode === 'highlight' && normalizedSelectedNews.length > 0

  const { data, loading } = useQuery<GetFeaturedNewsQueryData>(GetFeaturedNewsDocument, {
    variables: isHighlightMode
      ? { first: normalizedSelectedNews.length, in: normalizedSelectedNews }
      : { first: 3 },
    fetchPolicy: 'cache-and-network',
  })

  const featuredNews = data?.allNews?.nodes || []

  const sortedFeaturedNews = isHighlightMode
    ? [...featuredNews].sort((a, b) => {
        const aIndex = normalizedSelectedNews.findIndex(
          (selectedId) => selectedId === String(a.databaseId) || selectedId === String(a.id)
        )
        const bIndex = normalizedSelectedNews.findIndex(
          (selectedId) => selectedId === String(b.databaseId) || selectedId === String(b.id)
        )
        return aIndex - bIndex
      })
    : featuredNews

  if (loading) {
    return <Skeleton animate height={500} />
  }

  return withSectionWrapper ? (
    <Section
      // variant="news-grid"
      subtitle="NEWS"
      title="Latest research news"
      containerSize="lg"
    >
      <div className="flex flex-col">
        <div className="grid gap-8 sm:grid-cols-4 sm:grid-rows-4">
          {sortedFeaturedNews.length > 0 &&
            sortedFeaturedNews.map((news, index) => {
              return index == 0 ? (
                <div key={news.id} className="sm:col-span-2 sm:row-span-4">
                  <NewsCard
                    orientation="horizontal"
                    title={news.title}
                    featuredImage={news.featuredImage?.node?.guid || '/eara-fallback.png'}
                    author={formatAuthorName(news.author as Parameters<typeof formatAuthorName>[0])}
                    isFeatured
                    link={`/news/${news.slug}`}
                    timeReading={news.seo?.readingTime}
                    excerpt={
                      cleanHTMLTAG(news.content || '')
                        .slice(0, 300)
                        .replaceAll('&nbsp;', '') + '...'
                    }
                  />
                </div>
              ) : (
                <div key={news.id} className="sm:col-span-2 sm:col-start-3 sm:row-span-2">
                  <NewsCard
                    orientation="horizontal"
                    title={news.title}
                    link={`/news/${news.slug}`}
                    featuredImage={news.featuredImage?.node?.guid || '/eara-fallback.png'}
                    author={formatAuthorName(news.author as Parameters<typeof formatAuthorName>[0])}
                    timeReading={news.seo?.readingTime}
                    excerpt={cleanHTMLTAG(news.content || '').slice(0, 100) + '...'}
                  />
                </div>
              )
            })}
        </div>
        <Center className="mt-20">
          <ButtonEara variant="link" link="/news" label="All News" />
        </Center>
      </div>
    </Section>
  ) : (
    <div className="flex flex-col">
      <div className="grid gap-8 sm:grid-cols-4 sm:grid-rows-4">
        {sortedFeaturedNews.length > 0 &&
          sortedFeaturedNews.map((news, index) => {
            return index == 0 ? (
              <div key={news.id} className="sm:col-span-2 sm:row-span-4">
                <NewsCard
                  orientation="horizontal"
                  title={news.title}
                  featuredImage={news.featuredImage?.node?.guid || '/eara-fallback.png'}
                  author={formatAuthorName(news.author as Parameters<typeof formatAuthorName>[0])}
                  isFeatured
                  link={`/news/${news.slug}`}
                  timeReading={news.seo?.readingTime}
                  excerpt={
                    cleanHTMLTAG(news.content || '')
                      .slice(0, 300)
                      .replaceAll('&nbsp;', '') + '...'
                  }
                />
              </div>
            ) : (
              <div key={news.id} className="sm:col-span-2 sm:col-start-3 sm:row-span-2">
                <NewsCard
                  orientation="horizontal"
                  title={news.title}
                  link={`/news/${news.slug}`}
                  featuredImage={news.featuredImage?.node?.guid || '/eara-fallback.png'}
                  author={formatAuthorName(news.author as Parameters<typeof formatAuthorName>[0])}
                  timeReading={news.seo?.readingTime}
                  excerpt={cleanHTMLTAG(news.content || '').slice(0, 100) + '...'}
                />
              </div>
            )
          })}
      </div>
      <Center className="mt-20">
        <ButtonEara variant="link" link="/news" label="All News" />
      </Center>
    </div>
  )
}
