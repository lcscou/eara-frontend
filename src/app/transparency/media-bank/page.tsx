import Gallery from '@/components/ui/Gallery/Gallery'
import PageTitleBar from '@/components/ui/PageTitleBar/PageTitleBar'
import { GetMediasBankDocument, GetSettingsDocument } from '@/graphql/generated/graphql'
import { query } from '@/lib/apollo-client'
import { getMediaType } from '@/lib/utils'
import { Container } from '@mantine/core'
import { Suspense } from 'react'
export default async function MediaBank() {
  const { data } = await query({ query: GetMediasBankDocument, variables: { first: 25 } })
  const { data: settings } = await query({ query: GetSettingsDocument })
  const medias = getMediaType(data?.mediasBank)

  return (
    <>
      <PageTitleBar title="Media Bank" subtitle="Media Bank" />
      <Container size="xl" my={50}>
        <main>
          <div
            className="wp-block mb-20"
            dangerouslySetInnerHTML={{
              __html: settings?.earaSettings?.themeSettings?.mediabankIntro || '',
            }}
          ></div>
          <Suspense>
            <Gallery data={medias} />
          </Suspense>
        </main>
      </Container>
    </>
  )
}
