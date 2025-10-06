'use client'

import { MantineProvider as BaseMantineProvider } from '@mantine/core'
import { theme } from '@/styles/theme'

export function MantineProvider({ children }: { children: React.ReactNode }) {
  return (
    <BaseMantineProvider theme={theme} forceColorScheme="light">
      {children}
    </BaseMantineProvider>
  )
}