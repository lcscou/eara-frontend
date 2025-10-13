'use client'
import { PageTitleBarProps } from '@/lib/types'
import {
  BackgroundImage,
  Box, Container,
  Flex,
  Group, Title
} from '@mantine/core'

export default function PageTitleBar({
  title,
  author,
  date,
  featuredImage,
  readingTime,
}: PageTitleBarProps) {
  return (
    <Box h={500} className='bg-primaryColor'>
      <BackgroundImage src={featuredImage || ''} className="h-full">
        <Flex align={'end'} justify={'start'} className="h-full py-26">
          <Container className="w-full" size="md">
            <Title c="white" order={1}>
              {title}
            </Title>
            <Group mt={15}>
              {author && (
                <Title c="white" order={5}>
                  {author}
                </Title>
              )}
              {date && (
                <Title c="white" fw="lighter" order={5}>
                  {new Date(date).toLocaleDateString('en-US', { dateStyle: 'medium' })}
                </Title>
              )}
              {readingTime && (
                <Title c="white" order={5}>
                  ~{readingTime} min
                </Title>
              )}
            </Group>
          </Container>
        </Flex>
      </BackgroundImage>
    </Box>
  )
}

// <div
//   className={clsx('h-[500px] relative', featuredImage ? 'bg-cover bg-center' : 'bg-primaryColor')}
//   style={{
//     backgroundImage: `url(${featuredImage})`,
//   }}
// >
//   <Container fluid className="h-full  " >
//     <div className={clsx('flex h-full relative z-50 items-center justify-center')}>
//       <Title c="white" size={88}>
//         {title}
//       </Title>
//     </div>
//   </Container>
//   <Overlay color="#000" backgroundOpacity={0.85} className='z-0' />
// </div>
