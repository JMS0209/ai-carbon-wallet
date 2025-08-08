"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { SuiClient } from '@mysten/sui/client';

export interface UserKeyData {
  randomness: string;
  nonce: string;
  ephemeralPublicKey: string;
  ephemeralPrivateKey: string;
  maxEpoch: number;
}

interface AuthContextType {
  isAuthenticated: boolean;
  userAddress: string | null;
  userKeyData: UserKeyData | null;
  suiClient: SuiClient;
  login: (userData: UserKeyData, address: string) => void;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userAddress, setUserAddress] = useState<string | null>(null);
  const [userKeyData, setUserKeyData] = useState<UserKeyData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize Sui client
  const suiClient = new SuiClient({ 
    url: process.env.NEXT_PUBLIC_SUI_NETWORK_URL || 'https://fullnode.testnet.sui.io:443'
  });

  useEffect(() => {
    // Check for existing authentication on component mount
    // Only run on client side
    if (typeof window === 'undefined') {
      setIsLoading(false);
      return;
    }
    
    const savedUserData = localStorage.getItem('userKeyData');
    const savedUserAddress = localStorage.getItem('userAddress');
    
    if (savedUserData && savedUserAddress) {
      try {
        const parsedUserData = JSON.parse(savedUserData);
        setUserKeyData(parsedUserData);
        setUserAddress(savedUserAddress);
        setIsAuthenticated(true);
      } catch (error) {
        console.error('Error parsing saved user data:', error);
        // Clear corrupted data
        localStorage.removeItem('userKeyData');
        localStorage.removeItem('userAddress');
      }
    }
    setIsLoading(false);
  }, []);

  const login = (userData: UserKeyData, address: string) => {
    setUserKeyData(userData);
    setUserAddress(address);
    setIsAuthenticated(true);
    
    // Persist to localStorage only on client side
    if (typeof window !== 'undefined') {
      localStorage.setItem('userKeyData', JSON.stringify(userData));
      localStorage.setItem('userAddress', address);
    }
  };

  const logout = () => {
    setUserKeyData(null);
    setUserAddress(null);
    setIsAuthenticated(false);
    
    // Clear localStorage only on client side
    if (typeof window !== 'undefined') {
      localStorage.removeItem('userKeyData');
      localStorage.removeItem('userAddress');
    }
  };

  const value: AuthContextType = {
    isAuthenticated,
    userAddress,
    userKeyData,
    suiClient,
    login,
    logout,
    isLoading,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};