'use client'

import ButtonEara from '@/components/ui/ButtonEara/ButtonEara'
import EventCard from '@/components/ui/EventCard/EventCard'
import Section from '@/components/ui/Section/Section'
import { GetAllNewsQuery, GetNewsQuery } from '@/graphql/generated/graphql'
import { renderPageBlocks } from '@/lib/blockRenderer'
import { truncateText } from '@/lib/utils'
import { Carousel } from '@mantine/carousel'
import { Button, Center, Container } from '@mantine/core'
import { IconArrowLeft, IconArrowRight } from '@tabler/icons-react'
import Link from 'next/link'
import PageTitleBar from '../../ui/PageTitleBar/PageTitleBar'
import SharePost from '../../ui/SharePost/SharePost'

type SingleNewsProps = {
  data: GetNewsQuery
  allNews?: GetAllNewsQuery
}

export default function SingleNews({ data, allNews }: SingleNewsProps) {
  const newsNodes = allNews?.allNews?.nodes ?? []
  const currentNewsId = data.news?.id
  const currentIndex = currentNewsId
    ? newsNodes.findIndex((newsItem) => newsItem?.id === currentNewsId)
    : -1
  const previousNews = currentIndex > 0 ? newsNodes[currentIndex - 1] : undefined
  const nextNews =
    currentIndex >= 0 && currentIndex < newsNodes.length - 1
      ? newsNodes[currentIndex + 1]
      : undefined

  return (
    <>
      <PageTitleBar
        title={data.news?.title || undefined}
        featuredImage={data.news?.acfNews?.pageHeaderImage?.node?.link}
        date={data.news?.date}
        readingTime={data.news?.seo?.readingTime}
        author={`${data.news?.author?.node.firstName} ${data.news?.author?.node.lastName}`}
      />
      <Container size="lg" className="my-20">
        <div className="mb-5 flex justify-end">
          <Link href="/news">
            <Button variant="subtle" leftSection={<IconArrowLeft size={16} />}>
              Back to news list
            </Button>
          </Link>
        </div>
        <div>{renderPageBlocks(data.news?.blocks)}</div>

        <div className="mt-10">
          <SharePost
            title={data.news?.title || undefined}
            description={data.news?.seo?.opengraphDescription || undefined}
          />
        </div>
        {(previousNews?.slug || nextNews?.slug) && (
          <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            {previousNews?.slug ? (
              <Link href={`/news/${previousNews.slug}`} className="w-full sm:w-auto">
                <Button variant="outline" leftSection={<IconArrowLeft size={16} />}>
                  Previous news
                </Button>
              </Link>
            ) : (
              <span />
            )}
            {nextNews?.slug ? (
              <Link href={`/news/${nextNews.slug}`} className="w-full sm:w-auto sm:text-right">
                <Button variant="outline" rightSection={<IconArrowRight size={16} />}>
                  Next news
                </Button>
              </Link>
            ) : null}
          </div>
        )}
      </Container>
      {data.news?.acfNews?.relatedNews && data.news?.acfNews?.relatedNews?.nodes.length > 0 && (
        <Section subtitle="Related" title="More research news" containerSize="none">
          <Carousel slideSize={{ lg: '25%', sm: '33%' }} slideGap={15} withIndicators>
            {data.news?.acfNews?.relatedNews?.nodes.map((relatedNews) => (
              <Carousel.Slide key={relatedNews?.id} h="fit-content">
                <EventCard
                  title={
                    relatedNews?.seo?.title?.substring(relatedNews?.seo?.title.search('-'), 0) ||
                    'No Title'
                  }
                  featuredImage={relatedNews?.seo?.opengraphImage?.guid || '/eara-fallback.jpg'}
                  link={`/news/${relatedNews?.slug}`}
                  excerpt={truncateText(relatedNews?.seo?.opengraphDescription || '', 23)}
                  orientation="vertical"
                />
              </Carousel.Slide>
            ))}
          </Carousel>
          <Center py={20}>
            <ButtonEara variant="link" link="/news">
              VIEW ALL
            </ButtonEara>
          </Center>
        </Section>
      )}
    </>
  )
}
