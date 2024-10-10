import { useState, useEffect } from 'react';
import axios from 'axios';
import { UseChatLogicProps } from '../types/types';
import { useHaloState } from '../../context/HaloStateContext';

type Message = { role: 'user' | 'assistant', content: string };

const useChatLogic = ({ propIsFullscreen, propIsFolded }: UseChatLogicProps) => {
  const { haloState, setHaloState } = useHaloState();
  const [messages, setMessages] = useState<Array<Message>>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(propIsFullscreen);
  const [isFolded, setIsFolded] = useState(propIsFolded);
  const [isResponseReceived, setIsResponseReceived] = useState(true);
  const [showFullscreenIcon, setShowFullscreenIcon] = useState(true);
  const [delayRenderFloatingInput, setDelayRenderFloatingInput] = useState(false);
  const [delayFooter, setDelayFooter] = useState(false);
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5173";
  const [honeypotValue, setHoneypotValue] = useState<string>('');
  


  const scrollToBottom = () => {
    setTimeout(() => {
      const chat = document.getElementById("MessagesCont");
      if (chat !== null)
        chat.scrollTop = chat.scrollHeight;
    }, 0)

  };

  useEffect(() => {
    let isCancelled = false;

    const fetchData = async () => {
      setIsLoading(true);

      try {
        const greetingResponse = await axios.get(`${API_URL}/greeting`, { withCredentials: true, timeout: 10000 });
        const greeting = { role: 'assistant', content: greetingResponse.data.content };

        const historyResponse = await axios.get(`${API_URL}/history`, { withCredentials: true, timeout: 10000 });
        const combinedMessages = [greeting, ...historyResponse.data];

        if (!isCancelled) {
          setMessages(combinedMessages);
          setIsLoading(false);
          setIsResponseReceived(true); // Ensure this is set to true upon successful fetch
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        if (!isCancelled) {
          setHaloState('error');
          setIsResponseReceived(false);
          setMessages(prevMessages => [...prevMessages, { role: 'assistant', content: 'Oops! It seems we are experiencing some technical difficulties. Please refresh the page and try again later.' }]);
        }
      }
    };

    fetchData();

    return () => {
      isCancelled = true;
    };
  }, []);


  //Delay Sequence for UI
  useEffect(() => {

    if (!isFolded) {
      // Delay for FloatingInput
      const timer1 = setTimeout(() => {
        setDelayRenderFloatingInput(true);
      }, 500);

      // Delay for Fullscreen icon
      const timer2 = setTimeout(() => {
        setShowFullscreenIcon(true);
      }, 300);

      // Delay for Footer
      const timer3 = setTimeout(() => {
        setDelayFooter(true);
      }, 300);
      return () => {
        clearTimeout(timer1);
        clearTimeout(timer2); // Cleanup timers
        clearTimeout(timer3);
      };
    } else {
      // If the chatbox is folded, hide FloatingInput, Footer and Fullscreen icon
      setDelayRenderFloatingInput(false);
      setShowFullscreenIcon(false);
      setDelayFooter(false);
    }
  }, [isFolded]);




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



  return {
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
    setShowFullscreenIcon,
    setDelayRenderFloatingInput,
    setDelayFooter,
    setHoneypotValue,
  };
};

export default useChatLogic;