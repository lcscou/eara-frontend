'use client'
import { Button, Transition } from '@mantine/core'
import { IconArrowUp } from '@tabler/icons-react'
import { useWindowScroll } from '@mantine/hooks'

export default function BackToTop() {
  const [scroll, scrollTo] = useWindowScroll()

  return (
    <>
      <Transition mounted={scroll.y > 100} transition="pop" duration={120} timingFunction="ease-in">
        {(stylesTransition) => (
          <div style={stylesTransition}>
            <Button
              onClick={() => scrollTo({ y: 0 })}
              unstyled
              className="flex aspect-square w-[55px] cursor-pointer items-center justify-center rounded-full bg-[#D5D7F3] hover:bg-white"
            >
              <IconArrowUp />
            </Button>
          </div>
        )}
      </Transition>
    </>
  )
}
