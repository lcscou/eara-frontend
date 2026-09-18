import { cookies } from 'next/headers'

import { getCurrentServerSiteConfig } from '../site-config-server'
import { getAuthCookieName } from './constants'

export async function getAuthToken() {
  const cookieStore = await cookies()
  const site = await getCurrentServerSiteConfig()
  return cookieStore.get(getAuthCookieName(site.key))?.value ?? null
}

/**
 * Valida se o token de autenticação é válido consultando o WordPress
 * @returns true se o token é válido, false caso contrário
 */
export async function validateAuthToken(): Promise<boolean> {
  const token = await getAuthToken()

  if (!token) {
    return false
  }

  const site = await getCurrentServerSiteConfig()

  try {
    const response = await fetch(site.graphqlEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        query: `
          query Viewer {
            viewer {
              id
            }
          }
        `,
      }),
      cache: 'no-store',
    })

    const result = await response.json()

    // Token é válido se não há erros e viewer existe
    return !result?.errors?.length && !!result?.data?.viewer?.id
  } catch {
    return false
  }
}
