import { Suspense } from 'react'

import LoginForm from '@/components/auth/LoginForm'
import { Container, Image, Stack, Text, Title } from '@mantine/core'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'EARA | Members Login',
  description: 'Login to your EARA account to access exclusive content and features.',
}

export default function LoginPage() {
  return (
    <>
      <main className="h-[calc(100dvh)]">
        <Container size="xl" className="flex h-full items-center justify-center">
          <section className="grid w-full overflow-hidden rounded-2xl bg-[#EAEAEA] sm:grid-cols-2">
            <div className="overflow-hidden rounded-2xl">
              <Image src="./opt__PLF48240-sRGB-HR.webp" w="100%" h="100%" alt="Login" />
            </div>
            <div className="p-14">
              <Stack>
                <Image src="./eara-icon.svg" w="60px" h="60px" alt="Login" />
                <Title order={3} c="primaryColor.9">
                  Members Login
                </Title>
                <Text>Fill your login and password to access your account</Text>
                <Suspense>
                  <LoginForm />
                </Suspense>
              </Stack>
            </div>
          </section>
        </Container>
      </main>
    </>
  )
}
