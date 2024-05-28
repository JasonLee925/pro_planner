import React, { createContext, useContext, useState, ReactNode } from 'react';

interface SharedState {
  isLoggedIn: boolean;
  setIsLoggedIn: React.Dispatch<React.SetStateAction<boolean>>;
}

const SharedStateContext = createContext<SharedState | undefined>(undefined);

interface SharedStateProviderProps {
  children: ReactNode;
}

export const LoggedInStateProvider: React.FC<SharedStateProviderProps> = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <SharedStateContext.Provider value={{ isLoggedIn, setIsLoggedIn }}>
      {children}
    </SharedStateContext.Provider>
  );
};

export const useLoggedInState = () => {
  const context = useContext(SharedStateContext);
  if (!context) {
    throw new Error('useLoggedInState must be used within a SharedStateProvider');
  }
  return context;
};