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
    image: "/api/placeholder/300/200",
    isListed: false,
    listedPrice: null,
    owner: "0xuser...1234"
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
    image: "/api/placeholder/300/200",
    isListed: false,
    listedPrice: null,
    owner: "0xuser...1234"
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
    image: "/api/placeholder/300/200",
    isListed: true,
    listedPrice: "0.8 SUI",
    owner: "0xuser...1234"
  },
  {
    id: "0xaaaa...bbbb",
    jobId: "TJ-2024-006",
    kwhConsumed: 18.5,
    co2Equivalent: 8.7,
    timestamp: "2024-08-06T11:20:00Z",
    organization: "Anthropic",
    model: "Claude Training",
    status: "verified",
    carbonOffsets: 8.7,
    image: "/api/placeholder/300/200",
    isListed: false,
    listedPrice: null,
    owner: "0xuser...1234"
  }
];

const mockMarketplaceNFTs = [
  {
    id: "0xdef0...mnop",
    jobId: "TJ-2024-004",
    kwhConsumed: 15.3,
    co2Equivalent: 7.2,
    price: "0.5 SUI",
    priceUSD: "$1.25",
    seller: "0xabcd...1234",
    sellerName: "CryptoTrader",
    organization: "Microsoft Research",
    model: "GPT-3.5 Training",
    status: "verified",
    listedDate: "2024-08-08T09:00:00Z",
    views: 24,
    likes: 3
  },
  {
    id: "0x1357...qrst",
    jobId: "TJ-2024-005",
    kwhConsumed: 9.8,
    co2Equivalent: 4.6,
    price: "0.3 SUI",
    priceUSD: "$0.75", 
    seller: "0xefgh...5678",
    sellerName: "AICollector",
    organization: "Meta AI",
    model: "LLaMA Inference",
    status: "verified",
    listedDate: "2024-08-07T14:30:00Z",
    views: 18,
    likes: 5
  },
  {
    id: "0x2468...aceg",
    jobId: "TJ-2024-007",
    kwhConsumed: 31.2,
    co2Equivalent: 14.8,
    price: "1.2 SUI",
    priceUSD: "$3.00",
    seller: "0xijkl...9012",
    sellerName: "GreenTech",
    organization: "Tesla AI",
    model: "Autopilot Training",
    status: "verified",
    listedDate: "2024-08-09T16:45:00Z",
    views: 42,
    likes: 8
  },
  {
    id: "0x1111...2222",
    jobId: "TJ-2024-008",
    kwhConsumed: 6.7,
    co2Equivalent: 3.1,
    price: "0.2 SUI",
    priceUSD: "$0.50",
    seller: "0xmnop...3456",
    sellerName: "EcoMiner",
    organization: "Stability AI",
    model: "Stable Diffusion",
    status: "verified",
    listedDate: "2024-08-06T12:15:00Z",
    views: 15,
    likes: 2
  }
];

// Mock transaction history
const mockTransactionHistory = [
  {
    id: "tx_001",
    type: "purchase",
    nftId: "0x9999...aaaa",
    jobId: "TJ-2024-009",
    price: "0.4 SUI",
    buyer: "0xuser...1234",
    seller: "0xseller...5678",
    timestamp: "2024-08-05T10:30:00Z",
    status: "completed"
  },
  {
    id: "tx_002", 
    type: "sale",
    nftId: "0x8888...bbbb",
    jobId: "TJ-2024-010",
    price: "0.7 SUI",
    buyer: "0xbuyer...9012",
    seller: "0xuser...1234",
    timestamp: "2024-08-03T15:45:00Z",
    status: "completed"
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
  
  // Trading state management
  const [myNFTs, setMyNFTs] = useState(mockNFTs);
  const [marketplaceNFTs, setMarketplaceNFTs] = useState(mockMarketplaceNFTs);
  const [transactionHistory, setTransactionHistory] = useState(mockTransactionHistory);
  const [showListModal, setShowListModal] = useState(false);
  const [showPurchaseModal, setShowPurchaseModal] = useState(false);
  const [selectedNFTForAction, setSelectedNFTForAction] = useState<any>(null);
  const [listingPrice, setListingPrice] = useState('');
  const [isProcessingTransaction, setIsProcessingTransaction] = useState(false);
  const [notifications, setNotifications] = useState<any[]>([]);
  
  // Market filters
  const [marketFilter, setMarketFilter] = useState<'all' | 'low-price' | 'high-energy' | 'recent'>('all');
  const [priceRange, setPriceRange] = useState({ min: '', max: '' });

  // Filter and sort functions
  const filteredNFTs = myNFTs.filter(nft => {
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

  const filteredMarketplaceNFTs = marketplaceNFTs.filter(nft => {
    const matchesSearch = searchTerm === '' || 
      nft.jobId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      nft.organization.toLowerCase().includes(searchTerm.toLowerCase()) ||
      nft.model.toLowerCase().includes(searchTerm.toLowerCase());
    
    const price = parseFloat(nft.price.replace(' SUI', ''));
    const matchesPriceRange = (!priceRange.min || price >= parseFloat(priceRange.min)) &&
                             (!priceRange.max || price <= parseFloat(priceRange.max));
    
    let matchesFilter = true;
    switch (marketFilter) {
      case 'low-price':
        matchesFilter = price <= 0.5;
        break;
      case 'high-energy':
        matchesFilter = nft.kwhConsumed >= 15;
        break;
      case 'recent':
        const listDate = new Date(nft.listedDate);
        const daysDiff = (Date.now() - listDate.getTime()) / (1000 * 60 * 60 * 24);
        matchesFilter = daysDiff <= 2;
        break;
    }
    
    return matchesSearch && matchesPriceRange && matchesFilter;
  }).sort((a, b) => {
    const priceA = parseFloat(a.price.replace(' SUI', ''));
    const priceB = parseFloat(b.price.replace(' SUI', ''));
    return priceA - priceB; // Sort by price ascending
  });

  // Trading functions
  const addNotification = (type: string, message: string) => {
    const newNotification = {
      id: Date.now(),
      type,
      message,
      timestamp: new Date()
    };
    setNotifications(prev => [newNotification, ...prev.slice(0, 4)]);
  };

  const handleListNFT = async (nft: any) => {
    setSelectedNFTForAction(nft);
    setShowListModal(true);
  };

  const confirmListNFT = async () => {
    if (!selectedNFTForAction || !listingPrice) return;
    
    setIsProcessingTransaction(true);
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Update NFT as listed
      setMyNFTs(prev => prev.map(nft => 
        nft.id === selectedNFTForAction.id 
          ? { ...nft, isListed: true, listedPrice: `${listingPrice} SUI` }
          : nft
      ));
      
      // Add to marketplace
      const newMarketplaceListing = {
        ...selectedNFTForAction,
        price: `${listingPrice} SUI`,
        priceUSD: `$${(parseFloat(listingPrice) * 2.5).toFixed(2)}`,
        seller: userAddress || "0xuser...1234",
        sellerName: "You",
        listedDate: new Date().toISOString(),
        views: 0,
        likes: 0
      };
      
      setMarketplaceNFTs(prev => [newMarketplaceListing, ...prev]);
      
      addNotification('success', `NFT ${selectedNFTForAction.jobId} listed for ${listingPrice} SUI`);
      
      setShowListModal(false);
      setListingPrice('');
      setSelectedNFTForAction(null);
    } catch (error) {
      addNotification('error', 'Failed to list NFT. Please try again.');
    } finally {
      setIsProcessingTransaction(false);
    }
  };

  const handlePurchaseNFT = async (nft: any) => {
    setSelectedNFTForAction(nft);
    setShowPurchaseModal(true);
  };

  const confirmPurchaseNFT = async () => {
    if (!selectedNFTForAction) return;
    
    setIsProcessingTransaction(true);
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Remove from marketplace
      setMarketplaceNFTs(prev => prev.filter(nft => nft.id !== selectedNFTForAction.id));
      
      // Add to user's NFTs
      const purchasedNFT = {
        id: selectedNFTForAction.id,
        jobId: selectedNFTForAction.jobId,
        kwhConsumed: selectedNFTForAction.kwhConsumed,
        co2Equivalent: selectedNFTForAction.co2Equivalent,
        timestamp: selectedNFTForAction.timestamp || new Date().toISOString(),
        organization: selectedNFTForAction.organization,
        model: selectedNFTForAction.model,
        status: selectedNFTForAction.status,
        carbonOffsets: selectedNFTForAction.co2Equivalent,
        image: "/api/placeholder/300/200",
        isListed: false,
        listedPrice: null,
        owner: userAddress || "0xuser...1234"
      };
      
      setMyNFTs(prev => [purchasedNFT, ...prev]);
      
      // Add to transaction history
      const newTransaction = {
        id: `tx_${Date.now()}`,
        type: "purchase",
        nftId: selectedNFTForAction.id,
        jobId: selectedNFTForAction.jobId,
        price: selectedNFTForAction.price,
        buyer: userAddress || "0xuser...1234",
        seller: selectedNFTForAction.seller,
        timestamp: new Date().toISOString(),
        status: "completed"
      };
      
      setTransactionHistory(prev => [newTransaction, ...prev]);
      
      addNotification('success', `Successfully purchased ${selectedNFTForAction.jobId} for ${selectedNFTForAction.price}`);
      
      setShowPurchaseModal(false);
      setSelectedNFTForAction(null);
    } catch (error) {
      addNotification('error', 'Purchase failed. Please try again.');
    } finally {
      setIsProcessingTransaction(false);
    }
  };

  const handleUnlistNFT = async (nft: any) => {
    setIsProcessingTransaction(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Update NFT as unlisted
      setMyNFTs(prev => prev.map(n => 
        n.id === nft.id 
          ? { ...n, isListed: false, listedPrice: null }
          : n
      ));
      
      // Remove from marketplace
      setMarketplaceNFTs(prev => prev.filter(n => n.seller !== (userAddress || "0xuser...1234") || n.id !== nft.id));
      
      addNotification('info', `NFT ${nft.jobId} removed from marketplace`);
    } catch (error) {
      addNotification('error', 'Failed to unlist NFT');
    } finally {
      setIsProcessingTransaction(false);
    }
  };

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
            <div className="flex justify-between items-center mb-8">
              <div className="text-center flex-1">
                <h1 className="text-4xl font-bold mb-2">Carbon-AI Pack NFTs</h1>
                <p className="text-lg text-base-content/70">Manage and trade your verified AI energy consumption NFTs</p>
              </div>
              
              {/* Notifications */}
              {notifications.length > 0 && (
                <div className="ml-6">
                  <div className="dropdown dropdown-end">
                    <label tabIndex={0} className="btn btn-ghost btn-circle">
                      <div className="indicator">
                        <span className="text-xl">🔔</span>
                        <span className="badge badge-xs badge-primary indicator-item">{notifications.length}</span>
                      </div>
                    </label>
                    <div tabIndex={0} className="dropdown-content z-[1] card card-compact w-80 p-2 shadow bg-base-100">
                      <div className="card-body">
                        <h3 className="font-bold">Recent Transactions</h3>
                        <div className="space-y-2 max-h-64 overflow-y-auto">
                          {notifications.map((notif) => (
                            <div key={notif.id} className={`alert alert-${notif.type === 'success' ? 'success' : notif.type === 'error' ? 'error' : 'info'} py-2`}>
                              <span className="text-sm">{notif.message}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <div className="bg-base-100 rounded-2xl p-6 text-center hover:shadow-lg transition-shadow cursor-pointer">
                <div className="text-3xl font-bold text-primary">{myNFTs.length}</div>
                <div className="text-sm text-base-content/70">Total NFTs Owned</div>
              </div>
              <div className="bg-base-100 rounded-2xl p-6 text-center hover:shadow-lg transition-shadow cursor-pointer">
                <div className="text-3xl font-bold text-success">{myNFTs.filter(n => n.status === 'verified').length}</div>
                <div className="text-sm text-base-content/70">Verified NFTs</div>
              </div>
              <div className="bg-base-100 rounded-2xl p-6 text-center hover:shadow-lg transition-shadow cursor-pointer">
                <div className="text-3xl font-bold text-info">{myNFTs.reduce((sum, nft) => sum + nft.kwhConsumed, 0).toFixed(1)} kWh</div>
                <div className="text-sm text-base-content/70">Total Energy Tracked</div>
              </div>
              <div className="bg-base-100 rounded-2xl p-6 text-center hover:shadow-lg transition-shadow cursor-pointer">
                <div className="text-3xl font-bold text-warning">{myNFTs.filter(n => n.isListed).length}</div>
                <div className="text-sm text-base-content/70">Listed for Sale</div>
              </div>
            </div>
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
                          {nft.status === 'verified' && !nft.isListed && (
                            <button 
                              className="btn btn-secondary btn-xs"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleListNFT(nft);
                              }}
                            >
                              🏪 List for Sale
                            </button>
                          )}
                          {nft.isListed && (
                            <button 
                              className="btn btn-warning btn-xs"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleUnlistNFT(nft);
                              }}
                            >
                              ❌ Unlist
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
                {/* Market Filters */}
                <div className="bg-base-100 rounded-2xl p-6 mb-6">
                  <div className="flex flex-col md:flex-row gap-4 items-center justify-between mb-4">
                    <h3 className="text-xl font-semibold">🏪 NFT Marketplace</h3>
                    
                    <div className="flex gap-3">
                      <select 
                        className="select select-bordered select-sm"
                        value={marketFilter}
                        onChange={(e) => setMarketFilter(e.target.value as any)}
                      >
                        <option value="all">All NFTs</option>
                        <option value="low-price">💰 Low Price (≤0.5 SUI)</option>
                        <option value="high-energy">⚡ High Energy (≥15 kWh)</option>
                        <option value="recent">🆕 Recently Listed</option>
                      </select>
                      
                      <div className="join">
                        <input 
                          className="input input-bordered join-item input-sm w-20"
                          placeholder="Min"
                          value={priceRange.min}
                          onChange={(e) => setPriceRange(prev => ({ ...prev, min: e.target.value }))}
                        />
                        <span className="btn btn-sm join-item">to</span>
                        <input 
                          className="input input-bordered join-item input-sm w-20"
                          placeholder="Max"
                          value={priceRange.max}
                          onChange={(e) => setPriceRange(prev => ({ ...prev, max: e.target.value }))}
                        />
                        <span className="btn btn-sm join-item">SUI</span>
                      </div>
                    </div>
                  </div>
                  
                  <p className="text-base-content/70">Browse and purchase Carbon-AI Pack NFTs from other users • {filteredMarketplaceNFTs.length} items available</p>
                </div>

                {/* Search Bar for Marketplace */}
                <div className="bg-base-100 rounded-2xl p-4 mb-6">
                  <input 
                    type="text"
                    placeholder="🔍 Search marketplace by job ID, organization, or model..."
                    className="input input-bordered w-full"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>

                {/* Marketplace Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredMarketplaceNFTs.map((nft) => (
                    <div key={nft.id} className="card bg-base-100 shadow-xl hover:shadow-2xl transition-all cursor-pointer group">
                      <div className="card-body">
                        <div className="flex justify-between items-start mb-2">
                          <div className="badge badge-success">Verified</div>
                          <div className="text-xs text-base-content/70">
                            Listed {new Date(nft.listedDate).toLocaleDateString()}
                          </div>
                        </div>
                        
                        <h3 className="card-title text-lg">{nft.jobId}</h3>
                        <p className="text-sm text-base-content/70">{nft.model}</p>
                        <p className="text-sm text-base-content/70">{nft.organization}</p>
                        
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
                        
                        <div className="divider my-2"></div>
                        
                        <div className="flex justify-between items-center">
                          <div>
                            <div className="text-2xl font-bold text-primary">{nft.price}</div>
                            <div className="text-xs text-base-content/70">{nft.priceUSD}</div>
                          </div>
                          <div className="text-xs text-base-content/70">
                            by {nft.sellerName}
                          </div>
                        </div>
                        
                        <div className="flex justify-between items-center mt-2 text-xs text-base-content/70">
                          <span>👁️ {nft.views} views</span>
                          <span>❤️ {nft.likes} likes</span>
                        </div>
                        
                        <div className="card-actions justify-end mt-4">
                          <button 
                            className="btn btn-outline btn-sm"
                            onClick={() => setSelectedNFT(nft)}
                          >
                            View Details
                          </button>
                          <button 
                            className="btn btn-primary btn-sm group-hover:animate-pulse"
                            onClick={() => handlePurchaseNFT(nft)}
                            disabled={isProcessingTransaction}
                          >
                            {isProcessingTransaction ? (
                              <span className="loading loading-spinner loading-xs"></span>
                            ) : (
                              '🛒 Buy Now'
                            )}
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {filteredMarketplaceNFTs.length === 0 && (
                  <div className="text-center py-12">
                    <p className="text-lg text-base-content/70">No NFTs found in marketplace</p>
                    <p className="text-sm text-base-content/70 mt-2">Try adjusting your search or filter criteria</p>
                  </div>
                )}
              </div>
            )}

            {/* Analytics Tab */}
            {activeTab === 'analytics' && (
              <div>
                <div className="bg-base-100 rounded-2xl p-6 mb-6">
                  <h3 className="text-xl font-semibold mb-4">📊 Portfolio Analytics</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
                    <div className="stat bg-primary/10 rounded-lg p-4">
                      <div className="stat-title">Portfolio Value</div>
                      <div className="stat-value text-primary">
                        {myNFTs.filter(n => n.isListed).reduce((sum, nft) => 
                          sum + parseFloat(nft.listedPrice?.replace(' SUI', '') || '0'), 0
                        ).toFixed(1)} SUI
                      </div>
                      <div className="stat-desc">Listed NFTs value</div>
                    </div>
                    
                    <div className="stat bg-success/10 rounded-lg p-4">
                      <div className="stat-title">Carbon Impact</div>
                      <div className="stat-value text-success">
                        {myNFTs.reduce((sum, nft) => sum + nft.co2Equivalent, 0).toFixed(1)} tCO2e
                      </div>
                      <div className="stat-desc">Total emissions tracked</div>
                    </div>
                    
                    <div className="stat bg-info/10 rounded-lg p-4">
                      <div className="stat-title">Energy Tracked</div>
                      <div className="stat-value text-info">
                        {myNFTs.reduce((sum, nft) => sum + nft.kwhConsumed, 0).toFixed(1)} kWh
                      </div>
                      <div className="stat-desc">Across all NFTs</div>
                    </div>
                    
                    <div className="stat bg-warning/10 rounded-lg p-4">
                      <div className="stat-title">Trade Volume</div>
                      <div className="stat-value text-warning">
                        {transactionHistory.length}
                      </div>
                      <div className="stat-desc">Total transactions</div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* NFT Distribution */}
                    <div className="bg-base-200 rounded-lg p-4">
                      <h4 className="font-semibold mb-4">NFT Status Distribution</h4>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="flex items-center gap-2">
                            <div className="w-3 h-3 bg-success rounded-full"></div>
                            Verified
                          </span>
                          <span className="font-bold">{myNFTs.filter(n => n.status === 'verified').length}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="flex items-center gap-2">
                            <div className="w-3 h-3 bg-warning rounded-full"></div>
                            Pending
                          </span>
                          <span className="font-bold">{myNFTs.filter(n => n.status === 'pending').length}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="flex items-center gap-2">
                            <div className="w-3 h-3 bg-primary rounded-full"></div>
                            Listed
                          </span>
                          <span className="font-bold">{myNFTs.filter(n => n.isListed).length}</span>
                        </div>
                      </div>
                    </div>
                    
                    {/* Top Organizations */}
                    <div className="bg-base-200 rounded-lg p-4">
                      <h4 className="font-semibold mb-4">Top Organizations</h4>
                      <div className="space-y-3">
                        {Object.entries(
                          myNFTs.reduce((acc, nft) => {
                            acc[nft.organization] = (acc[nft.organization] || 0) + 1;
                            return acc;
                          }, {} as Record<string, number>)
                        ).slice(0, 4).map(([org, count]) => (
                          <div key={org} className="flex justify-between items-center">
                            <span className="text-sm">{org}</span>
                            <span className="font-bold">{count} NFTs</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Transaction History */}
                <div className="bg-base-100 rounded-2xl p-6">
                  <h4 className="text-lg font-semibold mb-4">📈 Transaction History</h4>
                  
                  {transactionHistory.length > 0 ? (
                    <div className="overflow-x-auto">
                      <table className="table table-zebra w-full">
                        <thead>
                          <tr>
                            <th>Type</th>
                            <th>NFT</th>
                            <th>Price</th>
                            <th>Counterparty</th>
                            <th>Date</th>
                            <th>Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          {transactionHistory.map((tx) => (
                            <tr key={tx.id} className="hover">
                              <td>
                                <div className={`badge ${tx.type === 'purchase' ? 'badge-success' : 'badge-info'}`}>
                                  {tx.type === 'purchase' ? '🛒 Buy' : '💰 Sell'}
                                </div>
                              </td>
                              <td>
                                <div className="font-mono text-sm">{tx.jobId}</div>
                              </td>
                              <td>
                                <div className="font-bold text-primary">{tx.price}</div>
                              </td>
                              <td>
                                <div className="font-mono text-xs">
                                  {tx.type === 'purchase' ? tx.seller : tx.buyer}
                                </div>
                              </td>
                              <td>
                                <div className="text-sm">
                                  {new Date(tx.timestamp).toLocaleDateString()}
                                </div>
                              </td>
                              <td>
                                <div className="badge badge-success">✅ {tx.status}</div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-base-content/70">No transaction history yet</p>
                      <p className="text-sm text-base-content/70">Start trading NFTs to see your history here</p>
                    </div>
                  )}
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
                  
                  {selectedNFT.price && (
                    <div className="mt-4 p-4 bg-primary/10 rounded-lg">
                      <div className="flex justify-between items-center">
                        <span className="font-semibold">Marketplace Price:</span>
                        <span className="text-2xl font-bold text-primary">{selectedNFT.price}</span>
                      </div>
                      {selectedNFT.priceUSD && (
                        <div className="text-sm text-base-content/70">≈ {selectedNFT.priceUSD}</div>
                      )}
                    </div>
                  )}
                  
                  <div className="modal-action">
                    {selectedNFT.price && activeTab === 'marketplace' && (
                      <button 
                        className="btn btn-primary"
                        onClick={() => {
                          setSelectedNFT(null);
                          handlePurchaseNFT(selectedNFT);
                        }}
                      >
                        🛒 Purchase Now
                      </button>
                    )}
                    {!selectedNFT.price && activeTab === 'my-nfts' && selectedNFT.status === 'verified' && !selectedNFT.isListed && (
                      <button 
                        className="btn btn-primary"
                        onClick={() => {
                          setSelectedNFT(null);
                          handleListNFT(selectedNFT);
                        }}
                      >
                        🏪 List on Marketplace
                      </button>
                    )}
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

            {/* List NFT Modal */}
            {showListModal && selectedNFTForAction && (
              <div className="modal modal-open">
                <div className="modal-box">
                  <h3 className="font-bold text-lg mb-4">🏪 List NFT for Sale</h3>
                  
                  <div className="mb-4">
                    <p className="font-semibold">NFT: {selectedNFTForAction.jobId}</p>
                    <p className="text-sm text-base-content/70">{selectedNFTForAction.model}</p>
                    <p className="text-sm text-base-content/70">{selectedNFTForAction.kwhConsumed} kWh • {selectedNFTForAction.co2Equivalent} tCO2e</p>
                  </div>
                  
                  <div className="form-control mb-4">
                    <label className="label">
                      <span className="label-text">Set Price (SUI)</span>
                    </label>
                    <input 
                      type="number"
                      step="0.1"
                      min="0.1"
                      className="input input-bordered"
                      placeholder="e.g., 0.5"
                      value={listingPrice}
                      onChange={(e) => setListingPrice(e.target.value)}
                    />
                    <label className="label">
                      <span className="label-text-alt">
                        {listingPrice && `≈ $${(parseFloat(listingPrice) * 2.5).toFixed(2)} USD`}
                      </span>
                    </label>
                  </div>
                  
                  <div className="bg-warning/10 p-4 rounded-lg mb-4">
                    <p className="text-sm">⚠️ <strong>Listing Fee:</strong> 2.5% of sale price</p>
                    <p className="text-sm">💰 <strong>You'll receive:</strong> {listingPrice ? `${(parseFloat(listingPrice) * 0.975).toFixed(3)} SUI` : '0 SUI'}</p>
                  </div>
                  
                  <div className="modal-action">
                    <button 
                      className="btn btn-primary"
                      onClick={confirmListNFT}
                      disabled={!listingPrice || parseFloat(listingPrice) <= 0 || isProcessingTransaction}
                    >
                      {isProcessingTransaction ? (
                        <>
                          <span className="loading loading-spinner loading-sm"></span>
                          Listing...
                        </>
                      ) : (
                        'Confirm Listing'
                      )}
                    </button>
                    <button 
                      className="btn"
                      onClick={() => {
                        setShowListModal(false);
                        setSelectedNFTForAction(null);
                        setListingPrice('');
                      }}
                      disabled={isProcessingTransaction}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Purchase NFT Modal */}
            {showPurchaseModal && selectedNFTForAction && (
              <div className="modal modal-open">
                <div className="modal-box">
                  <h3 className="font-bold text-lg mb-4">🛒 Purchase NFT</h3>
                  
                  <div className="mb-6">
                    <div className="card bg-base-200">
                      <div className="card-body">
                        <h4 className="card-title text-lg">{selectedNFTForAction.jobId}</h4>
                        <p className="text-sm text-base-content/70">{selectedNFTForAction.model}</p>
                        <p className="text-sm text-base-content/70">{selectedNFTForAction.organization}</p>
                        
                        <div className="grid grid-cols-2 gap-2 mt-2">
                          <div>
                            <span className="text-xs">Energy:</span>
                            <p className="font-bold">{selectedNFTForAction.kwhConsumed} kWh</p>
                          </div>
                          <div>
                            <span className="text-xs">Carbon:</span>
                            <p className="font-bold">{selectedNFTForAction.co2Equivalent} tCO2e</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-primary/10 p-4 rounded-lg mb-4">
                    <div className="flex justify-between items-center mb-2">
                      <span>Price:</span>
                      <span className="text-2xl font-bold text-primary">{selectedNFTForAction.price}</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span>USD Equivalent:</span>
                      <span>{selectedNFTForAction.priceUSD}</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span>Seller:</span>
                      <span>{selectedNFTForAction.sellerName}</span>
                    </div>
                  </div>
                  
                  <div className="bg-info/10 p-4 rounded-lg mb-4">
                    <p className="text-sm">ℹ️ <strong>Transaction includes:</strong></p>
                    <ul className="text-sm mt-1 space-y-1">
                      <li>• NFT ownership transfer</li>
                      <li>• Carbon credit verification</li>
                      <li>• Energy consumption data</li>
                      <li>• Blockchain certificate</li>
                    </ul>
                  </div>
                  
                  <div className="modal-action">
                    <button 
                      className="btn btn-primary"
                      onClick={confirmPurchaseNFT}
                      disabled={isProcessingTransaction}
                    >
                      {isProcessingTransaction ? (
                        <>
                          <span className="loading loading-spinner loading-sm"></span>
                          Processing...
                        </>
                      ) : (
                        `Purchase for ${selectedNFTForAction.price}`
                      )}
                    </button>
                    <button 
                      className="btn"
                      onClick={() => {
                        setShowPurchaseModal(false);
                        setSelectedNFTForAction(null);
                      }}
                      disabled={isProcessingTransaction}
                    >
                      Cancel
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
