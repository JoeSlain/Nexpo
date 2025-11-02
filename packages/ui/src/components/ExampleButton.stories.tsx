import type { Meta, StoryObj } from '@storybook/react-vite'

import { fn } from 'storybook/test'

import { ExampleButton } from './ExampleButton'

const meta = {
  title: 'UI/ExampleButton',
  component: ExampleButton,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    backgroundColor: { control: 'color' },
    size: {
      control: { type: 'select' },
      options: ['$2', '$3', '$4', '$5', '$6'],
    },
    theme: {
      control: { type: 'select' },
      options: ['light', 'dark'],
    },
  },
  args: { onPress: fn() },
} satisfies Meta<typeof ExampleButton>

export default meta
type Story = StoryObj<typeof meta>

export const Primary: Story = {
  args: {
    children: 'Example Button',
    backgroundColor: '$blue10',
  },
}

export const Secondary: Story = {
  args: {
    children: 'Example Button',
    backgroundColor: '$gray10',
  },
}

export const Large: Story = {
  args: {
    children: 'Large Button',
    size: '$6',
    backgroundColor: '$red10',
  },
}

export const Small: Story = {
  args: {
    children: 'Small Button',
    size: '$2',
    backgroundColor: '$green10',
  },
}

export const WithCustomChildren: Story = {
  args: {
    children: 'Click me!',
    backgroundColor: '$purple10',
  },
}
