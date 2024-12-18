import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import FloatingInput from './FloatingInput';
import { ChatFooterProps } from './types/types';

const ChatFooter = styled(motion.div) <{ isFolded: boolean }>`
  display: ${props => props.isFolded ? 'none' : 'block'};
  padding: 20px;
  background: rgba(0, 0, 0, 0.1);
  border-top: 2px solid rgba(255, 255, 255, 0.1);
  border-radius: 30px;
  @media (max-width: 768px) {
    border-radius: 0px;
  }
`;

const Footer: React.FC<ChatFooterProps> = ({
  handleChatMessages,
  isResponseReceived,
  isLoading,
  honeypotValue,
  setHoneypotValue,
  delayRenderFloatingInput,
  isFolded,
  isFullscreen,
}) => (
  <ChatFooter isFolded={isFolded}>
    {delayRenderFloatingInput && (
      <FloatingInput
        onNewMessage={handleChatMessages}
        isResponseReceived={isResponseReceived}
        isLoading={isLoading}
        isFullscreen={isFullscreen}
      />
    )}
    <input
      type="text"
      name="honeypot"
      style={{ display: 'none' }}
      autoComplete="off"
      value={honeypotValue}
      onChange={(e) => setHoneypotValue(e.target.value)}
    />
  </ChatFooter>
);

export default React.memo(Footer);