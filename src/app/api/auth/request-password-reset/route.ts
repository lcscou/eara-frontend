import { NextResponse } from 'next/server'

const SEND_RESET_EMAIL_MUTATION = `
  mutation SendPasswordResetEmail($input: SendPasswordResetEmailInput!) {
    sendPasswordResetEmail(input: $input) {
      success
    }
  }
`

export async function POST(request: Request) {
  try {
    const { username } = await request.json()

    if (!username) {
      return NextResponse.json({ error: 'Provide an email or username.' }, { status: 400 })
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
        query: SEND_RESET_EMAIL_MUTATION,
        variables: { input: { username } },
      }),
      cache: 'no-store',
    })

    const result = await response.json()

    if (result?.errors?.length) {
      return NextResponse.json({ error: result.errors[0]?.message }, { status: 400 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: 'Unable to request a password reset.' }, { status: 500 })
  }
}
