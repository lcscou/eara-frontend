import type { CSSProperties } from 'react'

export interface HeroBackgroundOptions {
  backgroundType?: string
  backgroundValue?: string
  backgroundColor?: string
  gradientStartColor?: string
  gradientEndColor?: string
  gradientType?: string
  gradientAngle?: number
}

interface HeroBackgroundStyleOptions extends HeroBackgroundOptions {
  imageUrl?: string
}

const DEFAULT_BACKGROUND_COLOR = '#312f86'
const DEFAULT_GRADIENT_START_COLOR = '#312f86'
const DEFAULT_GRADIENT_END_COLOR = '#8fbf29'

export function getHeroBackgroundStyle({
  backgroundType,
  backgroundValue,
  backgroundColor,
  gradientStartColor,
  gradientEndColor,
  gradientType,
  gradientAngle,
  imageUrl,
}: HeroBackgroundStyleOptions): CSSProperties {
  if (backgroundType === 'color') {
    return {
      background: backgroundValue?.trim() || backgroundColor?.trim() || DEFAULT_BACKGROUND_COLOR,
    }
  }

  if (backgroundType === 'gradient') {
    if (backgroundValue?.trim()) {
      return { background: backgroundValue.trim() }
    }

    const startColor = gradientStartColor?.trim() || DEFAULT_GRADIENT_START_COLOR
    const endColor = gradientEndColor?.trim() || DEFAULT_GRADIENT_END_COLOR

    if (gradientType === 'radial') {
      return { background: `radial-gradient(${startColor}, ${endColor})` }
    }

    const angle =
      typeof gradientAngle === 'number' && Number.isFinite(gradientAngle)
        ? Math.min(360, Math.max(0, gradientAngle))
        : 135

    return {
      background: `linear-gradient(${angle}deg, ${startColor}, ${endColor})`,
    }
  }

  return imageUrl ? { backgroundImage: `url(${imageUrl})` } : {}
}
