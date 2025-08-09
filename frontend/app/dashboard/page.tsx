"use client";

import React, { useState, useEffect } from "react";
import { StatCard } from "~~/components/StatCard";
import { StatusCard } from "~~/components/StatusCard";
import { ProtectedRoute } from "~~/components/ProtectedRoute";
import { WithRoleGuard } from "~~/providers/withRoleGuard";
import { useAuth } from "~~/context/AuthContext";
import { BackendService } from "~~/services/backend";
import { OracleService } from "~~/services/oracle";
import { SuiService } from "~~/services/sui";
import { SealWalrusService } from "~~/services/sealWalrus";
import { SubgraphService } from "~~/services/subgraph";
import { UsdcService } from "~~/services/usdc";
import { probeSeal as rbacProbeSeal, probeWalrus as rbacProbeWalrus } from "~~/services/rbac/sealStore";
import { currentRole as rbacCurrentRole } from "~~/services/rbac/roles";
import { getEnergyNftListings } from "~~/services/suiKiosk";

// Dashboard specific imports for enhanced UI
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';

interface ModuleStatus {
  status: 'ok' | 'warn' | 'fail' | 'skip';
  details: string;
}

// Mock data for demonstration
const mockEnergyData = [
  { time: '00:00', consumption: 2.4, inference: 1.2, training: 1.2 },
  { time: '04:00', consumption: 3.1, inference: 1.8, training: 1.3 },
  { time: '08:00', consumption: 4.5, inference: 2.2, training: 2.3 },
  { time: '12:00', consumption: 5.8, inference: 3.1, training: 2.7 },
  { time: '16:00', consumption: 4.2, inference: 2.4, training: 1.8 },
  { time: '20:00', consumption: 3.3, inference: 1.9, training: 1.4 },
];

const mockCarbonData = [
  { name: 'AI Training', value: 65, color: '#FF6B6B' },
  { name: 'AI Inference', value: 25, color: '#4ECDC4' },
  { name: 'Infrastructure', value: 10, color: '#45B7D1' },
];

const mockOffsetData = [
  { month: 'Jan', purchased: 12, retired: 10 },
  { month: 'Feb', purchased: 18, retired: 15 },
  { month: 'Mar', purchased: 23, retired: 20 },
  { month: 'Apr', purchased: 31, retired: 28 },
  { month: 'May', purchased: 28, retired: 25 },
  { month: 'Jun', purchased: 35, retired: 32 },
];

export default function DashboardPage() {
  const { userAddress, userKeyData } = useAuth();
  const [moduleStatuses, setModuleStatuses] = useState<Record<string, ModuleStatus>>({
    rbac: { status: 'skip', details: 'Not tested yet' },
    collectors: { status: 'skip', details: 'Not tested yet' },
    oracle: { status: 'skip', details: 'Not tested yet' },
    sui: { status: 'skip', details: 'Not tested yet' },
    seal: { status: 'skip', details: 'Not tested yet' },
    subgraph: { status: 'skip', details: 'Not tested yet' },
    usdc: { status: 'skip', details: 'Not tested yet' },
    marketplace: { status: 'skip', details: 'Not tested yet' },
  });

  // Interactive states
  const [selectedTimeRange, setSelectedTimeRange] = useState('24h');
  const [isTestingAll, setIsTestingAll] = useState(false);
  const [showDetailedStats, setShowDetailedStats] = useState(false);
  const [notifications, setNotifications] = useState([
    { id: 1, type: 'info', message: 'Energy monitoring active', timestamp: new Date() },
    { id: 2, type: 'success', message: 'Carbon offset completed: 2.3 tCO2e', timestamp: new Date(Date.now() - 3600000) },
    { id: 3, type: 'warning', message: 'High energy usage detected', timestamp: new Date(Date.now() - 7200000) },
  ]);

  const testAllSystems = async () => {
    setIsTestingAll(true);
    // Add notification for testing start
    setNotifications(prev => [...prev, {
      id: Date.now(),
      type: 'info',
      message: 'Starting system tests...',
      timestamp: new Date()
    }]);

    await Promise.all([
      testCollectors(),
      testOracle(),
      testSui(),
      testSeal(),
      testSubgraph(),
      testUsdc(),
      testMarketplace(),
      testRbac(),
    ]);

    setIsTestingAll(false);
    // Add completion notification
    setNotifications(prev => [...prev, {
      id: Date.now() + 1,
      type: 'success', 
      message: 'System tests completed',
      timestamp: new Date()
    }]);
  };

  const testCollectors = async () => {
    try {
      const result = await BackendService.testConnection();
      setModuleStatuses(prev => ({
        ...prev,
        collectors: result
      }));
    } catch (error) {
      setModuleStatuses(prev => ({
        ...prev,
        collectors: {
          status: 'fail',
          details: error instanceof Error ? error.message : 'Unknown error'
        }
      }));
    }
  };

  const testOracle = async () => {
    try {
      const result = await OracleService.testConnection();
      setModuleStatuses(prev => ({
        ...prev,
        oracle: result
      }));
    } catch (error) {
      setModuleStatuses(prev => ({
        ...prev,
        oracle: {
          status: 'fail',
          details: error instanceof Error ? error.message : 'Unknown error'
        }
      }));
    }
  };

  const testSui = async () => {
    try {
      const result = await SuiService.testConnection();
      setModuleStatuses(prev => ({
        ...prev,
        sui: result
      }));
    } catch (error) {
      setModuleStatuses(prev => ({
        ...prev,
        sui: {
          status: 'fail',
          details: error instanceof Error ? error.message : 'Unknown error'
        }
      }));
    }
  };

  const testSeal = async () => {
    try {
      const result = await SealWalrusService.testConnection();
      setModuleStatuses(prev => ({
        ...prev,
        seal: result
      }));
    } catch (error) {
      setModuleStatuses(prev => ({
        ...prev,
        seal: {
          status: 'fail',
          details: error instanceof Error ? error.message : 'Unknown error'
        }
      }));
    }
  };

  const testSubgraph = async () => {
    try {
      const result = await SubgraphService.testConnection();
      setModuleStatuses(prev => ({
        ...prev,
        subgraph: result
      }));
    } catch (error) {
      setModuleStatuses(prev => ({
        ...prev,
        subgraph: {
          status: 'fail',
          details: error instanceof Error ? error.message : 'Unknown error'
        }
      }));
    }
  };

  const testUsdc = async () => {
    try {
      const result = await UsdcService.testConnection();
      setModuleStatuses(prev => ({
        ...prev,
        usdc: result
      }));
    } catch (error) {
      setModuleStatuses(prev => ({
        ...prev,
        usdc: {
          status: 'fail',
          details: error instanceof Error ? error.message : 'Unknown error'
        }
      }));
    }
  };

  const testMarketplace = async () => {
    try {
      const result = await getEnergyNftListings();
      setModuleStatuses(prev => ({
        ...prev,
        marketplace: {
          status: 'ok',
          details: `Found ${result.count} listings`
        }
      }));
    } catch (error) {
      setModuleStatuses(prev => ({
        ...prev,
        marketplace: {
          status: 'fail',
          details: error instanceof Error ? error.message : 'Unknown error'
        }
      }));
    }
  };

  const testRbac = async () => {
    try {
      const role = await rbacCurrentRole();
      const sealResult = await rbacProbeSeal();
      const walrusResult = await rbacProbeWalrus();
      
      setModuleStatuses(prev => ({
        ...prev,
        rbac: {
          status: 'ok',
          details: `Role: ${role}, Seal: ${sealResult ? 'OK' : 'FAIL'}, Walrus: ${walrusResult ? 'OK' : 'FAIL'}`
        }
      }));
    } catch (error) {
      setModuleStatuses(prev => ({
        ...prev,
        rbac: {
          status: 'fail',
          details: error instanceof Error ? error.message : 'Unknown error'
        }
      }));
    }
  };

  return (
    <ProtectedRoute>
      <WithRoleGuard>
      <div className="flex-grow bg-base-300 w-full mt-16 px-8 py-12">
          <div className="max-w-7xl mx-auto space-y-8">
            
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <div>
                <h1 className="text-4xl font-bold mb-2">AI-Carbon Dashboard</h1>
                <p className="text-lg text-base-content/70">Monitor, measure, and offset your AI energy consumption</p>
              </div>
              
              {/* Interactive Controls */}
              <div className="flex gap-3">
                <div className="dropdown dropdown-end">
                  <label tabIndex={0} className="btn btn-outline btn-sm">
                    📊 {selectedTimeRange}
                  </label>
                  <ul tabIndex={0} className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-32">
                    <li><a onClick={() => setSelectedTimeRange('1h')}>Last Hour</a></li>
                    <li><a onClick={() => setSelectedTimeRange('24h')}>24 Hours</a></li>
                    <li><a onClick={() => setSelectedTimeRange('7d')}>7 Days</a></li>
                    <li><a onClick={() => setSelectedTimeRange('30d')}>30 Days</a></li>
                  </ul>
                </div>
                
                <button 
                  className={`btn btn-sm ${showDetailedStats ? 'btn-primary' : 'btn-outline'}`}
                  onClick={() => setShowDetailedStats(!showDetailedStats)}
                >
                  📈 {showDetailedStats ? 'Simple' : 'Detailed'}
                </button>
                
                <button 
                  className={`btn btn-sm ${isTestingAll ? 'btn-disabled loading' : 'btn-success'}`}
                  onClick={testAllSystems}
                  disabled={isTestingAll}
                >
                  {isTestingAll ? 'Testing...' : '🔄 Test All'}
                </button>
              </div>
            </div>

            {/* Notifications */}
            {notifications.length > 0 && (
              <div className="bg-base-100 rounded-2xl p-4">
                <div className="flex justify-between items-center mb-3">
                  <h3 className="font-semibold">📢 Recent Notifications</h3>
                  <button 
                    className="btn btn-ghost btn-xs"
                    onClick={() => setNotifications([])}
                  >
                    Clear All
                  </button>
                </div>
                <div className="space-y-2 max-h-32 overflow-y-auto">
                  {notifications.slice(-5).map((notif) => (
                    <div key={notif.id} className={`alert alert-${notif.type === 'success' ? 'success' : notif.type === 'warning' ? 'warning' : 'info'} py-2`}>
                      <div className="flex justify-between items-center w-full">
                        <span className="text-sm">{notif.message}</span>
                        <span className="text-xs opacity-70">{notif.timestamp.toLocaleTimeString()}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-2xl p-6 cursor-pointer hover:shadow-lg transition-shadow"
                   onClick={() => setNotifications(prev => [...prev, {
                     id: Date.now(),
                     type: 'info',
                     message: 'Viewing detailed energy statistics...',
                     timestamp: new Date()
                   }])}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-blue-100 text-sm font-medium">Total Energy Tracked</p>
                    <p className="text-3xl font-bold">1,247.8 kWh</p>
                    <p className="text-blue-100 text-sm">+12.3% from last month</p>
                    {showDetailedStats && (
                      <div className="mt-2 text-xs text-blue-200">
                        <p>Training: 823.4 kWh (66%)</p>
                        <p>Inference: 424.4 kWh (34%)</p>
                      </div>
                    )}
                  </div>
                  <div className="text-4xl">⚡</div>
                </div>
              </div>
              
              <div className="bg-gradient-to-br from-green-500 to-green-600 text-white rounded-2xl p-6 cursor-pointer hover:shadow-lg transition-shadow"
                   onClick={() => setNotifications(prev => [...prev, {
                     id: Date.now(),
                     type: 'success',
                     message: 'Navigating to NFT collection...',
                     timestamp: new Date()
                   }])}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-green-100 text-sm font-medium">Carbon NFTs Minted</p>
                    <p className="text-3xl font-bold">42</p>
                    <p className="text-green-100 text-sm">Representing 524.2 tCO2e</p>
                    {showDetailedStats && (
                      <div className="mt-2 text-xs text-green-200">
                        <p>Verified: 38 NFTs</p>
                        <p>Pending: 4 NFTs</p>
                      </div>
                    )}
                  </div>
                  <div className="text-4xl">🌱</div>
                </div>
              </div>
              
              <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white rounded-2xl p-6 cursor-pointer hover:shadow-lg transition-shadow"
                   onClick={() => setNotifications(prev => [...prev, {
                     id: Date.now(),
                     type: 'info',
                     message: 'Opening carbon offset details...',
                     timestamp: new Date()
                   }])}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-purple-100 text-sm font-medium">Offsets Retired</p>
                    <p className="text-3xl font-bold">498.1 tCO2e</p>
                    <p className="text-purple-100 text-sm">95% of total emissions</p>
                    {showDetailedStats && (
                      <div className="mt-2 text-xs text-purple-200">
                        <p>Forest: 312.4 tCO2e</p>
                        <p>Renewable: 185.7 tCO2e</p>
                      </div>
                    )}
                  </div>
                  <div className="text-4xl">♻️</div>
                </div>
              </div>
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              
              {/* Energy Consumption Chart */}
              <div className="bg-base-100 rounded-2xl p-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-semibold">Daily Energy Consumption</h3>
                  <div className="flex gap-2">
                    <div className="badge badge-outline">📊 {selectedTimeRange}</div>
                    <button 
                      className="btn btn-ghost btn-xs"
                      onClick={() => setNotifications(prev => [...prev, {
                        id: Date.now(),
                        type: 'info',
                        message: 'Energy data refreshed',
                        timestamp: new Date()
                      }])}
                    >
                      🔄
                    </button>
                  </div>
                </div>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={mockEnergyData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="time" />
                    <YAxis />
                    <Tooltip 
                      formatter={(value, name) => [`${value} kWh`, name]}
                      labelFormatter={(label) => `Time: ${label}`}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="training" 
                      stroke="#FF6B6B" 
                      strokeWidth={2} 
                      name="AI Training"
                      dot={{ fill: '#FF6B6B', strokeWidth: 2, r: 4 }}
                      activeDot={{ r: 6, stroke: '#FF6B6B', strokeWidth: 2 }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="inference" 
                      stroke="#4ECDC4" 
                      strokeWidth={2} 
                      name="AI Inference"
                      dot={{ fill: '#4ECDC4', strokeWidth: 2, r: 4 }}
                      activeDot={{ r: 6, stroke: '#4ECDC4', strokeWidth: 2 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              {/* Carbon Sources Pie Chart */}
              <div className="bg-base-100 rounded-2xl p-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-semibold">Carbon Emission Sources</h3>
                  <button 
                    className="btn btn-ghost btn-xs"
                    onClick={() => setNotifications(prev => [...prev, {
                      id: Date.now(),
                      type: 'info',
                      message: 'Carbon data breakdown updated',
                      timestamp: new Date()
                    }])}
                  >
                    📊 Details
                  </button>
          </div>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={mockCarbonData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {mockCarbonData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip 
                      formatter={(value, name) => [`${value}%`, name]}
                    />
                  </PieChart>
                </ResponsiveContainer>
                {showDetailedStats && (
                  <div className="mt-4 grid grid-cols-3 gap-2 text-xs">
                    {mockCarbonData.map((item, index) => (
                      <div key={index} className="flex items-center gap-1">
                        <div className="w-3 h-3 rounded" style={{ backgroundColor: item.color }}></div>
                        <span>{item.name}: {item.value}%</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Carbon Offsets Bar Chart */}
              <div className="bg-base-100 rounded-2xl p-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-semibold">Monthly Carbon Offsets</h3>
                  <div className="flex gap-2">
                    <button 
                      className="btn btn-ghost btn-xs"
                      onClick={() => setNotifications(prev => [...prev, {
                        id: Date.now(),
                        type: 'success',
                        message: 'Viewing offset performance metrics',
                        timestamp: new Date()
                      }])}
                    >
                      📈 Analyze
                    </button>
                  </div>
          </div>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={mockOffsetData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip 
                      formatter={(value, name) => [`${value} tCO2e`, name]}
                      labelFormatter={(label) => `Month: ${label}`}
                    />
                    <Bar 
                      dataKey="purchased" 
                      fill="#8884d8" 
                      name="Purchased"
                      radius={[2, 2, 0, 0]}
                    />
                    <Bar 
                      dataKey="retired" 
                      fill="#82ca9d" 
                      name="Retired"
                      radius={[2, 2, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
                {showDetailedStats && (
                  <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
                    <div className="bg-blue-50 p-3 rounded">
                      <p className="font-medium text-blue-800">Total Purchased</p>
                      <p className="text-lg font-bold text-blue-600">
                        {mockOffsetData.reduce((sum, item) => sum + item.purchased, 0)} tCO2e
                      </p>
                    </div>
                    <div className="bg-green-50 p-3 rounded">
                      <p className="font-medium text-green-800">Total Retired</p>
                      <p className="text-lg font-bold text-green-600">
                        {mockOffsetData.reduce((sum, item) => sum + item.retired, 0)} tCO2e
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Recent Activity */}
              <div className="bg-base-100 rounded-2xl p-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-semibold">Recent Activity</h3>
                  <button 
                    className="btn btn-ghost btn-xs"
                    onClick={() => setNotifications(prev => [...prev, {
                      id: Date.now(),
                      type: 'info',
                      message: 'Refreshing activity feed...',
                      timestamp: new Date()
                    }])}
                  >
                    🔄 Refresh
                  </button>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-3 bg-base-200 rounded-lg hover:bg-base-300 cursor-pointer transition-colors"
                       onClick={() => setNotifications(prev => [...prev, {
                         id: Date.now(),
                         type: 'success',
                         message: 'Viewing NFT details for TJ-2024-001',
                         timestamp: new Date()
                       }])}>
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <div className="flex-1">
                      <p className="font-medium text-sm">New NFT Minted</p>
                      <p className="text-xs text-base-content/70">Training job #TJ-2024-001 • 12.4 kWh</p>
                    </div>
                    <div className="text-xs text-base-content/70">2m ago</div>
                  </div>
                  
                  <div className="flex items-center gap-3 p-3 bg-base-200 rounded-lg hover:bg-base-300 cursor-pointer transition-colors"
                       onClick={() => setNotifications(prev => [...prev, {
                         id: Date.now(),
                         type: 'info',
                         message: 'Opening carbon credit transaction details',
                         timestamp: new Date()
                       }])}>
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <div className="flex-1">
                      <p className="font-medium text-sm">Carbon Credits Purchased</p>
                      <p className="text-xs text-base-content/70">15.2 tCO2e from Verified Project</p>
                    </div>
                    <div className="text-xs text-base-content/70">1h ago</div>
                  </div>
                  
                  <div className="flex items-center gap-3 p-3 bg-base-200 rounded-lg hover:bg-base-300 cursor-pointer transition-colors"
                       onClick={() => setNotifications(prev => [...prev, {
                         id: Date.now(),
                         type: 'info',
                         message: 'Viewing oracle verification details',
                         timestamp: new Date()
                       }])}>
                    <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                    <div className="flex-1">
                      <p className="font-medium text-sm">Oracle Data Verified</p>
                      <p className="text-xs text-base-content/70">Energy consumption validated via TEE</p>
                    </div>
                    <div className="text-xs text-base-content/70">3h ago</div>
                  </div>
                  
                  {showDetailedStats && (
                    <>
                      <div className="flex items-center gap-3 p-3 bg-base-200 rounded-lg hover:bg-base-300 cursor-pointer transition-colors">
                        <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                        <div className="flex-1">
                          <p className="font-medium text-sm">Energy Alert</p>
                          <p className="text-xs text-base-content/70">High consumption detected in cluster-03</p>
                        </div>
                        <div className="text-xs text-base-content/70">5h ago</div>
                      </div>
                      
                      <div className="flex items-center gap-3 p-3 bg-base-200 rounded-lg hover:bg-base-300 cursor-pointer transition-colors">
                        <div className="w-2 h-2 bg-teal-500 rounded-full"></div>
                        <div className="flex-1">
                          <p className="font-medium text-sm">Marketplace Sale</p>
                          <p className="text-xs text-base-content/70">NFT sold for 0.8 SUI tokens</p>
                        </div>
                        <div className="text-xs text-base-content/70">8h ago</div>
                      </div>
                    </>
                  )}
                </div>
          </div>
        </div>

            {/* System Status */}
            <div className="bg-base-100 rounded-2xl p-6">
              <h3 className="text-xl font-semibold mb-6">System Status</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatusCard
                  title="Access Control (RBAC)"
                  status={moduleStatuses.rbac.status}
                  details={moduleStatuses.rbac.details}
                  onTest={testRbac}
                />
                <StatusCard
                  title="Collectors API"
                  status={moduleStatuses.collectors.status}
                  details={moduleStatuses.collectors.details}
                  onTest={testCollectors}
                />
                <StatusCard
                  title="Oracle Network"
                  status={moduleStatuses.oracle.status}
                  details={moduleStatuses.oracle.details}
                  onTest={testOracle}
                />
                <StatusCard
                  title="Sui Network"
                  status={moduleStatuses.sui.status}
                  details={moduleStatuses.sui.details}
                  onTest={testSui}
                />
                <StatusCard
                  title="Seal/Walrus"
                  status={moduleStatuses.seal.status}
                  details={moduleStatuses.seal.details}
                  onTest={testSeal}
                />
                <StatusCard
                  title="Subgraph"
                  status={moduleStatuses.subgraph.status}
                  details={moduleStatuses.subgraph.details}
                  onTest={testSubgraph}
                />
                <StatusCard
                  title="USDC Payments"
                  status={moduleStatuses.usdc.status}
                  details={moduleStatuses.usdc.details}
                  onTest={testUsdc}
                />
                <StatusCard
                  title="Marketplace"
                  status={moduleStatuses.marketplace.status}
                  details={moduleStatuses.marketplace.details}
                  onTest={testMarketplace}
                />
              </div>
              
              <div className="mt-6 flex flex-wrap gap-4">
                <button 
                  className={`btn ${isTestingAll ? 'btn-disabled loading' : 'btn-primary'}`}
                  onClick={testAllSystems}
                  disabled={isTestingAll}
                >
                  {isTestingAll ? 'Testing Systems...' : '🔍 Test All Systems'}
                </button>
                
                <button 
                  className="btn btn-secondary"
                  onClick={() => {
                    setModuleStatuses(Object.fromEntries(
                      Object.keys(moduleStatuses).map(key => [key, { status: 'skip', details: 'Reset' }])
                    ));
                    setNotifications(prev => [...prev, {
                      id: Date.now(),
                      type: 'info',
                      message: 'System status reset',
                      timestamp: new Date()
                    }]);
                  }}
                >
                  🔄 Reset Status
                </button>
                
                <button 
                  className="btn btn-outline"
                  onClick={() => {
                    const statusSummary = Object.entries(moduleStatuses)
                      .map(([key, status]) => `${key}: ${status.status}`)
                      .join(', ');
                    setNotifications(prev => [...prev, {
                      id: Date.now(),
                      type: 'info',
                      message: `System summary: ${statusSummary}`,
                      timestamp: new Date()
                    }]);
                  }}
                >
                  📊 System Summary
                </button>
                
                {showDetailedStats && (
                  <button 
                    className="btn btn-ghost"
                    onClick={() => {
                      const healthyServices = Object.values(moduleStatuses).filter(s => s.status === 'ok').length;
                      const totalServices = Object.keys(moduleStatuses).length;
                      setNotifications(prev => [...prev, {
                        id: Date.now(),
                        type: 'info',
                        message: `Health Score: ${healthyServices}/${totalServices} services operational`,
                        timestamp: new Date()
                      }]);
                    }}
                  >
                    ❤️ Health Score
                  </button>
                )}
              </div>
              </div>
              
            {/* User Info Section */}
            <div className="bg-base-100 rounded-2xl p-6">
              <h3 className="text-xl font-semibold mb-4">Connected User</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <span className="text-sm font-medium text-base-content/70">Sui Address:</span>
                  <p className="font-mono text-sm bg-base-200 p-3 rounded-lg mt-1">
                    {userAddress || 'Not connected'}
                  </p>
                </div>
                <div>
                  <span className="text-sm font-medium text-base-content/70">Max Epoch:</span>
                  <p className="text-sm bg-base-200 p-3 rounded-lg mt-1">
                    {userKeyData?.maxEpoch || 'N/A'}
                  </p>
              </div>
            </div>
          </div>

        </div>
      </div>
      </WithRoleGuard>
    </ProtectedRoute>
  );
}
