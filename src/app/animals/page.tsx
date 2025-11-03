import ArchiveAnimalsClient from '@/components/templates/Animals/ArchiveAnimalsClient'
import PageTitleBar from '@/components/ui/PageTitleBar/PageTitleBar'
import { Container } from '@mantine/core'

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
