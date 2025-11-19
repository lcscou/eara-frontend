import ArchiveCaseStudies from '@/components/templates/CaseStudies/ArchiveCaseStudies'
import PageTitleBar from '@/components/ui/PageTitleBar/PageTitleBar'

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
