import { Container } from '@mantine/core'
import { SectionCardProps } from '@/lib/types'
import Image from 'next/image'
import clsx from 'clsx'

export default function SectionCard({
  children,
  image,
  orientation = 'image-left',
}: SectionCardProps) {
  return (
    <>
      <Container size="lg">
        <div className="my-20 grid grid-cols-12 gap-10 overflow-hidden rounded-2xl bg-[#EAEAEA] md:grid">
          <div
            className={clsx(
              'col-span-12 min-h-[400px] overflow-hidden rounded-2xl sm:col-span-4',
              orientation === 'image-right' && 'order-1'
            )}
          >
            <Image
              src={image}
              alt="Section Card Image"
              width={200}
              height={200}
              className="h-full w-full object-cover"
            />
          </div>
          <div className="col-span-12 flex items-center p-10 sm:col-span-8 sm:p-15">{children}</div>
        </div>
      </Container>
    </>
  )
}
