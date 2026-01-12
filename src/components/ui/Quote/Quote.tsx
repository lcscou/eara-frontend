import { QuoteProps } from '@/lib/types'
import { Avatar, Group, Stack, Title } from '@mantine/core'
import { IconQuoteFilled } from '@tabler/icons-react'
import clsx from 'clsx'
import s from './Quote.module.css'
export default function Quote({
  texto,
  author,
  avatar,
  fontSize = 30,
  variant = 'dark',
}: QuoteProps) {
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
          <Title
            order={3}
            fz={fontSize}
            lh="xs"
            dangerouslySetInnerHTML={{ __html: texto }}
          ></Title>
          <Group gap={20}>
            {avatar && <Avatar src={avatar} alt="EARA Quote Author" />}
            <h5>{author}</h5>
          </Group>
        </Stack>
      </div>
    </>
  )
}
