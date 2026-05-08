'use client'

import { Container } from '@mantine/core'

import { MembersMap } from '@/components/ui/MembersMap'
export default function Page() {
  return (
    <div className="px-8 py-40">
      <Container size="xl">
        <MembersMap height="fit-content" />
      </Container>
    </div>
  )
}
