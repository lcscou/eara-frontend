import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import Section from './Section'

const meta: Meta<typeof Section> = {
  title: 'Components/Section',
  component: Section,
  parameters: {
    layout: 'fullscreen',
  },
  args: {
    title: 'Título de exemplo',
    subtitle: 'Subtítulo',
    description: 'Esta é uma breve descrição da seção.',
    children: (
      <div style={{ backgroundColor: '#f3f3f3', padding: '20px' }}>
        <p>Conteúdo interno da seção</p>
      </div>
    ),
  },
  argTypes: {
    title: { control: 'text' },
    subtitle: { control: 'text' },
    description: { control: 'text' },
    children: { control: false },
  },
}

export default meta
type Story = StoryObj<typeof Section>

export const Default: Story = {
  args: {
    title: 'Título de exemplo',
    subtitle: 'Subtítulo',
    description: 'Esta é uma breve descrição da seção.',
    children: (
      <div style={{ backgroundColor: '#f3f3f3', padding: '20px' }}>
        <p>Conteúdo interno da seção</p>
      </div>
    ),
  },
}

export const WithoutDescription: Story = {
  args: {
    description: undefined,
  },
}

export const CustomContent: Story = {
  args: {
    children: (
      <div style={{ backgroundColor: '#ddeeff', padding: '20px' }}>
        <p>Conteúdo personalizado aqui</p>
      </div>
    ),
  },
}
