import { describe, expect, it } from 'vitest'

import { getHeroBackgroundStyle } from './heroBackground'

describe('getHeroBackgroundStyle', () => {
  it('uses the image as the default background type', () => {
    expect(getHeroBackgroundStyle({ imageUrl: '/hero.jpg' })).toEqual({
      backgroundImage: 'url(/hero.jpg)',
    })
  })

  it('uses the color value or the configured default color', () => {
    expect(getHeroBackgroundStyle({ backgroundType: 'color' })).toEqual({
      background: '#312f86',
    })
    expect(
      getHeroBackgroundStyle({
        backgroundType: 'color',
        backgroundValue: '#123456',
        backgroundColor: '#abcdef',
      })
    ).toEqual({ background: '#123456' })
  })

  it('creates linear and radial gradients from their attributes', () => {
    expect(getHeroBackgroundStyle({ backgroundType: 'gradient' })).toEqual({
      background: 'linear-gradient(135deg, #312f86, #8fbf29)',
    })
    expect(
      getHeroBackgroundStyle({
        backgroundType: 'gradient',
        gradientType: 'radial',
        gradientStartColor: '#111111',
        gradientEndColor: '#eeeeee',
      })
    ).toEqual({ background: 'radial-gradient(#111111, #eeeeee)' })
  })

  it('prefers a complete background value and clamps the linear angle', () => {
    expect(
      getHeroBackgroundStyle({
        backgroundType: 'gradient',
        backgroundValue: 'linear-gradient(20deg, red, blue)',
      })
    ).toEqual({ background: 'linear-gradient(20deg, red, blue)' })
    expect(getHeroBackgroundStyle({ backgroundType: 'gradient', gradientAngle: 400 })).toEqual({
      background: 'linear-gradient(360deg, #312f86, #8fbf29)',
    })
  })
})
