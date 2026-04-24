'use client'

import ButtonEara from '@/components/ui/ButtonEara/ButtonEara'
import { Text } from '@mantine/core'
import { HTMLAttributeAnchorTarget, useEffect, useMemo, useState } from 'react'

type AuthState = 'checking' | 'authenticated' | 'unauthenticated'

type ProtectedDownloadButtonProps = {
  label: string
  privateUrl: string
  className?: string
  width?: string
  target?: HTMLAttributeAnchorTarget
  variant?: 'filled' | 'outline' | 'link' | 'with-arrow'
  size?: string
}

export default function ProtectedDownloadButton({
  label,
  privateUrl,
  className,
  width,
  target,
  variant = 'filled',
  size = 'md',
}: ProtectedDownloadButtonProps) {
  const [authState, setAuthState] = useState<AuthState>('checking')

  const getOriginalFileName = (url: string) => {
    try {
      const parsedUrl = new URL(url)
      const fileName = parsedUrl.pathname.split('/').pop() || ''
      return decodeURIComponent(fileName) || 'download'
    } catch {
      const fileName = url.split('?')[0].split('#')[0].split('/').pop() || ''
      return decodeURIComponent(fileName) || 'download'
    }
  }

  useEffect(() => {
    let isMounted = true

    const checkAuth = async () => {
      try {
        const response = await fetch('/api/auth/me', {
          method: 'GET',
          credentials: 'include',
          cache: 'no-store',
        })

        if (!isMounted) return
        setAuthState(response.ok ? 'authenticated' : 'unauthenticated')
      } catch {
        if (!isMounted) return
        setAuthState('unauthenticated')
      }
    }

    void checkAuth()

    return () => {
      isMounted = false
    }
  }, [])

  const protectedDownloadUrl = useMemo(() => {
    return `/api/protected-file?url=${encodeURIComponent(privateUrl)}`
  }, [privateUrl])

  const downloadFileName = useMemo(() => getOriginalFileName(privateUrl), [privateUrl])

  if (authState === 'checking') {
    return (
      <Text c="dimmed" fz="sm">
        Checking protected resource access...
      </Text>
    )
  }

  if (authState !== 'authenticated') {
    return (
      <Text c="dimmed" fz="sm">
        This resource is protected and you need to be logged in to download it.
      </Text>
    )
  }

  return (
    <ButtonEara
      label={label}
      link={protectedDownloadUrl}
      download={downloadFileName}
      className={className}
      miw={width}
      target={target}
      variant={variant}
      size={size}
    />
  )
}
