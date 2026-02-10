import { cookies } from 'next/headers'

import { AUTH_COOKIE_NAME } from './constants'

export async function getAuthToken() {
  const cookieStore = await cookies()
  return cookieStore.get(AUTH_COOKIE_NAME)?.value ?? null
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

  const endpoint =
    process.env.WORDPRESS_GRAPHQL_ENDPOINT || process.env.NEXT_PUBLIC_WORDPRESS_GRAPHQL_ENDPOINT

  if (!endpoint) {
    return false
  }

  try {
    const response = await fetch(endpoint, {
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
