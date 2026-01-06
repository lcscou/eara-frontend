import { Box, Container } from '@mantine/core'

import { GetHeroHomeOfTheDayDocument } from '@/graphql/generated/graphql'
import { HomeHeroProps } from '@/lib/types'
import { useSuspenseQuery } from '@apollo/client/react'
import Link from 'next/link'
import InfoButton from '../InfoButton/InfoButton'

export default function HomeHero({
  children,
  overlayColor = 'black',
  overlayOpacity = 40,
}: HomeHeroProps) {
  const { data } = useSuspenseQuery(GetHeroHomeOfTheDayDocument)

  const credits = (
    <>
      <div>
        <span className="font-bold">Credits: </span>
        {data?.heroHomeOfTheDay?.credits}
      </div>
      <div>
        <span className="font-bold">Website: </span>
        <Link
          target="__blank"
          className="underline"
          href={data?.heroHomeOfTheDay?.creditWebsite || '#'}
        >
          {data?.heroHomeOfTheDay?.creditWebsite}
        </Link>
      </div>
      <div>
        <span className="font-bold">More Info:</span>{' '}
        <Link
          target="__blank"
          className="underline"
          href={data?.heroHomeOfTheDay?.creditsMoreInfo || '#'}
        >
          {data?.heroHomeOfTheDay?.creditsMoreInfo}
        </Link>
      </div>
    </>
  )

  return (
    <>
      <Box
        style={{
          backgroundImage: `url(${data?.heroHomeOfTheDay?.featuredImageUrl})`,
          backgroundRepeat: 'no-repeat',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
        className="flex min-h-svh flex-col items-center justify-center"
      >
        <div className="relative z-1">
          <Container>{children}</Container>
        </div>
        {overlayOpacity > 0 && (
          <div
            className="eara-hero-home__overlay"
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: overlayColor,
              opacity: overlayOpacity / 100,
              pointerEvents: 'none',
              zIndex: 0,
            }}
          />
        )}

        <div className="absolute right-10 bottom-10 z-2">
          <InfoButton content={credits} />
        </div>
      </Box>
    </>
  )
}
