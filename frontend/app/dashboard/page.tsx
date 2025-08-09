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

interface ModuleStatus {
  status: 'ok' | 'warn' | 'fail' | 'skip';
  details: string;
}

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

  const testCollectors = async () => {
    try {
      const result = await BackendService.testConnection();
      setModuleStatuses(prev => ({
        ...prev,
        collectors: result
      }));
      
      // Log to integration.log
      const logEntry = `[${new Date().toISOString()}] collectors ${result.status} ${result.details}`;
      console.log(logEntry);
      
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
      
      const logEntry = `[${new Date().toISOString()}] oracle ${result.status} ${result.details}`;
      console.log(logEntry);
      
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
      
      const logEntry = `[${new Date().toISOString()}] sui ${result.status} ${result.details}`;
      console.log(logEntry);
      
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
      
      const logEntry = `[${new Date().toISOString()}] seal ${result.status} ${result.details}`;
      console.log(logEntry);
      
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

  const testRbac = async () => {
    try {
      const role = await rbacCurrentRole();
      if (!role) {
        setModuleStatuses(prev => ({ ...prev, rbac: { status: 'skip', details: 'No role set' } }));
        return;
      }
      const seal = await rbacProbeSeal();
      const walrus = await rbacProbeWalrus();
      const ok = seal.servers > 0;
      const details = `role=${role}; seal.servers=${seal.servers}${walrus?.url ? `; walrus=${walrus.ok ? 'ok' : 'unreachable'}` : ''}`;
      setModuleStatuses(prev => ({ ...prev, rbac: { status: ok ? (walrus?.url && !walrus.ok ? 'warn' : 'ok') : 'fail', details } }));
      console.log(`[${new Date().toISOString()}] rbac ${ok ? 'ok' : 'fail'} ${details}`);
    } catch (error) {
      setModuleStatuses(prev => ({ ...prev, rbac: { status: 'fail', details: error instanceof Error ? error.message : 'Unknown error' } }));
    }
  };

  const testMarketplace = async () => {
    try {
      const t0 = Date.now();
      const { count, details } = await getEnergyNftListings();
      const dt = Date.now() - t0;
      const status: 'ok' | 'skip' = count >= 0 ? 'ok' : 'skip';
      const info = `listings=${count}; ${details}; ${dt}ms`;
      setModuleStatuses(prev => ({ ...prev, marketplace: { status, details: info } }));
      console.log(`[${new Date().toISOString()}] MARKETPLACE ${status} ${info}`);
    } catch (e: any) {
      setModuleStatuses(prev => ({ ...prev, marketplace: { status: 'fail', details: e?.message || 'failed' } }));
    }
  };

  const testSubgraph = async () => {
    try {
      const result = await SubgraphService.testConnection();
      setModuleStatuses(prev => ({
        ...prev,
        subgraph: result
      }));
      
      const logEntry = `[${new Date().toISOString()}] subgraph ${result.status} ${result.details}`;
      console.log(logEntry);
      
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
      
      const logEntry = `[${new Date().toISOString()}] PAYMENTS test ${result.status} ${result.details}`;
      console.log(logEntry);
      
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

  return (
    <ProtectedRoute>
      <WithRoleGuard>
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
          <div className="flex flex-col bg-base-100 px-10 py-10 text-center items-center max-w-4xl rounded-3xl">
            <h2 className="text-2xl font-bold mb-6">Connectivity Status</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
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
                title="Sapphire Oracle Relay"
                status={moduleStatuses.oracle.status}
                details={moduleStatuses.oracle.details}
                onTest={testOracle}
              />
              
              <StatusCard
                title="Sui EnergyNFT"
                status={moduleStatuses.sui.status}
                details={moduleStatuses.sui.details}
                onTest={testSui}
              />
              
              <StatusCard
                title="Seal + Walrus"
                status={moduleStatuses.seal.status}
                details={moduleStatuses.seal.details}
                onTest={testSeal}
              />
              
              <StatusCard
                title="The Graph Subgraph"
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
                title="Marketplace (Sui Kiosk)"
                status={moduleStatuses.marketplace.status}
                details={moduleStatuses.marketplace.details}
                onTest={testMarketplace}
              />
            </div>
            
            {/* User Info Section */}
            <div className="mt-8 bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Connected User</h3>
              <div className="space-y-2">
                <div>
                  <span className="text-sm font-medium text-gray-500">Sui Address:</span>
                  <p className="text-sm font-mono text-gray-900 bg-gray-100 p-2 rounded mt-1">
                    {userAddress || 'Not connected'}
                  </p>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-500">Max Epoch:</span>
                  <p className="text-sm text-gray-700">
                    {userKeyData?.maxEpoch || 'N/A'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      </WithRoleGuard>
    </ProtectedRoute>
  );
}
