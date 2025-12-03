import ArchiveTeam from '@/components/templates/Team/ArchiveTeam'
import PageTitleBar from '@/components/ui/PageTitleBar/PageTitleBar'

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
