'use client'

import { MembersMap } from '@/components/ui/MembersMap'
import { Container } from '@mantine/core'
export default function Page() {
  return (
    <div className="px-8 py-40">
      <Container size="xl">
        <MembersMap height="fit-content" />
      </Container>
    </div>
  )
}
