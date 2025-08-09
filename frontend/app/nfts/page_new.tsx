"use client";

import React, { useState, useEffect } from "react";
import { ProtectedRoute } from "~~/components/ProtectedRoute";
import { WithRoleGuard } from "~~/providers/withRoleGuard";
import { useAuth } from "~~/context/AuthContext";

// Mock NFT data for demonstration
const mockNFTs = [
  {
    id: "0x1234...abcd",
    jobId: "TJ-2024-001",
    kwhConsumed: 12.4,
    co2Equivalent: 5.8,
    timestamp: "2024-08-09T10:30:00Z",
    organization: "DeepMind Research",
    model: "GPT-4 Training",
    status: "verified",
    carbonOffsets: 5.8,
    image: "/api/placeholder/300/200"
  },
  {
    id: "0x5678...efgh",
    jobId: "TJ-2024-002", 
    kwhConsumed: 8.2,
    co2Equivalent: 3.9,
    timestamp: "2024-08-08T14:15:00Z",
    organization: "OpenAI",
    model: "DALL-E Inference",
    status: "pending",
    carbonOffsets: 0,
    image: "/api/placeholder/300/200"
  },
  {
    id: "0x9abc...ijkl",
    jobId: "TJ-2024-003",
    kwhConsumed: 24.7,
    co2Equivalent: 11.6,
    timestamp: "2024-08-07T09:45:00Z",
    organization: "Google AI",
    model: "BERT Fine-tuning",
    status: "verified",
    carbonOffsets: 11.6,
    image: "/api/placeholder/300/200"
  }
];

const mockMarketplaceNFTs = [
  {
    id: "0xdef0...mnop",
    jobId: "TJ-2024-004",
    kwhConsumed: 15.3,
    co2Equivalent: 7.2,
    price: "0.5 SUI",
    seller: "0xabcd...1234",
    organization: "Microsoft Research",
    model: "GPT-3.5 Training"
  },
  {
    id: "0x1357...qrst",
    jobId: "TJ-2024-005",
    kwhConsumed: 9.8,
    co2Equivalent: 4.6,
    price: "0.3 SUI", 
    seller: "0xefgh...5678",
    organization: "Meta AI",
    model: "LLaMA Inference"
  }
];

export default function NFTsPage() {
  const { userAddress } = useAuth();
  const [activeTab, setActiveTab] = useState<'my-nfts' | 'marketplace' | 'analytics'>('my-nfts');
  const [selectedNFT, setSelectedNFT] = useState<any>(null);
  const [filterStatus, setFilterStatus] = useState<'all' | 'verified' | 'pending'>('all');

  const filteredNFTs = mockNFTs.filter(nft => 
    filterStatus === 'all' || nft.status === filterStatus
  );

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString() + ' ' + new Date(dateString).toLocaleTimeString();
  };

  const getStatusBadge = (status: string) => {
    const colors = {
      verified: 'badge-success',
      pending: 'badge-warning',
      failed: 'badge-error'
    };
    return `badge ${colors[status as keyof typeof colors] || 'badge-neutral'}`;
  };

  return (
    <ProtectedRoute>
      <WithRoleGuard>
        <div className="flex-grow bg-base-300 w-full mt-16 px-8 py-12">
          <div className="max-w-7xl mx-auto">
            
            {/* Header */}
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold mb-2">Carbon-AI Pack NFTs</h1>
              <p className="text-lg text-base-content/70">Manage and trade your verified AI energy consumption NFTs</p>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <div className="bg-base-100 rounded-2xl p-6 text-center">
                <div className="text-3xl font-bold text-primary">{mockNFTs.length}</div>
                <div className="text-sm text-base-content/70">Total NFTs Owned</div>
              </div>
              <div className="bg-base-100 rounded-2xl p-6 text-center">
                <div className="text-3xl font-bold text-success">{mockNFTs.filter(n => n.status === 'verified').length}</div>
                <div className="text-sm text-base-content/70">Verified NFTs</div>
              </div>
              <div className="bg-base-100 rounded-2xl p-6 text-center">
                <div className="text-3xl font-bold text-info">{mockNFTs.reduce((sum, nft) => sum + nft.kwhConsumed, 0).toFixed(1)} kWh</div>
                <div className="text-sm text-base-content/70">Total Energy Tracked</div>
              </div>
              <div className="bg-base-100 rounded-2xl p-6 text-center">
                <div className="text-3xl font-bold text-warning">{mockNFTs.reduce((sum, nft) => sum + nft.carbonOffsets, 0).toFixed(1)} tCO2e</div>
                <div className="text-sm text-base-content/70">Carbon Offsets</div>
              </div>
            </div>

            {/* Tab Navigation */}
            <div className="tabs tabs-boxed mb-6">
              <a 
                className={`tab ${activeTab === 'my-nfts' ? 'tab-active' : ''}`}
                onClick={() => setActiveTab('my-nfts')}
              >
                My NFTs
              </a>
              <a 
                className={`tab ${activeTab === 'marketplace' ? 'tab-active' : ''}`}
                onClick={() => setActiveTab('marketplace')}
              >
                Marketplace
              </a>
              <a 
                className={`tab ${activeTab === 'analytics' ? 'tab-active' : ''}`}
                onClick={() => setActiveTab('analytics')}
              >
                Analytics
              </a>
            </div>

            {/* My NFTs Tab */}
            {activeTab === 'my-nfts' && (
              <div>
                {/* Filters */}
                <div className="flex justify-between items-center mb-6">
                  <div className="flex gap-2">
                    <select 
                      className="select select-bordered select-sm"
                      value={filterStatus}
                      onChange={(e) => setFilterStatus(e.target.value as any)}
                    >
                      <option value="all">All Status</option>
                      <option value="verified">Verified Only</option>
                      <option value="pending">Pending Only</option>
                    </select>
                  </div>
                  <button className="btn btn-primary btn-sm">
                    + Mint New NFT
                  </button>
                </div>

                {/* NFT Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredNFTs.map((nft) => (
                    <div key={nft.id} className="card bg-base-100 shadow-xl">
                      <figure className="px-6 pt-6">
                        <div className="w-full h-40 bg-gradient-to-br from-blue-400 to-purple-600 rounded-xl flex items-center justify-center">
                          <div className="text-white text-center">
                            <div className="text-3xl mb-2">⚡</div>
                            <div className="text-lg font-bold">{nft.kwhConsumed} kWh</div>
                          </div>
                        </div>
                      </figure>
                      <div className="card-body">
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="card-title text-lg">{nft.jobId}</h3>
                          <div className={getStatusBadge(nft.status)}>
                            {nft.status}
                          </div>
                        </div>
                        
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-base-content/70">Model:</span>
                            <span className="font-medium">{nft.model}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-base-content/70">CO2 Equivalent:</span>
                            <span className="font-medium">{nft.co2Equivalent} tCO2e</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-base-content/70">Organization:</span>
                            <span className="font-medium">{nft.organization}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-base-content/70">Date:</span>
                            <span className="font-medium">{formatDate(nft.timestamp)}</span>
                          </div>
                        </div>

                        <div className="card-actions justify-end mt-4">
                          <button 
                            className="btn btn-sm btn-outline"
                            onClick={() => setSelectedNFT(nft)}
                          >
                            View Details
                          </button>
                          {nft.status === 'verified' && (
                            <button className="btn btn-sm btn-primary">
                              List for Sale
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Marketplace Tab */}
            {activeTab === 'marketplace' && (
              <div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {mockMarketplaceNFTs.map((nft) => (
                    <div key={nft.id} className="card bg-base-100 shadow-xl">
                      <figure className="px-6 pt-6">
                        <div className="w-full h-40 bg-gradient-to-br from-green-400 to-blue-600 rounded-xl flex items-center justify-center">
                          <div className="text-white text-center">
                            <div className="text-3xl mb-2">🌱</div>
                            <div className="text-lg font-bold">{nft.kwhConsumed} kWh</div>
                          </div>
                        </div>
                      </figure>
                      <div className="card-body">
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="card-title text-lg">{nft.jobId}</h3>
                          <div className="badge badge-info">{nft.price}</div>
                        </div>
                        
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-base-content/70">Model:</span>
                            <span className="font-medium">{nft.model}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-base-content/70">CO2 Equivalent:</span>
                            <span className="font-medium">{nft.co2Equivalent} tCO2e</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-base-content/70">Seller:</span>
                            <span className="font-mono text-xs">{nft.seller.slice(0, 8)}...{nft.seller.slice(-4)}</span>
                          </div>
                        </div>

                        <div className="card-actions justify-end mt-4">
                          <button className="btn btn-sm btn-outline">
                            View Details
                          </button>
                          <button className="btn btn-sm btn-success">
                            Buy Now
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Analytics Tab */}
            {activeTab === 'analytics' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  
                  {/* Energy Consumption by Model */}
                  <div className="bg-base-100 rounded-2xl p-6">
                    <h3 className="text-xl font-semibold mb-4">Energy Consumption by Model</h3>
                    <div className="space-y-3">
                      {['GPT-4 Training', 'DALL-E Inference', 'BERT Fine-tuning'].map((model, index) => (
                        <div key={model} className="flex items-center justify-between">
                          <span className="text-sm">{model}</span>
                          <div className="flex items-center gap-2">
                            <progress 
                              className="progress progress-primary w-32" 
                              value={[60, 40, 80][index]} 
                              max="100"
                            ></progress>
                            <span className="text-sm font-medium">{[12.4, 8.2, 24.7][index]} kWh</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Carbon Offset Status */}
                  <div className="bg-base-100 rounded-2xl p-6">
                    <h3 className="text-xl font-semibold mb-4">Carbon Offset Status</h3>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span>Total Emissions</span>
                        <span className="font-bold">21.3 tCO2e</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>Offsets Purchased</span>
                        <span className="font-bold text-success">17.4 tCO2e</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>Remaining</span>
                        <span className="font-bold text-warning">3.9 tCO2e</span>
                      </div>
                      <progress className="progress progress-success w-full" value="82" max="100"></progress>
                      <p className="text-sm text-base-content/70">82% of emissions offset</p>
                    </div>
                  </div>

                </div>

                {/* Monthly Trends */}
                <div className="bg-base-100 rounded-2xl p-6">
                  <h3 className="text-xl font-semibold mb-4">Monthly Trends</h3>
                  <div className="overflow-x-auto">
                    <table className="table table-zebra w-full">
                      <thead>
                        <tr>
                          <th>Month</th>
                          <th>NFTs Minted</th>
                          <th>Energy (kWh)</th>
                          <th>CO2 (tCO2e)</th>
                          <th>Offsets</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td>June 2024</td>
                          <td>3</td>
                          <td>45.3</td>
                          <td>21.3</td>
                          <td>17.4</td>
                        </tr>
                        <tr>
                          <td>May 2024</td>
                          <td>2</td>
                          <td>32.1</td>
                          <td>15.1</td>
                          <td>15.1</td>
                        </tr>
                        <tr>
                          <td>April 2024</td>
                          <td>4</td>
                          <td>58.7</td>
                          <td>27.6</td>
                          <td>25.2</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

          </div>

          {/* NFT Details Modal */}
          {selectedNFT && (
            <div className="modal modal-open">
              <div className="modal-box w-11/12 max-w-2xl">
                <h3 className="font-bold text-lg mb-4">NFT Details - {selectedNFT.jobId}</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <div className="w-full h-48 bg-gradient-to-br from-blue-400 to-purple-600 rounded-xl flex items-center justify-center mb-4">
                      <div className="text-white text-center">
                        <div className="text-4xl mb-2">⚡</div>
                        <div className="text-2xl font-bold">{selectedNFT.kwhConsumed} kWh</div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <div>
                      <label className="text-sm font-medium text-base-content/70">NFT ID</label>
                      <p className="font-mono text-sm bg-base-200 p-2 rounded">{selectedNFT.id}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-base-content/70">Job ID</label>
                      <p>{selectedNFT.jobId}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-base-content/70">Model</label>
                      <p>{selectedNFT.model}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-base-content/70">Organization</label>
                      <p>{selectedNFT.organization}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-base-content/70">Status</label>
                      <div className={getStatusBadge(selectedNFT.status)}>
                        {selectedNFT.status}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mt-6">
                  <div className="bg-base-200 p-4 rounded-lg text-center">
                    <div className="text-2xl font-bold text-primary">{selectedNFT.kwhConsumed} kWh</div>
                    <div className="text-sm text-base-content/70">Energy Consumed</div>
                  </div>
                  <div className="bg-base-200 p-4 rounded-lg text-center">
                    <div className="text-2xl font-bold text-warning">{selectedNFT.co2Equivalent} tCO2e</div>
                    <div className="text-sm text-base-content/70">CO2 Equivalent</div>
                  </div>
                </div>

                <div className="modal-action">
                  <button 
                    className="btn"
                    onClick={() => setSelectedNFT(null)}
                  >
                    Close
                  </button>
                  {selectedNFT.status === 'verified' && (
                    <button className="btn btn-primary">
                      List for Sale
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}

        </div>
      </WithRoleGuard>
    </ProtectedRoute>
  );
}
