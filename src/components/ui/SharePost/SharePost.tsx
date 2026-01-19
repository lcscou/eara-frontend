'use client'

import { ActionIcon, Group, Text, Tooltip } from '@mantine/core'
import { useClipboard } from '@mantine/hooks'
import {
  IconBrandBluesky,
  IconBrandFacebook,
  IconBrandLinkedin,
  IconBrandTiktok,
  IconBrandX,
  IconCheck,
  IconLink,
} from '@tabler/icons-react'
import { usePathname } from 'next/navigation'

interface SharePostProps {
  title?: string
  description?: string
}

export default function SharePost({ title, description }: SharePostProps) {
  const pathname = usePathname()
  const clipboard = useClipboard({ timeout: 2000 })
  const currentUrl = typeof window !== 'undefined' ? `${window.location.origin}${pathname}` : ''

  const handleFacebookShare = () => {
    const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(currentUrl)}`
    window.open(facebookUrl, '_blank', 'width=600,height=400')
  }

  const handleLinkedInShare = () => {
    const linkedInUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(currentUrl)}`
    window.open(linkedInUrl, '_blank', 'width=600,height=400')
  }

  const handleTwitterShare = () => {
    const text = title ? encodeURIComponent(title) : ''
    const twitterUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(currentUrl)}&text=${text}`
    window.open(twitterUrl, '_blank', 'width=600,height=400')
  }
  const handleBlueSkyShare = () => {
    const text = title ? encodeURIComponent(title) : ''
    const twitterUrl = `https://bsky.app/intent/compose?text=${text}-${encodeURIComponent(currentUrl)}`
    window.open(twitterUrl, '_blank', 'width=600,height=400')
  }

  const handleTikTokShare = async () => {
    try {
      const nav =
        typeof navigator !== 'undefined'
          ? (navigator as unknown as { share?: (data: ShareData) => Promise<void> })
          : undefined
      if (nav?.share) {
        await nav.share({
          title: title || document.title,
          text: description || title || '',
          url: currentUrl,
        })
        return
      }
    } catch {
      // Fallback to copying below
    }
    clipboard.copy(currentUrl)
  }

  const handleCopyLink = () => {
    clipboard.copy(currentUrl)
  }

  return (
    <div className="flex items-center justify-between rounded-full border-y border-gray-200 bg-[#F1F2F1] px-6 py-4">
      <Group gap="xs">
        <Text fw={600} size="sm" tt="uppercase" c="primaryColor.9">
          Share this post
        </Text>
        <IconArrowRight size={18} />
      </Group>

      <Group gap="sm">
        <Tooltip label="Share on TikTok" position="top">
          <ActionIcon
            variant="subtle"
            size="lg"
            color="primaryColor.9"
            onClick={handleTikTokShare}
            aria-label="Share on TikTok"
          >
            <IconBrandTiktok size={24} />
          </ActionIcon>
        </Tooltip>

        <Tooltip label="Share on Facebook" position="top">
          <ActionIcon
            variant="subtle"
            size="lg"
            color="primaryColor.9"
            onClick={handleFacebookShare}
            aria-label="Share on Facebook"
          >
            <IconBrandFacebook size={24} />
          </ActionIcon>
        </Tooltip>

        <Tooltip label="Share on LinkedIn" position="top">
          <ActionIcon
            variant="subtle"
            size="lg"
            color="primaryColor.9"
            onClick={handleLinkedInShare}
            aria-label="Share on LinkedIn"
          >
            <IconBrandLinkedin size={24} />
          </ActionIcon>
        </Tooltip>

        <Tooltip label="Share on X (Twitter)" position="top">
          <ActionIcon
            variant="subtle"
            size="lg"
            color="primaryColor.9"
            onClick={handleTwitterShare}
            aria-label="Share on X"
          >
            <IconBrandX size={24} />
          </ActionIcon>
        </Tooltip>
        <Tooltip label="Share on Bluesky" position="top">
          <ActionIcon
            variant="subtle"
            size="lg"
            color="primaryColor.9"
            onClick={handleBlueSkyShare}
            aria-label="Share on Bluesky"
          >
            <IconBrandBluesky size={24} />
          </ActionIcon>
        </Tooltip>

        <Tooltip label={clipboard.copied ? 'Link copied!' : 'Copy link'} position="top">
          <ActionIcon
            variant="subtle"
            size="lg"
            color={clipboard.copied ? 'primaryColor.9' : 'primaryColor.3'}
            onClick={handleCopyLink}
            aria-label="Copy link"
          >
            {clipboard.copied ? <IconCheck size={24} /> : <IconLink size={24} />}
          </ActionIcon>
        </Tooltip>
      </Group>
    </div>
  )
}

// Arrow right icon component
function IconArrowRight({ size = 16 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M5 12h14" />
      <path d="m12 5 7 7-7 7" />
    </svg>
  )
}
