import ArchiveDiseases from '@/components/templates/Diseases/ArchiveDiseases'
import PageTitleBar from '@/components/ui/PageTitleBar/PageTitleBar'

import { Container } from '@mantine/core'

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
