'use client'
import { ResultNotFoundProps } from '@/lib/types'
import { Button, Title } from '@mantine/core'
import { IconRestore, IconZoomCancel } from '@tabler/icons-react'

export default function ResultNotFound({ resetFilters }: ResultNotFoundProps) {
  return (
    <>
      <div className="flex flex-col items-center justify-center gap-10 py-10">
        <IconZoomCancel size={150} stroke={1.1} className="mt-10 text-[#d6d6ec]" />
        <div className="flex flex-col items-center gap-4">
          <Title order={5} className="mt-10">
            No result found.
          </Title>
          <p>We can&apos;t find any item matching your criteria.</p>
          <Button
            className="mt-4"
            variant="light"
            leftSection={<IconRestore size={18} />}
            onClick={resetFilters}
          >
            Reset Filters
          </Button>
        </div>
      </div>
    </>
  )
}
