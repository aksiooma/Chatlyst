import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import TextareaAutosize from 'react-textarea-autosize';

const StyledTextarea = styled(TextareaAutosize).attrs(() => ({
  role: "textbox",
  'aria-multiline': "true",
  placeholder: "...",
}))`
  position: absolute;
  bottom: 30px;
  left: 50%;
  width: calc(75% - 10px);
  max-width: 849px;
  transform: translateX(-50%);
  color: rgba(255, 255, 255, 0.992);
  border: 1px solid rgba(125, 0, 174, 0.1);
  padding: 20px 60px 20px 20px;
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
  border-radius: 10px;
  box-shadow: 5px 5px 5px 5px rgba(24, 14, 24, 0.5);
  overflow-y: auto;
  justify-content: center;

  &:focus {
    background-color: rgba(33, 33, 33, 1);
  }

  @media (max-width: 768px) {
    width: calc(70% - 10px);
  }
`;

interface FloatingInputProps {
  onNewMessage: (message: string) => void;
  isResponseReceived: boolean;
  isLoading: boolean;
}


const FloatingInput: React.FC<FloatingInputProps> = ({ onNewMessage, isResponseReceived, isLoading}) => {

  const [text, setText] = useState('');
  const inputRef = useRef<HTMLTextAreaElement>(null);  // Specify the ref type here

  
  useEffect(() => {
    console.log('isLoading: ', isLoading);
    if (!isLoading && inputRef.current !== null) {
      inputRef.current.focus();
    }
  }, [isLoading]);




  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey && isResponseReceived) {  // Check isResponseReceived here
      e.preventDefault();  // Prevents the default action of a new line being created on "Enter" key press
      onNewMessage(text);
      setText('');  // Resets the text area
    }
  };

  return (
    <StyledTextarea
    ref={inputRef}
    value={text}
    onChange={(e) => setText(e.target.value)}
    onKeyDown={handleKeyDown}  // Add this line to handle "Enter" key presses
    minRows={1}
    maxRows={8}
    disabled={!isResponseReceived}
    />
  );
};

export default FloatingInput;