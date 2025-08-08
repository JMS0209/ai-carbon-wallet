"use client";

import React from "react";
import { StatCard } from "~~/components/StatCard";

export default function DashboardPage() {
  return (
    <>
      <div className="flex-grow bg-base-300 w-full mt-16 px-8 py-12">
        <div className="flex justify-center items-center gap-12 flex-col sm:flex-row">
          <div className="flex flex-col bg-base-100 px-10 py-10 text-center items-center max-w-xs rounded-3xl">
            <StatCard
              title="Energy Tracking"
              value="0.00 kWh"
              subtitle="Real-time AI energy consumption"
              icon="⚡"
            />
          </div>
          <div className="flex flex-col bg-base-100 px-10 py-10 text-center items-center max-w-xs rounded-3xl">
            <StatCard
              title="Carbon NFTs"
              value="0"
              subtitle="Carbon-AI Pack NFTs minted"
              icon="🌱"
            />
          </div>
          <div className="flex flex-col bg-base-100 px-10 py-10 text-center items-center max-w-xs rounded-3xl">
            <StatCard
              title="Offsets Retired"
              value="0.00 tCO2e"
              subtitle="Total carbon offsets retired"
              icon="♻️"
            />
          </div>
        </div>

        <div className="flex justify-center items-center gap-12 flex-col sm:flex-row mt-8">
          <div className="flex flex-col bg-base-100 px-10 py-10 text-center items-center max-w-2xl rounded-3xl">
            <h2 className="text-2xl font-bold mb-6">Integration Status</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Energy Collectors</h3>
                <ul className="space-y-2 text-sm">
                  <li>• CodeCarbon - Ready for integration</li>
                  <li>• MELODI - Ready for integration</li>
                  <li>• EcoLogits - Ready for integration</li>
                  <li>• Slurm acct_gather_energy - Ready for integration</li>
                </ul>
              </div>
              
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Blockchain Infrastructure</h3>
                <ul className="space-y-2 text-sm">
                  <li>• Sui Move contracts - Deployed</li>
                  <li>• Sapphire Oracle - Ready</li>
                  <li>• Ethereum L2 payments - Ready</li>
                  <li>• The Graph subgraph - Configured</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
