"use client";

import React, { useEffect, useMemo, useState } from "react";
import { ProtectedRoute } from "~~/components/ProtectedRoute";
import { WithRoleGuard } from "~~/providers/withRoleGuard";
import { useAuth } from "~~/context/AuthContext";
import { currentRole } from "~~/services/rbac/roles";
import { getEnergyNftListings, getMyEnergyNfts, listInKiosk, buyFromKiosk } from "~~/services/suiKiosk";
import { toMist } from "~~/utils/suiMoney";

// Mock marketplace data
const mockListings = [
  {
    id: "listing-1",
    nftId: "0x1234...abcd",
    jobId: "TJ-2024-001",
    model: "GPT-4 Training",
    organization: "DeepMind Research",
    kwhConsumed: 12.4,
    co2Equivalent: 5.8,
    price: "0.5",
    priceUSD: "$1.25",
    seller: "0xabcd...1234",
    listed: "2024-08-09T10:30:00Z",
    verified: true,
    rarity: "rare"
  },
  {
    id: "listing-2", 
    nftId: "0x5678...efgh",
    jobId: "TJ-2024-002",
    model: "DALL-E Inference",
    organization: "OpenAI",
    kwhConsumed: 8.2,
    co2Equivalent: 3.9,
    price: "0.3",
    priceUSD: "$0.75",
    seller: "0xefgh...5678",
    listed: "2024-08-08T14:15:00Z",
    verified: true,
    rarity: "common"
  },
  {
    id: "listing-3",
    nftId: "0x9abc...ijkl", 
    jobId: "TJ-2024-003",
    model: "BERT Fine-tuning",
    organization: "Google AI",
    kwhConsumed: 24.7,
    co2Equivalent: 11.6,
    price: "1.2",
    priceUSD: "$3.00",
    seller: "0x9abc...ijkl",
    listed: "2024-08-07T09:45:00Z",
    verified: true,
    rarity: "epic"
  }
];

const mockMyNFTs = [
  {
    objectId: "0xdef0...mnop",
    jobId: "TJ-2024-004",
    model: "GPT-3.5 Training",
    organization: "Microsoft Research", 
    kwhConsumed: 15.3,
    co2Equivalent: 7.2,
    verified: true
  },
  {
    objectId: "0x2468...qrst",
    jobId: "TJ-2024-005",
    model: "LLaMA Inference", 
    organization: "Meta AI",
    kwhConsumed: 9.8,
    co2Equivalent: 4.6,
    verified: false
  }
];

export default function MarketplacePage() {
  const { userAddress } = useAuth();
  const [role, setRole] = useState<"SIGNER" | "BUYER" | null>(null);
  const [myNfts, setMyNfts] = useState<any[]>(mockMyNFTs);
  const [listings, setListings] = useState<any[]>(mockListings);
  const [price, setPrice] = useState<string>("0.1");
  const [busy, setBusy] = useState<string>("");
  const [activeTab, setActiveTab] = useState<'marketplace' | 'my-assets' | 'activity'>('marketplace');
  const [sortBy, setSortBy] = useState<'price-asc' | 'price-desc' | 'energy-asc' | 'energy-desc' | 'recent'>('recent');
  const [filterBy, setFilterBy] = useState<'all' | 'rare' | 'epic' | 'common'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedNFT, setSelectedNFT] = useState<any>(null);

  const devMintEnabled = String(process.env.NEXT_PUBLIC_RBAC_DEV_MODE || "false") === "true";

  useEffect(() => {
    currentRole().then(setRole);
  }, []);

  useEffect(() => {
    async function load() {
      if (userAddress && role === "SIGNER") {
        try {
          const mine = await getMyEnergyNfts(userAddress);
          setMyNfts([...mockMyNFTs, ...mine]);
        } catch (error) {
          setMyNfts(mockMyNFTs);
        }
      }
      try {
        const { count } = await getEnergyNftListings();
        const realListings = Array.from({ length: count }).map((_, i) => ({ idx: i }));
        setListings([...mockListings, ...realListings]);
      } catch (error) {
        setListings(mockListings);
      }
    }
    load();
  }, [userAddress, role]);

  const filteredAndSortedListings = useMemo(() => {
    let filtered = listings.filter(listing => {
      const matchesSearch = !searchTerm || 
        listing.jobId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        listing.model?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        listing.organization?.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesFilter = filterBy === 'all' || listing.rarity === filterBy;
      
      return matchesSearch && matchesFilter;
    });

    return filtered.sort((a, b) => {
      switch (sortBy) {
        case 'price-asc':
          return parseFloat(a.price || '0') - parseFloat(b.price || '0');
        case 'price-desc':
          return parseFloat(b.price || '0') - parseFloat(a.price || '0');
        case 'energy-asc':
          return (a.kwhConsumed || 0) - (b.kwhConsumed || 0);
        case 'energy-desc':
          return (b.kwhConsumed || 0) - (a.kwhConsumed || 0);
        case 'recent':
        default:
          return new Date(b.listed || 0).getTime() - new Date(a.listed || 0).getTime();
      }
    });
  }, [listings, searchTerm, filterBy, sortBy]);

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'epic': return 'text-purple-500 bg-purple-100';
      case 'rare': return 'text-blue-500 bg-blue-100';
      case 'common': return 'text-green-500 bg-green-100';
      default: return 'text-gray-500 bg-gray-100';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <ProtectedRoute>
      <WithRoleGuard>
        <div className="flex-grow bg-base-300 w-full mt-16 px-8 py-12">
          <div className="max-w-7xl mx-auto">

            {/* Header */}
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold mb-2">Sui Kiosk Marketplace</h1>
              <p className="text-lg text-base-content/70">Trade verified AI energy consumption NFTs</p>
            </div>

            {/* Market Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <div className="bg-base-100 rounded-2xl p-6 text-center">
                <div className="text-3xl font-bold text-primary">{listings.length}</div>
                <div className="text-sm text-base-content/70">Active Listings</div>
              </div>
              <div className="bg-base-100 rounded-2xl p-6 text-center">
                <div className="text-3xl font-bold text-success">2.4 SUI</div>
                <div className="text-sm text-base-content/70">Floor Price</div>
              </div>
              <div className="bg-base-100 rounded-2xl p-6 text-center">
                <div className="text-3xl font-bold text-info">148.2 kWh</div>
                <div className="text-sm text-base-content/70">Total Energy Listed</div>
              </div>
              <div className="bg-base-100 rounded-2xl p-6 text-center">
                <div className="text-3xl font-bold text-warning">24h: +15%</div>
                <div className="text-sm text-base-content/70">Volume Change</div>
              </div>
            </div>

            {/* Tab Navigation */}
            <div className="tabs tabs-boxed mb-6">
              <a 
                className={`tab ${activeTab === 'marketplace' ? 'tab-active' : ''}`}
                onClick={() => setActiveTab('marketplace')}
              >
                Marketplace
              </a>
              <a 
                className={`tab ${activeTab === 'my-assets' ? 'tab-active' : ''}`}
                onClick={() => setActiveTab('my-assets')}
              >
                My Assets
              </a>
              <a 
                className={`tab ${activeTab === 'activity' ? 'tab-active' : ''}`}
                onClick={() => setActiveTab('activity')}
              >
                Activity
              </a>
            </div>

            {/* Marketplace Tab */}
            {activeTab === 'marketplace' && (
              <div>
                {/* Filters and Search */}
                <div className="bg-base-100 rounded-2xl p-6 mb-6">
                  <div className="flex flex-col md:flex-row gap-4 items-center">
                    <div className="flex-1">
                      <input
                        type="text"
                        placeholder="Search by job ID, model, or organization..."
                        className="input input-bordered w-full"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </div>
                    <select 
                      className="select select-bordered"
                      value={filterBy}
                      onChange={(e) => setFilterBy(e.target.value as any)}
                    >
                      <option value="all">All Rarities</option>
                      <option value="common">Common</option>
                      <option value="rare">Rare</option>
                      <option value="epic">Epic</option>
                    </select>
                    <select 
                      className="select select-bordered"
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value as any)}
                    >
                      <option value="recent">Recently Listed</option>
                      <option value="price-asc">Price: Low to High</option>
                      <option value="price-desc">Price: High to Low</option>
                      <option value="energy-asc">Energy: Low to High</option>
                      <option value="energy-desc">Energy: High to Low</option>
                    </select>
                  </div>
                </div>

                {/* NFT Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredAndSortedListings.map((listing) => (
                    <div key={listing.id || listing.idx} className="card bg-base-100 shadow-xl hover:shadow-2xl transition-shadow">
                      <figure className="px-6 pt-6">
                        <div className="w-full h-40 bg-gradient-to-br from-green-400 via-blue-500 to-purple-600 rounded-xl flex items-center justify-center relative">
                          {listing.rarity && (
                            <div className={`absolute top-2 right-2 badge ${getRarityColor(listing.rarity)} badge-sm`}>
                              {listing.rarity}
                            </div>
                          )}
                          <div className="text-white text-center">
                            <div className="text-3xl mb-2">🌱</div>
                            <div className="text-lg font-bold">{listing.kwhConsumed || '0'} kWh</div>
                          </div>
                        </div>
                      </figure>
                      <div className="card-body">
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="card-title text-lg">{listing.jobId || `Listing #${listing.idx}`}</h3>
                          {listing.verified && (
                            <div className="badge badge-success badge-sm">✓ Verified</div>
                          )}
                        </div>
                        
                        <div className="space-y-2 text-sm">
                          {listing.model && (
                            <div className="flex justify-between">
                              <span className="text-base-content/70">Model:</span>
                              <span className="font-medium">{listing.model}</span>
                            </div>
                          )}
                          {listing.co2Equivalent && (
                            <div className="flex justify-between">
                              <span className="text-base-content/70">CO2:</span>
                              <span className="font-medium">{listing.co2Equivalent} tCO2e</span>
                            </div>
                          )}
                          {listing.seller && (
                            <div className="flex justify-between">
                              <span className="text-base-content/70">Seller:</span>
                              <span className="font-mono text-xs">{listing.seller.slice(0, 8)}...{listing.seller.slice(-4)}</span>
                            </div>
                          )}
                        </div>

                        <div className="divider my-2"></div>

                        <div className="flex justify-between items-center">
                          <div>
                            <div className="text-2xl font-bold">{listing.price || '0.1'} SUI</div>
                            {listing.priceUSD && (
                              <div className="text-sm text-base-content/70">{listing.priceUSD}</div>
                            )}
                          </div>
                          <div className="flex gap-2">
                            <button 
                              className="btn btn-sm btn-outline"
                              onClick={() => setSelectedNFT(listing)}
                            >
                              Details
                            </button>
                            <button 
                              className="btn btn-sm btn-success" 
                              disabled={role !== "BUYER" || busy === `buy-${listing.id || listing.idx}`}
                              onClick={async () => {
                                const id = listing.id || listing.idx;
                                setBusy(`buy-${id}`);
                                const ok = await buyFromKiosk({ listingId: String(id) });
                                setBusy("");
                                if (ok.ok) alert(`Bought ${listing.jobId || `Listing #${listing.idx}`}`); 
                                else alert(`Buy failed: ${ok.reason}`);
                              }}
                            >
                              {busy === `buy-${listing.id || listing.idx}` ? 'Buying...' : 'Buy Now'}
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* My Assets Tab */}
            {activeTab === 'my-assets' && role === "SIGNER" && (
              <div>
                <div className="bg-base-100 rounded-2xl p-6 mb-6">
                  <div className="flex justify-between items-center">
                    <h2 className="text-xl font-semibold">My Carbon-AI Pack NFTs</h2>
                    {devMintEnabled && (
                      <button className="btn btn-sm btn-outline" disabled>
                        Mint Sample NFT (dev)
                      </button>
                    )}
                  </div>
                </div>

                {myNfts.length === 0 ? (
                  <div className="bg-base-100 rounded-2xl p-12 text-center">
                    <div className="text-6xl mb-4">🌱</div>
                    <h3 className="text-xl font-semibold mb-2">No NFTs Found</h3>
                    <p className="text-base-content/70">Start by collecting AI energy data to mint your first Carbon-AI Pack NFT.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {myNfts.map(nft => (
                      <div key={nft.objectId} className="card bg-base-100 shadow-xl">
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
                            {nft.verified && (
                              <div className="badge badge-success badge-sm">✓ Verified</div>
                            )}
                          </div>
                          
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span className="text-base-content/70">Model:</span>
                              <span className="font-medium">{nft.model}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-base-content/70">CO2:</span>
                              <span className="font-medium">{nft.co2Equivalent} tCO2e</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-base-content/70">NFT ID:</span>
                              <span className="font-mono text-xs">{nft.objectId.slice(0, 8)}...{nft.objectId.slice(-4)}</span>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 mt-4">
                            <input 
                              className="input input-bordered input-sm flex-1" 
                              placeholder="Price in SUI" 
                              value={price} 
                              onChange={e => setPrice(e.target.value)} 
                            />
                            <button 
                              className="btn btn-primary btn-sm" 
                              disabled={busy === nft.objectId || !nft.verified}
                              onClick={async () => {
                                setBusy(nft.objectId);
                                const ok = await listInKiosk({ nftId: nft.objectId, price: price });
                                setBusy("");
                                if (ok.ok) alert(`Listed ${nft.jobId} at ${price} SUI (~${toMist(price).toString()} MIST)`);
                                else alert(`List failed: ${ok.reason}`);
                              }}
                            >
                              {busy === nft.objectId ? 'Listing...' : 'List'}
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Activity Tab */}
            {activeTab === 'activity' && (
              <div className="bg-base-100 rounded-2xl p-6">
                <h2 className="text-xl font-semibold mb-6">Recent Activity</h2>
                <div className="space-y-4">
                  {[
                    { type: 'sale', nft: 'TJ-2024-001', price: '0.5 SUI', time: '2h ago', buyer: '0xabcd...1234' },
                    { type: 'listing', nft: 'TJ-2024-002', price: '0.3 SUI', time: '4h ago', seller: '0xefgh...5678' },
                    { type: 'sale', nft: 'TJ-2024-003', price: '1.2 SUI', time: '6h ago', buyer: '0x9abc...ijkl' },
                  ].map((activity, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-base-200 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className={`w-3 h-3 rounded-full ${activity.type === 'sale' ? 'bg-success' : 'bg-info'}`}></div>
                        <div>
                          <p className="font-medium">
                            {activity.type === 'sale' ? 'Sale' : 'Listed'}: {activity.nft}
                          </p>
                          <p className="text-sm text-base-content/70">
                            {activity.type === 'sale' ? `Bought by ${activity.buyer}` : `Listed by ${activity.seller}`}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold">{activity.price}</p>
                        <p className="text-sm text-base-content/70">{activity.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>

          {/* NFT Details Modal */}
          {selectedNFT && (
            <div className="modal modal-open">
              <div className="modal-box w-11/12 max-w-2xl">
                <h3 className="font-bold text-lg mb-4">NFT Details - {selectedNFT.jobId || `Listing #${selectedNFT.idx}`}</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <div className="w-full h-48 bg-gradient-to-br from-green-400 via-blue-500 to-purple-600 rounded-xl flex items-center justify-center mb-4">
                      <div className="text-white text-center">
                        <div className="text-4xl mb-2">🌱</div>
                        <div className="text-2xl font-bold">{selectedNFT.kwhConsumed || '0'} kWh</div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <div>
                      <label className="text-sm font-medium text-base-content/70">NFT ID</label>
                      <p className="font-mono text-sm bg-base-200 p-2 rounded">{selectedNFT.nftId || selectedNFT.objectId || 'N/A'}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-base-content/70">Model</label>
                      <p>{selectedNFT.model || 'N/A'}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-base-content/70">Organization</label>
                      <p>{selectedNFT.organization || 'N/A'}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-base-content/70">Price</label>
                      <p className="text-2xl font-bold">{selectedNFT.price || '0.1'} SUI</p>
                    </div>
                  </div>
                </div>

                <div className="modal-action">
                  <button 
                    className="btn"
                    onClick={() => setSelectedNFT(null)}
                  >
                    Close
                  </button>
                  <button className="btn btn-success">
                    Buy Now
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
