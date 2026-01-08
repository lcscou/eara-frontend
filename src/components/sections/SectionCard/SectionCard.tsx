import { SectionCardProps } from '@/lib/types'
import { Container } from '@mantine/core'
import clsx from 'clsx'
import Image from 'next/image'

export default function SectionCard({
  children,
  image,
  orientation = 'image-left',
}: SectionCardProps) {
  return (
    <>
      <Container size="lg">
        <div className="my-20 grid grid-cols-12 gap-5 overflow-hidden rounded-2xl bg-[#EAEAEA] md:grid">
          <div
            className={clsx(
              'col-span-12 min-h-[400px] overflow-hidden rounded-2xl sm:col-span-5',
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
          <div className="col-span-12 flex flex-col justify-center p-10 sm:col-span-7 sm:p-15">
            {children}
          </div>
        </div>
      </Container>
    </>
  )
}
