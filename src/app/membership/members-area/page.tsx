import { redirect } from 'next/navigation'

// import LogoutButton from '@/components/auth/LogoutButton'
import MembersArea from '@/components/templates/MembersArea/MembersArea'
import { getAuthToken } from '@/lib/auth/server'
import { Container } from '@mantine/core'

export const metadata = {
  title: 'Members Area | Eara',
}

export default async function MembersAreaPage() {
  const token = await getAuthToken()

  if (!token) {
    redirect('/login?redirect=/membership/members-area')
  }

  return (
    <div className="my-[100px] py-10">
      <Container size="xl">
        <MembersArea />
      </Container>
    </div>
  )
}
