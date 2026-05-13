const TRANSLATION_CACHE_VERSION = 'v1'
const TRANSLATION_KV_KEY_PREFIX = 'eara:translation'
const CLIENT_CACHE_PREFIX = 'eara:translation-batch'
const CLIENT_CACHE_TTL_MS = 7 * 24 * 60 * 60 * 1000

type BrowserTranslationCacheEntry = {
  expiresAt: number
  translatedTexts: string[]
}

type DedupeResult = {
  sourceToUniqueIndex: number[]
  uniqueTexts: string[]
}

export function normalizeTranslationText(text: string): string {
  return text.normalize('NFC').replace(/\r\n/g, '\n')
}

export async function createTranslationFingerprint(
  texts: string[],
  targetLanguage: string
): Promise<string> {
  const payload = JSON.stringify({
    version: TRANSLATION_CACHE_VERSION,
    targetLanguage,
    texts: texts.map(normalizeTranslationText),
  })

  return hashTranslationPayload(payload)
}

export async function createTranslationCacheKey(
  targetLanguage: string,
  text: string
): Promise<string> {
  const payload = JSON.stringify({
    version: TRANSLATION_CACHE_VERSION,
    targetLanguage,
    text: normalizeTranslationText(text),
  })

  const hash = await hashTranslationPayload(payload)
  return `${TRANSLATION_KV_KEY_PREFIX}:${targetLanguage}:${hash}`
}

export function dedupeTexts(texts: string[]): DedupeResult {
  const uniqueTexts: string[] = []
  const sourceToUniqueIndex: number[] = []
  const lookup = new Map<string, number>()

  for (const text of texts) {
    const normalized = normalizeTranslationText(text)
    const existingIndex = lookup.get(normalized)

    if (existingIndex === undefined) {
      const nextIndex = uniqueTexts.length
      lookup.set(normalized, nextIndex)
      uniqueTexts.push(text)
      sourceToUniqueIndex.push(nextIndex)
      continue
    }

    sourceToUniqueIndex.push(existingIndex)
  }

  return {
    sourceToUniqueIndex,
    uniqueTexts,
  }
}

export function expandDedupedTranslations(
  uniqueTranslatedTexts: string[],
  sourceToUniqueIndex: number[]
): string[] {
  return sourceToUniqueIndex.map((uniqueIndex) => uniqueTranslatedTexts[uniqueIndex] ?? '')
}

export async function readCachedBrowserTranslation(
  texts: string[],
  targetLanguage: string
): Promise<string[] | null> {
  if (typeof window === 'undefined' || !window.localStorage) {
    return null
  }

  const key = await getBrowserCacheKey(texts, targetLanguage)
  const raw = window.localStorage.getItem(key)

  if (!raw) {
    return null
  }

  try {
    const parsed = JSON.parse(raw) as BrowserTranslationCacheEntry

    if (!parsed?.expiresAt || parsed.expiresAt <= Date.now()) {
      window.localStorage.removeItem(key)
      return null
    }

    if (!Array.isArray(parsed.translatedTexts)) {
      window.localStorage.removeItem(key)
      return null
    }

    return parsed.translatedTexts.every((text) => typeof text === 'string')
      ? parsed.translatedTexts
      : null
  } catch {
    window.localStorage.removeItem(key)
    return null
  }
}

export async function writeCachedBrowserTranslation(
  texts: string[],
  targetLanguage: string,
  translatedTexts: string[]
): Promise<void> {
  if (typeof window === 'undefined' || !window.localStorage) {
    return
  }

  const key = await getBrowserCacheKey(texts, targetLanguage)
  const entry: BrowserTranslationCacheEntry = {
    expiresAt: Date.now() + CLIENT_CACHE_TTL_MS,
    translatedTexts,
  }

  try {
    window.localStorage.setItem(key, JSON.stringify(entry))
  } catch {
    pruneBrowserCache()

    try {
      window.localStorage.setItem(key, JSON.stringify(entry))
    } catch {
      // Ignore storage quota issues.
    }
  }
}

async function getBrowserCacheKey(texts: string[], targetLanguage: string): Promise<string> {
  const fingerprint = await createTranslationFingerprint(texts, targetLanguage)
  return `${CLIENT_CACHE_PREFIX}:${targetLanguage}:${fingerprint}`
}

function pruneBrowserCache(): void {
  if (typeof window === 'undefined' || !window.localStorage) {
    return
  }

  const keysToRemove: string[] = []

  for (let index = 0; index < window.localStorage.length; index += 1) {
    const key = window.localStorage.key(index)
    if (key?.startsWith(CLIENT_CACHE_PREFIX)) {
      keysToRemove.push(key)
    }
  }

  for (const key of keysToRemove.slice(0, Math.ceil(keysToRemove.length / 2))) {
    window.localStorage.removeItem(key)
  }
}

async function hashTranslationPayload(payload: string): Promise<string> {
  const encoded = new TextEncoder().encode(payload)
  const digest = await crypto.subtle.digest('SHA-256', encoded)

  return Array.from(new Uint8Array(digest), (byte) => byte.toString(16).padStart(2, '0')).join('')
}
