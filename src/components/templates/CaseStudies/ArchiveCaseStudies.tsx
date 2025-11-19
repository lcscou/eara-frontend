'use client'

import ResultNotFound from '@/components/ui/ResultNotFound/ResultNotFound'
import { Container } from '@mantine/core'

export default function ArchiveCaseStudies() {
  return (
    <>
      <Container size="xl" my={100}>
        <ResultNotFound />
      </Container>
    </>
  )
}
