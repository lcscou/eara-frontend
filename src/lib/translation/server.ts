import { JigsawStack } from 'jigsawstack'

import {
  createTranslationFingerprint,
  dedupeTexts,
  expandDedupedTranslations,
  normalizeTranslationText,
} from './shared'

const jigsawstackApiKey = process.env.JIGSAWSTACK_API_KEY

const translationCacheTtlSeconds = readPositiveInt(
  process.env.TRANSLATION_CACHE_TTL_SECONDS,
  60 * 60 * 24 * 7
)

type TranslationInput = string | string[]

type CachedTranslationEntry = {
  expiresAt: number
  translatedText: TranslationInput
}

type TranslationCacheState = {
  cache: Map<string, CachedTranslationEntry>
  pending: Map<string, Promise<TranslationInput>>
}

const globalForTranslations = globalThis as typeof globalThis & {
  __translationCacheState?: TranslationCacheState
}

const translationCacheState: TranslationCacheState =
  globalForTranslations.__translationCacheState ?? {
    cache: new Map<string, CachedTranslationEntry>(),
    pending: new Map<string, Promise<TranslationInput>>(),
  }

globalForTranslations.__translationCacheState = translationCacheState

const jigsawstack =
  jigsawstackApiKey !== undefined
    ? JigsawStack({
        apiKey: jigsawstackApiKey,
      })
    : null

export type TranslationCacheStatus = 'hit' | 'miss'

export type TranslationResult = {
  cacheKey: string
  cacheStatus: TranslationCacheStatus
  translatedText: TranslationInput
}

export async function translateWithCache(
  text: TranslationInput,
  targetLanguage: string
): Promise<TranslationResult> {
  if (!jigsawstack) {
    throw new Error('Translation service not configured')
  }

  const inputTexts = Array.isArray(text) ? text : [text]
  const normalizedTexts = inputTexts.map(normalizeTranslationText)
  const cacheKey = await createTranslationFingerprint(normalizedTexts, targetLanguage)

  const cachedEntry = translationCacheState.cache.get(cacheKey)
  if (cachedEntry && cachedEntry.expiresAt > Date.now()) {
    return {
      cacheKey,
      cacheStatus: 'hit',
      translatedText: cachedEntry.translatedText,
    }
  }

  const pending = translationCacheState.pending.get(cacheKey)
  if (pending) {
    const translatedText = await pending
    return {
      cacheKey,
      cacheStatus: 'hit',
      translatedText,
    }
  }

  const translationPromise = (async () => {
    const { sourceToUniqueIndex, uniqueTexts } = dedupeTexts(inputTexts)
    const providerResponse = await jigsawstack.translate.text({
      text: uniqueTexts.length === 1 ? uniqueTexts[0] : uniqueTexts,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      target_language: targetLanguage as any,
    })

    const translatedUniqueTexts = normalizeProviderResponse(providerResponse, uniqueTexts.length)
    const translatedTexts = expandDedupedTranslations(translatedUniqueTexts, sourceToUniqueIndex)
    const translatedText = Array.isArray(text) ? translatedTexts : (translatedTexts[0] ?? '')

    translationCacheState.cache.set(cacheKey, {
      expiresAt: Date.now() + translationCacheTtlSeconds * 1000,
      translatedText,
    })

    return translatedText
  })()

  translationCacheState.pending.set(cacheKey, translationPromise)

  try {
    const translatedText = await translationPromise
    return {
      cacheKey,
      cacheStatus: 'miss',
      translatedText,
    }
  } finally {
    translationCacheState.pending.delete(cacheKey)
  }
}

function normalizeProviderResponse(response: unknown, expectedLength: number): string[] {
  const translated =
    typeof response === 'object' && response !== null && 'translated_text' in response
      ? (response as { translated_text?: unknown }).translated_text
      : response

  if (typeof translated === 'string') {
    if (expectedLength !== 1) {
      throw new Error('Translation provider returned a single string for a batch request')
    }

    return [translated]
  }

  if (Array.isArray(translated) && translated.every((item) => typeof item === 'string')) {
    if (translated.length !== expectedLength) {
      throw new Error('Translation provider returned an unexpected number of results')
    }

    return translated
  }

  throw new Error('Unexpected translation provider response shape')
}

function readPositiveInt(raw: string | undefined, fallback: number): number {
  const parsed = Number.parseInt(raw || '', 10)

  if (Number.isNaN(parsed) || parsed <= 0) {
    return fallback
  }

  return parsed
}
