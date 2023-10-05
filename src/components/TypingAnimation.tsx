import React from 'react';
import styled, { keyframes } from 'styled-components';

const dotAnimation = keyframes`
  0% { transform: translateY(0); }
  25% { transform: translateY(-5px); }
  50% { transform: translateY(0); }
`;

const Dot = styled.div`
  width: 8px;
  height: 8px;
  background-color: white;
  border-radius: 50%;
  margin: 0 2px;
  animation: ${dotAnimation} 1.5s ease-in-out infinite;
  &:nth-child(2) {
    animation-delay: 0.3s;
  }
  &:nth-child(3) {
    animation-delay: 0.6s;
  }
`;

const TypingAnimationContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 10px;
  color: black;
  padding: 20px;
  margin: 10px;
  border-radius: 5px;
`;



const TypingAnimation: React.FC = () => {
    
  return (
    <TypingAnimationContainer >
      <Dot />
      <Dot />
      <Dot />
    </TypingAnimationContainer>
  );
};

export default TypingAnimation;
