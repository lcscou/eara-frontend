import { NextResponse } from 'next/server'

const RESET_PASSWORD_MUTATION = `
  mutation ResetUserPassword($input: ResetUserPasswordInput!) {
    resetUserPassword(input: $input) {
      user {
        id
        name
        email
      }
    }
  }
`

export async function POST(request: Request) {
  try {
    const { key, login, password } = await request.json()

    if (!key || !login || !password) {
      return NextResponse.json(
        { error: 'Key, login, and new password are required.' },
        { status: 400 }
      )
    }

    const endpoint =
      process.env.WORDPRESS_GRAPHQL_ENDPOINT || process.env.NEXT_PUBLIC_WORDPRESS_GRAPHQL_ENDPOINT

    if (!endpoint) {
      return NextResponse.json(
        { error: 'WordPress GraphQL endpoint is not configured.' },
        { status: 500 }
      )
    }

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: RESET_PASSWORD_MUTATION,
        variables: { input: { key, login, password } },
      }),
      cache: 'no-store',
    })

    const result = await response.json()

    if (result?.errors?.length) {
      return NextResponse.json({ error: result.errors[0]?.message }, { status: 400 })
    }

    return NextResponse.json({ user: result?.data?.resetUserPassword?.user ?? null })
  } catch {
    return NextResponse.json(
      { error: 'Unable to reset the password at the moment.' },
      { status: 500 }
    )
  }
}
