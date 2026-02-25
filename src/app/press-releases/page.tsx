import ArchivePressReleases from '@/components/templates/PressReleases/ArchivePressReleases'
import PageTitleBar from '@/components/ui/PageTitleBar/PageTitleBar'
import { GetAllPressReleaseDocument } from '@/graphql/generated/graphql'

import { query } from '@/lib/apollo-client'
import { Metadata } from 'next'
import { notFound } from 'next/navigation'

export const metadata: Metadata = {
  title: 'EARA | Press Releases',
  description: 'Stay updated with the latest press releases from EARA.',
}

export default async function PressRelease() {
  const { data } = await query({ query: GetAllPressReleaseDocument })
  if (!data) notFound()
  return (
    <>
      <PageTitleBar title="Press Release" subtitle="EARA" />
      <main>
        <ArchivePressReleases />
      </main>
    </>
  )
}
