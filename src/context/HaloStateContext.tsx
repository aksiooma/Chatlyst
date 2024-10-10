// HaloStateContext.tsx
import React, { createContext, useContext, useState, ReactNode } from 'react';

export type HaloState = 'active' | 'error';

interface HaloStateContextType {
  haloState: HaloState;
  setHaloState: (state: HaloState) => void;
}

const defaultState: HaloStateContextType = {
  haloState: 'active',
  setHaloState: () => {},
};

const HaloStateContext = createContext<HaloStateContextType>(defaultState);

export const useHaloState = () => useContext(HaloStateContext);

interface Props {
  children: ReactNode;
}

export const HaloStateProvider: React.FC<Props> = ({ children }) => {
  const [haloState, setHaloState] = useState<HaloState>('active');

  return (
    <HaloStateContext.Provider value={{ haloState, setHaloState }}>
      {children}
    </HaloStateContext.Provider>
  );
};