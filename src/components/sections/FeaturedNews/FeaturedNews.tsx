'use client'

import ButtonEara from '@/components/ui/ButtonEara/ButtonEara'
import NewsCard from '@/components/ui/NewsCard/NewsCard'
import Section from '@/components/ui/Section/Section'
import { GetAllNewsDocument } from '@/graphql/generated/graphql'
import { cleanHTMLTAG, formatAuthorName } from '@/lib/utils'
import { useSuspenseQuery } from '@apollo/client/react'
import { Center, Skeleton } from '@mantine/core'
import { Suspense } from 'react'

export default function FeaturedNews({
  withSectionWrapper = true,
}: {
  withSectionWrapper?: boolean
}) {
  const { data } = useSuspenseQuery(GetAllNewsDocument, {
    variables: { first: 3 },
  })

  const featuredNews = data?.allNews?.nodes || []
  return (
    <Suspense fallback={<Skeleton animate height={500} />}>
      {withSectionWrapper ? (
        <Section
          // variant="news-grid"
          subtitle="NEWS"
          title="Latest research news"
          containerSize="lg"
        >
          <div className="flex flex-col">
            <div className="grid gap-8 sm:grid-cols-4 sm:grid-rows-4">
              {featuredNews.length > 0 &&
                featuredNews.map((news, index) => {
                  return index == 0 ? (
                    <div key={news.id} className="sm:col-span-2 sm:row-span-4">
                      <NewsCard
                        orientation="horizontal"
                        title={news.title}
                        featuredImage={news.featuredImage?.node.guid || '/eara-fallback.jpg'}
                        author={formatAuthorName(news.author)}
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
                        featuredImage={news.featuredImage?.node.guid || '/eara-fallback.jpg'}
                        author={formatAuthorName(news.author)}
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
            {featuredNews.length > 0 &&
              featuredNews.map((news, index) => {
                return index == 0 ? (
                  <div key={news.id} className="sm:col-span-2 sm:row-span-4">
                    <NewsCard
                      orientation="horizontal"
                      title={news.title}
                      featuredImage={news.featuredImage?.node.guid || '/eara-fallback.jpg'}
                      author={formatAuthorName(news.author)}
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
                      featuredImage={news.featuredImage?.node.guid || '/eara-fallback.jpg'}
                      author={formatAuthorName(news.author)}
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
      )}
    </Suspense>
  )
}
