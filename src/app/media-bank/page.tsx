import Gallery from '@/components/ui/Gallery/Gallery'
import PageTitleBar from '@/components/ui/PageTitleBar/PageTitleBar'
import { GetMediasBankDocument } from '@/graphql/generated/graphql'
import { query } from '@/lib/apollo-client'
import { getMediaType } from '@/lib/utils'
import { Container } from '@mantine/core'
export default async function MediaBank() {
  const { data } = await query({ query: GetMediasBankDocument })
  const medias = getMediaType(data?.mediasBank)
  return (
    <>
      <PageTitleBar title="Media Bank" subtitle="Media Bank" />
      <Container size="lg" my={50}>
        <main>
          <Gallery data={medias} />
        </main>
      </Container>
    </>
  )
}
