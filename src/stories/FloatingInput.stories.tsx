import type { Meta, StoryObj } from '@storybook/react';
import FloatingInput from '../components/FloatingInput';

const meta = {
  title: 'Components/FloatingInput',
  component: FloatingInput,
  parameters: {
    layout: 'centered',
    backgrounds: {
      default: 'dark',
    },
  },
  tags: ['autodocs'],
} satisfies Meta<typeof FloatingInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    onNewMessage: (message: string) => console.log('New message:', message),
    isResponseReceived: true,
    isLoading: false,
    isFullscreen: false,
  },
};

export const Loading: Story = {
  args: {
    ...Default.args,
    isLoading: true,
    isResponseReceived: false,
  },
};

export const Fullscreen: Story = {
  args: {
    ...Default.args,
    isFullscreen: true,
  },
}; 