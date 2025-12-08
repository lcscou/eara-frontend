import { SectionProps } from '@/lib/types'
import { Container, Text, Title } from '@mantine/core'
import clsx from 'clsx'
export default function Section({
  children,
  title,
  subtitle,
  className,
  description,
  // py = '80px',
  noTitle = false,
  containerSize = 'lg',
  ...props

  // variant = 'default',
}: SectionProps) {
  return (
    <>
      <section {...props} className={clsx(`py-20`, className)}>
        {!noTitle && (
          <div className="w-full items-start gap-20 sm:flex">
            <div className="w-fit border-b border-b-gray-400 py-2 pl-20 sm:pl-40">
              <small className="uppercase">{subtitle}</small>
            </div>
            <div className="sm:px-unset mt-5 max-w-2xl grow px-[16px] sm:mt-0">
              <Title order={2} className="text-primaryColor">
                {title}
              </Title>
              {description && <Text mt={15}>{description}</Text>}
            </div>
          </div>
        )}
        <Container
          {...(containerSize == 'none' ? { px: 0, fluid: true } : { size: containerSize })}
          mt={60}
        >
          {children}
        </Container>
      </section>
    </>
  )
}
