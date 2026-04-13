'use client'

import { Alert, Button, Container, Group, Stack, Text, Title } from '@mantine/core'
import Link from 'next/link'
import { useEffect } from 'react'

type NewsErrorProps = {
  error: Error & { digest?: string }
  reset: () => void
}

export default function NewsError({ error, reset }: NewsErrorProps) {
  useEffect(() => {
    console.error('News route error boundary:', error)
  }, [error])

  return (
    <Container size="md" py={80}>
      <Stack gap="md">
        <Title order={2}>Unable to load news right now</Title>
        <Text c="dimmed">
          We could not load this page due to a temporary data error. Please try again.
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
