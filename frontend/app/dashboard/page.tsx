"use client";

import React, { useState, useEffect } from "react";
import { StatCard } from "~~/components/StatCard";
import { StatusCard } from "~~/components/StatusCard";
import { BackendService } from "~~/services/backend";
import { OracleService } from "~~/services/oracle";
import { SuiService } from "~~/services/sui";
import { SealWalrusService } from "~~/services/sealWalrus";
import { SubgraphService } from "~~/services/subgraph";
import { UsdcService } from "~~/services/usdc";

interface ModuleStatus {
  status: 'ok' | 'warn' | 'fail' | 'skip';
  details: string;
}

export default function DashboardPage() {
  const [moduleStatuses, setModuleStatuses] = useState<Record<string, ModuleStatus>>({
    collectors: { status: 'skip', details: 'Not tested yet' },
    oracle: { status: 'skip', details: 'Not tested yet' },
    sui: { status: 'skip', details: 'Not tested yet' },
    seal: { status: 'skip', details: 'Not tested yet' },
    subgraph: { status: 'skip', details: 'Not tested yet' },
    usdc: { status: 'skip', details: 'Not tested yet' },
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
      
      const logEntry = `[${new Date().toISOString()}] usdc ${result.status} ${result.details}`;
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
          <div className="flex flex-col bg-base-100 px-10 py-10 text-center items-center max-w-4xl rounded-3xl">
            <h2 className="text-2xl font-bold mb-6">Connectivity Status</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
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
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
