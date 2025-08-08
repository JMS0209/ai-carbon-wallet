"use client";

import React, { useEffect, useMemo, useState } from "react";
import { ProtectedRoute } from "~~/components/ProtectedRoute";
import { WithRoleGuard } from "~~/providers/withRoleGuard";
import { useAuth } from "~~/context/AuthContext";
import { currentRole } from "~~/services/rbac/roles";
import { getEnergyNftListings, getMyEnergyNfts } from "~~/services/suiKiosk";

export default function MarketplacePage() {
  const { userAddress } = useAuth();
  const [role, setRole] = useState<"SIGNER" | "BUYER" | null>(null);
  const [myNfts, setMyNfts] = useState<any[]>([]);
  const [listings, setListings] = useState<any[]>([]);
  const devMintEnabled = String(process.env.NEXT_PUBLIC_RBAC_DEV_MODE || "false") === "true";

  useEffect(() => {
    currentRole().then(setRole);
  }, []);

  useEffect(() => {
    async function load() {
      if (userAddress && role === "SIGNER") {
        const mine = await getMyEnergyNfts(userAddress);
        setMyNfts(mine);
      }
      const { count } = await getEnergyNftListings();
      setListings(Array.from({ length: count }).map((_, i) => ({ idx: i })));
    }
    load();
  }, [userAddress, role]);

  return (
    <ProtectedRoute>
      <WithRoleGuard>
        <div className="flex-grow bg-base-300 w-full mt-16 px-8 py-12">
          <div className="max-w-5xl mx-auto">
            <h1 className="text-3xl font-bold mb-6">Sui Kiosk Marketplace</h1>

            {role === "SIGNER" && (
              <div className="mb-10 bg-base-100 rounded-2xl p-6">
                <h2 className="text-xl font-semibold mb-3">My Assets</h2>
                {devMintEnabled && (
                  <button className="btn btn-sm btn-outline mb-4" disabled>
                    Mint sample NFT (dev)
                  </button>
                )}
                {myNfts.length === 0 ? (
                  <div className="text-sm opacity-70">No Carbon-AI Pack NFTs found</div>
                ) : (
                  <ul className="space-y-2">
                    {myNfts.map(n => (
                      <li key={n.objectId} className="flex items-center justify-between bg-base-200 rounded-lg p-3">
                        <div className="font-mono text-sm">{n.objectId}</div>
                        <button className="btn btn-primary btn-sm" disabled>
                          List in Kiosk
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}

            <div className="bg-base-100 rounded-2xl p-6">
              <h2 className="text-xl font-semibold mb-3">Listings</h2>
              {listings.length === 0 ? (
                <div className="text-sm opacity-70">No listings found</div>
              ) : (
                <ul className="space-y-2">
                  {listings.map(x => (
                    <li key={x.idx} className="flex items-center justify-between bg-base-200 rounded-lg p-3">
                      <div>Listing #{x.idx}</div>
                      <button className="btn btn-secondary btn-sm" disabled={role !== "BUYER"}>
                        Buy
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      </WithRoleGuard>
    </ProtectedRoute>
  );
}


