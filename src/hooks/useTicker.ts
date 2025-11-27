'use client'

import { GetAllTickersDocument } from '@/graphql/generated/graphql'
import { useSuspenseQuery } from '@apollo/client/react'

export function useTicker() {
  const { data, error, refetch } = useSuspenseQuery(GetAllTickersDocument)

  return {
    tickers: data?.tickers?.nodes ?? [],
    error,
    refetch,
  }
}
