import { Container } from '@mantine/core'
import { Metadata } from 'next'

import ArchiveDiseases from '@/components/templates/Diseases/ArchiveDiseases'
import PageTitleBar from '@/components/ui/PageTitleBar/PageTitleBar'

export const metadata: Metadata = {
  title: 'EARA | Diseases',
  description: 'Stay updated with the latest diseases from EARA.',
}

export default async function Diseases() {
  return (
    <>
      <PageTitleBar title="Diseases" subtitle="main" />
      <main>
        <Container size="xl" my={100}>
          <ArchiveDiseases />
        </Container>
      </main>
    </>
  )
}
