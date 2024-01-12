import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import useResponsiveAvatar from '../components/hooks/useResponsiveImages'
import avatarLarge from '../assets/ai_avatar_v2_large.webp';
import avatarMedium from '../assets/ai_avatar_v2_medium.webp';
import avatarSmall from '../assets/ai_avatar_v2_small.webp';
import { ChatboxHeaderProps } from './types/types';


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

const haloVariants = {
  active: {
    boxShadow: '0 0 10px 4px rgba(255, 177, 58, 1)', 
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

const ChatboxHeader: React.FC<ChatboxHeaderProps> = ({
  isFullscreen,
  isFolded,
  haloState,
  toggleView,
  toggleFold,
  renderIcon,
  showFullscreenIcon
}) => {
  const currentAvatar = useResponsiveAvatar({
    avatarSmall: avatarSmall,
    avatarMedium: avatarMedium,
    avatarLarge: avatarLarge
  });

  return (
  <StyledHeader isFullscreen={isFullscreen} isFolded={isFolded}>
    <HaloContainer variants={haloVariants} initial={haloState} animate={haloState}>
      <Avatar src={currentAvatar} width="70" height="70" className="zoom me-3 mx-1" alt="Chatbot Avatar" />
    </HaloContainer>
    <IconContainer>
      {!isFolded && showFullscreenIcon && (
        <IconButton onClick={toggleView}>
          {renderIcon()}
        </IconButton>
      )}
      <FoldButton onClick={toggleFold}>
        <FoldIcon />
      </FoldButton>
    </IconContainer>
  </StyledHeader>
);
    }
export default React.memo(ChatboxHeader);