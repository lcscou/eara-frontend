import ArchiveMediaBank from '@/components/templates/MediaBank/ArchiveMediaBank'
import PageTitleBar from '@/components/ui/PageTitleBar/PageTitleBar'
import { Metadata } from 'next'
export const metadata: Metadata = {
  title: 'EARA | Media Bank',
  description:
    'Access the EARA Media Bank for a collection of images, videos, and other media resources related to animal research and welfare.',
}

export default function MediaBank() {
  return (
    <>
      <PageTitleBar title="Media Bank" subtitle="media bank" />
      <main>
        <ArchiveMediaBank />
      </main>
    </>
  )
}
