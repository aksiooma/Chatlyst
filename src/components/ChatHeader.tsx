import React from 'react';
import styled from 'styled-components';



const StyledHeader = styled.div`
background: linear-gradient(
  to bottom,
  rgba(251, 176, 75, 1) 0%, 
  rgba(168, 87, 69, 1) 30%, 
  rgba(94, 44, 61, 1) 50%, 
  rgba(17, 22, 47, 1) 70%,
  rgba(1, 4, 13, 1) 100% 
);
  color: #333333;
  padding: 16px;
  font-size: 20px;
  font-weight: bold;
  border-top-left-radius: 8px;
  border-top-right-radius: 8px;
  text-shadow: 0.4px 0.4px 0px hsla(200, 44%, 50%, 0.5);
  text-decoration: underline 1.5px;
  border-radius: 10px;
  

  img {
    display: flex;
  }
`;

const ChatHeader: React.FC = () => {
  return (
    <StyledHeader>
      <img src="/assets/ai_avatar_v2.svg" width="100" height="100" className="zoom me-3 mx-1" alt="Chatbot Avatar" />
      
    </StyledHeader>
  );
};

export default ChatHeader;