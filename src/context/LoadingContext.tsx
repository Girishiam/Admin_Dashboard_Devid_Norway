import React, { createContext, useContext, useState, ReactNode } from 'react';
import LoadingScreen from '../components/LoadingScreen';

interface LoadingContextType {
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
  setLoadingMessage: (message: string) => void;
}

const LoadingContext = createContext<LoadingContextType | undefined>(undefined);

export function LoadingProvider({ children }: { children: ReactNode }) {
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('Loading');

  return (
    <LoadingContext.Provider value={{ isLoading, setIsLoading, setLoadingMessage }}>
      {children}
      {isLoading && <LoadingScreen message={loadingMessage} />}
    </LoadingContext.Provider>
  );
}

export function useLoading() {
  const context = useContext(LoadingContext);
  if (!context) {
    throw new Error('useLoading must be used within LoadingProvider');
  }
  return context;
}
