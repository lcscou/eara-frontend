import { Text, Container, Title } from '@mantine/core'
import styles from './Section.module.css'
import { SectionProps } from '@/lib/types'

export default function Section({ children, title, subtitle, description }: SectionProps) {
  return (
    <>
      <section className="py-30">
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

        <Container size="lg" mt={100}>
          {children}
        </Container>
      </section>
    </>
  )
}
