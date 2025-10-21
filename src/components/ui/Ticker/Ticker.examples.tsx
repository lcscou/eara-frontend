'use client'

import { Container, Title, Stack, Grid, Button } from '@mantine/core'
import { useState } from 'react'
import Ticker from './Ticker'

export default function TickerExamples() {
  const [showFixedTicker, setShowFixedTicker] = useState(false)

  const sampleMessages = [
    {
      id: '1',
      text: 'Short message - should NOT animate',
      link: '/conference-2025',
      linkLabel: 'KNOW MORE',
      target: '_self' as const
    },
    {
      id: '2',
      text: 'This is a very long message that should definitely trigger the scrolling animation when it overflows the available space in the ticker component because it contains a lot of text that cannot fit in the normal width and should animate from right to left',
      link: 'https://example.com/guidelines',
      linkLabel: 'READ MORE',
      target: '_blank' as const
    },
    {
      id: '3',
      text: 'Another short message',
      link: '/about',
      linkLabel: 'LEARN MORE',
      target: '_self' as const
    }
  ]

  const singleMessage = [
    {
      id: '1',
      text: 'EARA conference will happen on 24 November 2025',
      link: '/conference-2025',
      linkLabel: 'KNOW MORE'
    }
  ]

  const messageWithoutLink = [
    {
      id: '1',
      text: 'Important announcement: New policies are now in effect'
    }
  ]

  return (
    <Container size="xl" py="xl">
      <Title order={1} mb="xl" ta="center">
        Ticker Component Examples
      </Title>

      <Stack gap="xl">
        {/* Default Ticker */}
        <div>
          <Title order={2} mb="md">
            Default Ticker (Secondary Color)
          </Title>
          <Ticker messages={sampleMessages} />
        </div>

        {/* Primary Color */}
        <div>
          <Title order={2} mb="md">
            Primary Color Ticker
          </Title>
          <Ticker
            messages={sampleMessages}
            bgColor="primary"
            textColor="white"
          />
        </div>

        {/* Different Sizes */}
        <div>
          <Title order={2} mb="md">
            Different Sizes
          </Title>
          <Stack gap="md">
            <div>
              <Title order={3} size="h4" mb="xs">Small</Title>
              <Ticker messages={singleMessage} size="sm" />
            </div>
            <div>
              <Title order={3} size="h4" mb="xs">Medium (Default)</Title>
              <Ticker messages={singleMessage} size="md" />
            </div>
            <div>
              <Title order={3} size="h4" mb="xs">Large</Title>
              <Ticker messages={singleMessage} size="lg" />
            </div>
          </Stack>
        </div>

        {/* Light Background */}
        <div>
          <Title order={2} mb="md">
            Light Background
          </Title>
          <Ticker
            messages={sampleMessages}
            bgColor="light"
            textColor="dark"
          />
        </div>

        {/* White Background */}
        <div>
          <Title order={2} mb="md">
            White Background with Border
          </Title>
          <Ticker
            messages={sampleMessages}
            bgColor="white"
            textColor="dark"
          />
        </div>

        {/* Single Message */}
        <div>
          <Title order={2} mb="md">
            Single Message (No Navigation)
          </Title>
          <Ticker messages={singleMessage} />
        </div>

        {/* Message without Link */}
        <div>
          <Title order={2} mb="md">
            Message without Link
          </Title>
          <Ticker messages={messageWithoutLink} />
        </div>

        {/* No Auto-play */}
        <div>
          <Title order={2} mb="md">
            Manual Navigation Only
          </Title>
          <Ticker
            messages={sampleMessages}
            autoPlay={false}
          />
        </div>

        {/* Fast Auto-play */}
        <div>
          <Title order={2} mb="md">
            Fast Auto-play (2 seconds)
          </Title>
          <Ticker
            messages={sampleMessages}
            autoPlayInterval={2000}
          />
        </div>

        {/* No Hover Pause */}
        <div>
          <Title order={2} mb="md">
            No Pause on Hover
          </Title>
          <Ticker
            messages={sampleMessages}
            pauseOnHover={false}
          />
        </div>

        {/* Hidden Navigation */}
        <div>
          <Title order={2} mb="md">
            Hidden Navigation
          </Title>
          <Ticker
            messages={sampleMessages}
            showNavigation={false}
          />
        </div>

        {/* Responsive Grid */}
        <div>
          <Title order={2} mb="md">
            Responsive Layout
          </Title>
          <Grid>
            <Grid.Col span={{ base: 12, md: 6 }}>
              <Ticker messages={sampleMessages} />
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 6 }}>
              <Ticker
                messages={sampleMessages}
                bgColor="secondary"
                textColor="dark"
                position='fixed-bottom'
                dismissible={true}
              />
            </Grid.Col>
          </Grid>
        </div>
        {/* Fixed bottom ticker toggle */}
        <div>
          <Title order={2} mb="md">Fixed Bottom Ticker</Title>
          <Button
            onClick={() => setShowFixedTicker(!showFixedTicker)}
            variant="outline"
          >
            {showFixedTicker ? 'Hide' : 'Show'} Fixed Bottom Ticker
          </Button>
        </div>

        {/* Dismissible Ticker */}
        <div>
          <Title order={2} mb="md">Dismissible Ticker</Title>
          <Ticker
            messages={singleMessage}
            dismissible
            onDismiss={() => console.log('Ticker dismissed')}
          />
        </div>

      </Stack>

      {/* Fixed bottom ticker */}
      {showFixedTicker && (
        <Ticker
          messages={sampleMessages}
          position="fixed-bottom"
          dismissible
          onDismiss={() => setShowFixedTicker(false)}
        />
      )}
    </Container>
  )
}
