// MessagesList.tsx
import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import TypingAnimation from './TypingAnimation';
import { MessagesListProps } from './types/types';


const messageAnimation = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };
  
  
  const MessagesContainer = styled.div`
    display: flex;
    flex-direction: column;
    flex: 1;
    overflow-y: auto;
    max-height: calc(100% - 100px);  /* Adjust 100px to accommodate your header and footer */
    margin-top: 10px;
  `;
  
  const ChatBubble = styled(motion.div)`
    white-space: normal;
    display:flex;
    padding: 10px;
    margin: 10px;
    border-radius: 5px;
    overflow-wrap: break-word;
    word-wrap: break-word;
    min-width: 0;
    align-self: flex-start;
    text-align: left;
    text-shadow: 0.4px 0.4px 0px hsla(200, 44%, 50%, 0.5);
    
  `;
  
  const UserMessage = styled(ChatBubble)`
   
    background-color: rgba(228, 211, 228, 1);
    color: rgba(45, 30, 45, 1);
   
  `;
  
  const ResponseMessage = styled(ChatBubble)`
   
    background: linear-gradient(30deg,  rgba(94, 44, 61, 1) 0%, 
    rgba(17, 22, 47, 1) 90%,
    rgba(1, 4, 13, 1) 100% );
    color: rgba(240, 235, 245, 1);
    
  `;

const MessagesList: React.FC<MessagesListProps> = ({ messages, isLoading }) => {
  return (
    <MessagesContainer id="MessagesCont">
      {messages.map((message, index) => (
        message.role === 'user' ?
          <UserMessage
            key={index}
            initial="hidden"
            animate="visible"
            variants={messageAnimation}
            transition={{ duration: 0.5 }}
          >
            {message.content}
          </UserMessage> :
          <ResponseMessage
            key={index}
            initial="hidden"
            animate="visible"
            variants={messageAnimation}
            transition={{ duration: 0.5 }}
          >
            {message.content}
          </ResponseMessage>
      ))}
      {isLoading && < TypingAnimation />}
    </MessagesContainer>
  );
};

export default MessagesList;
