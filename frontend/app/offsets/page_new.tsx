"use client";

import React, { useEffect, useMemo, useState } from "react";
import { ProtectedRoute } from "~~/components/ProtectedRoute";
import { WithRoleGuard } from "~~/providers/withRoleGuard";
import { useAccount } from 'wagmi';
import { getTokenMeta, getBalances, getAllowance, approveIfNeeded, purchaseOffset } from "~~/services/payments";
import { formatUnits } from 'viem';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';

// Mock data for carbon offset projects
const offsetProjects = [
  {
    id: "proj-001",
    name: "Amazon Rainforest Conservation",
    location: "Brazil",
    type: "Forest Conservation",
    pricePerTon: 15,
    available: 10000,
    sold: 2500,
    verifier: "Verra VCS",
    rating: 4.8,
    description: "Protecting 50,000 hectares of Amazon rainforest from deforestation",
    image: "/api/placeholder/400/200"
  },
  {
    id: "proj-002", 
    name: "Solar Farm India",
    location: "Rajasthan, India",
    type: "Renewable Energy",
    pricePerTon: 12,
    available: 15000,
    sold: 8200,
    verifier: "Gold Standard",
    rating: 4.6,
    description: "300MW solar installation providing clean energy to 200,000 homes",
    image: "/api/placeholder/400/200"
  },
  {
    id: "proj-003",
    name: "Methane Capture Farm",
    location: "California, USA", 
    type: "Methane Reduction",
    pricePerTon: 22,
    available: 5000,
    sold: 1800,
    verifier: "Climate Action Reserve",
    rating: 4.9,
    description: "Capturing methane emissions from dairy farms and converting to energy",
    image: "/api/placeholder/400/200"
  }
];

// Mock offset history data
const offsetHistory = [
  { month: 'Jan', purchased: 12.5, retired: 10.2, price: 15 },
  { month: 'Feb', purchased: 18.3, retired: 15.8, price: 16 },
  { month: 'Mar', purchased: 23.1, retired: 20.4, price: 14 },
  { month: 'Apr', purchased: 31.2, retired: 28.9, price: 17 },
  { month: 'May', purchased: 28.7, retired: 25.1, price: 15 },
  { month: 'Jun', purchased: 35.4, retired: 32.8, price: 18 },
];

const offsetTypes = [
  { name: 'Forest Conservation', value: 45, color: '#22C55E' },
  { name: 'Renewable Energy', value: 30, color: '#3B82F6' },
  { name: 'Methane Reduction', value: 15, color: '#8B5CF6' },
  { name: 'Direct Air Capture', value: 10, color: '#F59E0B' },
];

export default function OffsetsPage() {
  const { address } = useAccount();
  const [meta, setMeta] = useState<{ symbol: string; decimals: number } | null>(null);
  const [balance, setBalance] = useState<bigint>(BigInt(0));
  const [allowance, setAllowance] = useState<bigint>(BigInt(0));
  const [amount, setAmount] = useState<string>("10");
  const [jobId, setJobId] = useState<string>(() => `demo-${Date.now()}`);
  const [busy, setBusy] = useState<string>("");
  const [activeTab, setActiveTab] = useState<'projects' | 'portfolio' | 'analytics'>('projects');
  const [selectedProject, setSelectedProject] = useState<any>(null);
  const [offsetAmount, setOffsetAmount] = useState<string>("1.0");

  useEffect(() => {
    (async () => {
      try {
        const m = await getTokenMeta();
        setMeta(m);
        if (address) {
          const b = await getBalances(address);
          setBalance(b.usdcBalance);
          const a = await getAllowance(address);
          setAllowance(a.allowance);
        }
      } catch (e) {
        // ignore read errors
      }
    })();
  }, [address]);

  const totalEmissions = 124.8; // tCO2e
  const totalOffsets = 98.4; // tCO2e
  const offsetPercentage = (totalOffsets / totalEmissions) * 100;

  return (
    <ProtectedRoute>
      <WithRoleGuard>
        <div className="flex-grow bg-base-300 w-full mt-16 px-8 py-12">
          <div className="max-w-7xl mx-auto">
            
            {/* Header */}
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold mb-2">Carbon Offsets</h1>
              <p className="text-lg text-base-content/70">Purchase verified carbon credits to offset your AI energy consumption</p>
            </div>

            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <div className="bg-gradient-to-br from-red-500 to-red-600 text-white rounded-2xl p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-red-100 text-sm font-medium">Total Emissions</p>
                    <p className="text-3xl font-bold">{totalEmissions} tCO2e</p>
                    <p className="text-red-100 text-sm">From AI operations</p>
                  </div>
                  <div className="text-4xl">🏭</div>
                </div>
              </div>
              
              <div className="bg-gradient-to-br from-green-500 to-green-600 text-white rounded-2xl p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-green-100 text-sm font-medium">Offsets Purchased</p>
                    <p className="text-3xl font-bold">{totalOffsets} tCO2e</p>
                    <p className="text-green-100 text-sm">{offsetPercentage.toFixed(1)}% of emissions</p>
                  </div>
                  <div className="text-4xl">🌱</div>
                </div>
              </div>
              
              <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-2xl p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-blue-100 text-sm font-medium">USDC Balance</p>
                    <p className="text-3xl font-bold">{meta ? formatUnits(balance, meta.decimals) : '...'}</p>
                    <p className="text-blue-100 text-sm">{meta?.symbol}</p>
                  </div>
                  <div className="text-4xl">💰</div>
                </div>
              </div>
              
              <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white rounded-2xl p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-purple-100 text-sm font-medium">Avg Price</p>
                    <p className="text-3xl font-bold">$16</p>
                    <p className="text-purple-100 text-sm">per tCO2e</p>
                  </div>
                  <div className="text-4xl">📊</div>
                </div>
              </div>
            </div>

            {/* Tab Navigation */}
            <div className="tabs tabs-boxed mb-6">
              <a 
                className={`tab ${activeTab === 'projects' ? 'tab-active' : ''}`}
                onClick={() => setActiveTab('projects')}
              >
                Offset Projects
              </a>
              <a 
                className={`tab ${activeTab === 'portfolio' ? 'tab-active' : ''}`}
                onClick={() => setActiveTab('portfolio')}
              >
                My Portfolio
              </a>
              <a 
                className={`tab ${activeTab === 'analytics' ? 'tab-active' : ''}`}
                onClick={() => setActiveTab('analytics')}
              >
                Analytics
              </a>
            </div>

            {/* Offset Projects Tab */}
            {activeTab === 'projects' && (
              <div>
                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                  {offsetProjects.map((project) => (
                    <div key={project.id} className="card bg-base-100 shadow-xl">
                      <figure className="px-6 pt-6">
                        <div className="w-full h-40 bg-gradient-to-br from-green-400 to-blue-600 rounded-xl flex items-center justify-center">
                          <div className="text-white text-center">
                            <div className="text-3xl mb-2">
                              {project.type === 'Forest Conservation' ? '🌳' : 
                               project.type === 'Renewable Energy' ? '☀️' : '⚡'}
                            </div>
                            <div className="text-lg font-bold">${project.pricePerTon}/tCO2e</div>
                          </div>
                        </div>
                      </figure>
                      <div className="card-body">
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="card-title text-lg">{project.name}</h3>
                          <div className="flex items-center gap-1">
                            <span className="text-yellow-500">⭐</span>
                            <span className="text-sm">{project.rating}</span>
                          </div>
                        </div>
                        
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-base-content/70">Type:</span>
                            <span className="font-medium">{project.type}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-base-content/70">Location:</span>
                            <span className="font-medium">{project.location}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-base-content/70">Verifier:</span>
                            <span className="font-medium">{project.verifier}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-base-content/70">Available:</span>
                            <span className="font-medium">{project.available.toLocaleString()} tCO2e</span>
                          </div>
                        </div>

                        <div className="mt-4">
                          <div className="flex justify-between text-sm mb-1">
                            <span>Sold</span>
                            <span>{((project.sold / (project.available + project.sold)) * 100).toFixed(1)}%</span>
                          </div>
                          <progress 
                            className="progress progress-success w-full" 
                            value={project.sold} 
                            max={project.available + project.sold}
                          ></progress>
                        </div>

                        <div className="card-actions justify-end mt-4">
                          <button 
                            className="btn btn-sm btn-outline"
                            onClick={() => setSelectedProject(project)}
                          >
                            View Details
                          </button>
                          <button className="btn btn-sm btn-success">
                            Purchase
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Portfolio Tab */}
            {activeTab === 'portfolio' && (
              <div className="space-y-6">
                
                {/* Portfolio Overview */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div className="lg:col-span-2 bg-base-100 rounded-2xl p-6">
                    <h3 className="text-xl font-semibold mb-4">Offset History</h3>
                    <ResponsiveContainer width="100%" height={300}>
                      <LineChart data={offsetHistory}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip />
                        <Line type="monotone" dataKey="purchased" stroke="#3B82F6" strokeWidth={2} name="Purchased" />
                        <Line type="monotone" dataKey="retired" stroke="#22C55E" strokeWidth={2} name="Retired" />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>

                  <div className="bg-base-100 rounded-2xl p-6">
                    <h3 className="text-xl font-semibold mb-4">Offset Breakdown</h3>
                    <ResponsiveContainer width="100%" height={300}>
                      <PieChart>
                        <Pie
                          data={offsetTypes}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, percent }) => `${(percent * 100).toFixed(0)}%`}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {offsetTypes.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* My Offset Certificates */}
                <div className="bg-base-100 rounded-2xl p-6">
                  <h3 className="text-xl font-semibold mb-4">My Offset Certificates</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {[
                      { id: 'CERT-001', project: 'Amazon Rainforest Conservation', amount: 15.2, date: '2024-08-01', status: 'Retired' },
                      { id: 'CERT-002', project: 'Solar Farm India', amount: 22.8, date: '2024-07-15', status: 'Active' },
                      { id: 'CERT-003', project: 'Methane Capture Farm', amount: 8.5, date: '2024-07-01', status: 'Retired' },
                    ].map((cert) => (
                      <div key={cert.id} className="bg-base-200 rounded-lg p-4">
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-semibold">{cert.id}</h4>
                          <div className={`badge badge-sm ${cert.status === 'Retired' ? 'badge-success' : 'badge-info'}`}>
                            {cert.status}
                          </div>
                        </div>
                        <p className="text-sm text-base-content/70 mb-2">{cert.project}</p>
                        <div className="flex justify-between text-sm">
                          <span>{cert.amount} tCO2e</span>
                          <span>{cert.date}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            )}

            {/* Analytics Tab */}
            {activeTab === 'analytics' && (
              <div className="space-y-6">
                
                {/* Impact Summary */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-base-100 rounded-2xl p-6 text-center">
                    <div className="text-4xl mb-2">🌍</div>
                    <div className="text-2xl font-bold">98.4 tCO2e</div>
                    <div className="text-sm text-base-content/70">Total Offsets Retired</div>
                  </div>
                  <div className="bg-base-100 rounded-2xl p-6 text-center">
                    <div className="text-4xl mb-2">🏭</div>
                    <div className="text-2xl font-bold">124.8 tCO2e</div>
                    <div className="text-sm text-base-content/70">AI Emissions Tracked</div>
                  </div>
                  <div className="bg-base-100 rounded-2xl p-6 text-center">
                    <div className="text-4xl mb-2">📈</div>
                    <div className="text-2xl font-bold">78.9%</div>
                    <div className="text-sm text-base-content/70">Carbon Neutral Progress</div>
                  </div>
                </div>

                {/* Price Trends */}
                <div className="bg-base-100 rounded-2xl p-6">
                  <h3 className="text-xl font-semibold mb-4">Average Offset Prices</h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={offsetHistory}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="price" fill="#8884d8" name="Price per tCO2e ($)" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                {/* Environmental Impact */}
                <div className="bg-base-100 rounded-2xl p-6">
                  <h3 className="text-xl font-semibold mb-4">Environmental Impact</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold mb-3">Equivalent Impact</h4>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="flex items-center gap-2">
                            <span>🚗</span>
                            <span>Cars off road for 1 year</span>
                          </span>
                          <span className="font-bold">21</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="flex items-center gap-2">
                            <span>🌳</span>
                            <span>Trees planted</span>
                          </span>
                          <span className="font-bold">2,460</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="flex items-center gap-2">
                            <span>🏠</span>
                            <span>Homes powered for 1 year</span>
                          </span>
                          <span className="font-bold">18</span>
                        </div>
                      </div>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-3">Project Distribution</h4>
                      <div className="space-y-2">
                        {offsetTypes.map((type) => (
                          <div key={type.name} className="flex items-center justify-between">
                            <span className="text-sm">{type.name}</span>
                            <div className="flex items-center gap-2">
                              <progress 
                                className="progress progress-primary w-20" 
                                value={type.value} 
                                max="100"
                              ></progress>
                              <span className="text-sm font-medium">{type.value}%</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

              </div>
            )}

            {/* Legacy USDC Integration Section */}
            <div className="bg-base-100 rounded-2xl p-6 mt-8">
              <h3 className="text-xl font-semibold mb-4">USDC Payment Integration (Dev)</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold mb-3">Read Operations</h4>
                  <div className="space-y-2 text-sm">
                    <div>Token: {meta ? `${meta.symbol} (decimals ${meta.decimals})` : '...'}</div>
                    <div>Balance: {meta ? formatUnits(balance, meta.decimals) : '...'} {meta?.symbol}</div>
                    <div>Allowance: {meta ? formatUnits(allowance, meta.decimals) : '...'} {meta?.symbol}</div>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold mb-3">Actions</h4>
                  <div className="space-y-3">
                    <div className="flex gap-2">
                      <input 
                        className="input input-bordered input-sm flex-1" 
                        placeholder="Amount USDC" 
                        value={amount} 
                        onChange={e => setAmount(e.target.value)} 
                      />
                      <input 
                        className="input input-bordered input-sm flex-1" 
                        placeholder="Job ID" 
                        value={jobId} 
                        onChange={e => setJobId(e.target.value)} 
                      />
                    </div>
                    <div className="flex gap-2">
                      <button 
                        className="btn btn-sm" 
                        disabled={busy === "approve"}
                        onClick={async () => {
                          setBusy("approve");
                          try {
                            await approveIfNeeded({ 
                              owner: address as `0x${string}`, 
                              requiredAmount: BigInt(parseFloat(amount) * Math.pow(10, meta?.decimals || 6))
                            });
                            alert("Approved successfully");
                          } catch (error) {
                            alert(`Failed: ${error}`);
                          }
                          setBusy("");
                        }}
                      >
                        {busy === "approve" ? 'Approving...' : 'Approve'}
                      </button>
                      <button 
                        className="btn btn-primary btn-sm" 
                        disabled={busy === "purchase"}
                        onClick={async () => {
                          setBusy("purchase");
                          try {
                            await purchaseOffset({ 
                              amount: BigInt(parseFloat(amount) * Math.pow(10, meta?.decimals || 6)),
                              carbonCredits: BigInt(parseFloat(amount) * 100), // Mock conversion
                              jobId 
                            });
                            alert("Purchase successful");
                          } catch (error) {
                            alert(`Failed: ${error}`);
                          }
                          setBusy("");
                        }}
                      >
                        {busy === "purchase" ? 'Purchasing...' : 'Purchase Offset'}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* Project Details Modal */}
          {selectedProject && (
            <div className="modal modal-open">
              <div className="modal-box w-11/12 max-w-4xl">
                <h3 className="font-bold text-lg mb-4">{selectedProject.name}</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <div className="w-full h-48 bg-gradient-to-br from-green-400 to-blue-600 rounded-xl flex items-center justify-center mb-4">
                      <div className="text-white text-center">
                        <div className="text-6xl mb-2">
                          {selectedProject.type === 'Forest Conservation' ? '🌳' : 
                           selectedProject.type === 'Renewable Energy' ? '☀️' : '⚡'}
                        </div>
                        <div className="text-2xl font-bold">${selectedProject.pricePerTon}/tCO2e</div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold">Description</h4>
                      <p className="text-sm text-base-content/70">{selectedProject.description}</p>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="font-medium">Type:</span>
                        <p>{selectedProject.type}</p>
                      </div>
                      <div>
                        <span className="font-medium">Location:</span>
                        <p>{selectedProject.location}</p>
                      </div>
                      <div>
                        <span className="font-medium">Verifier:</span>
                        <p>{selectedProject.verifier}</p>
                      </div>
                      <div>
                        <span className="font-medium">Rating:</span>
                        <p className="flex items-center gap-1">
                          <span className="text-yellow-500">⭐</span>
                          {selectedProject.rating}
                        </p>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold mb-2">Purchase Offsets</h4>
                      <div className="flex gap-2">
                        <input 
                          className="input input-bordered input-sm flex-1" 
                          placeholder="Amount (tCO2e)" 
                          value={offsetAmount} 
                          onChange={e => setOffsetAmount(e.target.value)} 
                        />
                        <button className="btn btn-success btn-sm">
                          Buy ${(parseFloat(offsetAmount) * selectedProject.pricePerTon).toFixed(2)}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="modal-action">
                  <button 
                    className="btn"
                    onClick={() => setSelectedProject(null)}
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          )}

        </div>
      </WithRoleGuard>
    </ProtectedRoute>
  );
}
