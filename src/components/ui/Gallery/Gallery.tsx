'use client'
import { GalleryProps } from '@/lib/types'
import { useEffect, useState } from 'react'
import { MasonryPhotoAlbum } from 'react-photo-album'
import 'react-photo-album/masonry.css'
import Lightbox from 'yet-another-react-lightbox'
import Captions from 'yet-another-react-lightbox/plugins/captions'
import 'yet-another-react-lightbox/plugins/captions.css'
import Fullscreen from 'yet-another-react-lightbox/plugins/fullscreen'
import Slideshow from 'yet-another-react-lightbox/plugins/slideshow'
import Thumbnails from 'yet-another-react-lightbox/plugins/thumbnails'
import 'yet-another-react-lightbox/plugins/thumbnails.css'
import Zoom from 'yet-another-react-lightbox/plugins/zoom'
import 'yet-another-react-lightbox/styles.css'

const images = [
  {
    src: 'https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/images/bg-1.png',
    width: 1200,
    height: 800,
    description: 'Slide description',
  },
  {
    src: 'https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/images/bg-2.png',
    width: 1200,
    height: 800,
    description: 'Slide description',
  },
  {
    src: 'https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/images/bg-3.png',
    width: 1200,
    height: 800,
    description: 'Slide description',
  },
  {
    src: 'https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/images/bg-4.png',
    width: 1200,
    height: 800,
    description: 'Slide description',
  },
  {
    src: 'https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/images/bg-5.png',
    width: 1200,
    height: 800,
    description:
      "<h2>Credits: SLsds</h2><br/>Housing of social macaque groups within a research facility. At BPRC all monkeys are born in social groups. They stay with their parents until the moment they'll naturally would leave their natal group (males). From then, ± 5 years old, they'll either, will be introduced in another group to become a breeding male, of they will join an extended training program for research. A wide variety of ages within a group, contributes to stability and welfare.",
  },
]

export default function Gallery({ data }: GalleryProps) {
  const [index, setIndex] = useState(-1)
  const captionRef = null

  useEffect(() => {
    console.log('Gallery ID:', captionRef)
  })

  return (
    <>
      <MasonryPhotoAlbum
        photos={data}
        columns={3}
        componentsProps={{ image: { className: 'rounded-lg' } }}
        onClick={({ index }) => setIndex(index)}
      />

      <Lightbox
        slides={data}
        open={index >= 0}
        index={index}
        thumbnails={{ border: 0, height: 100 }}
        captions={{ showToggle: true, ref: captionRef }}
        close={() => setIndex(-1)}
        plugins={[Fullscreen, Slideshow, Thumbnails, Zoom, Captions]}
      />
    </>
  )
}
