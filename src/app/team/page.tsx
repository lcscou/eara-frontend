import ArchiveTeam from '@/components/templates/Team/ArchiveTeam'
import PageTitleBar from '@/components/ui/PageTitleBar/PageTitleBar'
import { Metadata } from 'next'
export const metadata: Metadata = {
  title: 'EARA | Team & Board',
  description: 'Learn more about the team and board members of EARA.',
}

export default function Team() {
  return (
    <>
      <PageTitleBar title="Team & Board" subtitle="ABOUT EARA" />
      <main>
        <ArchiveTeam />
      </main>
    </>
  )
}
