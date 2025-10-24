import { Button } from '@mantine/core'

import { IconSearch } from '@tabler/icons-react'

export default function Search() {
  return (
    <Button
      unstyled
      bg="secondaryColor.7"
      c="#272727"
      className="flex aspect-square w-[40px] cursor-pointer items-center justify-center rounded-full"
    >
      <IconSearch size={18} />
    </Button>
  )
}
