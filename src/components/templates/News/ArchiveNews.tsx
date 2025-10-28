// import s from './ArchiveNews.module.css';
import NewsCard from '@/components/ui/NewsCard/NewsCard'
import { GetAllNewsQuery } from '@/graphql/generated/graphql'
import { cleanHTMLTAG } from '@/lib/utils'
import { Container, Stack } from '@mantine/core'

interface ArchiveNewsProps {
  data: GetAllNewsQuery
}

export default function ArchiveNews({ data }: ArchiveNewsProps) {
  return (
    <>
      <Container className="my-20">
        <Stack>
          {data.allNews && data.allNews.nodes.length > 0 ? (
            data.allNews.nodes.map((newsItem) => (
              <NewsCard
                key={newsItem.id}
                title={newsItem.title || 'No Title'}
                timeReading={
                  newsItem.seo?.readingTime ? `${newsItem.seo?.readingTime} min read` : ''
                }
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
    </>
  )
}
