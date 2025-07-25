'use client';
import React, { createContext, useContext, useState } from 'react';

export const LoadingContext = createContext<any>(null);
export const useLoading = () => useContext(LoadingContext);

const LoadingProvider = ({ children }: { children: React.ReactNode }) => {
  const [loading, setLoading] = useState(false);

  return (
    <LoadingContext.Provider value={{ loading, setLoading }}>{children}</LoadingContext.Provider>
  );
};

export default LoadingProvider;
