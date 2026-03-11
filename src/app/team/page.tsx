import ArchiveTeam from '@/components/templates/Team/ArchiveTeam'
import PageTitleBar from '@/components/ui/PageTitleBar/PageTitleBar'
import { Metadata } from 'next'
export const metadata: Metadata = {
  title: 'EARA | Team and Delegates',
  description: 'Learn more about the team and delegates of EARA.',
}

export default function Team() {
  return (
    <>
      <PageTitleBar title="Team and Delegates" subtitle="ABOUT EARA" />
      <main>
        <ArchiveTeam />
      </main>
    </>
  )
}
