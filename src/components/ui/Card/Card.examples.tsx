import { IconSearch, IconSchool } from '@tabler/icons-react'
import { Grid, Container, Title } from '@mantine/core'
import Card from './Card'

export default function CardExamples() {
  return (
    <Container size="xl" py="xl">
      <Title order={1} mb="xl" ta="center">
        Card Component Examples
      </Title>
      <Title order={2} mb="md">
        Event Card with Date
      </Title>
      <Grid mb="xl">
        <Grid.Col span={{ base: 12, md: 6 }}>
          <Card
            variant="horizontal"
            title="Annual Conference 2026"
            description="Join us for our flagship event, featuring leading experts in the field of animal research."
            date="2 October 2026"
            image="/conference.png"
            button={{
              label: 'READ MORE',
              href: '/conference-2026',
              variant: 'anchor-text',
            }}
            bgColor="light"
          />
        </Grid.Col>
      </Grid>
      {/* Avatar Card Examples */}
      <Title order={2} mb="md">
        Avatar Card Examples
      </Title>
      <Grid mb="xl">
        <Grid.Col span={{ base: 12, md: 4 }}>
          <Card
            variant="vertical"
            title="Engaging"
            description="We engage for the responsible use of animals in research, ensuring ethical standards and transparency."
            avatar="/one-scientists-one-bunny.png"
            avatarSize="large"
          />
        </Grid.Col>
        <Grid.Col span={{ base: 12, md: 4 }}>
          <Card
            variant="horizontal"
            title="EU Policy"
            description="Explore the legislative framework governing animal research in the EU."
            avatar="https://upload.wikimedia.org/wikipedia/commons/thumb/b/b7/Flag_of_Europe.svg/1200px-Flag_of_Europe.svg.png"
            avatarSize="small"
            textAlign="left"
          />
        </Grid.Col>
      </Grid>
      {/* Vertical Half Card Examples */}
      <Title order={2} mb="md">
        Vertical Half Card Examples
      </Title>
      <Grid mb="xl">
        <Grid.Col span={{ base: 12, md: 4 }}>
          <Card
            variant="vertical"
            avatar="/one-scientists-one-bunny.png"
            title="Supporting"
            description="We collaborate with stakeholders to advance biomedical progress through responsible animal research."
            bgColor="white"
            image="/one-scientists-one-bunny.png"
            textAlign="center"
          />
        </Grid.Col>
        <Grid.Col span={{ base: 12, md: 4 }}>
          <Card
            variant="vertical"
            title="Supporting"
            description="We collaborate with stakeholders to advance biomedical progress through responsible animal research."
            bgColor="light"
            image="/two-scientists.png"
          />
        </Grid.Col>
        <Grid.Col span={{ base: 12, md: 4 }}>
          <Card
            variant="vertical"
            title="Student / Public"
            description="We collaborate with stakeholders to advance biomedical progress through responsible animal research."
            image="/girl-studying.png"
            bgColor="dark"
            button={{
              label: 'READ MORE',
              href: '/supporting',
              variant: 'filled',
              target: '_self',
            }}
            date="2 October 2026"
            icon={<IconSchool />}
            links={[
              {
                label: 'WHY IS ANIMAL RESEARCH NEEDED?',
                href: '/research-needed',
                variant: 'arrow',
              },
              {
                label: 'FACTS AND FIGURES',
                href: '/facts-figures',
                variant: 'arrow',
              },
            ]}
          />
        </Grid.Col>
      </Grid>
      {/* Horizontal Half Cards Example */}
      <Title order={2} mb="md">
        Horizontal Half Cards
      </Title>
      <Grid>
        <Grid.Col span={{ base: 12, md: 6 }}>
          <Card
            variant="horizontal"
            title="Supporting Left"
            description="We collaborate with stakeholders to advance biomedical progress through responsible animal research."
            image="/girl-studying.png"
            imagePosition="left"
            bgColor="white"
            icon={<IconSearch />}
            links={[
              {
                label: 'WHY IS ANIMAL RESEARCH NEEDED?',
                href: '/research-needed',
                variant: 'arrow',
              },
              {
                label: 'FACTS AND FIGURES',
                href: '/facts-figures',
                variant: 'arrow',
              },
            ]}
          />
        </Grid.Col>
        <Grid.Col span={{ base: 12, md: 6 }}>
          <Card
            variant="horizontal"
            title="Supporting Right"
            description="We collaborate with stakeholders to advance biomedical progress through responsible animal research."
            image="/girl-studying.png"
            imagePosition="right"
            bgColor="light"
            icon={<IconSearch />}
            links={[
              {
                label: 'WHY IS ANIMAL RESEARCH NEEDED?',
                href: '/research-needed',
                variant: 'arrow',
              },
              {
                label: 'FACTS AND FIGURES',
                href: '/facts-figures',
                variant: 'arrow',
              },
            ]}
          />
        </Grid.Col>
      </Grid>
    </Container>
  )
}
