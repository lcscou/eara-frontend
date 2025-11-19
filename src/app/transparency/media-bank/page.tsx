'use client'
import ArchiveMediaBank from '@/components/templates/MediaBank/ArchiveMediaBank'
import PageTitleBar from '@/components/ui/PageTitleBar/PageTitleBar'
import { Suspense } from 'react'

export default function MediaBank() {
  return (
    <>
      <PageTitleBar title="Media Bank" subtitle="media bank" />
      <Suspense fallback={<div>Loading media bank…</div>}>
        <ArchiveMediaBank />
      </Suspense>
    </>
  )
}
