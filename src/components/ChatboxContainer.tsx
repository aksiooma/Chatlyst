// src/components/ChatboxContainer.tsx
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import FloatingInput from './FloatingInput';
// import ChatHeader from './ChatHeader';
import TypingAnimation from './TypingAnimation';


const Container = styled(motion.div) <{ isFullscreen: boolean, isFolded: boolean }>`

  position: fixed;
  right: 0;
  bottom: 0;
  width: ${(props) => (props.isFullscreen ? '100%' : '700px')};
  height: ${(props) => (props.isFolded ? '100px' : (props.isFullscreen ? '100%' : '900px'))};
  background-color: rgba(33, 33, 33, 1);
  border: 1px solid rgba(125, 0, 174, 0.1);
  border-radius: ${props => props.isFullscreen ? '0' : '30px'};
  display: flex;
  flex-direction: column;
 
`;


const MessagesContainer = styled.div`
  flex: 1;
  overflow-y: auto;
  max-height: calc(100% - 100px);  /* Adjust 100px to accommodate your header and footer */
  margin-top: 10px;
  
`;

const messageAnimation = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const ChatBubble = styled(motion.div)`
  padding: 10px;
  margin: 10px;
  border-radius: 5px;
`;

const UserMessage = styled(ChatBubble)`
  background-color: #e0f7fa;
  align-self: flex-end;
  color: black;
`;

const ResponseMessage = styled(ChatBubble)`
  background-color: #fff9c4;
  color: black;
`;

const ChatFooter = styled.div`
  padding: 60px;
  background: rgba(0, 0, 0, 0.1);
  border-top: 1px solid rgba(125, 0, 174, 0.1);
  border-radius: 30px;
`;


const StyledHeader = styled(motion.div) <{ isFullscreen: boolean }>`
display: flex;

background: radial-gradient(
  circle at center, 

  rgba(94, 44, 61, 1) 0%, 
  rgba(17, 22, 47, 1) 90%,
  rgba(1, 4, 13, 1) 100% 
  
);
  color: #333333;
  padding: 20px;
  font-size: 20px;
  font-weight: bold;
  border-top-left-radius: 8px;
  border-top-right-radius: 8px;
  text-shadow: 0.4px 0.4px 0px hsla(200, 44%, 50%, 0.5);
  text-decoration: underline 1.5px;
  max-height: 100px;
  border-radius: ${props => props.isFullscreen ? '0' : '30px'};
 
`;


const IconContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end; /* aligns items to the right */
  position: absolute;
  top: 10px; /* adjust as needed */
  right: 10px; /* adjust as needed */
  gap: 10px; /* space between icons */
`;

const SvgWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
`;

const FullscreenIcon = () => (
  <SvgWrapper>
  <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" fill="currentColor"  viewBox="0 0 16 16">
  <path d="M1.5 1a.5.5 0 0 0-.5.5v4a.5.5 0 0 1-1 0v-4A1.5 1.5 0 0 1 1.5 0h4a.5.5 0 0 1 0 1h-4zM10 .5a.5.5 0 0 1 .5-.5h4A1.5 1.5 0 0 1 16 1.5v4a.5.5 0 0 1-1 0v-4a.5.5 0 0 0-.5-.5h-4a.5.5 0 0 1-.5-.5zM.5 10a.5.5 0 0 1 .5.5v4a.5.5 0 0 0 .5.5h4a.5.5 0 0 1 0 1h-4A1.5 1.5 0 0 1 0 14.5v-4a.5.5 0 0 1 .5-.5zm15 0a.5.5 0 0 1 .5.5v4a1.5 1.5 0 0 1-1.5 1.5h-4a.5.5 0 0 1 0-1h4a.5.5 0 0 0 .5-.5v-4a.5.5 0 0 1 .5-.5z"/>
</svg>
  </SvgWrapper>
);

const MinimizeIcon = () => (
  <SvgWrapper>
  <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" fill="currentColor" viewBox="0 0 16 16">
  <path d="M5.5 0a.5.5 0 0 1 .5.5v4A1.5 1.5 0 0 1 4.5 6h-4a.5.5 0 0 1 0-1h4a.5.5 0 0 0 .5-.5v-4a.5.5 0 0 1 .5-.5zm5 0a.5.5 0 0 1 .5.5v4a.5.5 0 0 0 .5.5h4a.5.5 0 0 1 0 1h-4A1.5 1.5 0 0 1 10 4.5v-4a.5.5 0 0 1 .5-.5zM0 10.5a.5.5 0 0 1 .5-.5h4A1.5 1.5 0 0 1 6 11.5v4a.5.5 0 0 1-1 0v-4a.5.5 0 0 0-.5-.5h-4a.5.5 0 0 1-.5-.5zm10 1a1.5 1.5 0 0 1 1.5-1.5h4a.5.5 0 0 1 0 1h-4a.5.5 0 0 0-.5.5v4a.5.5 0 0 1-1 0v-4z"/>
</svg>
  </SvgWrapper>
);

const FoldIcon = () => (
  <SvgWrapper>
  <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" fill="currentColor" viewBox="0 0 16 16">
  <path d="M1 8a.5.5 0 0 1 .5-.5h13a.5.5 0 0 1 0 1h-13A.5.5 0 0 1 1 8Zm7-8a.5.5 0 0 1 .5.5v3.793l1.146-1.147a.5.5 0 0 1 .708.708l-2 2a.5.5 0 0 1-.708 0l-2-2a.5.5 0 1 1 .708-.708L7.5 4.293V.5A.5.5 0 0 1 8 0Zm-.5 11.707-1.146 1.147a.5.5 0 0 1-.708-.708l2-2a.5.5 0 0 1 .708 0l2 2a.5.5 0 0 1-.708.708L8.5 11.707V15.5a.5.5 0 0 1-1 0v-3.793Z"/>
</svg>
  </SvgWrapper>
);

const IconButton = styled.button`
    background-color: transparent;
    border: none;
    border-radius: 30px;
    cursor: pointer;
    &:hover { 
      background-color:    rgba(94, 44, 61, 0.7); 
    }
    @media (max-width: 768px) {
      display: none;
    }
`;


const FoldButton = styled(IconButton)`  // inherits styles from IconButton
@media (max-width: 768px) {
  display: none;
}
`;

const animationVariants = {
  open: {
    top: 0,
    right: 0,
    width: '100%',
    height: '100%',
    transition: { duration: 0.5, ease: "anticipate" }
  },
  closed: {
    top: 'auto',
    right: 0,
    bottom: 0,
    width: '450px',
    height: '550px',
    transition: { duration: 0.5, ease: "anticipate" }
  },

  folded: {
    top: 'auto',
    right: 0,
    bottom: 0,
    width: '450px',
    height: '100px',  // Specify the height of your header here
    transition: { duration: 0.5, ease: "anticipate" }
  },
};





interface ChatboxContainerProps {
  isFullscreen: boolean;
  isFolded: boolean;
}

const ChatboxContainer: React.FC<ChatboxContainerProps> = ({ isFullscreen: propIsFullscreen, isFolded: propIsFolded }) => {
  const [messages, setMessages] = useState<Array<{ type: 'user' | 'response', text: string }>>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(propIsFullscreen);
  const [isFolded, setIsFolded] = useState(propIsFolded);
  const [isResponseReceived, setIsResponseReceived] = useState(true);  // New state
  

  const updateScreenSize = () => {
    const isMobileOrTablet = window.innerWidth <= 768;
    setIsFullscreen(isMobileOrTablet);
  };

  useEffect(() => {
    updateScreenSize();
    window.addEventListener('resize', updateScreenSize);

    // Cleanup listener on unmount
    return () => {
      window.removeEventListener('resize', updateScreenSize);
    };
  }, []);

  const handleNewUserMessage = (messageText: string) => {
    if (messageText.trim() !== '' && isResponseReceived) {
    // Add user message immediately
    setMessages(prevMessages => [...prevMessages, { type: 'user', text: messageText }]);

    // Introduce a delay (e.g., 1 second) before starting the loading animation
    setTimeout(() => {
      setIsResponseReceived(false);  // Set to false when a new user message is sent
      // Set loading to true to start the loading animation
      setIsLoading(true);

      // Introduce another delay (e.g., 2 seconds) before displaying bot response
      setTimeout(() => {
        // Set loading to false to stop the loading animation
        
        // Add bot response
        setMessages(prevMessages => [...prevMessages, { type: 'response', text: 'Response from the bot' }]);
        setIsResponseReceived(true);  // Set to true when a response is received
        setIsLoading(false);
      }, 500);  // Adjust delay duration as needed

    }, 800);  // Adjust delay duration as needed
  };
}

  const toggleView = () => {
    setIsFullscreen(prevState => !prevState);
  };

  const toggleFold = () => {
    setIsFolded(prev => !prev);
  };


  const renderIcon = () => {
    if (isFullscreen) {
      return <MinimizeIcon />;
    }
    return <FullscreenIcon />;
  };

  return (
    <Container isFullscreen={isFullscreen} isFolded={isFolded} className={`header ${isFullscreen ? 'fullscreen' : ''}`}
      initial="closed"
      animate={isFolded ? "folded" : (isFullscreen ? "open" : "closed")}
      variants={animationVariants}>
      <StyledHeader isFullscreen={isFullscreen}>
        <img src="/assets/ai_avatar_v2.svg" width="65" height="65" className="zoom me-3 mx-1" alt="Chatbot Avatar" />
        <IconContainer>
        {!isFolded && (
          <IconButton onClick={toggleView} >
            {renderIcon()}     
          </IconButton>
          )}
          <FoldButton onClick={toggleFold}>
            <FoldIcon />
          </FoldButton>
        </IconContainer>
      </StyledHeader>
      <MessagesContainer>
        {messages.map((message, index) => (
          message.type === 'user' ?
            <UserMessage
              key={index}
              initial="hidden"
              animate="visible"
              variants={messageAnimation}
              transition={{ duration: 0.5 }}
            >
              {message.text}
            </UserMessage> :
            <ResponseMessage
              key={index}
              initial="hidden"
              animate="visible"
              variants={messageAnimation}
              transition={{ duration: 0.5 }}
            >
              {message.text}

            </ResponseMessage>

        ))}

        {isLoading && < TypingAnimation />}
      </MessagesContainer>
      <ChatFooter>
        {!isFolded && <FloatingInput onNewMessage={handleNewUserMessage} isResponseReceived={isResponseReceived} isLoading={isLoading}  />}

      </ChatFooter >
    </Container>
  );
};

export default ChatboxContainer;
