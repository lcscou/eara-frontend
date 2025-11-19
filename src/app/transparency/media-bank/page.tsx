'use client'
import ArchiveMediaBank from '@/components/templates/MediaBank/ArchiveMediaBank'
import PageTitleBar from '@/components/ui/PageTitleBar/PageTitleBar'

export default function MediaBank() {
  return (
    <>
      <PageTitleBar title="Media Bank" subtitle="media bank" />
      <ArchiveMediaBank />
    </>
  )
}
