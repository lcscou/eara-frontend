import { Button } from '@mantine/core'
import { ButtonEaraProps } from '@/lib/types'

export default function ButtonEara({
  RightSection,
  label,
  leftSection,
  link,
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
          tt="uppercase"
          size="md"
          styles={{
            label: {
              fontWeight: '400',
              fontSize: '15px',
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
          variant='outline'
          tt="uppercase"
          size="md"
          c="white"
          styles={{
            root:{
              borderColor: "white"
            },
            label: {
              fontWeight: '400',
              fontSize: '15px',
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
