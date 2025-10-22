'use client'
import { Button, Popover } from '@mantine/core'
import { InfoButtonProps } from '@/lib/types'
import { IconInfoCircle } from '@tabler/icons-react'

export default function InfoButton({ content, width = 420 }: InfoButtonProps) {
  return (
    <>
      <Popover
        width={width}
        shadow="md"
        withArrow
        withOverlay
        overlayProps={{ zIndex: 1000000, blur: '7px' }}
        zIndex={1000001}
      >
        <Popover.Target>
          <div className="duration-300">
            <Button
              unstyled
              className="bg-primaryColor flex aspect-square w-[55px] cursor-pointer items-center justify-center rounded-full transition-all duration-100 hover:brightness-125"
            >
              <IconInfoCircle color="white" />
            </Button>
          </div>
        </Popover.Target>
        <Popover.Dropdown>
          <div className="flex flex-col gap-2 p-2">{content}</div>
        </Popover.Dropdown>
      </Popover>
    </>
  )
}
