// context/LoaderContext.tsx
'use client';

import { createContext, useContext, useState } from 'react';

type LoaderContextType = {
  showLoader: () => void;
  hideLoader: () => void;
  isVisible: boolean;
};

const LoaderContext = createContext<LoaderContextType>({
  showLoader: () => {
    throw new Error("showLoader must be used within a LoaderProvider");
  },
  hideLoader: () => {
    throw new Error("hideLoader must be used within a LoaderProvider");
  },
  isVisible: false
});

export const LoaderProvider = ({ children }: { children: React.ReactNode }) => {
  const [isVisible, setIsVisible] = useState(false);

  const showLoader = () => setIsVisible(true);
  const hideLoader = () => setIsVisible(false);

  return (
    <LoaderContext.Provider value={{ showLoader, hideLoader, isVisible }}>
      {children}
    </LoaderContext.Provider>
  );
};

export const useLoader = () => useContext(LoaderContext);
