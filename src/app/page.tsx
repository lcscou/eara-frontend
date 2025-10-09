'use client'

import Header from '@/components/ui/Header/Header'
import Hero from '@/components/ui/Hero/Hero'
import { Container } from '@mantine/core'

export default function Home() {
  return (
    <>
      <Header></Header>

      <Hero
        bgImageSrc="/eara-hero-bg.png"
        content={
          <>
            <Container>
              <div className="flex flex-col items-center justify-center gap-10">
                <h2 className="text-center text-[64px] leading-[100%] text-white">
                  The place to learn about animal research: why science still needs animals and how
                  they are used responsibly and humanely.
                </h2>
                <p>Trusted, up-to-date information on animal research for different audiences.</p>
              </div>
            </Container>
          </>
        }
      />
    </>
  )
}
