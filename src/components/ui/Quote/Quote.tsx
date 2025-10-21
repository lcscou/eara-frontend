import { Avatar, Group, Stack } from '@mantine/core'
import { IconQuoteFilled } from '@tabler/icons-react'
import s from './Quote.module.css'
import clsx from 'clsx'
import { QuoteProps } from '@/lib/types'
export default function Quote({ texto, author, avatar, variant = 'dark' }: QuoteProps) {
  return (
    <>
      <div
        className={clsx(
          s.root,
          variant === 'light'
            ? 'bg-color-earaBgDark font-normal text-black'
            : 'bg-white font-light text-black'
        )}
      >
        <Stack gap={25}>
          <IconQuoteFilled size={110} className="text-primaryColor" />
          <h2>{texto}</h2>
          <Group gap={20}>
            {avatar && <Avatar src={avatar} alt="EARA Quote Author" />}
            <h5>{author}</h5>
          </Group>
        </Stack>
      </div>
    </>
  )
}