import ArchiveAnimalsClient from '@/components/templates/Animals/ArchiveAnimalsClient'
import PageTitleBar from '@/components/ui/PageTitleBar/PageTitleBar'
import { Container } from '@mantine/core'
import { Metadata } from 'next'
export const metadata: Metadata = {
  title: 'EARA | Animals',
  description: 'Stay updated with the latest animals from EARA.',
}

export default function Animals() {
  return (
    <>
      <PageTitleBar title="Animals" subtitle="main" />
      <main>
        <Container size="xl" my={100}>
          <ArchiveAnimalsClient />
        </Container>
      </main>
    </>
  )
}
