
export interface ChatFooterProps {
  handleChatMessages: (message: string) => void;
  isResponseReceived: boolean;
  isLoading: boolean;
  honeypotValue: string;
  setHoneypotValue: (value: string) => void;
  delayRenderFloatingInput: boolean;
  isFolded: boolean;
  isFullscreen: boolean;
}


export interface ChatboxContainerProps {
isFullscreen: boolean;
isFolded: boolean;
}


export interface ChatboxHeaderProps {
isFullscreen: boolean;
isFolded: boolean;
showFullscreenIcon: boolean;
toggleView: () => void;
toggleFold: () => void;
renderIcon: () => JSX.Element;
}


export interface FloatingInputProps {
onNewMessage: (message: string) => void;
isResponseReceived: boolean;
isLoading: boolean;
isFullscreen: boolean;
}

export interface MessagesListProps {
messages: Array<{ role: 'user' | 'assistant', content: string }>;
isLoading: boolean;

}

export interface UseChatLogicProps {
propIsFullscreen: boolean;
propIsFolded: boolean;
}

export interface UseResponsiveImagesProps {
  avatarSmall: string;
  avatarMedium: string;
  avatarLarge: string;
}