/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from 'next/server'

// This route runs server-side only; Mailchimp credentials never reach the client.
export async function POST(request: NextRequest) {
  const apiKey = process.env.MAILCHIMP_API_KEY
  const audienceId = process.env.MAILCHIMP_AUDIENCE_ID
  const serverPrefix = process.env.MAILCHIMP_SERVER || process.env.MAILCHIMP_SERVER_PREFIX

  if (!apiKey || !audienceId || !serverPrefix) {
    return NextResponse.json(
      {
        error:
          'Mailchimp is not configured. Set MAILCHIMP_API_KEY, MAILCHIMP_SERVER, MAILCHIMP_AUDIENCE_ID.',
      },
      { status: 500 }
    )
  }

  let body: unknown
  try {
    body = await request.json()
  } catch (error) {
    return NextResponse.json(
      { error: 'Invalid JSON body', detail: (error as Error).message },
      { status: 400 }
    )
  }

  const { firstName, lastName, organization, email, country, interests } = (body || {}) as {
    firstName?: string
    lastName?: string
    organization?: string
    email?: string
    country?: string
    interests?: string[]
  }

  if (!email || !firstName || !lastName || !country) {
    return NextResponse.json(
      { error: 'Missing required fields: firstName, lastName, email, country' },
      { status: 400 }
    )
  }

  const memberPayload = {
    email_address: email,
    status: 'subscribed', // pending = double opt-in; switch to 'subscribed' if auto opt-in is preferred
    merge_fields: {
      FNAME: firstName,
      LNAME: lastName,
      ORG: organization ?? '',
      COUNTRY: country,
    },
    tags: Array.isArray(interests)
      ? interests.map((value) => {
          switch (value) {
            case 'news-digest':
              return 'News Digest'
            case 'policy-briefing':
              return 'Policy Briefing'
            case 'training-and-events':
              return 'Training and events'
            default:
              return value
          }
        })
      : [],
  }

  const endpoint = `https://${serverPrefix}.api.mailchimp.com/3.0/lists/${audienceId}/members`
  const authHeader = Buffer.from(`anystring:${apiKey}`).toString('base64')

  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      Authorization: `Basic ${authHeader}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(memberPayload),
  })

  let mcResponse: any = null
  try {
    mcResponse = await response.json()
  } catch {
    // keep mcResponse as null if parsing fails
  }

  // Member already exists — treat as a successful noop for UX
  if (response.status === 400 && mcResponse?.title === 'Member Exists') {
    return NextResponse.json({ status: 'already-subscribed' }, { status: 200 })
  }

  if (!response.ok) {
    return NextResponse.json(
      {
        error: 'Failed to subscribe in Mailchimp',
        detail: mcResponse?.detail ?? mcResponse?.title ?? 'Unexpected Mailchimp error',
      },
      { status: response.status }
    )
  }

  return NextResponse.json({ status: 'subscribed', id: mcResponse?.id ?? null }, { status: 200 })
}

export const runtime = 'nodejs'
