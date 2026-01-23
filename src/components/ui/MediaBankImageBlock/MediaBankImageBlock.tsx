import { MediaBankImageBlockProps } from '@/lib/types'
import { Image } from '@mantine/core'
import InfoButton from '../InfoButton/InfoButton'

export default function MediaBankImageBlock({
  src,
  width,
  height,
  credits,
}: MediaBankImageBlockProps) {
  return (
    <>
      <div
        className="relative overflow-hidden rounded-xl"
        style={{ width: width || '100%', height: height || 'auto' }}
      >
        <Image src={src} w={width} h={height} alt="Media Bank Image" />
        <div className="absolute right-[5%] bottom-[5%] z-2">
          <InfoButton withOverlay={false} content={credits} />
        </div>
      </div>
    </>
  )
}
