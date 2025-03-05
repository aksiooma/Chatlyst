import type { Meta, StoryObj } from '@storybook/react';
import ChatboxContainer from '../components/ChatboxContainer';
import { HaloStateProvider } from '../context/HaloStateContext';

const meta = {
  title: 'Components/ChatboxContainer',
  component: ChatboxContainer,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <HaloStateProvider>
        <Story />
      </HaloStateProvider>
    ),
  ],
} satisfies Meta<typeof ChatboxContainer>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    isFullscreen: false,
    isFolded: false,
  },
};

export const Fullscreen: Story = {
  args: {
    isFullscreen: true,
    isFolded: false,
  },
};

export const Folded: Story = {
  args: {
    isFullscreen: false,
    isFolded: true,
  },
}; 