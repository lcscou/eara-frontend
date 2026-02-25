import ArchiveCaseStudies from '@/components/templates/CaseStudies/ArchiveCaseStudies'
import PageTitleBar from '@/components/ui/PageTitleBar/PageTitleBar'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'EARA | Case Studies',
  description: 'Stay updated with the latest case studies from EARA.',
}

export default function CaseStudiesPage() {
  return (
    <>
      <PageTitleBar title="Case Studies" subtitle="case studies" />
      <main>
        <ArchiveCaseStudies />
      </main>
    </>
  )
}
