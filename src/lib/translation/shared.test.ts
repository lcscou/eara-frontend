import { describe, expect, it } from 'vitest'

import {
  createTranslationCacheKey,
  createTranslationFingerprint,
  dedupeTexts,
  expandDedupedTranslations,
} from './shared'

describe('translation shared utilities', () => {
  it('deduplicates repeated texts while preserving order', () => {
    const result = dedupeTexts(['hello', 'world', 'hello', 'hello', 'world'])

    expect(result.uniqueTexts).toEqual(['hello', 'world'])
    expect(result.sourceToUniqueIndex).toEqual([0, 1, 0, 0, 1])
    expect(expandDedupedTranslations(['hola', 'mundo'], result.sourceToUniqueIndex)).toEqual([
      'hola',
      'mundo',
      'hola',
      'hola',
      'mundo',
    ])
  })

  it('creates a stable fingerprint for equivalent payloads', async () => {
    const first = await createTranslationFingerprint(['Line one', 'Line two'], 'es')
    const second = await createTranslationFingerprint(['Line one', 'Line two'], 'es')

    expect(first).toBe(second)
  })

  it('creates a stable per-string KV cache key', async () => {
    const first = await createTranslationCacheKey('fr', 'Reusable paragraph')
    const second = await createTranslationCacheKey('fr', 'Reusable paragraph')
    const differentLocale = await createTranslationCacheKey('es', 'Reusable paragraph')

    expect(first).toBe(second)
    expect(first).not.toBe(differentLocale)
    expect(first).toContain('eara:translation:fr:')
  })
})
