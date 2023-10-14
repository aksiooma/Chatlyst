import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import FloatingInput from './FloatingInput'; // Update the path accordingly


const ChatFooter = styled(motion.div) <{ isFolded: boolean }>`
  display: ${props => props.isFolded ? 'none' : 'block'};
  padding: 60px;
  background: rgba(0, 0, 0, 0.1);
  border-top: 1px solid rgba(125, 0, 174, 0.1);
  border-radius: 30px;

  @media (max-width: 768px) {
    border-radius: 0px;
  }
`;



interface ChatFooterProps {
  handleChatMessages: (message: string) => void;
  isResponseReceived: boolean;
  isLoading: boolean;
  honeypotValue: string;
  setHoneypotValue: (value: string) => void;
  delayRenderFloatingInput: boolean;
}

const Footer: React.FC<ChatFooterProps> = ({
  handleChatMessages,
  isResponseReceived,
  isLoading,
  honeypotValue,
  setHoneypotValue,
  delayRenderFloatingInput,
}) => (
  <ChatFooter>
    {delayRenderFloatingInput && (
      <FloatingInput
        onNewMessage={handleChatMessages}
        isResponseReceived={isResponseReceived}
        isLoading={isLoading}
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
