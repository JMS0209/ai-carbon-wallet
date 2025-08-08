"use client";

import React from "react";
import { ProtectedRoute } from "~~/components/ProtectedRoute";
import { useAuth } from "~~/context/AuthContext";

export default function SettingsPage() {
  const { userAddress, userKeyData, logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  return (
    <ProtectedRoute>
      <div className="flex-grow bg-base-300 w-full mt-16 px-8 py-12">
        <div className="flex justify-center items-center">
          <div className="text-center max-w-4xl w-full">
            <h1 className="text-4xl font-bold mb-4">Settings</h1>
            <p className="text-xl mb-8">Manage your AI Carbon Wallet account and preferences</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Account Information */}
              <div className="bg-base-100 p-6 rounded-3xl">
                <h3 className="text-xl font-semibold mb-4 flex items-center">
                  <svg className="w-6 h-6 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                  </svg>
                  Account Information
                </h3>
                
                <div className="space-y-4 text-left">
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">Sui Address</label>
                    <div className="bg-gray-100 p-3 rounded-lg">
                      <code className="text-sm font-mono break-all">
                        {userAddress || 'Not connected'}
                      </code>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">Authentication Method</label>
                    <div className="bg-gray-100 p-3 rounded-lg">
                      <span className="text-sm">zkLogin (Google OAuth)</span>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">Key Validity</label>
                    <div className="bg-gray-100 p-3 rounded-lg">
                      <span className="text-sm">Until epoch {userKeyData?.maxEpoch || 'N/A'}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Preferences */}
              <div className="bg-base-100 p-6 rounded-3xl">
                <h3 className="text-xl font-semibold mb-4 flex items-center">
                  <svg className="w-6 h-6 mr-2 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                  </svg>
                  Platform Settings
                </h3>
                
                <div className="space-y-4 text-left">
                  <div className="form-control">
                    <label className="label cursor-pointer">
                      <span className="label-text">Auto-offset new emissions</span>
                      <input type="checkbox" className="toggle toggle-primary" defaultChecked />
                    </label>
                  </div>
                  
                  <div className="form-control">
                    <label className="label cursor-pointer">
                      <span className="label-text">Email notifications</span>
                      <input type="checkbox" className="toggle toggle-secondary" defaultChecked />
                    </label>
                  </div>
                  
                  <div className="form-control">
                    <label className="label cursor-pointer">
                      <span className="label-text">Real-time data collection</span>
                      <input type="checkbox" className="toggle toggle-accent" defaultChecked />
                    </label>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-2">Offset threshold (kWh)</label>
                    <input 
                      type="number" 
                      placeholder="100" 
                      className="input input-bordered w-full"
                      defaultValue="100"
                    />
                  </div>
                </div>
              </div>

              {/* Danger Zone */}
              <div className="bg-base-100 p-6 rounded-3xl border border-red-200 md:col-span-2">
                <h3 className="text-xl font-semibold mb-4 flex items-center text-red-600">
                  <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.502 0L4.232 15.5c-.77.833.192 2.5 1.732 2.5z"></path>
                  </svg>
                  Account Management
                </h3>
                
                <div className="flex flex-col md:flex-row gap-4 items-center">
                  <div className="text-sm text-gray-600 text-left flex-1">
                    <p>Logging out will clear your local session data. You can log back in anytime with your Google account.</p>
                  </div>
                  
                  <button 
                    onClick={handleLogout}
                    className="btn btn-error btn-outline"
                  >
                    Sign Out
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
