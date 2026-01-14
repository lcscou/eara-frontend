import { ButtonEaraProps } from '@/lib/types'
import { Button } from '@mantine/core'
import { IconArrowRight } from '@tabler/icons-react'
import clsx from 'clsx'
import s from './ButtonEara.module.css'
export default function ButtonEara({
  label,
  leftSection,
  link,
  className,
  target,
  variant = 'filled',
  ...props
}: ButtonEaraProps) {
  return (
    <>
      {variant == 'filled' && (
        <Button
          // component={link ?? 'a'}

          {...(link ? { component: 'a' } : {})}
          {...(link ? { href: link } : {})}
          {...(link && target ? { target: target } : {})}
          // fw="medium"
          className={className}
          tt="uppercase"
          size="lg"
          styles={{
            label: {
              fontWeight: '400',
              fontSize: '13px',
              overflow: 'visible',
              letterSpacing: '.8px',
            },
          }}
          {...props}
        >
          {props.children || label}
        </Button>
      )}
      {variant == 'outline' && (
        <Button
          {...(link ? { component: 'a' } : {})}
          {...(link ? { href: link } : {})}
          {...(link && target ? { target: target } : {})}
          variant="outline"
          tt="uppercase"
          className={className}
          size="lg"
          c="white"
          leftSection={leftSection}
          styles={{
            root: {
              borderColor: props.bd?.toString() || 'white',
            },
            label: {
              fontWeight: '400',
              fontSize: '13px',
              letterSpacing: '.8px',
            },
          }}
          {...props}
        >
          {props.children || label}
        </Button>
      )}
      {variant == 'link' && (
        <Button
          leftSection={leftSection}
          {...(link ? { component: 'a' } : {})}
          {...(link ? { href: link } : {})}
          {...(link && target ? { target: target } : {})}
          rightSection={props.rightSection || <IconArrowRight size={16} />}
          unstyled
          tt="uppercase"
          className={clsx(className, s.link, 'hover:opacity-85')}
          size="lg"
          c="primaryColor.9"
          styles={{
            inner: {
              width: 'fit-content',
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
          {...props}
        >
          {props.children || label}
        </Button>
      )}
      {variant == 'with-arrow' && (
        <Button
          className={clsx(s.withArrow, className)}
          {...(link ? { component: 'a' } : {})}
          {...(link ? { href: link } : {})}
          {...(link && target ? { target: target } : {})}
          rightSection={
            <div
              className={clsx(
                'mx-1 flex aspect-square items-center justify-center rounded-full',
                s.arrowIcon
              )}
            >
              <IconArrowRight
                className={clsx('bg-secondaryColor h-full w-full rounded-full p-1 text-black')}
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
          {...props}
        >
          {props.children || label}
        </Button>
      )}
    </>
  )
}
