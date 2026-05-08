'use client'

import { Alert, Button, Container, Group, Stack, Text, Title } from '@mantine/core'
import Link from 'next/link'
import { useEffect } from 'react'

type MediaBankErrorProps = {
  error: Error & { digest?: string }
  reset: () => void
}

export default function MediaBankError({ error, reset }: MediaBankErrorProps) {
  useEffect(() => {
    console.error('Media Bank route error boundary:', error)
  }, [error])

  return (
    <Container size="md" py={80}>
      <Stack gap="md">
        <Title order={2}>Unable to load media bank right now</Title>
        <Text c="dimmed">
          We could not load this page due to a temporary data or media error. Please try again.
        </Text>
        <Alert color="red" variant="light" title="Technical details">
          {error.message || 'Unknown error'}
        </Alert>
        <Group>
          <Button onClick={reset}>Try again</Button>
          <Button component={Link} href="/" variant="default">
            Go home
          </Button>
        </Group>
      </Stack>
    </Container>
  )
}
