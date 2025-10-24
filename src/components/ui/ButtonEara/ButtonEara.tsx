import { ButtonEaraProps } from '@/lib/types'
import { Button } from '@mantine/core'
import { IconArrowRight } from '@tabler/icons-react'
import clsx from 'clsx'
import s from './ButtonEara.module.css'
export default function ButtonEara({
  RightSection,
  label,
  leftSection,
  link,
  className,
  target,
  variant = 'filled',
}: ButtonEaraProps) {
  return (
    <>
      {variant == 'filled' && (
        <Button
          // component={link ?? 'a'}
          leftSection={leftSection}
          {...(link ? { component: 'a' } : {})}
          {...(link ? { href: link } : {})}
          {...(link && target ? { target: target } : {})}
          rightSection={RightSection}
          // fw="medium"
          className={className}
          tt="uppercase"
          size="lg"
          styles={{
            label: {
              fontWeight: '400',
              fontSize: '13px',
              letterSpacing: '.8px',
            },
          }}
        >
          {label}
        </Button>
      )}
      {variant == 'outline' && (
        <Button
          // component={link ?? 'a'}
          leftSection={leftSection}
          {...(link ? { component: 'a' } : {})}
          {...(link ? { href: link } : {})}
          {...(link && target ? { target: target } : {})}
          rightSection={RightSection}
          variant="outline"
          tt="uppercase"
          className={className}
          size="lg"
          c="white"
          styles={{
            root: {
              borderColor: 'white',
            },
            label: {
              fontWeight: '400',
              fontSize: '13px',
              letterSpacing: '.8px',
            },
          }}
        >
          {label}
        </Button>
      )}
      {variant == 'link' && (
        <Button
          leftSection={leftSection}
          {...(link ? { component: 'a' } : {})}
          {...(link ? { href: link } : {})}
          {...(link && target ? { target: target } : {})}
          rightSection={RightSection || <IconArrowRight size={16} />}
          unstyled
          tt="uppercase"
          className={clsx(className, s.link, 'hover:opacity-85')}
          size="lg"
          c="primaryColor.9"
          styles={{
            inner: {
              display: 'flex',
              alignItems: 'center',
              gap: 15,
              borderBottom: '1px solid var(--color-primaryColor)',
            },
            root: {
              borderColor: 'white',
              width: 'fit-content',
            },
            label: {
              fontWeight: '400',
              fontSize: '13px',
              letterSpacing: '.8px',
            },
          }}
        >
          {label}
        </Button>
      )}
      {variant == 'with-arrow' && (
        <Button
          className={clsx(s.withArrow, className)}
          // component={link ?? 'a'}
          leftSection={leftSection}
          {...(link ? { component: 'a' } : {})}
          {...(link ? { href: link } : {})}
          {...(link && target ? { target: target } : {})}
          rightSection={
            <div
              className={clsx(
                'flex aspect-square h-[48.4px] items-center justify-center rounded-full p-1',
                s.arrowIcon
              )}
            >
              <IconArrowRight
                className={clsx('bg-secondaryColor h-full w-full rounded-full p-2 text-black')}
              />
            </div>
          }
          variant="filled"
          tt="uppercase"
          size="lg"
          c="white"
          styles={{
            root: {
              paddingRight: '0px',
              // borderColor: "white"
            },
            label: {
              fontWeight: '400',
              fontSize: '13px',
              letterSpacing: '.8px',
            },
          }}
        >
          {label}
        </Button>
      )}
    </>
  )
}
