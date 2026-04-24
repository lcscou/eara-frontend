'use client'

import { Box, Image, Text } from '@mantine/core'
import { useEffect, useMemo, useState } from 'react'

type AuthState = 'checking' | 'authenticated' | 'unauthenticated'

type ProtectedCoreImageProps = {
  url: string
  alt: string
  title?: string
  width?: number
  height?: number | string
  href?: string
  linkTarget?: '_blank' | '_self'
  rel?: string
  linkClass?: string
}

export default function ProtectedCoreImage({
  url,
  alt,
  title,
  width,
  height,
  href,
  linkTarget,
  rel,
  linkClass,
}: ProtectedCoreImageProps) {
  const [authState, setAuthState] = useState<AuthState>('checking')

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

  const protectedSrc = useMemo(() => {
    return `/api/protected-file?url=${encodeURIComponent(url)}`
  }, [url])

  if (authState === 'checking') {
    return (
      <Text c="dimmed" fz="sm">
        Checking protected resource access...
      </Text>
    )
  }

  if (authState !== 'authenticated') {
    return (
      <Box
        px="md"
        py="sm"
        style={{ border: '1px dashed var(--mantine-color-gray-4)', borderRadius: '0.5rem' }}
      >
        <Text c="dimmed" fz="sm">
          This resource is protected and you need to be logged in to view it.
        </Text>
      </Box>
    )
  }

  const imageNode = (
    <Image
      component="img"
      src={protectedSrc}
      alt={alt}
      title={title}
      width={width}
      height={height}
      className="rounded-lg"
      style={{ maxWidth: '100%', objectFit: 'cover' }}
    />
  )

  if (!href) {
    return imageNode
  }

  return (
    <a href={href} target={linkTarget} rel={rel} className={linkClass}>
      {imageNode}
    </a>
  )
}
