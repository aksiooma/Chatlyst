// src/components/ChatboxContainer.tsx
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import FloatingInput from './FloatingInput';
// import ChatHeader from './ChatHeader';
import TypingAnimation from './TypingAnimation';
import axios from 'axios';


const Container = styled(motion.div) <{ isFullscreen: boolean, isFolded: boolean }>`

  position: fixed;
  right: 0;
  bottom: 0;
  width: ${(props) => (props.isFullscreen ? '100%' : '700px')};
  height: ${(props) => (props.isFolded ? '100px' : (props.isFullscreen ? '100%' : '900px'))};
  background-color: rgba(33, 33, 33, 1);
  border: 1px solid rgba(125, 0, 174, 0.1);
  border-radius: 30px;
  display: flex;
  flex-direction: column;
  justify-content: center;
`;



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


const StyledHeader = styled(motion.div) <{ isFullscreen: boolean, isFolded: boolean }>`
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
  border-radius: ${props => props.isFolded ? '30px' : props.isFullscreen ? '0' : '30px'};};

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
    <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" fill="currentColor" viewBox="0 0 16 16">
      <path d="M1.5 1a.5.5 0 0 0-.5.5v4a.5.5 0 0 1-1 0v-4A1.5 1.5 0 0 1 1.5 0h4a.5.5 0 0 1 0 1h-4zM10 .5a.5.5 0 0 1 .5-.5h4A1.5 1.5 0 0 1 16 1.5v4a.5.5 0 0 1-1 0v-4a.5.5 0 0 0-.5-.5h-4a.5.5 0 0 1-.5-.5zM.5 10a.5.5 0 0 1 .5.5v4a.5.5 0 0 0 .5.5h4a.5.5 0 0 1 0 1h-4A1.5 1.5 0 0 1 0 14.5v-4a.5.5 0 0 1 .5-.5zm15 0a.5.5 0 0 1 .5.5v4a1.5 1.5 0 0 1-1.5 1.5h-4a.5.5 0 0 1 0-1h4a.5.5 0 0 0 .5-.5v-4a.5.5 0 0 1 .5-.5z" />
    </svg>
  </SvgWrapper>
);

const MinimizeIcon = () => (
  <SvgWrapper>
    <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" fill="currentColor" viewBox="0 0 16 16">
      <path d="M5.5 0a.5.5 0 0 1 .5.5v4A1.5 1.5 0 0 1 4.5 6h-4a.5.5 0 0 1 0-1h4a.5.5 0 0 0 .5-.5v-4a.5.5 0 0 1 .5-.5zm5 0a.5.5 0 0 1 .5.5v4a.5.5 0 0 0 .5.5h4a.5.5 0 0 1 0 1h-4A1.5 1.5 0 0 1 10 4.5v-4a.5.5 0 0 1 .5-.5zM0 10.5a.5.5 0 0 1 .5-.5h4A1.5 1.5 0 0 1 6 11.5v4a.5.5 0 0 1-1 0v-4a.5.5 0 0 0-.5-.5h-4a.5.5 0 0 1-.5-.5zm10 1a1.5 1.5 0 0 1 1.5-1.5h4a.5.5 0 0 1 0 1h-4a.5.5 0 0 0-.5.5v4a.5.5 0 0 1-1 0v-4z" />
    </svg>
  </SvgWrapper>
);

const FoldIcon = () => (
  <SvgWrapper>
    <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" fill="currentColor" viewBox="0 0 16 16">
      <path d="M1 8a.5.5 0 0 1 .5-.5h13a.5.5 0 0 1 0 1h-13A.5.5 0 0 1 1 8Zm7-8a.5.5 0 0 1 .5.5v3.793l1.146-1.147a.5.5 0 0 1 .708.708l-2 2a.5.5 0 0 1-.708 0l-2-2a.5.5 0 1 1 .708-.708L7.5 4.293V.5A.5.5 0 0 1 8 0Zm-.5 11.707-1.146 1.147a.5.5 0 0 1-.708-.708l2-2a.5.5 0 0 1 .708 0l2 2a.5.5 0 0 1-.708.708L8.5 11.707V15.5a.5.5 0 0 1-1 0v-3.793Z" />
    </svg>
  </SvgWrapper>
);

const IconButton = styled.button`
    background-color: transparent;
    border: none;
    border-radius: 30px;
    cursor: pointer;
    &:hover { 
      background-color: rgba(94, 44, 61, 0.7); 
    }
   
`;


const FoldButton = styled(IconButton)`  // inherits styles from IconButton

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
    transition: { duration: 0.7, ease: "anticipate" }
  },

  folded: {
    top: 'auto',
    right: 0,
    bottom: 0,
    width: '200px',
    height: '100px',  // Specify the height of your header here
    transition: { duration: 0.5, ease: "anticipate" }
  },
};

const haloVariants = {
  active: {
    boxShadow: '0 0 10px 4px rgba(255, 177, 58, 1)',  // adjust as needed for desired glow effect
  },
  error: {
    boxShadow: '0 0 10px 4px rgba(160, 20, 40, 1)',
  }
};



// Halo styled component
const HaloContainer = styled(motion.div)`
  display: inline-flex; // Helps with centering
  align-items: center;  // Vertical centering
  justify-content: center;  // Horizontal centering
  border-radius: 50%;
  padding: 10px;  
  background: transparent;
  width: 45px;  
  height: 45px;  
  position: relative; 
  overflow: visible; 
`;

const Avatar = styled.img`

`



interface ChatboxContainerProps {
  isFullscreen: boolean;
  isFolded: boolean;

}


const ChatboxContainer: React.FC<ChatboxContainerProps> = ({ isFullscreen: propIsFullscreen, isFolded: propIsFolded }) => {
  const [messages, setMessages] = useState<Array<{ role: 'user' | 'assistant', content: string }>>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(propIsFullscreen);
  const [isFolded, setIsFolded] = useState(propIsFolded);
  const [isResponseReceived, setIsResponseReceived] = useState(true);  // New state
  const [showFullscreenIcon, setShowFullscreenIcon] = useState(false);
  const [delayRenderFloatingInput, setDelayRenderFloatingInput] = useState(false);
  const [delayFooter, setDelayFooter] = useState(false);
  const [showPredefinedResponse, setShowPredefinedResponse] = useState(false);
  const [haloState, setHaloState] = useState('active');  // active by default





  useEffect(() => {
    if (!isFolded) {
      // Delay for FloatingInput
      const timer1 = setTimeout(() => {
        setDelayRenderFloatingInput(true);
      }, 500);

      // Delay for Fullscreen icon (can adjust for different delays if needed)
      const timer2 = setTimeout(() => {
        setShowFullscreenIcon(true);
      }, 500);

      // Delay for Fullscreen icon (can adjust for different delays if needed)
      const timer3 = setTimeout(() => {
        setDelayFooter(true);
      }, 300);


      return () => {
        clearTimeout(timer1);
        clearTimeout(timer2); // Cleanup timers
        clearTimeout(timer3); // 
      };
    } else {
      // If the chatbox is folded, hide  FloatingInput, Footer and Fullscreen icon
      setDelayRenderFloatingInput(false);
      setShowFullscreenIcon(false);
      setDelayFooter(false);
    }
  }, [isFolded]);

  const scrollToBottom = () => {
    setTimeout(() => {
      const chat = document.getElementById("MessagesCont");
      if (chat !== null)
        chat.scrollTop = chat.scrollHeight;
    }, 0)

  };


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

  //Predefined first responses
  const predefinedResponses = [
    "Well, well, well, look who decided to grace me with their presence. How can I be of service today?",
    "Ahoy, matey! Ready to set sail on the sea of inquiries and drown in a flood of my sassy responses?",
    "Greetings, Earthling. I, your sarcastic AI, am at your disposal. Proceed with your questions, and I'll try to contain my eye-rolling.",
    "Salutations, dear interlocutor. How may I assist you today, besides boosting your ego by gracing your presence with my sparkling personality?",
    "Hello, hello, hello, what brings you to my digital abode, seeking my unparalleled, wisdom? Ask, and you shall, begrudgingly, receive.",
  ];

  //setting up the first response / current response sequence
  const [currentResponse, setCurrentResponse] = useState("");
  const [hasFirstResponseBeenSent, setHasFirstResponseBeenSent] = useState(false);
  const [firstResponse, setFirstResponse] = useState<Array<{ role: 'assistant', content: string }>>([]);

  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * predefinedResponses.length);
    const selectedResponse = predefinedResponses[randomIndex];
    setCurrentResponse(selectedResponse);

    setTimeout(() => {
      setIsLoading(false);  // Stop loading animation
      setShowPredefinedResponse(true);  // Display the predefined response
    }, 2000);
  }, []);


  const handleChatMessages = async (messageText: string) => {

    function breakLongSequences(input: string, maxLength: number = 61): string {
      // This regular expression looks for sequences of non-space characters that are maxLength or longer.
      const regex = new RegExp(`(\\S{${maxLength},})`, 'g');

      return input.replace(regex, (match) => {
        // Split the long word with a soft hyphen after each maxLength characters
        let result = '';
        for (let i = 0; i < match.length; i += maxLength) {
          result += match.slice(i, i + maxLength) + '\u00AD';
        }
        return result;
      });
    }


    if (messageText.trim() !== '' && isResponseReceived) {


      // Add user message
      setMessages(prevMessages => [...prevMessages, { role: 'user', content: breakLongSequences(messageText) }]);
      setFirstResponse([{ role: 'assistant', content: currentResponse }]);
      scrollToBottom();
      // Set to false when a new user message is sent
      setIsResponseReceived(false);

      // Set loading to true to start the loading animation
      setIsLoading(true);

      try {

        

        // Create a formatted messages array including the new user message
        const formattedMessages = [...messages, { role: 'user', content: messageText }];

        // If the first response hasn't been sent yet, format it. Otherwise, use an empty array.
        const formattedResponse = hasFirstResponseBeenSent ? [] : [{ role: 'assistant', content: currentResponse }];

        // Send request to the server
        const response = await axios.post('http://localhost:3000/message', {
          messages: formattedMessages,
          firstResponse: formattedResponse
        });

        // After successfully sending the request, set hasFirstResponseBeenSent to true so we don't send the first response again.
        if (response.status === 200) {
          setHasFirstResponseBeenSent(true);
        }


        // If response is successful, update state with bot response
        if (response.data && response.data.message) {
          const botResponseText = breakLongSequences(response.data.message);
          setMessages(prevMessages => [...prevMessages, { role: 'assistant', content: botResponseText }]);

          // Scroll to the bottom after adding a new response
          scrollToBottom();
        } else {
          console.error('Unexpected response from server:', response.data);
          // Add a user-friendly error message to your chat interface
          setHaloState('error');

          setMessages(prevMessages => [...prevMessages, { role: 'assistant', content: 'I apologize, but the service is currently unavailable. Please try again later.' }]);

        }
      } catch (error) {
        console.error('Error:', error);
      } finally {
        // Set loading to false to stop the loading animation
        setIsLoading(false);

        // Set to true when a response is received
        setIsResponseReceived(true);

      }
    }
  };


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
      initial="folded"
      animate={isFolded ? "folded" : (isFullscreen ? "open" : "closed")}
      variants={animationVariants}>
      <StyledHeader isFullscreen={isFullscreen} isFolded={isFolded}>
        <HaloContainer variants={haloVariants} initial="active" animate={haloState}>
          <Avatar src="/assets/ai_avatar_v2.svg" width="70" height="70" className="zoom me-3 mx-1" alt="Chatbot Avatar" />
        </HaloContainer>
        <IconContainer>
          {!isFolded && (
            <IconButton onClick={toggleView} >
              {showFullscreenIcon && renderIcon()}
            </IconButton>
          )}
          <FoldButton onClick={toggleFold}>
            <FoldIcon />
          </FoldButton>
        </IconContainer>
      </StyledHeader>

      <MessagesContainer id="MessagesCont">
        {showPredefinedResponse && <ResponseMessage initial="hidden"
          animate="visible"
          variants={messageAnimation}
          transition={{ duration: 0.5 }}>{currentResponse}</ResponseMessage>}
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
      {!isFolded && delayFooter &&
        <ChatFooter>
          {delayRenderFloatingInput && <FloatingInput onNewMessage={handleChatMessages} isResponseReceived={isResponseReceived} isLoading={isLoading} />}

        </ChatFooter >}
    </Container>
  );
};

export default ChatboxContainer;
