'use client'

import { ActionIcon, Loader, Menu, Tooltip } from '@mantine/core'
import { IconLanguage, IconX } from '@tabler/icons-react'
import { useCallback, useRef, useState } from 'react'

import {
  readCachedBrowserTranslation,
  writeCachedBrowserTranslation,
} from '@/lib/translation/shared'

const LANGUAGES = [
  { code: 'ar', label: 'العربية' },
  { code: 'zh', label: '中文' },
  { code: 'nl', label: 'Nederlands' },
  { code: 'en', label: 'English' },
  { code: 'fr', label: 'Français' },
  { code: 'de', label: 'Deutsch' },
  { code: 'it', label: 'Italiano' },
  { code: 'ja', label: '日本語' },
  { code: 'ko', label: '한국어' },
  { code: 'pl', label: 'Polski' },
  { code: 'pt', label: 'Português' },
  { code: 'ru', label: 'Русский' },
  { code: 'es', label: 'Español' },
  { code: 'tr', label: 'Türkçe' },
  { code: 'uk', label: 'Українська' },
]

const BATCH_SIZE = 20
const TEXT_NODE = 3

type TextNodeEntry = { node: Text; original: string }

function collectTextNodes(root: Element): TextNodeEntry[] {
  const entries: TextNodeEntry[] = []
  const skipTags = new Set(['SCRIPT', 'STYLE', 'NOSCRIPT', 'TEXTAREA', 'INPUT'])

  const walk = (node: Node) => {
    if (node.nodeType === TEXT_NODE) {
      const text = node.textContent?.trim()
      if (text && text.length > 1) {
        entries.push({ node: node as Text, original: node.textContent! })
      }
    } else if (node.nodeType === Node.ELEMENT_NODE) {
      if (skipTags.has((node as Element).tagName)) return
      node.childNodes.forEach(walk)
    }
  }

  walk(root)
  return entries
}

async function translateBatch(texts: string[], targetLanguage: string): Promise<string[]> {
  const cachedTexts = await readCachedBrowserTranslation(texts, targetLanguage)
  if (cachedTexts) {
    return cachedTexts
  }

  const response = await fetch('/api/translate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text: texts, target_language: targetLanguage }),
  })

  if (!response.ok) {
    throw new Error(`Translation API error: ${response.status}`)
  }

  const data = await response.json()
  const translated = data.translated_text
  const translatedTexts = Array.isArray(translated) ? translated : [translated]

  await writeCachedBrowserTranslation(texts, targetLanguage, translatedTexts)

  return translatedTexts
}

export default function TranslationWidget() {
  const [activeLanguage, setActiveLanguage] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [opened, setOpened] = useState(false)
  const originalNodesRef = useRef<TextNodeEntry[]>([])

  const restoreOriginal = useCallback(() => {
    for (const { node, original } of originalNodesRef.current) {
      node.textContent = original
    }
    originalNodesRef.current = []
    setActiveLanguage(null)
  }, [])

  const handleLanguageSelect = useCallback(
    async (langCode: string) => {
      if (activeLanguage) {
        restoreOriginal()
      }

      if (langCode === activeLanguage) return

      setLoading(true)
      setOpened(false)

      try {
        const mainContent =
          document.querySelector('main') ?? document.querySelector('#__next') ?? document.body

        const entries = collectTextNodes(mainContent)
        originalNodesRef.current = entries

        const texts = entries.map((e) => e.node.textContent!)

        for (let i = 0; i < texts.length; i += BATCH_SIZE) {
          const batch = texts.slice(i, i + BATCH_SIZE)
          const translated = await translateBatch(batch, langCode)
          translated.forEach((translatedText, j) => {
            const entry = entries[i + j]
            if (entry) {
              entry.node.textContent = translatedText
            }
          })
        }

        setActiveLanguage(langCode)
      } catch (error) {
        console.error('Translation error:', error)
        restoreOriginal()
      } finally {
        setLoading(false)
      }
    },
    [activeLanguage, restoreOriginal]
  )

  return (
    <div className="flex aspect-square w-13.75 items-center justify-center">
      {loading ? (
        <div className="flex aspect-square w-13.75 cursor-not-allowed items-center justify-center rounded-full bg-[#D5D7F3]">
          <Loader size="xs" />
        </div>
      ) : activeLanguage ? (
        <Tooltip label="Restore original" position="left">
          <ActionIcon
            onClick={restoreOriginal}
            radius="xl"
            size={55}
            className="bg-[#D5D7F3] text-black hover:bg-white"
            aria-label="Restore original language"
          >
            <IconX size={20} />
          </ActionIcon>
        </Tooltip>
      ) : (
        <Menu opened={opened} onChange={setOpened} position="top-end" offset={8} withinPortal>
          <Menu.Target>
            <Tooltip label="Translate page" position="left" disabled={opened}>
              <ActionIcon
                radius="xl"
                size={55}
                className="bg-[#D5D7F3] text-black hover:bg-white"
                aria-label="Translate page"
              >
                <IconLanguage size={22} />
              </ActionIcon>
            </Tooltip>
          </Menu.Target>
          <Menu.Dropdown>
            <Menu.Label>Select language</Menu.Label>
            {LANGUAGES.map((lang) => (
              <Menu.Item key={lang.code} onClick={() => handleLanguageSelect(lang.code)}>
                {lang.label}
              </Menu.Item>
            ))}
          </Menu.Dropdown>
        </Menu>
      )}
    </div>
  )
}
