"use client"

import React, { createContext, useContext, useState } from 'react';

interface TransitionContextType {
  isTransitioning: boolean;
  triggerTransition: (callback: () => void) => void;
}

const TransitionContext = createContext<TransitionContextType | undefined>(undefined);

export const TransitionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isTransitioning, setIsTransitioning] = useState(false);

  const triggerTransition = (callback: () => void) => {
    if (isTransitioning) return;
    
    setIsTransitioning(true);
    
    // Time to wait for the "entering" part of the animation
    setTimeout(() => {
      callback();
    }, 600);

    // Time to wait for the whole animation to finish
    setTimeout(() => {
      setIsTransitioning(false);
    }, 1200);
  };

  return (
    <TransitionContext.Provider value={{ isTransitioning, triggerTransition }}>
      {children}
    </TransitionContext.Provider>
  );
};

export const useTransition = () => {
  const context = useContext(TransitionContext);
  if (context === undefined) {
    throw new Error('useTransition must be used within a TransitionProvider');
  }
  return context;
};
