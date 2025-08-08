"use client";

import React, { createContext, useContext, ReactNode } from "react";

interface SignerContextType {
  // Add zkLogin signer methods here when implemented
  isConnected: boolean;
  connect: () => Promise<void>;
  disconnect: () => void;
}

const SignerContext = createContext<SignerContextType | undefined>(undefined);

export const useSigner = () => {
  const context = useContext(SignerContext);
  if (context === undefined) {
    throw new Error("useSigner must be used within a SignerProvider");
  }
  return context;
};

interface SignerProviderProps {
  children: ReactNode;
}

export const SignerProvider: React.FC<SignerProviderProps> = ({ children }) => {
  // TODO: Implement zkLogin signer integration
  const signerValue: SignerContextType = {
    isConnected: false,
    connect: async () => {
      // TODO: Implement zkLogin connection
      console.log("zkLogin connect not yet implemented");
    },
    disconnect: () => {
      // TODO: Implement zkLogin disconnection
      console.log("zkLogin disconnect not yet implemented");
    },
  };

  return (
    <SignerContext.Provider value={signerValue}>
      {children}
    </SignerContext.Provider>
  );
};
