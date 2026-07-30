import { Container, Paper, Stack, Text, Title } from '@mantine/core'
import { Suspense } from 'react'

import LoginForm from './LoginForm'

type PreviewLoginGateProps = {
  redirectTo: string
}

export default function PreviewLoginGate({ redirectTo }: PreviewLoginGateProps) {
  return (
    <main className="py-20">
      <Container size="sm">
        <Paper
          radius="24px"
          p="xl"
          className="border border-[#D7D7D7] bg-[#F7F4EA] shadow-[0_24px_80px_rgba(49,47,134,0.08)]"
        >
          <Stack gap="lg">
            <Stack gap={6}>
              <Text fw={700} size="sm" c="primaryColor.9" tt="uppercase">
                Login required
              </Text>
              <Title order={2} c="primaryColor.9">
                This content is only available to logged-in users.
              </Title>
              <Text c="dimmed">
                Please log in to view draft, pending, scheduled, or private content.
              </Text>
            </Stack>

            <Suspense>
              <LoginForm redirectTo={redirectTo} />
            </Suspense>
          </Stack>
        </Paper>
      </Container>
    </main>
  )
}
