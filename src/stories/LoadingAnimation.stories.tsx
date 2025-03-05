import type { Meta, StoryObj } from '@storybook/react';
import LoadingAnimation from '../components/LoadingAnimation';

const meta = {
  title: 'Components/LoadingAnimation',
  component: LoadingAnimation,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof LoadingAnimation>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
}; 