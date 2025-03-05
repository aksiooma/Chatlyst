import type { Meta, StoryObj } from '@storybook/react';
import MessagesList from '../components/MessagesContainer';

const meta = {
  title: 'Components/MessagesList',
  component: MessagesList,
  parameters: {
    layout: 'centered',
    backgrounds: {
      default: 'dark',
    },
  },
  tags: ['autodocs'],
} satisfies Meta<typeof MessagesList>;

export default meta;
type Story = StoryObj<typeof meta>;

const sampleMessages: { role: 'user' | 'assistant', content: string }[] = [
  { role: 'user', content: 'Hei! Miten voit?' },
  { role: 'assistant', content: 'Hei! Voin hyvin, kiitos kysymästä. Miten voin auttaa sinua tänään?' },
  { role: 'user', content: 'Haluaisin tietää lisää tekoälystä.' },
  { role: 'assistant', content: 'Tekoäly on laaja aihe, joka kattaa koneiden kyvyn oppia ja suorittaa tehtäviä, jotka tyypillisesti vaativat ihmisen älykkyyttä. Mistä näkökulmasta haluaisit tietää lisää?' },
];

export const Default: Story = {
  args: {
    messages: sampleMessages,
    isLoading: false,
  },
};

export const Loading: Story = {
  args: {
    messages: sampleMessages,
    isLoading: true,
  },
};

export const EmptyChat: Story = {
  args: {
    messages: [],
    isLoading: false,
  },
}; 