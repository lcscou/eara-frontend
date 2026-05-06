import { Container } from '@mantine/core'
import { Metadata } from 'next'
import { redirect } from 'next/navigation'

// import LogoutButton from '@/components/auth/LogoutButton'
import MembersArea from '@/components/templates/MembersArea/MembersArea'
import { GetPagesDocument, PostStatusEnum } from '@/graphql/generated/graphql'
import { getAuthenticatedClient } from '@/lib/apollo-client'
import { validateAuthToken } from '@/lib/auth/server'

export const metadata: Metadata = {
  title: 'EARA | Members Area',
  description: 'Access exclusive content and features in the EARA Members Area.',
}

export default async function MembersAreaPage() {
  const isValid = await validateAuthToken()

  if (!isValid) {
    redirect('/login?redirect=/membership/members-area')
  }

  const client = await getAuthenticatedClient()
  const { data } = await client.query({
    query: GetPagesDocument,
    variables: { status: PostStatusEnum.Private },
  })

  return (
    <div className="my-25 py-10">
      <Container size="xl">
        <MembersArea privatePages={data} />
      </Container>
    </div>
  )
}
