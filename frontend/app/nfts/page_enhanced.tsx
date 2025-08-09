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
  const [selectedNFTs, setSelectedNFTs] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<'date' | 'energy' | 'carbon'>('date');
  const [searchTerm, setSearchTerm] = useState('');
  const [showBulkActions, setShowBulkActions] = useState(false);

  const filteredNFTs = mockNFTs.filter(nft => {
    const matchesFilter = filterStatus === 'all' || nft.status === filterStatus;
    const matchesSearch = searchTerm === '' || 
      nft.jobId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      nft.organization.toLowerCase().includes(searchTerm.toLowerCase()) ||
      nft.model.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  }).sort((a, b) => {
    switch (sortBy) {
      case 'energy':
        return b.kwhConsumed - a.kwhConsumed;
      case 'carbon':
        return b.co2Equivalent - a.co2Equivalent;
      case 'date':
      default:
        return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
    }
  });

  const handleNFTSelect = (nftId: string) => {
    setSelectedNFTs(prev => 
      prev.includes(nftId) 
        ? prev.filter(id => id !== nftId)
        : [...prev, nftId]
    );
  };

  const handleBulkAction = (action: string) => {
    switch (action) {
      case 'list':
        alert(`Listing ${selectedNFTs.length} NFTs on marketplace`);
        break;
      case 'transfer':
        alert(`Transferring ${selectedNFTs.length} NFTs`);
        break;
      case 'offset':
        alert(`Purchasing offsets for ${selectedNFTs.length} NFTs`);
        break;
    }
    setSelectedNFTs([]);
    setShowBulkActions(false);
  };

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
              <div className="bg-base-100 rounded-2xl p-6 text-center hover:shadow-lg transition-shadow cursor-pointer">
                <div className="text-3xl font-bold text-primary">{mockNFTs.length}</div>
                <div className="text-sm text-base-content/70">Total NFTs Owned</div>
              </div>
              <div className="bg-base-100 rounded-2xl p-6 text-center hover:shadow-lg transition-shadow cursor-pointer">
                <div className="text-3xl font-bold text-success">{mockNFTs.filter(n => n.status === 'verified').length}</div>
                <div className="text-sm text-base-content/70">Verified NFTs</div>
              </div>
              <div className="bg-base-100 rounded-2xl p-6 text-center hover:shadow-lg transition-shadow cursor-pointer">
                <div className="text-3xl font-bold text-info">{mockNFTs.reduce((sum, nft) => sum + nft.kwhConsumed, 0).toFixed(1)} kWh</div>
                <div className="text-sm text-base-content/70">Total Energy Tracked</div>
              </div>
              <div className="bg-base-100 rounded-2xl p-6 text-center hover:shadow-lg transition-shadow cursor-pointer">
                <div className="text-3xl font-bold text-warning">{mockNFTs.reduce((sum, nft) => sum + nft.carbonOffsets, 0).toFixed(1)} tCO2e</div>
                <div className="text-sm text-base-content/70">Carbon Offsets</div>
              </div>
            </div>

            {/* Tab Navigation */}
            <div className="tabs tabs-boxed mb-6 justify-center">
              <a 
                className={`tab ${activeTab === 'my-nfts' ? 'tab-active' : ''}`}
                onClick={() => setActiveTab('my-nfts')}
              >
                📦 My NFTs
              </a>
              <a 
                className={`tab ${activeTab === 'marketplace' ? 'tab-active' : ''}`}
                onClick={() => setActiveTab('marketplace')}
              >
                🏪 Marketplace
              </a>
              <a 
                className={`tab ${activeTab === 'analytics' ? 'tab-active' : ''}`}
                onClick={() => setActiveTab('analytics')}
              >
                📊 Analytics
              </a>
            </div>

            {/* My NFTs Tab */}
            {activeTab === 'my-nfts' && (
              <div>
                {/* Search and Filters */}
                <div className="bg-base-100 rounded-2xl p-6 mb-6">
                  <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                    {/* Search */}
                    <div className="flex-1 max-w-md">
                      <div className="form-control">
                        <label className="label">
                          <span className="label-text">🔍 Search NFTs</span>
                        </label>
                        <input 
                          type="text"
                          placeholder="Search by job ID, organization, or model..."
                          className="input input-bordered w-full"
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                        />
                      </div>
                    </div>
                    
                    {/* Filters and Sort */}
                    <div className="flex gap-3">
                      <div className="form-control">
                        <label className="label">
                          <span className="label-text">Status</span>
                        </label>
                        <select 
                          className="select select-bordered select-sm"
                          value={filterStatus}
                          onChange={(e) => setFilterStatus(e.target.value as any)}
                        >
                          <option value="all">All Status</option>
                          <option value="verified">✅ Verified</option>
                          <option value="pending">⏳ Pending</option>
                        </select>
                      </div>
                      
                      <div className="form-control">
                        <label className="label">
                          <span className="label-text">Sort By</span>
                        </label>
                        <select 
                          className="select select-bordered select-sm"
                          value={sortBy}
                          onChange={(e) => setSortBy(e.target.value as any)}
                        >
                          <option value="date">📅 Date</option>
                          <option value="energy">⚡ Energy</option>
                          <option value="carbon">🌱 Carbon</option>
                        </select>
                      </div>
                      
                      <div className="form-control">
                        <label className="label">
                          <span className="label-text">Actions</span>
                        </label>
                        <button 
                          className={`btn btn-sm ${selectedNFTs.length > 0 ? 'btn-primary' : 'btn-disabled'}`}
                          onClick={() => setShowBulkActions(!showBulkActions)}
                          disabled={selectedNFTs.length === 0}
                        >
                          📋 Bulk ({selectedNFTs.length})
                        </button>
                      </div>
                    </div>
                  </div>
                  
                  {/* Bulk Actions Panel */}
                  {showBulkActions && selectedNFTs.length > 0 && (
                    <div className="mt-4 p-4 bg-primary/10 rounded-lg">
                      <p className="text-sm mb-3">Selected {selectedNFTs.length} NFT(s):</p>
                      <div className="flex gap-2">
                        <button 
                          className="btn btn-sm btn-outline"
                          onClick={() => handleBulkAction('list')}
                        >
                          🏪 List on Marketplace
                        </button>
                        <button 
                          className="btn btn-sm btn-outline"
                          onClick={() => handleBulkAction('transfer')}
                        >
                          📤 Transfer
                        </button>
                        <button 
                          className="btn btn-sm btn-outline"
                          onClick={() => handleBulkAction('offset')}
                        >
                          ♻️ Purchase Offsets
                        </button>
                        <button 
                          className="btn btn-sm btn-ghost"
                          onClick={() => {
                            setSelectedNFTs([]);
                            setShowBulkActions(false);
                          }}
                        >
                          ❌ Cancel
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* NFT Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredNFTs.map((nft) => (
                    <div 
                      key={nft.id} 
                      className={`card bg-base-100 shadow-xl hover:shadow-2xl transition-shadow cursor-pointer ${selectedNFTs.includes(nft.id) ? 'ring-2 ring-primary' : ''}`}
                      onClick={() => setSelectedNFT(nft)}
                    >
                      <div className="card-body">
                        {/* Selection Checkbox */}
                        <div className="flex justify-between items-start mb-2">
                          <div className="form-control">
                            <label className="cursor-pointer label">
                              <input 
                                type="checkbox" 
                                className="checkbox checkbox-sm"
                                checked={selectedNFTs.includes(nft.id)}
                                onChange={() => handleNFTSelect(nft.id)}
                                onClick={(e) => e.stopPropagation()}
                              />
                            </label>
                          </div>
                          <div className={getStatusBadge(nft.status)}>
                            {nft.status}
                          </div>
                        </div>

                        <h3 className="card-title text-sm">{nft.jobId}</h3>
                        <p className="text-xs text-base-content/70">{nft.model}</p>
                        <p className="text-xs text-base-content/70">{nft.organization}</p>
                        
                        <div className="grid grid-cols-2 gap-2 mt-4">
                          <div className="stat">
                            <div className="stat-title text-xs">Energy</div>
                            <div className="stat-value text-sm">{nft.kwhConsumed} kWh</div>
                          </div>
                          <div className="stat">
                            <div className="stat-title text-xs">Carbon</div>
                            <div className="stat-value text-sm">{nft.co2Equivalent} tCO2e</div>
                          </div>
                        </div>
                        
                        <div className="card-actions justify-end mt-4">
                          <button 
                            className="btn btn-primary btn-xs"
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedNFT(nft);
                            }}
                          >
                            View Details
                          </button>
                          {nft.status === 'verified' && (
                            <button 
                              className="btn btn-secondary btn-xs"
                              onClick={(e) => {
                                e.stopPropagation();
                                alert(`Listing NFT ${nft.jobId} on marketplace`);
                              }}
                            >
                              List for Sale
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {filteredNFTs.length === 0 && (
                  <div className="text-center py-12">
                    <p className="text-lg text-base-content/70">No NFTs found matching your criteria</p>
                    <button className="btn btn-primary mt-4">Mint Your First NFT</button>
                  </div>
                )}
              </div>
            )}

            {/* Marketplace Tab */}
            {activeTab === 'marketplace' && (
              <div>
                <div className="bg-base-100 rounded-2xl p-6 mb-6">
                  <h3 className="text-xl font-semibold mb-4">🏪 NFT Marketplace</h3>
                  <p className="text-base-content/70 mb-4">Browse and purchase Carbon-AI Pack NFTs from other users</p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {mockMarketplaceNFTs.map((nft) => (
                      <div key={nft.id} className="card bg-base-100 shadow-xl hover:shadow-2xl transition-shadow">
                        <div className="card-body">
                          <h3 className="card-title">{nft.jobId}</h3>
                          <p className="text-sm text-base-content/70">{nft.model}</p>
                          <p className="text-sm text-base-content/70">{nft.organization}</p>
                          
                          <div className="grid grid-cols-2 gap-2 mt-4">
                            <div className="stat">
                              <div className="stat-title text-xs">Energy</div>
                              <div className="stat-value text-sm">{nft.kwhConsumed} kWh</div>
                            </div>
                            <div className="stat">
                              <div className="stat-title text-xs">Price</div>
                              <div className="stat-value text-sm text-primary">{nft.price}</div>
                            </div>
                          </div>
                          
                          <div className="card-actions justify-end mt-4">
                            <button 
                              className="btn btn-primary btn-sm"
                              onClick={() => alert(`Purchasing NFT ${nft.jobId} for ${nft.price}`)}
                            >
                              Purchase
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Analytics Tab */}
            {activeTab === 'analytics' && (
              <div>
                <div className="bg-base-100 rounded-2xl p-6">
                  <h3 className="text-xl font-semibold mb-4">📊 Portfolio Analytics</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="stat bg-primary/10 rounded-lg p-4">
                      <div className="stat-title">Portfolio Value</div>
                      <div className="stat-value text-primary">2.4 SUI</div>
                      <div className="stat-desc">Estimated market value</div>
                    </div>
                    
                    <div className="stat bg-success/10 rounded-lg p-4">
                      <div className="stat-title">Carbon Impact</div>
                      <div className="stat-value text-success">21.3 tCO2e</div>
                      <div className="stat-desc">Total emissions tracked</div>
                    </div>
                    
                    <div className="stat bg-info/10 rounded-lg p-4">
                      <div className="stat-title">Energy Tracked</div>
                      <div className="stat-value text-info">45.3 kWh</div>
                      <div className="stat-desc">Across all NFTs</div>
                    </div>
                  </div>
                  
                  <div className="mt-6">
                    <h4 className="text-lg font-semibold mb-4">Recent Activity</h4>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center p-3 bg-base-200 rounded-lg">
                        <span>NFT Minted: TJ-2024-001</span>
                        <span className="text-xs text-base-content/70">2 hours ago</span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-base-200 rounded-lg">
                        <span>Offset Purchased: 5.8 tCO2e</span>
                        <span className="text-xs text-base-content/70">1 day ago</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* NFT Details Modal */}
            {selectedNFT && (
              <div className="modal modal-open">
                <div className="modal-box w-11/12 max-w-2xl">
                  <h3 className="font-bold text-lg mb-4">NFT Details: {selectedNFT.jobId}</h3>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="font-semibold">Organization:</p>
                      <p>{selectedNFT.organization}</p>
                    </div>
                    <div>
                      <p className="font-semibold">Model:</p>
                      <p>{selectedNFT.model}</p>
                    </div>
                    <div>
                      <p className="font-semibold">Energy Consumed:</p>
                      <p>{selectedNFT.kwhConsumed} kWh</p>
                    </div>
                    <div>
                      <p className="font-semibold">CO2 Equivalent:</p>
                      <p>{selectedNFT.co2Equivalent} tCO2e</p>
                    </div>
                    <div>
                      <p className="font-semibold">Timestamp:</p>
                      <p>{formatDate(selectedNFT.timestamp)}</p>
                    </div>
                    <div>
                      <p className="font-semibold">Status:</p>
                      <div className={getStatusBadge(selectedNFT.status)}>
                        {selectedNFT.status}
                      </div>
                    </div>
                  </div>
                  
                  <div className="modal-action">
                    <button 
                      className="btn btn-primary"
                      onClick={() => alert(`Listing ${selectedNFT.jobId} on marketplace`)}
                    >
                      List on Marketplace
                    </button>
                    <button 
                      className="btn"
                      onClick={() => setSelectedNFT(null)}
                    >
                      Close
                    </button>
                  </div>
                </div>
              </div>
            )}

          </div>
        </div>
      </WithRoleGuard>
    </ProtectedRoute>
  );
}
