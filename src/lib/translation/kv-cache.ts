import { Redis } from '@upstash/redis'
import { JigsawStack } from 'jigsawstack'

import {
  createTranslationCacheKey,
  createTranslationFingerprint,
  dedupeTexts,
  expandDedupedTranslations,
  normalizeTranslationText,
} from './shared'

const jigsawstackApiKey = process.env.JIGSAWSTACK_API_KEY
const redis = createRedisClient()
const redisIsConfigured = redis !== null

const translationCacheTtlSeconds = readPositiveInt(
  process.env.TRANSLATION_CACHE_TTL_SECONDS,
  60 * 60 * 24 * 30
)

const translationChunkSize = readPositiveInt(process.env.TRANSLATION_CHUNK_SIZE, 20)
const translationChunkCharLimit = readPositiveInt(process.env.TRANSLATION_CHUNK_CHAR_LIMIT, 4500)

type TranslationInput = string | string[]

type CachedTranslationEntry = {
  expiresAt: number
  translatedText: string
}

type TranslationCacheState = {
  cache: Map<string, CachedTranslationEntry>
  pending: Map<string, Promise<string>>
}

type UniqueTranslationItem = {
  cacheKey: string
  index: number
  text: string
}

type TranslationRedisClient = {
  mget: (...keys: string[]) => Promise<Array<string | null>>
  set: (key: string, value: string, options?: { ex?: number }) => Promise<unknown>
}

const globalForTranslations = globalThis as typeof globalThis & {
  __translationCacheState?: TranslationCacheState
}

const translationCacheState: TranslationCacheState =
  globalForTranslations.__translationCacheState ?? {
    cache: new Map<string, CachedTranslationEntry>(),
    pending: new Map<string, Promise<string>>(),
  }

globalForTranslations.__translationCacheState = translationCacheState

const jigsawstack =
  jigsawstackApiKey !== undefined
    ? JigsawStack({
        apiKey: jigsawstackApiKey,
      })
    : null

export type TranslationCacheStatus = 'hit' | 'miss' | 'partial'

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
  const { sourceToUniqueIndex, uniqueTexts } = dedupeTexts(inputTexts)

  const uniqueItems = await Promise.all(
    uniqueTexts.map(
      async (uniqueText, index): Promise<UniqueTranslationItem> => ({
        cacheKey: await createTranslationCacheKey(targetLanguage, uniqueText),
        index,
        text: uniqueText,
      })
    )
  )

  const resolvedUniqueTexts: Array<string | undefined> = new Array(uniqueItems.length)
  const pendingWaits: Promise<void>[] = []
  const providerQueue: UniqueTranslationItem[] = []
  let cacheHitCount = 0

  for (const item of uniqueItems) {
    const memoryHit = readMemoryCache(item.cacheKey)

    if (memoryHit !== null) {
      resolvedUniqueTexts[item.index] = memoryHit
      cacheHitCount += 1
      continue
    }

    const pending = translationCacheState.pending.get(item.cacheKey)

    if (pending) {
      pendingWaits.push(
        pending.then((translatedText) => {
          resolvedUniqueTexts[item.index] = translatedText
          cacheHitCount += 1
        })
      )
      continue
    }

    providerQueue.push(item)
  }

  if (redisIsConfigured && providerQueue.length > 0) {
    const redisHits = await readRedisTranslations(providerQueue.map((item) => item.cacheKey))
    const remainingQueue: UniqueTranslationItem[] = []

    for (const item of providerQueue) {
      const cachedText = redisHits.get(item.cacheKey)

      if (cachedText !== undefined) {
        resolvedUniqueTexts[item.index] = cachedText
        cacheHitCount += 1
        writeMemoryCache(item.cacheKey, cachedText)
        continue
      }

      remainingQueue.push(item)
    }

    providerQueue.length = 0
    providerQueue.push(...remainingQueue)
  }

  for (const chunk of chunkTranslationItems(
    providerQueue,
    translationChunkSize,
    translationChunkCharLimit
  )) {
    const chunkTranslationPromise = translateTextChunk(
      chunk.map((item) => item.text),
      targetLanguage
    )

    const chunkPendingPromises = chunk.map((item, index) => {
      const itemPromise = chunkTranslationPromise.then(
        (translatedTexts) => translatedTexts[index] ?? ''
      )
      translationCacheState.pending.set(item.cacheKey, itemPromise)

      return itemPromise
        .then((translatedText) => {
          resolvedUniqueTexts[item.index] = translatedText
          writeMemoryCache(item.cacheKey, translatedText)
        })
        .finally(() => {
          if (translationCacheState.pending.get(item.cacheKey) === itemPromise) {
            translationCacheState.pending.delete(item.cacheKey)
          }
        })
    })

    const translatedTexts = await chunkTranslationPromise
    await Promise.all(chunkPendingPromises)
    await writeRedisTranslations(chunk, translatedTexts)
  }

  await Promise.all(pendingWaits)

  const finalUniqueTexts = resolvedUniqueTexts.map((translatedText, index) => {
    return translatedText ?? uniqueItems[index]?.text ?? ''
  })
  const translatedTexts = expandDedupedTranslations(finalUniqueTexts, sourceToUniqueIndex)
  const translatedText = Array.isArray(text) ? translatedTexts : (translatedTexts[0] ?? '')
  const cacheStatus: TranslationCacheStatus =
    providerQueue.length === 0 ? 'hit' : cacheHitCount > 0 ? 'partial' : 'miss'

  return {
    cacheKey,
    cacheStatus,
    translatedText,
  }
}

function readMemoryCache(cacheKey: string): string | null {
  const cachedEntry = translationCacheState.cache.get(cacheKey)

  if (!cachedEntry) {
    return null
  }

  if (cachedEntry.expiresAt <= Date.now()) {
    translationCacheState.cache.delete(cacheKey)
    return null
  }

  return cachedEntry.translatedText
}

function writeMemoryCache(cacheKey: string, translatedText: string): void {
  translationCacheState.cache.set(cacheKey, {
    expiresAt: Date.now() + translationCacheTtlSeconds * 1000,
    translatedText,
  })
}

async function readRedisTranslations(cacheKeys: string[]): Promise<Map<string, string>> {
  const cachedTranslations = new Map<string, string>()

  if (!redis || cacheKeys.length === 0) {
    return cachedTranslations
  }

  const values = await redis.mget(...cacheKeys)

  values.forEach((value, index) => {
    if (typeof value === 'string') {
      cachedTranslations.set(cacheKeys[index], value)
    }
  })

  return cachedTranslations
}

async function writeRedisTranslations(
  items: UniqueTranslationItem[],
  translatedTexts: string[]
): Promise<void> {
  if (!redis || items.length === 0) {
    return
  }

  await Promise.all(
    items.map(async (item, index) => {
      const translatedText = translatedTexts[index] ?? ''
      writeMemoryCache(item.cacheKey, translatedText)

      await redis.set(item.cacheKey, translatedText, {
        ex: translationCacheTtlSeconds,
      })
    })
  )
}

function chunkTranslationItems(
  items: UniqueTranslationItem[],
  maxItems: number,
  maxChars: number
): UniqueTranslationItem[][] {
  const chunks: UniqueTranslationItem[][] = []
  let currentChunk: UniqueTranslationItem[] = []
  let currentChars = 0

  for (const item of items) {
    const itemLength = normalizeTranslationText(item.text).length
    const wouldExceedItemLimit = currentChunk.length >= maxItems
    const wouldExceedCharLimit = currentChunk.length > 0 && currentChars + itemLength > maxChars

    if (wouldExceedItemLimit || wouldExceedCharLimit) {
      chunks.push(currentChunk)
      currentChunk = []
      currentChars = 0
    }

    currentChunk.push(item)
    currentChars += itemLength
  }

  if (currentChunk.length > 0) {
    chunks.push(currentChunk)
  }

  return chunks
}

async function translateTextChunk(texts: string[], targetLanguage: string): Promise<string[]> {
  if (texts.length === 0) {
    return []
  }

  const response = await jigsawstack!.translate.text({
    text: texts.length === 1 ? texts[0] : texts,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    target_language: targetLanguage as any,
  })

  return normalizeProviderResponse(response, texts.length)
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

function createRedisClient(): TranslationRedisClient | null {
  const redisUrl =
    process.env.UPSTASH_REDIS_REST_URL ?? process.env.KV_REST_API_URL ?? process.env.REDIS_URL
  const redisToken =
    process.env.UPSTASH_REDIS_REST_TOKEN ?? process.env.KV_REST_API_TOKEN ?? process.env.REDIS_TOKEN

  if (!redisUrl || !redisToken) {
    return null
  }

  return new Redis({
    token: redisToken,
    url: redisUrl,
  }) as TranslationRedisClient
}
