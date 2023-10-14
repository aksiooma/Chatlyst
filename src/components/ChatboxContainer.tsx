// src/components/ChatboxContainer.tsx
import { useState } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import ChatHeader from './ChatHeader';
import ChatFooter from './ChatFooter'
import { HaloState } from './ChatHeader';
import axios, { AxiosResponse, AxiosError } from 'axios';
import MessagesContainer from './MessagesContainer';
import useChatLogic from "./hooks/useChatLogic"


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


const animationVariants = {
  open: {
    top: 0,
    right: 0,
    width: '100%',
    height: '100%',
    transition: { duration: 0.6, ease: "anticipate" }
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



interface ChatboxContainerProps {
  isFullscreen: boolean;
  isFolded: boolean;

}



const ChatboxContainer: React.FC<ChatboxContainerProps> = ({ isFullscreen: propIsFullscreen, isFolded: propIsFolded }) => {
  const {
    messages,
    isLoading,
    isFullscreen,
    isFolded,
    isResponseReceived,
    showFullscreenIcon,
    delayRenderFloatingInput,
    delayFooter,
    API_URL,
    honeypotValue,
    scrollToBottom,
    setMessages,
    setIsLoading,
    setIsFullscreen,
    setIsFolded,
    setIsResponseReceived,
    setHoneypotValue,

  } = useChatLogic({ propIsFullscreen, propIsFolded });

  const [haloState, setHaloState] = useState<HaloState>('active');

  const MAX_RETRIES = 3;

  const sendMessageToServer = async (formattedMessages: any[], attempt = 1): Promise<AxiosResponse> => {
    try {
      return await axios.post(`${API_URL}/message`, {
        messages: formattedMessages,
        honeypot: honeypotValue
      }, {
        withCredentials: true
      });
    } catch (error) {
      if (attempt < MAX_RETRIES) {
        return sendMessageToServer(formattedMessages, attempt + 1);
      } else {
        throw error;
      }
    }
  };
  
 

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
      scrollToBottom();
      // Set to false when a new user message is sent
      setIsResponseReceived(false);

      // Set loading to true to start the loading animation
      setIsLoading(true);

      try {
        const formattedMessages = [...messages, { role: 'user', content: messageText }];
      
        // Use the new function with retry logic
        const response = await sendMessageToServer(formattedMessages);

        // If response is successful, update state with bot response
        if (response.data && response.data.message) {
          const botResponseText = breakLongSequences(response.data.message);
          setMessages(prevMessages => [...prevMessages, { role: 'assistant', content: botResponseText }]);
          // If the response contains a successful message from ChatGPT:
          setHaloState('active');
          // Scroll to the bottom after adding a new response
          scrollToBottom();
        } else {
          console.error('Unexpected response from server:', response.data);
          setHaloState('error');  // Set to error if response is unexpected
          setMessages(prevMessages => [...prevMessages, { role: 'assistant', content: 'I apologize, but the service is currently unavailable. Please try again later.' }]);
        }

      } catch (error) {
        const axiosError = error as AxiosError;
    
        if (axiosError.response) {
          // Server responded with an error status
          console.error('Server responded with:', axiosError.response.data, axiosError.response.status, axiosError.response.headers);
        } else if (axiosError.request) {
          // The request was made but no response was received
          console.error('No response received:', axiosError.request);
        } else {
          // Something happened in setting up the request
          console.error('Request setup error:', axiosError.message);
        }

        setHaloState('error');  // Set to error if there's an Axios error or another issue
        setMessages(prevMessages => [...prevMessages, { role: 'assistant', content: 'I apologize, but there seems to be an issue. Please try again later.' }]);

      } finally {
        setIsLoading(false);          // Stop the loading animation
        setIsResponseReceived(true);  // Set to true when a response (or error) is received
      }
    };
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
      <ChatHeader
        isFullscreen={isFullscreen}
        isFolded={isFolded}
        showFullscreenIcon={showFullscreenIcon}
        haloState={haloState}
        toggleView={toggleView}
        toggleFold={toggleFold}
        renderIcon={renderIcon}
      />
      <MessagesContainer messages={messages} isLoading={isLoading} />
      {!isFolded && delayFooter &&
        <ChatFooter
          handleChatMessages={handleChatMessages}
          isResponseReceived={isResponseReceived}
          isLoading={isLoading}
          honeypotValue={honeypotValue}
          setHoneypotValue={setHoneypotValue}
          delayRenderFloatingInput={delayRenderFloatingInput}
        />}
    </Container>
  );
};

export default ChatboxContainer;
