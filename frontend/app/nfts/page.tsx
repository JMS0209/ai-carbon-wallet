"use client";

import React from "react";
import { ProtectedRoute } from "~~/components/ProtectedRoute";
import { WithRoleGuard } from "~~/providers/withRoleGuard";
import { useAuth } from "~~/context/AuthContext";

export default function NFTsPage() {
  const { userAddress } = useAuth();

  return (
    <ProtectedRoute>
      <WithRoleGuard>
      <div className="flex-grow bg-base-300 w-full mt-16 px-8 py-12">
        <div className="flex justify-center items-center">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4">Carbon-AI Pack NFTs</h1>
            <p className="text-xl mb-8">Manage your Carbon-AI Pack NFTs representing verified AI energy consumption</p>
            
            <div className="bg-base-100 p-8 rounded-3xl max-w-2xl mx-auto">
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path>
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2">NFT Collection</h3>
                <p className="text-gray-600">Connected wallet: {userAddress ? `${userAddress.slice(0, 8)}...${userAddress.slice(-6)}` : 'Not connected'}</p>
              </div>
              
              <div className="space-y-4">
                <div className="alert alert-info">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="stroke-current shrink-0 w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                  <span>No NFTs found. Start by collecting AI energy data to mint your first Carbon-AI Pack NFT.</span>
                </div>
                
                <div className="text-left space-y-2">
                  <h4 className="font-semibold">Coming Soon:</h4>
                  <ul className="list-disc list-inside text-sm space-y-1 text-gray-600">
                    <li>Real-time NFT minting from energy data</li>
                    <li>NFT marketplace integration</li>
                    <li>Carbon offset automation</li>
                    <li>Energy consumption analytics</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      </WithRoleGuard>
    </ProtectedRoute>
  );
}
