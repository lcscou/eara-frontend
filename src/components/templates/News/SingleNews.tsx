'use client'

import ButtonEara from '@/components/ui/ButtonEara/ButtonEara'
import EventCard from '@/components/ui/EventCard/EventCard'
import Section from '@/components/ui/Section/Section'
import { GetNewsQuery } from '@/graphql/generated/graphql'
import { truncateText } from '@/lib/utils'
import { Carousel } from '@mantine/carousel'
import { Button, Center, Container } from '@mantine/core'
import { IconArrowLeft } from '@tabler/icons-react'
import Link from 'next/link'
import PageTitleBar from '../../ui/PageTitleBar/PageTitleBar'
import SharePost from '../../ui/SharePost/SharePost'

export default function SingleNews({ data }: { data: GetNewsQuery }) {
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
        <div dangerouslySetInnerHTML={{ __html: data.news?.content || '' }}></div>

        <div className="mt-10">
          <SharePost
            title={data.news?.title || undefined}
            description={data.news?.seo?.opengraphDescription || undefined}
          />
        </div>
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
