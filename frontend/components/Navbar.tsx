"use client";

import { useAuth } from "~~/context/AuthContext";
import { useState } from "react";

export const Navbar = () => {
  const { userAddress, logout, isAuthenticated } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  if (!isAuthenticated) {
    return null;
  }

  const handleLogout = () => {
    logout();
    setIsMenuOpen(false);
  };

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo and main nav */}
          <div className="flex items-center">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-green-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">AC</span>
              </div>
              <span className="text-xl font-bold text-gray-900">AI Carbon Wallet</span>
            </div>
            
            <div className="hidden md:ml-6 md:flex md:space-x-8">
              <a href="/dashboard" className="text-gray-700 hover:text-gray-900 px-3 py-2 text-sm font-medium">
                Dashboard
              </a>
              <a href="/nfts" className="text-gray-700 hover:text-gray-900 px-3 py-2 text-sm font-medium">
                NFTs
              </a>
              <a href="/offsets" className="text-gray-700 hover:text-gray-900 px-3 py-2 text-sm font-medium">
                Offsets
              </a>
              <a href="/settings" className="text-gray-700 hover:text-gray-900 px-3 py-2 text-sm font-medium">
                Settings
              </a>
            </div>
          </div>

          {/* User menu */}
          <div className="flex items-center">
            <div className="relative">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="flex items-center space-x-3 text-sm bg-gray-100 rounded-full p-2 hover:bg-gray-200 transition-colors"
              >
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-medium text-xs">
                    {userAddress ? userAddress.slice(2, 4).toUpperCase() : 'U'}
                  </span>
                </div>
                <span className="hidden md:block text-gray-700 font-medium">
                  {userAddress ? formatAddress(userAddress) : 'User'}
                </span>
                <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                </svg>
              </button>

              {/* Dropdown menu */}
              {isMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 border border-gray-200">
                  <div className="px-4 py-2 text-sm text-gray-700 border-b border-gray-100">
                    <div className="font-medium">Sui Address</div>
                    <div className="text-xs text-gray-500 font-mono">
                      {userAddress ? formatAddress(userAddress) : 'Not connected'}
                    </div>
                  </div>
                  
                  <a 
                    href="/settings" 
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Settings
                  </a>
                  
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                  >
                    Sign out
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div className="md:hidden">
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 border-t border-gray-200">
          <a href="/dashboard" className="block px-3 py-2 text-gray-700 hover:text-gray-900">
            Dashboard
          </a>
          <a href="/nfts" className="block px-3 py-2 text-gray-700 hover:text-gray-900">
            NFTs
          </a>
          <a href="/offsets" className="block px-3 py-2 text-gray-700 hover:text-gray-900">
            Offsets
          </a>
          <a href="/settings" className="block px-3 py-2 text-gray-700 hover:text-gray-900">
            Settings
          </a>
        </div>
      </div>
    </nav>
  );
};
