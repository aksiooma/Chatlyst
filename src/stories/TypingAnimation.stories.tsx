import type { Meta, StoryObj } from '@storybook/react';
import TypingAnimation from '../components/TypingAnimation';

const meta = {
  title: 'Components/TypingAnimation',
  component: TypingAnimation,
  parameters: {
    layout: 'centered',
    backgrounds: {
      default: 'dark',
    },
  },
  tags: ['autodocs'],
} satisfies Meta<typeof TypingAnimation>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
}; 