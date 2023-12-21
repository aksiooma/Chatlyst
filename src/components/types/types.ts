
export interface ChatFooterProps {
    handleChatMessages: (message: string) => void;
    isResponseReceived: boolean;
    isLoading: boolean;
    honeypotValue: string;
    setHoneypotValue: (value: string) => void;
    delayRenderFloatingInput: boolean;
  }


export type HaloState = 'active' | 'error';


export interface ChatboxHeaderProps {
  isFullscreen: boolean;
  isFolded: boolean;
  haloState: HaloState;
  showFullscreenIcon: boolean;
  toggleView: () => void;
  toggleFold: () => void;
  renderIcon: () => JSX.Element;
}


export interface FloatingInputProps {
  onNewMessage: (message: string) => void;
  isResponseReceived: boolean;
  isLoading: boolean;
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