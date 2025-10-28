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
        componentsProps={{ image: { className: 'rounded-lg w-full ' } }}
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
