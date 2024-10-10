import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import TextareaAutosize from 'react-textarea-autosize';
import { FloatingInputProps } from './types/types';
import { useHaloState } from '../context/HaloStateContext';

const InputContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: end;
  position: relative;
  left: 50%;
  width: calc(110% - 20px);
  max-width: 849px;
  transform: translateX(-50%);
  maxHeight: 120px;
`;

const StyledTextarea = styled(TextareaAutosize).attrs(() => ({
  role: "textbox",
  'aria-multiline': "true",
  placeholder: "...",
  maxLength: 2048,
}))`
  flex-grow: 1;
  color: rgba(255, 255, 255, 0.992);
  border: 0.5px solid rgba(255, 255, 255, 0.1);
  padding: 20px 45px 20px 20px;
  font-size: 17px;
  text-shadow: 1px 1px 1px 1px rgba(0, 0, 0, 0.3);
  line-height: 1.5;
  max-height: calc(1.2em * 12);
  overflow-wrap: break-word;
  resize: none;
  outline: none;
  white-space: pre-wrap;
  word-wrap: break-word;
  background-color: rgba(33, 33, 33, 0.8);
  border-radius: 25px;
  box-shadow: 0px 5px 5px 5px rgba(24, 14, 24, 0.65);
  overflow-y: auto;
  justify-content: center;
  z-index: 9;


  &:focus {
    background-color: rgba(33, 33, 33, 1);
  }

`;

const SendButton = styled.button`
  position: absolute;
  right: 15px; 
  top: 50%; 
  transform: translateY(-50%); 
  background: none;
  border: none;
  cursor: pointer;
  padding: 0px;
  padding-top: 5px;
  padding-bottom: 5px;
  margin-right: -1px;
  z-index: 10;


  svg {
    width: 24px; 
    height: 24px; 
    fill: rgba(67, 101, 107, 0.597); 

    &:hover {
      fill: rgb(255, 255, 255); 
      stroke: #FFF;
      stroke-width: 1px;
    }
  }

`;


const FloatingInput: React.FC<FloatingInputProps> = ({ onNewMessage, isResponseReceived, isLoading, isFullscreen }) => {
  const { haloState } = useHaloState();
  const [text, setText] = useState('');
  const inputRef = useRef<HTMLTextAreaElement>(null);


  useEffect(() => {
    if (!isLoading && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [isLoading]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    const isMobile = window.innerWidth <= 768;

    if (e.key === 'Enter' && !e.shiftKey && isResponseReceived && !isLoading && haloState !== "error") {
      e.preventDefault();

      if (!isMobile || (isMobile && text.trim() === '')) {
        onNewMessage(text);
        setText('');
      } else if (isMobile) {
        setText(prev => prev + '\n');
      }
    }
  };

  const handleSendClick = () => {
    onNewMessage(text);
    setText('');
  };

  const minRows = isFullscreen ? 1 : 1;
  const maxRows = isFullscreen ? 30 : 4;


  return (
    <>
      <InputContainer>
        <StyledTextarea
          ref={inputRef}
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown} // handle "Enter" key presses
          minRows={minRows}
          maxRows={maxRows}
          disabled={!isResponseReceived}
        />
        {!isLoading && haloState === 'active' &&
          <SendButton onClick={handleSendClick}><svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" id="send"
            viewBox="0 0 512 512">
            <path
              d="M498.1 5.6c10.1 7 15.4 19.1 13.5 31.2l-64 416c-1.5 9.7-7.4 18.2-16 23s-18.9 5.4-28 1.6L284 427.7l-68.5 74.1c-8.9 9.7-22.9 12.9-35.2 8.1S160 493.2 160 480V396.4c0-4 1.5-7.8 4.2-10.7L331.8 202.8c5.8-6.3 5.6-16-.4-22s-15.7-6.4-22-.7L106 360.8 17.7 316.6C7.1 311.3 .3 300.7 0 288.9s5.9-22.8 16.1-28.7l448-256c10.7-6.1 23.9-5.5 34 1.4z" />
            <path fill="currentColor" d="..." />
          </svg></SendButton>}
      </InputContainer>
    </>
  );
};

export default React.memo(FloatingInput);