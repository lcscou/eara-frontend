'use client'

import { GetAllTickersDocument } from '@/graphql/generated/graphql'
import { TickerProps } from '@/lib/types'
import { useSuspenseQuery } from '@apollo/client/react'
export function useTicker() {
  const { data, error, refetch } = useSuspenseQuery(GetAllTickersDocument, {
    context: {
      fetchOptions: {
        next: {
          tags: ['tickers'],
        },
      },
    },
  })
  const tickers: TickerProps['messages'] = []
  data.tickers?.nodes.forEach((ticker) => {
    if (ticker) {
      tickers.push({
        id: ticker.id,
        text: ticker.acfTicker?.message || '',
        link: ticker.acfTicker?.link?.uri || '',
        linkLabel: ticker.acfTicker?.link?.label || '',
        displayFrequency:
          (ticker.acfTicker?.recurrence as 'every-day' | 'once-a-week' | 'once-a-month' | null) ||
          'every-day',
      })
    }
  })

  return {
    tickers: tickers,
    error,
    refetch,
  }
}
