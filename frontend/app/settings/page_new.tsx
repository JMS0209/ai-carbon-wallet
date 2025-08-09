"use client";

import React, { useState } from "react";
import { ProtectedRoute } from "~~/components/ProtectedRoute";
import { useAuth } from "~~/context/AuthContext";

export default function SettingsPage() {
  const { userAddress, userKeyData, logout } = useAuth();
  const [activeTab, setActiveTab] = useState<'account' | 'preferences' | 'security' | 'data'>('account');
  const [notifications, setNotifications] = useState({
    email: true,
    push: false,
    nftMinting: true,
    offsetReminders: true,
    marketUpdates: false
  });
  const [preferences, setPreferences] = useState({
    currency: 'USD',
    language: 'en',
    theme: 'auto',
    dataRetention: '1year',
    autoOffset: false,
    offsetThreshold: '10'
  });

  const handleLogout = () => {
    logout();
  };

  const handleNotificationChange = (key: string, value: boolean) => {
    setNotifications(prev => ({ ...prev, [key]: value }));
  };

  const handlePreferenceChange = (key: string, value: string | boolean) => {
    setPreferences(prev => ({ ...prev, [key]: value }));
  };

  return (
    <ProtectedRoute>
      <div className="flex-grow bg-base-300 w-full mt-16 px-8 py-12">
        <div className="max-w-6xl mx-auto">
          
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold mb-2">Settings</h1>
            <p className="text-lg text-base-content/70">Manage your AI Carbon Wallet account and preferences</p>
          </div>

          {/* Tab Navigation */}
          <div className="tabs tabs-boxed mb-6">
            <a 
              className={`tab ${activeTab === 'account' ? 'tab-active' : ''}`}
              onClick={() => setActiveTab('account')}
            >
              Account
            </a>
            <a 
              className={`tab ${activeTab === 'preferences' ? 'tab-active' : ''}`}
              onClick={() => setActiveTab('preferences')}
            >
              Preferences
            </a>
            <a 
              className={`tab ${activeTab === 'security' ? 'tab-active' : ''}`}
              onClick={() => setActiveTab('security')}
            >
              Security
            </a>
            <a 
              className={`tab ${activeTab === 'data' ? 'tab-active' : ''}`}
              onClick={() => setActiveTab('data')}
            >
              Data & Privacy
            </a>
          </div>

          {/* Account Tab */}
          {activeTab === 'account' && (
            <div className="space-y-6">
              
              {/* Account Information */}
              <div className="bg-base-100 rounded-2xl p-6">
                <h3 className="text-xl font-semibold mb-4 flex items-center">
                  <svg className="w-6 h-6 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                  </svg>
                  Account Information
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-base-content/70 mb-2">Sui Address</label>
                    <div className="bg-base-200 p-3 rounded-lg">
                      <code className="text-sm font-mono break-all">
                        {userAddress || 'Not connected'}
                      </code>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-base-content/70 mb-2">Authentication Method</label>
                    <div className="bg-base-200 p-3 rounded-lg">
                      <span className="text-sm">zkLogin (Google OAuth)</span>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-base-content/70 mb-2">Key Validity</label>
                    <div className="bg-base-200 p-3 rounded-lg">
                      <span className="text-sm">
                        Max Epoch: {userKeyData?.maxEpoch || 'N/A'}
                      </span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-base-content/70 mb-2">Account Status</label>
                    <div className="bg-base-200 p-3 rounded-lg">
                      <span className="badge badge-success">Active</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Account Stats */}
              <div className="bg-base-100 rounded-2xl p-6">
                <h3 className="text-xl font-semibold mb-4">Account Statistics</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary">42</div>
                    <div className="text-sm text-base-content/70">NFTs Owned</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-success">98.4</div>
                    <div className="text-sm text-base-content/70">tCO2e Offset</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-info">1,247.8</div>
                    <div className="text-sm text-base-content/70">kWh Tracked</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-warning">15</div>
                    <div className="text-sm text-base-content/70">Days Active</div>
                  </div>
                </div>
              </div>

              {/* Account Actions */}
              <div className="bg-base-100 rounded-2xl p-6">
                <h3 className="text-xl font-semibold mb-4">Account Actions</h3>
                <div className="space-y-4">
                  <button className="btn btn-outline w-full">
                    Export Account Data
                  </button>
                  <button className="btn btn-warning w-full">
                    Reset All Settings
                  </button>
                  <button 
                    className="btn btn-error w-full"
                    onClick={handleLogout}
                  >
                    Sign Out
                  </button>
                </div>
              </div>

            </div>
          )}

          {/* Preferences Tab */}
          {activeTab === 'preferences' && (
            <div className="space-y-6">
              
              {/* Display Preferences */}
              <div className="bg-base-100 rounded-2xl p-6">
                <h3 className="text-xl font-semibold mb-4">Display Preferences</h3>
                <div className="space-y-4">
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">Currency</span>
                    </label>
                    <select 
                      className="select select-bordered"
                      value={preferences.currency}
                      onChange={(e) => handlePreferenceChange('currency', e.target.value)}
                    >
                      <option value="USD">USD ($)</option>
                      <option value="EUR">EUR (€)</option>
                      <option value="GBP">GBP (£)</option>
                      <option value="JPY">JPY (¥)</option>
                    </select>
                  </div>

                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">Language</span>
                    </label>
                    <select 
                      className="select select-bordered"
                      value={preferences.language}
                      onChange={(e) => handlePreferenceChange('language', e.target.value)}
                    >
                      <option value="en">English</option>
                      <option value="zh">中文</option>
                      <option value="ja">日本語</option>
                      <option value="es">Español</option>
                    </select>
                  </div>

                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">Theme</span>
                    </label>
                    <select 
                      className="select select-bordered"
                      value={preferences.theme}
                      onChange={(e) => handlePreferenceChange('theme', e.target.value)}
                    >
                      <option value="auto">Auto</option>
                      <option value="light">Light</option>
                      <option value="dark">Dark</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Carbon Offset Preferences */}
              <div className="bg-base-100 rounded-2xl p-6">
                <h3 className="text-xl font-semibold mb-4">Carbon Offset Automation</h3>
                <div className="space-y-4">
                  <div className="form-control">
                    <label className="label cursor-pointer">
                      <span className="label-text">Enable Auto-Offset</span>
                      <input 
                        type="checkbox" 
                        className="toggle toggle-primary"
                        checked={preferences.autoOffset}
                        onChange={(e) => handlePreferenceChange('autoOffset', e.target.checked)}
                      />
                    </label>
                    <div className="label">
                      <span className="label-text-alt">Automatically purchase offsets when emissions exceed threshold</span>
                    </div>
                  </div>

                  {preferences.autoOffset && (
                    <div className="form-control">
                      <label className="label">
                        <span className="label-text">Auto-Offset Threshold (tCO2e)</span>
                      </label>
                      <input 
                        type="number" 
                        className="input input-bordered"
                        value={preferences.offsetThreshold}
                        onChange={(e) => handlePreferenceChange('offsetThreshold', e.target.value)}
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* Notifications */}
              <div className="bg-base-100 rounded-2xl p-6">
                <h3 className="text-xl font-semibold mb-4">Notifications</h3>
                <div className="space-y-4">
                  <div className="form-control">
                    <label className="label cursor-pointer">
                      <span className="label-text">Email Notifications</span>
                      <input 
                        type="checkbox" 
                        className="toggle toggle-primary"
                        checked={notifications.email}
                        onChange={(e) => handleNotificationChange('email', e.target.checked)}
                      />
                    </label>
                  </div>

                  <div className="form-control">
                    <label className="label cursor-pointer">
                      <span className="label-text">NFT Minting Alerts</span>
                      <input 
                        type="checkbox" 
                        className="toggle toggle-primary"
                        checked={notifications.nftMinting}
                        onChange={(e) => handleNotificationChange('nftMinting', e.target.checked)}
                      />
                    </label>
                  </div>

                  <div className="form-control">
                    <label className="label cursor-pointer">
                      <span className="label-text">Offset Reminders</span>
                      <input 
                        type="checkbox" 
                        className="toggle toggle-primary"
                        checked={notifications.offsetReminders}
                        onChange={(e) => handleNotificationChange('offsetReminders', e.target.checked)}
                      />
                    </label>
                  </div>

                  <div className="form-control">
                    <label className="label cursor-pointer">
                      <span className="label-text">Market Updates</span>
                      <input 
                        type="checkbox" 
                        className="toggle toggle-primary"
                        checked={notifications.marketUpdates}
                        onChange={(e) => handleNotificationChange('marketUpdates', e.target.checked)}
                      />
                    </label>
                  </div>
                </div>
              </div>

            </div>
          )}

          {/* Security Tab */}
          {activeTab === 'security' && (
            <div className="space-y-6">
              
              {/* Authentication Status */}
              <div className="bg-base-100 rounded-2xl p-6">
                <h3 className="text-xl font-semibold mb-4">Authentication Status</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-success/20 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 bg-success rounded-full"></div>
                      <span className="font-medium">zkLogin Authentication</span>
                    </div>
                    <span className="badge badge-success">Active</span>
                  </div>
                  
                  <div className="flex items-center justify-between p-4 bg-info/20 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 bg-info rounded-full"></div>
                      <span className="font-medium">Google OAuth</span>
                    </div>
                    <span className="badge badge-info">Connected</span>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-warning/20 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 bg-warning rounded-full"></div>
                      <span className="font-medium">Two-Factor Authentication</span>
                    </div>
                    <span className="badge badge-warning">Not Enabled</span>
                  </div>
                </div>
              </div>

              {/* Security Actions */}
              <div className="bg-base-100 rounded-2xl p-6">
                <h3 className="text-xl font-semibold mb-4">Security Actions</h3>
                <div className="space-y-3">
                  <button className="btn btn-outline w-full">
                    View Active Sessions
                  </button>
                  <button className="btn btn-outline w-full">
                    Download Recovery Keys
                  </button>
                  <button className="btn btn-warning w-full">
                    Revoke All Sessions
                  </button>
                </div>
              </div>

              {/* Recent Activity */}
              <div className="bg-base-100 rounded-2xl p-6">
                <h3 className="text-xl font-semibold mb-4">Recent Security Activity</h3>
                <div className="space-y-3">
                  {[
                    { action: 'Successful Login', time: '2 hours ago', device: 'Chrome on Windows' },
                    { action: 'NFT Listed', time: '1 day ago', device: 'Chrome on Windows' },
                    { action: 'Offset Purchased', time: '3 days ago', device: 'Chrome on Windows' },
                  ].map((activity, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-base-200 rounded-lg">
                      <div>
                        <p className="font-medium">{activity.action}</p>
                        <p className="text-sm text-base-content/70">{activity.device}</p>
                      </div>
                      <div className="text-sm text-base-content/70">{activity.time}</div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          )}

          {/* Data & Privacy Tab */}
          {activeTab === 'data' && (
            <div className="space-y-6">
              
              {/* Data Management */}
              <div className="bg-base-100 rounded-2xl p-6">
                <h3 className="text-xl font-semibold mb-4">Data Management</h3>
                <div className="space-y-4">
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">Data Retention Period</span>
                    </label>
                    <select 
                      className="select select-bordered"
                      value={preferences.dataRetention}
                      onChange={(e) => handlePreferenceChange('dataRetention', e.target.value)}
                    >
                      <option value="3months">3 Months</option>
                      <option value="6months">6 Months</option>
                      <option value="1year">1 Year</option>
                      <option value="2years">2 Years</option>
                      <option value="forever">Forever</option>
                    </select>
                  </div>

                  <div className="stats stats-vertical lg:stats-horizontal shadow">
                    <div className="stat">
                      <div className="stat-title">Energy Data Points</div>
                      <div className="stat-value text-primary">1,247</div>
                      <div className="stat-desc">Stored locally</div>
                    </div>
                    
                    <div className="stat">
                      <div className="stat-title">NFT Metadata</div>
                      <div className="stat-value text-secondary">42</div>
                      <div className="stat-desc">On blockchain</div>
                    </div>
                    
                    <div className="stat">
                      <div className="stat-title">Transaction History</div>
                      <div className="stat-value">156</div>
                      <div className="stat-desc">Public records</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Privacy Settings */}
              <div className="bg-base-100 rounded-2xl p-6">
                <h3 className="text-xl font-semibold mb-4">Privacy Settings</h3>
                <div className="space-y-4">
                  <div className="form-control">
                    <label className="label cursor-pointer">
                      <span className="label-text">Share anonymous usage data</span>
                      <input type="checkbox" className="toggle toggle-primary" defaultChecked />
                    </label>
                  </div>

                  <div className="form-control">
                    <label className="label cursor-pointer">
                      <span className="label-text">Allow marketplace analytics</span>
                      <input type="checkbox" className="toggle toggle-primary" defaultChecked />
                    </label>
                  </div>

                  <div className="form-control">
                    <label className="label cursor-pointer">
                      <span className="label-text">Public profile visibility</span>
                      <input type="checkbox" className="toggle toggle-primary" />
                    </label>
                  </div>
                </div>
              </div>

              {/* Data Export & Deletion */}
              <div className="bg-base-100 rounded-2xl p-6">
                <h3 className="text-xl font-semibold mb-4">Data Export & Deletion</h3>
                <div className="space-y-3">
                  <button className="btn btn-outline w-full">
                    📊 Export All Data (JSON)
                  </button>
                  <button className="btn btn-outline w-full">
                    📄 Export Carbon Report (PDF)
                  </button>
                  <button className="btn btn-outline w-full">
                    💾 Export NFT Metadata
                  </button>
                  <div className="divider"></div>
                  <button className="btn btn-error w-full">
                    🗑️ Request Account Deletion
                  </button>
                </div>
              </div>

            </div>
          )}

        </div>
      </div>
    </ProtectedRoute>
  );
}
